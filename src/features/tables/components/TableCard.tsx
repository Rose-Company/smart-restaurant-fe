import { QrCode, Edit, Users, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/misc/button';
import { Badge } from '../../../components/ui/data-display/badge';
import type { Table } from '../types/table.types';

interface TableCardProps {
  table: Table;
  onQRPreview: (table: Table) => void;
  onEdit: (table: Table) => void;
}

export function TableCard({ table, onQRPreview, onEdit }: TableCardProps) {
  const getStatusConfig = (status: Table['status']) => {
    switch (status) {
      case 'Active':
        return { color: 'bg-[#27ae60] text-white', label: 'Active' };
      case 'Occupied':
        return { color: 'bg-orange-500 text-white', label: 'Occupied' };
      case 'Inactive':
        return { color: 'bg-gray-400 text-white', label: 'Inactive' };
    }
  };

  const statusConfig = getStatusConfig(table.status);
  const isInactive = table.status === 'Inactive';
  const isOccupied = table.status === 'Occupied';

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${isInactive ? 'opacity-50 bg-gray-50' : ''
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`mb-1 ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>
            {table.tableNumber}
          </h3>
          <Badge className={`${statusConfig.color} border-0`}>
            {statusConfig.label}
          </Badge>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${isInactive ? 'bg-gray-400' : 'bg-[#2c3e50]'
            }`}
        >
          <span className="text-white">{table.tableNumber.split('-')[1] || table.tableNumber.slice(-2)}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className={`flex items-center gap-2 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`}>
          <Users className="w-4 h-4" />
          <span className="text-sm">Capacity: {table.capacity} people</span>
        </div>
        <div className={`flex items-center gap-2 ${isInactive ? 'text-gray-400' : 'text-gray-600'}`}>
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Zone: {table.zone}</span>
        </div>
      </div>

      {/* Session Info for Occupied Tables */}
      {isOccupied && table.orderData && (
        <div className="mb-4 bg-orange-50 rounded-lg p-3 border border-orange-100">
          <p className="text-xs text-orange-600 mb-2">Active Session</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-orange-700" />
              <span className="text-sm text-orange-900">
                Orders: <strong>{table.orderData.activeOrders}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-orange-700" />
              <span className="text-sm text-orange-900">
                Total: <strong>${table.orderData.totalBill.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Button
          onClick={() => onQRPreview(table)}
          variant="outline"
          size="sm"
          className={`flex-1 border-[#2c3e50] text-[#2c3e50] ${isInactive
              ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[#2c3e50]'
              : 'hover:bg-[#2c3e50] hover:text-white'
            }`}
          disabled={isInactive}
        >
          <QrCode className="w-4 h-4 mr-1" />
          QR Preview
        </Button>
        <Button
          onClick={() => onEdit(table)}
          variant="outline"
          size="sm"
          className="flex-1 border-[#27ae60] text-[#27ae60] hover:bg-[#27ae60] hover:text-white"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
}
