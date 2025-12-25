import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';

// Brand color constant
const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

interface CategoryActionBarProps {
  onAddCategory: () => void;
}

export function CategoryActionBar({ onAddCategory }: CategoryActionBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-gray-600">Manage menu categories and their display order</p>
      <Button
        onClick={onAddCategory}
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
        Add Category
      </Button>
    </div>
  );
}

