import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, pathOf, ramp, rand, win} from '../anim';
import {Badge, Glow, Label, Motes, Note, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Angin lembut (Muslim 2937/2940) → sisa manusia terburuk → api dari Yaman (Muslim 2901) → dua tiupan sangkakala (QS Az-Zumar 68)
// → kebangkitan, hisab, mizan, kekekalan. Semuanya simbol: titik, cahaya, cincin kejut, ikon.
const GY = 760;
const HORN = {x: 960, y: 300};
const fr = (v: number) => ((v % 1) + 1) % 1;
const PEOPLE = Array.from({length: 72}, (_, i) => ({
  x: 170 + rand(i * 2.1) * 1580,
  y: GY - 12 - rand(i * 4.7) * 70,
  b: i % 3 === 0,
  ph: rand(i * 7.3) * 6.28,
  lag: rand(i * 5.9) * 3,
  ox: rand(i * 8.1) * 2 - 1,
  oy: rand(i * 3.9) * 2 - 1,
}));
const RISE = Array.from({length: 46}, (_, i) => ({x: 200 + rand(i * 6.6) * 1520, y: GY - 10 - rand(i * 2.2) * 40, lag: rand(i * 4.4) * 1.6, h: 70 + rand(i * 9.9) * 120, ph: rand(i) * 6.28}));
const ICONS = [
  {x: 480, key: 'kebangkitan', label: 'kebangkitan', hue: 'cyan' as const},
  {x: 800, key: 'perhitungan', label: 'hisab', hue: 'gold' as const},
  {x: 1120, key: 'timbangan', label: 'mizan', hue: 'gold' as const},
  {x: 1440, key: 'kehidupan', label: 'kekal (∞)', hue: 'work' as const},
];
const IY = 470;

const infPts = (n = 60): [number, number][] =>
  Array.from({length: n + 1}, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const d = 1 + Math.sin(a) ** 2;
    return [(56 * Math.cos(a)) / d, (56 * Math.sin(a) * Math.cos(a)) / d];
  });
const INF = infPts();

const Icon: React.FC<{k: number; t: number}> = ({k, t}) => {
  if (k === 0)
    return (
      <g>
        <line x1={0} y1={40} x2={0} y2={-38} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" markerEnd="url(#arrow-cyan)" />
        {[0, 1, 2, 3].map((j) => {
          const u = fr(t * 0.5 + j / 4);
          return <circle key={j} cx={(j - 1.5) * 22} cy={44 - u * 80} r={4} fill={C.cyan} opacity={cyc(u)} />;
        })}
        <line x1={-46} y1={48} x2={46} y2={48} stroke={C.muted} strokeWidth={3} />
      </g>
    );
  if (k === 1)
    return (
      <g>
        <rect x={-40} y={-50} width={80} height={100} rx={8} fill="#1b2446" stroke={C.gold} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((j) => {
          const w = 56 * ramp(fr(t * 0.25), j * 0.15, j * 0.15 + 0.15);
          return <line key={j} x1={-28} y1={-30 + j * 15} x2={-28 + w} y2={-30 + j * 15} stroke={C.gold} strokeWidth={3} strokeLinecap="round" opacity={0.85} />;
        })}
      </g>
    );
  if (k === 2) {
    const tilt = 9 * Math.sin(t * 1.1);
    const r = (tilt * Math.PI) / 180;
    const lx = -52 * Math.cos(r);
    const ly = -52 * Math.sin(r) - 22;
    return (
      <g>
        <line x1={0} y1={-34} x2={0} y2={46} stroke={C.gold} strokeWidth={4} />
        <path d="M-26,48 L26,48" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
        <line x1={lx} y1={ly} x2={-lx} y2={-ly - 44} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
        <circle cx={0} cy={-36} r={6} fill={C.gold} />
        {[1, -1].map((sd) => {
          const px = sd * 52 * Math.cos(r);
          const py = sd * 52 * Math.sin(r) - 22;
          return <path key={sd} d={`M${px - 20},${py + 22} L${px},${py} L${px + 20},${py + 22} Z`} fill={C.gold} fillOpacity={0.35} stroke={C.gold} strokeWidth={2} />;
        })}
      </g>
    );
  }
  const ph = fr(t * 0.3);
  const i = Math.floor(ph * (INF.length - 1));
  const [sx, sy] = INF[i];
  return (
    <g>
      <path d={pathOf(INF)} fill="none" stroke={C.work} strokeWidth={6} strokeLinecap="round" />
      <Spark x={sx} y={sy} r={6} color="work" />
    </g>
  );
};

export const Final: React.FC = () => {
  const {t, cue, cueEnd, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  const wind = win(t, cue(0) - 0.4, cue(1) + 1, 0.8, 1.2);
  const tLift = wordOf(0, 'mencabut');
  const sawi = win(t, wordOf(0, 'bahkan'), cue(1) + 0.2, 0.6, 0.6);
  const dark = ramp(t, cue(1) - 0.2, cue(1) + 1.5);
  const remain = win(t, cue(1) + 0.3, cue(2), 0.6, 0.6);
  const pM = win(t, wordOf(1, 'muslim') - 0.3, cue(2) + 1, 0.5, 0.6);
  const fireX = mix(-60, 1050, ramp(t, cue(2) - 0.3, cueEnd(2) + 0.8, EASE_IN_OUT));
  const tB1 = wordOf(3, 'ditiup');
  const tB2 = wordOf(3, 'sekali');
  const fireOp = win(t, cue(2) - 0.4, tB1, 0.5, 0.6);
  const gather = ramp(t, wordOf(2, 'menggiring'), cueEnd(2) + 1, EASE_IN_OUT);
  const silence = ramp(t, tB1 + 0.1, tB1 + 1.0, EASE_IN_OUT) * (1 - ramp(t, tB2, tB2 + 1));
  const peopleOp = 1 - ramp(t, tB1 + 0.1, tB1 + 0.9, EASE_IN_OUT);
  const horn = win(t, cue(3) - 0.5, cue(4) - 0.2, 0.6, 0.7);
  const pZ = win(t, wordOf(3, 'zumar') - 0.3, cue(4) + 0.8, 0.5, 0.6);
  const risen = ramp(t, tB2, tB2 + 2.2);
  const risenFade = 1 - 0.6 * ramp(t, cue(4), cue(4) + 1);
  const yemen = win(t, cue(2) - 0.2, tB1, 0.6, 0.6);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <rect x={0} y={GY} width={1920} height={120} fill="url(#ground)" />
        <line x1={80} y1={GY} x2={1840} y2={GY} stroke={C.line} strokeWidth={2} />

        {/* angin lembut: garis-garis arus */}
        <g opacity={wind}>
          {Array.from({length: 12}, (_, k) => {
            const u = fr(t * 0.18 + k / 12);
            const y0 = 380 + rand(k * 3.3) * 330;
            const x0 = -300 + u * 2400;
            const pts = Array.from({length: 14}, (_, j) => [x0 + j * 20, y0 + 10 * Math.sin(j * 0.45 + t * 1.6 + k)] as [number, number]);
            return <path key={k} d={pathOf(pts)} fill="none" stroke="#cfefff" strokeWidth={2} strokeLinecap="round" opacity={cyc(u) * 0.45} />;
          })}
        </g>

        {/* manusia: cahaya toska (orang beriman) diangkat angin; sisanya titik redup */}
        <g opacity={peopleOp}>
          {PEOPLE.map((p, i) => {
            const bob = 2 * Math.sin(t * 1.5 + p.ph);
            if (p.b) {
              const lp = ramp(t, tLift + p.lag, tLift + p.lag + 3.4, EASE_IN_OUT);
              if (lp >= 1) return null;
              const x = p.x + 80 * lp + 18 * Math.sin(t * 1.2 + p.ph) * lp;
              const y = p.y - 520 * lp + bob;
              return <Spark key={i} x={x} y={y} r={4 + 1.5 * lp} color="cyan" opacity={1 - ramp(lp, 0.65, 1)} trail={lp > 0.05 ? [1, 2, 3].map((q) => [x - 6 * q * lp, y + 14 * q * lp] as [number, number]) : undefined} />;
            }
            let x = mix(p.x, 1460 + p.ox * 170, gather);
            const y = mix(p.y, GY - 40 + p.oy * 28, gather) + bob;
            x = Math.max(x, fireX + 70 + 30 * p.oy);
            const col = interpolateColors(dark, [0, 1], [C.muted, '#6a5a6e']);
            return <circle key={i} cx={x + 3 * Math.sin(t * 2 + p.ph) * gather} cy={y} r={4.5} fill={col} opacity={0.85} />;
          })}
        </g>
        <Label x={960} y={810} size={24} color={C.muted} opacity={remain}>
          yang tersisa: manusia-manusia terburuk
        </Label>

        {/* api dari Yaman (selatan) */}
        <g opacity={fireOp}>
          <Glow x={fireX - 80} y={GY - 80} r={280} color="kin" opacity={0.7} />
          {Array.from({length: 22}, (_, k) => {
            const u = fr(t * 1.4 + rand(k) );
            const x = fireX - 260 + (k / 22) * 300 + 6 * Math.sin(t * 5 + k);
            const h = (60 + 90 * rand(k * 2.7)) * (0.6 + 0.4 * Math.sin(Math.PI * u));
            const col = k % 3 === 0 ? C.force : k % 3 === 1 ? C.kin : C.heat;
            return <path key={k} d={`M${x - 14},${GY} Q${x - 10},${GY - h * 0.5} ${x + 4 * Math.sin(t * 6 + k)},${GY - h} Q${x + 10},${GY - h * 0.5} ${x + 14},${GY} Z`} fill={col} opacity={0.55 + 0.3 * Math.sin(t * 4 + k)} />;
          })}
          {Array.from({length: 10}, (_, k) => {
            const u = fr(t * 0.6 + k / 10);
            return <circle key={k} cx={fireX - 120 + rand(k * 5.5) * 160 + 20 * u} cy={GY - 60 - u * 200} r={2.5} fill={C.force} opacity={cyc(u) * 0.8} />;
          })}
        </g>
        <g opacity={yemen}>
          <Label x={260} y={560} size={26} color={C.kin} weight={600}>
            api dari Yaman (selatan)
          </Label>
          <circle cx={1460} cy={GY - 40} r={190 + 6 * Math.sin(t * 1.5)} fill="none" stroke={C.muted} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 9" strokeDashoffset={-t * 10} />
          <Label x={1460} y={540} size={24} color={C.muted}>
            tempat berkumpul
          </Label>
        </g>

        {/* hening setelah tiupan pertama */}
        <rect x={0} y={0} width={1920} height={1080} fill="#03050c" opacity={0.45 * silence} />
        <g opacity={silence}>
          <path d={pathOf(Array.from({length: 60}, (_, j) => [560 + j * 13.5, 600 + 3 * Math.sin(j * 0.7 + t * 2) * Math.exp(-((j - 30) ** 2) / 60)] as [number, number]))} fill="none" stroke={C.muted} strokeWidth={2} opacity={0.6} />
          <Label x={960} y={650} size={24} color={C.muted} font="mono" spacing={6}>
            hening
          </Label>
        </g>

        {/* sangkakala: simbol tanduk + cincin kejut */}
        <g opacity={horn}>
          <Glow x={HORN.x} y={HORN.y} r={160} color="gold" opacity={0.5} />
          <path d={`M${HORN.x - 90},${HORN.y + 8} Q${HORN.x - 10},${HORN.y + 14} ${HORN.x + 60},${HORN.y - 40} L${HORN.x + 74},${HORN.y + 44} Q${HORN.x},${HORN.y + 26} ${HORN.x - 90},${HORN.y + 22} Z`} fill={C.gold} fillOpacity={0.8} stroke="#fff3c8" strokeWidth={2} />
          <ellipse cx={HORN.x + 67} cy={HORN.y + 2} rx={12} ry={43} fill="#fff3c8" opacity={0.7} />
          <Ripple x={HORN.x + 70} y={HORN.y} p={(t - tB1) / 2.4} r={1150} color="gold" rings={5} width={5} />
          <Ripple x={HORN.x + 70} y={HORN.y} p={(t - tB2) / 2.4} r={1150} color="cyan" rings={5} width={5} />
        </g>
        <Label x={HORN.x} y={HORN.y + 90} size={24} color={C.gold} opacity={win(t, tB1 - 0.2, tB2 - 0.4, 0.4, 0.5)}>
          tiupan pertama
        </Label>
        <Label x={HORN.x} y={HORN.y + 90} size={24} color={C.cyan} opacity={win(t, tB2 - 0.2, cue(4) - 0.3, 0.4, 0.5)}>
          tiupan kedua · bangkit
        </Label>

        {/* bangkit kembali */}
        <g opacity={risen * risenFade}>
          {RISE.map((r, i) => {
            const p = ramp(t, tB2 + r.lag, tB2 + r.lag + 1.8, EASE_IN_OUT);
            const y = mix(GY, r.y - r.h * 0.4, p) + 5 * Math.sin(t * 1.3 + r.ph);
            return <Spark key={i} x={r.x} y={y} r={3.6} color="cyan" opacity={p * (0.7 + 0.3 * Math.sin(t * 2 + r.ph))} />;
          })}
        </g>

        {/* kebangkitan · hisab · mizan · kekekalan */}
        {ICONS.map((ic, k) => {
          const p = ramp(t, wordOf(4, ic.key) - 0.2, wordOf(4, ic.key) + 0.7, BACK);
          if (p <= 0.001) return null;
          return (
            <g key={ic.key} opacity={Math.min(1, p)} transform={`translate(${ic.x} ${IY + 4 * Math.sin(t * 1.1 + k)}) scale(${0.85 + 0.15 * p})`}>
              <Glow x={0} y={0} r={150} color={ic.hue} opacity={0.4} />
              <circle r={92} fill="#0d1430" fillOpacity={0.85} stroke={C[ic.hue]} strokeWidth={3} />
              <circle r={104} fill="none" stroke={C[ic.hue]} strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="4 8" strokeDashoffset={-t * 10} />
              <Icon k={k} t={t} />
              <text y={140} textAnchor="middle" fontFamily={FONT.head} fontSize={30} fontWeight={600} fill={C[ic.hue]}>
                {ic.label}
              </text>
            </g>
          );
        })}
        {[0, 1, 2].map((k) => (
          <line key={k} x1={ICONS[k].x + 110} y1={IY} x2={ICONS[k + 1].x - 110} y2={IY} stroke={C.gold} strokeOpacity={0.5 * ramp(t, wordOf(4, ICONS[k + 1].key) - 0.2, wordOf(4, ICONS[k + 1].key) + 0.5)} strokeWidth={2} strokeDasharray="4 8" strokeDashoffset={-t * 18} />
        ))}
        <Twinkles x={1440} y={IY} rx={140} ry={100} n={5} color="work" opacity={ramp(t, wordOf(4, 'kehidupan'), wordOf(4, 'kehidupan') + 1)} seed={8} />
        <Motes x={960} y={500} rx={800} ry={300} n={22} color="cyan" opacity={0.3} seed={21} />
      </Stage>

      <Note x={1440} y={300} p={sawi} color={C.cyan} size={30}>
        bahkan iman <span style={{color: C.cyan}}>seberat biji sawi</span>
      </Note>
      <Badge x={960} y={205} text="HR Muslim" color={C.gold} opacity={pM} scale={0.9 + 0.1 * pM} size={24} />
      <Badge x={1320} y={215} text="QS Az-Zumar 68" color={C.gold} opacity={pZ} scale={0.9 + 0.1 * pZ} size={24} />
    </AbsoluteFill>
  );
};
