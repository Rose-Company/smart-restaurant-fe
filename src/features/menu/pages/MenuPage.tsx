import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/misc/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/navigation/tabs';
import { MenuFilterBar } from '../components/MenuFilterBar';
import { MenuTable } from '../components/MenuTable';
import { AddMenuItemDialog } from '../components/dialogs/AddMenuItemDialog';
import { CategoriesPage } from '../categories/pages/CategoriesPage';
import { ModifiersPage } from '../modifiers/pages/ModifiersPage';
import { AddModifierGroupDialog } from '../modifiers/components/dialogs/AddModifierGroupDialog';
import type { MenuItem } from '../types/menu.types';
import type { ModifierSelectionType, ModifierRequirement, ModifierOption } from '../modifiers/types/modifier.types';

// Brand color constant
const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Grilled Salmon',
    category: 'Main Course',
    price: 24.99,
    status: 'Available',
    lastUpdate: '2025-12-20',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400',
  },
  {
    id: 2,
    name: 'Caesar Salad',
    category: 'Appetizer',
    price: 12.5,
    status: 'Available',
    lastUpdate: '2025-12-22',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?w=400',
  },
  {
    id: 3,
    name: 'Beef Wellington',
    category: 'Main Course',
    price: 38.0,
    status: 'Available',
    lastUpdate: '2025-12-15',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1546964053-d018e345e490?w=400',
  },
  {
    id: 4,
    name: 'Chocolate Lava Cake',
    category: 'Dessert',
    price: 9.99,
    status: 'Available',
    lastUpdate: '2025-12-23',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1673551490812-eaee2e9bf0ef?w=400',
  },
  {
    id: 5,
    name: 'Lobster Bisque',
    category: 'Appetizer',
    price: 15.99,
    status: 'Sold Out',
    lastUpdate: '2025-12-24',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  },
  {
    id: 6,
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 16.5,
    status: 'Available',
    lastUpdate: '2025-12-21',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
  },
  {
    id: 7,
    name: 'Tiramisu',
    category: 'Dessert',
    price: 8.5,
    status: 'Available',
    lastUpdate: '2025-12-19',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
  },
  {
    id: 8,
    name: 'French Onion Soup',
    category: 'Appetizer',
    price: 11.0,
    status: 'Unavailable',
    lastUpdate: '2025-12-18',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  },
  {
    id: 9,
    name: 'Ribeye Steak',
    category: 'Main Course',
    price: 42.0,
    status: 'Available',
    lastUpdate: '2025-12-24',
    chefRecommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
  },
  {
    id: 10,
    name: 'Crème Brûlée',
    category: 'Dessert',
    price: 10.5,
    status: 'Available',
    lastUpdate: '2025-12-22',
    chefRecommended: false,
    imageUrl: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
  },
];

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [activeTab, setActiveTab] = useState('all-items');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddModifierGroupDialog, setShowAddModifierGroupDialog] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and sort logic
  const filteredItems = menuItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          // Sort chef recommended first
          return (b.chefRecommended ? 1 : 0) - (a.chefRecommended ? 1 : 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return a.id - b.id;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

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
    const newId =
      menuItems.length > 0
        ? Math.max(...menuItems.map((item) => item.id)) + 1
        : 1;
    // Get primary image URL or first image URL for imageUrl field
    const primaryImage = newItem.images?.find((img) => img.isPrimary);
    const imageUrl = primaryImage?.url || newItem.images?.[0]?.url || '';
    const itemToAdd: MenuItem = {
      ...newItem,
      id: newId,
      lastUpdate: new Date().toISOString().split('T')[0],
      imageUrl,
    };
    setMenuItems([...menuItems, itemToAdd]);
    setShowAddDialog(false);
  };

  const handleEdit = (id: number) => {
    alert(`Edit item ${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
      // Reset to page 1 after delete if current page would be empty
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleAddModifierGroup = (groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    requirement: ModifierRequirement;
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
          {activeTab === 'modifiers' && (
            <Button
              onClick={() => setShowAddModifierGroupDialog(true)}
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
              Create New Group
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
              items={paginatedItems}
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
    </div>
  );
}

