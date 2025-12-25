export interface Category {
  id: number;
  name: string;
  description: string;
  itemCount: number;
  isActive: boolean;
  displayOrder: number;
}

export type CategoryFormData = Omit<Category, 'id' | 'displayOrder'>;

