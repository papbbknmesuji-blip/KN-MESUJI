import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, X, Trash2 } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle?: string;
  actionDescription?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'Akses Input / Edit Data',
  actionDescription = 'Verifikasi otorisasi petugas untuk melanjutkan perubahan data.',
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDeleteAction = actionTitle.toLowerCase().includes('hapus');

  const executeSuccess = () => {
    setError(false);
    onClose();
    onSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '2026') {
      executeSuccess();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`text-white p-5 relative border-b ${
          isDeleteAction
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-rose-800'
            : 'bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 border-emerald-800'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
              isDeleteAction
                ? 'bg-rose-900/60 border-rose-500/40 text-rose-300'
                : 'bg-emerald-700/60 border-emerald-500/40 text-emerald-300'
            }`}>
              {isDeleteAction ? <Trash2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                isDeleteAction ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Otorisasi Petugas Seksi PAPBB</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">
                {isDeleteAction ? 'Konfirmasi Hapus Data' : 'Verifikasi Akses Keamanan'}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className={`border rounded-xl p-3.5 text-xs text-slate-700 ${
            isDeleteAction
              ? 'bg-rose-50/60 border-rose-200 text-rose-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              {isDeleteAction ? (
                <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              ) : (
                <KeyRound className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
              <span>Tindakan: {actionTitle}</span>
            </div>
            <p className="leading-relaxed text-[11px] opacity-90">
              {actionDescription}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Kata Sandi / PIN Akses Petugas <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Masukkan kata sandi..."
                className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl text-sm font-mono tracking-widest text-slate-900 focus:outline-hidden transition ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/30'
                    : isDeleteAction
                    ? 'border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200'
                }`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Kata sandi salah! Akses ditolak. Silakan masukkan password yang valid.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              id="btn-password-cancel"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              id="btn-password-submit"
              type="submit"
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition cursor-pointer ${
                isDeleteAction
                  ? 'bg-rose-700 hover:bg-rose-600 active:bg-rose-800'
                  : 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800'
              }`}
            >
              {isDeleteAction ? (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Sekarang</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Buka Akses</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
