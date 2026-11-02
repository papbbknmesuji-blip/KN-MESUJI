import React, { useState } from 'react';
import { RegisterPerkara, StatusPemulihanAset } from '../types';
import { formatRupiah, formatDateIndo, getStatusPemulihanBadge } from '../utils/formatters';
import { 
  Coins, 
  TrendingUp, 
  Landmark, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  DollarSign, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface AssetRecoveryViewProps {
  registers: RegisterPerkara[];
  onUpdateRegister: (register: RegisterPerkara) => void;
  onRequestAuth?: (title: string, action: () => void, description?: string) => void;
}

export const AssetRecoveryView: React.FC<AssetRecoveryViewProps> = ({
  registers,
  onUpdateRegister,
  onRequestAuth,
}) => {
  // Helper to determine if a status is Dirampas untuk Negara (Lelang) or PNBP settlement
  const isDirampasNegaraStatus = (status?: string) => {
    if (!status) return false;
    return (
      status === 'DIRAMPAS_LELANG' ||
      status === 'PROSES_LELANG' ||
      status === 'PROSES_LELANG_KPKNL' ||
      status === 'TERJUAL_LELANG' ||
      status === 'DISETOR_PNBP' ||
      status === 'DISETOR_KAS_NEGARA'
    );
  };

  // Filter only records whose Status Pemulihan Aset is 'Dirampas untuk Negara (Lelang)' or related PNBP
  const rampasanRegisters = registers.filter((r) => {
    const isRegisterRampasan =
      isDirampasNegaraStatus(r.statusPemulihanAset) ||
      r.statusPerkara === 'INKRACHT_DIRAMPAS_NEGARA';
    const hasItemRampasan = r.barangBuktiList.some((item) =>
      isDirampasNegaraStatus(item.statusPemulihanAset)
    );
    return isRegisterRampasan || hasItemRampasan;
  });

  const [selectedCase, setSelectedCase] = useState<RegisterPerkara | null>(null);
  const [newStatus, setNewStatus] = useState<StatusPemulihanAset>('DIRAMPAS_LELANG');
  const [realisasiValue, setRealisasiValue] = useState<string>('');
  const [kwitansiPNBP, setKwitansiPNBP] = useState<string>('');

  const totalSetorPNBP = rampasanRegisters.reduce((acc, curr) => {
    const itemPNBP = curr.barangBuktiList
      .filter((bb) => isDirampasNegaraStatus(bb.statusPemulihanAset))
      .reduce((sum, item) => sum + (item.nominalPnbp || 0), 0);
    return acc + (itemPNBP > 0 ? itemPNBP : (curr.nilaiPemulihanRealisasi || 0));
  }, 0);

  const terjualCount = rampasanRegisters.filter(
    (r) =>
      r.statusPemulihanAset === 'TERJUAL_LELANG' ||
      r.statusPemulihanAset === 'DISETOR_PNBP' ||
      r.statusPemulihanAset === 'DISETOR_KAS_NEGARA' ||
      r.barangBuktiList.some(
        (bb) =>
          bb.statusPemulihanAset === 'TERJUAL_LELANG' ||
          bb.statusPemulihanAset === 'DISETOR_PNBP' ||
          bb.statusPemulihanAset === 'DISETOR_KAS_NEGARA'
      )
  ).length;

  const handleOpenUpdate = (reg: RegisterPerkara) => {
    const proceed = () => {
      setSelectedCase(reg);
      const initialStatus =
        reg.statusPemulihanAset && isDirampasNegaraStatus(reg.statusPemulihanAset)
          ? reg.statusPemulihanAset === 'PROSES_LELANG'
            ? 'PROSES_LELANG_KPKNL'
            : reg.statusPemulihanAset
          : 'DIRAMPAS_LELANG';
      setNewStatus(initialStatus as StatusPemulihanAset);
      const existingVal =
        reg.nilaiPemulihanRealisasi ||
        reg.barangBuktiList.reduce((s, i) => s + (i.nominalPnbp || 0), 0);
      setRealisasiValue(existingVal ? existingVal.toString() : '');
      setKwitansiPNBP(reg.nomorKwitansiPNBP || '');
    };

    if (onRequestAuth) {
      onRequestAuth(
        `Update Progres Lelang / PNBP (${reg.registerBarangBukti})`,
        proceed,
        `Verifikasi otorisasi untuk memperbarui status pemulihan aset atau nominal PNBP ${reg.registerBarangBukti}.`
      );
    } else {
      proceed();
    }
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    const nominalNum = realisasiValue ? Number(realisasiValue) : undefined;

    const updated: RegisterPerkara = {
      ...selectedCase,
      statusPemulihanAset: newStatus,
      barangBuktiList: selectedCase.barangBuktiList.map((item) => ({
        ...item,
        statusPemulihanAset: newStatus,
        nominalPnbp: (newStatus === 'DISETOR_PNBP' || newStatus === 'DISETOR_KAS_NEGARA') ? (nominalNum || item.nominalPnbp) : undefined,
      })),
      nilaiPemulihanRealisasi: nominalNum,
      nomorKwitansiPNBP: kwitansiPNBP.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onUpdateRegister(updated);
    setSelectedCase(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Asset Recovery */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-emerald-700/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Seksi PAPBB
              </span>
              <span className="text-xs text-slate-300">Kejaksaan Negeri Mesuji</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Modul Pemulihan Aset &amp; Pengelolaan Barang Rampasan Negara
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoring Aset Rampasan dan PNBP
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-slate-950/60 p-4 rounded-xl border border-emerald-800/50">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Perkara Rampasan Negara</p>
              <p className="text-base sm:text-lg font-bold text-slate-100 font-mono mt-0.5">
                {rampasanRegisters.length} <span className="text-xs font-normal text-slate-400">Perkara</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-emerald-400 uppercase">Realisasi Setor PNBP</p>
              <p className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {formatRupiah(totalSetorPNBP)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Barang Rampasan (Lelang)</p>
            <h4 className="text-xl font-bold text-slate-900 font-mono">
              {rampasanRegisters.filter((r) => r.statusPemulihanAset === 'DIRAMPAS_LELANG' || r.statusPemulihanAset === 'PROSES_LELANG' || r.statusPemulihanAset === 'PROSES_LELANG_KPKNL' || r.barangBuktiList.some((bb) => bb.statusPemulihanAset === 'DIRAMPAS_LELANG' || bb.statusPemulihanAset === 'PROSES_LELANG')).length}{' '}
              <span className="text-xs font-normal text-slate-500">Perkara</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Dirampas untuk Negara / Lelang KPKNL</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Terjual Lelang KPKNL</p>
            <h4 className="text-xl font-bold text-slate-900 font-mono">
              {terjualCount} <span className="text-xs font-normal text-slate-500">Perkara</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Risalah Lelang Terbit</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-xs flex items-center gap-4 bg-emerald-50/40">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase">PNBP Disetor Kas Negara</p>
            <h4 className="text-xl font-bold text-emerald-700 font-mono">
              {formatRupiah(totalSetorPNBP)}
            </h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">Bukti NTPN / Simponi Lengkap</p>
          </div>
        </div>
      </div>

      {/* Rampasan Records Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              Daftar Barang Rampasan Negara &amp; Aset Pemulihan Keuangan Negara
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Barang bukti yang telah berkekuatan hukum tetap (Inkracht) dan bernilai ekonomis untuk dilelang atau disetor ke kas negara
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-300 px-2.5 py-1 rounded text-slate-800">
              {rampasanRegisters.length} Aset Terdata
            </span>
          </div>
        </div>

        {rampasanRegisters.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm">Belum ada barang bukti berstatus Dirampas untuk Negara (Lelang)</p>
            <p className="text-xs text-slate-400 mt-1">
              Saat perkara inkracht dan diputus &apos;Dirampas untuk Negara (Lelang)&apos;, data akan tampil di modul ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b-2 border-slate-300">
                  <th className="py-3 px-4 border-r border-slate-300">No. Register RB &amp; Perkara</th>
                  <th className="py-3 px-4 border-r border-slate-300">Terdakwa / Terpidana</th>
                  <th className="py-3 px-4 border-r border-slate-300">Barang Rampasan</th>
                  <th className="py-3 px-4 border-r border-slate-300">Status Pemulihan Aset</th>
                  <th className="py-3 px-4 border-r border-slate-300">Realisasi Setor PNBP</th>
                  <th className="py-3 px-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rampasanRegisters.map((reg) => {
                  const badge = getStatusPemulihanBadge(
                    reg.statusPemulihanAset && isDirampasNegaraStatus(reg.statusPemulihanAset)
                      ? reg.statusPemulihanAset
                      : 'DIRAMPAS_LELANG'
                  );
                  const rampasanItems = reg.barangBuktiList.filter((item) => {
                    if (item.statusPemulihanAset) {
                      return isDirampasNegaraStatus(item.statusPemulihanAset);
                    }
                    return isDirampasNegaraStatus(reg.statusPemulihanAset) || reg.statusPerkara === 'INKRACHT_DIRAMPAS_NEGARA';
                  });
                  const displayBBList = rampasanItems.length > 0 ? rampasanItems : reg.barangBuktiList;

                  const totalItemPNBP = displayBBList.reduce(
                    (sum, item) => sum + (item.nominalPnbp || 0),
                    0
                  );
                  const displayPNBP = totalItemPNBP > 0 ? totalItemPNBP : reg.nilaiPemulihanRealisasi;

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50 transition border-b border-slate-200">
                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="font-mono font-bold text-slate-900">
                          {reg.registerBarangBukti}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {reg.registerPerkara}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <div className="font-bold text-slate-950 uppercase">
                          {reg.namaTersangka}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 max-w-[200px] truncate">
                          {reg.pasal}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[260px] border-r border-slate-200">
                        <ul className="space-y-1">
                          {displayBBList.map((item, idx) => (
                            <li key={idx} className="text-slate-800">
                              <span className="font-semibold">
                                {item.jumlah && item.satuan ? `${item.jumlah} ${item.satuan} ` : ''}{item.namaBarang}
                              </span>
                              {item.spesifikasi && (
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {item.spesifikasi}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        <span className={`inline-block px-2.5 py-1 rounded-md border text-xs font-semibold ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 border-r border-slate-200">
                        {displayPNBP ? (
                          <div>
                            <div className="font-mono font-bold text-emerald-700">
                              {formatRupiah(displayPNBP)}
                            </div>
                            {reg.nomorKwitansiPNBP && (
                              <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate max-w-[180px]">
                                Bukti: {reg.nomorKwitansiPNBP}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Belum disetor</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenUpdate(reg)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                        >
                          Update Progres Lelang / PNBP
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Update Progres Pemulihan Aset */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  Update Progres Pemulihan Aset &amp; Lelang
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedCase.registerBarangBukti} - {selectedCase.namaTersangka}
                </p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Pemulihan Aset
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as StatusPemulihanAset)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="DIRAMPAS_LELANG">Dirampas untuk Negara (Lelang)</option>
                  <option value="PROSES_LELANG_KPKNL">Proses Lelang KPKNL</option>
                  <option value="TERJUAL_LELANG">Terjual Lelang</option>
                  <option value="DISETOR_PNBP">Disetor ke Kas Negara (PNBP)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nilai Realisasi Hasil Lelang / Uang Rampasan (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 418500000"
                  value={realisasiValue}
                  onChange={(e) => setRealisasiValue(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Nominal bersih yang berhasil diselamatkan / disetor ke kas negara.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor NTPN / Kwitansi Setoran PNBP / Biling Simponi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: NTPN-8849201934892019 / BNI-MSJ"
                  value={kwitansiPNBP}
                  onChange={(e) => setKwitansiPNBP(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
