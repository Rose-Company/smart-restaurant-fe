import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import type { Table } from '../../types/table.types';
import { PDFTemplate } from './PDFTemplate';
import { useTranslation } from "react-i18next";
interface PDFPreviewDialogProps {
  table: Table;
  qrUrl: string | null;
  onClose: () => void;
}

export function PDFPreviewDialog({ table, onClose, qrUrl }: PDFPreviewDialogProps) {
  const {t} = useTranslation("table");
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Downloading print-ready PDF for ${table.table_number}...`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Dialog container: slightly narrower to hug the A6 card more closely */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-gray-900 mb-1">{t("qrPreview.pdf.title")}</h2>
            <p className="text-sm text-gray-500">
              {t("qrPreview.pdf.subtitle")} • {table.table_number}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PDF Preview */}
        <div
          className="p-8 overflow-auto"
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          <div className="flex justify-center">
            <PDFTemplate table={table} qrUrl={qrUrl} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-8 py-6 bg-white border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300"
          >
            {t("common.actions.close")}
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            variant="outline"
            className="flex-1 border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
             {t("common.actions.print")}
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            className="flex-1 bg-[#27ae60] hover:bg-[#229954] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
             {t("common.actions.download")}
          </Button>
        </div>
      </div>
    </div>
  );
}


