import React, { useState } from 'react';
import {
  StatsBar,
  TableGrid,
  ActionBar,
  FilterBar,
  AddTableDialog,
  EditTableDialog,
  QRPreviewDialog,
} from '../components';
import type { Table } from '../types/table.types';

const initialTables: Table[] = [
  { id: 1, tableNumber: 'T-01', capacity: 4, zone: 'Main Hall', status: 'Active' },
  { id: 2, tableNumber: 'T-02', capacity: 2, zone: 'Main Hall', status: 'Occupied', orderData: { activeOrders: 3, totalBill: 156.0 } },
  { id: 3, tableNumber: 'T-03', capacity: 6, zone: 'Main Hall', status: 'Active' },
  { id: 4, tableNumber: 'VIP-01', capacity: 4, zone: 'VIP', status: 'Inactive' },
  { id: 5, tableNumber: 'T-05', capacity: 8, zone: 'Main Hall', status: 'Occupied', orderData: { activeOrders: 5, totalBill: 284.5 } },
  { id: 6, tableNumber: 'P-01', capacity: 2, zone: 'Patio', status: 'Active' },
  { id: 7, tableNumber: 'T-07', capacity: 4, zone: 'Main Hall', status: 'Active' },
  { id: 8, tableNumber: 'P-02', capacity: 6, zone: 'Patio', status: 'Occupied', orderData: { activeOrders: 2, totalBill: 98.75 } },
  { id: 9, tableNumber: 'VIP-02', capacity: 4, zone: 'VIP', status: 'Active' },
  { id: 10, tableNumber: 'T-10', capacity: 2, zone: 'Main Hall', status: 'Active' },
  { id: 11, tableNumber: 'P-03', capacity: 4, zone: 'Patio', status: 'Inactive' },
  { id: 12, tableNumber: 'T-12', capacity: 6, zone: 'Main Hall', status: 'Active' },
];

export function TablesPage() {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [qrPreviewTable, setQrPreviewTable] = useState<Table | null>(null);
  const [editTable, setEditTable] = useState<Table | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Filter and sort logic
  const filteredTables = tables
    .filter((table) => {
      const matchesSearch = table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
      const matchesZone = zoneFilter === 'all' || table.zone === zoneFilter;
      return matchesSearch && matchesStatus && matchesZone;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'tableNumber':
          return a.tableNumber.localeCompare(b.tableNumber);
        case 'capacity':
          return b.capacity - a.capacity;
        case 'recentlyCreated':
          return b.id - a.id;
        default:
          return a.id - b.id;
      }
    });

  const stats = {
    total: tables.length,
    occupied: tables.filter((t) => t.status === 'Occupied').length,
    available: tables.filter((t) => t.status === 'Active').length,
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setZoneFilter('all');
    setSortBy('default');
  };

  const handleAddTable = () => {
    setShowAddDialog(true);
  };

  const handleCreateTable = (newTableData: {
    tableNumber: string;
    capacity: number;
    zone: string;
    status: 'Active' | 'Inactive';
  }) => {
    const newId = tables.length > 0 ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
    const newTable: Table = {
      id: newId,
      ...newTableData,
    };
    setTables([...tables, newTable]);
    setShowAddDialog(false);

    // Show success message and preview QR
    setTimeout(() => {
      setQrPreviewTable(newTable);
    }, 100);
  };

  const handleDownloadQR = () => {
    alert('Downloading all QR codes...');
  };

  const handleUpdateTable = (updatedTable: Table) => {
    setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
    setEditTable(null);
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">Table Management</h1>
            <p className="text-gray-600">Manage restaurant tables and monitor occupancy</p>
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

          <TableGrid tables={filteredTables} onQRPreview={setQrPreviewTable} onEdit={setEditTable} />
        </div>
      </div>

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


