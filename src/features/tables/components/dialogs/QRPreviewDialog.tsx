import { X, Download, FileText, AlertTriangle, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Badge } from '../../../../components/ui/data-display/badge';
import type { Table } from '../../types/table.types';
import React, { useState } from 'react';
import { PDFPreviewDialog } from './PDFPreviewDialog';

interface QRPreviewDialogProps {
  table: Table;
  onClose: () => void;
}

export function QRPreviewDialog({ table, onClose }: QRPreviewDialogProps) {
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  // Mock data for demonstration
  const qrData = {
    createdDate: 'Dec 10, 2024',
    lastScan: '2 hours ago',
    totalScans: 47,
    tokenStatus: 'Active',
  };

  const handleDownloadPNG = () => {
    alert(`Downloading PNG QR code for ${table.tableNumber}`);
  };

  const handleOpenPDFPreview = () => {
    setShowPDFPreview(true);
  };

  const handleRegenerateQR = () => {
    if (confirm('Are you sure you want to regenerate this QR code? The old QR code will no longer work.')) {
      alert(`Regenerating QR code for ${table.tableNumber}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 mb-1">QR Code Management</h2>
            <p className="text-sm text-gray-500">Manage and download QR code for {table.tableNumber}</p>
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
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="200" height="200" fill="white" />
                    {/* QR Code Pattern */}
                    {[...Array(10)].map((_, i) =>
                      [...Array(10)].map((_, j) => {
                        const isBlack = (i + j) % 2 === 0 || (i === j) || (i + j === 9);
                        return (
                          <rect
                            key={`${i}-${j}`}
                            x={10 + i * 18}
                            y={10 + j * 18}
                            width="16"
                            height="16"
                            fill={isBlack ? '#2c3e50' : 'white'}
                          />
                        );
                      })
                    )}
                    {/* Corner markers */}
                    <rect x="10" y="10" width="50" height="50" fill="none" stroke="#27ae60" strokeWidth="4" />
                    <rect x="140" y="10" width="50" height="50" fill="none" stroke="#27ae60" strokeWidth="4" />
                    <rect x="10" y="140" width="50" height="50" fill="none" stroke="#27ae60" strokeWidth="4" />
                  </svg>
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-gray-900 mb-1">{table.tableNumber}</h3>
                <p className="text-sm text-gray-500">
                  {table.capacity} {table.capacity === 1 ? 'person' : 'people'} • {table.zone}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Table Details & Actions */}
          <div className="flex flex-col justify-between">
            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">QR Code Details</h3>

                <div className="space-y-4">
                  {/* Created Date */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-0.5">Created Date</p>
                      <p className="text-gray-900">{qrData.createdDate}</p>
                    </div>
                  </div>

                  {/* Last Scan */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-0.5">Last Scanned</p>
                      <p className="text-gray-900">{qrData.lastScan}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{qrData.totalScans} total scans</p>
                    </div>
                  </div>

                  {/* Token Status */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1.5">Token Status</p>
                      <Badge className="bg-[#27ae60] text-white border-0">
                        {qrData.tokenStatus}
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
          onClose={() => setShowPDFPreview(false)}
        />
      )}
    </div>
  );
}
