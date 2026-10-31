import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, pathOf, ramp, rand, win} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {Renungan} from './Peak';

// Renungan (bukan tafsir): Yakjuj Makjuj = keturunan Adam (Bukhari 3348); menyamakan dengan teknologi = tafsiran lemah.
// Hanya kemiripan POLA: kawanan chip yang menyebar dari banyak titik di bumi, pusat data menguras air ("miliaran liter / tahun"),
// danau mengering ("dulu di sini pernah ada air"), penghitung mesin berlipat, kenop kendali tergelincir — lalu semuanya tunduk
// pada kehendak Allah: goyangan kecil (gema ulat) mengalahkan siluet mesin raksasa.
const G = {x: 900, y: 560, r: 220};
const fr = (v: number) => ((v % 1) + 1) % 1;
const SEEDS: [number, number][] = [
  [-120, -110],
  [80, -140],
  [150, 20],
  [-40, 40],
  [-150, 90],
  [60, 140],
  [-10, -40],
];
const CHIPS = Array.from({length: 170}, (_, i) => {
  const s = SEEDS[i % SEEDS.length];
  const a = rand(i * 3.7) * Math.PI * 2;
  const d = 10 + rand(i * 5.9) * 90;
  return {x: s[0] + Math.cos(a) * d, y: s[1] + Math.sin(a) * d * 0.8, th: rand(i * 2.2), ph: rand(i * 8.1) * 6.28};
});
const ROBOTS = Array.from({length: 54}, (_, i) => ({x: 150 + (i % 9) * 82 + (rand(i) - 0.5) * 20, y: 300 + Math.floor(i / 9) * 88 + (rand(i * 3) - 0.5) * 16, th: rand(i * 4.4), ph: rand(i * 6.6) * 6.28}));
const LAKE = {x: 900, y: 700, rx: 330, ry: 70};
const CRACKS = Array.from({length: 11}, (_, k) => {
  let x = LAKE.x + (rand(k * 4.1) - 0.5) * LAKE.rx * 1.3;
  let y = LAKE.y + (rand(k * 2.3) - 0.5) * LAKE.ry * 0.8;
  const pts: [number, number][] = [[x, y]];
  const a0 = rand(k * 8.8) * 6.28;
  for (let j = 0; j < 4; j++) {
    const a = a0 + (rand(k * 10 + j) - 0.5) * 1.6;
    x += Math.cos(a) * 42;
    y += Math.sin(a) * 12;
    const dx = (x - LAKE.x) / LAKE.rx;
    const dy = (y - LAKE.y) / LAKE.ry;
    const dd = Math.hypot(dx, dy);
    if (dd > 0.9) {
      x = LAKE.x + (dx / dd) * 0.9 * LAKE.rx;
      y = LAKE.y + (dy / dd) * 0.9 * LAKE.ry;
    }
    pts.push([x, y]);
  }
  return pathOf(pts);
});
const TAGS = [
  {k: 'tak', l: 'tak terlawan'},
  {k: 'banyak', l: 'sangat banyak'},
  {k: 'penjuru', l: 'dari segala penjuru'},
  {k: 'menghabiskan', l: 'menghabiskan sumber daya'},
];
const fmtId = (n: number) => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const ChipIcon: React.FC<{x: number; y: number; s?: number; op?: number}> = ({x, y, s = 1, op = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M-8,-4 h-3 M-8,4 h-3 M8,-4 h3 M8,4 h3 M-4,-8 v-3 M4,-8 v-3 M-4,8 v3 M4,8 v3" stroke={C.spr} strokeWidth={1.6} />
    <rect x={-8} y={-8} width={16} height={16} rx={3} fill="#2a1f5a" stroke={C.spr} strokeWidth={1.6} />
    <rect x={-3} y={-3} width={6} height={6} fill={C.cyan} opacity={0.8} />
  </g>
);

const Robot: React.FC<{x: number; y: number; s?: number; op?: number; t: number; ph: number}> = ({x, y, s = 1, op = 1, t, ph}) => (
  <g transform={`translate(${x} ${y + 2 * Math.sin(t * 2 + ph)}) scale(${s})`} opacity={op}>
    <line x1={0} y1={-20} x2={0} y2={-26} stroke={C.spr} strokeWidth={2} />
    <circle cx={0} cy={-27} r={2.5} fill={C.cyan} opacity={0.6 + 0.4 * Math.sin(t * 4 + ph)} />
    <rect x={-12} y={-20} width={24} height={16} rx={4} fill="#2a1f5a" stroke={C.spr} strokeWidth={1.6} />
    <rect x={-7} y={-15} width={14} height={4} rx={2} fill={C.cyan} opacity={0.8} />
    <rect x={-10} y={-2} width={20} height={18} rx={3} fill="#221a4a" stroke={C.spr} strokeWidth={1.6} />
  </g>
);

/** Pusat data + menara pendingin yang mengepulkan uap. */
const DataCenter: React.FC<{x: number; t: number; k: number}> = ({x, t, k}) => (
  <g>
    <rect x={x - 70} y={630} width={140} height={150} rx={6} fill="#151d3e" stroke={C.spr} strokeWidth={2} />
    {Array.from({length: 4}, (_, j) => (
      <g key={j}>
        <rect x={x - 56} y={646 + j * 32} width={112} height={20} rx={3} fill="#0c1230" />
        {Array.from({length: 6}, (_, q) => (
          <circle key={q} cx={x - 44 + q * 17} cy={656 + j * 32} r={2.6} fill={(q + j + k) % 3 ? C.cyan : C.work} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 3 + q * 1.3 + j * 2 + k))} />
        ))}
      </g>
    ))}
    <path d={`M${x + 80},780 C${x + 92},720 ${x + 92},690 ${x + 84},640 L${x + 136},640 C${x + 128},690 ${x + 128},720 ${x + 140},780 Z`} fill="#202a50" stroke={C.muted} strokeWidth={2} />
    {Array.from({length: 5}, (_, j) => {
      const u = fr(t * 0.35 + j / 5 + k * 0.17);
      return <circle key={j} cx={x + 110 + 18 * u * Math.sin(j)} cy={630 - u * 150} r={12 + 26 * u} fill="#dfe8ff" opacity={cyc(u) * 0.28} />;
    })}
  </g>
);

export const AiYajuj: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  // segmen
  const s0 = win(t, cue(0) - 0.4, cue(2) - 0.2, 0.6, 0.6);
  const qn = win(t, cue(0) - 0.2, cue(1) + 0.2, 0.5, 0.5);
  const adam = win(t, cue(1) + 0.2, cue(2) - 0.2, 0.6, 0.6);
  const pB = win(t, wordOf(1, 'adam') - 0.2, cue(2) - 0.2, 0.5, 0.6);
  const weak = win(t, wordOf(1, 'menyamakan') - 0.2, cue(2) - 0.2, 0.6, 0.6);
  const s2 = win(t, cue(2) - 0.3, cue(3), 0.7, 0.7);
  const grow = ramp(t, wordOf(2, 'banyak') - 0.6, wordOf(2, 'menghabiskan') + 1.2, EASE_IN_OUT);
  const drain2 = ramp(t, wordOf(2, 'menghabiskan'), wordOf(2, 'menghabiskan') + 1.6);
  const s3 = win(t, cue(3) - 0.3, cue(5) - 0.2, 0.7, 0.8);
  const gauge = win(t, cue(3), cue(4) + 0.4, 0.6, 0.6);
  const lvl = 1 - 0.8 * ramp(t, cue(3) + 1, cue(4) + 0.4, EASE_IN_OUT);
  const bil = win(t, wordOf(3, 'miliaran') - 0.2, cue(4) - 0.1, 0.5, 0.6);
  const lake = win(t, cue(4) - 0.3, wordOf(4, 'siapa') + 0.4, 0.7, 0.9);
  const lv = 1 - 0.97 * ramp(t, cue(4), wordOf(4, 'dulu') + 0.4, EASE_IN_OUT);
  const dulu = win(t, wordOf(4, 'dulu') - 0.1, wordOf(4, 'siapa') - 0.1, 0.5, 0.6);
  const tSiapa = wordOf(4, 'siapa');
  const counter = win(t, tSiapa - 0.2, cue(6) - 0.1, 0.6, 0.6);
  const cnt = Math.pow(10, 3 + 8.5 * ramp(t, tSiapa, cue(6) - 0.2, (x) => x));
  const robots = win(t, tSiapa, cue(6) - 0.1, 0.6, 0.6);
  const robGrow = ramp(t, tSiapa, cue(6) - 0.4, (x) => Math.pow(x, 0.75));
  const dial = win(t, cue(5) - 0.2, cue(6) - 0.1, 0.6, 0.6);
  const slip = ramp(t, wordOf(5, 'mungkin'), wordOf(5, 'kendalikan') + 0.6, EASE_IN_OUT);
  const pola = win(t, cue(6) - 0.1, cue(7) - 0.1, 0.6, 0.6);
  const wahyu = win(t, wordOf(6, 'pasti') - 0.2, cue(7) - 0.1, 0.5, 0.6);
  const s7 = ramp(t, cue(7) - 0.3, cue(7) + 0.8);
  const crawl = ramp(t, cue(7) + 0.5, wordOf(7, 'tunduk') + 0.4, EASE_IN_OUT);
  const fall = ramp(t, wordOf(7, 'tunduk'), wordOf(7, 'kecil') + 0.6, EASE_IN_OUT);
  const tunduk = ramp(t, wordOf(7, 'tunduk') - 0.2, wordOf(7, 'tunduk') + 0.6);
  const kecil = ramp(t, wordOf(7, 'kecil') - 0.3, wordOf(7, 'kecil') + 0.5);
  const globeCol = interpolateColors(drain2, [0, 1], ['#1b4f8e', '#5a4636']);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <defs>
          <radialGradient id="ay-g" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor={globeCol} />
            <stop offset="100%" stopColor="#081631" />
          </radialGradient>
          <radialGradient id="ay-bed">
            <stop offset="0%" stopColor="#5a4434" />
            <stop offset="100%" stopColor="#2a2024" />
          </radialGradient>
          <clipPath id="ay-ground">
            <rect x={0} y={0} width={1920} height={800} />
          </clipPath>
          <clipPath id="ay-tank">
            <rect x={1420} y={380} width={120} height={380} rx={16} />
          </clipPath>
        </defs>

        {/* 0–1: gerbang (simbol), keturunan Adam */}
        <g opacity={s0}>
          <Glow x={960} y={590} r={300} color="kin" opacity={0.35} />
          <rect x={760} y={440} width={400} height={300} rx={8} fill="#2a1d18" stroke={C.kin} strokeWidth={3} />
          {Array.from({length: 6}, (_, r) =>
            Array.from({length: 5}, (_, c) => <rect key={`${r}-${c}`} x={772 + c * 78 + (r % 2) * 20} y={452 + r * 47} width={66} height={38} rx={3} fill="#3d2a1e" stroke={C.kin} strokeOpacity={0.35 + 0.25 * Math.sin(t * 1.5 + r + c)} strokeWidth={1.5} />),
          )}
          <rect x={760} y={440} width={400} height={300} rx={8} fill="none" stroke="#ffb27a" strokeOpacity={0.3 + 0.2 * Math.sin(t * 2)} strokeWidth={6} />
          <Motes x={960} y={590} rx={260} ry={180} n={18} color="kin" opacity={0.5} seed={2} />
        </g>

        {/* 2: pola — kawanan chip menyebar di bumi */}
        <g opacity={s2}>
          <Glow x={G.x} y={G.y} r={G.r * 1.7} color="spr" opacity={0.25 + 0.3 * grow} />
          <circle cx={G.x} cy={G.y} r={G.r} fill="url(#ay-g)" stroke={C.cyan} strokeOpacity={0.4} strokeWidth={2} />
          {[0, 1, 2, 3, 4].map((k) => {
            const ph = fr(t * 0.03 + k / 5);
            return <ellipse key={k} cx={G.x} cy={G.y} rx={Math.max(0.5, G.r * Math.abs(Math.cos(ph * Math.PI)))} ry={G.r} fill="none" stroke="#7fb8ff" strokeOpacity={0.14} strokeWidth={1.2} />;
          })}
          {SEEDS.map(([sx, sy], k) => (
            <circle key={k} cx={G.x + sx} cy={G.y + sy} r={8 + 3 * Math.sin(t * 3 + k)} fill={C.spr} opacity={0.6 * ramp(t, wordOf(2, 'penjuru') - 1.5 + k * 0.1, wordOf(2, 'penjuru'))} />
          ))}
          {CHIPS.map((c, i) => {
            const on = ramp(grow, c.th * 0.9, c.th * 0.9 + 0.1);
            if (on <= 0.001) return null;
            const s = SEEDS[i % SEEDS.length];
            const x = G.x + mix(s[0], c.x, on) + 2 * Math.sin(t * 1.4 + c.ph);
            const y = G.y + mix(s[1], c.y, on);
            return <ChipIcon key={i} x={x} y={y} s={0.7} op={on} />;
          })}
          {TAGS.map((tg, k) => {
            const p = ramp(t, wordOf(2, tg.k) - 0.2, wordOf(2, tg.k) + 0.5, BACK);
            return (
              <g key={tg.k} opacity={Math.min(1, p)} transform={`translate(${1250 + 20 * (1 - Math.min(1, p))} ${400 + k * 80})`}>
                <circle cx={0} cy={0} r={8} fill={C.spr} />
                <circle cx={0} cy={0} r={16 + 3 * Math.sin(t * 2 + k)} fill="none" stroke={C.spr} strokeOpacity={0.4} strokeWidth={1.5} />
                <text x={28} y={0} dominantBaseline="central" fontFamily={FONT.head} fontSize={30} fontWeight={500} fill={C.ink}>
                  {tg.l}
                </text>
              </g>
            );
          })}
        </g>

        {/* 3: pusat data menguras air */}
        <g opacity={s3 * (1 - 0.6 * ramp(t, cue(4), cue(4) + 1)) * (1 - ramp(t, wordOf(4, 'siapa') - 0.4, wordOf(4, 'siapa') + 0.6, EASE_IN_OUT))}>
          {[0, 1, 2].map((k) => (
            <DataCenter key={k} x={260 + k * 250} t={t} k={k} />
          ))}
          <line x1={140} y1={780} x2={1600} y2={780} stroke={C.line} strokeWidth={2} />
        </g>
        <g opacity={gauge}>
          <Stream pts={[[1420, 740], [1100, 740], [1000, 700], [900, 700]]} color="water" n={10} speed={0.6} r={4.5} />
          <rect x={1420} y={380} width={120} height={380} rx={16} fill="#0c1430" stroke={C.water} strokeWidth={3} />
          <g clipPath="url(#ay-tank)">
            <rect x={1420} y={760 - 380 * lvl} width={120} height={380 * lvl} fill="url(#water)" />
            <path d={pathOf(Array.from({length: 13}, (_, j) => [1420 + j * 10, 760 - 380 * lvl + 4 * Math.sin(j * 0.8 + t * 3)] as [number, number]))} fill="none" stroke="#bfe6ff" strokeWidth={2} />
          </g>
          {[0.25, 0.5, 0.75].map((q) => (
            <line key={q} x1={1546} y1={760 - 380 * q} x2={1560} y2={760 - 380 * q} stroke={C.muted} strokeWidth={2} />
          ))}
          <Label x={1480} y={352} size={22} color={C.water}>
            cadangan air
          </Label>
        </g>

        {/* 4: danau mengering */}
        <g opacity={lake}>
          <ellipse cx={LAKE.x} cy={LAKE.y} rx={LAKE.rx} ry={LAKE.ry} fill="url(#ay-bed)" opacity={0.3 + 0.7 * (1 - lv)} />
          {CRACKS.map((d, k) => (
            <DrawPath key={k} d={d} p={ramp(1 - lv, 0.45 + k * 0.03, 0.95)} stroke="#120c10" width={2.4} />
          ))}
          <ellipse cx={LAKE.x} cy={LAKE.y} rx={LAKE.rx * Math.sqrt(lv)} ry={LAKE.ry * Math.sqrt(lv)} fill="url(#water)" opacity={0.9 * Math.min(1, lv * 4)} />
          {[0, 1].map((k) => {
            const q = fr(t * 0.3 + k / 2);
            return <ellipse key={k} cx={LAKE.x} cy={LAKE.y} rx={LAKE.rx * Math.sqrt(lv) * q} ry={LAKE.ry * Math.sqrt(lv) * q} fill="none" stroke="#bfe6ff" strokeWidth={1.5} opacity={cyc(q) * 0.6 * Math.min(1, lv * 3)} />;
          })}
        </g>

        {/* 4–5: robot berlipat + penghitung */}
        <g opacity={robots * (1 - 0.6 * dial)}>
          {ROBOTS.map((r, i) => {
            const on = ramp(robGrow, r.th * 0.85, r.th * 0.85 + 0.12);
            return on > 0.001 ? <Robot key={i} x={r.x} y={r.y} s={0.9} op={on} t={t} ph={r.ph} /> : null;
          })}
        </g>
        <g opacity={counter}>
          <Glow x={1400} y={360} r={220} color="spr" opacity={0.4} />
          <rect x={1180} y={300} width={440} height={120} rx={14} fill="#120d2c" stroke={C.spr} strokeWidth={2} />
          <text x={1370} y={360} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={40} fontWeight={600} fill={C.ink}>
            {fmtId(cnt)}
          </text>
          <text x={1580} y={360} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontSize={60} fontWeight={700} fill={C.spr} opacity={0.6 + 0.4 * Math.sin(t * 3)} transform={`rotate(${6 * Math.sin(t * 1.6)} 1580 360)`}>
            ?
          </text>
          <Label x={1400} y={448} size={20} color={C.muted}>
            mesin & robot di bumi · angka ilustrasi
          </Label>
        </g>
        {/* kenop kendali yang tergelincir */}
        <g opacity={dial} transform="translate(1400 650)">
          <path d="M-110,0 A110,110 0 0 1 110,0" fill="none" stroke={C.line} strokeWidth={14} />
          <path d={`M${110 * Math.cos(Math.PI * 0.25)},${-110 * Math.sin(Math.PI * 0.25)} A110,110 0 0 1 110,0`} fill="none" stroke={C.heat} strokeWidth={14} strokeOpacity={0.7} />
          {(() => {
            const ang = Math.PI * mix(0.75, -0.08, slip) + 0.06 * Math.sin(t * 9) * slip;
            return (
              <g>
                <line x1={0} y1={0} x2={96 * Math.cos(ang)} y2={-96 * Math.sin(ang)} stroke={interpolateColors(slip, [0.4, 1], [C.cyan, C.heat])} strokeWidth={6} strokeLinecap="round" />
                <circle r={18} fill="#1b2446" stroke={C.cyan} strokeWidth={3} />
              </g>
            );
          })()}
          <text y={50} textAnchor="middle" fontFamily={FONT.head} fontSize={26} fill={C.muted}>
            kendali
          </text>
          <Ripple x={110} y={0} p={(t - wordOf(5, 'kendalikan') - 0.3) / 1.3} r={90} color="heat" rings={2} />
        </g>

        {/* 6: kemiripan pola — dua lingkaran yang hampir bertumpuk tetapi tidak sama */}
        <g opacity={pola}>
          <circle cx={900 + 30 * Math.sin(t * 0.7)} cy={640} r={120} fill="none" stroke={C.spr} strokeWidth={3} strokeDasharray="6 8" strokeDashoffset={-t * 12} />
          <circle cx={1020 - 30 * Math.sin(t * 0.7)} cy={640} r={120} fill="none" stroke={C.gold} strokeWidth={3} />
          <text x={830} y={640} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontSize={24} fill={C.spr}>pola</text>
          <text x={1090} y={640} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontSize={24} fill={C.gold}>wahyu</text>
          <Motes x={960} y={560} rx={520} ry={240} n={24} color="spr" opacity={0.5} seed={19} />
        </g>
        {/* 7: siluet mesin raksasa vs goyangan kecil */}
        <g opacity={s7}>
          <line x1={560} y1={800} x2={1360} y2={800} stroke={C.line} strokeWidth={2} />
          <g clipPath="url(#ay-ground)">
          <g transform={`translate(960 ${790 + 120 * fall}) rotate(${8 * fall})`} opacity={1 - 0.65 * fall}>
            <Glow x={0} y={-260} r={340} color="spr" opacity={0.3 * (1 - fall)} />
            <path d="M-240,0 L-240,-300 L-160,-300 L-160,-420 L-60,-420 L-60,-470 L60,-470 L60,-420 L160,-420 L160,-300 L240,-300 L240,0 Z" fill="#1a1438" stroke={C.spr} strokeWidth={3} />
            {Array.from({length: 12}, (_, j) => (
              <rect key={j} x={-200 + (j % 4) * 104} y={-270 + Math.floor(j / 4) * 80} width={80} height={44} rx={4} fill="#0d0a22" stroke={C.spr} strokeOpacity={0.5} strokeWidth={1.5} />
            ))}
            <rect x={-50} y={-450} width={100} height={22} rx={6} fill={C.heat} opacity={0.5 + 0.4 * Math.sin(t * 3) * (1 - fall)} />
            {Array.from({length: 8}, (_, j) => (
              <path key={j} d={`M${-200 + j * 55},0 l${(rand(j) - 0.5) * 40},${-80 - rand(j * 3) * 160}`} stroke="#05040c" strokeWidth={3} fill="none" opacity={ramp(fall, j * 0.06, j * 0.06 + 0.4)} />
            ))}
          </g>
          </g>
          {Array.from({length: 40}, (_, j) => {
            const x0 = 700 + rand(j * 2.7) * 520;
            const y = 800 - crawl * (60 + rand(j * 5.3) * 380) - 6 * Math.sin(t * 1.3 + j);
            const on = ramp(crawl, rand(j) * 0.5, rand(j) * 0.5 + 0.2);
            return <path key={j} d={pathOf(Array.from({length: 7}, (_, q) => [x0 - 9 + q * 3, y + 3 * Math.sin(q * 1.1 + t * 9 + j)] as [number, number]))} fill="none" stroke={C.work} strokeWidth={2.6} strokeLinecap="round" opacity={on} />;
          })}
          <Ripple x={960} y={600} p={(t - wordOf(7, 'tunduk')) / 1.8} r={420} color="gold" rings={3} />
          <Label x={960} y={846} size={24} color={C.work} opacity={kecil}>
            bahkan lewat makhluk paling kecil
          </Label>
        </g>
        <Twinkles x={960} y={400} rx={400} ry={140} n={6} color="gold" opacity={tunduk} seed={14} />
      </Stage>

      <Renungan t={t} />
      <Note x={960} y={320} p={qn} color={C.kin} size={46}>
        Bagaimana dengan Yakjuj dan Makjuj?
      </Note>
      <Note x={960} y={300} p={adam} color={C.gold} size={38}>
        keturunan Adam
      </Note>
      <Badge x={960} y={372} text="HR Bukhari" color={C.gold} opacity={pB} scale={0.9 + 0.1 * pB} size={24} />
      <Note x={960} y={820} p={weak} color={C.heat} size={32}>
        menyamakan dengan teknologi = <span style={{color: C.heat}}>tafsiran lemah</span>
      </Note>
      <Note x={900} y={260} p={bil} color={C.water} size={40}>
        <span style={{color: C.water}}>miliaran liter air</span> / tahun
        <div style={{fontSize: 21, color: C.muted, marginTop: 4}}>untuk mendinginkan pusat data</div>
      </Note>
      <Note x={LAKE.x} y={540} p={dulu} color={C.muted} size={36}>
        “dulu di sini pernah ada air”
      </Note>
      <Note x={960} y={330} p={pola} color={C.spr} size={50}>
        kemiripan pola, <span style={{color: C.spr}}>bukan tafsir</span>
      </Note>
      <Note x={960} y={470} p={wahyu} color={C.gold} size={30}>
        yang pasti hanyalah apa yang disebut <span style={{color: C.gold}}>wahyu</span>
      </Note>
      <Note x={960} y={250} p={tunduk} color={C.gold} size={44}>
        <span style={{color: C.gold}}>tunduk pada kehendak Allah</span>
      </Note>
    </AbsoluteFill>
  );
};
