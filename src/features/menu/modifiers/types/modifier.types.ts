export type ModifierSelectionType = 'single' | 'multiple';
export type ModifierStatus = 'active' | 'inactive';

export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
  status: ModifierStatus;
}

export interface ModifierGroup {
  id: number;
  name: string;
  description: string;
  selectionType: ModifierSelectionType;
  is_required: boolean;
  status: ModifierStatus;
  options: ModifierOption[];
  hiddenOptionsCount?: number;
}

export interface ModifierGroupFormData {
  name: string;
  description: string;
  selectionType: ModifierSelectionType;
  is_required: boolean;
  options: ModifierOption[];
}

