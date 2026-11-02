/**
 * ============================================================================
 * SISTEM DIGITAL REGISTER BARANG BUKTI & PEMULIHAN ASET
 * SEKSI PAPBB KEJAKSAAN NEGERI MESUJI
 * ============================================================================
 * File: Code.gs
 * Fungsi: Server-side Controller Google Apps Script (doGet, doPost, API JSON,
 *         dan fungsi google.script.run untuk integrasi Google Sheets).
 * ============================================================================
 */

// Konstanta Sheet
const SHEET_REGISTER_NAME = 'REGISTER_PERKARA';
const SHEET_BARANG_BUKTI_NAME = 'BARANG_BUKTI';
const SHEET_PENGATURAN_NAME = 'PENGATURAN_SISTEM';
const SHEET_LOG_NAME = 'LOG_AKTIVITAS';

/**
 * Entry Point Utama: Melayani Web App HTML atau API GET
 */
function doGet(e) {
  // Dukungan REST API via Parameter URL
  if (e && e.parameter && e.parameter.action) {
    return handleApiGet(e.parameter);
  }

  // Render Template HTML Web App
  try {
    const template = HtmlService.createTemplateFromFile('Index');
    return template.evaluate()
      .setTitle('Sistem Digital Register Barang Bukti - Seksi PAPBB Kejaksaan Negeri Mesuji')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setFaviconUrl('https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_Kejaksaan_Republik_Indonesia.png');
  } catch (error) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;padding:30px;color:#991b1b;background:#fef2f2;border:1px solid #f87171;border-radius:8px;">' +
      '<h3>Gagal Memuat Aplikasi Web</h3>' +
      '<p>Pastikan file <b>Index.html</b> telah dibuat di Google Apps Script editor.</p>' +
      '<pre>' + error.toString() + '</pre>' +
      '</div>'
    );
  }
}

/**
 * Entry Point POST: Menerima request simpan / hapus data via REST API
 */
function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const payload = JSON.parse(rawData);

    if (payload.action === 'saveRegister') {
      const result = saveRegister(payload.data, payload.user || 'API');
      return createJsonResponse({ status: 'success', data: result });
    } else if (payload.action === 'deleteRegister') {
      const result = deleteRegister(payload.id, payload.user || 'API');
      return createJsonResponse({ status: 'success', data: result });
    } else if (payload.action === 'verifyPin') {
      const isValid = verifyPin(payload.pin);
      return createJsonResponse({ status: 'success', valid: isValid });
    }

    return createJsonResponse({ status: 'error', message: 'Aksi tidak dikenali: ' + payload.action });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Router untuk permintaan API GET
 */
function handleApiGet(params) {
  const action = params.action;
  if (action === 'getRegisters') {
    const registers = getRegisters();
    return createJsonResponse({ status: 'success', count: registers.length, data: registers });
  } else if (action === 'getStats') {
    const stats = getSystemStats();
    return createJsonResponse({ status: 'success', data: stats });
  } else if (action === 'ping') {
    return createJsonResponse({ status: 'ok', serverTime: new Date().toISOString() });
  }
  return createJsonResponse({ status: 'error', message: 'Unknown GET action' });
}

/**
 * Helper untuk format response JSON
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper untuk menyisipkan file HTML parsial jika diperlukan
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ============================================================================
 * FUNGSI DATABASE (DIPANGGIL VIA google.script.run ATAU API)
 * ============================================================================
 */

/**
 * Mengambil semua data Register Perkara beserta Barang Bukti
 * @return {Array<Object>} Daftar RegisterPerkara
 */
function getRegisters() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return [];

  const sheetReg = ss.getSheetByName(SHEET_REGISTER_NAME);
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);

  if (!sheetReg || sheetReg.getLastRow() <= 1) {
    return [];
  }

  // Baca seluruh data barang bukti terlebih dahulu
  const evidenceMap = {};
  if (sheetBB && sheetBB.getLastRow() > 1) {
    const bbValues = sheetBB.getRange(2, 1, sheetBB.getLastRow() - 1, 13).getValues();
    bbValues.forEach(row => {
      const regId = String(row[1] || '').trim();
      const noRb = String(row[2] || '').trim();
      const item = {
        id: String(row[0] || ''),
        namaBarang: String(row[3] || ''),
        jenisBarang: String(row[4] || 'LAINNYA'),
        jumlah: Number(row[5]) || 1,
        satuan: String(row[6] || 'Unit'),
        spesifikasi: String(row[7] || ''),
        kondisi: String(row[8] || 'BAIK'),
        statusPemulihanAset: String(row[9] || 'TAHAP_SITA'),
        lokasiPenyimpanan: String(row[10] || 'Gudang BB'),
        nominalPnbp: Number(row[11]) || 0,
        keterangan: String(row[12] || '')
      };

      // Simpan ke map berdasarkan register ID atau No RB
      const key = regId || noRb;
      if (!evidenceMap[key]) {
        evidenceMap[key] = [];
      }
      evidenceMap[key].push(item);
    });
  }

  // Baca data register perkara
  const regValues = sheetReg.getRange(2, 1, sheetReg.getLastRow() - 1, 19).getValues();
  const result = [];

  regValues.forEach(row => {
    const regId = String(row[0] || '').trim();
    if (!regId) return;

    const noRb = String(row[3] || '').trim();
    const items = evidenceMap[regId] || evidenceMap[noRb] || [];

    // Format Jaksa PU (bisa dipisah titik koma)
    const rawJaksa = String(row[9] || '');
    const jaksaList = rawJaksa ? rawJaksa.split(';').map(j => j.trim()).filter(Boolean) : ['REGHA PRAWIRA UTAMA, S.H.'];

    // Format Tanggal
    let tglPenerimaan = row[5];
    if (tglPenerimaan instanceof Date) {
      tglPenerimaan = Utilities.formatDate(tglPenerimaan, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } else {
      tglPenerimaan = String(tglPenerimaan || '');
    }

    let tglPutusan = row[15];
    if (tglPutusan instanceof Date) {
      tglPutusan = Utilities.formatDate(tglPutusan, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    } else {
      tglPutusan = String(tglPutusan || '');
    }

    result.push({
      id: regId,
      kodePerkara: String(row[1] || 'EOH'),
      registerPerkara: String(row[2] || ''),
      registerBarangBukti: noRb,
      suratPenerimaan: String(row[4] || ''),
      tanggalPenerimaan: tglPenerimaan,
      bulan: String(row[6] || ''),
      tahun: String(row[7] || ''),
      penyidikAsal: String(row[8] || 'Sat Reskrim Polres Mesuji'),
      jaksaPU: jaksaList,
      namaTersangka: String(row[10] || ''),
      pasal: String(row[11] || ''),
      statusPerkara: String(row[12] || 'TAHAP_PENUNTUTAN'),
      statusPemulihanAset: String(row[13] || 'TAHAP_SITA'),
      amarPutusan: String(row[14] || ''),
      tanggalPutusan: tglPutusan,
      catatanPetugas: String(row[16] || ''),
      createdAt: String(row[17] || new Date().toISOString()),
      updatedAt: String(row[18] || new Date().toISOString()),
      barangBuktiList: items
    });
  });

  return result;
}

/**
 * Menyimpan atau memperbarui data Register Perkara & Barang Bukti
 * @param {Object} data Objek RegisterPerkara lengkap
 * @param {string} username Nama user penginput
 * @return {Object} Status keberhasilan
 */
function saveRegister(data, username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Spreadsheet aktif tidak ditemukan.');

  let sheetReg = ss.getSheetByName(SHEET_REGISTER_NAME);
  let sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);

  if (!sheetReg || !sheetBB) {
    setupDatabase();
    sheetReg = ss.getSheetByName(SHEET_REGISTER_NAME);
    sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);
  }

  const user = username || 'Petugas PAPBB';
  const now = new Date().toISOString();

  // Pastikan ID ada
  const regId = data.id || ('reg-' + Utilities.getUuid().substring(0, 8));
  const noRb = (data.registerBarangBukti || '').trim();

  // Siapkan baris register
  const jaksaString = Array.isArray(data.jaksaPU) ? data.jaksaPU.join('; ') : String(data.jaksaPU || '');
  const regRow = [
    regId,
    data.kodePerkara || 'EOH',
    data.registerPerkara || '',
    noRb,
    data.suratPenerimaan || '',
    data.tanggalPenerimaan || '',
    data.bulan || (data.tanggalPenerimaan ? data.tanggalPenerimaan.split('-')[1] : ''),
    data.tahun || (data.tanggalPenerimaan ? data.tanggalPenerimaan.split('-')[0] : ''),
    data.penyidikAsal || '',
    jaksaString,
    data.namaTersangka || '',
    data.pasal || '',
    data.statusPerkara || 'TAHAP_PENUNTUTAN',
    data.statusPemulihanAset || 'TAHAP_SITA',
    data.amarPutusan || '',
    data.tanggalPutusan || '',
    data.catatanPetugas || '',
    data.createdAt || now,
    now
  ];

  // Cek apakah ID sudah ada di sheet (Update atau Insert)
  let foundRowIndex = -1;
  const lastRow = sheetReg.getLastRow();
  if (lastRow > 1) {
    const ids = sheetReg.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === regId) {
        foundRowIndex = i + 2;
        break;
      }
    }
  }

  if (foundRowIndex > 0) {
    sheetReg.getRange(foundRowIndex, 1, 1, regRow.length).setValues([regRow]);
  } else {
    sheetReg.appendRow(regRow);
  }

  // Update Barang Bukti: Hapus item lama milik regId ini lalu masukkan kembali
  deleteEvidenceItemsByRegisterId(sheetBB, regId, noRb);

  // Masukkan item baru
  if (data.barangBuktiList && Array.isArray(data.barangBuktiList) && data.barangBuktiList.length > 0) {
    const bbRows = data.barangBuktiList.map((item, idx) => {
      const itemId = item.id || ('bb-' + Utilities.getUuid().substring(0, 8));
      return [
        itemId,
        regId,
        noRb,
        item.namaBarang || ('Barang Bukti #' + (idx + 1)),
        item.jenisBarang || 'LAINNYA',
        Number(item.jumlah) || 1,
        item.satuan || 'Unit',
        item.spesifikasi || '',
        item.kondisi || 'BAIK',
        item.statusPemulihanAset || data.statusPemulihanAset || 'TAHAP_SITA',
        item.lokasiPenyimpanan || 'Gudang BB',
        Number(item.nominalPnbp) || 0,
        item.keterangan || ''
      ];
    });

    sheetBB.getRange(sheetBB.getLastRow() + 1, 1, bbRows.length, bbRows[0].length).setValues(bbRows);
  }

  // Catat ke Log Aktivitas
  logActivity(ss, user, foundRowIndex > 0 ? 'UPDATE_REGISTER' : 'TAMBAH_REGISTER', regId, 'No RB: ' + noRb + ', Tersangka: ' + data.namaTersangka);

  return { success: true, id: regId, message: 'Data register berhasil disimpan.' };
}

/**
 * Menghapus data Register Perkara dan seluruh barang buktinya
 */
function deleteRegister(regId, username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Spreadsheet tidak ditemukan.');

  const sheetReg = ss.getSheetByName(SHEET_REGISTER_NAME);
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);

  if (!sheetReg || sheetReg.getLastRow() <= 1) return { success: false, message: 'Data kosong.' };

  const ids = sheetReg.getRange(2, 1, sheetReg.getLastRow() - 1, 1).getValues();
  let targetRow = -1;
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === String(regId).trim()) {
      targetRow = i + 2;
      break;
    }
  }

  if (targetRow > 0) {
    const noRb = sheetReg.getRange(targetRow, 4).getValue();
    sheetReg.deleteRow(targetRow);
    
    // Hapus barang bukti
    if (sheetBB) {
      deleteEvidenceItemsByRegisterId(sheetBB, regId, noRb);
    }

    logActivity(ss, username || 'Petugas', 'HAPUS_REGISTER', regId, 'Menghapus register No RB: ' + noRb);
    return { success: true, message: 'Register berhasil dihapus.' };
  }

  return { success: false, message: 'ID register tidak ditemukan.' };
}

/**
 * Helper: Hapus seluruh item barang bukti yang terikat pada suatu register
 */
function deleteEvidenceItemsByRegisterId(sheetBB, regId, noRb) {
  if (!sheetBB || sheetBB.getLastRow() <= 1) return;

  const lastRow = sheetBB.getLastRow();
  const rows = sheetBB.getRange(2, 1, lastRow - 1, 3).getValues();
  
  // Hapus dari bawah ke atas agar indeks baris tidak bergeser
  for (let i = rows.length - 1; i >= 0; i--) {
    const rowRegId = String(rows[i][1] || '').trim();
    const rowNoRb = String(rows[i][2] || '').trim();

    if (rowRegId === String(regId).trim() || (noRb && rowNoRb === String(noRb).trim())) {
      sheetBB.deleteRow(i + 2);
    }
  }
}

/**
 * Memperbarui status pemulihan aset per item
 */
function updateItemRecoveryStatus(itemId, newStatus, nominalPnbp, username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);
  if (!sheetBB || sheetBB.getLastRow() <= 1) return { success: false };

  const ids = sheetBB.getRange(2, 1, sheetBB.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === String(itemId).trim()) {
      const rowIndex = i + 2;
      sheetBB.getRange(rowIndex, 10).setValue(newStatus); // Kolom J: STATUS_PEMULIHAN_ASET
      if (nominalPnbp !== undefined && nominalPnbp !== null) {
        sheetBB.getRange(rowIndex, 12).setValue(Number(nominalPnbp) || 0); // Kolom L: NOMINAL_PNBP
      }
      logActivity(ss, username || 'Petugas', 'UPDATE_STATUS_ASET', itemId, 'Status baru: ' + newStatus);
      return { success: true };
    }
  }
  return { success: false, message: 'Item tidak ditemukan.' };
}

/**
 * Verifikasi PIN Petugas Kejaksaan
 */
function verifyPin(inputPin) {
  if (!inputPin) return false;
  const pin = String(inputPin).trim();

  // PIN bawaan Seksi PAPBB
  if (pin === '123456' || pin === 'papbb2026' || pin === 'kejari2026') {
    return true;
  }

  // Cek jika ada custom PIN di Sheet Pengaturan
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_PENGATURAN_NAME);
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === 'PIN_PETUGAS_DEFAULT' || data[i][0] === 'PIN_ADMIN') {
          if (String(data[i][1]).trim() === pin) {
            return true;
          }
        }
      }
    }
  } catch (e) {
    Logger.log('Gagal membaca PIN dari sheet: ' + e);
  }

  return false;
}

/**
 * Mencatat aktivitas ke sheet LOG_AKTIVITAS
 */
function logActivity(ss, user, action, targetId, details) {
  try {
    const sheetLog = ss.getSheetByName(SHEET_LOG_NAME);
    if (sheetLog) {
      sheetLog.appendRow([new Date().toISOString(), user, action, targetId, details]);
    }
  } catch (e) {
    Logger.log('Gagal mencatat log: ' + e);
  }
}

/**
 * Menghitung ringkasan statistik perkara & pemulihan aset
 */
function getSystemStats() {
  const registers = getRegisters();
  const totalPerkara = registers.length;
  let totalBB = 0;
  let inkrachtCount = 0;
  let dirampasCount = 0;
  let dikembalikanCount = 0;
  let dimusnahkanCount = 0;
  let totalPnbp = 0;

  registers.forEach(reg => {
    if (reg.statusPerkara.indexOf('INKRACHT') !== -1) inkrachtCount++;
    (reg.barangBuktiList || []).forEach(bb => {
      totalBB++;
      const s = bb.statusPemulihanAset || reg.statusPemulihanAset;
      if (s === 'DIRAMPAS_LELANG' || s === 'PROSES_LELANG' || s === 'PROSES_LELANG_KPKNL') dirampasCount++;
      if (s === 'DIKEMBALIKAN') dikembalikanCount++;
      if (s === 'DIMUSNAHKAN') dimusnahkanCount++;
      totalPnbp += (Number(bb.nominalPnbp) || 0);
    });
  });

  return {
    totalPerkara: totalPerkara,
    totalBarangBukti: totalBB,
    inkrachtCount: inkrachtCount,
    dirampasLelangCount: dirampasCount,
    dikembalikanCount: dikembalikanCount,
    dimusnahkanCount: dimusnahkanCount,
    totalPnbpKasNegara: totalPnbp
  };
}
