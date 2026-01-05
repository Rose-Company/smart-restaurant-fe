import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/forms/select';
import { Button } from '../../../components/ui/misc/button';
import { Category } from '../categories/types/category.types';

interface MenuFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  categories: Pick<Category, 'id' | 'name' | 'isActive'>[];
}

export function MenuFilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onClearFilters,
  categories
}: MenuFilterBarProps) {
  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all' ||
    sortBy !== 'default';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-48">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.filter(category => category.isActive).map((category)=>(
                <SelectItem value = {category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold_out">Sold Out</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-52">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Order</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

