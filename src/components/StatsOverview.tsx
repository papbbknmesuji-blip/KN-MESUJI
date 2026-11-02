import React from 'react';
import { RegisterPerkara } from '../types';
import { formatRupiah } from '../utils/formatters';
import { 
  FileCheck, 
  Package, 
  TrendingUp, 
  RotateCcw, 
  Trash2, 
  Gavel
} from 'lucide-react';

interface StatsOverviewProps {
  registers: RegisterPerkara[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ registers }) => {
  const totalPerkara = registers.length;
  
  const totalItems = registers.reduce(
    (acc, curr) => acc + curr.barangBuktiList.length,
    0
  );

  const totalRealisasiPNBP = registers.reduce((acc, curr) => {
    const itemPNBP = curr.barangBuktiList.reduce((sum, item) => sum + (item.nominalPnbp || 0), 0);
    return acc + (itemPNBP > 0 ? itemPNBP : (curr.nilaiPemulihanRealisasi || 0));
  }, 0);

  const countTahap2 = registers.filter((r) => r.statusPerkara === 'TAHAP_PENUNTUTAN').length;
  const countSidang = registers.filter((r) => r.statusPerkara === 'PERSIDANGAN').length;
  const countInkracht = registers.filter((r) => r.statusPerkara === 'INKRACHT' || r.statusPerkara.startsWith('INKRACHT')).length;
  const countDikembalikan = registers.filter((r) => r.statusPerkara === 'INKRACHT_DIKEMBALIKAN').length;
  const countRampas = registers.filter((r) => r.statusPerkara === 'INKRACHT_DIRAMPAS_NEGARA').length;
  const countMusnah = registers.filter((r) => r.statusPerkara === 'INKRACHT_DIMUSNAHKAN').length;

  // Total Perkara yang memiliki barang rampasan negara
  const countPerkaraRampasan = registers.filter((r) => 
    r.statusPerkara === 'INKRACHT_DIRAMPAS_NEGARA' ||
    r.statusPemulihanAset === 'DIRAMPAS_LELANG' ||
    r.statusPemulihanAset === 'PROSES_LELANG' ||
    r.statusPemulihanAset === 'PROSES_LELANG_KPKNL' ||
    r.statusPemulihanAset === 'TERJUAL_LELANG' ||
    r.statusPemulihanAset === 'DISETOR_PNBP' ||
    r.statusPemulihanAset === 'DISETOR_KAS_NEGARA' ||
    r.barangBuktiList.some((bb) => 
      bb.statusPemulihanAset === 'DIRAMPAS_LELANG' ||
      bb.statusPemulihanAset === 'PROSES_LELANG' ||
      bb.statusPemulihanAset === 'PROSES_LELANG_KPKNL' ||
      bb.statusPemulihanAset === 'TERJUAL_LELANG' ||
      bb.statusPemulihanAset === 'DISETOR_PNBP' ||
      bb.statusPemulihanAset === 'DISETOR_KAS_NEGARA'
    )
  ).length;

  // Keterangan status pemulihan dihitung per-item barang bukti
  const countDirampasLelang = registers.reduce(
    (acc, curr) =>
      acc +
      curr.barangBuktiList.filter((item) => {
        const s = item.statusPemulihanAset || curr.statusPemulihanAset;
        return s === 'DIRAMPAS_LELANG' || s === 'PROSES_LELANG_KPKNL' || s === 'PROSES_LELANG' || s === 'TERJUAL_LELANG';
      }).length,
    0
  );
  const countItemDikembalikan = registers.reduce(
    (acc, curr) =>
      acc +
      curr.barangBuktiList.filter((item) => {
        const s = item.statusPemulihanAset || curr.statusPemulihanAset;
        return s === 'DIKEMBALIKAN';
      }).length,
    0
  );
  const countItemDimusnahkan = registers.reduce(
    (acc, curr) =>
      acc +
      curr.barangBuktiList.filter((item) => {
        const s = item.statusPemulihanAset || curr.statusPemulihanAset;
        return s === 'DIMUSNAHKAN';
      }).length,
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Stat 1: Total Register Perkara */}
      <div className="relative overflow-hidden rounded-2xl p-5 border border-indigo-200/90 bg-gradient-to-br from-indigo-50 via-white to-blue-50/60 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Total Register Perkara</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 mt-1.5 font-mono tracking-tight">
              {totalPerkara} <span className="text-xs font-medium text-indigo-700">Perkara</span>
            </h3>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <FileCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs border-t border-indigo-100/80 pt-3">
          <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-100/90 border border-blue-200/90 px-2 py-0.5 rounded-md">
            {countTahap2} Tahap II
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100/90 border border-amber-200/90 px-2 py-0.5 rounded-md">
            {countSidang} Sidang
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-200/90 px-2 py-0.5 rounded-md">
            {countInkracht} Inkracht
          </span>
        </div>
      </div>

      {/* Stat 2: Total Fisik Barang Bukti + Keterangan Pemulihan */}
      <div className="relative overflow-hidden rounded-2xl p-5 border border-amber-200/90 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Total Barang Bukti</span>
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 font-mono tracking-tight">
              {totalItems} <span className="text-xs font-medium text-amber-800">Item Terdata</span>
            </h3>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        
        {/* Keterangan Status BB termasuk Keterangan Lelang */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs border-t border-amber-100/80 pt-3">
          <span 
            className="inline-flex items-center gap-1 font-bold text-purple-900 bg-purple-100/90 border border-purple-200/90 px-2 py-0.5 rounded-md"
            title={`${countDirampasLelang} Dirampas untuk Lelang`}
          >
            <Gavel className="w-3.5 h-3.5 text-purple-700" />
            <span>{countDirampasLelang} Lelang</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-200/90 px-2 py-0.5 rounded-md">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" /> {countItemDikembalikan || countDikembalikan} Kembali
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-rose-800 bg-rose-100/90 border border-rose-200/90 px-2 py-0.5 rounded-md">
            <Trash2 className="w-3.5 h-3.5 text-rose-700" /> {countItemDimusnahkan || countMusnah} Musnah
          </span>
        </div>
      </div>

      {/* Stat 3: Realisasi Pemulihan Aset (PNBP) */}
      <div className="relative overflow-hidden rounded-2xl p-5 border border-emerald-300/80 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/40 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 group">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Pemulihan Aset Setor PNBP</span>
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1.5 font-mono tracking-tight truncate">
              {formatRupiah(totalRealisasiPNBP)}
            </h3>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs border-t border-emerald-200/70 pt-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-900 bg-emerald-100/90 border border-emerald-200/90 px-2 py-0.5 rounded-md">
            <span>{countPerkaraRampasan || countRampas} Perkara Rampasan Negara</span>
          </span>
        </div>
      </div>
    </div>
  );
};
