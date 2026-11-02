import React, { useState, useEffect } from 'react';
import { RegisterPerkara, EvidenceItem, JenisBarang, StatusPerkara, StatusPemulihanAset } from '../types';
import { KODE_PERKARA_OPTIONS, LOKASI_PENYIMPANAN_OPTIONS, BULAN_OPTIONS, STATUS_PEMULIHAN_ASET_OPTIONS } from '../data/initialData';
import { X, Plus, Trash2, Save, AlertCircle, Calendar } from 'lucide-react';

interface RegisterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (register: RegisterPerkara) => void;
  initialData?: RegisterPerkara | null;
}

export const RegisterFormModal: React.FC<RegisterFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [selectedKodeOption, setSelectedKodeOption] = useState<string>('EOH');
  const [customKode, setCustomKode] = useState<string>('');
  const [registerPerkara, setRegisterPerkara] = useState<string>('');
  const [suratPenerimaan, setSuratPenerimaan] = useState<string>('');
  const [tanggalPenerimaan, setTanggalPenerimaan] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [bulan, setBulan] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [tahun, setTahun] = useState<string>(
    String(new Date().getFullYear())
  );
  const [penyidikAsal, setPenyidikAsal] = useState<string>('Sat Reskrim Polres Mesuji');
  const [jaksaList, setJaksaList] = useState<string[]>(['']);
  const [namaTersangka, setNamaTersangka] = useState<string>('');
  const [pasal, setPasal] = useState<string>('');
  const [registerBarangBukti, setRegisterBarangBukti] = useState<string>('');
  const [statusPerkara, setStatusPerkara] = useState<StatusPerkara>('TAHAP_PENUNTUTAN');
  const [statusPemulihanAset, setStatusPemulihanAset] = useState<StatusPemulihanAset>('TAHAP_SITA');
  const [catatanPetugas, setCatatanPetugas] = useState<string>('');
  const [amarPutusan, setAmarPutusan] = useState<string>('');

  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    {
      id: 'bb-' + Date.now(),
      namaBarang: '',
      jenisBarang: 'KENDARAAN',
      spesifikasi: '',
      kondisi: 'BAIK',
      nominalPnbp: 0,
      lokasiPenyimpanan: LOKASI_PENYIMPANAN_OPTIONS[0],
      statusPemulihanAset: 'TAHAP_SITA',
    },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      const kp = (initialData.kodePerkara || 'EOH').trim();
      const standardKeys = ['EOH', 'ENZ', 'EKU', 'PIDSUS'];
      const matched = standardKeys.find((k) => k === kp.toUpperCase());
      if (matched) {
        setSelectedKodeOption(matched);
        setCustomKode('');
      } else {
        setSelectedKodeOption('Lainnya');
        setCustomKode(kp);
      }
      setRegisterPerkara(initialData.registerPerkara || '');
      setSuratPenerimaan(initialData.suratPenerimaan || '');
      setTanggalPenerimaan(initialData.tanggalPenerimaan || '');
      setBulan(initialData.bulan || String(new Date().getMonth() + 1).padStart(2, '0'));
      setTahun(initialData.tahun || String(new Date().getFullYear()));
      setPenyidikAsal(initialData.penyidikAsal || '');
      setJaksaList(initialData.jaksaPU.length ? initialData.jaksaPU : ['']);
      setNamaTersangka(initialData.namaTersangka || '');
      setPasal(initialData.pasal || '');
      setRegisterBarangBukti(initialData.registerBarangBukti || '');
      setStatusPerkara(initialData.statusPerkara || 'TAHAP_PENUNTUTAN');
      setStatusPemulihanAset(initialData.statusPemulihanAset || 'TAHAP_SITA');
      setCatatanPetugas(initialData.catatanPetugas || '');
      setAmarPutusan(initialData.amarPutusan || '');
      setEvidenceItems(initialData.barangBuktiList || []);
    } else {
      // Defaults for new record
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentYear = String(now.getFullYear());
      setSelectedKodeOption('EOH');
      setCustomKode('');
      setRegisterPerkara('');
      setSuratPenerimaan('');
      setTanggalPenerimaan(now.toISOString().split('T')[0]);
      setBulan(currentMonth);
      setTahun(currentYear);
      setPenyidikAsal('Sat Reskrim Polres Mesuji');
      setJaksaList(['']);
      setNamaTersangka('');
      setPasal('');
      setRegisterBarangBukti('');
      setStatusPerkara('TAHAP_PENUNTUTAN');
      setStatusPemulihanAset('TAHAP_SITA');
      setCatatanPetugas('');
      setAmarPutusan('');
      setEvidenceItems([
        {
          id: 'bb-' + Date.now(),
          namaBarang: '',
          jenisBarang: 'KENDARAAN',
          spesifikasi: '',
          kondisi: 'BAIK',
          nominalPnbp: 0,
          lokasiPenyimpanan: LOKASI_PENYIMPANAN_OPTIONS[0],
          statusPemulihanAset: 'TAHAP_SITA',
        },
      ]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // When tanggalPenerimaan changes, only update tanggalPenerimaan without overriding bulan and tahun
  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTanggalPenerimaan(e.target.value);
  };

  if (!isOpen) return null;

  const handleAddJaksa = () => {
    setJaksaList([...jaksaList, '']);
  };

  const handleUpdateJaksa = (index: number, val: string) => {
    const updated = [...jaksaList];
    updated[index] = val;
    setJaksaList(updated);
  };

  const handleRemoveJaksa = (index: number) => {
    if (jaksaList.length > 1) {
      setJaksaList(jaksaList.filter((_, i) => i !== index));
    }
  };

  const handleAddEvidenceItem = () => {
    setEvidenceItems([
      ...evidenceItems,
      {
        id: 'bb-' + Date.now() + Math.random().toString(36).substring(2, 6),
        namaBarang: '',
        jenisBarang: 'DOKUMEN',
        spesifikasi: '',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: LOKASI_PENYIMPANAN_OPTIONS[0],
        statusPemulihanAset: 'TAHAP_SITA',
      },
    ]);
  };

  const handleUpdateEvidence = (
    index: number,
    field: keyof EvidenceItem,
    val: string | number
  ) => {
    const updated = [...evidenceItems];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setEvidenceItems(updated);
  };

  const handleRemoveEvidence = (index: number) => {
    if (evidenceItems.length > 1) {
      setEvidenceItems(evidenceItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!registerBarangBukti.trim()) {
      newErrors.registerBarangBukti = 'Nomor Register Barang Bukti (RB) wajib diisi';
    }
    if (!registerPerkara.trim()) {
      newErrors.registerPerkara = 'Nomor Register Perkara (PDM) wajib diisi';
    }
    if (!namaTersangka.trim()) {
      newErrors.namaTersangka = 'Nama Tersangka wajib diisi';
    }
    if (!suratPenerimaan.trim()) {
      newErrors.suratPenerimaan = 'Surat Perintah Penerimaan wajib diisi';
    }
    if (!bulan.trim()) {
      newErrors.bulan = 'Bulan register wajib dipilih';
    }
    if (!tahun.trim()) {
      newErrors.tahun = 'Tahun register wajib diisi';
    }

    const filteredJaksa = jaksaList.map((j) => j.trim()).filter(Boolean);
    if (filteredJaksa.length === 0) {
      newErrors.jaksa = 'Minimal 1 Jaksa Penuntut Umum harus diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalKodePerkara =
      selectedKodeOption === 'Lainnya'
        ? (customKode.trim() || 'Lainnya')
        : selectedKodeOption;

    const preparedBBList: EvidenceItem[] = evidenceItems.map((item) => {
      const itemStatus =
        item.statusPemulihanAset === 'PROSES_LELANG'
          ? 'PROSES_LELANG_KPKNL'
          : (item.statusPemulihanAset === 'BUKAN_RAMPASAN' || item.statusPemulihanAset === 'BELUM_PENILAIAN' || item.statusPemulihanAset === 'TELAH_DINILAI')
          ? 'TAHAP_SITA'
          : (item.statusPemulihanAset || 'TAHAP_SITA');

      return {
        ...item,
        namaBarang: item.namaBarang.trim() || 'Barang Bukti',
        jumlah: Number(item.jumlah) || 1,
        nominalPnbp: Number(item.nominalPnbp) || 0,
        statusPemulihanAset: itemStatus,
      };
    });

    // Derive dominant recovery status & sum of realisasi PNBP from items
    const dominantStatus =
      preparedBBList.find((i) => i.statusPemulihanAset && i.statusPemulihanAset !== 'TAHAP_SITA')
        ?.statusPemulihanAset || 'TAHAP_SITA';

    const calculatedPNBP = preparedBBList.reduce(
      (sum, i) => sum + (i.statusPemulihanAset === 'DISETOR_PNBP' ? (i.nominalPnbp || 0) : 0),
      0
    );

    const newRegister: RegisterPerkara = {
      id: initialData ? initialData.id : 'reg-' + Date.now(),
      kodePerkara: finalKodePerkara,
      registerPerkara: registerPerkara.trim(),
      suratPenerimaan: suratPenerimaan.trim(),
      tanggalPenerimaan,
      bulan: bulan.trim(),
      tahun: tahun.trim(),
      penyidikAsal: penyidikAsal.trim(),
      jaksaPU: filteredJaksa,
      namaTersangka: namaTersangka.trim(),
      pasal: pasal.trim(),
      registerBarangBukti: registerBarangBukti.trim(),
      barangBuktiList: preparedBBList,
      statusPerkara,
      statusPemulihanAset: dominantStatus,
      nilaiPemulihanRealisasi: calculatedPNBP > 0 ? calculatedPNBP : initialData?.nilaiPemulihanRealisasi,
      nomorKwitansiPNBP: initialData?.nomorKwitansiPNBP,
      catatanPetugas: catatanPetugas.trim(),
      amarPutusan: amarPutusan.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newRegister);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold tracking-wide">
              {initialData ? 'Ubah Register Barang Bukti' : 'Input Register Penerimaan Barang Bukti Baru'}
            </h2>
            <p className="text-xs text-slate-400">
              Formulir Register Standar Seksi PAPBB Kejaksaan Negeri Mesuji
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {/* Section 1: Informasi Perkara & Register */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Bagian I: Data Register Perkara &amp; Penerimaan
            </h3>

            {/* Kolom Periode Bulan & Tahun Register */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Periode Register: Kolom Bulan &amp; Tahun</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kolom Input Bulan */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Bulan Register <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {BULAN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.bulan && (
                    <p className="text-rose-600 text-xs mt-1">{errors.bulan}</p>
                  )}
                </div>

                {/* Kolom Input Tahun */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Tahun Register <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2099"
                    placeholder="Contoh: 2026"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  {errors.tahun && (
                    <p className="text-rose-600 text-xs mt-1">{errors.tahun}</p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 mt-2">
                Format penomoran register resmi: bulan <strong>({bulan})</strong> dan tahun <strong>({tahun})</strong> akan digunakan pada No. Register BB (RB) dan No. Perkara (PDM).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Kode Perkara */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Kode Perkara <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedKodeOption}
                  onChange={(e) => setSelectedKodeOption(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {KODE_PERKARA_OPTIONS.map((opt) => (
                    <option key={opt.kode} value={opt.kode}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {selectedKodeOption === 'Lainnya' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Masukkan kode perkara lainnya (misal: PIDMIL)"
                      value={customKode}
                      onChange={(e) => setCustomKode(e.target.value)}
                      className="w-full bg-slate-50 border border-emerald-400 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Register Perkara (PDM) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Register Perkara (PDM/PDS) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PDM-26/MSJ/05/2026"
                  value={registerPerkara}
                  onChange={(e) => setRegisterPerkara(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {errors.registerPerkara && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.registerPerkara}
                  </p>
                )}
              </div>

              {/* Register Barang Bukti (RB) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Register Barang Bukti (RB) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: RB-24/MSJ/05/2026"
                  value={registerBarangBukti}
                  onChange={(e) => setRegisterBarangBukti(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {errors.registerBarangBukti && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.registerBarangBukti}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Surat Penerimaan / PRINT */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Surat Perintah Penerimaan (PRINT) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PRINT-443/L.8.22/Eoh.2/05/2026"
                  value={suratPenerimaan}
                  onChange={(e) => setSuratPenerimaan(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {errors.suratPenerimaan && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.suratPenerimaan}
                  </p>
                )}
              </div>

              {/* Tanggal Penerimaan dari Penyidik */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tgl Penerimaan Dari Penyidik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tanggalPenerimaan}
                  onChange={handleTanggalChange}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Penyidik Asal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penyidik Asal (Instansi)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sat Reskrim Polres Mesuji"
                  value={penyidikAsal}
                  onChange={(e) => setPenyidikAsal(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Tersangka & Jaksa Penuntut Umum */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Bagian II: Tersangka, Pasal &amp; Jaksa Penuntut Umum (JPU)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Tersangka / Terdakwa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: JUNI ROMADHON alias DONI bin SARJITO"
                  value={namaTersangka}
                  onChange={(e) => setNamaTersangka(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {errors.namaTersangka && (
                  <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.namaTersangka}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pasal yang Disangkakan / Didakwakan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: KUHP TAHUN 2023 Pasal 476"
                  value={pasal}
                  onChange={(e) => setPasal(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Tim Jaksa PU Multi-Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-slate-700">
                  Tim Jaksa Penuntut Umum (JPU) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddJaksa}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Jaksa
                </button>
              </div>

              <div className="space-y-2">
                {jaksaList.map((jaksa, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-slate-500 font-bold text-xs">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder={`Nama Jaksa PU ${idx + 1} lengkap dengan gelar`}
                      value={jaksa}
                      onChange={(e) => handleUpdateJaksa(idx, e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs sm:text-sm"
                    />
                    {jaksaList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveJaksa(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Jaksa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.jaksa && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.jaksa}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Rincian Barang Bukti */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Bagian III: Rincian Barang Bukti
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan seluruh item fisik, spesifikasi kendaraan (noka/nosin/nopol), dokumen, dsb.
              </p>
            </div>

            <div className="space-y-4">
              {evidenceItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white border border-slate-300 rounded-xl p-4 relative shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      Item Barang Bukti #{index + 1}
                    </span>
                    {evidenceItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(index)}
                        className="text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus Item
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Barang Bukti <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Sepeda Motor Honda CB150R / STNK / BPKB"
                        value={item.namaBarang}
                        onChange={(e) => handleUpdateEvidence(index, 'namaBarang', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jenis Barang
                      </label>
                      <select
                        value={item.jenisBarang}
                        onChange={(e) =>
                          handleUpdateEvidence(index, 'jenisBarang', e.target.value as JenisBarang)
                        }
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        <option value="KENDARAAN">Kendaraan (Roda 2/4/Alat Berat)</option>
                        <option value="DOKUMEN">Dokumen / Surat Berharga (STNK/BPKB)</option>
                        <option value="SENPI_SAJAM">Senjata Api / Tajam</option>
                        <option value="NARKOTIKA">Narkotika &amp; Psikotropika</option>
                        <option value="ELEKTRONIK">Elektronik &amp; Gadget</option>
                        <option value="UANG_PERHIASAN">Uang Tunai / Logam Mulia</option>
                        <option value="LAINNYA">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Spesifikasi Detail (Warna, Nomor Rangka, Nomor Mesin, Nomor Polisi, Merk)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Warna Merah putih dengan Noka:MH1KC911XGK040722, Nosin:KC91E1037584, Nopol:T 5441 YM"
                      value={item.spesifikasi}
                      onChange={(e) => handleUpdateEvidence(index, 'spesifikasi', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Lokasi Penyimpanan
                      </label>
                      <select
                        value={item.lokasiPenyimpanan || LOKASI_PENYIMPANAN_OPTIONS[0]}
                        onChange={(e) =>
                          handleUpdateEvidence(index, 'lokasiPenyimpanan', e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {LOKASI_PENYIMPANAN_OPTIONS.map((loc, idx) => (
                          <option key={idx} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-emerald-800 mb-1">
                        Status Pemulihan Aset
                      </label>
                      <select
                        value={
                          item.statusPemulihanAset === 'PROSES_LELANG' ||
                          item.statusPemulihanAset === 'PROSES_LELANG_KPKNL' ||
                          item.statusPemulihanAset === 'TERJUAL_LELANG'
                            ? 'DIRAMPAS_LELANG'
                            : item.statusPemulihanAset === 'DISETOR_PNBP'
                            ? 'DISETOR_KAS_NEGARA'
                            : item.statusPemulihanAset === 'BUKAN_RAMPASAN' ||
                              item.statusPemulihanAset === 'BELUM_PENILAIAN' ||
                              item.statusPemulihanAset === 'TELAH_DINILAI'
                            ? 'TAHAP_SITA'
                            : (item.statusPemulihanAset || 'TAHAP_SITA')
                        }
                        onChange={(e) =>
                          handleUpdateEvidence(index, 'statusPemulihanAset', e.target.value as StatusPemulihanAset)
                        }
                        className="w-full border border-emerald-300 bg-emerald-50/50 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        {STATUS_PEMULIHAN_ASET_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Nominal Rupiah (PNBP)</span>
                        {(item.statusPemulihanAset === 'DISETOR_KAS_NEGARA' || item.statusPemulihanAset === 'DISETOR_PNBP') && (
                          <span className="text-[10px] text-emerald-700 font-bold uppercase bg-emerald-100 px-1 py-0.2 rounded">
                            Disetor
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          placeholder="0"
                          value={item.nominalPnbp !== undefined && item.nominalPnbp !== null ? item.nominalPnbp : ''}
                          onChange={(e) =>
                            handleUpdateEvidence(
                              index,
                              'nominalPnbp',
                              e.target.value === '' ? 0 : Number(e.target.value)
                            )
                          }
                          className={`w-full border rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-mono focus:ring-2 focus:outline-hidden ${
                            item.statusPemulihanAset === 'DISETOR_KAS_NEGARA' || item.statusPemulihanAset === 'DISETOR_PNBP'
                              ? 'border-emerald-400 bg-emerald-50/50 text-emerald-950 font-bold focus:ring-emerald-500'
                              : 'border-slate-300 bg-white text-slate-900 focus:ring-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tombol Tambah Item BB di Bagian Bawah Daftar */}
              <button
                type="button"
                onClick={() => handleAddEvidenceItem()}
                className="w-full py-3 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Item Barang Bukti Baru</span>
              </button>
            </div>
          </div>

          {/* Section 4: Status Penanganan Perkara & Putusan */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Bagian IV: Status Penanganan Perkara &amp; Putusan
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Penanganan Perkara
              </label>
              <select
                value={statusPerkara.startsWith('INKRACHT') ? 'INKRACHT' : statusPerkara}
                onChange={(e) => setStatusPerkara(e.target.value as StatusPerkara)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="TAHAP_PENUNTUTAN">Tahap Penuntutan (Tahap II)</option>
                <option value="PERSIDANGAN">Persidangan</option>
                <option value="INKRACHT">Inkracht</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Amar Putusan Pengadilan (Jika Telah Diputus / Inkracht)
              </label>
              <textarea
                rows={4}
                placeholder={"Contoh:\nPutusan Pengadilan Negeri Menggala No. 12/Pid.B/2026/PN Mgl\n1. Menyatakan barang bukti dirampas untuk negara\n2. Menetapkan barang bukti dikembalikan kepada saksi"}
                value={amarPutusan}
                onChange={(e) => setAmarPutusan(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs sm:text-sm font-normal"
              />
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span>💡</span>
                <span>
                  <strong>Format Per Baris:</strong> Tekan <strong>Enter</strong> untuk membuat baris baru. Setiap baris akan dicetak persis sesuai susunan ini pada Label Stiker Barang Bukti.
                </span>
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Petugas Pengelola Barang Bukti
              </label>
              <input
                type="text"
                placeholder="Contoh: Kondisi segel aman, kunci dan surat lengkap tersimpan di brankas"
                value={catatanPetugas}
                onChange={(e) => setCatatanPetugas(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Register Perkara</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
