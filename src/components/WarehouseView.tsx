import React, { useState } from 'react';
import { RegisterPerkara, EvidenceItem } from '../types';
import { LOKASI_PENYIMPANAN_OPTIONS } from '../data/initialData';
import { formatRupiah } from '../utils/formatters';
import { 
  Warehouse, 
  MapPin, 
  Package, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Car, 
  FileText, 
  Flame, 
  Smartphone, 
  Banknote,
  Tag
} from 'lucide-react';

interface WarehouseViewProps {
  registers: RegisterPerkara[];
  onOpenLabel: (register: RegisterPerkara) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  registers,
  onOpenLabel,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');

  // Flatten all items with parent register context
  const allItems: { item: EvidenceItem; parent: RegisterPerkara }[] = [];
  registers.forEach((reg) => {
    reg.barangBuktiList.forEach((bb) => {
      allItems.push({
        item: bb,
        parent: reg,
      });
    });
  });

  const filteredItems = allItems.filter(({ item, parent }) => {
    const q = searchLocationQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      item.namaBarang.toLowerCase().includes(q) ||
      item.spesifikasi.toLowerCase().includes(q) ||
      parent.registerBarangBukti.toLowerCase().includes(q) ||
      parent.namaTersangka.toLowerCase().includes(q) ||
      item.lokasiPenyimpanan.toLowerCase().includes(q);

    const matchLocation =
      selectedLocation === 'ALL' || item.lokasiPenyimpanan === selectedLocation;

    return matchQuery && matchLocation;
  });

  // Calculate location counts
  const locationCounts: { [key: string]: number } = {};
  allItems.forEach(({ item }) => {
    const loc = item.lokasiPenyimpanan || 'Belum Ditentukan';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  const getCategoryIcon = (jenis: string) => {
    switch (jenis) {
      case 'KENDARAAN':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'DOKUMEN':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'NARKOTIKA':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'ELEKTRONIK':
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'UANG_PERHIASAN':
        return <Banknote className="w-4 h-4 text-emerald-600" />;
      default:
        return <Package className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Warehouse Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <Warehouse className="w-4 h-4" />
              <span>Manajemen Fisik &amp; Tata Kelola Ruang Penyimpanan</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Gudang &amp; Tempat Penyimpanan Barang Bukti Kejaksaan Negeri Mesuji
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Memastikan seluruh barang bukti tersimpan aman, tertata rapi sesuai zonasi, tersegel utuh, dan mudah diverifikasi saat audit internal maupun pembuktian sidang.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Total Fisik Tersimpan</div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {allItems.length} Item
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Storage Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <button
          onClick={() => setSelectedLocation('ALL')}
          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
            selectedLocation === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              Semua Lokasi Penyimpanan
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
              {allItems.length}
            </span>
          </div>
          <p className="text-[11px] opacity-75 mt-1">Seluruh gudang, brankas, dan rekening RPL Seksi PAPBB</p>
        </button>

        {LOKASI_PENYIMPANAN_OPTIONS.map((loc, idx) => {
          const count = locationCounts[loc] || 0;
          const isSelected = selectedLocation === loc;

          return (
            <button
              key={idx}
              onClick={() => setSelectedLocation(loc)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold line-clamp-1">{loc}</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className="text-[11px] opacity-75 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Area Pengelolaan BB &amp; Aset
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter and Item Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari barang, nopol, nomor rangka, atau nomor RB..."
              value={searchLocationQuery}
              onChange={(e) => setSearchLocationQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-900">{filteredItems.length}</span> item barang bukti
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Barang Bukti &amp; Spesifikasi</th>
                <th className="py-3 px-4">Lokasi Penyimpanan Fisik</th>
                <th className="py-3 px-4">No. Register BB (RB)</th>
                <th className="py-3 px-4">Tersangka / Perkara</th>
                <th className="py-3 px-4">Status Pemulihan Aset</th>
                <th className="py-3 px-4 text-center">Label Fisik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map(({ item, parent }, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 max-w-[280px]">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.jenisBarang)}
                      <span className="font-bold text-slate-900">
                        {item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}{item.namaBarang}
                      </span>
                    </div>
                    {item.spesifikasi && (
                      <div className="text-[11px] text-slate-600 font-mono mt-1 leading-relaxed">
                        {item.spesifikasi}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 border border-slate-300 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.lokasiPenyimpanan}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-950">
                      {parent.registerBarangBukti}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {parent.registerPerkara}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 uppercase">
                      {parent.namaTersangka}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Jaksa: {parent.jaksaPU[0] || '-'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                      {item.statusPemulihanAset === 'DIRAMPAS_LELANG'
                        ? 'Dirampas Lelang'
                        : item.statusPemulihanAset === 'DIKEMBALIKAN'
                        ? 'Dikembalikan'
                        : item.statusPemulihanAset === 'DIMUSNAHKAN'
                        ? 'Dimusnahkan'
                        : item.statusPemulihanAset === 'DISETOR_KAS_NEGARA' || item.statusPemulihanAset === 'DISETOR_PNBP'
                        ? 'Disetor PNBP'
                        : 'Tahap Sita'}
                    </span>
                    {item.nominalPnbp !== undefined && item.nominalPnbp > 0 && (
                      <div className="text-[11px] font-mono font-semibold text-emerald-800 mt-1">
                        {formatRupiah(item.nominalPnbp)}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onOpenLabel(parent)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition cursor-pointer"
                      title="Cetak Stiker Label Barang Bukti"
                    >
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Cetak Label</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
