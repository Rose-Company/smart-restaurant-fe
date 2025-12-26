import React, { useState } from 'react';
import { ModifierGroupCard } from '../components/ModifierGroupCard';
import { EditModifierGroupDialog } from '../components/dialogs/EditModifierGroupDialog';
import type { 
  ModifierGroup, 
  ModifierSelectionType, 
  ModifierRequirement, 
  ModifierOption 
} from '../types/modifier.types';

const initialModifierGroups: ModifierGroup[] = [
  {
    id: 1,
    name: 'Pizza Sizes',
    description: 'Choose your pizza size',
    selectionType: 'Single Select',
    requirement: 'Required',
    options: [
      { id: '1', name: 'Small (10")', priceAdjustment: 0 },
      { id: '2', name: 'Medium (14")', priceAdjustment: 4.00 },
      { id: '3', name: 'Large (18")', priceAdjustment: 8.00 },
    ],
    hiddenOptionsCount: 1,
  },
  {
    id: 2,
    name: 'Drink Sizes',
    description: 'Select drink size',
    selectionType: 'Single Select',
    requirement: 'Required',
    options: [
      { id: '1', name: 'Small', priceAdjustment: 0 },
      { id: '2', name: 'Medium', priceAdjustment: 1.50 },
      { id: '3', name: 'Large', priceAdjustment: 2.50 },
    ],
  },
  {
    id: 3,
    name: 'Pizza Toppings',
    description: 'Add extra toppings',
    selectionType: 'Multi Select',
    requirement: 'Optional',
    options: [
      { id: '1', name: 'Extra Cheese', priceAdjustment: 2.00 },
      { id: '2', name: 'Pepperoni', priceAdjustment: 2.50 },
      { id: '3', name: 'Mushrooms', priceAdjustment: 1.50 },
    ],
    hiddenOptionsCount: 2,
  },
  {
    id: 4,
    name: 'Steak Temperature',
    description: 'How would you like your steak cooked?',
    selectionType: 'Single Select',
    requirement: 'Required',
    options: [
      { id: '1', name: 'Rare', priceAdjustment: 0 },
      { id: '2', name: 'Medium Rare', priceAdjustment: 0 },
      { id: '3', name: 'Medium', priceAdjustment: 0 },
    ],
    hiddenOptionsCount: 2,
  },
  {
    id: 5,
    name: 'Burger Add-ons',
    description: 'Customize your burger',
    selectionType: 'Multi Select',
    requirement: 'Optional',
    options: [
      { id: '1', name: 'Bacon', priceAdjustment: 3.00 },
      { id: '2', name: 'Avocado', priceAdjustment: 2.50 },
      { id: '3', name: 'Fried Egg', priceAdjustment: 2.00 },
    ],
    hiddenOptionsCount: 1,
  },
  {
    id: 6,
    name: 'Salad Dressings',
    description: 'Choose your dressing',
    selectionType: 'Single Select',
    requirement: 'Optional',
    options: [
      { id: '1', name: 'Ranch', priceAdjustment: 0 },
      { id: '2', name: 'Caesar', priceAdjustment: 0 },
      { id: '3', name: 'Balsamic Vinaigrette', priceAdjustment: 0 },
    ],
    hiddenOptionsCount: 1,
  },
];

export function ModifiersPage() {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(initialModifierGroups);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);

  const totalGroups = modifierGroups.length;
  const requiredGroups = modifierGroups.filter(g => g.requirement === 'Required').length;
  const singleSelectGroups = modifierGroups.filter(g => g.selectionType === 'Single Select').length;
  const multiSelectGroups = modifierGroups.filter(g => g.selectionType === 'Multi Select').length;

  const handleEdit = (id: number) => {
    const group = modifierGroups.find(g => g.id === id);
    if (group) {
      setEditingGroup(group);
    }
  };

  const handleUpdateGroup = (
    id: number,
    updatedGroupData: {
      name: string;
      description: string;
      selectionType: ModifierSelectionType;
      requirement: ModifierRequirement;
      options: ModifierOption[];
    }
  ) => {
    setModifierGroups(modifierGroups.map(group =>
      group.id === id
        ? { ...group, ...updatedGroupData }
        : group
    ));
    setEditingGroup(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this modifier group?')) {
      setModifierGroups(modifierGroups.filter(g => g.id !== id));
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-1">Modifier Groups</h2>
        <p className="text-base text-gray-600">Manage customization options for menu items</p>
      </div>

      {/* Stats Cards - Fixed 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '16px' }}>
          <p className="text-sm text-gray-600" style={{ marginBottom: '4px' }}>Total Groups</p>
          <p className="text-base text-gray-900">{totalGroups}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '16px' }}>
          <p className="text-sm text-gray-600" style={{ marginBottom: '4px' }}>Required Groups</p>
          <p className="text-base text-gray-900">{requiredGroups}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '16px' }}>
          <p className="text-sm text-gray-600" style={{ marginBottom: '4px' }}>Single Select</p>
          <p className="text-base text-gray-900">{singleSelectGroups}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '16px' }}>
          <p className="text-sm text-gray-600" style={{ marginBottom: '4px' }}>Multi Select</p>
          <p className="text-base text-gray-900">{multiSelectGroups}</p>
        </div>
      </div>

      {/* Modifier Groups Grid - Fixed 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {modifierGroups.map((group) => (
          <ModifierGroupCard
            key={group.id}
            group={group}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {modifierGroups.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No modifier groups found</p>
          <p className="text-sm text-gray-400 mt-2">Click "Create New Group" to add your first modifier group</p>
        </div>
      )}

      {/* Edit Modifier Group Dialog */}
      {editingGroup && (
        <EditModifierGroupDialog
          isOpen={!!editingGroup}
          onClose={() => setEditingGroup(null)}
          group={editingGroup}
          onUpdateGroup={handleUpdateGroup}
        />
      )}
    </>
  );
}
