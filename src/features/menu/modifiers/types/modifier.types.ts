export type ModifierSelectionType = 'Single Select' | 'Multi Select';
export type ModifierRequirement = 'Required' | 'Optional';

export interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface ModifierGroup {
  id: number;
  name: string;
  description: string;
  selectionType: ModifierSelectionType;
  requirement: ModifierRequirement;
  options: ModifierOption[];
  hiddenOptionsCount?: number;
}

export interface ModifierGroupFormData {
  name: string;
  description: string;
  selectionType: ModifierSelectionType;
  requirement: ModifierRequirement;
  options: ModifierOption[];
}

