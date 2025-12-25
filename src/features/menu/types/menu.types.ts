export interface UploadedImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'Available' | 'Sold Out' | 'Unavailable';
  lastUpdate: string;
  chefRecommended: boolean;
  imageUrl: string;
  // Optional fields for Add/Edit dialog
  description?: string;
  preparationTime?: number;
  images?: UploadedImage[];
  modifiers?: ModifierGroup[];
}

