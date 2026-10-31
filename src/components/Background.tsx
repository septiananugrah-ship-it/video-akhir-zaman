import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {cyc, rand} from '../anim';
import {C, FONT, H, MOOD_TINT, W} from '../theme';
import {TIMELINE} from '../timeline.ts';

// Latar "Gulungan Malam": langit biru tinta pekat, bintang berkelip yang hanyut pelan,
// pola geometris bintang delapan yang sangat tipis (bergeser satu periode lalu dibungkus → tanpa loncatan),
// nama surah (Latin) melayang samar, sesekali bintang jatuh. Semua gerak bentuk tertutup per frame, < 400 elemen.

const tintAt = (t: number) => {
  const stops: number[] = [];
  const colors: string[] = [];
  TIMELINE.scenes.forEach((s) => {
    stops.push(s.start + 0.01, Math.max(s.start + 0.02, s.end - 1.5));
    colors.push(MOOD_TINT[s.mood], MOOD_TINT[s.mood]);
  });
  return interpolateColors(t, stops, colors);
};

const mod = (v: number, m: number) => ((v % m) + m) % m;

// ---------- pola bintang delapan (satu path) ----------
const P = 180; // periode ubin
const R = 46; // jari-jari luar bintang
const RI = R * 0.7654; // jari-jari dalam bintang {8/2}
const PATTERN = (() => {
  const d: string[] = [];
  for (let cx = -P; cx <= W + 2 * P; cx += P) {
    for (let cy = -P; cy <= H + 2 * P; cy += P) {
      // bintang delapan (16 titik)
      const s: string[] = [];
      for (let k = 0; k < 16; k++) {
        const a = (k * Math.PI) / 8 - Math.PI / 2;
        const r = k % 2 ? RI : R;
        s.push(`${k ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
      }
      d.push(s.join(' ') + ' Z');
      // segi delapan dalam
      const o: string[] = [];
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + Math.PI / 8;
        o.push(`${k ? 'L' : 'M'}${(cx + R * 0.42 * Math.cos(a)).toFixed(1)},${(cy + R * 0.42 * Math.sin(a)).toFixed(1)}`);
      }
      d.push(o.join(' ') + ' Z');
      // penghubung ke bintang tetangga (kanan & bawah) + belah ketupat di tengah sel
      d.push(`M${cx + R},${cy} H${cx + P - R}`);
      d.push(`M${cx},${cy + R} V${cy + P - R}`);
      const mx = cx + P / 2;
      const my = cy + P / 2;
      const q = 24;
      d.push(`M${mx},${my - q} L${mx + q},${my} L${mx},${my + q} L${mx - q},${my} Z`);
    }
  }
  return d.join(' ');
})();

// ---------- bintang ----------
const STARS = Array.from({length: 150}, (_, i) => ({
  x: rand(i * 3.17 + 0.4) * (W + 20),
  y: Math.pow(rand(i * 5.71 + 1.3), 1.25) * H * 0.98,
  r: 0.6 + Math.pow(rand(i * 9.37), 3) * 1.9,
  v: 1.2 + rand(i * 1.73) * 2.6,
  f: 0.4 + rand(i * 2.91) * 1.1,
  ph: rand(i * 7.13) * Math.PI * 2,
  c: rand(i * 4.4) > 0.82 ? C.gold : rand(i * 6.6) > 0.7 ? '#bfe9ff' : '#eef3ff',
}));
// bintang terang bersinar empat ujung
const BRIGHT = Array.from({length: 9}, (_, i) => ({
  x: 140 + rand(i * 11.3 + 2) * (W - 280),
  y: 70 + rand(i * 13.9 + 5) * 560,
  s: 7 + rand(i * 3.3) * 7,
  f: 0.25 + rand(i * 8.1) * 0.35,
  ph: rand(i * 2.2) * 6,
}));

// Nama surah "hantu" yang melayang pelan di latar (sangat samar, hanya tekstur hidup).
const GHOSTS = ['Al-Baqarah 30', 'Al-Ahzab 72', 'Al-Qamar 1', 'Al-Kahfi 94–98', 'Al-Anbiya 96', 'Yunus 24', 'Az-Zumar 68', 'An-Naml 82'];
const GHOST = GHOSTS.map((txt, i) => ({
  txt,
  y: 150 + ((i * 131) % 760),
  size: 54 + (i % 3) * 22,
  speed: 7 + (i % 4) * 3,
  off: rand(i * 7.7) * (W + 700),
  c: [C.gold, C.cyan, C.gold, '#e9d9b0'][i % 4],
}));

const Sparkle: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={s * 1.6} fill={C.gold} opacity={0.08} />
    <path d={`M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`} fill="#fff4d6" />
  </g>
);

/** Latar malam biru tinta + bintang berkelip + pola bintang delapan tipis + nama surah samar. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const tint = tintAt(t);
  const sx = mod(t * 3.2, P);
  const sy = mod(t * 1.6, P);
  const patOp = 0.05 + 0.012 * Math.sin(t * 0.21);
  // bintang jatuh: satu tiap 14 dtk
  const mph = mod(t / 14, 1);
  const mk = Math.floor(t / 14);
  const mx0 = 300 + rand(mk * 3.3 + 1) * 1200;
  const my0 = 90 + rand(mk * 5.9 + 2) * 220;
  const ms = Math.min(1, mph * 7); // gerak selama 1/7 siklus (2 dtk)
  const mHead: [number, number] = [mx0 + 420 * ms, my0 + 150 * ms];
  const mOp = mph < 1 / 7 ? Math.sin(Math.PI * ms) * 0.55 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 78% at 50% 38%, ${tint} 0%, ${C.bg} 78%)`}} />
      {/* kabut bima sakti yang sangat samar */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 16% at ${50 + 4 * Math.sin(t * 0.02)}% 30%, rgba(150,170,255,0.05) 0%, transparent 70%)`,
          rotate: '-14deg',
          scale: '1.4',
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="bg-meteor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff4d6" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff4d6" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* pola bintang delapan */}
        <g transform={`translate(${-sx} ${-sy})`}>
          <path d={PATTERN} fill="none" stroke={C.gold} strokeOpacity={patOp} strokeWidth={1.3} strokeLinejoin="round" />
        </g>
        {/* nama surah melayang */}
        {GHOST.map((g, i) => {
          const span = W + 700;
          const x = mod(g.off + t * g.speed, span) - 350;
          const edge = Math.min(1, (x + 350) / 300, (W + 350 - x) / 300);
          return (
            <text key={i} x={x} y={g.y + 10 * Math.sin(t * 0.3 + i)} fontFamily={FONT.serif} fontStyle="italic" fontSize={g.size} fill={g.c} opacity={0.024 * Math.max(0, edge)}>
              {g.txt}
            </text>
          );
        })}
        {/* bintang */}
        {STARS.map((s, i) => {
          const x = mod(s.x - t * s.v, W + 20) - 10;
          const tw = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.f + s.ph));
          return <circle key={i} cx={x} cy={s.y} r={s.r} fill={s.c} opacity={tw * (s.y > H - 220 ? 0.55 : 1)} />;
        })}
        {BRIGHT.map((b, i) => {
          const x = mod(b.x - t * 1.4, W + 40) - 20;
          const tw = 0.5 + 0.5 * Math.sin(t * b.f * 2 + b.ph);
          return <Sparkle key={`b${i}`} x={x} y={b.y} s={b.s * (0.6 + 0.4 * tw)} o={0.25 + 0.45 * tw} />;
        })}
        {/* bintang jatuh */}
        {mOp > 0.002 ? (
          <g opacity={mOp}>
            <line x1={mHead[0] - 180} y1={mHead[1] - 64} x2={mHead[0]} y2={mHead[1]} stroke="url(#bg-meteor)" strokeWidth={2.2} strokeLinecap="round" />
            <circle cx={mHead[0]} cy={mHead[1]} r={2.6} fill="#fff" />
          </g>
        ) : null}
        {/* debu emas halus yang naik pelan */}
        {Array.from({length: 18}, (_, i) => {
          const ph = mod(t * (0.018 + rand(i * 2.3) * 0.02) + rand(i * 9.1), 1);
          const x = rand(i * 4.7 + 3) * W + 20 * Math.sin(t * 0.25 + i);
          const y = H - 60 - ph * (H - 160);
          return <circle key={`d${i}`} cx={x} cy={y} r={1 + rand(i * 6.1) * 1.6} fill={C.gold} opacity={0.32 * cyc(ph)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Vinyet gelap di tepi layar. */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 80% at 50% 46%, transparent 60%, rgba(2,4,10,0.55) 100%)'}} />
);
