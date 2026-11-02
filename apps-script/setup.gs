/**
 * ============================================================================
 * SISTEM DIGITAL REGISTER BARANG BUKTI & PEMULIHAN ASET
 * SEKSI PAPBB KEJAKSAAN NEGERI MESUJI
 * ============================================================================
 * File: setup.gs
 * Fungsi: Inisialisasi Database Google Spreadsheet, Pembuatan Sheet, Kolom,
 *         Validasi Dropdown, Format Resmi, dan Data Awal Master Register.
 * ============================================================================
 */

// Konstanta Nama Sheet
const SHEET_REGISTER = 'REGISTER_PERKARA';
const SHEET_BARANG_BUKTI = 'BARANG_BUKTI';
const SHEET_PENGATURAN = 'PENGATURAN_SISTEM';
const SHEET_LOG = 'LOG_AKTIVITAS';

/**
 * Menu otomatis saat Google Spreadsheet dibuka
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚖️ Kejaksaan PAPBB')
    .addItem('🌐 Buka Aplikasi Web Register', 'openWebAppUrl')
    .addSeparator()
    .addItem('⚙️ Jalankan / Inisialisasi Ulang Database', 'setupDatabase')
    .addItem('📊 Refresh Rekapitulasi Data', 'refreshSummary')
    .addToUi();
}

/**
 * Fungsi Utama: Menyiapkan seluruh struktur Database di Google Spreadsheet
 * Jalankan fungsi ini sekali saat pertama kali proyek dibuat.
 */
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || createNewSpreadsheet();
  
  Logger.log('Memulai inisialisasi database di Spreadsheet: ' + ss.getName());

  // 1. Siapkan Sheet REGISTER_PERKARA
  setupSheetRegister(ss);

  // 2. Siapkan Sheet BARANG_BUKTI
  setupSheetBarangBukti(ss);

  // 3. Siapkan Sheet PENGATURAN_SISTEM
  setupSheetPengaturan(ss);

  // 4. Siapkan Sheet LOG_AKTIVITAS
  setupSheetLog(ss);

  // 5. Isi sample data awal jika kosong
  seedInitialDataIfEmpty(ss);

  // Tampilkan notifikasi jika dijalankan dari UI Spreadsheet
  try {
    SpreadsheetApp.getUi().alert(
      'Inisialisasi Berhasil!',
      'Database Sistem Register Barang Bukti Seksi PAPBB Kejaksaan Negeri Mesuji telah berhasil dibuat dan siap digunakan.\n\nLangkah berikutnya: Deploy proyek ini sebagai Web App (Executes as: Me, Who has access: Anyone).',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (e) {
    Logger.log('Setup selesai tanpa UI alert (headless execution).');
  }
}

/**
 * Membuat spreadsheet baru jika belum ada file aktif
 */
function createNewSpreadsheet() {
  const newSs = SpreadsheetApp.create('DATABASE_REGISTER_PAPBB_KEJARI_MESUJI');
  Logger.log('Spreadsheet baru dibuat dengan ID: ' + newSs.getId());
  return newSs;
}

/**
 * 1. Menyiapkan Sheet REGISTER_PERKARA
 */
function setupSheetRegister(ss) {
  let sheet = ss.getSheetByName(SHEET_REGISTER);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_REGISTER);
  }

  const headers = [
    'ID_REGISTER',
    'KODE_PERKARA',
    'NO_REGISTER_PERKARA',
    'NO_REGISTER_BB',
    'SURAT_PENERIMAAN',
    'TANGGAL_PENERIMAAN',
    'BULAN',
    'TAHUN',
    'PENYIDIK_ASAL',
    'JAKSA_PU',
    'NAMA_TERSANGKA',
    'PASAL',
    'STATUS_PERKARA',
    'STATUS_PEMULIHAN_ASET',
    'AMAR_PUTUSAN',
    'TANGGAL_PUTUSAN',
    'CATATAN_PETUGAS',
    'CREATED_AT',
    'UPDATED_AT'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format Header: Hijau Kejaksaan Tua (#14532d), Teks Putih Tebal
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#14532d')
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Validasi Dropdown Status Perkara (Kolom M / 13)
  const statusPerkaraRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'TAHAP_PENUNTUTAN',
      'PERSIDANGAN',
      'INKRACHT',
      'INKRACHT_DIKEMBALIKAN',
      'INKRACHT_DIRAMPAS_NEGARA',
      'INKRACHT_DIMUSNAHKAN',
      'PENITIPAN_RUPBASAN'
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('M2:M1000').setDataValidation(statusPerkaraRule);

  // Validasi Dropdown Status Pemulihan Aset (Kolom N / 14)
  const statusPemulihanRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'TAHAP_SITA',
      'DIRAMPAS_LELANG',
      'DIKEMBALIKAN',
      'DIMUSNAHKAN',
      'DISETOR_KAS_NEGARA',
      'PROSES_LELANG_KPKNL',
      'TERJUAL_LELANG',
      'DISETOR_PNBP'
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('N2:N1000').setDataValidation(statusPemulihanRule);

  // Atur lebar kolom agar proporsional
  const widths = [120, 90, 180, 160, 200, 120, 60, 60, 180, 220, 220, 200, 180, 180, 280, 120, 200, 140, 140];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * 2. Menyiapkan Sheet BARANG_BUKTI
 */
function setupSheetBarangBukti(ss) {
  let sheet = ss.getSheetByName(SHEET_BARANG_BUKTI);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_BARANG_BUKTI);
  }

  const headers = [
    'ID_BB',
    'REGISTER_ID',
    'NO_REGISTER_BB',
    'NAMA_BARANG',
    'JENIS_BARANG',
    'JUMLAH',
    'SATUAN',
    'SPESIFIKASI',
    'KONDISI',
    'STATUS_PEMULIHAN_ASET',
    'LOKASI_PENYIMPANAN',
    'NOMINAL_PNBP',
    'KETERANGAN'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0f3b21')
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Validasi Dropdown Jenis Barang (Kolom E / 5)
  const jenisRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'KENDARAAN',
      'DOKUMEN',
      'SENPI_SAJAM',
      'NARKOTIKA',
      'ELEKTRONIK',
      'UANG_PERHIASAN',
      'LAINNYA'
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E2:E3000').setDataValidation(jenisRule);

  // Validasi Dropdown Kondisi Barang (Kolom I / 9)
  const kondisiRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I2:I3000').setDataValidation(kondisiRule);

  // Format Angka Rupiah untuk Kolom L (Nominal PNBP)
  sheet.getRange('L2:L3000').setNumberFormat('"Rp"#,##0');

  const widths = [100, 110, 150, 200, 120, 70, 80, 250, 100, 160, 160, 130, 200];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

/**
 * 3. Menyiapkan Sheet PENGATURAN_SISTEM
 */
function setupSheetPengaturan(ss) {
  let sheet = ss.getSheetByName(SHEET_PENGATURAN);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PENGATURAN);
  }

  const settings = [
    ['KUNCI_PENGATURAN', 'NILAI', 'KETERANGAN'],
    ['NAMA_APLIKASI', 'Sistem Digital Register Barang Bukti', 'Nama resmi aplikasi web'],
    ['SATUAN_KERJA', 'Kejaksaan Negeri Mesuji', 'Nama instansi'],
    ['SEKSI', 'Seksi Pemulihan Aset dan Pengelolaan Barang Bukti (PAPBB)', 'Unit kerja pengelola'],
    ['WILAYAH_HUKUM', 'Kejaksaan Tinggi Lampung', 'Wilayah hukum kejaksaan tinggi'],
    ['PIN_PETUGAS_DEFAULT', '123456', 'PIN akses login petugas PAPBB'],
    ['PIN_ADMIN', 'papbb2026', 'PIN supervisor/admin'],
    ['FORMAT_NO_RB', 'RB-{NO}/MSJ/{BULAN}/{TAHUN}', 'Format penomoran register barang bukti'],
    ['TOTAL_PERKARA', '=COUNTA(REGISTER_PERKARA!A2:A)', 'Formula jumlah register perkara'],
    ['TOTAL_BARANG_BUKTI', '=COUNTA(BARANG_BUKTI!A2:A)', 'Formula total barang bukti fisik'],
    ['TOTAL_PNBP_KAS_NEGARA', '=SUM(BARANG_BUKTI!L2:L)', 'Formula total setoran PNBP']
  ];

  sheet.getRange(1, 1, settings.length, 3).setValues(settings);
  sheet.getRange(1, 1, 1, 3).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 260);
}

/**
 * 4. Menyiapkan Sheet LOG_AKTIVITAS
 */
function setupSheetLog(ss) {
  let sheet = ss.getSheetByName(SHEET_LOG);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_LOG);
  }

  const headers = ['TIMESTAMP', 'USER', 'AKSI', 'ID_REGISTER', 'RINCIAN'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground('#334155').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 350);
}

/**
 * 5. Mengisi data awal master perkara jika sheet masih kosong
 */
function seedInitialDataIfEmpty(ss) {
  const sheetReg = ss.getSheetByName(SHEET_REGISTER);
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI);

  if (sheetReg.getLastRow() > 1) {
    Logger.log('Data sudah ada, melewati pengisian sample.');
    return;
  }

  Logger.log('Mengisi sample data register perkara resmi...');

  // Sample data perkara
  const sampleRegisters = [
    [
      'reg-001',
      'EOH',
      'PDM-26/MSJ/05/2026',
      'RB-24/MSJ/05/2026',
      'PRINT-443/L.8.22/Eoh.2/05/2026',
      '2026-05-21',
      '05',
      '2026',
      'Sat Reskrim Polres Mesuji',
      'REGHA PRAWIRA UTAMA, S.H.; ALVIN DWI NANDA, S.H.',
      'JUNI ROMADHON alias DONI bin SARJITO',
      'KUHP TAHUN 2023 Pasal 476',
      'TAHAP_PENUNTUTAN',
      'TAHAP_SITA',
      '',
      '',
      'Penerimaan Tahap II dari Penyidik Sat Reskrim Polres Mesuji dalam keadaan lengkap.',
      new Date().toISOString(),
      new Date().toISOString()
    ],
    [
      'reg-002',
      'PIDSUS',
      'PDS-08/MSJ/03/2026',
      'RB-12/MSJ/03/2026',
      'PRINT-128/L.8.22/Fd.1/03/2026',
      '2026-03-14',
      '03',
      '2026',
      'Tim Penyidik Pidsus Kejaksaan Negeri Mesuji',
      'REGHA PRAWIRA UTAMA, S.H.; ANA ALSAN MUHAMMAD, S.H.',
      'IRWAN SUGIANTO, S.Sos. (Mantan Kades)',
      'UU Tipikor No. 31/1999 jo UU No. 20/2001 Pasal 2 ayat (1) jo Pasal 18',
      'INKRACHT_DIRAMPAS_NEGARA',
      'DIRAMPAS_LELANG',
      'Putusan PN Tanjungkarang No. 12/Pid.Sus-TPK/2026: Barang bukti 1 unit Mobil Toyota Hilux dan uang sitaan dirampas untuk negara c.q. disetorkan ke Kas Negara sebagai uang pengganti dan PNBP Kejaksaan.',
      '2026-06-10',
      'Telah inkracht dan dieksekusi pemulihan aset negara.',
      new Date().toISOString(),
      new Date().toISOString()
    ]
  ];

  sheetReg.getRange(2, 1, sampleRegisters.length, sampleRegisters[0].length).setValues(sampleRegisters);

  // Sample barang bukti
  const sampleBB = [
    [
      'bb-001',
      'reg-001',
      'RB-24/MSJ/05/2026',
      'Sepeda Motor Honda CB150R',
      'KENDARAAN',
      1,
      'Unit',
      'Warna Merah putih, Noka:MH1KC911XGK040722, Nosin:KC91E1037584, Nopol:T 5441 YM',
      'BAIK',
      'TAHAP_SITA',
      'Gudang BB',
      0,
      'Kunci kontak lengkap, mesin hidup, kondisi terawat'
    ],
    [
      'bb-002',
      'reg-001',
      'RB-24/MSJ/05/2026',
      'STNK Motor Honda CB150R',
      'DOKUMEN',
      1,
      'Lembar',
      'An. JUNI ROMADHON, Nopol: T 5441 YM',
      'BAIK',
      'TAHAP_SITA',
      'Box dalam Brankas BB',
      0,
      'Asli dan masih berlaku'
    ],
    [
      'bb-003',
      'reg-002',
      'RB-12/MSJ/03/2026',
      'Mobil Toyota Hilux Double Cabin 2.4G',
      'KENDARAAN',
      1,
      'Unit',
      'Tahun 2021, Warna Hitam Metalik, Noka:MHFAB3CD4M12389, Nosin:2GD-FTV45678, Nopol:BE 8812 MS',
      'BAIK',
      'DIRAMPAS_LELANG',
      'Gudang BB',
      293500000,
      'Hasil lelang KPKNL Metro, uang telah disetor ke Kas Negara sebagai PNBP Kejaksaan.'
    ]
  ];

  sheetBB.getRange(2, 1, sampleBB.length, sampleBB[0].length).setValues(sampleBB);
  Logger.log('Sample data berhasil diisi.');
}

/**
 * Menampilkan URL Web App
 */
function openWebAppUrl() {
  const url = ScriptApp.getService().getUrl();
  if (url) {
    const html = HtmlService.createHtmlOutput(
      '<p>Aplikasi Web Anda aktif di:</p><p><a href="' + url + '" target="_blank" style="color:#047857;font-weight:bold;font-size:14px;">' + url + '</a></p>'
    ).setWidth(400).setHeight(150);
    SpreadsheetApp.getUi().showModalDialog(html, 'URL Aplikasi Web PAPBB');
  } else {
    SpreadsheetApp.getUi().alert('Aplikasi belum di-deploy. Silakan klik Deploy > New deployment > Web app.');
  }
}

/**
 * Menghitung ulang summary
 */
function refreshSummary() {
  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().toast('Data summary telah diperbarui.', 'Kejaksaan PAPBB', 3);
}
