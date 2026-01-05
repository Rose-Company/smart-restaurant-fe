import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ModifierGroupCard } from '../components/ModifierGroupCard';
import { EditModifierGroupDialog } from '../components/dialogs/EditModifierGroupDialog';
import { AddModifierGroupDialog } from '../components/dialogs/AddModifierGroupDialog';
import type { 
  ModifierGroup, 
  ModifierSelectionType,
  ModifierOption,
  ModifierStatus
} from '../types/modifier.types';
import { Button } from '../../../../components/ui/misc/button';

const BRAND_COLOR = '#27ae60';

type ModifierGroupPageProps = {
  modifierGroups: ModifierGroup[];
  onAddGroup: (groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    is_required: boolean;
    options: ModifierOption[];
  }) => Promise<void>;
  onUpdateGroup: (
    id: number,
    updatedGroupData: {
      name: string;
      description: string;
      selectionType: ModifierSelectionType;
      is_required: boolean;
      status: ModifierStatus;
      options: ModifierOption[];
    }
  ) => Promise<void>;
  onDeleteGroup: (id: number) => Promise<void>;
}

export function ModifiersPage({
  modifierGroups,
  onAddGroup,
  onUpdateGroup,
  onDeleteGroup
}: ModifierGroupPageProps) {

  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalGroups = modifierGroups.length;
  const requiredGroups = modifierGroups.filter(g => g.is_required).length;
  const singleSelectGroups = modifierGroups.filter(g => g.selectionType === 'single').length;
  const multiSelectGroups = modifierGroups.filter(g => g.selectionType === 'multiple').length;

  const handleEdit = (id: number) => {
    const group = modifierGroups.find(g => g.id === id);
    if (group) {
      setEditingGroup(group);
    }
  };

  const handleAddGroup = async (groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    is_required: boolean;
    options: ModifierOption[];
  }) => {
    try {
      await onAddGroup(groupData);
      setIsAddDialogOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create modifier group');
      console.error('Error creating modifier group:', err);
    }
  };

  const handleUpdateGroup = async (
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
      await onUpdateGroup(id, updatedGroupData);
      setEditingGroup(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update modifier group');
      console.error('Error updating modifier group:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this modifier group?')) {
      try {
        await onDeleteGroup(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete modifier group');
        console.error('Error deleting modifier group:', err);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-1">Modifier Groups</h2>
          <p className="text-base text-gray-600">Manage customization options for menu items</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          style={{ backgroundColor: BRAND_COLOR, color: 'white' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#229954';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = BRAND_COLOR;
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Group
        </Button>
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
          <p className="text-sm text-gray-600" style={{ marginBottom: '4px' }}>Multiple Select</p>
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

      {/* Add Modifier Group Dialog */}
      <AddModifierGroupDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddGroup={handleAddGroup}
      />

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