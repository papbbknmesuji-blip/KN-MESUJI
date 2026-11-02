import React from 'react';
import { RegisterPerkara } from '../types';
import { formatDateIndo, formatRupiah } from '../utils/formatters';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { KejaksaanLogo } from './KejaksaanLogo';
import { OfficialBarcode } from './OfficialBarcode';

interface RegisterPrintModalProps {
  register: RegisterPerkara | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterPrintModal: React.FC<RegisterPrintModalProps> = ({
  register,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !register) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden print:border-none print:shadow-none print:max-w-none">
        {/* Modal Action Bar (Hidden on Print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold tracking-wide">
              Pratinjau Formulir Register Barang Bukti &amp; Pemulihan Aset
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content (Authentic Kejaksaan Register Sheet format) */}
        <div className="p-6 sm:p-10 text-slate-900 font-sans print:p-4 print:text-black">
          {/* Header Kop Surat Kejaksaan */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-5">
            <div className="flex items-center gap-4">
              <KejaksaanLogo className="w-16 h-16 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-700">
                  KEJAKSAAN REPUBLIK INDONESIA
                </p>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  KEJAKSAAN TINGGI LAMPUNG
                </p>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950">
                  KEJAKSAAN NEGERI MESUJI
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  SEKSI PEMULIHAN ASET DAN PENGELOLAAN BARANG BUKTI (PAPBB)
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  Jl. Z.A. Pagar Alam, Simpang Pematang, Kab. Mesuji - Lampung
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-slate-900 p-0.5 bg-white rounded">
                <OfficialBarcode 
                  value={[
                    'KEJAKSAAN NEGERI MESUJI - SEKSI PAPBB',
                    'REGISTER PENERIMAAN BARANG BUKTI',
                    `No. RB: ${register.registerBarangBukti}`,
                    `No. Perkara: ${register.registerPerkara}`,
                    `Surat Perintah: ${register.suratPenerimaan}`,
                    `Tanggal: ${formatDateIndo(register.tanggalPenerimaan)}`,
                    `Tersangka: ${register.namaTersangka}`,
                    `Pasal: ${register.pasal}`,
                    `Jaksa PU: ${register.jaksaPU.join('; ')}`,
                    `Total BB: ${register.barangBuktiList.length} Item`
                  ].join('\n')}
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">{register.registerBarangBukti}</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-sm sm:text-base font-bold uppercase underline tracking-wider">
              LEMBAR REGISTER PENERIMAAN BARANG BUKTI
            </h2>
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-700 mt-1">
              <span>NO. REGISTER: <strong className="text-slate-950">{register.registerBarangBukti}</strong></span>
              <span>&bull;</span>
              <span>BULAN: <strong className="text-slate-950">{register.bulan || (register.tanggalPenerimaan ? register.tanggalPenerimaan.split('-')[1] : '-')}</strong></span>
              <span>&bull;</span>
              <span>TAHUN: <strong className="text-slate-950">{register.tahun || (register.tanggalPenerimaan ? register.tanggalPenerimaan.split('-')[0] : '-')}</strong></span>
            </div>
          </div>

          {/* Form Table Exact replica of the user physical document */}
          <table className="w-full border-collapse border-2 border-slate-900 text-xs sm:text-sm">
            <tbody>
              {/* Row 1: Kode Perkara */}
              <tr>
                <td className="w-1/3 border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50">
                  1. KODE PERKARA
                </td>
                <td className="w-2/3 border border-slate-900 px-3 py-2.5 font-mono font-bold text-slate-900">
                  {register.kodePerkara}
                </td>
              </tr>

              {/* Row 2: Register Perkara */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50">
                  REGISTER PERKARA
                </td>
                <td className="border border-slate-900 px-3 py-2.5 font-mono font-bold">
                  {register.registerPerkara}
                </td>
              </tr>

              {/* Row 3: Tgl Penerimaan Dari Penyidik */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50">
                  TGL PENERIMAAN DARI PENYIDIK
                </td>
                <td className="border border-slate-900 px-3 py-2.5">
                  <div className="font-mono font-semibold">{register.suratPenerimaan}</div>
                  <div className="text-xs text-slate-700 mt-0.5">
                    Tanggal Terima: <span className="font-semibold">{formatDateIndo(register.tanggalPenerimaan)}</span> 
                    {register.penyidikAsal && ` (Dari ${register.penyidikAsal})`}
                  </div>
                </td>
              </tr>

              {/* Row 4: Jaksa PU */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50 align-top">
                  JAKSA PU
                </td>
                <td className="border border-slate-900 px-3 py-2.5">
                  <ol className="list-decimal list-inside space-y-1 font-semibold text-slate-900">
                    {register.jaksaPU.map((jaksa, idx) => (
                      <li key={idx}>{jaksa}</li>
                    ))}
                  </ol>
                </td>
              </tr>

              {/* Row 5: Nama Tersangka */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50">
                  NAMA TERSANGKA
                </td>
                <td className="border border-slate-900 px-3 py-2.5 font-bold text-slate-950 uppercase tracking-wide">
                  {register.namaTersangka}
                </td>
              </tr>

              {/* Row 6: Pasal */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50">
                  PASAL
                </td>
                <td className="border border-slate-900 px-3 py-2.5 font-semibold text-slate-900">
                  {register.pasal}
                </td>
              </tr>

              {/* Row 7: Barang Bukti */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50 align-top">
                  BARANG BUKTI
                </td>
                <td className="border border-slate-900 px-3 py-2.5">
                  <div className="space-y-2">
                    {register.barangBuktiList.map((item, idx) => (
                      <div key={item.id || idx} className="text-slate-900 leading-relaxed">
                        <span className="font-semibold">
                          {item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}{item.namaBarang}
                        </span>
                        {item.spesifikasi && (
                          <span className="text-slate-800"> {item.spesifikasi}</span>
                        )}
                        <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-3">
                          <span>Status: <strong>{
                            item.statusPemulihanAset === 'DIRAMPAS_LELANG'
                              ? 'Dirampas Lelang'
                              : item.statusPemulihanAset === 'DIKEMBALIKAN'
                              ? 'Dikembalikan'
                              : item.statusPemulihanAset === 'DIMUSNAHKAN'
                              ? 'Dimusnahkan'
                              : item.statusPemulihanAset === 'DISETOR_KAS_NEGARA' || item.statusPemulihanAset === 'DISETOR_PNBP'
                              ? 'Disetor Kas Negara'
                              : 'Tahap Sita'
                          }</strong></span>
                          <span>Lokasi: <strong>{item.lokasiPenyimpanan}</strong></span>
                          {item.nominalPnbp !== undefined && item.nominalPnbp > 0 && (
                            <span>Setor PNBP: <strong>{formatRupiah(item.nominalPnbp)}</strong></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Row 8: Register Barang Bukti */}
              <tr>
                <td className="border border-slate-900 px-3 py-2.5 font-bold uppercase bg-slate-50/50">
                  REGISTER BARANG BUKTI
                </td>
                <td className="border border-slate-900 px-3 py-2.5 font-mono font-bold text-base text-slate-950">
                  {register.registerBarangBukti}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Status & Catatan Penanganan */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
            <div>
              <span className="font-semibold text-slate-700">Status Penanganan Perkara:</span>{' '}
              <span className="font-bold uppercase text-slate-900">{register.statusPerkara.replace(/_/g, ' ')}</span>
            </div>
            {register.amarPutusan && (
              <div className="pt-1">
                <span className="font-semibold text-slate-700">Amar Putusan Pengadilan:</span>{' '}
                <div className="text-slate-800 space-y-0.5 mt-0.5 pl-2 border-l-2 border-slate-300">
                  {register.amarPutusan.split(/\r?\n/).map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={idx} className="h-1" />;
                    return (
                      <div key={idx} className="leading-snug break-words whitespace-pre-wrap">
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {register.catatanPetugas && (
              <div>
                <span className="font-semibold text-slate-700">Catatan Petugas Barang Bukti:</span>{' '}
                <span className="text-slate-800">{register.catatanPetugas}</span>
              </div>
            )}
          </div>

          {/* Kolom Tanda Tangan Resmi */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-900">Kepala Seksi PAPBB</p>
              <p className="text-slate-600">Kejaksaan Negeri Mesuji</p>
              <div className="h-16 flex items-end justify-center">
                <div className="w-32 border-b border-slate-900"></div>
              </div>
              <p className="font-bold text-slate-900 mt-1">........................................</p>
              <p className="text-slate-600 text-[10px]">Jaksa Pratama / NIP.</p>
            </div>

            <div>
              <p className="text-slate-600">Yang Menyerahkan,</p>
              <p className="font-bold text-slate-900">Jaksa Penuntut Umum (JPU)</p>
              <p className="text-slate-600">Kejaksaan Negeri Mesuji</p>
              <div className="h-16 flex items-end justify-center">
                <div className="w-32 border-b border-slate-900"></div>
              </div>
              <p className="font-bold text-slate-900 mt-1">
                {register.jaksaPU[0] || '........................................'}
              </p>
              <p className="text-slate-600 text-[10px]">Jaksa Fungsional</p>
            </div>

            <div>
              <p className="text-slate-600">Mesuji, {formatDateIndo(register.tanggalPenerimaan)}</p>
              <p className="font-bold text-slate-900">Petugas Pengelola Barang Bukti</p>
              <p className="text-slate-600">Kejaksaan Negeri Mesuji</p>
              <div className="h-16 flex items-end justify-center">
                <div className="w-32 border-b border-slate-900"></div>
              </div>
              <p className="font-bold text-slate-900 mt-1">........................................</p>
              <p className="text-slate-600 text-[10px]">Petugas Register PAPBB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
