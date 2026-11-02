import React, { useMemo } from 'react';
import QRCode, { QRCodeErrorCorrectionLevel } from 'qrcode';

interface OfficialBarcodeProps {
  value?: string;
  className?: string;
  size?: number;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
}

export const OfficialBarcode: React.FC<OfficialBarcodeProps> = ({ 
  value = "KEJAKSAAN NEGERI MESUJI - SEKSI PAPBB",
  className = "w-24 h-24", 
  size,
  errorCorrectionLevel = 'M'
}) => {
  const qrData = useMemo(() => {
    try {
      // Use error correction M for optimal balance between readability and density
      const qr = QRCode.create(value || "KEJAKSAAN NEGERI MESUJI", {
        errorCorrectionLevel: (errorCorrectionLevel || 'M') as QRCodeErrorCorrectionLevel,
      });

      const modSize = qr.modules.size;
      const margin = 2; // Quiet zone required for reliable scanner reading
      const totalSize = modSize + margin * 2;

      let path = '';
      for (let r = 0; r < modSize; r++) {
        for (let c = 0; c < modSize; c++) {
          if (qr.modules.get(r, c)) {
            path += `M${c + margin},${r + margin}h1v1h-1z `;
          }
        }
      }

      return { totalSize, path, isValid: true };
    } catch (err) {
      console.error('Failed to generate QR Barcode:', err);
      return { totalSize: 25, path: '', isValid: false };
    }
  }, [value, errorCorrectionLevel]);

  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  if (!qrData.isValid) {
    return (
      <div 
        className={`${className} bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-mono border border-slate-300 rounded`}
        style={style}
      >
        QR Error
      </div>
    );
  }

  return (
    <svg 
      viewBox={`0 0 ${qrData.totalSize} ${qrData.totalSize}`} 
      className={`${className} bg-white`} 
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-label="Barcode / QR Code Resmi Identitas Barang Bukti"
    >
      {/* Crisp White Background / Quiet Zone */}
      <rect x="0" y="0" width={qrData.totalSize} height={qrData.totalSize} fill="#ffffff" />
      
      {/* Sharp Vector QR Modules */}
      <path d={qrData.path} fill="#000000" />
    </svg>
  );
};
