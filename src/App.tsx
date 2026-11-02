import React, { useState, useEffect } from 'react';
import { RegisterPerkara, EvidenceItem } from './types';
import { INITIAL_REGISTERS } from './data/initialData';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { RegisterTable } from './components/RegisterTable';
import { RegisterFormModal } from './components/RegisterFormModal';
import { RegisterPrintModal } from './components/RegisterPrintModal';
import { EvidenceLabelModal } from './components/EvidenceLabelModal';
import { AssetRecoveryView } from './components/AssetRecoveryView';
import { WarehouseView } from './components/WarehouseView';
import { LoginPage } from './components/LoginPage';
import { PasswordModal } from './components/PasswordModal';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'kejaksaan_mesuji_register_bb_v1';
const AUTH_KEY = 'kejaksaan_mesuji_auth_user';

const ensureCelanaRestored = (list: RegisterPerkara[]): RegisterPerkara[] => {
  return list.map((r) => {
    if (r.id === 'reg-001') {
      const hasCelana = (r.barangBuktiList || []).some(
        (bb) => bb.namaBarang.toLowerCase().includes('celana') && bb.namaBarang.toLowerCase().includes('abu-abu')
      );
      if (!hasCelana) {
        const celanaItem: EvidenceItem = {
          id: 'bb-001-f2',
          namaBarang: '1 (satu) buah celana berwarna abu-abu',
          jenisBarang: 'LAINNYA',
          spesifikasi: '1 (satu) buah celana panjang jeans berwarna abu-abu',
          kondisi: 'BAIK',
          nominalPnbp: 0,
          lokasiPenyimpanan: 'Gudang BB Lemari A',
          statusPemulihanAset: 'TAHAP_SITA',
          keterangan: 'Pakaian milik tersangka saat kejadian perkara',
        };
        const updated = [...r.barangBuktiList];
        const jaketIndex = updated.findIndex((bb) => bb.id === 'bb-001-f');
        if (jaketIndex !== -1) {
          updated.splice(jaketIndex + 1, 0, celanaItem);
          return {
            ...r,
            barangBuktiList: updated,
          };
        }
        return {
          ...r,
          barangBuktiList: [...updated, celanaItem],
        };
      }
    }
    return r;
  });
};

export default function App() {
  // Session Authentication State
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_KEY);
    } catch {
      return null;
    }
  });

  const [registers, setRegisters] = useState<RegisterPerkara[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return ensureCelanaRestored(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
    return ensureCelanaRestored(INITIAL_REGISTERS);
  });

  const [activeTab, setActiveTab] = useState<'register' | 'recovery' | 'warehouse'>('register');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRegister, setEditingRegister] = useState<RegisterPerkara | null>(null);
  const [printingRegister, setPrintingRegister] = useState<RegisterPerkara | null>(null);
  const [labelingRegister, setLabelingRegister] = useState<RegisterPerkara | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password authorization modal state
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onSuccess: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onSuccess: () => {},
  });

  const requestAuth = (
    title: string,
    action: () => void,
    description?: string
  ) => {
    setAuthModal({
      isOpen: true,
      title,
      description:
        description ||
        'Verifikasi otorisasi petugas untuk melanjutkan perubahan data.',
      onSuccess: action,
    });
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registers));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [registers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSaveRegister = (newReg: RegisterPerkara) => {
    setRegisters((prev) => {
      const exists = prev.some((r) => r.id === newReg.id);
      if (exists) {
        return prev.map((r) => (r.id === newReg.id ? newReg : r));
      }
      return [newReg, ...prev];
    });
    showToast(`Register Perkara ${newReg.registerBarangBukti} berhasil disimpan.`);
  };

  const handleDeleteRegister = (id: string) => {
    const target = registers.find((r) => r.id === id);
    if (!target) return;

    setRegisters((prev) => prev.filter((r) => r.id !== id));
    showToast(`Register ${target.registerBarangBukti} (${target.namaTersangka}) berhasil dihapus.`);
  };

  const handleLoginSuccess = (user: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_KEY, user);
    } catch (e) {
      console.error(e);
    }
    showToast(`Selamat datang, ${user}! Akses sistem berhasil dibuka.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Anda telah keluar dari sistem.');
  };

  // If not logged in, show dedicated Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewModal={() => {
          requestAuth(
            'Input Register Baru',
            () => {
              setEditingRegister(null);
              setIsFormOpen(true);
            },
            'Verifikasi otorisasi untuk menambahkan data register barang bukti baru.'
          );
        }}
        totalRecords={registers.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Top Highlight Banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-sm border border-emerald-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Buku Register Digital Seksi PAPBB Kejaksaan Negeri Mesuji
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Penerimaan Tahap II, Penomoran Register RB, Penelusuran Aset &amp; Pengelolaan Barang Bukti
              </p>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <StatsOverview registers={registers} />

        {/* View Routing based on Active Tab */}
        {activeTab === 'register' && (
          <RegisterTable
            registers={registers}
            onOpenPrint={(reg) => setPrintingRegister(reg)}
            onOpenLabel={(reg) => setLabelingRegister(reg)}
            onOpenEdit={(reg) => {
              requestAuth(
                `Edit Data Register (${reg.registerBarangBukti})`,
                () => {
                  setEditingRegister(reg);
                  setIsFormOpen(true);
                },
                `Verifikasi otorisasi untuk mengubah data perkara Tersangka ${reg.namaTersangka} (${reg.registerBarangBukti}).`
              );
            }}
            onDelete={(id) => {
              const target = registers.find((r) => r.id === id);
              const regName = target ? target.registerBarangBukti : 'Register';
              requestAuth(
                `Hapus Data Register (${regName})`,
                () => {
                  handleDeleteRegister(id);
                },
                `Verifikasi otorisasi untuk menghapus data ${regName} dari sistem.`
              );
            }}
          />
        )}

        {activeTab === 'recovery' && (
          <AssetRecoveryView
            registers={registers}
            onUpdateRegister={handleSaveRegister}
            onRequestAuth={requestAuth}
          />
        )}

        {activeTab === 'warehouse' && (
          <WarehouseView
            registers={registers}
            onOpenLabel={(reg) => setLabelingRegister(reg)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-200">
              Sistem Digital Register Barang Bukti
            </p>
            <p className="text-[11px] text-slate-500">
              Kejaksaan Negeri Mesuji &bull; Seksi Pemulihan Aset dan Pengelolaan Barang Bukti (PAPBB)
            </p>
          </div>
          <div className="text-center sm:text-right text-[11px]">
            <p className="text-slate-500">
              Register Perkara Tindak Pidana &bull; Format Buku Register RB &bull; TA 2026
            </p>
            <p className="text-slate-300 font-medium mt-1 tracking-wide">
              &copy; {new Date().getFullYear()} FEBY GIPANTIUS ZAMA, S.E.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RegisterFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRegister(null);
        }}
        onSave={handleSaveRegister}
        initialData={editingRegister}
      />

      <RegisterPrintModal
        isOpen={Boolean(printingRegister)}
        onClose={() => setPrintingRegister(null)}
        register={printingRegister}
      />

      <EvidenceLabelModal
        isOpen={Boolean(labelingRegister)}
        onClose={() => setLabelingRegister(null)}
        register={labelingRegister}
        onUpdateRegister={handleSaveRegister}
      />

      {/* Password Authorization Modal */}
      <PasswordModal
        isOpen={authModal.isOpen}
        onClose={() =>
          setAuthModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        onSuccess={authModal.onSuccess}
        actionTitle={authModal.title}
        actionDescription={authModal.description}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-500 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 max-w-md">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

