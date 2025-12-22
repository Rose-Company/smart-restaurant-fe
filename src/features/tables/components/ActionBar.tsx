import { Plus, Download } from 'lucide-react';
import { Button } from '../../../components/ui/misc/button';
import React from "react";
import { useTranslation } from "react-i18next";
interface ActionBarProps {
  onAddTable: () => void;
  onDownloadQR: () => void;
}

export function ActionBar({ onAddTable, onDownloadQR }: ActionBarProps) {
  const {t} = useTranslation("table");
  return (
    <div className="flex justify-end gap-3 mb-6">
      <Button
        onClick={onDownloadQR}
        variant="outline"
        className="border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
      >
        <Download className="w-4 h-4 mr-2" />
        {t("tablePage.actions.downloadAllQR")}
      </Button>
      <Button
        onClick={onAddTable}
        className="bg-[#27ae60] hover:bg-[#229954] text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t("addDialog.title")}
      </Button>
    </div>
  );
}
