import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, ramp, rand, win} from '../anim';
import {Badge, Glow, Label, Motes, Note, Ripple, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Renungan (bukan tafsir): QS Yunus 24 — bumi berhias (kota, cahaya, satelit) dan pencapaian manusia (atom, angkasa, gen, mesin pikiran)
// mendorong meter "kekuatan manusia" ke maksimum; panah ke langit (gema kisah Yakjuj Makjuj) sebagai lambang kesombongan.
const G = {x: 900, y: 590, r: 195};
const M = {x: 1590, y0: 780, y1: 320, w: 56};
const fr = (v: number) => ((v % 1) + 1) % 1;
const CITY = Array.from({length: 130}, (_, i) => ({lat: Math.asin(rand(i * 2.3) * 1.7 - 0.85), lon: rand(i * 5.1) * Math.PI * 2, s: rand(i * 8.7)}));
const ICONS = [
  {y: 300, key: 'atom', label: 'membelah atom'},
  {y: 450, key: 'angkasa', label: 'ke luar angkasa'},
  {y: 600, key: 'gen', label: 'mengedit gen'},
  {y: 750, key: 'pikiran', label: 'mesin peniru pikiran'},
];
const IX = 400;

export const Renungan: React.FC<{t: number}> = ({t}) => {
  const p = ramp(t, -0.4, 0.6);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1640,
        top: 190,
        transform: 'translate(-50%, -50%)',
        opacity: p,
        padding: '6px 20px',
        borderRadius: 999,
        border: `1.5px solid ${C.spr}`,
        background: 'rgba(30,16,52,0.82)',
        color: C.spr,
        fontFamily: FONT.head,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: 1,
        whiteSpace: 'nowrap',
        boxShadow: `0 0 ${12 + 8 * Math.sin(t * 1.5)}px ${C.spr}55`,
      }}
    >
      Renungan · bukan tafsir
    </div>
  );
};

const IconArt: React.FC<{k: number; t: number}> = ({k, t}) => {
  if (k === 0)
    return (
      <g>
        <circle r={9} fill={C.heat} />
        {[0, 60, 120].map((a, j) => {
          const e = t * 2.2 + j * 2;
          const ex = 44 * Math.cos(e);
          const ey = 15 * Math.sin(e);
          const r = (a * Math.PI) / 180;
          return (
            <g key={a}>
              <ellipse rx={44} ry={15} fill="none" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={2} transform={`rotate(${a})`} />
              <circle cx={ex * Math.cos(r) - ey * Math.sin(r)} cy={ex * Math.sin(r) + ey * Math.cos(r)} r={4.5} fill={C.pot} />
            </g>
          );
        })}
      </g>
    );
  if (k === 1) {
    const b = 5 * Math.sin(t * 2);
    return (
      <g transform={`translate(0 ${b}) rotate(35)`}>
        <path d="M0,-44 C16,-26 16,10 12,26 L-12,26 C-16,10 -16,-26 0,-44 Z" fill="#dfe8ff" stroke={C.cyan} strokeWidth={2} />
        <circle cy={-10} r={6} fill={C.pot} />
        <path d="M-12,14 L-24,32 L-12,28 Z M12,14 L24,32 L12,28 Z" fill={C.heat} />
        <path d={`M-8,28 Q0,${48 + 8 * Math.sin(t * 14)} 8,28 Z`} fill={C.kin} />
      </g>
    );
  }
  if (k === 2)
    return (
      <g>
        {Array.from({length: 11}, (_, j) => {
          const y = -44 + j * 8.8;
          const a = j * 0.6 + t * 2;
          const x1 = 26 * Math.sin(a);
          const x2 = -x1;
          return (
            <g key={j}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.muted} strokeOpacity={0.5} strokeWidth={2} />
              <circle cx={x1} cy={y} r={4} fill={C.work} opacity={0.6 + 0.4 * Math.cos(a)} />
              <circle cx={x2} cy={y} r={4} fill={C.spr} opacity={0.6 - 0.4 * Math.cos(a)} />
            </g>
          );
        })}
      </g>
    );
  const L = [[-44, [-30, 0, 30]], [0, [-40, -13, 13, 40]], [44, [-20, 20]]] as [number, number[]][];
  const nodes = L.flatMap(([x, ys]) => ys.map((y) => [x, y] as [number, number]));
  const edges: [number, number][][] = [];
  L[0][1].forEach((y0) => L[1][1].forEach((y1) => edges.push([[-44, y0], [0, y1]])));
  L[1][1].forEach((y0) => L[2][1].forEach((y1) => edges.push([[0, y0], [44, y1]])));
  return (
    <g>
      {edges.map((e, j) => (
        <line key={j} x1={e[0][0]} y1={e[0][1]} x2={e[1][0]} y2={e[1][1]} stroke={C.spr} strokeOpacity={0.35} strokeWidth={1.5} />
      ))}
      {edges.map((e, j) => {
        const u = fr(t * 0.8 + rand(j * 3.3));
        return <circle key={`p${j}`} cx={e[0][0] + (e[1][0] - e[0][0]) * u} cy={e[0][1] + (e[1][1] - e[0][1]) * u} r={2.5} fill={C.cyan} opacity={cyc(u)} />;
      })}
      {nodes.map(([x, y], j) => (
        <circle key={`n${j}`} cx={x} cy={y} r={6} fill="#1b2446" stroke={C.spr} strokeWidth={2} />
      ))}
    </g>
  );
};

export const Peak: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  const intro = win(t, cue(0) + 0.2, cue(1) - 0.2, 0.6, 0.6);
  const globe = ramp(t, cue(1) - 0.6, cue(1) + 1.0);
  const pY = win(t, wordOf(1, 'yunus') - 0.3, cue(3), 0.5, 0.6);
  const quote = win(t, cue(2) + 0.2, cue(3) + 0.4, 0.6, 0.6);
  const adorn = ramp(t, wordOf(2, 'keindahannya') - 0.3, wordOf(2, 'berhias') + 1.6);
  const sats = ramp(t, wordOf(2, 'berhias'), wordOf(2, 'berhias') + 1.2);
  const icon = ICONS.map((ic) => ramp(t, wordOf(3, ic.key) - 0.2, wordOf(3, ic.key) + 0.7, BACK));
  const hub = win(t, cue(4) + 0.6, cue(5) + 1.2, 0.5, 0.8);
  const hubLbl = win(t, wordOf(4, 'menaklukkan') - 0.2, cue(5), 0.5, 0.6);
  const strong = ramp(t, cue(5) + 0.4, cue(5) + 1.2);
  const strongHi = ramp(t, wordOf(5, 'kuat') - 0.4, wordOf(5, 'kuat') + 0.4);
  const lvl = Math.min(1, 0.12 + 0.22 * adorn + 0.13 * icon.reduce((a, b) => a + Math.min(1, b), 0) + 0.14 * ramp(t, cue(4) + 0.6, cue(5)));
  const mCol = interpolateColors(lvl, [0.3, 0.75, 1], [C.cyan, C.gold, C.heat]);
  const mTop = M.y0 - (M.y0 - M.y1) * lvl;
  const rot = t * 0.18;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <defs>
          <radialGradient id="pk-g" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="#2f6fb0" />
            <stop offset="60%" stopColor="#123a6e" />
            <stop offset="100%" stopColor="#081631" />
          </radialGradient>
          <linearGradient id="pk-m" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="100%" stopColor={mCol} />
          </linearGradient>
        </defs>

        {/* bumi berhias */}
        <g opacity={globe}>
          <Glow x={G.x} y={G.y} r={G.r * 1.7} color="cyan" opacity={0.35 + 0.3 * adorn} />
          <Glow x={G.x} y={G.y} r={G.r * 1.6} color="heat" opacity={0.35 * strongHi} />
          <circle cx={G.x} cy={G.y} r={G.r} fill="url(#pk-g)" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} />
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const ph = fr(rot / (Math.PI * 2) + k / 6);
            const rx = G.r * Math.abs(Math.cos(ph * Math.PI));
            return <ellipse key={k} cx={G.x} cy={G.y} rx={Math.max(0.5, rx)} ry={G.r} fill="none" stroke="#7fb8ff" strokeOpacity={0.18} strokeWidth={1.2} />;
          })}
          {[-0.6, -0.3, 0, 0.3, 0.6].map((la) => (
            <ellipse key={la} cx={G.x} cy={G.y - G.r * Math.sin(la)} rx={G.r * Math.cos(la)} ry={G.r * Math.cos(la) * 0.12} fill="none" stroke="#7fb8ff" strokeOpacity={0.16} strokeWidth={1.2} />
          ))}
          {CITY.map((c, i) => {
            const lon = c.lon + rot;
            const z = Math.cos(c.lat) * Math.cos(lon);
            if (z < 0.05) return null;
            const x = G.x + G.r * Math.cos(c.lat) * Math.sin(lon);
            const y = G.y - G.r * Math.sin(c.lat);
            const on = ramp(adorn, c.s * 0.7, c.s * 0.7 + 0.3);
            return <circle key={i} cx={x} cy={y} r={1.6 + 1.6 * z} fill={i % 4 === 0 ? C.cyan : C.gold} opacity={on * Math.min(1, z * 3) * (0.6 + 0.4 * Math.sin(t * 3 + i))} />;
          })}
          {/* satelit */}
          {[0, 1, 2].map((k) => {
            const a = t * (0.5 + k * 0.15) + k * 2.1;
            const tilt = [-18, 12, 30][k];
            const rx = G.r + 50 + k * 26;
            const ry = 44 + k * 10;
            const ex = rx * Math.cos(a);
            const ey = ry * Math.sin(a);
            const r = (tilt * Math.PI) / 180;
            const x = G.x + ex * Math.cos(r) - ey * Math.sin(r);
            const y = G.y + ex * Math.sin(r) + ey * Math.cos(r);
            return (
              <g key={k} opacity={sats}>
                <ellipse cx={G.x} cy={G.y} rx={rx} ry={ry} fill="none" stroke={C.gold} strokeOpacity={0.2} strokeWidth={1.2} transform={`rotate(${tilt} ${G.x} ${G.y})`} strokeDasharray="3 7" />
                <g transform={`translate(${x} ${y}) rotate(${tilt})`} opacity={0.775 + 0.225 * Math.sin(a)}>
                  <rect x={-14} y={-3} width={10} height={6} fill={C.pot} />
                  <rect x={4} y={-3} width={10} height={6} fill={C.pot} />
                  <rect x={-4} y={-5} width={8} height={10} rx={2} fill="#e8eeff" />
                </g>
              </g>
            );
          })}
        </g>
        <Motes x={G.x} y={G.y} rx={300} ry={260} n={22} color="gold" opacity={0.4 * globe} seed={5} />

        {/* pencapaian manusia */}
        {ICONS.map((ic, k) => {
          const p = icon[k];
          if (p <= 0.001) return null;
          return (
            <g key={ic.key} opacity={Math.min(1, p)}>
              <Stream pts={[[IX + 70, ic.y], [G.x - G.r - 20, G.y + (ic.y - G.y) * 0.5]]} color="gold" n={5} speed={0.5} r={3.5} opacity={0.6} seed={k} />
              <g transform={`translate(${IX} ${ic.y}) scale(${0.85 + 0.15 * Math.min(1, p)})`}>
                <circle r={56} fill="#0d1430" fillOpacity={0.85} stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} />
                <g transform="scale(0.85)">
                  <IconArt k={k} t={t} />
                </g>
              </g>
              <Label x={IX - 80} y={ic.y} size={22} color={C.muted} anchor="end">
                {ic.label}
              </Label>
            </g>
          );
        })}

        {/* panah ke langit: kesombongan */}
        <g opacity={hub}>
          {Array.from({length: 7}, (_, k) => {
            const u = fr((t - cue(4) - k * 0.33) / 2.2);
            if (t < cue(4) + k * 0.33) return null;
            const x = G.x - 120 + k * 40 + 20 * u;
            const y = G.y - G.r - 10 - u * 160;
            return (
              <g key={k} opacity={Math.min(1, u * 6, (1 - u) * 4)}>
                <line x1={x} y1={y + 30} x2={x} y2={y} stroke={C.heat} strokeWidth={3} strokeLinecap="round" />
                <path d={`M${x - 7},${y + 2} L${x},${y - 12} L${x + 7},${y + 2} Z`} fill={C.heat} />
              </g>
            );
          })}
        </g>
        <Label x={G.x + 280} y={300} size={28} color={C.heat} opacity={hubLbl} italic font="serif">
          “menaklukkan langit”
        </Label>

        {/* meter kekuatan manusia */}
        <g opacity={globe}>
          <Label x={M.x} y={M.y1 - 42} size={22} color={C.muted}>
            kekuatan manusia
          </Label>
          <rect x={M.x - M.w / 2} y={M.y1} width={M.w} height={M.y0 - M.y1} rx={14} fill="#0d1430" stroke={C.line} strokeWidth={2} />
          <rect x={M.x - M.w / 2 + 5} y={mTop} width={M.w - 10} height={M.y0 - mTop - 5} rx={10} fill="url(#pk-m)" />
          {Array.from({length: 4}, (_, k) => {
            const u = fr(t * 0.5 + k / 4);
            return <circle key={k} cx={M.x - 10 + k * 7} cy={M.y0 - 10 - u * (M.y0 - mTop - 20)} r={2.5} fill="#fff" opacity={cyc(u) * 0.6} />;
          })}
          {[0.25, 0.5, 0.75].map((q) => (
            <line key={q} x1={M.x + M.w / 2 + 4} y1={M.y0 - (M.y0 - M.y1) * q} x2={M.x + M.w / 2 + 14} y2={M.y0 - (M.y0 - M.y1) * q} stroke={C.muted} strokeWidth={2} />
          ))}
          <Label x={M.x + M.w / 2 + 22} y={M.y1 + 6} size={20} color={C.heat} anchor="start" font="mono" opacity={0.5 + 0.5 * strongHi}>
            MAKS
          </Label>
          <Glow x={M.x} y={mTop} r={70} color="heat" opacity={strongHi} />
          <Ripple x={M.x} y={M.y1} p={(t - wordOf(5, 'kuat') + 0.3) / 1.4} r={160} color="heat" rings={3} />
        </g>
        <Twinkles x={G.x} y={G.y} rx={240} ry={220} n={5} color="gold" opacity={adorn * 0.7} seed={2} />
      </Stage>

      <Renungan t={t} />
      <Note x={960} y={360} p={intro} color={C.spr} size={38}>
        bagian ini: <span style={{color: C.spr}}>pemikiran, bukan tafsir</span>
      </Note>
      <Badge x={G.x} y={205} text="QS Yunus 24" color={C.gold} opacity={pY} scale={0.9 + 0.1 * pY} size={24} />
      <Note x={G.x} y={285} p={quote} color={C.gold} size={27}>
        “…bumi berhias, dan penduduknya <span style={{color: C.gold}}>mengira benar-benar menguasainya</span>”
      </Note>
      <Note x={980} y={290} p={strong} color={C.heat} size={44}>
        zaman ketika manusia <span style={{color: C.heat, textShadow: `0 0 ${20 * strongHi}px ${C.heat}`}}>merasa paling kuat</span>
      </Note>
    </AbsoluteFill>
  );
};
