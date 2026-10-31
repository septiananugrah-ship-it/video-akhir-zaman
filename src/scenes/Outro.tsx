import React from 'react';
import {AbsoluteFill, Img, interpolateColors, staticFile} from 'remotion';
import {EASE_IN_OUT, cyc, ramp, rand} from '../anim';
import {Glow, Motes, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {BRAND} from '../brand';
import {useScene} from '../SceneContext';
import {C, FONT, type Hue} from '../theme';

const REFS = [
  'Al-Qur\'an: Al-Baqarah 30 · Al-Ahzab 40, 72 · Al-Qamar 1 · Al-A\'raf 187 · Al-Kahfi 94–98 · Al-Anbiya 96 · Yunus 24 · An-Naml 82 · Az-Zumar 68',
  'Shahih Al-Bukhari: dua jari (6504), ilmu dicabut & zaman berdekatan (1036), amanah (59), Dajjal buta sebelah (7131), matahari dari barat (4635)',
  'Shahih Muslim: hadis Jibril (8), sepuluh tanda (2901), Dajjal, Isa & Yakjuj Makjuj (2937), Al-Kahfi (809), doa tasyahud (588)',
  'Sunan Abu Dawud (4282) & Tirmidzi: Al-Mahdi · Musnad Ahmad: menanam bibit',
  'Ibnu Katsir, An-Nihayah fil Fitan wal Malahim · rujuk ulama untuk perincian',
  'Bagian renungan adalah pemikiran penyusun, bukan tafsir',
];

// cahaya yang mengitari logo (kode warna video: dalil emas, tanda kecil jingga, tanda besar merah, fitnah ungu, iman toska, bibit hijau)
const ORBIT: {hue: Hue; ph: number}[] = [
  {hue: 'gold', ph: 0},
  {hue: 'kin', ph: 1.05},
  {hue: 'heat', ph: 2.09},
  {hue: 'spr', ph: 3.14},
  {hue: 'cyan', ph: 4.19},
  {hue: 'work', ph: 5.24},
];
const LC = {x: 960, y: 185, r: 162};
const fr = (v: number) => ((v % 1) + 1) % 1;
const STEPS: {l: string; c: string}[] = [
  {l: 'khalifah', c: C.cyan},
  {l: 'tanda kecil', c: C.kin},
  {l: 'tanda besar', c: C.heat},
  {l: 'sangkakala', c: C.gold},
  {l: 'kekal ∞', c: C.work},
];

const star8 = (cx: number, cy: number, r: number) =>
  Array.from({length: 16}, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.62 : r;
    return `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(' ') + ' Z';

/** Motif kiri: bibit yang tumbuh (gema "tanamlah") dengan cahaya hijau naik. */
const Seedling: React.FC<{x: number; y: number; t: number; opacity: number}> = ({x, y, t, opacity}) => {
  if (opacity <= 0.001) return null;
  const g = ramp(t, 1.2, 8, EASE_IN_OUT);
  const H = 150 * g;
  const sw = 5 * Math.sin(t * 1.2) * g;
  return (
    <g opacity={opacity}>
      <Glow x={x} y={y - H * 0.6} r={110 + 90 * g} color="work" opacity={0.25 + 0.4 * g} />
      <line x1={x - 120} y1={y} x2={x + 120} y2={y} stroke="#4a3b2e" strokeWidth={3} />
      <path d={`M${x - 60},${y} Q${x},${y - 26} ${x + 60},${y} Z`} fill="#4a3627" />
      <path d={`M${x},${y - 2} C${x + sw * 0.3},${y - H * 0.4} ${x - sw * 0.5},${y - H * 0.7} ${x + sw},${y - H}`} fill="none" stroke={C.work} strokeWidth={4 + 3 * g} strokeLinecap="round" opacity={ramp(g, 0, 0.04)} />
      {[0, 1, 2, 3].map((k) => {
        const p = ramp(g, 0.15 + k * 0.17, 0.45 + k * 0.17);
        const ly = y - H * (0.3 + k * 0.19);
        const sd = k % 2 ? -1 : 1;
        const L = 46 * p * (1 - k * 0.12);
        const bx = x + sw * (0.3 + k * 0.2);
        return (
          <path
            key={k}
            d={`M${bx},${ly} C${bx + sd * L * 0.3},${ly - L * 0.5} ${bx + sd * L},${ly - L * 0.4} ${bx + sd * L * 1.1},${ly - 3} C${bx + sd * L * 0.8},${ly + L * 0.15} ${bx + sd * L * 0.3},${ly + 5} ${bx},${ly} Z`}
            fill={C.work}
            opacity={0.9 * p}
            transform={`rotate(${sd * 4 * Math.sin(t * 1.3 + k)} ${bx} ${ly})`}
          />
        );
      })}
      {Array.from({length: 8}, (_, k) => {
        const u = fr(t * 0.22 + k / 8);
        return <circle key={k} cx={x + (rand(k * 3.1) - 0.5) * 180 + 8 * Math.sin(t + k)} cy={y - 10 - u * 230} r={1.6 + rand(k) * 1.6} fill={C.work} opacity={cyc(u) * 0.7 * g} />;
      })}
      <text x={x} y={y + 30} textAnchor="middle" fontFamily={FONT.mono} fontSize={17} fill={C.work} opacity={0.8}>
        tanamlah
      </text>
    </g>
  );
};

/** Motif kanan: garis waktu emas tegak; simpul menyala bergiliran, butir cahaya merambat ke bawah. */
const Timeline: React.FC<{x: number; y0: number; y1: number; t: number; opacity: number}> = ({x, y0, y1, t, opacity}) => {
  if (opacity <= 0.001) return null;
  const dy = (y1 - y0) / (STEPS.length - 1);
  const u = fr(t / 6);
  const hy = y0 + (y1 - y0) * u;
  return (
    <g opacity={opacity}>
      <Glow x={x} y={(y0 + y1) / 2} r={170} color="gold" opacity={0.25} />
      <line x1={x} y1={y0} x2={x} y2={y1} stroke={C.gold} strokeOpacity={0.35} strokeWidth={3} />
      <line x1={x} y1={y0} x2={x} y2={hy} stroke={C.gold} strokeOpacity={0.8 * cyc(u)} strokeWidth={3} />
      {STEPS.map((s, k) => {
        const y = y0 + k * dy;
        const near = Math.exp(-Math.pow((hy - y) / 26, 2)) * cyc(u);
        const col = interpolateColors(near, [0, 1], [C.gold, s.c]);
        return (
          <g key={s.l}>
            <path d={star8(x, y, 11 + 4 * near)} fill="#141d44" stroke={col} strokeWidth={2} transform={`rotate(${t * 10 + k * 20} ${x} ${y})`} />
            <circle cx={x} cy={y} r={4} fill={col} />
            <text x={x + 26} y={y} dominantBaseline="central" fontFamily={FONT.mono} fontSize={16} fill={col} opacity={0.65 + 0.35 * near}>
              {s.l}
            </text>
          </g>
        );
      })}
      <Spark x={x} y={hy} r={5} color="gold" opacity={cyc(u)} />
    </g>
  );
};

/** Penutup: logo SCIENTIAN, tagline, nama penyusun, rujukan, dan pil penutup; motif bibit & garis waktu emas. */
export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const logo = ramp(t, 0.2, 1.6);
  const name = ramp(t, 1.4, 2.4);
  const by = ramp(t, 2.4, 3.4);
  const next = ramp(t, 9.2, 10.2);
  const motif = ramp(t, 1.0, 3.0);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  const orbitOn = ramp(t, 0.8, 2.2);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={240} r={440} color="gold" opacity={0.22 * logo} />
        <Glow x={960} y={LC.y} r={210} color="cyan" opacity={0.2 * logo} />
        <Motes x={960} y={320} rx={640} ry={260} n={40} color="gold" opacity={0.4 * logo} seed={13} />
        {/* bintang delapan kecil melayang naik pelan */}
        {Array.from({length: 18}, (_, k) => {
          const p = fr((t + rand(k * 3.1) * 14) / (11 + 5 * rand(k)));
          const x = 80 + rand(k * 5.3) * 1760 + 10 * Math.sin(t * 0.7 + k);
          const y = 1000 - p * 900;
          return <path key={k} d={star8(x, y, 5 + 3 * rand(k * 2.2))} fill="none" stroke={C.gold} strokeWidth={1} opacity={cyc(p) * 0.45 * logo} transform={`rotate(${t * 20 + k * 30} ${x} ${y})`} />;
        })}
        {/* roset di belakang logo + cahaya mengitari */}
        <g opacity={orbitOn}>
          <path d={star8(LC.x, LC.y, LC.r + 26)} fill="none" stroke={C.gold} strokeOpacity={0.22} strokeWidth={1.5} transform={`rotate(${t * 4} ${LC.x} ${LC.y})`} />
          <path d={star8(LC.x, LC.y, LC.r + 10)} fill="none" stroke={C.gold} strokeOpacity={0.14} strokeWidth={1.5} transform={`rotate(${-t * 6 + 22.5} ${LC.x} ${LC.y})`} />
          <circle cx={LC.x} cy={LC.y} r={LC.r} fill="none" stroke={C.gold} strokeOpacity={0.2} strokeWidth={1.5} strokeDasharray="4 10" strokeDashoffset={-t * 14} />
          {ORBIT.map((o) => {
            const a = o.ph + t * 0.45;
            const trail = [1, 2, 3, 4].map((k) => [LC.x + LC.r * Math.cos(a - k * 0.06), LC.y + LC.r * Math.sin(a - k * 0.06)] as [number, number]);
            return <Spark key={o.hue} x={LC.x + LC.r * Math.cos(a)} y={LC.y + LC.r * Math.sin(a)} r={5} color={o.hue} trail={trail} opacity={0.85} />;
          })}
        </g>
        <Seedling x={250} y={540} t={t} opacity={0.9 * motif} />
        <Timeline x={1590} y0={270} y1={530} t={t} opacity={0.9 * motif} />
        <Twinkles x={960} y={530} rx={360} ry={30} n={4} color="gold" opacity={by * 0.7} seed={17} />
        <Ripple x={960} y={1010} p={(t - 9.2) / 1.6} r={260} color="gold" rings={2} />
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
        <Img
          src={staticFile('scientian-logo.png')}
          style={{
            width: 230,
            height: 230,
            opacity: logo,
            scale: String((0.85 + 0.15 * logo) * (1 + 0.015 * Math.sin(t * 1.3))),
            rotate: `${(1 - logo) * -20}deg`,
          }}
        />
        <div style={{fontFamily: FONT.head, fontSize: 64, fontWeight: 700, letterSpacing: 16 + 6 * (1 - name), color: C.ink, marginTop: 4, opacity: name, textShadow: `0 0 ${18 + 8 * Math.sin(t * 1.6)}px ${C.cyan}55`}}>{BRAND.channel}</div>
        <div style={{fontFamily: FONT.head, fontSize: 28, color: C.muted, letterSpacing: 3, marginTop: 4, opacity: name}}>
          Explore <span style={{color: C.gold}}>Science</span> with Yayan
        </div>
        <div style={{marginTop: 34, fontFamily: FONT.sans, fontSize: 24, color: C.muted, opacity: by, letterSpacing: 2}}>DISUSUN OLEH</div>
        <div style={{fontFamily: FONT.head, fontSize: 46, fontWeight: 600, color: C.ink, opacity: by, marginTop: 2, translate: `0px ${(1 - by) * 12}px`}}>{BRAND.author}</div>
        <div style={{marginTop: 34, textAlign: 'center'}}>
          <div style={{fontFamily: FONT.mono, fontSize: 18, letterSpacing: 4, color: C.gold, marginBottom: 10, opacity: ramp(t, 3.4, 4.2)}}>RUJUKAN</div>
          {REFS.map((r, i) => {
            const o = ramp(t, 3.7 + i * 0.22, 4.6 + i * 0.22);
            return (
              <div key={r} style={{fontFamily: FONT.sans, fontSize: 21, color: C.muted, lineHeight: 1.55, opacity: o, translate: `0px ${(1 - o) * 10}px`}}>
                {r}
              </div>
            );
          })}
          <div style={{marginTop: 12, fontFamily: FONT.sans, fontSize: 19, color: C.muted, opacity: 0.85 * ramp(t, 5.2, 6.0)}}>
            Ilustrasi simbolis · tanpa penggambaran wajah nabi & sosok gaib · urutan tanda besar diperselisihkan ulama
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            fontFamily: FONT.head,
            fontSize: 30,
            color: C.ink,
            opacity: next,
            padding: '10px 28px',
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            background: 'rgba(10,16,36,0.85)',
            boxShadow: `0 0 ${16 + 12 * (0.5 + 0.5 * Math.sin(t * 2))}px ${C.gold}66, 0 0 30px ${C.spr}44`,
            translate: `0px ${(1 - next) * 14}px`,
          }}
        >
          <span style={{color: C.ink}}>{BRAND.next}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
