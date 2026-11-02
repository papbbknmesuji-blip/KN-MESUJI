import React, { useState, useRef, useEffect } from 'react';
import { RegisterPerkara, EvidenceItem } from '../types';
import { 
  Printer, 
  X, 
  CheckCircle, 
  QrCode, 
  Eye, 
  Copy, 
  Check, 
  Scale, 
  Gavel, 
  FileText, 
  MapPin, 
  Shield, 
  FileDown, 
  Loader2, 
  ChevronDown, 
  FileType, 
  Sparkles,
  User,
  Tag,
  Edit3,
  FileCheck,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDateIndo, getStatusPerkaraBadge } from '../utils/formatters';
import { KejaksaanLogo } from './KejaksaanLogo';
import { OfficialBarcode } from './OfficialBarcode';

interface EvidenceLabelModalProps {
  register: RegisterPerkara | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRegister?: (updated: RegisterPerkara) => void;
}

const getStatusPemulihanText = (status?: string): string => {
  switch (status) {
    case 'DIRAMPAS_LELANG':
    case 'PROSES_LELANG':
    case 'PROSES_LELANG_KPKNL':
      return 'Dirampas Lelang';
    case 'TERJUAL_LELANG':
      return 'Terjual Lelang';
    case 'DIKEMBALIKAN':
      return 'Dikembalikan';
    case 'DIMUSNAHKAN':
      return 'Dimusnahkan';
    case 'DISETOR_KAS_NEGARA':
    case 'DISETOR_PNBP':
      return 'Disetor Kas Negara';
    case 'TAHAP_SITA':
    default:
      return 'Tahap Sita';
  }
};

const getStatusPerkaraLabel = (status: string): string => {
  switch (status) {
    case 'TAHAP_PENUNTUTAN':
      return 'Tahap Penuntutan (Tahap II)';
    case 'PERSIDANGAN':
      return 'Proses Persidangan';
    case 'INKRACHT':
      return 'Inkracht (Berkekuatan Hukum Tetap)';
    case 'INKRACHT_DIKEMBALIKAN':
      return 'Inkracht - Dikembalikan';
    case 'INKRACHT_DIRAMPAS_NEGARA':
      return 'Inkracht - Dirampas untuk Negara';
    case 'INKRACHT_DIMUSNAHKAN':
      return 'Inkracht - Dimusnahkan';
    case 'PENITIPAN_RUPBASAN':
      return 'Penitipan RUPBASAN';
    default:
      return (status || '-').replace(/_/g, ' ');
  }
};

export const EvidenceLabelModal: React.FC<EvidenceLabelModalProps> = ({
  register,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !register) return null;

  const [scanPreview, setScanPreview] = useState<{ title: string; text: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = useState<string | null>(null);
  const [pdfFormat, setPdfFormat] = useState<'a4' | 'label'>('a4');
  const [namingOption, setNamingOption] = useState<'tersangka_rb' | 'tersangka_only' | 'rb_only'>('tersangka_rb');
  const [customFileNameInput, setCustomFileNameInput] = useState<string>('');
  const [showFormatDropdown, setShowFormatDropdown] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const pagesContainerRef = useRef<HTMLDivElement>(null);

  const [activeSheet, setActiveSheet] = useState<number | 'all'>(1);

  // Reset tampilan ke Sheet 1 saat modal dibuka atau perkara berganti
  useEffect(() => {
    setActiveSheet(1);
  }, [register?.id, isOpen]);

  // Aturan Pagination: 1 Halaman maksimal 10 Barang Bukti, dilanjutkan ke lembar berikutnya
  const ITEMS_PER_PAGE = 10;
  const totalItems = register.barangBuktiList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const pagesData = [];
  for (let p = 0; p < totalPages; p++) {
    const startIdx = p * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const pageItems = register.barangBuktiList.slice(startIdx, endIdx);
    pagesData.push({
      pageNumber: p + 1,
      startNumber: startIdx + 1,
      endNumber: Math.min(endIdx, totalItems),
      items: pageItems,
      isFirstPage: p === 0,
      isLastPage: p === totalPages - 1,
    });
  }

  const handlePrint = () => {
    window.print();
  };

  const cleanForFilename = (str: string) => {
    return (str || '')
      .trim()
      .replace(/[/\\?%*:|"<>]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_');
  };

  const getFileNameByOption = (
    opt: 'tersangka_rb' | 'tersangka_only' | 'rb_only',
    fmt: 'a4' | 'label' = pdfFormat,
    sheetTarget?: number | 'all'
  ) => {
    const cleanTersangka = cleanForFilename(register.namaTersangka) || 'TERDAFTAR';
    const cleanRb = cleanForFilename(register.registerBarangBukti) || 'RB';
    const formatTag = fmt === 'label' ? '_Stiker' : '_A4';
    const sheetTag = typeof sheetTarget === 'number' ? `_Sheet${sheetTarget}` : '';

    switch (opt) {
      case 'tersangka_rb':
        return `Label_BB_${cleanTersangka}_${cleanRb}${sheetTag}${formatTag}.pdf`;
      case 'tersangka_only':
        return `Label_BB_${cleanTersangka}${sheetTag}${formatTag}.pdf`;
      case 'rb_only':
        return `Label_BB_${cleanRb}${sheetTag}${formatTag}.pdf`;
      default:
        return `Label_BB_${cleanTersangka}_${cleanRb}${sheetTag}${formatTag}.pdf`;
    }
  };

  const effectiveFileName = customFileNameInput.trim()
    ? (customFileNameInput.trim().endsWith('.pdf') ? customFileNameInput.trim() : `${customFileNameInput.trim()}.pdf`)
    : getFileNameByOption(namingOption, pdfFormat, activeSheet);

  // Fungsi simpan PDF per-sheet atau multi-halaman
  const handleSavePdf = async (
    format: 'a4' | 'label' = pdfFormat,
    scope: 'all' | 'active' = 'all',
    customOpt?: 'tersangka_rb' | 'tersangka_only' | 'rb_only'
  ) => {
    if (!pagesContainerRef.current) return;

    setIsExportingPdf(true);
    setShowFormatDropdown(false);
    const previousActive = activeSheet;

    try {
      let targetCards: HTMLElement[] = [];

      if (scope === 'active' && typeof activeSheet === 'number') {
        const el = document.getElementById(
          activeSheet === 1 ? 'sticker-label-card' : `sticker-label-card-page-${activeSheet}`
        );
        if (el) {
          targetCards = [el];
        }
      } else {
        // Mode export seluruh sheet: tampilkan semua lembar sementara agar di-render oleh React
        if (activeSheet !== 'all') {
          setActiveSheet('all');
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        // Ambil elemen berdasarkan urutan sheet
        for (let p = 1; p <= totalPages; p++) {
          const el = document.getElementById(
            p === 1 ? 'sticker-label-card' : `sticker-label-card-page-${p}`
          );
          if (el) {
            targetCards.push(el);
          }
        }
      }

      // Fallback jika pencarian by ID kosong
      if (targetCards.length === 0) {
        const allPageCards = Array.from(
          pagesContainerRef.current.querySelectorAll('.sticker-page-card')
        ) as HTMLElement[];
        targetCards = (scope === 'active' && typeof activeSheet === 'number')
          ? [allPageCards.find(el => el.getAttribute('data-sheet-number') === String(activeSheet)) || allPageCards[activeSheet - 1] || allPageCards[0]]
          : allPageCards;
      }

      if (targetCards.length === 0) return;

      let pdf: jsPDF | null = null;
      const totalExportCount = targetCards.length;

      for (let idx = 0; idx < totalExportCount; idx++) {
        const pageEl = targetCards[idx];
        const sheetNumAttr = pageEl.getAttribute('data-sheet-number');
        const sheetDisplayNum = sheetNumAttr ? sheetNumAttr : (idx + 1);

        setExportProgressText(
          totalExportCount > 1 
            ? `Membuat PDF Halaman ${idx + 1} dari ${totalExportCount} (Sheet ${sheetDisplayNum})...` 
            : `Membuat PDF Sheet ${sheetDisplayNum}...`
        );
        
        const canvas = await html2canvas(pageEl, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
        });

        const imgData = canvas.toDataURL('image/png', 1.0);

        if (format === 'label') {
          // Custom sticker size: proportional to the label card aspect ratio
          const stickerWidthMm = 150;
          const stickerHeightMm = (canvas.height * stickerWidthMm) / canvas.width;
          const orientation = stickerWidthMm > stickerHeightMm ? 'l' : 'p';
          
          if (!pdf) {
            pdf = new jsPDF({
              orientation,
              unit: 'mm',
              format: [stickerWidthMm, stickerHeightMm],
            });
          } else {
            pdf.addPage([stickerWidthMm, stickerHeightMm], orientation);
          }
          
          pdf.addImage(imgData, 'PNG', 0, 0, stickerWidthMm, stickerHeightMm, undefined, 'FAST');
        } else {
          // Standard A4 sheet format (210 x 297 mm)
          const pageWidth = 210;
          const pageHeight = 297;
          const margin = 8;
          const availableWidth = pageWidth - margin * 2;
          const availableHeight = pageHeight - margin * 2;
          
          let imgWidth = availableWidth;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (imgHeight > availableHeight) {
            imgHeight = availableHeight;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
          }
          
          const posX = (pageWidth - imgWidth) / 2;
          const posY = (pageHeight - imgHeight) / 2;
          
          if (!pdf) {
            pdf = new jsPDF({
              orientation: 'p',
              unit: 'mm',
              format: 'a4',
            });
          } else {
            pdf.addPage('a4', 'p');
          }
          
          pdf.addImage(imgData, 'PNG', posX, posY, imgWidth, imgHeight, undefined, 'FAST');
        }
      }

      const chosenOpt = customOpt || namingOption;
      const sheetParam = scope === 'active' ? activeSheet : 'all';
      const targetFileName = customFileNameInput.trim()
        ? (customFileNameInput.trim().endsWith('.pdf') ? customFileNameInput.trim() : `${customFileNameInput.trim()}.pdf`)
        : getFileNameByOption(chosenOpt, format, sheetParam);

      if (pdf) {
        pdf.save(targetFileName);
        const descMsg = (scope === 'active' && typeof activeSheet === 'number')
          ? `Sheet ${activeSheet} (1 Halaman)`
          : `${totalExportCount} Halaman Lengkap Sesuai Daftar BB`;
        setPdfSuccessMessage(
          `File PDF (${descMsg}) berhasil disimpan: "${targetFileName}" (a.n. ${register.namaTersangka})`
        );
        setTimeout(() => setPdfSuccessMessage(null), 6000);
      }
    } catch (error) {
      console.error('Gagal membuat PDF:', error);
      alert('Gagal mengekspor PDF secara otomatis. Membuka dialog cetak browser (Anda dapat memilih "Save as PDF" / "Simpan sebagai PDF").');
      window.print();
    } finally {
      if (scope === 'all' && previousActive !== 'all') {
        setActiveSheet(previousActive);
      }
      setIsExportingPdf(false);
      setExportProgressText(null);
    }
  };

  const handleCopyScanText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Human readable labels
  const statusPerkaraText = getStatusPerkaraLabel(register.statusPerkara);
  const statusPerkaraBadge = getStatusPerkaraBadge(register.statusPerkara);
  
  const putusanText = register.amarPutusan
    ? register.amarPutusan
    : (register.statusPerkara === 'PERSIDANGAN'
        ? 'Dalam Proses Persidangan (Belum Ada Putusan Pengadilan)'
        : 'Tahap Penuntutan / Pra-Sidang (Belum Ada Putusan Pengadilan)');

  // Helper untuk parsing daftar Jaksa Penuntut Umum agar nomor urut ke bawah
  const getJaksaList = (jaksaPU?: string[] | string): string[] => {
    if (!jaksaPU) return [];
    const rawList = Array.isArray(jaksaPU) ? jaksaPU : [jaksaPU];
    const results: string[] = [];
    rawList.forEach((j) => {
      if (typeof j === 'string') {
        j.split(/\r?\n|;/).forEach((part) => {
          const cleaned = part.trim().replace(/^\d+[\.\)]\s*/, '');
          if (cleaned) results.push(cleaned);
        });
      }
    });
    return results.length > 0 ? results : (Array.isArray(jaksaPU) ? jaksaPU : []);
  };

  const jaksaList = getJaksaList(register.jaksaPU);

  // Payload barcode memuat seluruh identitas, status penanganan perkara, putusan, dan daftar seluruh BB
  const generateUnifiedBarcodePayload = (reg: RegisterPerkara): string => {
    const rawPutusan = reg.amarPutusan || '';
    const putusanForBarcode = rawPutusan
      ? `${reg.tanggalPutusan ? `[Tgl: ${formatDateIndo(reg.tanggalPutusan)}] ` : ''}${rawPutusan.length > 180 ? rawPutusan.substring(0, 177) + '...' : rawPutusan}`
      : (reg.statusPerkara === 'PERSIDANGAN'
          ? 'Dalam Proses Persidangan (Belum Putus)'
          : 'Tahap Penuntutan / Pra-Sidang (Belum Putus)');

    const currentJaksaList = getJaksaList(reg.jaksaPU);
    const jaksaBarcodeText = currentJaksaList.length > 0
      ? currentJaksaList.map((j, idx) => `  ${idx + 1}. ${j}`).join('\n')
      : (reg.jaksaPU && reg.jaksaPU.length > 0 ? reg.jaksaPU.join('; ') : '-');

    const lines = [
      'KEJAKSAAN NEGERI MESUJI - SEKSI PAPBB',
      'LABEL IDENTITAS BARANG BUKTI (STIKER RESMI)',
      `No. Register BB (RB): ${reg.registerBarangBukti}`,
      `No. Register Perkara: ${reg.registerPerkara}`,
      `Surat Perintah Penerimaan: ${reg.suratPenerimaan}`,
      `Tanggal Penerimaan: ${formatDateIndo(reg.tanggalPenerimaan)}`,
      `Tersangka: ${reg.namaTersangka}`,
      `Pasal: ${reg.pasal}`,
      `Jaksa Penuntut Umum:\n${jaksaBarcodeText}`,
      `STATUS PENANGANAN PERKARA: ${statusPerkaraText}`,
      `PUTUSAN PENGADILAN: ${putusanForBarcode}`,
      `TOTAL BARANG BUKTI: ${reg.barangBuktiList.length} Item`,
      '--- DAFTAR SELURUH BARANG BUKTI ---',
      ...reg.barangBuktiList.map((item, idx) => {
        const itemLine = `${idx + 1}. ${item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}${item.namaBarang} [${item.jenisBarang}]`;
        const itemSpecs = item.spesifikasi ? `   Spesifikasi: ${item.spesifikasi}` : '';
        const itemStatus = `   Status Pemulihan Aset: ${getStatusPemulihanText(item.statusPemulihanAset)} | Lokasi: ${item.lokasiPenyimpanan}`;
        return [itemLine, itemSpecs, itemStatus].filter(Boolean).join('\n');
      }),
    ];
    return lines.join('\n');
  };

  const barcodePayload = generateUnifiedBarcodePayload(register);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden print:border-none print:shadow-none print:max-w-none">
        
        {/* Header Kontrol Modal (Hidden Saat Dicetak) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/95 rounded-xl shadow-xs border border-white/20 flex items-center justify-center">
              <KejaksaanLogo className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-wide flex items-center gap-2 flex-wrap">
                <span>Stiker Label Identitas Barang Bukti</span>
                <span className="bg-emerald-800/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-600/50">
                  {totalItems} Barang Bukti
                </span>
                {totalPages > 1 && (
                  <span className="bg-amber-800/80 text-amber-200 text-[10px] px-2 py-0.5 rounded font-mono border border-amber-600/50 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{totalPages} Lembar (10 BB/Halaman)</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                1 Halaman memuat 10 Barang Bukti &amp; dilanjutkan otomatis ke lembar halaman berikutnya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tombol Pratinjau Scan Barcode */}
            <button
              type="button"
              onClick={() => setScanPreview({ title: 'Label Identitas Barang Bukti', text: barcodePayload })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Pratinjau Hasil Scan</span>
              <span className="sm:hidden">Scan</span>
            </button>

            {/* Pilihan Save PDF (Split-Button & Dropdown Format dengan Penamaan Berdasarkan Nama Tersangka) */}
            <div className="relative inline-flex rounded-lg shadow-sm">
              <button
                type="button"
                onClick={() => handleSavePdf(pdfFormat, 'all')}
                disabled={isExportingPdf}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-l-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold transition cursor-pointer"
                title={`Simpan PDF (${totalPages} Lembar Sesuai Daftar BB): ${effectiveFileName}`}
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{exportProgressText || 'Menyimpan PDF...'}</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-blue-200" />
                    <span className="hidden md:inline">
                      Simpan PDF {totalPages > 1 ? `(${totalPages} Hlm Sesuai BB)` : ''} (a.n. {register.namaTersangka})
                    </span>
                    <span className="hidden sm:inline md:hidden">
                      Simpan PDF {totalPages > 1 ? `(${totalPages} Hlm)` : ''} ({register.namaTersangka.slice(0, 10)}...)
                    </span>
                    <span className="sm:hidden">
                      PDF {totalPages > 1 ? `(${totalPages} Hlm)` : 'Tersangka'}
                    </span>
                  </>
                )}
              </button>

              {totalPages > 1 && typeof activeSheet === 'number' && (
                <button
                  type="button"
                  onClick={() => handleSavePdf(pdfFormat, 'active')}
                  disabled={isExportingPdf}
                  className="hidden lg:inline-flex items-center gap-1 px-2.5 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-blue-900 text-white text-xs font-semibold border-l border-blue-500 transition cursor-pointer"
                  title={`Simpan hanya Sheet ${activeSheet} (1 Halaman)`}
                >
                  <span>Sheet {activeSheet} Saja</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowFormatDropdown((prev) => !prev)}
                disabled={isExportingPdf}
                className="px-2.5 py-2 rounded-r-lg bg-blue-800 hover:bg-blue-700 disabled:bg-blue-950 text-white text-xs border-l border-blue-600 transition cursor-pointer"
                title="Pilihan Format, Cakupan Sheet & Nama File PDF"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showFormatDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover Menu Pilihan Format & Penamaan File PDF Berdasarkan Tersangka */}
              {showFormatDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFormatDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>Simpan PDF Sesuai Halaman</span>
                        </span>
                        <div className="text-xs font-black text-slate-900 truncate max-w-[200px]">
                          {register.namaTersangka}
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold">
                        PDF Resmi
                      </span>
                    </div>

                    <div className="p-3 space-y-3">
                      {/* Opsi Cakupan Sheet */}
                      {totalPages > 1 && (
                        <div>
                          <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-500" />
                            <span>Pilih Lembar PDF yang Disimpan:</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                handleSavePdf(pdfFormat, 'active');
                              }}
                              className="p-2 rounded-lg text-left border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-950 font-semibold transition cursor-pointer"
                            >
                              <div className="font-bold flex items-center justify-between">
                                <span>Sheet {activeSheet === 'all' ? 1 : activeSheet} Saja</span>
                                <Check className="w-3 h-3 text-blue-600" />
                              </div>
                              <div className="text-[10px] text-blue-700 font-normal mt-0.5">
                                Simpan 1 lembar aktif
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleSavePdf(pdfFormat, 'all');
                              }}
                              className="p-2 rounded-lg text-left border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold transition cursor-pointer"
                            >
                              <div className="font-bold flex items-center justify-between">
                                <span>Semua Sheet</span>
                                <span className="text-[9px] bg-slate-200 px-1 py-0.2 rounded font-mono font-bold">{totalPages} Hlm</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                                Multi-halaman lengkap
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Opsi Penamaan File Berdasarkan Nama Tersangka */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-500" />
                            <span>Format Nama File PDF:</span>
                          </span>
                          <span className="text-[10px] text-blue-600 font-semibold">Tersangka Aktif</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <label 
                            onClick={() => {
                              setNamingOption('tersangka_rb');
                              setCustomFileNameInput('');
                            }}
                            className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                              namingOption === 'tersangka_rb' && !customFileNameInput
                                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium'
                                : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="namingOption"
                              checked={namingOption === 'tersangka_rb' && !customFileNameInput}
                              onChange={() => {
                                setNamingOption('tersangka_rb');
                                setCustomFileNameInput('');
                              }}
                              className="mt-0.5 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[11px] flex items-center justify-between">
                                <span>Nama Tersangka + No. RB (Rekomendasi)</span>
                                {namingOption === 'tersangka_rb' && !customFileNameInput && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                                {getFileNameByOption('tersangka_rb', pdfFormat)}
                              </p>
                            </div>
                          </label>

                          <label 
                            onClick={() => {
                              setNamingOption('tersangka_only');
                              setCustomFileNameInput('');
                            }}
                            className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                              namingOption === 'tersangka_only' && !customFileNameInput
                                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium'
                                : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="namingOption"
                              checked={namingOption === 'tersangka_only' && !customFileNameInput}
                              onChange={() => {
                                setNamingOption('tersangka_only');
                                setCustomFileNameInput('');
                              }}
                              className="mt-0.5 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[11px] flex items-center justify-between">
                                <span>Hanya Nama Tersangka</span>
                                {namingOption === 'tersangka_only' && !customFileNameInput && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                                {getFileNameByOption('tersangka_only', pdfFormat)}
                              </p>
                            </div>
                          </label>

                          <label 
                            onClick={() => {
                              setNamingOption('rb_only');
                              setCustomFileNameInput('');
                            }}
                            className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                              namingOption === 'rb_only' && !customFileNameInput
                                ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium'
                                : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="namingOption"
                              checked={namingOption === 'rb_only' && !customFileNameInput}
                              onChange={() => {
                                setNamingOption('rb_only');
                                setCustomFileNameInput('');
                              }}
                              className="mt-0.5 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[11px] flex items-center justify-between">
                                <span>No. Register BB Saja</span>
                                {namingOption === 'rb_only' && !customFileNameInput && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                                {getFileNameByOption('rb_only', pdfFormat)}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Input Kustom Nama File */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <Edit3 className="w-3 h-3 text-slate-400" />
                          <span>Nama File Terpilih (Dapat Diedit Manual):</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={customFileNameInput || effectiveFileName}
                            onChange={(e) => setCustomFileNameInput(e.target.value)}
                            placeholder="Contoh: Label_BB_NAMA_TERSANGKA.pdf"
                            className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                          />
                          {customFileNameInput && (
                            <button
                              type="button"
                              onClick={() => setCustomFileNameInput('')}
                              className="text-[10px] text-slate-500 hover:text-slate-700 underline px-1.5 shrink-0"
                              title="Reset ke nama otomatis tersangka"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Format Kertas / Dimensi Dokumen */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <FileType className="w-3 h-3 text-slate-500" />
                          <span>Format Kertas / Dimensi:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPdfFormat('a4')}
                            className={`p-2 rounded-lg text-left border transition cursor-pointer ${
                              pdfFormat === 'a4'
                                ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                                : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span>Kertas A4</span>
                              {pdfFormat === 'a4' && <Check className="w-3 h-3 text-blue-600" />}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5 leading-tight">
                              Pas 1 lembar A4
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPdfFormat('label')}
                            className={`p-2 rounded-lg text-left border transition cursor-pointer ${
                              pdfFormat === 'label'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span>Ukuran Stiker</span>
                              {pdfFormat === 'label' && <Check className="w-3 h-3 text-emerald-600" />}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5 leading-tight">
                              Pas stiker adhesive
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Tombol Unduh PDF Langsung */}
                      <button
                        type="button"
                        onClick={() => handleSavePdf(pdfFormat)}
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition cursor-pointer mt-1"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Unduh PDF Atas Nama Tersangka</span>
                      </button>
                    </div>

                    <div className="px-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
                      Format nama file mempermudah pengarsipan berkas perkara di komputer.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tombol Cetak Browser Langsung */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              title="Cetak Langsung via Printer Bawaan Browser"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Stiker Label</span>
              <span className="sm:hidden">Cetak</span>
            </button>

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifikasi Keberhasilan Export PDF */}
        {pdfSuccessMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between shadow-inner print:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
              <span className="truncate">{pdfSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setPdfSuccessMessage(null)}
              className="text-emerald-200 hover:text-white text-xs underline cursor-pointer shrink-0 ml-2"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Baris Panduan & Opsi Simpan PDF (Hanya di Layar, Sembunyi Saat Cetak) */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 print:hidden gap-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Simpan PDF Berdasarkan Tersangka:</strong> Berkas PDF otomatis dinamai berdasarkan nama tersangka <strong>{register.namaTersangka}</strong> (<code>{effectiveFileName}</code>). Klik tanda panah untuk opsi format &amp; nama file kustom.
            </span>
          </div>
          <div className="text-[11px] text-slate-600 font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-300 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
            <span className="text-slate-400">Tersangka:</span>
            <span className="text-slate-900">{register.namaTersangka}</span>
          </div>
        </div>

        {/* TAB NAVIGASI SHEET SESUAI HALAMAN (PADA SAAT MAU SIMPAN PDF) */}
        {totalPages > 1 && (
          <div className="bg-slate-200/80 border-b border-slate-300 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 print:hidden">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-800 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Tampilan Sheet:</span>
              </span>
              {pagesData.map((p) => {
                const isActive = activeSheet === p.pageNumber;
                return (
                  <button
                    key={p.pageNumber}
                    type="button"
                    onClick={() => setActiveSheet(p.pageNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    <span>Sheet {p.pageNumber}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setActiveSheet('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeSheet === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <span>Semua Sheet</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${activeSheet === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                  {totalPages} Lembar
                </span>
              </button>
            </div>

            {/* Quick pagination navigation jika memilih per-sheet */}
            {activeSheet !== 'all' && (
              <div className="flex items-center gap-1.5 text-xs self-end sm:self-auto">
                <button
                  type="button"
                  disabled={activeSheet <= 1}
                  onClick={() => setActiveSheet((prev) => (typeof prev === 'number' ? Math.max(1, prev - 1) : 1))}
                  className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer"
                  title="Sheet Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>
                <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-300">
                  Sheet {activeSheet} dari {totalPages}
                </span>
                <button
                  type="button"
                  disabled={activeSheet >= totalPages}
                  onClick={() => setActiveSheet((prev) => (typeof prev === 'number' ? Math.min(totalPages, prev + 1) : totalPages))}
                  className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer"
                  title="Sheet Berikutnya"
                >
                  <span className="hidden sm:inline">Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Printable Area - 1 Halaman 10 Barang Bukti & Dilanjutkan ke Lembar Halaman Selanjutnya */}
        <div ref={pagesContainerRef} className="p-3 sm:p-6 space-y-6 print:p-0 print:space-y-0">
          {pagesData.map((page) => {
            const isVisibleOnScreen = activeSheet === 'all' || activeSheet === page.pageNumber;
            return (
              <div 
                key={page.pageNumber} 
                className={`relative ${isVisibleOnScreen ? 'block' : 'hidden print:block'}`}
              >
                {/* Petunjuk Lembar di Layar (Disembunyikan saat cetak) */}
                {totalPages > 1 && (
                  <div className="print:hidden mb-2 flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
                    <span className="bg-slate-900 text-white text-[10px] font-mono px-2.5 py-0.5 rounded font-bold">
                      Lembar {page.pageNumber} dari {totalPages}
                    </span>
                  </div>
                )}

                {/* Kartu Halaman Cetak (Class: sticker-page-card) */}
                <div 
                  id={page.isFirstPage ? "sticker-label-card" : `sticker-label-card-page-${page.pageNumber}`}
                  data-sheet-number={page.pageNumber}
                  className="sticker-page-card border-2 sm:border-3 border-slate-900 rounded-xl p-4 sm:p-5 bg-white relative print:border-2 print:border-black print:rounded-none print:p-3.5 shadow-sm print:break-after-page print:page-break-after-always last:print:break-after-auto last:print:page-break-after-auto"
                >
                {page.isFirstPage ? (
                  <>
                    {/* KOP RESMI KEJAKSAAN */}
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2.5 mb-3">
                      <div className="flex items-center gap-3">
                        <KejaksaanLogo className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 leading-tight">
                            KEJAKSAAN REPUBLIK INDONESIA • KEJAKSAAN TINGGI LAMPUNG
                          </div>
                          <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                            KEJAKSAAN NEGERI MESUJI
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-900 uppercase">
                            SEKSI PEMULIHAN ASET DAN PENGELOLAAN BARANG BUKTI (PAPBB)
                          </div>
                          <h3 className="text-xs sm:text-sm font-black tracking-wide text-slate-950 uppercase mt-0.5">
                            LABEL IDENTITAS BARANG BUKTI
                          </h3>
                        </div>
                      </div>

                      {/* Box No Register & Klasifikasi */}
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
                          <span>RB:</span>
                          <span>{register.registerBarangBukti}</span>
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-slate-600 font-semibold">
                          Kode: <span className="font-mono font-bold text-slate-900">{register.kodePerkara}</span> • Periode: <span className="font-mono text-slate-900">{register.bulan || register.tanggalPenerimaan.split('-')[1]}/{register.tahun || register.tanggalPenerimaan.split('-')[0]}</span>
                        </div>
                        {totalPages > 1 && (
                          <div className="text-[9px] font-mono text-slate-700 font-bold">
                            Halaman 1 dari {totalPages}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* GRID DATA PERKARA & BARCODE */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      
                      {/* Kolom Kiri: Rincian Perkara (3 Kolom) */}
                      <div className="sm:col-span-3 space-y-1.5">
                        
                        <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                          <span className="text-slate-600 font-semibold text-[11px]">No. Register Perkara:</span>
                          <span className="col-span-2 font-mono font-bold text-slate-950 text-xs sm:text-sm">
                            {register.registerPerkara}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                          <span className="text-slate-600 font-semibold text-[11px]">Surat Perintah Penerimaan:</span>
                          <span className="col-span-2 font-mono font-semibold text-slate-900 text-[11px]">
                            {register.suratPenerimaan}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                          <span className="text-slate-600 font-semibold text-[11px]">Tanggal Penerimaan:</span>
                          <span className="col-span-2 font-bold text-slate-900 text-xs">
                            {formatDateIndo(register.tanggalPenerimaan)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                          <span className="text-slate-600 font-semibold text-[11px]">Nama Tersangka:</span>
                          <span className="col-span-2 font-black text-slate-950 uppercase text-xs sm:text-sm">
                            {register.namaTersangka}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 border-b border-slate-200 pb-1">
                          <span className="text-slate-600 font-semibold text-[11px]">Pasal / Dakwaan:</span>
                          <span className="col-span-2 text-slate-900 font-medium text-[11px]">
                            {register.pasal}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 border-b border-slate-200 pb-1.5 items-start">
                          <span className="text-slate-600 font-semibold text-[11px] pt-0.5">Jaksa Penuntut Umum:</span>
                          <div className="col-span-2">
                            {jaksaList.length > 0 ? (
                              <ol className="space-y-0.5 list-none">
                                {jaksaList.map((jaksa, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5 text-slate-900 font-medium text-[11px] leading-snug">
                                    <span className="font-bold text-slate-700 shrink-0 text-[10.5px]">{idx + 1}.</span>
                                    <span className="uppercase">{jaksa}</span>
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">-</span>
                            )}
                          </div>
                        </div>

                        {/* SECTION WAJIB: STATUS PENANGANAN PERKARA & PUTUSAN PENGADILAN */}
                        <div className="border border-slate-800 bg-slate-50/80 rounded-lg p-2 my-1 space-y-1.5">
                          
                          {/* Status Penanganan Perkara */}
                          <div className="grid grid-cols-3 items-center">
                            <span className="text-slate-800 font-bold uppercase text-[10px] sm:text-[11px] flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-slate-700" />
                              <span>Status Penanganan Perkara:</span>
                            </span>
                            <div className="col-span-2">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${statusPerkaraBadge.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusPerkaraBadge.dot}`}></span>
                                <span>{statusPerkaraText}</span>
                              </span>
                            </div>
                          </div>

                          {/* Putusan Pengadilan / Amar Putusan */}
                          <div className="grid grid-cols-3 items-start pt-1 border-t border-slate-300">
                            <span className="text-slate-800 font-bold uppercase text-[10px] sm:text-[11px] flex items-center gap-1.5 pt-0.5">
                              <Gavel className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                              <span>Putusan Pengadilan:</span>
                            </span>

                            <div className="col-span-2">
                              {register.amarPutusan && register.amarPutusan.trim() ? (
                                <div className="bg-white border border-slate-300 rounded p-1.5 text-[11px] leading-snug text-slate-950 font-medium">
                                  {register.tanggalPutusan && (
                                    <div className="text-[9px] font-bold text-slate-600 mb-1 uppercase font-mono pb-0.5 border-b border-slate-200">
                                      Tanggal Putusan: {formatDateIndo(register.tanggalPutusan)}
                                    </div>
                                  )}
                                  <div className="space-y-1 font-medium text-slate-950 text-[10.5px] sm:text-[11px]">
                                    {register.amarPutusan.split(/\r?\n/).map((baris, idx) => {
                                      const trimmed = baris.trim();
                                      if (!trimmed) {
                                        return <div key={idx} className="h-1.5" />;
                                      }
                                      return (
                                        <div 
                                          key={idx} 
                                          className="leading-snug break-words whitespace-pre-wrap font-sans"
                                        >
                                          {baris}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-600 italic bg-white border border-slate-200 rounded px-2 py-1">
                                  {register.statusPerkara === 'PERSIDANGAN'
                                    ? 'Sedang Dalam Proses Persidangan (Belum Ada Putusan Pengadilan / Inkracht)'
                                    : 'Tahap Penuntutan / Pra-Sidang (Belum Ada Putusan Pengadilan)'}
                                </div>
                              )}
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Kolom Kanan: QR Barcode & Scan Box */}
                      <div className="flex flex-col items-center justify-between border-t sm:border-t-0 sm:border-l-2 border-slate-900 pt-2 sm:pt-0 sm:pl-3">
                        <div className="text-center w-full">
                          <div 
                            onClick={() => setScanPreview({ title: 'Label Identitas Barang Bukti', text: barcodePayload })}
                            title="Klik untuk melihat teks hasil scan"
                            className="w-28 h-28 sm:w-32 sm:h-32 mx-auto bg-white border-2 border-slate-900 rounded p-1 flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-emerald-500 transition"
                          >
                            <OfficialBarcode 
                              value={barcodePayload} 
                              errorCorrectionLevel="L"
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div className="font-mono text-[10px] font-bold text-slate-950 mt-1">
                            {register.registerBarangBukti}
                          </div>
                          <div className="text-[8px] sm:text-[9px] text-slate-600 font-semibold uppercase tracking-wider">
                            Scan Barcode PAPBB
                          </div>

                          <button
                            type="button"
                            data-html2canvas-ignore="true"
                            onClick={() => setScanPreview({ title: 'Label Identitas Barang Bukti', text: barcodePayload })}
                            className="print:hidden mt-1.5 text-[10px] text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                          >
                            <Eye className="w-3 h-3" /> Pratinjau Teks Scan
                          </button>
                        </div>

                        <div className="w-full text-center border-t border-slate-300 pt-1.5 mt-2 space-y-0.5">
                          <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Total Barang Bukti</div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm font-mono">
                            {totalItems} Item
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* DAFTAR BARANG BUKTI HALAMAN 1 (MAKSIMAL 10 ITEM) */}
                    <div className="mt-3 pt-2.5 border-t-2 border-slate-900">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-800" />
                          <span>Daftar Rincian Barang Bukti ({totalItems} Item)</span>
                        </h4>
                      </div>

                      {/* Tabel Rincian BB Halaman 1 */}
                      <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold">
                            <tr>
                              <th className="py-1.5 px-2 w-7 text-center">No</th>
                              <th className="py-1.5 px-2.5">Nama Barang Bukti &amp; Jenis</th>
                              <th className="py-1.5 px-2.5 w-40">Status Pemulihan Aset</th>
                              <th className="py-1.5 px-2.5 w-36">Lokasi Penyimpanan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300 bg-white">
                            {page.items.map((item, idx) => (
                              <tr key={item.id || idx} className="hover:bg-slate-50">
                                <td className="py-1.5 px-2 text-center font-bold text-slate-900 align-top">
                                  {idx + 1}
                                </td>
                                <td className="py-1.5 px-2.5 align-top">
                                  <div className="font-bold text-slate-950 leading-tight">
                                    {item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}{item.namaBarang}
                                  </div>
                                  <div className="text-[9px] font-mono text-slate-600 uppercase font-semibold mt-0.5">
                                    Jenis: {item.jenisBarang} {item.spesifikasi ? `• ${item.spesifikasi}` : ''}
                                  </div>
                                </td>
                                <td className="py-1.5 px-2.5 align-top">
                                  <span
                                    className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      item.statusPemulihanAset === 'DISETOR_KAS_NEGARA' || item.statusPemulihanAset === 'DISETOR_PNBP'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : item.statusPemulihanAset === 'DIRAMPAS_LELANG' || item.statusPemulihanAset === 'PROSES_LELANG'
                                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                        : item.statusPemulihanAset === 'DIKEMBALIKAN'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                        : item.statusPemulihanAset === 'DIMUSNAHKAN'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                                    }`}
                                  >
                                    {getStatusPemulihanText(item.statusPemulihanAset)}
                                  </span>
                                </td>
                                <td className="py-1.5 px-2.5 align-top">
                                  <div className="flex items-center gap-1 font-semibold text-slate-900 text-[10px]">
                                    <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                                    <span>{item.lokasiPenyimpanan}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* FOOTER PENGESAHAN & KETENTUAN */}
                    <div className="mt-3 pt-2 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                      <div className="text-[9px] text-slate-600 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                        <span className="italic font-medium">
                          <strong>PERHATIAN:</strong> Dilarang merusak, memindahkan, atau menukar barang bukti tanpa izin Kepala Seksi PAPBB Kejaksaan Negeri Mesuji.
                        </span>
                      </div>

                      <div className="text-right text-[9px] text-slate-500 font-mono">
                        {totalPages > 1 ? `Lembar 1 dari ${totalPages} • ` : ''}Kejaksaan Negeri Mesuji • Seksi PAPBB
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* KOP RESMI KEJAKSAAN (LEMBAR LANJUTAN) */}
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-2.5 mb-3">
                      <div className="flex items-center gap-3">
                        <KejaksaanLogo className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" />
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 leading-tight">
                            KEJAKSAAN REPUBLIK INDONESIA • KEJAKSAAN TINGGI LAMPUNG
                          </div>
                          <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                            KEJAKSAAN NEGERI MESUJI
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-900 uppercase">
                            SEKSI PEMULIHAN ASET DAN PENGELOLAAN BARANG BUKTI (PAPBB)
                          </div>
                          <h3 className="text-xs sm:text-sm font-black tracking-wide text-slate-950 uppercase mt-0.5">
                            LABEL IDENTITAS BARANG BUKTI
                          </h3>
                        </div>
                      </div>

                      {/* Box No Register & Klasifikasi */}
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded text-xs font-mono font-bold">
                          <span>RB:</span>
                          <span>{register.registerBarangBukti}</span>
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-slate-600 font-semibold">
                          Lembar <span className="font-mono font-bold text-slate-900">{page.pageNumber}</span> dari <span className="font-mono font-bold text-slate-900">{totalPages}</span>
                        </div>
                      </div>
                    </div>

                    {/* RINGKASAN DATA PERKARA DI LEMBAR LANJUTAN */}
                    <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">No. Register Perkara:</span>
                        <span className="font-mono font-bold text-slate-950 text-[11px] truncate block">{register.registerPerkara}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">Nama Tersangka:</span>
                        <span className="font-black text-slate-950 uppercase text-[11px] truncate block">{register.namaTersangka}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">Pasal / Dakwaan:</span>
                        <span className="font-medium text-slate-800 text-[11px] truncate block">{register.pasal}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block">Status Perkara:</span>
                        <span className="font-bold text-emerald-800 text-[11px] uppercase truncate block">{statusPerkaraText}</span>
                      </div>
                    </div>

                    {/* DAFTAR BARANG BUKTI LEMBAR LANJUTAN (MAKSIMAL 10 ITEM) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-800" />
                          <span>Daftar Rincian Barang Bukti ({totalItems} Item)</span>
                        </h4>
                      </div>

                      {/* Tabel Item Lembar Lanjutan */}
                      <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold">
                            <tr>
                              <th className="py-1.5 px-2 w-7 text-center">No</th>
                              <th className="py-1.5 px-2.5">Nama Barang Bukti &amp; Jenis</th>
                              <th className="py-1.5 px-2.5 w-40">Status Pemulihan Aset</th>
                              <th className="py-1.5 px-2.5 w-36">Lokasi Penyimpanan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300 bg-white">
                            {page.items.map((item, idx) => {
                              const itemNumber = page.startNumber + idx;
                              return (
                                <tr key={item.id || itemNumber} className="hover:bg-slate-50">
                                  <td className="py-1.5 px-2 text-center font-bold text-slate-900 align-top">
                                    {itemNumber}
                                  </td>
                                  <td className="py-1.5 px-2.5 align-top">
                                    <div className="font-bold text-slate-950 leading-tight">
                                      {item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}{item.namaBarang}
                                    </div>
                                    <div className="text-[9px] font-mono text-slate-600 uppercase font-semibold mt-0.5">
                                      Jenis: {item.jenisBarang} {item.spesifikasi ? `• ${item.spesifikasi}` : ''}
                                    </div>
                                  </td>
                                  <td className="py-1.5 px-2.5 align-top">
                                    <span
                                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                        item.statusPemulihanAset === 'DISETOR_KAS_NEGARA' || item.statusPemulihanAset === 'DISETOR_PNBP'
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          : item.statusPemulihanAset === 'DIRAMPAS_LELANG' || item.statusPemulihanAset === 'PROSES_LELANG'
                                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                          : item.statusPemulihanAset === 'DIKEMBALIKAN'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                          : item.statusPemulihanAset === 'DIMUSNAHKAN'
                                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                                      }`}
                                    >
                                      {getStatusPemulihanText(item.statusPemulihanAset)}
                                    </span>
                                  </td>
                                  <td className="py-1.5 px-2.5 align-top">
                                    <div className="flex items-center gap-1 font-semibold text-slate-900 text-[10px]">
                                      <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                                      <span>{item.lokasiPenyimpanan}</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* FOOTER PENGESAHAN & KETENTUAN LEMBAR LANJUTAN */}
                    <div className="mt-4 pt-2 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                      <div className="text-[9px] text-slate-600 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                        <span className="italic font-medium">
                          <strong>PERHATIAN:</strong> Dilarang merusak, memindahkan, atau menukar barang bukti tanpa izin Kepala Seksi PAPBB Kejaksaan Negeri Mesuji.
                        </span>
                      </div>

                      <div className="text-right text-[9px] text-slate-500 font-mono">
                        Lembar {page.pageNumber} dari {totalPages} &bull; Kejaksaan Negeri Mesuji • Seksi PAPBB
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        </div>

      </div>

      {/* Modal Dialog Pratinjau Hasil Scan Barcode */}
      {scanPreview && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Pratinjau Hasil Scan Barcode</h3>
              </div>
              <button
                type="button"
                onClick={() => setScanPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900">
                <div className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{scanPreview.title}</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Teks di bawah ini adalah data persis yang terbaca saat barcode/QR di-scan menggunakan Kamera HP (Google Lens / Kamera iPhone / Scanner Barcode 2D):
                </p>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800 selection:bg-emerald-800">
                  {scanPreview.text}
                </pre>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopyScanText(scanPreview.text)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Teks Berhasil Disalin!' : 'Salin Teks Scan'}</span>
              </button>

              <button
                type="button"
                onClick={() => setScanPreview(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
