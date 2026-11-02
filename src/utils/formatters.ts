export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getStatusPerkaraBadge(status: string) {
  switch (status) {
    case 'TAHAP_PENUNTUTAN':
      return {
        label: 'Tahap Penuntutan (Tahap II)',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-600',
      };
    case 'PERSIDANGAN':
      return {
        label: 'Proses Persidangan',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-600',
      };
    case 'INKRACHT':
      return {
        label: 'Inkracht',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
      };
    case 'INKRACHT_DIKEMBALIKAN':
      return {
        label: 'Inkracht - Dikembalikan',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
      };
    case 'INKRACHT_DIRAMPAS_NEGARA':
      return {
        label: 'Inkracht - Dirampas Negara',
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        dot: 'bg-purple-600',
      };
    case 'INKRACHT_DIMUSNAHKAN':
      return {
        label: 'Inkracht - Dimusnahkan',
        bg: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-600',
      };
    case 'PENITIPAN_RUPBASAN':
      return {
        label: 'Titip RUPBASAN',
        bg: 'bg-slate-50 text-slate-800 border-slate-200',
        dot: 'bg-slate-600',
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-50 text-gray-800 border-gray-200',
        dot: 'bg-gray-600',
      };
  }
}

export function getStatusPemulihanBadge(status: string) {
  switch (status) {
    case 'TAHAP_SITA':
    case 'BUKAN_RAMPASAN':
    case 'BELUM_PENILAIAN':
      return {
        label: 'Tahap Sita',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    case 'DIRAMPAS_LELANG':
    case 'PROSES_LELANG_KPKNL':
    case 'PROSES_LELANG':
    case 'TERJUAL_LELANG':
      return {
        label: 'Dirampas untuk Negara (Lelang)',
        bg: 'bg-purple-50 text-purple-900 border-purple-200 font-semibold',
      };
    case 'DIKEMBALIKAN':
      return {
        label: 'Dikembalikan',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
      };
    case 'DIMUSNAHKAN':
      return {
        label: 'Dimusnahkan',
        bg: 'bg-rose-50 text-rose-800 border-rose-200 font-medium',
      };
    case 'DISETOR_KAS_NEGARA':
    case 'DISETOR_PNBP':
      return {
        label: 'Disetor ke Kas Negara',
        bg: 'bg-teal-50 text-teal-900 border-teal-300 font-bold',
      };
    case 'TELAH_DINILAI':
      return {
        label: 'Telah Dinilai Wajar',
        bg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      };
    default:
      return {
        label: status ? status.replace(/_/g, ' ') : 'Tahap Sita',
        bg: 'bg-gray-100 text-gray-800 border-gray-300',
      };
  }
}
