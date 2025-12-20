import { Search, X } from 'lucide-react';
import { Input } from '../../../components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/forms/select';
import { Button } from '../../../components/ui/misc/button';
import React from "react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  zoneFilter: string;
  onZoneChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  zoneFilter,
  onZoneChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || zoneFilter !== 'all' || sortBy !== 'default';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Zone Filter */}
        <div className="w-full lg:w-48">
          <Select value={zoneFilter} onValueChange={onZoneChange}>
            <SelectTrigger className="border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="Main Hall">Main Hall</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Patio">Patio</SelectItem>
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
              <SelectItem value="table_number">Table Number</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
              <SelectItem value="recentlyCreated">Recently Created</SelectItem>
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
