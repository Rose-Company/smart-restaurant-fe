import React from "react";
import { TableCard } from "./TableCard";
import type { UITable } from "../pages/TablesPage";   

interface TableGridProps {
  tables: UITable[];
  onQRPreview: (table: UITable) => void;
  onEdit: (table: UITable) => void;
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
