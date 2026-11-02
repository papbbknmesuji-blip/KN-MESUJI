import { RegisterPerkara } from '../types';

export const BULAN_OPTIONS = [
  { value: '01', label: '01 - Januari' },
  { value: '02', label: '02 - Februari' },
  { value: '03', label: '03 - Maret' },
  { value: '04', label: '04 - April' },
  { value: '05', label: '05 - Mei' },
  { value: '06', label: '06 - Juni' },
  { value: '07', label: '07 - Juli' },
  { value: '08', label: '08 - Agustus' },
  { value: '09', label: '09 - September' },
  { value: '10', label: '10 - Oktober' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - Desember' },
];

export const INITIAL_REGISTERS: RegisterPerkara[] = [
  {
    id: 'reg-001',
    kodePerkara: 'EOH',
    registerPerkara: 'PDM-26/MSJ/05/2026',
    suratPenerimaan: 'PRINT-443/L.8.22/Eoh.2/05/2026',
    tanggalPenerimaan: '2026-05-21',
    bulan: '05',
    tahun: '2026',
    penyidikAsal: 'Sat Reskrim Polres Mesuji',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ALVIN DWI NANDA, S.H.',
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'JUNI ROMADHON alias DONI bin SARJITO',
    pasal: 'KUHP TAHUN 2023 Pasal 476',
    registerBarangBukti: 'RB-24/MSJ/05/2026',
    barangBuktiList: [
      {
        id: 'bb-001',
        namaBarang: 'Sepeda Motor Honda CB150R',
        jenisBarang: 'KENDARAAN',
        spesifikasi: 'Warna Merah putih dengan Noka:MH1KC911XGK040722, Nosin:KC91E1037584, Nopol:T 5441 YM',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Kunci kontak lengkap, mesin hidup, kondisi terawat'
      },
      {
        id: 'bb-002',
        namaBarang: 'STNK Motor Honda CB150R',
        jenisBarang: 'DOKUMEN',
        spesifikasi: 'Warna Merah putih dengan Noka:MH1KC911XGK040722, Nosin:KC91E1037584, Nopol:T 5441 YM an. Pemilik Terdaftar',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Asli dan masih berlaku'
      },
      {
        id: 'bb-003',
        namaBarang: 'BPKB Motor Honda CB150R',
        jenisBarang: 'DOKUMEN',
        spesifikasi: 'Warna Merah putih dengan Noka:MH1KC911XGK040722, Nosin:KC91E1037584, Nopol:T 5441 YM',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Buku asli lengkap'
      },
      {
        id: 'bb-001-d',
        namaBarang: 'Kunci Kontak Asli Honda CB150R',
        jenisBarang: 'LAINNYA',
        spesifikasi: '1 buah anak kunci kontak berlogo sayap Honda dengan gantungan tali warna merah',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Fungsi normal'
      },
      {
        id: 'bb-001-e',
        namaBarang: 'Helm Full Face KYT Falcon FR',
        jenisBarang: 'LAINNYA',
        spesifikasi: 'Warna Hitam Doff motif grafis merah, ukuran L, kaca visor bening',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Rak Helm Gudang BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Dipakai tersangka saat kejadian'
      },
      {
        id: 'bb-001-f',
        namaBarang: 'Jaket Parasut Bertutup Kepala',
        jenisBarang: 'LAINNYA',
        spesifikasi: 'Merk Erigo, warna biru dongker gelap, resleting depan aktif',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB Lemari A',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Pakaian saat tindak pidana'
      },
      {
        id: 'bb-001-f2',
        namaBarang: '1 (satu) buah celana berwarna abu-abu',
        jenisBarang: 'LAINNYA',
        spesifikasi: '1 (satu) buah celana panjang jeans berwarna abu-abu',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB Lemari A',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Pakaian milik tersangka saat kejadian perkara'
      },
      {
        id: 'bb-001-g',
        namaBarang: 'Sepasang Sarung Tangan Kulit',
        jenisBarang: 'LAINNYA',
        spesifikasi: 'Merk Pro-Biker warna hitam kombinasi pelindung karbon',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB Lemari A',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Alat bantu kejahatan'
      },
      {
        id: 'bb-001-h',
        namaBarang: 'Gagang Kunci Letter T Modifikasi',
        jenisBarang: 'SENPI_SAJAM',
        spesifikasi: 'Bahan besi baja chrome panjang 15 cm dengan pegangan silang pipa besi',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box Logam Brankas Khusus',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Alat merusak rumah kunci motor'
      },
      {
        id: 'bb-001-i',
        namaBarang: 'Mata Kunci Letter T Ujung Runcing Pipih',
        jenisBarang: 'SENPI_SAJAM',
        spesifikasi: '3 buah mata obeng baja asahan khusus yang dapat dipasang pada gagang T',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box Logam Brankas Khusus',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Mata kunci modifikasi'
      },
      {
        id: 'bb-001-j',
        namaBarang: 'Magnet Pembuka Tutup Kunci Kontak',
        jenisBarang: 'LAINNYA',
        spesifikasi: '1 buah kunci silinder berisi 4 titik magnet pembuka cover magnetik sepeda motor',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box Logam Brankas Khusus',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Alat pembuka pengaman magnet'
      },
      {
        id: 'bb-001-k',
        namaBarang: 'Tas Ransel Punggung Rigi',
        jenisBarang: 'LAINNYA',
        spesifikasi: 'Merk Eiger 25L warna abu-abu gelap tempat menyimpan perkakas kunci',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB Lemari B',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Wadah peralatan tersangka'
      },
      {
        id: 'bb-001-l',
        namaBarang: 'Flashdisk SanDisk Cruzer Blade 32GB',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Warna hitam-merah berisi rekaman CCTV lokasi kejadian perkara berdurasi 45 menit',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Bukti elektronik rekaman tindak pidana'
      },
      {
        id: 'bb-001-m',
        namaBarang: 'Handphone Samsung Galaxy A14',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Warna Hitam, IMEI:358291029482711, kondisi aktif dengan kartu SIM terpasang',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Alat komunikasi dan transaksi hasil curian'
      }
    ],
    statusPerkara: 'TAHAP_PENUNTUTAN',
    statusPemulihanAset: 'TAHAP_SITA',
    catatanPetugas: 'Penerimaan Tahap II dari Penyidik Sat Reskrim Polres Mesuji dalam keadaan lengkap dan tersegel aman.',
    createdAt: '2026-05-21T09:30:00Z',
    updatedAt: '2026-05-21T09:30:00Z'
  },
  {
    id: 'reg-002',
    kodePerkara: 'PIDSUS',
    registerPerkara: 'PDS-08/MSJ/03/2026',
    suratPenerimaan: 'PRINT-128/L.8.22/Fd.1/03/2026',
    tanggalPenerimaan: '2026-03-14',
    bulan: '03',
    tahun: '2026',
    penyidikAsal: 'Tim Penyidik Pidsus Kejaksaan Negeri Mesuji',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'IRWAN SUGIANTO, S.Sos. (Mantan Kades)',
    pasal: 'UU Tipikor No. 31/1999 jo UU No. 20/2001 Pasal 2 ayat (1) jo Pasal 18',
    registerBarangBukti: 'RB-12/MSJ/03/2026',
    barangBuktiList: [
      {
        id: 'bb-004',
        namaBarang: 'Mobil Toyota Hilux Double Cabin 2.4G',
        jenisBarang: 'KENDARAAN',
        spesifikasi: 'Tahun 2021, Warna Hitam Metalik, Noka:MHFAB3CD4M12389, Nosin:2GD-FTV45678, Nopol:BE 8812 MS',
        kondisi: 'BAIK',
        nominalPnbp: 293500000,
        lokasiPenyimpanan: 'Gudang Terbuka',
        statusPemulihanAset: 'DIRAMPAS_LELANG',
        keterangan: 'Aset sitaan tindak pidana korupsi dana desa'
      },
      {
        id: 'bb-005',
        namaBarang: 'Uang Tunai Sitaan Pemulihan Kerugian Negara',
        jenisBarang: 'UANG_PERHIASAN',
        spesifikasi: 'Pecahan Rp 100.000 sebanyak 1.250 lembar tersimpan dalam amplop sitaan segel Kejaksaan',
        kondisi: 'BAIK',
        nominalPnbp: 125000000,
        lokasiPenyimpanan: 'Rekening Penampungan Lainnya (RPL) Kejari Mesuji',
        statusPemulihanAset: 'DISETOR_KAS_NEGARA',
        keterangan: 'Titipan uang pengganti kerugian keuangan negara'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DISETOR_KAS_NEGARA',
    nilaiPemulihanRealisasi: 418500000,
    nomorKwitansiPNBP: 'NTPN-8849201934892019 / BNI-MSJ',
    amarPutusan: 'Putusan PN Tanjungkarang No. 12/Pid.Sus-TPK/2026:\n1. Menyatakan barang bukti 1 unit Mobil Toyota Hilux dirampas untuk negara c.q. dilelang melalui KPKNL;\n2. Uang sitaan disetorkan ke Kas Negara sebagai uang pengganti dan PNBP Kejaksaan.',
    tanggalPutusan: '2026-06-02',
    catatanPetugas: 'Lelang berhasil dilaksanakan melalui KPKNL Metro tanggal 15 Juli 2026. Hasil lelang dan uang titipan telah disetor 100% ke Kas Negara.',
    createdAt: '2026-03-14T11:00:00Z',
    updatedAt: '2026-07-20T14:30:00Z'
  },
  {
    id: 'reg-003',
    kodePerkara: 'ENZ',
    registerPerkara: 'PDM-19/MSJ/04/2026',
    suratPenerimaan: 'PRINT-312/L.8.22/Enz.2/04/2026',
    tanggalPenerimaan: '2026-04-18',
    bulan: '04',
    tahun: '2026',
    penyidikAsal: 'Sat Resnarkoba Polres Mesuji',
    jaksaPU: [
      'ALVIN DWI NANDA, S.H.'
    ],
    namaTersangka: 'SURYA KENCANA alias KIKI bin BAMBANG',
    pasal: 'UU RI No. 35 Tahun 2009 tentang Narkotika Pasal 114 ayat (1)',
    registerBarangBukti: 'RB-18/MSJ/04/2026',
    barangBuktiList: [
      {
        id: 'bb-006',
        namaBarang: 'Narkotika Golongan I Jenis Sabu',
        jenisBarang: 'NARKOTIKA',
        spesifikasi: '3 bungkus plastik klip bening berisi kristal putih sabu dengan berat netto 18.75 gram',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Telah disisihkan untuk labfor dan pembuktian sidang'
      },
      {
        id: 'bb-007',
        namaBarang: 'Timbangan Digital Matrix & Plastik Klip',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Timbangan digital saku warna hitam beserta 50 lembar plastik klip kosong',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Alat pembungkus dan penimbang'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIMUSNAHKAN',
    amarPutusan: 'Putusan Pengadilan Negeri Menggala No. 89/Pid.Sus/2026/PN Mgl:\n1. Menyatakan barang bukti sabu netto 18.75 gram dirampas untuk dimusnahkan;\n2. 1 unit timbangan digital saku Matrix dirampas untuk dimusnahkan.',
    tanggalPutusan: '2026-06-25',
    catatanPetugas: 'Telah dijadwalkan pemusnahan massal barang bukti semester I bersama unsur Forkopimda Mesuji.',
    createdAt: '2026-04-18T10:15:00Z',
    updatedAt: '2026-06-28T09:00:00Z'
  },
  {
    id: 'reg-004',
    kodePerkara: 'EOH',
    registerPerkara: 'PDM-15/MSJ/03/2026',
    suratPenerimaan: 'PRINT-205/L.8.22/Eoh.2/03/2026',
    tanggalPenerimaan: '2026-03-05',
    bulan: '03',
    tahun: '2026',
    penyidikAsal: 'Polsek Simpang Pematang',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ALVIN DWI NANDA, S.H.'
    ],
    namaTersangka: 'HERI KURNIAWAN alias WAWAN bin SUROSO',
    pasal: 'KUHP Pasal 363 ayat (1) ke-4 (Pencurian dengan Pemberatan)',
    registerBarangBukti: 'RB-09/MSJ/03/2026',
    barangBuktiList: [
      {
        id: 'bb-008',
        namaBarang: 'Sepeda Motor Yamaha NMAX 155',
        jenisBarang: 'KENDARAAN',
        spesifikasi: 'Warna Biru Matte, Noka:MH3SG3140LJ099812, Nosin:G3J4E091122, Nopol:BE 4421 MS',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB',
        statusPemulihanAset: 'DIKEMBALIKAN',
        keterangan: 'Barang bukti hasil kejahatan milik saksi korban'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIKEMBALIKAN',
    amarPutusan: 'Putusan PN Menggala No. 45/Pid.B/2026/PN Mgl:\n1. Menyatakan Terdakwa terbukti secara sah dan meyakinkan bersalah;\n2. Memerintahkan barang bukti 1 unit sepeda motor Yamaha NMAX dikembalikan kepada saksi korban sdr. AHMAD FAUZI.',
    tanggalPutusan: '2026-05-10',
    catatanPetugas: 'Telah diserahkan langsung kepada saksi korban melalui program Si-Gentar (Pengantaran Barang Bukti Gratis) Kejari Mesuji dengan Berita Acara BA-17.',
    createdAt: '2026-03-05T08:45:00Z',
    updatedAt: '2026-05-15T13:00:00Z'
  },
  {
    id: 'reg-005',
    kodePerkara: 'EKU',
    registerPerkara: 'PDM-08/MSJ/02/2026',
    suratPenerimaan: 'PRINT-102/L.8.22/Eku.2/02/2026',
    tanggalPenerimaan: '2026-02-12',
    bulan: '02',
    tahun: '2026',
    penyidikAsal: 'Sat Reskrim Polres Mesuji',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'AGUS SETIAWAN alias AGUS bin MUKHLIS',
    pasal: 'UU Darurat No. 12 Tahun 1951 Pasal 1 ayat (1)',
    registerBarangBukti: 'RB-04/MSJ/02/2026',
    barangBuktiList: [
      {
        id: 'bb-009',
        namaBarang: 'Senjata Api Rakitan (Senpira) Revolver',
        jenisBarang: 'SENPI_SAJAM',
        spesifikasi: 'Pucuk senpira revolver 6 silinder putar, laras baja 4 inci, gagang kayu warna coklat tua',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Telah dilakukan uji balistik di Labfor Polri'
      },
      {
        id: 'bb-010',
        namaBarang: 'Amunisi Tajam Kaliber 9 mm',
        jenisBarang: 'SENPI_SAJAM',
        spesifikasi: '6 butir amunisi aktif kaliber 9x19mm Parabellum terpasang pada selongsong silinder',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Amunisi aktif tersimpan dalam wadah khusus anti-ledak'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIMUSNAHKAN',
    amarPutusan: 'Putusan PN Menggala No. 28/Pid.Sus/2026/PN Mgl:\n1. Menyatakan barang bukti 1 pucuk senjata api rakitan revolver dirampas untuk dimusnahkan;\n2. 6 butir amunisi tajam kaliber 9mm dirampas untuk dimusnahkan.',
    tanggalPutusan: '2026-04-14',
    catatanPetugas: 'Akan dimusnahkan dengan cara dipotong gerinda bersama Sat Brimob dan Forkopimda.',
    createdAt: '2026-02-12T09:00:00Z',
    updatedAt: '2026-04-20T11:00:00Z'
  },
  {
    id: 'reg-006',
    kodePerkara: 'PIDSUS',
    registerPerkara: 'PDS-03/MSJ/01/2026',
    suratPenerimaan: 'PRINT-045/L.8.22/Fd.1/01/2026',
    tanggalPenerimaan: '2026-01-20',
    bulan: '01',
    tahun: '2026',
    penyidikAsal: 'Tim Penyidik Pidsus Kejaksaan Negeri Mesuji',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ALVIN DWI NANDA, S.H.',
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'HENDRA WIJAYA alias AKIONG (Kontraktor APBD)',
    pasal: 'UU No. 31/1999 jo UU No. 20/2001 tentang Tipikor Pasal 3 jo Pasal 18',
    registerBarangBukti: 'RB-02/MSJ/01/2026',
    barangBuktiList: [
      {
        id: 'bb-011',
        namaBarang: 'Alat Berat Excavator Komatsu PC200-8',
        jenisBarang: 'KENDARAAN',
        spesifikasi: 'Warna Kuning Standar, No Seri Mesin:6D107E-129482, No Rangka/Chassis:KMTPC200-881294, Tahun 2019',
        kondisi: 'BAIK',
        nominalPnbp: 525000000,
        lokasiPenyimpanan: 'Gudang Terbuka',
        statusPemulihanAset: 'DIRAMPAS_LELANG',
        keterangan: 'Barang rampasan negara pemulihan kerugian keuangan proyek irigasi Mesuji'
      },
      {
        id: 'bb-012',
        namaBarang: 'Uang Tunai Pengembalian Kerugian Keuangan Negara',
        jenisBarang: 'UANG_PERHIASAN',
        spesifikasi: 'Uang rupiah pecahan Rp 100.000 senilai Rp 350.000.000,- disetor ke RPL Kejari Mesuji',
        kondisi: 'BAIK',
        nominalPnbp: 350000000,
        lokasiPenyimpanan: 'Rekening Penampungan Lainnya (RPL) Kejari Mesuji',
        statusPemulihanAset: 'DISETOR_KAS_NEGARA',
        keterangan: 'Titipan pembayaran uang pengganti kerugian negara'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DISETOR_KAS_NEGARA',
    nilaiPemulihanRealisasi: 875000000,
    nomorKwitansiPNBP: 'NTPN-9912048291039482 / MANDIRI-MSJ',
    amarPutusan: 'Putusan Pengadilan Tipikor Tanjungkarang No. 04/Pid.Sus-TPK/2026/PN Tjk: Menyatakan 1 unit Excavator dan uang titipan dirampas untuk negara guna disetorkan ke Kas Negara sebagai PNBP Kejaksaan.',
    tanggalPutusan: '2026-05-18',
    catatanPetugas: 'Pelelangan melalui portal lelang.go.id KPKNL Metro laku terjual Rp 525.000.000 dan uang titipan Rp 350.000.000 telah disetor penuh (Total PNBP Rp 875.000.000).',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-06-10T15:30:00Z'
  },
  {
    id: 'reg-007',
    kodePerkara: 'ENZ',
    registerPerkara: 'PDM-31/MSJ/06/2026',
    suratPenerimaan: 'PRINT-510/L.8.22/Enz.2/06/2026',
    tanggalPenerimaan: '2026-06-11',
    bulan: '06',
    tahun: '2026',
    penyidikAsal: 'Sat Resnarkoba Polres Mesuji',
    jaksaPU: [
      'ALVIN DWI NANDA, S.H.',
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'RIKO FEBRIAN bin RUSLI',
    pasal: 'UU RI No. 35 Tahun 2009 tentang Narkotika Pasal 112 ayat (2)',
    registerBarangBukti: 'RB-29/MSJ/06/2026',
    barangBuktiList: [
      {
        id: 'bb-013',
        namaBarang: 'Pil Ekstasi Logo Minion Kuning',
        jenisBarang: 'NARKOTIKA',
        spesifikasi: '25 butir pil ekstasi tablet warna kuning berlogo Minion dengan berat netto 9.82 gram',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Tersimpan dalam botol kaca bersegel resmi'
      },
      {
        id: 'bb-014',
        namaBarang: 'Handphone iPhone 13 Pro Max 256GB',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Warna Sierra Blue, IMEI:352981098274619, Kondisi hidup, casing silikon bening',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Alat komunikasi transaksi narkotika'
      }
    ],
    statusPerkara: 'PERSIDANGAN',
    statusPemulihanAset: 'TAHAP_SITA',
    catatanPetugas: 'Dalam proses persidangan di PN Menggala, barang bukti dihadirkan untuk pemeriksaan saksi ahli.',
    createdAt: '2026-06-11T13:20:00Z',
    updatedAt: '2026-06-11T13:20:00Z'
  },
  {
    id: 'reg-008',
    kodePerkara: 'EOH',
    registerPerkara: 'PDM-22/MSJ/04/2026',
    suratPenerimaan: 'PRINT-380/L.8.22/Eoh.2/04/2026',
    tanggalPenerimaan: '2026-04-28',
    bulan: '04',
    tahun: '2026',
    penyidikAsal: 'Polsek Mesuji Timur',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.'
    ],
    namaTersangka: 'EDI SUSANTO bin DARMO',
    pasal: 'UU No. 18 Tahun 2013 tentang Pencegahan dan Pemberantasan Perusakan Hutan Pasal 83 ayat (1)',
    registerBarangBukti: 'RB-21/MSJ/04/2026',
    barangBuktiList: [
      {
        id: 'bb-015',
        namaBarang: 'Mobil Truk Mitsubishi Colt Diesel Canter HD125',
        jenisBarang: 'KENDARAAN',
        spesifikasi: 'Warna Kuning Bak Kayu Coklat, Nopol:BE 8921 LN, Noka:MHMFE74P59K019283, Nosin:4D34-TN89218',
        kondisi: 'BAIK',
        nominalPnbp: 115000000,
        lokasiPenyimpanan: 'Gudang Terbuka',
        statusPemulihanAset: 'DIRAMPAS_LELANG',
        keterangan: 'Kendaraan pengangkut hasil hutan tanpa dokumen sah'
      },
      {
        id: 'bb-016',
        namaBarang: 'Kayu Olahan Balok Kaleng Sonokeling',
        jenisBarang: 'LAINNYA',
        spesifikasi: 'Kayu olahan jenis Sonokeling sebanyak 78 batang dengan volume total 4,55 m³',
        kondisi: 'BAIK',
        nominalPnbp: 38500000,
        lokasiPenyimpanan: 'Gudang Terbuka',
        statusPemulihanAset: 'DIRAMPAS_LELANG',
        keterangan: 'Kayu sitaan perambahan kawasan hutan register'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIRAMPAS_LELANG',
    nilaiPemulihanRealisasi: 153500000,
    nomorKwitansiPNBP: 'NTPN-7739102948291028 / BRI-MSJ',
    amarPutusan: 'Putusan PN Menggala No. 62/Pid.B/LH/2026/PN Mgl: Menyatakan 1 unit truk dan kayu olahan dirampas untuk negara untuk dilelang dan hasilnya disetor ke kas negara.',
    tanggalPutusan: '2026-07-08',
    catatanPetugas: 'Telah didaftarkan penilaian nilai wajar ke KPKNL Metro untuk penetapan jadwal lelang.',
    createdAt: '2026-04-28T11:45:00Z',
    updatedAt: '2026-07-12T10:00:00Z'
  },
  {
    id: 'reg-009',
    kodePerkara: 'EKU',
    registerPerkara: 'PDM-12/MSJ/03/2026',
    suratPenerimaan: 'PRINT-172/L.8.22/Eku.2/03/2026',
    tanggalPenerimaan: '2026-03-02',
    bulan: '03',
    tahun: '2026',
    penyidikAsal: 'Polsek Way Serdang',
    jaksaPU: [
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'YANTO SUPRAPTO bin MARTO (Bandar Judi)',
    pasal: 'KUHP Pasal 303 ayat (1) ke-2 (Perjudian)',
    registerBarangBukti: 'RB-07/MSJ/03/2026',
    barangBuktiList: [
      {
        id: 'bb-017',
        namaBarang: 'Uang Tunai Taruhan Perjudian',
        jenisBarang: 'UANG_PERHIASAN',
        spesifikasi: 'Uang pecahan rupiah berbagai nominal total Rp 3.450.000,- tersimpan dalam amplop sitaan',
        kondisi: 'BAIK',
        nominalPnbp: 3450000,
        lokasiPenyimpanan: 'Rekening Penampungan Lainnya (RPL) Kejari Mesuji',
        statusPemulihanAset: 'DISETOR_KAS_NEGARA',
        keterangan: 'Uang barang bukti perjudian domino qiu-qiu'
      },
      {
        id: 'bb-018',
        namaBarang: 'Kartu Domino & Terpal Rekapan',
        jenisBarang: 'LAINNYA',
        spesifikasi: '2 set kartu domino Merk Gardan dan 1 lembar terpal plastik alas judi warna biru',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Peralatan judi dirampas untuk dimusnahkan'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DISETOR_KAS_NEGARA',
    nilaiPemulihanRealisasi: 3450000,
    nomorKwitansiPNBP: 'NTPN-6628190284910283 / POS-MSJ',
    amarPutusan: 'Putusan PN Menggala No. 34/Pid.B/2026/PN Mgl: Uang tunai dirampas untuk negara disetor ke kas negara, alat judi dimusnahkan.',
    tanggalPutusan: '2026-04-22',
    catatanPetugas: 'Uang tunai Rp 3.450.000 telah disetorkan ke Kas Negara via BNI Simponi Kejari Mesuji.',
    createdAt: '2026-03-02T14:10:00Z',
    updatedAt: '2026-04-30T09:15:00Z'
  },
  {
    id: 'reg-010',
    kodePerkara: 'EOH',
    registerPerkara: 'PDM-05/MSJ/01/2026',
    suratPenerimaan: 'PRINT-071/L.8.22/Eoh.2/01/2026',
    tanggalPenerimaan: '2026-01-29',
    bulan: '01',
    tahun: '2026',
    penyidikAsal: 'Polsek Tanjung Raya',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ALVIN DWI NANDA, S.H.'
    ],
    namaTersangka: 'MUHAMMAD RIDWAN bin JAFAR',
    pasal: 'KUHP Pasal 351 ayat (2) (Penganiayaan Berat)',
    registerBarangBukti: 'RB-03/MSJ/01/2026',
    barangBuktiList: [
      {
        id: 'bb-019',
        namaBarang: 'Senjata Tajam Jenis Badik',
        jenisBarang: 'SENPI_SAJAM',
        spesifikasi: 'Bilah besi baja panjang 25 cm dengan hulu/gagang kayu ukir coklat dan sarung kayu terlilit tali',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Barang bukti tindak pidana kekerasan/penganiayaan'
      },
      {
        id: 'bb-020',
        namaBarang: 'Pakaian Korban dengan Bekas Robekan',
        jenisBarang: 'LAINNYA',
        spesifikasi: '1 helai kaos oblong warna abu-abu dengan robekan sepanjang 8 cm pada bagian dada',
        kondisi: 'RUSAK_BERAT',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Pakaian saat kejadian'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIMUSNAHKAN',
    amarPutusan: 'Putusan PN Menggala No. 19/Pid.B/2026/PN Mgl: Menyatakan barang bukti badik dan pakaian dirampas untuk dimusnahkan.',
    tanggalPutusan: '2026-03-30',
    catatanPetugas: 'Tersimpan aman di brankas BB menunggu pemusnahan massal tahunan.',
    createdAt: '2026-01-29T10:00:00Z',
    updatedAt: '2026-04-05T08:30:00Z'
  },
  {
    id: 'reg-011',
    kodePerkara: 'ENZ',
    registerPerkara: 'PDM-38/MSJ/07/2026',
    suratPenerimaan: 'PRINT-592/L.8.22/Enz.2/07/2026',
    tanggalPenerimaan: '2026-07-04',
    bulan: '07',
    tahun: '2026',
    penyidikAsal: 'Sat Resnarkoba Polres Mesuji',
    jaksaPU: [
      'ALVIN DWI NANDA, S.H.'
    ],
    namaTersangka: 'DENI SAPUTRA alias KANCIL bin SUHARDI',
    pasal: 'UU RI No. 35 Tahun 2009 tentang Narkotika Pasal 111 ayat (1) jo Pasal 114 ayat (1)',
    registerBarangBukti: 'RB-35/MSJ/07/2026',
    barangBuktiList: [
      {
        id: 'bb-021',
        namaBarang: 'Paket Narkotika Jenis Ganja Kering',
        jenisBarang: 'NARKOTIKA',
        spesifikasi: '1 paket besar ganja kering seberat netto 850 gram terbungkus kertas koran dan lakban coklat tebal',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Disimpan dalam ruangan bersegel khusus narkotika'
      },
      {
        id: 'bb-022',
        namaBarang: 'Sepeda Motor Honda Beat Street',
        jenisBarang: 'KENDARAAN',
        spesifikasi: 'Warna Hitam Doff, Noka:MH1JM8112KK891283, Nosin:JM81E1892182, Nopol:BE 2981 MS',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Kendaraan yang digunakan kurir pengantar'
      }
    ],
    statusPerkara: 'TAHAP_PENUNTUTAN',
    statusPemulihanAset: 'TAHAP_SITA',
    catatanPetugas: 'Penerimaan Tahap II tanggal 4 Juli 2026, berkas perkara dilimpahkan ke Pengadilan Negeri.',
    createdAt: '2026-07-04T09:15:00Z',
    updatedAt: '2026-07-04T09:15:00Z'
  },
  {
    id: 'reg-012',
    kodePerkara: 'PIDSUS',
    registerPerkara: 'PDS-11/MSJ/05/2026',
    suratPenerimaan: 'PRINT-289/L.8.22/Fd.1/05/2026',
    tanggalPenerimaan: '2026-05-15',
    bulan: '05',
    tahun: '2026',
    penyidikAsal: 'Tim Penyidik Pidsus Kejaksaan Negeri Mesuji',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ALVIN DWI NANDA, S.H.',
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'SUPRIYADI bin KARTO (Mantan Bendahara Desa)',
    pasal: 'UU RI No. 31/1999 jo UU No. 20/2001 Pasal 3 jo Pasal 18',
    registerBarangBukti: 'RB-23/MSJ/05/2026',
    barangBuktiList: [
      {
        id: 'bb-023',
        namaBarang: 'Sertifikat Hak Milik (SHM) Tanah Perkebunan',
        jenisBarang: 'DOKUMEN',
        spesifikasi: 'Buku Asli Sertifikat Hak Milik No. 412/Mesuji Timur Luas 15.000 m² an. Terpidana Supriyadi',
        kondisi: 'BAIK',
        nominalPnbp: 180000000,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIRAMPAS_LELANG',
        keterangan: 'Sitaan aset tanah untuk pembayaran uang pengganti kerugian negara'
      },
      {
        id: 'bb-024',
        namaBarang: 'Uang Tunai Sitaan Rekening Kas Desa',
        jenisBarang: 'UANG_PERHIASAN',
        spesifikasi: 'Uang tunai Rp 85.000.000,- tersimpan pada rekening RPL Bank Mandiri Cabang Mesuji',
        kondisi: 'BAIK',
        nominalPnbp: 85000000,
        lokasiPenyimpanan: 'Rekening Penampungan Lainnya (RPL) Kejari Mesuji',
        statusPemulihanAset: 'DISETOR_KAS_NEGARA',
        keterangan: 'Uang pengganti yang telah disetorkan tunai saat penyidikan'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DISETOR_KAS_NEGARA',
    nilaiPemulihanRealisasi: 265000000,
    nomorKwitansiPNBP: 'NTPN-5549102948192049 / BNI-MSJ',
    amarPutusan: 'Putusan Pengadilan Tipikor Tanjungkarang No. 18/Pid.Sus-TPK/2026: Tanah SHM No. 412 dan uang tunai dirampas untuk negara cq Kejaksaan Negeri Mesuji untuk disetorkan ke Kas Negara.',
    tanggalPutusan: '2026-07-28',
    catatanPetugas: 'Tanah telah dilakukan penilaian oleh DJKN Lampung dan uang tunai telah disetor langsung ke Kas Negara PNBP.',
    createdAt: '2026-05-15T10:30:00Z',
    updatedAt: '2026-08-02T14:00:00Z'
  },
  {
    id: 'reg-013',
    kodePerkara: 'EOH',
    registerPerkara: 'PDM-28/MSJ/05/2026',
    suratPenerimaan: 'PRINT-460/L.8.22/Eoh.2/05/2026',
    tanggalPenerimaan: '2026-05-27',
    bulan: '05',
    tahun: '2026',
    penyidikAsal: 'Sat Reskrim Polres Mesuji',
    jaksaPU: [
      'REGHA PRAWIRA UTAMA, S.H.',
      'ALVIN DWI NANDA, S.H.'
    ],
    namaTersangka: 'ARIS MUNANDAR alias ANGGA bin SLAMET',
    pasal: 'KUHP Pasal 363 ayat (1) ke-3 dan ke-5 (Pencurian Peralatan Sekolah)',
    registerBarangBukti: 'RB-26/MSJ/05/2026',
    barangBuktiList: [
      {
        id: 'bb-025',
        namaBarang: 'Laptop Lenovo ThinkPad L14 Gen 2',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Warna Hitam, No Seri:PF-2K90182, Layar 14 Inci, Charger Asli Lenovo, Tas Laptop Hitam',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIKEMBALIKAN',
        keterangan: 'Inventaris milik SMP Negeri 1 Mesuji Timur'
      },
      {
        id: 'bb-026',
        namaBarang: 'Smartphone Samsung Galaxy A54 5G',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Warna Awesome Violet, IMEI:358291048291048, Kondisi normal fungsi',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIKEMBALIKAN',
        keterangan: 'Milik korban guru sekolah Sdr. NURSALIM, S.Pd.'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIKEMBALIKAN',
    amarPutusan: 'Putusan PN Menggala No. 71/Pid.B/2026/PN Mgl: Memerintahkan barang bukti laptop dikembalikan kepada SMPN 1 Mesuji Timur dan handphone dikembalikan kepada saksi korban.',
    tanggalPutusan: '2026-07-15',
    catatanPetugas: 'Telah diserahkan langsung oleh Jaksa dan Seksi PAPBB melalui program Si-Gentar dengan BA-17.',
    createdAt: '2026-05-27T08:30:00Z',
    updatedAt: '2026-07-20T11:00:00Z'
  },
  {
    id: 'reg-014',
    kodePerkara: 'EKU',
    registerPerkara: 'PDM-16/MSJ/03/2026',
    suratPenerimaan: 'PRINT-240/L.8.22/Eku.2/03/2026',
    tanggalPenerimaan: '2026-03-19',
    bulan: '03',
    tahun: '2026',
    penyidikAsal: 'Polsek Simpang Pematang',
    jaksaPU: [
      'ANA ALSAN MUHAMMAD, S.H.'
    ],
    namaTersangka: 'BAMBANG IRAWAN bin JUMADI',
    pasal: 'KUHP Pasal 406 ayat (1) (Pengerusakan Lahan & Fasilitas)',
    registerBarangBukti: 'RB-14/MSJ/03/2026',
    barangBuktiList: [
      {
        id: 'bb-027',
        namaBarang: 'Mesin Gergaji Chainsaw STIHL MS 381',
        jenisBarang: 'ELEKTRONIK',
        spesifikasi: 'Warna Oranye Putih, Panjang Bar 25 Inci, No Seri Mesin:1119-020-0201',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Gudang BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Alat yang digunakan untuk merusak pagar dan tanaman sawit'
      },
      {
        id: 'bb-028',
        namaBarang: 'Parang Babat Panjang 60 cm',
        jenisBarang: 'SENPI_SAJAM',
        spesifikasi: '2 bilah parang babat besi baja gagang kayu dengan sarung kayu berikat tali karet',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'DIMUSNAHKAN',
        keterangan: 'Senjata tajam pembersih semak dan pengerusakan'
      }
    ],
    statusPerkara: 'INKRACHT',
    statusPemulihanAset: 'DIMUSNAHKAN',
    amarPutusan: 'Putusan PN Menggala No. 49/Pid.B/2026/PN Mgl: Menyatakan barang bukti 1 unit mesin chainsaw dan 2 bilah parang dirampas untuk dimusnahkan.',
    tanggalPutusan: '2026-05-22',
    catatanPetugas: 'Barang bukti tersimpan aman di gudang BB.',
    createdAt: '2026-03-19T11:00:00Z',
    updatedAt: '2026-05-29T10:00:00Z'
  },
  {
    id: 'reg-015',
    kodePerkara: 'ENZ',
    registerPerkara: 'PDM-42/MSJ/08/2026',
    suratPenerimaan: 'PRINT-680/L.8.22/Enz.2/08/2026',
    tanggalPenerimaan: '2026-08-05',
    bulan: '08',
    tahun: '2026',
    penyidikAsal: 'Sat Resnarkoba Polres Mesuji',
    jaksaPU: [
      'ALVIN DWI NANDA, S.H.',
      'REGHA PRAWIRA UTAMA, S.H.'
    ],
    namaTersangka: 'CANDRA KUSUMA bin HASAN',
    pasal: 'UU RI No. 35 Tahun 2009 tentang Narkotika Pasal 114 ayat (1) subs Pasal 112 ayat (1)',
    registerBarangBukti: 'RB-39/MSJ/08/2026',
    barangBuktiList: [
      {
        id: 'bb-029',
        namaBarang: 'Sabu Paket Klip Siap Edar',
        jenisBarang: 'NARKOTIKA',
        spesifikasi: '12 bungkus plastik klip bening ukuran kecil berisi kristal sabu dengan berat total netto 5.40 gram',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Disita saat penggerebekan di Desa Brabasan'
      },
      {
        id: 'bb-030',
        namaBarang: 'Alat Hisap Sabu (Bong Kaca) & Pirek',
        jenisBarang: 'LAINNYA',
        spesifikasi: '1 buah botol kaca modifikasi bong dengan 2 sedotan plastik putih dan 1 pipa kaca pirek kaca',
        kondisi: 'BAIK',
        nominalPnbp: 0,
        lokasiPenyimpanan: 'Box dalam Brankas BB',
        statusPemulihanAset: 'TAHAP_SITA',
        keterangan: 'Alat hisap sabu'
      }
    ],
    statusPerkara: 'PERSIDANGAN',
    statusPemulihanAset: 'TAHAP_SITA',
    catatanPetugas: 'Sidang perdana pembacaan surat dakwaan di PN Menggala.',
    createdAt: '2026-08-05T09:40:00Z',
    updatedAt: '2026-08-05T09:40:00Z'
  }
];

export const STATUS_PEMULIHAN_ASET_OPTIONS = [
  { value: 'TAHAP_SITA', label: 'Tahap Sita' },
  { value: 'DIRAMPAS_LELANG', label: 'Dirampas untuk Negara (Lelang)' },
  { value: 'DIKEMBALIKAN', label: 'Dikembalikan' },
  { value: 'DIMUSNAHKAN', label: 'Dimusnahkan' },
  { value: 'DISETOR_KAS_NEGARA', label: 'Disetor ke Kas Negara' },
] as const;

export const LOKASI_PENYIMPANAN_OPTIONS = [
  'Gudang BB',
  'Box dalam Brankas BB',
  'Gudang Terbuka',
  'Rekening Penampungan Lainnya (RPL) Kejari Mesuji'
];

export const KODE_PERKARA_OPTIONS = [
  { kode: 'EOH', label: 'EOH (Orang dan Harta Benda / Oharda)' },
  { kode: 'ENZ', label: 'ENZ (Narkotika dan Zat Adiktif Lainnya)' },
  { kode: 'EKU', label: 'EKU (Keamanan Negara, Ketertiban Umum, dan Tindak Pidana Umum Lainnya / Kamnegtibum & TPUL)' },
  { kode: 'PIDSUS', label: 'PIDSUS' },
  { kode: 'Lainnya', label: 'Lainnya' }
];
