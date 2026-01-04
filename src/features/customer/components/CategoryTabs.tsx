import React from 'react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      padding: '16px 16px 0 16px',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{ display: 'flex', gap: '8px', paddingBottom: '16px' }}>
        <button
          onClick={() => onCategoryChange('Popular')}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            backgroundColor: selectedCategory === 'Popular' ? '#52b788' : '#f3f4f6',
            color: selectedCategory === 'Popular' ? '#ffffff' : '#374151',
            transition: 'all 0.2s'
          }}
        >
          ⭐ Popular
        </button>
        <button
          onClick={() => onCategoryChange('Chef Recommended')}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            backgroundColor: selectedCategory === 'Chef Recommended' ? '#52b788' : '#f3f4f6',
            color: selectedCategory === 'Chef Recommended' ? '#ffffff' : '#374151',
            transition: 'all 0.2s'
          }}
        >
          Chef Recommended
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              backgroundColor: selectedCategory === category ? '#52b788' : '#f3f4f6',
              color: selectedCategory === category ? '#ffffff' : '#374151',
              transition: 'all 0.2s'
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
