import React, { useState, useMemo } from 'react';
import { RegisterPerkara, FilterOptions } from '../types';
import { BULAN_OPTIONS } from '../data/initialData';
import { 
  formatDateIndo, 
  formatRupiah, 
  getStatusPerkaraBadge, 
  getStatusPemulihanBadge 
} from '../utils/formatters';
import { 
  Search, 
  Printer, 
  Tag, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package, 
  Car, 
  FileText, 
  Flame, 
  Smartphone, 
  Banknote,
  RotateCcw,
  Calendar,
  Gavel,
  User,
  Scale,
  CheckCircle
} from 'lucide-react';

interface RegisterTableProps {
  registers: RegisterPerkara[];
  onOpenPrint: (register: RegisterPerkara) => void;
  onOpenLabel: (register: RegisterPerkara) => void;
  onOpenEdit: (register: RegisterPerkara) => void;
  onDelete: (id: string) => void;
}

export const RegisterTable: React.FC<RegisterTableProps> = ({
  registers,
  onOpenPrint,
  onOpenLabel,
  onOpenEdit,
  onDelete,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    statusPerkara: 'ALL',
    jenisBarang: 'ALL',
    statusPemulihanAset: 'ALL',
    kodePerkara: 'ALL',
    bulan: 'ALL',
    tahun: 'ALL',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Available unique years in dataset
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    registers.forEach((r) => {
      if (r.tahun) years.add(r.tahun);
      else if (r.tanggalPenerimaan) years.add(r.tanggalPenerimaan.split('-')[0]);
    });
    if (!years.has('2026')) years.add('2026');
    return Array.from(years).sort().reverse();
  }, [registers]);

  const getCategoryIcon = (jenis: string) => {
    switch (jenis) {
      case 'KENDARAAN':
        return <Car className="w-3.5 h-3.5 text-blue-600" />;
      case 'DOKUMEN':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case 'NARKOTIKA':
        return <Flame className="w-3.5 h-3.5 text-rose-600" />;
      case 'ELEKTRONIK':
        return <Smartphone className="w-3.5 h-3.5 text-purple-600" />;
      case 'UANG_PERHIASAN':
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Package className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  // Filtering logic
  const filteredRegisters = registers.filter((item) => {
    const q = filters.searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.registerBarangBukti.toLowerCase().includes(q) ||
      item.registerPerkara.toLowerCase().includes(q) ||
      item.namaTersangka.toLowerCase().includes(q) ||
      item.pasal.toLowerCase().includes(q) ||
      item.suratPenerimaan.toLowerCase().includes(q) ||
      item.jaksaPU.some((j) => j.toLowerCase().includes(q)) ||
      item.barangBuktiList.some(
        (bb) =>
          bb.namaBarang.toLowerCase().includes(q) ||
          bb.spesifikasi.toLowerCase().includes(q) ||
          bb.lokasiPenyimpanan.toLowerCase().includes(q)
      );

    const matchesStatusPerkara =
      filters.statusPerkara === 'ALL' ||
      item.statusPerkara === filters.statusPerkara ||
      (filters.statusPerkara === 'INKRACHT' && item.statusPerkara.startsWith('INKRACHT'));

    const itemKodeUpper = (item.kodePerkara || '').toUpperCase();
    const filterKodeUpper = filters.kodePerkara.toUpperCase();
    const standardCodes = ['EOH', 'ENZ', 'EKU', 'PIDSUS'];
    const matchesKode =
      filters.kodePerkara === 'ALL' ||
      (filters.kodePerkara === 'Lainnya'
        ? !standardCodes.includes(itemKodeUpper)
        : itemKodeUpper === filterKodeUpper);

    const matchesStatusPemulihan =
      filters.statusPemulihanAset === 'ALL' ||
      item.statusPemulihanAset === filters.statusPemulihanAset ||
      item.barangBuktiList.some((bb) => {
        const s = bb.statusPemulihanAset || item.statusPemulihanAset;
        if (filters.statusPemulihanAset === 'TAHAP_SITA') {
          return s === 'TAHAP_SITA' || s === 'BUKAN_RAMPASAN' || s === 'BELUM_PENILAIAN' || s === 'TELAH_DINILAI';
        }
        if (filters.statusPemulihanAset === 'DIRAMPAS_LELANG') {
          return s === 'DIRAMPAS_LELANG' || s === 'PROSES_LELANG_KPKNL' || s === 'PROSES_LELANG' || s === 'TERJUAL_LELANG';
        }
        if (filters.statusPemulihanAset === 'DISETOR_KAS_NEGARA') {
          return s === 'DISETOR_KAS_NEGARA' || s === 'DISETOR_PNBP';
        }
        return s === filters.statusPemulihanAset;
      });

    const matchesJenis =
      filters.jenisBarang === 'ALL' ||
      item.barangBuktiList.some((bb) => bb.jenisBarang === filters.jenisBarang);

    // Bulan matching (check item.bulan or item.tanggalPenerimaan)
    const itemBulan = item.bulan || (item.tanggalPenerimaan ? item.tanggalPenerimaan.split('-')[1] : '');
    const matchesBulan = filters.bulan === 'ALL' || itemBulan === filters.bulan;

    // Tahun matching (check item.tahun or item.tanggalPenerimaan)
    const itemTahun = item.tahun || (item.tanggalPenerimaan ? item.tanggalPenerimaan.split('-')[0] : '');
    const matchesTahun = filters.tahun === 'ALL' || itemTahun === filters.tahun;

    return (
      matchesQuery &&
      matchesStatusPerkara &&
      matchesKode &&
      matchesStatusPemulihan &&
      matchesJenis &&
      matchesBulan &&
      matchesTahun
    );
  });

  const handleFilterUpdate = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      statusPerkara: 'ALL',
      jenisBarang: 'ALL',
      statusPemulihanAset: 'ALL',
      kodePerkara: 'ALL',
      bulan: 'ALL',
      tahun: 'ALL',
    });
    setCurrentPage(1);
  };

  const isAnyFilterActive =
    Boolean(filters.searchQuery) ||
    filters.statusPerkara !== 'ALL' ||
    filters.kodePerkara !== 'ALL' ||
    filters.jenisBarang !== 'ALL' ||
    filters.statusPemulihanAset !== 'ALL' ||
    filters.bulan !== 'ALL' ||
    filters.tahun !== 'ALL';

  // Pagination calculation (10 rows per page)
  const totalPages = Math.max(1, Math.ceil(filteredRegisters.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredRegisters.length);
  const paginatedRegisters = filteredRegisters.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xs overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-300 space-y-3.5 bg-white">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. RB, PDM, Tersangka, Jaksa, Nopol/Noka..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterUpdate({ searchQuery: e.target.value })}
              className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleFilterUpdate({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end text-xs flex-wrap">
            <span className="text-slate-600 font-medium">
              Total <span className="font-bold text-slate-950 font-mono">{filteredRegisters.length}</span> Register Perkara
            </span>

            {isAnyFilterActive && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdown Row: Including Bulan & Tahun */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
          {/* Filter Bulan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Bulan
            </label>
            <select
              value={filters.bulan}
              onChange={(e) => handleFilterUpdate({ bulan: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Bulan</option>
              {BULAN_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tahun */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tahun
            </label>
            <select
              value={filters.tahun}
              onChange={(e) => handleFilterUpdate({ tahun: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>

          {/* Kode Perkara */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Kode Perkara
            </label>
            <select
              value={filters.kodePerkara}
              onChange={(e) => handleFilterUpdate({ kodePerkara: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Kode Perkara</option>
              <option value="EOH">EOH (Oharda)</option>
              <option value="ENZ">ENZ (Narkotika)</option>
              <option value="EKU">EKU (Kamnegtibum &amp; TPUL)</option>
              <option value="PIDSUS">PIDSUS</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Status Perkara */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status Perkara
            </label>
            <select
              value={filters.statusPerkara}
              onChange={(e) => handleFilterUpdate({ statusPerkara: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Status Perkara</option>
              <option value="TAHAP_PENUNTUTAN">Tahap Penuntutan (Tahap II)</option>
              <option value="PERSIDANGAN">Persidangan</option>
              <option value="INKRACHT">Inkracht</option>
            </select>
          </div>

          {/* Jenis Barang Bukti */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Jenis Barang Bukti
            </label>
            <select
              value={filters.jenisBarang}
              onChange={(e) => handleFilterUpdate({ jenisBarang: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Jenis BB</option>
              <option value="KENDARAAN">Kendaraan Bermotor</option>
              <option value="DOKUMEN">Dokumen (STNK/BPKB)</option>
              <option value="NARKOTIKA">Narkotika &amp; Obat</option>
              <option value="SENPI_SAJAM">Senpi &amp; Senjata Tajam</option>
              <option value="ELEKTRONIK">Elektronik &amp; HP</option>
              <option value="UANG_PERHIASAN">Uang Tunai / Logam Mulia</option>
            </select>
          </div>

          {/* Status Pemulihan Aset */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status Pemulihan Aset
            </label>
            <select
              value={filters.statusPemulihanAset}
              onChange={(e) =>
                handleFilterUpdate({ statusPemulihanAset: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">Semua Status Aset</option>
              <option value="TAHAP_SITA">Tahap Sita</option>
              <option value="DIRAMPAS_LELANG">Dirampas untuk Negara (Lelang)</option>
              <option value="DIKEMBALIKAN">Dikembalikan</option>
              <option value="DIMUSNAHKAN">Dimusnahkan</option>
              <option value="DISETOR_KAS_NEGARA">Disetor ke Kas Negara</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content with Clear Borders */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-emerald-800 text-white font-bold tracking-wider border-b-2 border-emerald-950 shadow-xs">
              <th className="py-3.5 px-3 w-12 text-center border-r border-emerald-700/60">
                <span className="text-emerald-100 font-mono text-[11px] uppercase tracking-wider">No</span>
              </th>
              <th className="py-3.5 px-3.5 text-center border-r border-emerald-700/60">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">No. Register BB (RB) &amp; Tanggal</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center border-r border-emerald-700/60">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <FileText className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Register Perkara (PDM)</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center border-r border-emerald-700/60">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <User className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Tersangka &amp; Pasal</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center border-r border-emerald-700/60">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <Scale className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Jaksa Penuntut Umum (JPU)</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center border-r border-emerald-700/60">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <Package className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Rincian Barang Bukti</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center border-r border-emerald-700/60">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Status Perkara</span>
                </div>
              </th>
              <th className="py-3.5 px-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-50">
                  <Printer className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Aksi / Cetak</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredRegisters.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-sm">Tidak ada data register yang cocok</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Coba sesuaikan kata kunci pencarian atau reset filter bulan/tahun.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedRegisters.map((reg, index) => {
                const rowNumber = startIndex + index + 1;
                const isExpanded = expandedRowId === reg.id;
                const statusBadge = getStatusPerkaraBadge(reg.statusPerkara);
                const totalItemCount = reg.barangBuktiList.length;
                const bulanVal = reg.bulan || (reg.tanggalPenerimaan ? reg.tanggalPenerimaan.split('-')[1] : '');
                const tahunVal = reg.tahun || (reg.tanggalPenerimaan ? reg.tanggalPenerimaan.split('-')[0] : '');

                // Check for items with active recovery status
                const hasDirampasLelang = reg.barangBuktiList.some((i) => {
                  const s = i.statusPemulihanAset || reg.statusPemulihanAset;
                  return s === 'DIRAMPAS_LELANG' || s === 'PROSES_LELANG_KPKNL' || s === 'PROSES_LELANG' || s === 'TERJUAL_LELANG';
                });
                const hasDikembalikan = reg.barangBuktiList.some((i) => {
                  const s = i.statusPemulihanAset || reg.statusPemulihanAset;
                  return s === 'DIKEMBALIKAN';
                });
                const hasDimusnahkan = reg.barangBuktiList.some((i) => {
                  const s = i.statusPemulihanAset || reg.statusPemulihanAset;
                  return s === 'DIMUSNAHKAN';
                });
                const hasSetorKasNegara = reg.barangBuktiList.some((i) => {
                  const s = i.statusPemulihanAset || reg.statusPemulihanAset;
                  return s === 'DISETOR_KAS_NEGARA' || s === 'DISETOR_PNBP';
                });
                const totalItemPNBP = reg.barangBuktiList.reduce(
                  (sum, item) => sum + (item.nominalPnbp || 0),
                  0
                );

                return (
                  <React.Fragment key={reg.id}>
                    <tr
                      className={`hover:bg-slate-50 transition border-b border-slate-200 ${
                        isExpanded ? 'bg-slate-50/80' : 'bg-white'
                      }`}
                    >
                      {/* Column 1: Index */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700 border-r border-slate-200">
                        {rowNumber}
                      </td>

                      {/* Column 2: Register BB, Bulan/Tahun & Tgl */}
                      <td className="py-3 px-3.5 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-950 text-xs sm:text-sm">
                            {reg.registerBarangBukti}
                          </span>
                          {(bulanVal || tahunVal) && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {bulanVal}/{tahunVal}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {formatDateIndo(reg.tanggalPenerimaan)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]">
                          {reg.suratPenerimaan}
                        </div>
                      </td>

                      {/* Column 3: Register Perkara & Kode */}
                      <td className="py-3 px-3.5 border-r border-slate-200">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">
                            {reg.registerPerkara}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800 border border-slate-300">
                            Kode: {reg.kodePerkara}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Tersangka & Pasal */}
                      <td className="py-3 px-3.5 max-w-[220px] border-r border-slate-200">
                        <div className="font-bold text-slate-950 uppercase tracking-tight">
                          {reg.namaTersangka}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          {reg.pasal}
                        </div>
                      </td>

                      {/* Column 5: Jaksa PU */}
                      <td className="py-3 px-3.5 max-w-[180px] border-r border-slate-200">
                        <div className="space-y-0.5">
                          {reg.jaksaPU.map((jaksa, jIdx) => (
                            <div
                              key={jIdx}
                              className="text-[11px] text-slate-800 font-medium truncate"
                              title={jaksa}
                            >
                              {jIdx + 1}. {jaksa}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Column 6: Rincian Barang Bukti */}
                      <td className="py-3 px-3.5 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {totalItemCount} Item BB
                          </span>
                          <button
                            onClick={() =>
                              setExpandedRowId(isExpanded ? null : reg.id)
                            }
                            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 transition"
                          >
                            <span>Detail</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Keterangan Status Pemulihan Aset pada Item Barang Bukti */}
                        {hasDirampasLelang && (
                          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-900 border border-purple-200">
                            <Gavel className="w-3 h-3 text-purple-700" />
                            <span>Dirampas untuk Negara (Lelang)</span>
                          </div>
                        )}
                        {hasDikembalikan && (
                          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <span>Dikembalikan</span>
                          </div>
                        )}
                        {hasDimusnahkan && (
                          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-300">
                            <span>Dimusnahkan</span>
                          </div>
                        )}
                        {hasSetorKasNegara && (
                          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-900 border border-teal-300">
                            <Gavel className="w-3 h-3 text-teal-700" />
                            <span>Disetor ke Kas Negara</span>
                          </div>
                        )}

                        {totalItemPNBP > 0 && (
                          <div className="text-[11px] text-emerald-700 font-mono font-bold mt-1">
                            Setor PNBP: {formatRupiah(totalItemPNBP)}
                          </div>
                        )}
                      </td>

                      {/* Column 7: Status Perkara */}
                      <td className="py-3 px-3.5 border-r border-slate-200">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${statusBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                          <span>{statusBadge.label}</span>
                        </div>
                      </td>

                      {/* Column 8: Actions */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Print Lembar Fisik (Matches User Photo) */}
                          <button
                            onClick={() => onOpenPrint(reg)}
                            className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition cursor-pointer"
                            title="Cetak Formulir Register Fisik (Format Resmi)"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Print Label Stiker BB */}
                          <button
                            onClick={() => onOpenLabel(reg)}
                            className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition cursor-pointer"
                            title="Cetak Label Stiker Barang Bukti"
                          >
                            <Tag className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onOpenEdit(reg)}
                            className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition cursor-pointer"
                            title="Ubah Data Register"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDelete(reg.id)}
                            className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition cursor-pointer"
                            title="Hapus Register"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Detail Accordion Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-b-2 border-slate-300">
                        <td colSpan={8} className="p-4 sm:p-5">
                          <div className="bg-white rounded-xl border-2 border-slate-300 p-4 space-y-3 shadow-xs">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                                <Package className="w-4 h-4 text-emerald-600" />
                                Rincian Fisik Barang Bukti: {reg.registerBarangBukti}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>Periode: <strong>Bulan {bulanVal || '-'} / {tahunVal || '-'}</strong></span>
                                <span>&bull;</span>
                                <span>Penyidik Asal: <strong>{reg.penyidikAsal || '-'}</strong></span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {reg.barangBuktiList.map((item, idx) => {
                                const itemAssetStatus = item.statusPemulihanAset || reg.statusPemulihanAset || 'BUKAN_RAMPASAN';
                                const itemAssetBadge = getStatusPemulihanBadge(itemAssetStatus);

                                return (
                                  <div
                                    key={item.id || idx}
                                    className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                          {getCategoryIcon(item.jenisBarang)}
                                          <span>
                                            {item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}{item.namaBarang}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                                          {item.jenisBarang}
                                        </span>
                                      </div>

                                      <p className="text-xs text-slate-700 font-mono leading-relaxed">
                                        {item.spesifikasi || 'Tidak ada keterangan nomor spesifikasi.'}
                                      </p>
                                    </div>

                                    <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-200/80">
                                      {/* Status Pemulihan Aset per-item */}
                                      <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500 font-medium">Status Pemulihan Aset:</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${itemAssetBadge.bg}`}>
                                          {itemAssetBadge.label}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                                        <span>Lokasi: {item.lokasiPenyimpanan}</span>
                                        {item.nominalPnbp !== undefined && item.nominalPnbp > 0 ? (
                                          <span className="font-mono font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px]">
                                            PNBP: {formatRupiah(item.nominalPnbp)}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {reg.amarPutusan && (
                              <div className="mt-3 p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg text-xs text-purple-900">
                                <span className="font-bold">Amar Putusan Pengadilan:</span>{' '}
                                {reg.amarPutusan}
                              </div>
                            )}

                            {reg.catatanPetugas && (
                              <div className="p-2 bg-slate-100 rounded text-xs text-slate-700">
                                <span className="font-semibold">Catatan Petugas:</span>{' '}
                                {reg.catatanPetugas}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      <div className="p-4 border-t-2 border-slate-300 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span>
            Menampilkan <strong className="text-slate-950 font-bold">{filteredRegisters.length > 0 ? startIndex + 1 : 0}</strong> - <strong className="text-slate-950 font-bold">{endIndex}</strong> dari total <strong className="text-slate-950 font-bold">{filteredRegisters.length}</strong> baris data
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {/* First Page Button */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition"
              title="Halaman Pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Page Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition flex items-center gap-1 font-semibold"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= activePage - 1 && pageNum <= activePage + 1)
                ) {
                  const isActive = pageNum === activePage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === activePage - 2 || pageNum === activePage + 2) {
                  return (
                    <span key={pageNum} className="px-1 text-slate-400 font-bold">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition flex items-center gap-1 font-semibold"
              title="Halaman Selanjutnya"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed transition"
              title="Halaman Terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
