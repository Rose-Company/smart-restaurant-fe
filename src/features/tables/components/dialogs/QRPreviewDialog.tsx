import { X, Download, FileText, AlertTriangle, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Badge } from '../../../../components/ui/data-display/badge';
import type { Table } from '../../types/table.types';
import React, { useState, useEffect } from 'react';
import { PDFPreviewDialog } from './PDFPreviewDialog';
import { QRCodeCanvas } from "qrcode.react";
import { genQRApi, downloadSingleQRApi, getQRApi } from "../../services/qr.api";
import { ConfirmDialog } from '../../components/dialogs/ConfirmDialog'
interface QRPreviewDialogProps {
  table: Table;
  onClose: () => void;
  qrUrl?: string | null;
  create_at: string,
  expire_at: string,
}
import { useTranslation } from "react-i18next";
export function QRPreviewDialog({ table, onClose }: QRPreviewDialogProps) {
  const { t } = useTranslation("table");
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expire_at, setExpireAt] = useState('');
  const [create_at, setCreateAt] = useState('');

  const [showConfirmInactive, setShowConfirmInactive] = useState(false);
  useEffect(() => {
    const fetchQR = async () => {
      try {
        setLoading(true);
        const res = await getQRApi.fetch(table.id);

        setQrUrl(res.url);
        setCreateAt(res.create_at);
        setExpireAt(res.expire_at);
      } catch (error) {
        console.error("Failed to fetch QR", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [table.id]);

  const qrData = {
    lastScan: '2 hours ago',
    totalScans: 47,
  };
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isActive = expire_at
    ? new Date(expire_at).getTime() > Date.now()
    : false;

  const extractToken = (url: string) => {
    try {
      const params = new URL(url).searchParams;
      return params.get("token") || "";
    } catch (error) {
      console.error("Invalid URL", error);
      return "";
    }
  };
  const handleDownloadPNG = async () => {
    if (!qrUrl) return;

    const token = extractToken(qrUrl);

    try {
      const blob = await downloadSingleQRApi.fetch(table.id, token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${table.table_number}.png`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download QR failed:", error);
    }
  };

  const handleOpenPDFPreview = () => {
    setShowPDFPreview(true);
  };

  const handleRegenerateQR = async () => {
    const hasActiveOrders =
      table.order_data && table.order_data.active_orders > 0;

    if (hasActiveOrders) {
      setShowConfirmInactive(true);
      return;
    }
    RegenerateQR();
  }
  const RegenerateQR = async () => {
    try {
      setLoading(true);

      const res = await genQRApi.generate(table.id);

      setQrUrl(res.url);
      setCreateAt(res.create_at);
      setExpireAt(res.expire_at);

    } catch (error) {
      console.error("Failed to regenerate QR", error);
      alert("Failed to regenerate QR code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 mb-1">{t("qrPreview.header.title")}</h2>
            <p className="text-sm text-gray-500">{t("qrPreview.header.subtitle", { table: table.table_number })}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Left Side - QR Code Preview */}
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-full max-w-sm">
              <div className="">
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
                  {loading && (
                    <span className="text-sm text-gray-500">{t("qrPreview.loading.qr")}</span>
                  )}

                  {!loading && qrUrl && (
                    <QRCodeCanvas
                      value={qrUrl}
                      size={200}
                      level="H"
                    />
                  )}

                  {!loading && !qrUrl && (
                    <span className="text-sm text-red-500">
                      {t("qrPreview.loading.failed")}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-gray-900 mb-1">{table.table_number}</h3>
                <p className="text-sm text-gray-500">
                  {table.capacity} {table.capacity === 1 ? t("common.capacity.person") : t("common.capacity.people")} • {t(`common.zone.${table.location}`)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Table Details & Actions */}
          <div className="flex flex-col justify-between">
            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">{t("qrPreview.details.title")}</h3>

                <div className="space-y-4">
                  {/* Created Date */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-0.5">{t("qrPreview.details.createdDate")}</p>
                      <p className="text-gray-900">{create_at ? formatDate(create_at) : "--"}</p>
                    </div>
                  </div>

                  {/* Last Scan */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-0.5">{t("qrPreview.details.lastScanned")}</p>
                      <p className="text-gray-900">{qrData.lastScan}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{qrData.totalScans} {t("qrPreview.details.totalScans")}</p>
                    </div>
                  </div>

                  {/* Token Status */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1.5">{t("qrPreview.details.tokenStatus")}</p>
                      <Badge
                        className={
                          isActive
                            ? "bg-[#27ae60] text-white border-0"
                            : "bg-red-500 text-white border-0"
                        }
                      >
                        {isActive ? t("qrPreview.details.active") : t("qrPreview.details.expired")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-8">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleDownloadPNG}
                  variant="outline"
                  className="border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button
                  onClick={handleOpenPDFPreview}
                  variant="outline"
                  className="border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF (Print)
                </Button>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Button
                  onClick={handleRegenerateQR}
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Regenerate QR Code
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Warning: Previous QR code will become invalid
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPDFPreview && (
        <PDFPreviewDialog
          table={table}
          qrUrl={qrUrl}
          onClose={() => setShowPDFPreview(false)}
        />
      )}
      {showConfirmInactive && (
        <ConfirmDialog
          open={showConfirmInactive}
          title= {t("qrPreview.confirm.title")}
          description={
            <>
              <p>
                {t("qrPreview.confirm.hasOrders",{count:table.order_data?.active_orders})}
              </p>
              <p className="mt-2 text-red-600">
               {t("qrPreview.confirm.warning")}
              </p>
            </>
          }
          confirmText={t("qrPreview.confirm.yes")}
          cancelText={t("qrPreview.confirm.cancel")}
          confirmVariant="danger"
          onCancel={() => {
            setShowConfirmInactive(false);
          }}
          onConfirm={() => {
            RegenerateQR();
            setShowConfirmInactive(false);
          }}
        />
      )}
    </div>
  );
}
