import React from 'react';

interface KejaksaanLogoProps {
  className?: string;
  size?: number;
}

export const KejaksaanLogo: React.FC<KejaksaanLogoProps> = ({ 
  className = "w-12 h-12", 
  size 
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className} 
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lambang Resmi Kejaksaan Republik Indonesia"
    >
      <defs>
        {/* Gradien Emas Halus untuk Lipatan Ujung Pita */}
        <linearGradient id="ribbonTailGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#ffd400" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>

        {/* Gradien Kuning Terang Khas Lambang Kejaksaan */}
        <linearGradient id="kejaksaanGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff566" />
          <stop offset="45%" stopColor="#ffd400" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* ================================================================ */}
      {/* 1. TIGA BINTANG BERSUDUT TIGA (TRI KRAMA ADHYAKSA) DI ATAS       */}
      {/* ================================================================ */}
      <g id="triBintang" fill="#fed402" stroke="#18181b" strokeWidth="2.8" strokeLinejoin="round">
        {/* Bintang Kiri */}
        <g transform="translate(160, 100)">
          <path d="M 0,-28 C 3,-9 9,-3 23,15 C 4,11 -4,11 -23,15 C -9,-3 -3,-9 0,-28 Z" />
          {/* Garis Rusuk Sudut Bintang */}
          <line x1="0" y1="0" x2="0" y2="-28" strokeWidth="2.2" />
          <line x1="0" y1="0" x2="23" y2="15" strokeWidth="2.2" />
          <line x1="0" y1="0" x2="-23" y2="15" strokeWidth="2.2" />
        </g>

        {/* Bintang Tengah */}
        <g transform="translate(250, 100)">
          <path d="M 0,-28 C 3,-9 9,-3 23,15 C 4,11 -4,11 -23,15 C -9,-3 -3,-9 0,-28 Z" />
          {/* Garis Rusuk Sudut Bintang */}
          <line x1="0" y1="0" x2="0" y2="-28" strokeWidth="2.2" />
          <line x1="0" y1="0" x2="23" y2="15" strokeWidth="2.2" />
          <line x1="0" y1="0" x2="-23" y2="15" strokeWidth="2.2" />
        </g>

        {/* Bintang Kanan */}
        <g transform="translate(340, 100)">
          <path d="M 0,-28 C 3,-9 9,-3 23,15 C 4,11 -4,11 -23,15 C -9,-3 -3,-9 0,-28 Z" />
          {/* Garis Rusuk Sudut Bintang */}
          <line x1="0" y1="0" x2="0" y2="-28" strokeWidth="2.2" />
          <line x1="0" y1="0" x2="23" y2="15" strokeWidth="2.2" />
          <line x1="0" y1="0" x2="-23" y2="15" strokeWidth="2.2" />
        </g>
      </g>

      {/* ================================================================ */}
      {/* 2. PEDANG KEADILAN (TEGAK DI TENGAH)                             */}
      {/* ================================================================ */}
      <g id="pedangKeadilan" stroke="#18181b" strokeLinejoin="round">
        {/* Bilah Pedang (Blade) */}
        <path 
          d="M 250,142 L 257,156 L 257,278 L 243,278 L 243,156 Z" 
          fill="#fed402" 
          strokeWidth="3.2" 
        />
        {/* Garis Tulang Tengah Bilah Pedang */}
        <line x1="250" y1="142" x2="250" y2="278" stroke="#18181b" strokeWidth="2.4" />

        {/* Penahan Tangan Gagang Pedang (Crossguard) */}
        <path 
          d="M 228,278 C 228,272 272,272 272,278 C 272,288 260,290 250,290 C 240,290 228,288 228,278 Z" 
          fill="#fed402" 
          strokeWidth="3.2" 
        />

        {/* Gagang Pedang Beruas-ruas (Grip Rings) */}
        <g fill="#fed402" strokeWidth="2.8">
          <rect x="239" y="290" width="22" height="6.5" rx="2" />
          <rect x="239" y="299" width="22" height="6.5" rx="2" />
          <rect x="239" y="308" width="22" height="6.5" rx="2" />
          <rect x="239" y="317" width="22" height="6.5" rx="2" />
          <rect x="239" y="326" width="22" height="6.5" rx="2" />
        </g>

        {/* Ujung Bawah Gagang Pedang (Pommel) */}
        <path 
          d="M 243,334 L 257,334 L 253,348 L 247,348 Z" 
          fill="#fed402" 
          strokeWidth="3" 
        />
        <circle cx="250" cy="344" r="2.5" fill="#18181b" />
      </g>

      {/* ================================================================ */}
      {/* 3. TIMBANGAN KEADILAN (NERACA KESEIMBANGAN)                      */}
      {/* ================================================================ */}
      <g id="timbanganKeadilan" stroke="#18181b" strokeLinejoin="round">
        {/* Kerangka Tiang Segitiga Penyangga Atas */}
        <path d="M 250,188 L 192,200 M 250,188 L 308,200" fill="none" strokeWidth="2.6" />

        {/* Palang Mendatar Timbangan (Warna Putih) */}
        <rect x="192" y="196" width="116" height="6" fill="#ffffff" strokeWidth="3.2" />

        {/* Tali Penggantung Kiri */}
        <line x1="210" y1="202" x2="182" y2="255" strokeWidth="2.8" />
        <line x1="210" y1="202" x2="238" y2="255" strokeWidth="2.8" />
        {/* Mangkuk / Piring Timbangan Kiri (Kuning) */}
        <polygon points="182,255 238,255 228,270 192,270" fill="#fed402" strokeWidth="3.2" />

        {/* Tali Penggantung Kanan */}
        <line x1="290" y1="202" x2="262" y2="255" strokeWidth="2.8" />
        <line x1="290" y1="202" x2="318" y2="255" strokeWidth="2.8" />
        {/* Mangkuk / Piring Timbangan Kanan (Kuning) */}
        <polygon points="262,255 318,255 308,270 272,270" fill="#fed402" strokeWidth="3.2" />
      </g>

      {/* ================================================================ */}
      {/* 4. UNTAIAN PADI (SEBELAH KIRI)                                   */}
      {/* ================================================================ */}
      <g id="untaianPadi" fill="#fed402" stroke="#18181b" strokeWidth="2.8" strokeLinejoin="round">
        {/* Tangkai Utama Padi */}
        <path d="M 235,365 C 170,360 120,280 145,180 C 160,150 200,135 240,140" fill="none" strokeWidth="3.5" />
        
        {/* Butir-butir Padi Kuning Emas (Sisi Luar & Dalam) */}
        <path d="M 220,355 C 205,355 195,340 210,335 C 220,340 225,350 220,355 Z" />
        <path d="M 195,340 C 180,335 175,320 190,315 C 200,320 205,330 195,340 Z" />
        <path d="M 175,320 C 160,310 158,295 172,290 C 182,295 185,308 175,320 Z" />
        <path d="M 160,295 C 145,285 145,270 158,265 C 168,270 170,282 160,295 Z" />
        <path d="M 150,270 C 135,260 138,245 150,240 C 160,245 160,258 150,270 Z" />
        <path d="M 145,245 C 130,235 135,220 148,215 C 158,220 156,233 145,245 Z" />
        <path d="M 145,220 C 132,210 140,195 152,190 C 160,195 158,208 145,220 Z" />
        <path d="M 150,195 C 140,185 150,170 162,168 C 170,172 165,185 150,195 Z" />
        <path d="M 162,175 C 155,165 168,152 180,152 C 185,158 178,170 162,175 Z" />
        <path d="M 180,158 C 175,148 190,140 202,142 C 205,148 195,158 180,158 Z" />
        <path d="M 200,146 C 200,138 218,136 226,140 C 226,146 215,152 200,146 Z" />
        <path d="M 220,142 C 225,135 240,136 244,142 C 242,148 232,150 220,142 Z" />

        {/* Butir Padi Lapisan Dalam */}
        <path d="M 205,330 C 195,325 192,312 202,308 C 210,312 212,322 205,330 Z" />
        <path d="M 188,305 C 178,300 178,288 188,282 C 195,288 195,298 188,305 Z" />
        <path d="M 175,280 C 165,275 168,262 178,258 C 185,262 184,272 175,280 Z" />
        <path d="M 168,255 C 158,250 162,238 172,235 C 178,240 176,248 168,255 Z" />
        <path d="M 166,230 C 158,225 165,212 175,210 C 180,215 176,224 166,230 Z" />
        <path d="M 172,205 C 166,198 175,188 184,188 C 188,192 182,200 172,205 Z" />
      </g>

      {/* ================================================================ */}
      {/* 5. UNTAIAN KAPAS (SEBELAH KANAN)                                 */}
      {/* ================================================================ */}
      <g id="untaianKapas" stroke="#18181b" strokeWidth="2.8" strokeLinejoin="round">
        {/* Tangkai Kapas Hijau */}
        <path d="M 265,365 C 330,360 380,280 355,180 C 340,150 300,135 260,140" fill="none" stroke="#009e49" strokeWidth="3.5" />

        {/* 8 Kuntum Bunga Kapas (Kelopak Hijau + Bunga Putih) */}
        {/* 1. Bawah */}
        <path d="M 275,348 C 285,340 295,355 285,362 Z" fill="#009e49" />
        <circle cx="295" cy="345" r="10" fill="#ffffff" />

        {/* 2 */}
        <path d="M 298,328 C 310,320 320,335 310,342 Z" fill="#009e49" />
        <circle cx="318" cy="325" r="10.5" fill="#ffffff" />

        {/* 3 */}
        <path d="M 318,300 C 330,290 340,305 330,314 Z" fill="#009e49" />
        <circle cx="338" cy="298" r="11" fill="#ffffff" />

        {/* 4 */}
        <path d="M 332,270 C 346,260 354,275 344,284 Z" fill="#009e49" />
        <circle cx="350" cy="268" r="11" fill="#ffffff" />

        {/* 5 */}
        <path d="M 338,238 C 352,228 360,242 348,252 Z" fill="#009e49" />
        <circle cx="353" cy="236" r="11" fill="#ffffff" />

        {/* 6 */}
        <path d="M 334,206 C 348,196 352,210 342,220 Z" fill="#009e49" />
        <circle cx="346" cy="204" r="10.5" fill="#ffffff" />

        {/* 7 */}
        <path d="M 322,176 C 334,168 338,180 328,190 Z" fill="#009e49" />
        <circle cx="332" cy="174" r="10" fill="#ffffff" />

        {/* 8. Atas */}
        <path d="M 302,154 C 314,148 316,160 306,168 Z" fill="#009e49" />
        <circle cx="310" cy="152" r="9.5" fill="#ffffff" />

        {/* Pucuk Kapas */}
        <path d="M 276,140 C 288,136 295,146 286,152 Z" fill="#009e49" />
        <circle cx="282" cy="140" r="8.5" fill="#ffffff" />
      </g>

      {/* ================================================================ */}
      {/* 6. PERSILANGAN TANGKAI BAWAH                                     */}
      {/* ================================================================ */}
      <g id="silangTangkai" stroke="#18181b" strokeLinejoin="round">
        <path d="M 230,358 C 240,375 255,375 270,358" fill="none" stroke="#009e49" strokeWidth="4.5" />
        <path d="M 225,350 C 240,368 250,368 265,350" fill="none" stroke="#fed402" strokeWidth="4.5" />
      </g>

      {/* ================================================================ */}
      {/* 7. PITA SEMBOYAN: "SATYA ADHI WICAKSANA"                         */}
      {/* ================================================================ */}
      <g id="pitaSemboyan" stroke="#18181b" strokeLinejoin="round">
        {/* Lipatan Ujung Kiri Pita (Kuning-Emas dengan Bayangan) */}
        <path 
          d="M 85,325 C 105,325 110,345 105,360 C 95,358 85,348 85,325 Z" 
          fill="url(#ribbonTailGold)" 
          strokeWidth="2.8" 
        />
        
        {/* Lipatan Ujung Kanan Pita (Kuning-Emas dengan Bayangan) */}
        <path 
          d="M 415,325 C 395,325 390,345 395,360 C 405,358 415,348 415,325 Z" 
          fill="url(#ribbonTailGold)" 
          strokeWidth="2.8" 
        />

        {/* Badan Utama Pita Lengkung Hijau */}
        <path
          d="M 98,348 
             C 145,395 355,395 402,348 
             L 388,382 
             C 345,432 155,432 112,382 Z"
          fill="#009e49"
          strokeWidth="3.2"
        />

        {/* Jalur Busur Teks Lengkung Sempurna untuk Motto */}
        <path 
          id="ribbonMottoPathOfficial" 
          d="M 112,380 C 160,424 340,424 388,380" 
          fill="none" 
          stroke="none" 
        />

        {/* Tulisan Semboyan: SATYA ADHI WICAKSANA (Kuning Terang Tebal) */}
        <text 
          fill="#ffdc00" 
          fontSize="22" 
          fontWeight="900" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Arial Black', Impact, sans-serif"
          letterSpacing="2.2"
          stroke="#18181b"
          strokeWidth="0.8"
          paintOrder="stroke fill"
        >
          <textPath href="#ribbonMottoPathOfficial" startOffset="50%" textAnchor="middle">
            SATYA ADHI WICAKSANA
          </textPath>
        </text>
      </g>
    </svg>
  );
};
