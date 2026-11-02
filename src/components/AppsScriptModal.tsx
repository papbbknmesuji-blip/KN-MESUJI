import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Code, 
  FileCode, 
  FileText, 
  BookOpen, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Database
} from 'lucide-react';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({ isOpen, onClose }) => {
  const [activeFileTab, setActiveFileTab] = useState<'codegs' | 'indexhtml' | 'setupgs' | 'guide'>('codegs');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  // Kode File Code.gs
  const codeGsContent = `/**
 * ============================================================================
 * SISTEM DIGITAL REGISTER BARANG BUKTI & PEMULIHAN ASET
 * SEKSI PAPBB KEJAKSAAN NEGERI MESUJI
 * ============================================================================
 * File: Code.gs
 * Fungsi: Server-side Controller Google Apps Script (doGet, doPost, API JSON,
 *         dan fungsi google.script.run untuk integrasi Google Sheets).
 * ============================================================================
 */

const SHEET_REGISTER_NAME = 'REGISTER_PERKARA';
const SHEET_BARANG_BUKTI_NAME = 'BARANG_BUKTI';
const SHEET_PENGATURAN_NAME = 'PENGATURAN_SISTEM';
const SHEET_LOG_NAME = 'LOG_AKTIVITAS';

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    return handleApiGet(e.parameter);
  }

  try {
    const template = HtmlService.createTemplateFromFile('Index');
    return template.evaluate()
      .setTitle('Sistem Digital Register Barang Bukti - Seksi PAPBB Kejaksaan Negeri Mesuji')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setFaviconUrl('https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_Kejaksaan_Republik_Indonesia.png');
  } catch (error) {
    return HtmlService.createHtmlOutput('<h3>Gagal Memuat: ' + error.toString() + '</h3>');
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
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
    return createJsonResponse({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function handleApiGet(params) {
  const action = params.action;
  if (action === 'getRegisters') {
    const registers = getRegisters();
    return createJsonResponse({ status: 'success', count: registers.length, data: registers });
  } else if (action === 'getStats') {
    return createJsonResponse({ status: 'success', data: getSystemStats() });
  }
  return createJsonResponse({ status: 'error', message: 'Unknown action' });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRegisters() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return [];

  const sheetReg = ss.getSheetByName(SHEET_REGISTER_NAME);
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);
  if (!sheetReg || sheetReg.getLastRow() <= 1) return [];

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
      const key = regId || noRb;
      if (!evidenceMap[key]) evidenceMap[key] = [];
      evidenceMap[key].push(item);
    });
  }

  const regValues = sheetReg.getRange(2, 1, sheetReg.getLastRow() - 1, 19).getValues();
  const result = [];

  regValues.forEach(row => {
    const regId = String(row[0] || '').trim();
    if (!regId) return;

    const noRb = String(row[3] || '').trim();
    const items = evidenceMap[regId] || evidenceMap[noRb] || [];
    const rawJaksa = String(row[9] || '');
    const jaksaList = rawJaksa ? rawJaksa.split(';').map(j => j.trim()).filter(Boolean) : ['REGHA PRAWIRA UTAMA, S.H.'];

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
  const regId = data.id || ('reg-' + Utilities.getUuid().substring(0, 8));
  const noRb = (data.registerBarangBukti || '').trim();
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

  deleteEvidenceItemsByRegisterId(sheetBB, regId, noRb);

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

  logActivity(ss, user, foundRowIndex > 0 ? 'UPDATE_REGISTER' : 'TAMBAH_REGISTER', regId, 'No RB: ' + noRb);
  return { success: true, id: regId };
}

function deleteRegister(regId, username) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetReg = ss.getSheetByName(SHEET_REGISTER_NAME);
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI_NAME);

  if (!sheetReg || sheetReg.getLastRow() <= 1) return { success: false };

  const ids = sheetReg.getRange(2, 1, sheetReg.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === String(regId).trim()) {
      const targetRow = i + 2;
      const noRb = sheetReg.getRange(targetRow, 4).getValue();
      sheetReg.deleteRow(targetRow);
      deleteEvidenceItemsByRegisterId(sheetBB, regId, noRb);
      logActivity(ss, username || 'Petugas', 'HAPUS_REGISTER', regId, 'Hapus No RB: ' + noRb);
      return { success: true };
    }
  }
  return { success: false };
}

function deleteEvidenceItemsByRegisterId(sheetBB, regId, noRb) {
  if (!sheetBB || sheetBB.getLastRow() <= 1) return;
  const lastRow = sheetBB.getLastRow();
  const rows = sheetBB.getRange(2, 1, lastRow - 1, 3).getValues();
  for (let i = rows.length - 1; i >= 0; i--) {
    const rowRegId = String(rows[i][1] || '').trim();
    const rowNoRb = String(rows[i][2] || '').trim();
    if (rowRegId === String(regId).trim() || (noRb && rowNoRb === String(noRb).trim())) {
      sheetBB.deleteRow(i + 2);
    }
  }
}

function verifyPin(inputPin) {
  if (!inputPin) return false;
  const pin = String(inputPin).trim();
  return (pin === '123456' || pin === 'papbb2026' || pin === 'kejari2026');
}

function logActivity(ss, user, action, targetId, details) {
  try {
    const sheetLog = ss.getSheetByName(SHEET_LOG_NAME);
    if (sheetLog) sheetLog.appendRow([new Date().toISOString(), user, action, targetId, details]);
  } catch (e) {}
}

function getSystemStats() {
  const registers = getRegisters();
  let totalBB = 0, inkrachtCount = 0, dirampasCount = 0, totalPnbp = 0;
  registers.forEach(reg => {
    if (reg.statusPerkara.indexOf('INKRACHT') !== -1) inkrachtCount++;
    (reg.barangBuktiList || []).forEach(bb => {
      totalBB++;
      if (bb.statusPemulihanAset === 'DIRAMPAS_LELANG' || bb.statusPemulihanAset === 'PROSES_LELANG') dirampasCount++;
      totalPnbp += (Number(bb.nominalPnbp) || 0);
    });
  });
  return { totalPerkara: registers.length, totalBarangBukti: totalBB, inkrachtCount, dirampasLelangCount: dirampasCount, totalPnbpKasNegara: totalPnbp };
}`;

  // Kode File setup.gs
  const setupGsContent = `/**
 * ============================================================================
 * SISTEM DIGITAL REGISTER BARANG BUKTI & PEMULIHAN ASET
 * SEKSI PAPBB KEJAKSAAN NEGERI MESUJI
 * ============================================================================
 * File: setup.gs
 * Fungsi: Inisialisasi Database Google Spreadsheet, Pembuatan Sheet, Kolom,
 *         Validasi Dropdown, Format Resmi, dan Data Awal Master Register.
 * ============================================================================
 */

const SHEET_REGISTER = 'REGISTER_PERKARA';
const SHEET_BARANG_BUKTI = 'BARANG_BUKTI';
const SHEET_PENGATURAN = 'PENGATURAN_SISTEM';
const SHEET_LOG = 'LOG_AKTIVITAS';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚖️ Kejaksaan PAPBB')
    .addItem('🌐 Buka Aplikasi Web Register', 'openWebAppUrl')
    .addSeparator()
    .addItem('⚙️ Inisialisasi / Reset Database', 'setupDatabase')
    .addToUi();
}

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('DATABASE_REGISTER_PAPBB_KEJARI_MESUJI');
  
  setupSheetRegister(ss);
  setupSheetBarangBukti(ss);
  setupSheetPengaturan(ss);
  setupSheetLog(ss);
  seedInitialDataIfEmpty(ss);

  try {
    SpreadsheetApp.getUi().alert(
      'Inisialisasi Berhasil!',
      'Database Sistem Register Barang Bukti Seksi PAPBB Kejaksaan Negeri Mesuji telah berhasil dibuat dan siap digunakan.\\n\\nLangkah berikutnya: Deploy proyek ini sebagai Web App (Executes as: Me, Who has access: Anyone).',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (e) {}
}

function setupSheetRegister(ss) {
  let sheet = ss.getSheetByName(SHEET_REGISTER);
  if (!sheet) sheet = ss.insertSheet(SHEET_REGISTER);

  const headers = [
    'ID_REGISTER', 'KODE_PERKARA', 'NO_REGISTER_PERKARA', 'NO_REGISTER_BB',
    'SURAT_PENERIMAAN', 'TANGGAL_PENERIMAAN', 'BULAN', 'TAHUN',
    'PENYIDIK_ASAL', 'JAKSA_PU', 'NAMA_TERSANGKA', 'PASAL',
    'STATUS_PERKARA', 'STATUS_PEMULIHAN_ASET', 'AMAR_PUTUSAN',
    'TANGGAL_PUTUSAN', 'CATATAN_PETUGAS', 'CREATED_AT', 'UPDATED_AT'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
       .setBackground('#14532d')
       .setFontColor('#ffffff')
       .setFontWeight('bold')
       .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'TAHAP_PENUNTUTAN', 'PERSIDANGAN', 'INKRACHT',
      'INKRACHT_DIKEMBALIKAN', 'INKRACHT_DIRAMPAS_NEGARA',
      'INKRACHT_DIMUSNAHKAN', 'PENITIPAN_RUPBASAN'
    ], true).build();
  sheet.getRange('M2:M1000').setDataValidation(statusRule);

  const widths = [120, 90, 180, 160, 200, 120, 60, 60, 180, 220, 220, 200, 180, 180, 280, 120, 200, 140, 140];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

function setupSheetBarangBukti(ss) {
  let sheet = ss.getSheetByName(SHEET_BARANG_BUKTI);
  if (!sheet) sheet = ss.insertSheet(SHEET_BARANG_BUKTI);

  const headers = [
    'ID_BB', 'REGISTER_ID', 'NO_REGISTER_BB', 'NAMA_BARANG',
    'JENIS_BARANG', 'JUMLAH', 'SATUAN', 'SPESIFIKASI',
    'KONDISI', 'STATUS_PEMULIHAN_ASET', 'LOKASI_PENYIMPANAN',
    'NOMINAL_PNBP', 'KETERANGAN'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
       .setBackground('#0f3b21')
       .setFontColor('#ffffff')
       .setFontWeight('bold')
       .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  sheet.getRange('L2:L3000').setNumberFormat('"Rp"#,##0');
  const widths = [100, 110, 150, 200, 120, 70, 80, 250, 100, 160, 160, 130, 200];
  widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

function setupSheetPengaturan(ss) {
  let sheet = ss.getSheetByName(SHEET_PENGATURAN);
  if (!sheet) sheet = ss.insertSheet(SHEET_PENGATURAN);

  const settings = [
    ['KUNCI_PENGATURAN', 'NILAI', 'KETERANGAN'],
    ['NAMA_APLIKASI', 'Sistem Digital Register Barang Bukti', 'Nama resmi'],
    ['SATUAN_KERJA', 'Kejaksaan Negeri Mesuji', 'Nama satuan kerja'],
    ['SEKSI', 'Seksi Pemulihan Aset dan Pengelolaan Barang Bukti (PAPBB)', 'Unit kerja'],
    ['PIN_PETUGAS_DEFAULT', '123456', 'PIN login petugas'],
    ['PIN_ADMIN', 'papbb2026', 'PIN supervisor']
  ];
  sheet.getRange(1, 1, settings.length, 3).setValues(settings);
  sheet.getRange(1, 1, 1, 3).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
}

function setupSheetLog(ss) {
  let sheet = ss.getSheetByName(SHEET_LOG);
  if (!sheet) sheet = ss.insertSheet(SHEET_LOG);
  const headers = ['TIMESTAMP', 'USER', 'AKSI', 'ID_REGISTER', 'RINCIAN'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setBackground('#334155').setFontColor('#ffffff').setFontWeight('bold');
}

function seedInitialDataIfEmpty(ss) {
  const sheetReg = ss.getSheetByName(SHEET_REGISTER);
  const sheetBB = ss.getSheetByName(SHEET_BARANG_BUKTI);
  if (sheetReg.getLastRow() > 1) return;

  sheetReg.appendRow([
    'reg-001', 'EOH', 'PDM-26/MSJ/05/2026', 'RB-24/MSJ/05/2026',
    'PRINT-443/L.8.22/Eoh.2/05/2026', '2026-05-21', '05', '2026',
    'Sat Reskrim Polres Mesuji', 'REGHA PRAWIRA UTAMA, S.H.; ALVIN DWI NANDA, S.H.',
    'JUNI ROMADHON alias DONI bin SARJITO', 'KUHP TAHUN 2023 Pasal 476',
    'TAHAP_PENUNTUTAN', 'TAHAP_SITA', '', '',
    'Penerimaan Tahap II dari Penyidik Polres Mesuji lengkap.',
    new Date().toISOString(), new Date().toISOString()
  ]);

  sheetBB.appendRow([
    'bb-001', 'reg-001', 'RB-24/MSJ/05/2026', 'Sepeda Motor Honda CB150R',
    'KENDARAAN', 1, 'Unit', 'Warna Merah putih, Nopol:T 5441 YM',
    'BAIK', 'TAHAP_SITA', 'Gudang BB', 0, 'Kunci kontak lengkap'
  ]);
}`;

  // Index.html summary snippet
  const indexHtmlPreviewNotice = `<!-- File: Index.html (Tersimpan di root /Index.html dan /apps-script/Index.html) -->
<!-- Menggunakan Tailwind CSS CDN, Font Awesome, QRCode.js, serta Google Apps Script client engine -->
<!-- File ini siap langsung di-paste ke file Index.html pada Google Apps Script editor -->`;

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => {
      setCopiedTab(null);
    }, 2500);
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 text-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Google Apps Script
                </span>
                <span className="text-xs text-slate-400 font-mono">Kejaksaan Negeri Mesuji</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Paket File Google Apps Script (Code.gs, Index.html, setup.gs)
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFileTab('codegs')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-t-2 ${
              activeFileTab === 'codegs'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Code.gs</span>
          </button>

          <button
            onClick={() => setActiveFileTab('indexhtml')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-t-2 ${
              activeFileTab === 'indexhtml'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Index.html</span>
          </button>

          <button
            onClick={() => setActiveFileTab('setupgs')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-t-2 ${
              activeFileTab === 'setupgs'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>setup.gs</span>
          </button>

          <button
            onClick={() => setActiveFileTab('guide')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-2 border-t-2 ${
              activeFileTab === 'guide'
                ? 'bg-slate-900 text-amber-400 border-amber-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Panduan Deploy 5 Menit</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs space-y-4">
          
          {/* TAB CODE.GS */}
          {activeFileTab === 'codegs' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>File: Code.gs (Server-side Script)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Menangani rendering template Web App, API GET/POST, penyimpanan register, penghapusan, dan query Google Sheets.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(codeGsContent, 'codegs')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    {copiedTab === 'codegs' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTab === 'codegs' ? 'Tersalin ke Clipboard!' : 'Salin Code.gs'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('Code.gs', codeGsContent)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .gs</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300/90 leading-relaxed overflow-x-auto max-h-[420px] whitespace-pre">
                  {codeGsContent}
                </pre>
              </div>
            </div>
          )}

          {/* TAB INDEX.HTML */}
          {activeFileTab === 'indexhtml' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>File: Index.html (Google Apps Script Frontend SPA)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Memuat seluruh UI interaktif Kejaksaan Negeri Mesuji, Cetak Stiker Seluruh BB (Status Perkara, Putusan, dan QR Barcode nyata), serta sync Google Sheets.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/apps-script/Index.html"
                    download="Index.html"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Index.html</span>
                  </a>
                  <a
                    href="/apps-script/Index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold border border-slate-700 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka File Mentah</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>File Index.html Sudah Tersedia Lengkap di Folder Proyek:</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    1. <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">/Index.html</code> (Root direktori)<br/>
                    2. <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">/apps-script/Index.html</code> (Folder Apps Script)
                  </p>
                </div>

                <p className="text-slate-300">
                  Untuk menggunakannya di Google Apps Script:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-400 text-[11px]">
                  <li>Di Google Apps Script editor, klik tombol <strong>+ (Tambah file)</strong> lalu pilih <strong>HTML</strong>.</li>
                  <li>Beri nama file: <strong className="text-white">Index</strong> (Apps Script akan otomatis memberinya ekstensi .html).</li>
                  <li>Buka file <strong className="text-white">Index.html</strong> atau klik tombol <em>Download Index.html</em> di atas, lalu salin seluruh kodenya ke editor Apps Script.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB SETUP.GS */}
          {activeFileTab === 'setupgs' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>File: setup.gs (Inisialisasi Database Google Sheets)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Otomatis membuat sheet REGISTER_PERKARA, BARANG_BUKTI, PENGATURAN_SISTEM, LOG_AKTIVITAS, header hijau Kejaksaan, dan validasi dropdown.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(setupGsContent, 'setupgs')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    {copiedTab === 'setupgs' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTab === 'setupgs' ? 'Tersalin ke Clipboard!' : 'Salin setup.gs'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('setup.gs', setupGsContent)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .gs</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300/90 leading-relaxed overflow-x-auto max-h-[420px] whitespace-pre">
                  {setupGsContent}
                </pre>
              </div>
            </div>
          )}

          {/* TAB GUIDE */}
          {activeFileTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Panduan Langkah demi Langkah Deploy ke Google Apps Script (5 Menit)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Ikuti panduan berikut untuk menjalankan seluruh aplikasi Sistem Register Barang Bukti Seksi PAPBB Kejaksaan Negeri Mesuji di akun Google Workspace / Gmail Anda secara gratis dan permanen:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">1</span>
                    <span>Buat Google Spreadsheet Baru</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Buka Google Drive atau ketik <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">sheets.new</code> di browser. Beri nama file Spreadsheet misalnya: <strong>DATABASE_REGISTER_PAPBB_MESUJI</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">2</span>
                    <span>Buka Editor Apps Script</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Di Google Sheets tersebut, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>. Tab editor skrip baru akan terbuka.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">3</span>
                    <span>Buat 3 File (Code.gs, setup.gs, Index.html)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    - Ganti isi <strong>Code.gs</strong> dengan kode dari tab Code.gs.<br/>
                    - Klik <strong>+ &gt; Script</strong>, beri nama <strong>setup</strong>, lalu tempel kode dari tab setup.gs.<br/>
                    - Klik <strong>+ &gt; HTML</strong>, beri nama <strong>Index</strong>, lalu tempel isi dari file Index.html.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-[10px]">4</span>
                    <span>Jalankan Inisialisasi Database</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Pilih file <strong>setup.gs</strong>, pilih fungsi <strong>setupDatabase</strong> pada dropdown fungsi di bilah atas, lalu klik <strong>Jalankan (Run)</strong>. Setujui izin akses akun Google Anda. Seluruh sheet &amp; format resmi Kejaksaan akan langsung dibuat!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-700/50 rounded-xl space-y-2">
                <div className="font-bold text-emerald-300 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center text-[10px]">5</span>
                  <span>Deploy sebagai Aplikasi Web (Web App)</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>Klik tombol biru <strong>Deploy</strong> (di kanan atas) &gt; pilih <strong>New deployment (Penerapan baru)</strong>.</li>
                  <li>Pilih jenis penerapan: <strong>Web app (Aplikasi web)</strong>.</li>
                  <li>Isi deskripsi: <em>Sistem Register PAPBB Mesuji v1.0</em>.</li>
                  <li><strong>Execute as (Jalankan sebagai)</strong>: Pilih <strong>Me (Saya - email Anda)</strong>.</li>
                  <li><strong>Who has access (Yang memiliki akses)</strong>: Pilih <strong>Anyone (Siapa saja)</strong> agar petugas dapat mengakses aplikasi web secara langsung.</li>
                  <li>Klik <strong>Deploy</strong>, lalu salin URL Web App yang dihasilkan. Selesai! Web app Anda sudah aktif online!</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Tersimpan di root: <code className="text-slate-200">/Code.gs</code>, <code className="text-slate-200">/Index.html</code>, <code className="text-slate-200">/setup.gs</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
