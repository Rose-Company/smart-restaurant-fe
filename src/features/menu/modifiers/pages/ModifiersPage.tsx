import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ModifierGroupCard } from '../components/ModifierGroupCard';
import { EditModifierGroupDialog } from '../components/dialogs/EditModifierGroupDialog';
import { AddModifierGroupDialog } from '../components/dialogs/AddModifierGroupDialog';
import { modifierGroupApi } from '../services/modifier.api';
import type { 
  ModifierGroup, 
  ModifierSelectionType,
  ModifierOption 
} from '../types/modifier.types';
import { Button } from '../../../../components/ui/misc/button';

const BRAND_COLOR = '#27ae60';

export function ModifiersPage() {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModifierGroups();
  }, []);

  const loadModifierGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const groups = await modifierGroupApi.list();
      setModifierGroups(groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modifier groups');
      console.error('Error loading modifier groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
      const newGroup = await modifierGroupApi.create({
        name: groupData.name,
        description: groupData.description,
        selection_type: groupData.selectionType,
        is_required: groupData.is_required,
        status: 'active',
      });

      if (!newGroup || !newGroup.id) {
        throw new Error('Failed to create modifier group: Invalid response');
      }

      for (const option of groupData.options) {
        const trimmedName = (option.name || '').trim();
        if (!trimmedName) {
          console.warn('Skipping option with empty name:', option);
          continue;
        }
        
        const optionStatus = option.status && (option.status === 'active' || option.status === 'inactive') 
          ? option.status 
          : 'active';
        
        const requestData = {
          name: trimmedName,
          price_adjustment: option.priceAdjustment || 0,
          status: optionStatus,
        };
        
        console.log('Creating option with data:', requestData);
        
        await modifierGroupApi.addOption(newGroup.id, requestData);
      }

      await loadModifierGroups();
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
      options: ModifierOption[];
    }
  ) => {
    try {
      const currentGroup = modifierGroups.find(g => g.id === id);
      await modifierGroupApi.update(id, {
        name: updatedGroupData.name,
        description: updatedGroupData.description,
        selection_type: updatedGroupData.selectionType,
        is_required: updatedGroupData.is_required,
        min_selections: 0,
        max_selections: updatedGroupData.selectionType === 'single' ? 1 : 999,
        display_order: 0,
        status: 'active',
      });

      if (currentGroup) {
        const existingOptions = currentGroup.options;
        const updatedOptions = updatedGroupData.options;

        const existingOptionIds = new Set(
          existingOptions
            .map(opt => Number(opt.id))
            .filter(id => !isNaN(id))
        );
        
        const updatedOptionIds = new Set(
          updatedOptions
            .map(opt => Number(opt.id))
            .filter(id => !isNaN(id))
        );

        const newOptions = updatedOptions.filter(opt => {
          const optId = Number(opt.id);
          return isNaN(optId) || !existingOptionIds.has(optId);
        });

        const optionsToDelete = existingOptions.filter(opt => {
          const optId = Number(opt.id);
          return !isNaN(optId) && !updatedOptionIds.has(optId);
        });

        for (const option of existingOptions) {
          const optId = Number(option.id);
          if (!isNaN(optId) && updatedOptionIds.has(optId)) {
            const updatedOption = updatedOptions.find(opt => Number(opt.id) === optId);
            if (updatedOption) {
              const trimmedName = updatedOption.name.trim();
              if (trimmedName && (trimmedName !== option.name || updatedOption.priceAdjustment !== option.priceAdjustment || updatedOption.status !== option.status)) {
                await modifierGroupApi.updateOption(optId, {
                  name: trimmedName,
                  price_adjustment: updatedOption.priceAdjustment,
                  status: updatedOption.status || 'active',
                });
              }
            }
          }
        }

        for (const option of optionsToDelete) {
          const optId = Number(option.id);
          if (!isNaN(optId)) {
            await modifierGroupApi.deleteOption(optId);
          }
        }

        for (const option of newOptions) {
          const trimmedName = (option.name || '').trim();
          if (!trimmedName) {
            console.warn('Skipping option with empty name:', option);
            continue;
          }
          
          const optionStatus = option.status && (option.status === 'active' || option.status === 'inactive') 
            ? option.status 
            : 'active';
          
          const requestData = {
            name: trimmedName,
            price_adjustment: option.priceAdjustment || 0,
            status: optionStatus,
          };
          
          console.log('Creating option with data:', requestData);
          
          await modifierGroupApi.addOption(id, requestData);
        }
      }

      await loadModifierGroups();
      setEditingGroup(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update modifier group');
      console.error('Error updating modifier group:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this modifier group?')) {
      try {
        await modifierGroupApi.delete(id);
        await loadModifierGroups();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete modifier group');
        console.error('Error deleting modifier group:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <p className="text-gray-500">Loading modifier groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadModifierGroups} style={{ backgroundColor: BRAND_COLOR, color: 'white' }}>
          Retry
        </Button>
      </div>
    );
  }

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
          <p className="text-sm text-gray-600" style={{ marginBottom: '4px' }}>multiple Select</p>
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
