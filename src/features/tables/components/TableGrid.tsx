import { TableCard } from './TableCard';
import type { Table } from '../types/table.types';

interface TableGridProps {
  tables: Table[];
  onQRPreview: (table: Table) => void;
  onEdit: (table: Table) => void;
}

export function TableGrid({ tables, onQRPreview, onEdit }: TableGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onQRPreview={onQRPreview}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
