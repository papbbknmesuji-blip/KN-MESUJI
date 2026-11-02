# Panduan Integrasi Google Apps Script & Google Sheets
## Sistem Digital Register Barang Bukti & Pemulihan Aset
**Seksi PAPBB Kejaksaan Negeri Mesuji**

Proyek ini telah dilengkapi dengan 3 file utama yang siap langsung digunakan pada **Google Apps Script**:

1. **`setup.gs`** (atau `/apps-script/setup.gs`)
   - Menginisialisasi struktur Google Sheets: `REGISTER_PERKARA`, `BARANG_BUKTI`, `PENGATURAN_SISTEM`, `LOG_AKTIVITAS`.
   - Mengatur format resmi tabel Kejaksaan (warna hijau tua `#14532d`, font tebal, baris beku/freeze row 1).
   - Menyiapkan validasi dropdown otomatis untuk status perkara dan status pemulihan aset.
   - Mengisi data awal percontohan master perkara dan barang bukti.

2. **`Code.gs`** (atau `/apps-script/Code.gs`)
   - Bertindak sebagai Server-side Controller Web App (`doGet`, `doPost`).
   - Melayani rendering halaman antarmuka web `Index.html`.
   - Menyediakan API CRUD (`saveRegister`, `deleteRegister`, `getRegisters`, `getSystemStats`, `verifyPin`).
   - Sinkronisasi dua arah dengan Google Sheets menggunakan `google.script.run`.

3. **`Index.html`** (atau `/apps-script/Index.html`)
   - Halaman Single Page Application (SPA) mandiri yang di-host langsung dari Google Apps Script.
   - Dibangun dengan Tailwind CSS CDN, Font Awesome, QRCode.js (menghasilkan barcode QR asli tanpa dependensi eksternal berat).
   - Dilengkapi fitur:
     - Dashboard Statistik Resmi Kejaksaan Negeri Mesuji.
     - Form Input & Edit Data Register Perkara dan Rincian Barang Bukti.
     - **Cetak Stiker Seluruh BB (1 Stiker Terintegrasi)** lengkap dengan **Status Penanganan Perkara**, **Putusan Pengadilan**, nomor register, dan barcode QR.
     - Kolom spesifikasi/identitas fisik telah disesuaikan agar tidak membebani label.
     - Tab Penelusuran & Pemulihan Aset (PNBP Kas Negara, Lelang, Pemusnahan, Pinjam Pakai).
     - Tab Manajemen Gudang & Lokasi Rak Penyimpanan.

---

## Langkah-Langkah Deploy ke Google Apps Script (5 Menit)

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka browser dan buka [sheets.new](https://sheets.new) di akun Google Anda.
2. Beri nama spreadsheet Anda, misalnya: `DATABASE_REGISTER_PAPBB_KEJARI_MESUJI`.

### Langkah 2: Buka Editor Apps Script
1. Pada menu Google Sheets, klik **Ekstensi (Extensions)** > **Apps Script**.
2. Tab editor Google Apps Script akan terbuka.

### Langkah 3: Tambahkan File-file Proyek
1. **File `Code.gs`**:
   - Klik file bawaan `Code.gs`.
   - Hapus isinya, lalu salin dan tempel seluruh isi dari file `Code.gs`.
2. **File `setup.gs`**:
   - Klik tombol **+** di samping "Files" > pilih **Script**.
   - Beri nama: `setup`.
   - Tempel seluruh isi dari file `setup.gs`.
3. **File `Index.html`**:
   - Klik tombol **+** di samping "Files" > pilih **HTML**.
   - Beri nama: `Index` (tanpa menuliskan .html).
   - Tempel seluruh isi dari file `Index.html` (atau `/apps-script/Index.html`).
4. Klik ikon **Simpan (Save)** (Ctrl+S atau Cmd+S).

### Langkah 4: Inisialisasi Database
1. Di bilah menu atas editor Apps Script, pilih file `setup.gs`.
2. Pada pilihan dropdown fungsi (di sebelah tombol Run/Debug), pilih fungsi **`setupDatabase`**.
3. Klik tombol **Run (Jalankan)**.
4. Google akan meminta izin otorisasi akses pertama kali:
   - Klik **Review permissions** / **Tinjau izin**.
   - Pilih akun Google Anda.
   - Klik **Advanced** (Lanjutan) > Klik **Go to Untitled project (unsafe)**.
   - Klik **Allow** (Izinkan).
5. Periksa spreadsheet Anda: 4 sheet (`REGISTER_PERKARA`, `BARANG_BUKTI`, `PENGATURAN_SISTEM`, `LOG_AKTIVITAS`) telah otomatis dibuat lengkap dengan styling resmi Kejaksaan!

### Langkah 5: Deploy sebagai Aplikasi Web (Web App)
1. Klik tombol biru **Deploy** di pojok kanan atas editor > pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi (Select type) > pilih **Web app (Aplikasi web)**.
3. Konfigurasikan:
   - **Description**: `Sistem Register PAPBB Kejari Mesuji v1.0`
   - **Execute as (Jalankan sebagai)**: **Me (Saya)**
   - **Who has access (Yang memiliki akses)**: **Anyone (Siapa saja)**
4. Klik **Deploy**.
5. Salin tautan **Web app URL** yang muncul.
6. Buka tautan tersebut di browser atau bagikan ke tim petugas PAPBB. Aplikasi Web siap digunakan kapan saja dari mana saja!

---
*(C) Seksi PAPBB Kejaksaan Negeri Mesuji*
