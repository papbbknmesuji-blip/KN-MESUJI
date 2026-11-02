import React from 'react';
import { KejaksaanLogo } from './KejaksaanLogo';
import { 
  FileText, 
  PlusCircle, 
  Coins, 
  Warehouse,
  LogOut,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'register' | 'recovery' | 'warehouse';
  setActiveTab: (tab: 'register' | 'recovery' | 'warehouse') => void;
  onOpenNewModal: () => void;
  totalRecords: number;
  currentUser?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewModal,
  totalRecords,
  currentUser = 'KN MESUJI',
  onLogout,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner / Kejaksaan Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex-shrink-0 p-1 bg-white/95 rounded-xl shadow-md border border-slate-200/20 flex items-center justify-center">
              <KejaksaanLogo className="w-11 h-11" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  Kejaksaan Negeri Mesuji
                </span>
                <span className="text-xs text-slate-400 font-mono">Wilayah Hukum Kejati Lampung</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight leading-snug">
                Sistem Digital Register Barang Bukti
              </h1>
              <p className="text-xs text-slate-400">
                Seksi Pemulihan Aset dan Pengelolaan Barang Bukti (Seksi PAPBB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* User Login Indicator */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser}</span>
              </div>
            )}

            <button
              id="btn-input-register-baru"
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Input Register Baru</span>
            </button>

            {onLogout && (
              <button
                id="btn-logout"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 text-xs font-medium border border-rose-800/60 transition cursor-pointer"
                title="Keluar dari sesi login"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 pt-2">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition ${
              activeTab === 'register'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40 rounded-t-md'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Buku Register Barang Bukti (RB)</span>
            <span className="ml-1 px-1.5 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300">
              {totalRecords}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('recovery')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition ${
              activeTab === 'recovery'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40 rounded-t-md'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Modul Pemulihan Aset &amp; Rampasan (PNBP)</span>
          </button>

          <button
            onClick={() => setActiveTab('warehouse')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition ${
              activeTab === 'warehouse'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/40 rounded-t-md'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Gudang &amp; Tempat Penyimpanan BB</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
