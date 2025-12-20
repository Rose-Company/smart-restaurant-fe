import React from 'react';
import { Wifi } from 'lucide-react';
import type { Table } from '../../types/table.types';
import { QRCodeCanvas } from "qrcode.react";
interface PDFTemplateProps {
  table: Table;
  qrUrl: string | null;
}

export function PDFTemplate({ table, qrUrl }: PDFTemplateProps) {
  // Extract just the number from table number (e.g., "T-05" -> "05")
  const tableNumberDisplay =
    table.table_number.split('-')[1] ||
    table.table_number.slice(-2).padStart(2, '0');

  return (
    <div
      className="bg-white mx-auto relative overflow-hidden"
      style={{
        width: '105mm',
        height: '148mm',
        padding: 0,
        boxShadow:
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      {/* Header with Logo and Restaurant Name */}
      <div className="text-center px-6 relative z-10" style={{ paddingTop: '15px' }}>
        {/* Logo Circle with Icon */}
        <div
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #27ae60 0%, #2c3e50 100%)',
            marginBottom: '16px',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            style={{ width: '36px', height: '36px' }}
          >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
          </svg>
        </div>
        <h1
          className="text-[#2c3e50]"
          style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}
        >
          Smart Restaurant
        </h1>
      </div>

      {/* Table Number Badge - Top Right */}
      <div
        className="absolute rounded-xl flex items-center justify-center"
        style={{
          top: '20px',
          right: '20px',
          width: '52px',
          height: '52px',
          backgroundColor: '#2c3e50',
          zIndex: 20,
        }}
      >
        <span
          className="text-white"
          style={{
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          {tableNumberDisplay}
        </span>
      </div>

      {/* QR Code - Centered */}
      <div
        className="flex items-center justify-center"
        style={{ marginTop: '24px', marginBottom: '20px' }}
      >
        <div
          className="bg-white rounded-lg"
          style={{
            display: 'inline-block',
            padding: '16px',
            border: '4px solid #27ae60',
          }}
        >
          {qrUrl && (
            <QRCodeCanvas
              value={qrUrl}
              size={200}
              level="H"
            />
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="text-center px-6"
        style={{ marginTop: '20px', marginBottom: '28px' }}
      >
        <p
          className="text-[#2c3e50] mb-2"
          style={{
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.08em',
          }}
        >
          SCAN TO ORDER
        </p>
        <p
          className="text-gray-600"
          style={{
            fontSize: '11px',
            lineHeight: '1.5',
            fontWeight: 400,
          }}
        >
          Please scan this code to view our menu
          <br />
          and place your order
        </p>
      </div>

      {/* Table Info - Above Footer, Left Corner */}
      <div
        className="absolute text-gray-400"
        style={{
          bottom: '52px',
          left: '20px',
          fontSize: '9px',
          fontWeight: 400,
          zIndex: 5,
        }}
      >
        Table: {table.table_number} • {table.location}
      </div>

      {/* Footer - Full Width Gradient with WiFi Info Centered */}
      <div
        className="absolute text-white"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          padding: '12px 16px',
          background: 'linear-gradient(90deg, #27ae60 0%, #2c3e50 100%)',
          zIndex: 10,
        }}
      >
        <div
          className="flex items-center justify-center gap-2"
          style={{ margin: '0 auto' }}
        >
          <Wifi style={{ width: '16px', height: '16px' }} />
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            Free Guest WiFi:{' '}
            <span style={{ fontWeight: 600 }}>Restaurant_Guest_5G</span>
          </p>
        </div>
      </div>
    </div>
  );
}


