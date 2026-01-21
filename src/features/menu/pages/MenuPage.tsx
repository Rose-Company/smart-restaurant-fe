import React, { useState, useEffect, act } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/misc/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/navigation/tabs";
import { MenuFilterBar } from "../components/MenuFilterBar";
import { MenuTable } from "../components/MenuTable";
import { AddMenuItemDialog } from "../components/dialogs/AddMenuItemDialog";
import { EditMenuItemDialog } from "../components/dialogs/EditMenuItemDialog";
import { CategoriesPage } from "../categories/pages/CategoriesPage";
import { ModifiersPage } from "../modifiers/pages/ModifiersPage";
import { AddModifierGroupDialog } from "../modifiers/components/dialogs/AddModifierGroupDialog";
import { categoryApi } from "../categories/services/category.api";
import { modifierGroupApi } from "../modifiers/services/modifier.api";
import type { MenuItem } from "../types/menu.types";
import type {
  ModifierSelectionType,
  ModifierOption,
  ModifierGroup,
  ModifierStatus,
} from "../modifiers/types/modifier.types";
import { menuItemApi } from "../services/menu.api";
import { Category, CategoryFormData } from "../categories/types/category.types";

// Brand color constant
const BRAND_COLOR = "#27ae60";
const BRAND_COLOR_HOVER = "#229954";

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all-items");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddModifierGroupDialog, setShowAddModifierGroupDialog] =
    useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  //Category
  const [categories, setCategories] = useState<Array<Category>>([]);

  //Modifier
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(total / itemsPerPage);

  const mapMenuItem = (raw: any): MenuItem => ({
    id: raw.id,
    name: raw.name,
    category: raw.category,
    price: raw.price,
    status: raw.status,
    lastUpdate: raw.last_update,
    chefRecommended: raw.chef_recommended,
    imageUrl: raw.image_url,
    description: raw.description,
    preparationTime: raw.preparation_time,
  });

  const mapDetailToMenuItem = (raw: any): MenuItem => {
    const primaryImage =
      raw.images?.find((img: any) => img.is_primary) || raw.images?.[0];
    return {
      id: raw.id,
      name: raw.name,
      category: raw.category?.name || raw.category || "",
      price: raw.price,
      status: raw.status,
      lastUpdate:
        raw.last_update ||
        raw.updated_at ||
        new Date().toISOString().split("T")[0],
      chefRecommended: raw.chef_recommended || false,
      imageUrl: primaryImage?.url || raw.image_url || "",
      description: raw.description || "",
      preparationTime: raw.preparation_time || 0,
      images:
        raw.images?.map((img: any) => ({
          id: String(img.id || img.url),
          url: img.url,
          isPrimary: img.is_primary || false,
        })) ||
        (primaryImage
          ? [
              {
                id: "primary",
                url: primaryImage.url,
                isPrimary: true,
              },
            ]
          : []),
      modifiers:
        raw.modifiers?.map((mod: any) => ({
          id: String(mod.id || mod.modifier_group_id),
          name: mod.name || mod.modifier_group?.name || "",
          required: mod.required || mod.is_required || false,
          selectionType: mod.selection_type === "single" ? "Single" : "Multi",
        })) || [],
    };
  };

  // Centralized function to load menu items
  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const res = await menuItemApi.list({
        page: currentPage,
        page_size: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort:
          sortBy === "price-asc"
            ? "price_asc"
            : sortBy === "price-desc"
            ? "price_desc"
            : sortBy === "name"
            ? "name"
            : undefined,
      });
      const data = res.data;
      setItems(data.items.map(mapMenuItem));
      setTotal(data.total);
    } catch (err) {
      console.error("Error loading menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  //Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoryApi.list();
      setCategories(cats);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  //Load modifier group
  useEffect(() => {
    loadModifierGroups();
  }, []);

  const loadModifierGroups = async () => {
    try {
      const groups = await modifierGroupApi.list();
      setModifierGroups(groups);
    } catch (err) {
      console.error("Error loading modifier groups: ", err);
    }
  };

  // Modifier Group Handlers
  const handleAddModifierGroup = async (groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    is_required: boolean;
    options: ModifierOption[];
  }) => {
    try {
      const newGroup = await modifierGroupApi.create({
        name: groupData.name,
        description: groupData.description,
        selection_type: groupData.selectionType,
        is_required: groupData.is_required,
        status: "active",
      });

      if (!newGroup || !newGroup.id) {
        throw new Error("Failed to create modifier group: Invalid response");
      }

      for (const option of groupData.options) {
        const trimmedName = (option.name || "").trim();
        if (!trimmedName) {
          console.warn("Skipping option with empty name:", option);
          continue;
        }

        const optionStatus =
          option.status &&
          (option.status === "active" || option.status === "inactive")
            ? option.status
            : "active";

        const requestData = {
          name: trimmedName,
          price_adjustment: option.priceAdjustment || 0,
          status: optionStatus,
        };

        console.log("Creating option with data:", requestData);

        await modifierGroupApi.addOption(newGroup.id, requestData);
      }

      await loadModifierGroups();
      setShowAddModifierGroupDialog(false);
    } catch (err) {
      throw err; // Re-throw to be handled by the component
    }
  };

  const handleUpdateModifierGroup = async (
    id: number,
    updatedGroupData: {
      name: string;
      description: string;
      selectionType: ModifierSelectionType;
      is_required: boolean;
      status: ModifierStatus;
      options: ModifierOption[];
    }
  ) => {
    try {
      const currentGroup = modifierGroups.find((g) => g.id === id);
      await modifierGroupApi.update(id, {
        name: updatedGroupData.name,
        description: updatedGroupData.description,
        selection_type: updatedGroupData.selectionType,
        is_required: updatedGroupData.is_required,
        min_selections: 0,
        max_selections: updatedGroupData.selectionType === "single" ? 1 : 999,
        display_order: 0,
        status: updatedGroupData.status,
      });

      if (currentGroup) {
        const existingOptions = currentGroup.options;
        const updatedOptions = updatedGroupData.options;

        const existingOptionIds = new Set(
          existingOptions
            .map((opt) => Number(opt.id))
            .filter((id) => !isNaN(id))
        );

        const updatedOptionIds = new Set(
          updatedOptions.map((opt) => Number(opt.id)).filter((id) => !isNaN(id))
        );

        const newOptions = updatedOptions.filter((opt) => {
          const optId = Number(opt.id);
          return isNaN(optId) || !existingOptionIds.has(optId);
        });

        const optionsToDelete = existingOptions.filter((opt) => {
          const optId = Number(opt.id);
          return !isNaN(optId) && !updatedOptionIds.has(optId);
        });

        // Update existing options
        for (const option of existingOptions) {
          const optId = Number(option.id);
          if (!isNaN(optId) && updatedOptionIds.has(optId)) {
            const updatedOption = updatedOptions.find(
              (opt) => Number(opt.id) === optId
            );
            if (updatedOption) {
              const trimmedName = updatedOption.name.trim();
              if (
                trimmedName &&
                (trimmedName !== option.name ||
                  updatedOption.priceAdjustment !== option.priceAdjustment ||
                  updatedOption.status !== option.status)
              ) {
                await modifierGroupApi.updateOption(optId, {
                  name: trimmedName,
                  price_adjustment: updatedOption.priceAdjustment,
                  status: updatedOption.status || "active",
                });
              }
            }
          }
        }

        // Delete removed options
        for (const option of optionsToDelete) {
          const optId = Number(option.id);
          if (!isNaN(optId)) {
            await modifierGroupApi.deleteOption(optId);
          }
        }

        // Add new options
        for (const option of newOptions) {
          const trimmedName = (option.name || "").trim();
          if (!trimmedName) {
            console.warn("Skipping option with empty name:", option);
            continue;
          }

          const optionStatus =
            option.status &&
            (option.status === "active" || option.status === "inactive")
              ? option.status
              : "active";

          const requestData = {
            name: trimmedName,
            price_adjustment: option.priceAdjustment || 0,
            status: optionStatus,
          };
          await modifierGroupApi.addOption(id, requestData);
        }
      }

      await loadModifierGroups();
    } catch (err) {
      throw err; // Re-throw to be handled by the component
    }
  };

  const handleDeleteModifierGroup = async (id: number) => {
    try {
      await modifierGroupApi.delete(id);
      await loadModifierGroups();
    } catch (err) {
      throw err; // Re-throw to be handled by the component
    }
  };

  // Load menu items when filters or pagination changes
  useEffect(() => {
    loadMenuItems();
  }, [currentPage, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  const handleAddNewItem = () => {
    setShowAddDialog(true);
  };

  const handleAddItem = async (
    newItem: Omit<MenuItem, "id" | "lastUpdate" | "imageUrl"> & {
      categoryId: number;
    }
  ) => {
    try {
      // Convert base64 to File (primary first)
      const imageFiles = await Promise.all(
        [...(newItem.images || [])]
          .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
          .map(async (img) => {
            const blob = await (await fetch(img.url)).blob();
            return new File([blob], `image-${img.id}.jpg`, {
              type: "image/jpeg",
            });
          })
      );

      await menuItemApi.create({
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        preparation_time: newItem.preparationTime,
        category_id: newItem.categoryId,
        chef_recommended: newItem.chefRecommended,
        status: newItem.status,
        imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
        modifiers: newItem.modifiers?.map((mod) => ({
          modifier_group_id: mod.id,
        })),
      });

      // Only close dialog and reload if successful
      setShowAddDialog(false);
      setCurrentPage(1); // Reset to page 1 to see new item
    } catch (error) {
      console.error("Error creating menu item:", error);
      alert("Failed to create menu item");
      throw error; // Re-throw to be handled by the dialog if needed
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      const response = await menuItemApi.detail(id);
      const item = mapDetailToMenuItem(response);
      setEditingItem(item);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to load menu item details"
      );
      console.error("Error loading menu item detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (
    id: number,
    updatedItem: Omit<MenuItem, "id" | "lastUpdate" | "imageUrl">
  ) => {
    try {
      const category = categories.find(
        (cat) => cat.name === updatedItem.category
      );
      const categoryId = category?.id || 0;

      const imageUrls =
        updatedItem.images?.map((img) => ({
          url: img.url,
          is_primary: img.isPrimary,
        })) || [];

      await menuItemApi.update(id, {
        name: updatedItem.name,
        price: updatedItem.price,
        category_id: categoryId,
        status: updatedItem.status,
        preparation_time: updatedItem.preparationTime,
        description: updatedItem.description,
        chef_recommended: updatedItem.chefRecommended,
        images: imageUrls,
        modifiers:
          updatedItem.modifiers?.map((m) => ({
            modifier_group_id: String(m.id),
          })) || [],
      });

      // Only close dialog and reload if successful
      setEditingItem(null);
      await loadMenuItems();
    } catch (err) {
      console.error("Error updating menu item:", err);
      alert(err instanceof Error ? err.message : "Failed to update menu item");
      throw err; // Re-throw to be handled by the dialog if needed
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await menuItemApi.delete(id);
      await loadMenuItems();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete menu item");
      console.error("Error deleting menu item:", err);
    }
  };

  const handleAddCategory = async (newCategoryData: CategoryFormData) => {
    try {
      await categoryApi.create({
        name: newCategoryData.name,
        description: newCategoryData.description,
        is_active: newCategoryData.isActive,
        display_order: categories.length + 1,
        status: newCategoryData.isActive ? "active" : "inactive",
      });
      await loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create category");
      console.error("Error creating category:", err);
    }
  };

  const handleUpdateCategory = async (
    id: number,
    updatedCategoryData: CategoryFormData
  ) => {
    try {
      const category = categories.find((cat) => cat.id === id);
      await categoryApi.update(id, {
        name: updatedCategoryData.name,
        description: updatedCategoryData.description,
        is_active: updatedCategoryData.isActive,
        status: updatedCategoryData.isActive ? "active" : "inactive",
        display_order: category?.displayOrder || 0,
      });
      await loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update category");
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    if (category && category.itemCount > 0) {
      if (
        !confirm(
          `This category has ${category.itemCount} items. Are you sure you want to delete it?`
        )
      ) {
        return;
      }
    }

    try {
      await categoryApi.delete(id);
      await loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category");
      console.error("Error deleting category:", err);
    }
  };

  const handleToggleCategoryStatus = async (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;
    if (category && category.itemCount > 0) {
      if (
        !confirm(
          `This category has ${category.itemCount} items. Are you sure you want to delete it?`
        )
      ) {
        return;
      }
    }
    const newStatus = !category.isActive;
    try {
      await categoryApi.updateStatus(id, newStatus, category.displayOrder);
      await loadCategories();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to update category status"
      );
      console.error("Error updating category status:", err);
    }
  };

  const handleUpdateCategoryOrder = async (
    draggedId: number,
    targetIndex: number
  ) => {
    try {
      await categoryApi.updateOrder(draggedId, targetIndex + 1);
      await loadCategories();
    } catch (err) {
      console.error("Error updating category order:", err);
      alert("Failed to update category order");
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Menu Management</h1>
          <p className="text-gray-600">
            Manage your restaurant menu items and availability
          </p>
        </div>

        {/* Tabs and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger
                value="all-items"
                style={
                  activeTab === "all-items"
                    ? { backgroundColor: BRAND_COLOR, color: "white" }
                    : undefined
                }
              >
                All Items
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                style={
                  activeTab === "categories"
                    ? { backgroundColor: BRAND_COLOR, color: "white" }
                    : undefined
                }
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="modifiers"
                style={
                  activeTab === "modifiers"
                    ? { backgroundColor: BRAND_COLOR, color: "white" }
                    : undefined
                }
              >
                Modifiers
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {activeTab === "all-items" && (
            <Button
              onClick={handleAddNewItem}
              className="text-white"
              style={{ backgroundColor: BRAND_COLOR }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_COLOR_HOVER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_COLOR;
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          )}
        </div>

        {/* Tab Content */}
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="all-items" className="mt-0">
            {/* Filter Bar */}
            <MenuFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              categories={categories}
            />

            <MenuTable
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <CategoriesPage
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onToggleStatus={handleToggleCategoryStatus}
              onUpdateOrder={handleUpdateCategoryOrder}
            />
          </TabsContent>

          <TabsContent value="modifiers" className="mt-0">
            <ModifiersPage
              modifierGroups={modifierGroups}
              onAddGroup={handleAddModifierGroup}
              onUpdateGroup={handleUpdateModifierGroup}
              onDeleteGroup={handleDeleteModifierGroup}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Dialog */}
      {showAddDialog && (
        <AddMenuItemDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddItem={handleAddItem}
          categories={categories}
        />
      )}

      {/* Add Modifier Group Dialog */}
      {showAddModifierGroupDialog && (
        <AddModifierGroupDialog
          isOpen={showAddModifierGroupDialog}
          onClose={() => setShowAddModifierGroupDialog(false)}
          onAddGroup={handleAddModifierGroup}
        />
      )}

      {/* Edit Item Dialog */}
      {editingItem && (
        <EditMenuItemDialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          onUpdateItem={handleUpdateItem}
        />
      )}
    </div>
  );
}