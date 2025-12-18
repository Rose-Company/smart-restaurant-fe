import { Plus, Download } from 'lucide-react';
import { Button } from '../../../components/ui/misc/button';

interface ActionBarProps {
  onAddTable: () => void;
  onDownloadQR: () => void;
}

export function ActionBar({ onAddTable, onDownloadQR }: ActionBarProps) {
  return (
    <div className="flex justify-end gap-3 mb-6">
      <Button
        onClick={onDownloadQR}
        variant="outline"
        className="border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
      >
        <Download className="w-4 h-4 mr-2" />
        Download All QR Codes
      </Button>
      <Button
        onClick={onAddTable}
        className="bg-[#27ae60] hover:bg-[#229954] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Table
      </Button>
    </div>
  );
}
