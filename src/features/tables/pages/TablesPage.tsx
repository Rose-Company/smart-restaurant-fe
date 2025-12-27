import React, { useEffect, useState, useCallback } from 'react';
import { tableApi } from '../services/table.api';
import { TableStatus, Table as ApiTable } from "../types/table.types";
import { downloadAllQRApi } from '../services/qr.api';
import {
  StatsBar,
  TableGrid,
  ActionBar,
  FilterBar,
  AddTableDialog,
  EditTableDialog,
  QRPreviewDialog,
} from '../components';
import { DownloadAllQRDialog } from '../components/dialogs/DownloadAllQRDialog';
import { useTranslation } from "react-i18next";

export interface UITable {
  id: number;
  table_number: string;
  capacity: number;
  location: string;
  status: 'active' | 'occupied' | 'inactive';
  order_data?: {
    active_orders: number;
    total_bill: number;
  };
}

export function TablesPage() {
  const {t} = useTranslation("table");
  const [tables, setTables] = useState<UITable[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [qrPreviewTable, setQrPreviewTable] = useState<UITable | null>(null);
  const [editTable, setEditTable] = useState<UITable | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDownloadAll, setShowDownloadAll] = useState(false);
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Map API Table to UI Table
  const mapApiToUI = (apiTable: ApiTable): UITable | null => {
    // Validate required fields
    if (!apiTable || !apiTable.table_number) {
      console.warn('Invalid table data:', apiTable);
      return null;
    }

    const statusMap: Record<TableStatus, 'active' | 'occupied' | 'inactive'> = {
      active: 'active',
      occupied: 'occupied',
      inactive: 'inactive',
    };

    return {
      id: apiTable.id,
      table_number: apiTable.table_number,
      capacity: apiTable.capacity || 0,
      location: apiTable.location || 'Unknown',
      status: statusMap[apiTable.status] || 'inactive',
      order_data: apiTable.order_data ? {
        active_orders: apiTable.order_data.active_orders || 0,
        total_bill: apiTable.order_data.total_bill || 0,
      } : undefined,
    };
  };

  // Map UI status to API status
  const mapUIStatusToAPI = (
    status: 'active' | 'inactive' | 'occupied'
  ): TableStatus => {
    const statusMap: Record<
      'active' | 'occupied' | 'inactive',
      TableStatus
    > = {
      active: 'active',
      occupied: 'occupied',
      inactive: 'inactive',
    };

    return statusMap[status];
  };

  // Fetch tables function - let backend handle filtering and sorting
  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tableApi.list({
        page,
        page_size: pageSize,
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : mapUIStatusToAPI(statusFilter as any),
        zone: zoneFilter === 'all' ? undefined : zoneFilter,
        sort: sortBy === 'default' ? undefined : sortBy,
      });

      console.log('API Response:', res);

      // Parse response based on actual API structure
      let apiTables: ApiTable[] = [];

      // Expected structure: { code: 0, message: "", data: { items: [...] } }
      if (res?.data?.items && Array.isArray(res.data.items)) {
        apiTables = res.data.items;
      }
      // Fallback: { data: [...] }
      else if (res?.data && Array.isArray(res.data)) {
        apiTables = res.data;
      }
      // Fallback: [...]
      else if (Array.isArray(res)) {
        apiTables = res;
      }
      else {
        console.error('Unexpected response structure:', res);
        setTables([]);
        return;
      }

      // Map and filter valid tables
      const uiTables = apiTables
        .map(mapApiToUI)
        .filter((table): table is UITable => table !== null);

      setTables(uiTables);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, zoneFilter, sortBy]);

  // Refetch when filters change
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Calculate stats (from current filtered results)
  const stats = {
    total: tables.length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    available: tables.filter((t) => t.status === 'active').length,
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setZoneFilter('all');
    setSortBy('default');
    setPage(1);
  };

  const handleAddTable = () => {
    setShowAddDialog(true);
  };

  // Create new table
  const handleCreateTable = async (newTableData: {
    table_number: string;
    capacity: number;
    zone: string;
    status: 'active' | 'inactive';
  }) => {
    try {
      const apiTable = {
        table_number: newTableData.table_number,
        capacity: newTableData.capacity,
        location: newTableData.zone,
        status: mapUIStatusToAPI(newTableData.status),
      };

      const response = await tableApi.create(apiTable);
      setShowAddDialog(false);

      // Refetch tables to get the new one
      await fetchTables();

      // Show success and preview QR after refetch
      setTimeout(() => {
        // Find the newly created table by matching data
        const newTable = tables.find(
          t => t.table_number === newTableData.table_number
        );
        if (newTable) {
          setQrPreviewTable(newTable);
        } else if (response?.data) {
          // If we got the created table from response, map and use it
          const mappedTable = mapApiToUI(response.data);
          if (mappedTable) {
            setQrPreviewTable(mappedTable);
          }
        }
      }, 100);
    } catch (err) {
      console.error('Error creating table:', err);
      throw err;
    }
  };

  const handleDownloadQR = () => {
    setShowDownloadAll(true);
  };

  const handleDownloadAllZip = async () => {
    try {
      const blob = await downloadAllQRApi.zip();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "all_tables_qr.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download all QR ZIP failed:", err);
      alert("Failed to download QR ZIP");
    }
  };

  // Update existing table
  const handleUpdateTable = async (updatedTable: UITable) => {
    try {
      const apiData = {
        table_number: updatedTable.table_number,
        capacity: updatedTable.capacity,
        location: updatedTable.location,
        status: mapUIStatusToAPI(updatedTable.status),
      };

      await tableApi.update(updatedTable.id, apiData);
      setEditTable(null);

      // Refetch tables to get updated data
      await fetchTables();
    } catch (err) {
      console.error('Error updating table:', err);
      throw err;
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">{t("tablePage.title")}</h1>
            <p className="text-gray-600">{t("tablePage.subTitle")}</p>
          </div>

          <ActionBar onAddTable={handleAddTable} onDownloadQR={handleDownloadQR} />

          <StatsBar stats={stats} />

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            zoneFilter={zoneFilter}
            onZoneChange={setZoneFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : tables.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No tables found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery || statusFilter !== 'all' || zoneFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Click "Add Table" to create your first table'}
              </p>
            </div>
          ) : (
            <TableGrid tables={tables} onQRPreview={setQrPreviewTable} onEdit={setEditTable} />
          )}
        </div>
      </div>
      {showDownloadAll && (
        <DownloadAllQRDialog
          onClose={() => setShowDownloadAll(false)}
          onDownloadZip={handleDownloadAllZip}
        />
      )}
      {showAddDialog && (
        <AddTableDialog onClose={() => setShowAddDialog(false)} onAdd={handleCreateTable} />
      )}

      {qrPreviewTable && (
        <QRPreviewDialog table={qrPreviewTable} onClose={() => setQrPreviewTable(null)} />
      )}

      {editTable && (
        <EditTableDialog
          table={editTable}
          onClose={() => setEditTable(null)}
          onSave={handleUpdateTable}
        />
      )}
    </>
  );
}