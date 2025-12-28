import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/misc/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/navigation/tabs';
import { MenuFilterBar } from '../components/MenuFilterBar';
import { MenuTable } from '../components/MenuTable';
import { AddMenuItemDialog } from '../components/dialogs/AddMenuItemDialog';
import { EditMenuItemDialog } from '../components/dialogs/EditMenuItemDialog';
import { CategoriesPage } from '../categories/pages/CategoriesPage';
import { ModifiersPage } from '../modifiers/pages/ModifiersPage';
import { AddModifierGroupDialog } from '../modifiers/components/dialogs/AddModifierGroupDialog';
import { categoryApi } from '../categories/services/category.api';
import type { MenuItem } from '../types/menu.types';
import type { ModifierSelectionType, ModifierOption } from '../modifiers/types/modifier.types';
import { menuItemApi } from '../services/menu.api';
// Brand color constant
const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all-items');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddModifierGroupDialog, setShowAddModifierGroupDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

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
    const primaryImage = raw.images?.find((img: any) => img.is_primary) || raw.images?.[0];
    return {
      id: raw.id,
      name: raw.name,
      category: raw.category?.name || raw.category || '',
      price: raw.price,
      status: raw.status === 'available' ? 'Available' : raw.status === 'sold_out' ? 'Sold Out' : 'Unavailable',
      lastUpdate: raw.last_update || raw.updated_at || new Date().toISOString().split('T')[0],
      chefRecommended: raw.chef_recommended || false,
      imageUrl: primaryImage?.url || raw.image_url || '',
      description: raw.description || '',
      preparationTime: raw.preparation_time || 0,
      images: raw.images?.map((img: any) => ({
        id: String(img.id || img.url),
        url: img.url,
        isPrimary: img.is_primary || false,
      })) || (primaryImage ? [{
        id: 'primary',
        url: primaryImage.url,
        isPrimary: true,
      }] : []),
      modifiers: raw.modifiers?.map((mod: any) => ({
        id: String(mod.id || mod.modifier_group_id),
        name: mod.name || mod.modifier_group?.name || '',
        required: mod.required || mod.is_required || false,
        selectionType: mod.selection_type === 'single' ? 'Single' : 'Multi',
      })) || [],
    };
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoryApi.list();
      setCategories(cats.map(cat => ({ id: cat.id, name: cat.name })));
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    setLoading(true);

    menuItemApi
      .list({
        page: currentPage,
        page_size: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort:
          sortBy === 'price-asc'
            ? 'price_asc'
            : sortBy === 'price-desc'
              ? 'price_desc'
              : sortBy === 'name'
                ? 'name'
                : undefined,
      })
      .then((res) => {
        const data = res.data;
        setItems(res.data.items.map(mapMenuItem));
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [
    currentPage,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortBy,
  ]);


  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  const handleAddNewItem = () => {
    setShowAddDialog(true);
  };

  const handleAddItem = (
    newItem: Omit<MenuItem, 'id' | 'lastUpdate' | 'imageUrl'>,
  ) => {
    // const newId =
    //   menuItems.length > 0
    //     ? Math.max(...menuItems.map((item) => item.id)) + 1
    //     : 1;
    // // Get primary image URL or first image URL for imageUrl field
    // const primaryImage = newItem.images?.find((img) => img.isPrimary);
    // const imageUrl = primaryImage?.url || newItem.images?.[0]?.url || '';
    // const itemToAdd: MenuItem = {
    //   ...newItem,
    //   id: newId,
    //   lastUpdate: new Date().toISOString().split('T')[0],
    //   imageUrl,
    // };
    // setMenuItems([...menuItems, itemToAdd]);
    // setShowAddDialog(false);
  };

  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      const response = await menuItemApi.detail(id);
      const item = mapDetailToMenuItem(response);
      setEditingItem(item);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load menu item details');
      console.error('Error loading menu item detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (
    id: number,
    updatedItem: Omit<MenuItem, 'id' | 'lastUpdate' | 'imageUrl'>,
  ) => {
    try {
      const category = categories.find(cat => cat.name === updatedItem.category);
      const categoryId = category?.id || 0;

      const imageUrls = updatedItem.images?.map(img => ({
        url: img.url,
        is_primary: img.isPrimary,
      })) || [];

      await menuItemApi.update(id, {
        name: updatedItem.name,
        price: updatedItem.price,
        category_id: categoryId,
        status: updatedItem.status === 'Available' ? 'available' : updatedItem.status === 'Sold Out' ? 'sold_out' : 'unavailable',
        preparation_time: updatedItem.preparationTime,
        description: updatedItem.description,
        chef_recommended: updatedItem.chefRecommended,
        images: imageUrls,
        modifiers: updatedItem.modifiers?.map(m => ({ modifier_group_id: String(m.id) })) || [],
      });

      setEditingItem(null);
      
      // Reload items after update
      const res = await menuItemApi.list({
        page: currentPage,
        page_size: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort:
          sortBy === 'price-asc'
            ? 'price_asc'
            : sortBy === 'price-desc'
              ? 'price_desc'
              : sortBy === 'name'
                ? 'name'
                : undefined,
      });
      const data = res.data;
      setItems(res.data.items.map(mapMenuItem));
      setTotal(data.total);
    } catch (err) {
      console.error('Error updating menu item:', err);
      alert(err instanceof Error ? err.message : 'Failed to update menu item');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await menuItemApi.delete(id);
      
      // Reload items after delete
      const res = await menuItemApi.list({
        page: currentPage,
        page_size: itemsPerPage,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort:
          sortBy === 'price-asc'
            ? 'price_asc'
            : sortBy === 'price-desc'
              ? 'price_desc'
              : sortBy === 'name'
                ? 'name'
                : undefined,
      });
      const data = res.data;
      setItems(res.data.items.map(mapMenuItem));
      setTotal(data.total);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    }
  };

  const handleAddModifierGroup = (groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    is_required: boolean;
    options: ModifierOption[];
  }) => {
    console.log('New modifier group added:', groupData);
    setShowAddModifierGroupDialog(false);
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-gray-100 p-1">
              <TabsTrigger
                value="all-items"
                style={
                  activeTab === 'all-items'
                    ? { backgroundColor: BRAND_COLOR, color: 'white' }
                    : undefined
                }
              >
                All Items
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                style={
                  activeTab === 'categories'
                    ? { backgroundColor: BRAND_COLOR, color: 'white' }
                    : undefined
                }
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="modifiers"
                style={
                  activeTab === 'modifiers'
                    ? { backgroundColor: BRAND_COLOR, color: 'white' }
                    : undefined
                }
              >
                Modifiers
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {activeTab === 'all-items' && (
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
            <CategoriesPage />
          </TabsContent>

          <TabsContent value="modifiers" className="mt-0">
            <ModifiersPage />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Item Dialog */}
      {showAddDialog && (
        <AddMenuItemDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddItem={handleAddItem}
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

