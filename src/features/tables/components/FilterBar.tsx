import { Search, X } from 'lucide-react';
import { Input } from '../../../components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/forms/select';
import { Button } from '../../../components/ui/misc/button';
import React from "react";
import { useTranslation } from "react-i18next";
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
  const {t} = useTranslation("table")
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t("common.sort.searchPlaceHolder")}
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
              <SelectItem value="all">{t("common.status.all")}</SelectItem>
              <SelectItem value="active">{t("common.status.active")}</SelectItem>
              <SelectItem value="occupied">{t("common.status.occupied")}</SelectItem>
              <SelectItem value="inactive">{t("common.status.inactive")}</SelectItem>
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
              <SelectItem value="all">{t("common.zone.all")}</SelectItem>
              <SelectItem value="Main Hall">{t("common.zone.Main Hall")}</SelectItem>
              <SelectItem value="VIP">{t("common.zone.VIP")}</SelectItem>
              <SelectItem value="Patio">{t("common.zone.Patio")}</SelectItem>
              <SelectItem value="Indoor">{t("common.zone.Indoor")}</SelectItem>
              <SelectItem value="Outdoor">{t("common.zone.Outdoor")}</SelectItem>
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
              <SelectItem value="default">{t("common.sort.order")}</SelectItem>
              <SelectItem value="table_number">{t("common.sort.table")}</SelectItem>
              <SelectItem value="capacity">{t("common.capacity.label")}</SelectItem>
              <SelectItem value="recentlyCreated">{t("common.sort.created")}</SelectItem>
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
            {t("common.actions.clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
