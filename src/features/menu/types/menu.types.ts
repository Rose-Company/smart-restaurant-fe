export interface UploadedImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

// Modifier related types 
// Radio buttons for single selection. E.g., Size, Add-ons
// Checkboxes for multi selection. E.g., Toppings, Extras
export interface ModifierOption {
  id: string;
  name: string;
  price: number; // Additional price
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  selectionType?: 'Single' | 'Multi';
  options?: ModifierOption[];
  optionsPreview?: string; // e.g., "Small (+$0), Medium (+$2), Large (+$4)"
}

export type Status = 'available' | 'sold_out' | 'unavailable';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  status: Status
  lastUpdate: string;
  chefRecommended: boolean;
  imageUrl: string;
  // Optional fields for Add/Edit dialog
  description?: string;
  preparationTime?: number;
  images?: UploadedImage[];
  modifiers?: ModifierGroup[];
}

