import React, { useState } from 'react';
import { KejaksaanLogo } from './KejaksaanLogo';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  LogIn, 
  Building2, 
  CheckCircle2 
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      if (cleanUser.toUpperCase() === 'KN MESUJI' && cleanPass === '2026') {
        onLoginSuccess(cleanUser);
      } else {
        setIsLoading(false);
        setError('Username atau kata sandi yang Anda masukkan salah.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-between text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Indicator */}
      <div className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold tracking-wide">
          <ShieldCheck className="w-4 h-4" />
          <span>Sistem Otorisasi Portal Resmi Kejaksaan RI</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
          Wilayah Hukum Kejaksaan Tinggi Lampung
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-900">
          
          {/* Header Card / Kejaksaan Banner */}
          <div className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-7 text-center relative border-b-2 border-amber-500/80">
            <div className="flex justify-center mb-3">
              <div className="p-2.5 bg-white/95 rounded-2xl shadow-lg border border-white/20 inline-flex items-center justify-center">
                <KejaksaanLogo className="w-14 h-14" />
              </div>
            </div>
            
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold tracking-wider uppercase mb-1">
              Kejaksaan Negeri Mesuji
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              Sistem Register Barang Bukti &amp; PNBP
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Seksi Pemulihan Aset &amp; Pengelolaan Barang Bukti (PAPBB)
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h3 className="text-base font-bold text-slate-900">
                Masuk ke Akun Petugas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Silakan masukkan kredensial resmi untuk mengakses sistem
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-relaxed">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Username Petugas <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Masukkan username..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 focus:outline-hidden transition"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi (Password) <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono tracking-wider text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 focus:outline-hidden transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-3">
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Sistem Register</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 text-center text-[11px] text-slate-500">
            <div className="flex items-center justify-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Kantor Kejaksaan Negeri Mesuji — Seksi PAPBB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 border-t border-slate-900/80 bg-slate-950/40">
        &copy; {new Date().getFullYear()} Kejaksaan Negeri Mesuji. Sistem Informasi Register &amp; Pemulihan Aset Barang Bukti.
      </footer>
    </div>
  );
};
