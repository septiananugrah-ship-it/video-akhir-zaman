import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from './brand';
import {C, FONT} from './theme';

// Sampul "Gulungan Malam": langit berbintang, pola bintang delapan, lentera cahaya, garis waktu emas.
// Tanpa sosok/wajah dan tanpa tulisan Arab (aturan CLAUDE.md).

const CX = 2030; // pusat gambar
const CY = 600;

/** Bintang delapan {8/2}: dua persegi yang diputar 45°. */
const star8 = (cx: number, cy: number, r: number) => {
  const sq = (rot: number) =>
    [0, 1, 2, 3]
      .map((k) => {
        const a = rot + (k * Math.PI) / 2;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      })
      .join(' ');
  return [sq(Math.PI / 4), sq(0)];
};

/** Bilangan acak tetap (tanpa Math.random agar sampul selalu sama). */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const STARS = Array.from({length: 120}, (_, i) => ({x: 1500 + rnd(i) * 1060, y: 40 + rnd(i + 500) * 1300, r: 1.5 + rnd(i + 900) * 3.5, o: 0.25 + rnd(i + 1300) * 0.7}));

/** Gambar mini 2K untuk YouTube/LMS. */
export const Thumbnail: React.FC = () => {
  const ticks = [
    {x: 1640, col: C.kin},
    {x: 1800, col: C.kin},
    {x: 1960, col: C.kin},
    {x: 2140, col: C.heat},
    {x: 2290, col: C.heat},
  ];
  const TY = 1130; // garis waktu
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 70% at 78% 42%, #1b2a55 0%, ${C.bg} 70%)`, fontFamily: FONT.head}}>
      <svg width={2560} height={1440} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff4cf" stopOpacity={1} />
            <stop offset="35%" stopColor={C.gold} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="tl" gradientUnits="userSpaceOnUse" x1={1560} x2={2420} y1={0} y2={0}>
            <stop offset="0%" stopColor={C.gold} stopOpacity={0} />
            <stop offset="15%" stopColor={C.gold} stopOpacity={0.9} />
            <stop offset="100%" stopColor={C.gold} stopOpacity={1} />
          </linearGradient>
        </defs>
        {/* bintang */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o} />
        ))}
        {/* bulan sabit */}
        <path d="M 2400 170 a 70 70 0 1 0 50 125 a 56 56 0 1 1 -50 -125 Z" fill="#fff1c4" opacity={0.9} />
        {/* pola bintang delapan bertingkat di belakang lentera */}
        {[440, 330].map((r, k) =>
          star8(CX, CY, r).map((pts, j) => (
            <polygon key={`${k}-${j}`} points={pts} fill="none" stroke={C.gold} strokeWidth={k === 0 ? 3 : 4} opacity={k === 0 ? 0.28 : 0.45} />
          )),
        )}
        <circle cx={CX} cy={CY} r={330 * Math.cos(Math.PI / 8)} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.3} />
        {/* bintang delapan kecil di sudut */}
        {[
          [1640, 230, 46],
          [2440, 900, 40],
          [1620, 900, 34],
        ].map(([x, y, r], k) =>
          star8(x, y, r).map((pts, j) => <polygon key={`s${k}-${j}`} points={pts} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.4} />),
        )}
        {/* cahaya lentera */}
        <circle cx={CX} cy={CY + 40} r={300} fill="url(#lamp)" opacity={0.75} />
        {/* rantai */}
        <line x1={CX} y1={CY - 330} x2={CX} y2={CY - 175} stroke={C.gold} strokeWidth={5} opacity={0.85} />
        <circle cx={CX} cy={CY - 168} r={14} fill="none" stroke={C.gold} strokeWidth={5} />
        {/* lentera: tutup, badan kaca, alas */}
        <path d={`M ${CX - 70} ${CY - 100} L ${CX} ${CY - 156} L ${CX + 70} ${CY - 100} Z`} fill={C.gold} />
        <rect x={CX - 90} y={CY - 104} width={180} height={18} rx={6} fill={C.gold} />
        <path
          d={`M ${CX - 80} ${CY - 86} L ${CX + 80} ${CY - 86} L ${CX + 104} ${CY + 60} L ${CX + 80} ${CY + 200} L ${CX - 80} ${CY + 200} L ${CX - 104} ${CY + 60} Z`}
          fill="rgba(255,214,120,0.22)"
          stroke={C.gold}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path d={`M ${CX} ${CY - 86} L ${CX} ${CY + 200} M ${CX - 104} ${CY + 60} L ${CX + 104} ${CY + 60}`} stroke={C.gold} strokeWidth={4} opacity={0.6} />
        {/* nyala api */}
        <ellipse cx={CX} cy={CY + 70} rx={60} ry={80} fill={C.gold} opacity={0.35} />
        <path d={`M ${CX} ${CY - 10} C ${CX + 34} ${CY + 40} ${CX + 30} ${CY + 110} ${CX} ${CY + 118} C ${CX - 30} ${CY + 110} ${CX - 34} ${CY + 40} ${CX} ${CY - 10} Z`} fill="#fff4cf" />
        <rect x={CX - 96} y={CY + 200} width={192} height={22} rx={8} fill={C.gold} />
        <path d={`M ${CX - 40} ${CY + 222} L ${CX + 40} ${CY + 222} L ${CX} ${CY + 262} Z`} fill={C.gold} />
        {/* garis waktu emas: tanda kecil (jingga) → tanda besar (merah) → cahaya di ujung */}
        <line x1={1560} y1={TY} x2={2420} y2={TY} stroke="url(#tl)" strokeWidth={6} />
        {ticks.map((t) => (
          <g key={t.x}>
            <circle cx={t.x} cy={TY} r={26} fill={t.col} opacity={0.2} />
            <circle cx={t.x} cy={TY} r={13} fill={t.col} />
          </g>
        ))}
        <circle cx={2440} cy={TY} r={70} fill="url(#lamp)" />
        <circle cx={2440} cy={TY} r={16} fill="#fff4cf" />
        <text x={1800} y={TY + 80} textAnchor="middle" fontFamily={FONT.sans} fontSize={34} fill={C.kin} opacity={0.9}>
          tanda kecil
        </text>
        <text x={2215} y={TY + 80} textAnchor="middle" fontFamily={FONT.sans} fontSize={34} fill={C.heat} opacity={0.9}>
          tanda besar
        </text>
      </svg>
      <div style={{position: 'absolute', left: 140, top: 180, color: C.gold, fontSize: 54, letterSpacing: 10, fontWeight: 600}}>{BRAND.series.toUpperCase()}</div>
      <div style={{position: 'absolute', left: 130, top: 280, color: C.ink, fontSize: 200, fontWeight: 700, lineHeight: 0.98, letterSpacing: -6}}>
        Menuju
        <br />
        <span style={{color: C.gold}}>Akhir Zaman</span>
      </div>
      <div style={{position: 'absolute', left: 140, top: 770, width: 1300, color: C.muted, fontSize: 62, fontWeight: 500, lineHeight: 1.2}}>{BRAND.subtitle}</div>
      <div style={{position: 'absolute', left: 140, bottom: 140, color: C.ink, fontSize: 44, letterSpacing: 8, fontWeight: 600}}>
        {BRAND.channel} <span style={{color: C.muted, letterSpacing: 2, fontWeight: 400}}>· {BRAND.tagline}</span>
      </div>
    </AbsoluteFill>
  );
};
