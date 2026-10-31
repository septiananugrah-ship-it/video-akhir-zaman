import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {EASE_IN_OUT, cyc, mix, pathOf, ramp, rand, win} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Spark, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Akhir Yakjuj Makjuj (Muslim 2937) — semuanya simbol: kawanan = titik merah, orang beriman = cahaya toska di Gunung Thur,
// danau menyusut jadi dasar retak, panah ke langit kembali merah, lalu ulat-ulat kecil (goyangan hijau) dan kawanan lenyap seketika.
const GY = 800;
const LX = 1100;
const LY = 748;
const RX = 300;
const RY = 62;
const MAG = {x: 690, y: 420, r: 100};
const N = 150;
const fr = (v: number) => ((v % 1) + 1) % 1;

const DOTS = Array.from({length: N}, (_, i) => {
  const a = rand(i * 3.1) * Math.PI * 2;
  const r = Math.sqrt(rand(i * 7.7));
  return {ox: Math.cos(a) * r, oy: Math.sin(a) * r, lag: rand(i * 1.9) * 2.4, s: rand(i * 5.3), ph: rand(i * 9.1) * 6.28};
});

const CRACKS = Array.from({length: 10}, (_, k) => {
  let x = LX + (rand(k * 4.1) - 0.5) * RX * 1.3;
  let y = LY + (rand(k * 2.3) - 0.5) * RY * 0.8;
  const pts: [number, number][] = [[x, y]];
  const a0 = rand(k * 8.8) * 6.28;
  for (let j = 0; j < 4; j++) {
    const a = a0 + (rand(k * 10 + j) - 0.5) * 1.6;
    x += Math.cos(a) * 40;
    y += Math.sin(a) * 11;
    const dx = (x - LX) / RX;
    const dy = (y - LY) / RY;
    const d = Math.hypot(dx, dy);
    if (d > 0.92) {
      x = LX + (dx / d) * 0.92 * RX;
      y = LY + (dy / d) * 0.92 * RY;
    }
    pts.push([x, y]);
  }
  return pathOf(pts);
});

const LIGHTS = Array.from({length: 14}, (_, i) => ({x: 250 + rand(i * 2.7) * 160, y: 640 + rand(i * 6.1) * 120, ph: rand(i * 4.4) * 6.28}));

const Shaft: React.FC<{x: number; y: number; ang: number; col: string; op: number}> = ({x, y, ang, col, op}) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={op}>
    <line x1={-24} y1={0} x2={10} y2={0} stroke={col} strokeWidth={3} strokeLinecap="round" />
    <path d="M17,0 L6,-6 L6,6 Z" fill={col} />
    <path d="M-20,0 l-8,-6 M-20,0 l-8,6" stroke={col} strokeWidth={2} fill="none" />
  </g>
);

const wiggle = (x: number, y: number, len: number, amp: number, ph: number, n = 10): string =>
  pathOf(Array.from({length: n + 1}, (_, j) => [x - len / 2 + (len * j) / n, y + amp * Math.sin((j / n) * Math.PI * 2 + ph)] as [number, number]));

export const YajujEnd: React.FC = () => {
  const {t, cue, cueEnd, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  // waktu kunci
  const tDrink = wordOf(2, 'meminum');
  const tDulu = wordOf(2, 'dulu');
  const tShoot = wordOf(3, 'melepaskan');
  const tWorm = wordOf(4, 'ulat');
  const tDie = wordOf(4, 'seketika');

  const pill = win(t, cue(0) + 0.3, cue(5) - 0.6, 0.6, 0.6);
  const strong = win(t, wordOf(0, 'tak'), cue(1) - 0.2, 0.6, 0.6);
  const thur = 0.3 + 0.7 * ramp(t, cue(1) - 0.4, cue(1) + 0.9);
  const doa = ramp(t, cue(4), cue(4) + 1.5) * (1 - 0.5 * ramp(t, cue(5) + 2, cue(5) + 4));
  const lightsOn = ramp(t, cue(1) + 0.4, cue(1) + 2.6);
  const lakeOn = ramp(t, cue(0) + 0.5, cue(0) + 2);
  const lv = 1 - 0.97 * ramp(t, tDrink, tDulu + 0.4, EASE_IN_OUT);
  const dry = 1 - lv;
  const duluNote = win(t, tDulu, cue(3) - 0.2, 0.6, 0.6);
  const swarmOp = 1 - ramp(t, tDie - 0.15, tDie + 0.55, EASE_IN_OUT);
  const shootW = win(t, tShoot - 0.2, cue(4) - 0.5, 0.4, 0.8);
  const skyLabel = win(t, wordOf(3, 'langit'), cue(4) - 0.4, 0.5, 0.6);
  const worms = ramp(t, tWorm - 0.1, tWorm + 1.2);
  const wormFade = 1 - 0.55 * ramp(t, tDie + 1.5, tDie + 4);
  const mag = win(t, tWorm, dur - 1, 0.7, 0.6);
  const small = ramp(t, cue(5) + 0.2, cue(5) + 1.0);
  const ghost = win(t, cue(5) + 0.4, dur - 1, 0.8, 0.6);

  const center = (tt: number) => {
    const a = mix(2160, 1560, ramp(tt, cue(0), cueEnd(0) + 1, EASE_IN_OUT));
    return mix(a, 1230, ramp(tt, cue(2), tDrink + 1, EASE_IN_OUT));
  };
  const spread = mix(260, 360, ramp(t, cue(2), tDrink + 1));
  const dotPos = (i: number): [number, number] => {
    const d = DOTS[i];
    const cx = center(t - d.lag);
    return [cx + d.ox * spread + 9 * Math.sin(t * 1.3 + d.ph), 702 + d.oy * 84 + 5 * Math.sin(t * 1.7 + d.ph * 1.3)];
  };
  const pos = DOTS.map((_, i) => dotPos(i));

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <defs>
          <linearGradient id="ye-mt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c5578" />
            <stop offset="100%" stopColor="#0e1834" />
          </linearGradient>
          <radialGradient id="ye-bed">
            <stop offset="0%" stopColor="#5a4434" />
            <stop offset="100%" stopColor="#2a2024" />
          </radialGradient>
        </defs>
        {/* tanah */}
        <rect x={0} y={GY} width={1920} height={110} fill="url(#ground)" opacity={0.9} />
        <line x1={80} y1={GY} x2={1840} y2={GY} stroke={C.line} strokeWidth={2} />

        {/* Gunung Thur: tempat berlindung yang aman */}
        <g opacity={thur}>
          <Glow x={330} y={650} r={300} color="cyan" opacity={0.35 + 0.45 * doa} />
          <path d="M110,800 C190,700 250,610 300,560 C318,540 342,540 360,560 C410,612 470,700 560,800 Z" fill="url(#ye-mt)" stroke={C.cyan} strokeOpacity={0.55 + 0.3 * doa} strokeWidth={2.5} />
          <path d="M300,560 C318,540 342,540 360,560" fill="none" stroke="#e8f8ff" strokeOpacity={0.5} strokeWidth={4} />
          {LIGHTS.map((l, i) => (
            <Spark key={i} x={l.x + 3 * Math.sin(t * 0.9 + l.ph)} y={l.y + 4 * Math.sin(t * 1.3 + l.ph)} r={3.6} color="cyan" opacity={ramp(lightsOn, i / 16, i / 16 + 0.2) * (0.75 + 0.25 * Math.sin(t * 2 + l.ph))} />
          ))}
          <Stream pts={[[880, 790], [620, 760], [420, 700]]} color="cyan" n={8} speed={0.45} r={4} opacity={win(t, cue(1), cue(2) + 1, 0.5, 0.8) * 0.9} />
          <Stream pts={[[330, 600], [320, 420], [340, 230]]} color="cyan" n={9} speed={0.35} r={4} opacity={win(t, cue(4), cue(5), 0.6, 0.8)} />
          <Label x={330} y={842} size={26} color={C.cyan} opacity={ramp(t, cue(1), cue(1) + 0.8)}>
            Gunung Thur
          </Label>
        </g>
        <Motes x={330} y={650} rx={200} ry={140} n={18} color="cyan" opacity={0.4 * thur} seed={3} />

        {/* Danau Thabariyah → dasar kering retak */}
        <g opacity={lakeOn}>
          <ellipse cx={LX} cy={LY} rx={RX} ry={RY} fill="url(#ye-bed)" opacity={0.25 + 0.75 * dry} />
          {CRACKS.map((d, k) => (
            <DrawPath key={k} d={d} p={ramp(dry, 0.45 + k * 0.03, 0.95)} stroke="#120c10" width={2.4} />
          ))}
          <ellipse cx={LX} cy={LY} rx={RX * Math.sqrt(lv)} ry={RY * Math.sqrt(lv)} fill="url(#water)" opacity={0.92 * Math.min(1, lv * 4)} />
          {[0, 1].map((k) => {
            const q = fr(t * 0.28 + k * 0.5);
            return <ellipse key={k} cx={LX} cy={LY} rx={RX * Math.sqrt(lv) * q} ry={RY * Math.sqrt(lv) * q} fill="none" stroke="#bfe6ff" strokeWidth={1.5} opacity={cyc(q) * 0.6 * Math.min(1, lv * 3)} />;
          })}
          <Label x={LX} y={842} size={24} color={interpolateColors(dry, [0, 1], [C.water, C.muted])} opacity={win(t, cue(2), cue(4), 0.6, 0.8)}>
            danau Thabariyah
          </Label>
        </g>

        {/* kawanan (simbol titik) */}
        <g opacity={swarmOp}>
          {pos.map(([x, y], i) => (x > 1960 ? null : <circle key={i} cx={x} cy={y} r={2.8 + DOTS[i].s * 2.2} fill={C.heat} opacity={0.55 + 0.35 * Math.sin(t * 2.2 + DOTS[i].ph)} />))}
        </g>
        <Glow x={center(t)} y={700} r={320} color="heat" opacity={0.25 * swarmOp * ramp(t, cue(0) + 1, cue(0) + 4)} />

        {/* panah ke langit, kembali kemerahan */}
        <g opacity={shootW}>
          <Glow x={1300} y={250} r={260} color="heat" opacity={0.3 * skyLabel} />
          {Array.from({length: 9}, (_, k) => {
            const u = fr((t - tShoot - k * 0.37) / 3.1);
            if (t < tShoot + k * 0.37) return null;
            const x0 = 1020 + k * 52;
            const y0 = 660;
            const Hh = 430;
            const x = x0 + 50 * u;
            const y = y0 - Hh * Math.sin(Math.PI * u);
            const ang = (Math.atan2(-Hh * Math.PI * Math.cos(Math.PI * u), 50) * 180) / Math.PI;
            const col = interpolateColors(u, [0.45, 0.62], [C.ink, C.heat]);
            return <Shaft key={k} x={x} y={y} ang={ang} col={col} op={Math.min(1, u * 8, (1 - u) * 8)} />;
          })}
        </g>
        <Label x={1330} y={258} size={30} color={C.heat} opacity={skyLabel} italic font="serif">
          “mari kita bunuh penduduk langit”
        </Label>

        {/* ulat-ulat kecil */}
        <g opacity={worms * wormFade}>
          {pos.map(([x, y], i) =>
            i % 3 === 0 ? <path key={i} d={wiggle(x, y - 9, 13, 2.6, t * 9 + i, 6)} fill="none" stroke={C.work} strokeWidth={2.2} strokeLinecap="round" opacity={ramp(worms, (i / N) * 0.6, (i / N) * 0.6 + 0.3)} /> : null,
          )}
        </g>
        <Ripple x={1230} y={700} p={(t - tDie) / 1.6} r={420} color="work" rings={3} />

        {/* kaca pembesar: ulat */}
        <g opacity={mag}>
          <line x1={MAG.x + 70} y1={MAG.y + 70} x2={MAG.x + 170} y2={MAG.y + 200} stroke={C.work} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="5 7" />
          <circle cx={MAG.x} cy={MAG.y} r={MAG.r} fill="#0a1424" fillOpacity={0.85} stroke={C.work} strokeWidth={3} />
          <Glow x={MAG.x} y={MAG.y} r={150} color="work" opacity={0.35} />
          <path d={wiggle(MAG.x, MAG.y, 120, 14, t * 5, 30)} fill="none" stroke={C.work} strokeWidth={9} strokeLinecap="round" />
          <circle cx={MAG.x + 60} cy={MAG.y + 14 * Math.sin(Math.PI * 2 + t * 5)} r={6} fill={C.work} />
          <Label x={MAG.x} y={MAG.y + 136} size={24} color={C.work}>
            ulat-ulat kecil
          </Label>
        </g>
        {/* kontras: kawanan raksasa yang tinggal bayang vs makhluk paling kecil */}
        <g opacity={ghost}>
          <ellipse cx={1230} cy={700} rx={370 + 6 * Math.sin(t)} ry={110} fill="none" stroke={C.heat} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="8 10" strokeDashoffset={-t * 12} />
          <Label x={1230} y={560} size={24} color={C.heat} opacity={0.85}>
            kekuatan tak terkalahkan
          </Label>
        </g>
        <Twinkles x={MAG.x} y={MAG.y} rx={130} ry={110} n={5} color="work" opacity={small} seed={4} />
      </Stage>

      <Badge x={960} y={205} text="HR Muslim" color={C.gold} opacity={pill} scale={0.9 + 0.1 * pill} size={24} />
      <Note x={960} y={300} p={strong} color={C.heat} size={34}>
        “tak seorang pun mampu memerangi mereka”
      </Note>
      <Note x={LX} y={560} p={duluNote} color={C.muted} size={32}>
        “dulu di sini pernah ada air”
      </Note>
      <Note x={1250} y={330} p={small} color={C.work} size={36}>
        dikalahkan oleh <span style={{color: C.work, fontWeight: 700}}>makhluk paling kecil</span>
      </Note>
    </AbsoluteFill>
  );
};
