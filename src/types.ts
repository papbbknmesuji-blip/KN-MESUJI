export type JenisBarang = 
  | 'KENDARAAN'
  | 'DOKUMEN'
  | 'SENPI_SAJAM'
  | 'NARKOTIKA'
  | 'ELEKTRONIK'
  | 'UANG_PERHIASAN'
  | 'LAINNYA';

export type KondisiBarang = 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT';

export type StatusPerkara = 
  | 'TAHAP_PENUNTUTAN'
  | 'PERSIDANGAN'
  | 'INKRACHT'
  | 'INKRACHT_DIKEMBALIKAN'
  | 'INKRACHT_DIRAMPAS_NEGARA'
  | 'INKRACHT_DIMUSNAHKAN'
  | 'PENITIPAN_RUPBASAN';

export type StatusPemulihanAset = 
  | 'TAHAP_SITA'
  | 'DIRAMPAS_LELANG'
  | 'DIKEMBALIKAN'
  | 'DIMUSNAHKAN'
  | 'DISETOR_KAS_NEGARA'
  | 'PROSES_LELANG_KPKNL'
  | 'TERJUAL_LELANG'
  | 'DISETOR_PNBP'
  | 'BUKAN_RAMPASAN'
  | 'BELUM_PENILAIAN'
  | 'TELAH_DINILAI'
  | 'PROSES_LELANG';

export interface EvidenceItem {
  id: string;
  namaBarang: string;
  jenisBarang: JenisBarang;
  jumlah?: number;
  satuan?: string;
  spesifikasi: string; // noka, nosin, nopol, warna, merk, kondisi
  kondisi: KondisiBarang;
  nilaiTaksiran?: number; // Nilai Taksiran Aset (opsional/legacy)
  nominalPnbp?: number; // Nominal Rupiah Disetor ke Kas Negara (PNBP)
  lokasiPenyimpanan: string;
  statusPemulihanAset?: StatusPemulihanAset; // Status Pemulihan Aset per-item BB
  keterangan?: string;
}

export interface RegisterPerkara {
  id: string;
  kodePerkara: string; // e.g. "Eoh"
  registerPerkara: string; // e.g. "PDM-26/MSJ/05/2026"
  suratPenerimaan: string; // e.g. "PRINT-443/L.8.22/Eoh.2/05/2026"
  tanggalPenerimaan: string; // e.g. "2026-05-21"
  bulan: string; // e.g. "05" atau "Mei"
  tahun: string; // e.g. "2026"
  penyidikAsal: string; // e.g. "Penyidik Polres Mesuji"
  jaksaPU: string[]; // e.g. ["REGHA PRAWIRA UTAMA, S.H.", "ALVIN DWI NANDA, S.H.", "ANA ALSAN MUHAMMAD, S.H."]
  namaTersangka: string; // e.g. "JUNI ROMADHON alias DONI bin SARJITO"
  pasal: string; // e.g. "KUHP TAHUN 2023 Pasal 476"
  registerBarangBukti: string; // e.g. "RB-24/MSJ/05/2026"
  barangBuktiList: EvidenceItem[];
  statusPerkara: StatusPerkara;
  statusPemulihanAset: StatusPemulihanAset;
  nilaiPemulihanRealisasi?: number;
  nomorKwitansiPNBP?: string;
  amarPutusan?: string;
  tanggalPutusan?: string;
  catatanPetugas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  statusPerkara: string;
  jenisBarang: string;
  statusPemulihanAset: string;
  kodePerkara: string;
  bulan: string;
  tahun: string;
}
