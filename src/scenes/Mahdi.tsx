import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Al-Mahdi (Abu Dawud 4282–4285, Tirmidzi 2230): tanpa sosok — hanya cahaya emas yang naik di atas peta Jazirah Arab.
// Baris 2: timbangan dari "kezaliman" ke "keadilan". Baris 3: banyak "mahkota" pengakuan dicoret.

const slot = (t: number, a: number, b: number, fi = 0.5, fo = 0.45) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
const Pill: React.FC<{x: number; y: number; p: number; text: string}> = ({x, y, p, text}) => (
  <Badge x={x} y={y} text={text} color={C.gold} opacity={p} scale={0.9 + 0.1 * p} size={27} />
);

// Peta sederhana Jazirah Arab (lon, lat) → px
const K = 23;
const geo = (lon: number, lat: number): [number, number] => [300 + (lon - 34) * K, 250 + (32.5 - lat) * K];
const ARABIA: [number, number][] = [
  [34.9, 29.5], [35.0, 28.1], [36.6, 26], [38.4, 23.8], [39.2, 21.5], [41.2, 18.5], [42.7, 15.5], [43.4, 12.6], [45, 12.8], [48.7, 14], [52, 15.8], [55, 17.2],
  [57, 18.8], [58.5, 20.5], [59.8, 22.5], [58.6, 23.6], [56.4, 24.5], [56.2, 26.2], [54, 24.1], [51.5, 24.5], [51.6, 25.9], [50.6, 25], [50, 26.6], [48.5, 28],
  [48, 29.3], [47.5, 30.5], [44, 31.6], [39, 32.2], [36.5, 31.6],
];
const AFRICA: [number, number][] = [
  [34.2, 31.3], [34.9, 29.5], [34.2, 27.8], [33.5, 27.6], [35.5, 23.9], [37.3, 21], [38.6, 17.9], [39.7, 15.3], [41.5, 13.5], [43.3, 12.4], [44, 11.2],
];
const polyD = (pts: [number, number][], close = true) => pts.map(([lo, la], i) => `${i ? 'L' : 'M'}${geo(lo, la)[0].toFixed(1)},${geo(lo, la)[1].toFixed(1)}`).join(' ') + (close ? ' Z' : '');
const AR_D = polyD(ARABIA);
const AF_D = polyD(AFRICA, false);

const Crown: React.FC<{x: number; y: number; s?: number; color: string; op: number}> = ({x, y, s = 1, color, op}) =>
  op <= 0.001 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      <path d="M-46,26 L-50,-22 L-24,4 L0,-34 L24,4 L50,-22 L46,26 Z" fill={color} fillOpacity={0.22} stroke={color} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={-48} y={26} width={96} height={14} rx={4} fill={color} fillOpacity={0.4} stroke={color} strokeWidth={2.5} />
      {[-50, 0, 50].map((gx, i) => (
        <circle key={i} cx={gx} cy={i === 1 ? -34 : -22} r={6} fill={color} />
      ))}
    </g>
  );

export const Mahdi: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- baris 0–1: peta + cahaya emas ----------
  const mapOp = ramp(t, -0.3, 1.0) * (1 - ramp(t, cue(2) - 0.6, cue(2) + 0.2, EASE_IN_OUT));
  const rise = ramp(t, 0.6, wordOf(0, 'mahdi') + 0.6, EASE_IN_OUT);
  const [hx, hy] = geo(40.2, 23.2);
  const orbY = mix(hy + 10, 330, rise) + 6 * Math.sin(t * 1.3);
  const nameP = ramp(t, wordOf(0, 'mahdi') - 0.2, wordOf(0, 'mahdi') + 0.6, BACK);
  const notes = [
    {k: 'keluargaku', txt: 'dari keluarga Nabi'},
    {k: 'namanya', txt: 'namanya seperti nama Nabi'},
    {k: 'memimpin', txt: 'memimpin bangsa Arab'},
  ].map((n) => ({...n, p: ramp(t, wordOf(1, n.k) - 0.3, wordOf(1, n.k) + 0.5)}));
  const pill = ramp(t, wordOf(1, 'riwayat') - 0.3, wordOf(1, 'riwayat') + 0.4);

  // ---------- baris 2: timbangan ----------
  const balOn = slot(t, cue(2) - 0.3, cue(3) + 0.2, 0.7, 0.6);
  const tk = wordOf(2, 'keadilan');
  const A0 = 15;
  const dk = t - tk;
  const ang = dk < 0 ? A0 + 1.5 * Math.sin(t * 1.4) : A0 * Math.exp(-1.6 * dk) * Math.cos(3.2 * dk) + 1.5 * Math.sin(t * 1.4) * Math.exp(-3 * dk);
  const just = ramp(t, tk - 0.2, tk + 1.6);
  const zalimP = ramp(t, wordOf(2, 'kezaliman') - 0.3, wordOf(2, 'kezaliman') + 0.4);
  const PX = 960;
  const PY = 340;
  const L = 300;
  const rad = (ang * Math.PI) / 180;
  const ends = [-1, 1].map((s) => [PX + s * L * Math.cos(rad), PY + s * L * Math.sin(rad)] as [number, number]);

  // ---------- baris 3: klaim dicoret ----------
  const c3 = cue(3);
  const crownsOn = ramp(t, c3 - 0.3, c3 + 0.6);
  const NC = 7;
  const crownX = (i: number) => 330 + (i * 1260) / (NC - 1);
  const crossA = wordOf(3, 'mengingatkan') - 0.4;
  const note1 = ramp(t, wordOf(3, 'dikenal') - 0.4, wordOf(3, 'dikenal') + 0.4);
  const note2 = ramp(t, wordOf(3, 'diperintah') - 0.3, wordOf(3, 'diperintah') + 0.5);

  return (
    <AbsoluteFill>
      <Stage>
        {/* peta */}
        {mapOp > 0.001 ? (
          <g opacity={mapOp} transform={`translate(0 ${4 * Math.sin(t * 0.5)})`}>
            <path d={AF_D} fill="none" stroke="#4a5a8a" strokeWidth={2} strokeDasharray="6 6" opacity={0.6} />
            <path d={AR_D} fill="#14204a" stroke="#7f90c4" strokeWidth={2.5} strokeLinejoin="round" />
            <path d={AR_D} fill="url(#soft-gold)" opacity={0.25 + 0.5 * rise} />
            {Array.from({length: 7}, (_, i) => {
              const ph = (t * 0.12 + i / 7) % 1;
              return <path key={i} d={`M${400 + i * 80},${520 + ph * 30} q20,-8 40,0 t40,0`} fill="none" stroke="#3a4b80" strokeWidth={1.5} opacity={cyc(ph) * 0.6} />;
            })}
            <Label x={geo(46, 22)[0]} y={geo(46, 22)[1]} size={24} color={C.muted} italic font="serif">
              Jazirah Arab
            </Label>
            {/* berkas cahaya */}
            <rect x={hx - 24} y={orbY} width={48} height={hy - orbY + 10} fill={C.gold} opacity={0.12 * rise} rx={24} />
            <Glow x={hx} y={orbY} r={180} color="gold" opacity={0.9 * rise + 0.2} />
            {Array.from({length: 12}, (_, i) => {
              const a = t * 0.25 + (i * Math.PI) / 6;
              const r1 = 34;
              const r2 = 62 + 10 * Math.sin(t * 2 + i);
              return <line key={i} x1={hx + Math.cos(a) * r1} y1={orbY + Math.sin(a) * r1} x2={hx + Math.cos(a) * r2} y2={orbY + Math.sin(a) * r2} stroke={C.gold} strokeWidth={3} strokeLinecap="round" opacity={0.5 * rise} />;
            })}
            <circle cx={hx} cy={orbY} r={22} fill={C.gold} opacity={0.4 + 0.6 * rise} />
            <circle cx={hx} cy={orbY} r={11} fill="#fff8e0" />
            {Array.from({length: 8}, (_, i) => {
              const ph = (t * 0.4 + i / 8) % 1;
              return <circle key={i} cx={hx + 40 * Math.sin(i * 2.3 + t)} cy={hy - ph * (hy - orbY)} r={3} fill={C.gold} opacity={cyc(ph) * rise} />;
            })}
            <Ripple x={hx} y={orbY} p={ramp(t, wordOf(0, 'mahdi') - 0.1, wordOf(0, 'mahdi') + 1.6)} r={220} color="gold" />
            <Label x={hx} y={orbY - 92} size={52} color={C.gold} weight={600} opacity={nameP}>
              Al-Mahdi
            </Label>
            <Motes x={hx} y={orbY + 60} rx={240} ry={200} n={26} color="gold" opacity={0.5} />
          </g>
        ) : null}

        {/* timbangan */}
        {balOn > 0.001 ? (
          <g opacity={balOn}>
            <Glow x={ends[1][0]} y={ends[1][1] + 170} r={200} color="gold" opacity={just} />
            <Glow x={ends[0][0]} y={ends[0][1] + 170} r={180} color="heat" opacity={0.6 * (1 - just)} />
            <path d={`M${PX - 120},720 L${PX + 120},720 L${PX + 40},690 L${PX + 14},${PY} L${PX - 14},${PY} L${PX - 40},690 Z`} fill="#1c2850" stroke={C.gold} strokeWidth={2} strokeOpacity={0.6} />
            <line x1={ends[0][0]} y1={ends[0][1]} x2={ends[1][0]} y2={ends[1][1]} stroke={C.gold} strokeWidth={9} strokeLinecap="round" />
            <circle cx={PX} cy={PY} r={16} fill={C.gold} />
            <circle cx={PX} cy={PY} r={6} fill="#fff8e0" />
            {ends.map(([ex, ey], s) => {
              const py = ey + 170;
              return (
                <g key={s}>
                  <path d={`M${ex},${ey} L${ex - 90},${py} M${ex},${ey} L${ex + 90},${py}`} stroke="#c9a85a" strokeWidth={2} opacity={0.8} />
                  <path d={`M${ex - 110},${py} Q${ex},${py + 70} ${ex + 110},${py} Z`} fill="#1a2550" stroke={C.gold} strokeWidth={3} />
                  {s === 0
                    ? Array.from({length: 6}, (_, i) => (
                        <rect key={i} x={ex - 60 + (i % 3) * 40} y={py - 26 - Math.floor(i / 3) * 26 + 6 * just * Math.sin(t * 3 + i)} width={34} height={22} rx={3} fill="#4a1622" stroke={C.heat} strokeWidth={2} opacity={1 - 0.75 * just} />
                      ))
                    : Array.from({length: 14}, (_, i) => {
                        const q = ramp(t, tk + i * 0.08, tk + 0.6 + i * 0.08);
                        return <Spark key={i} x={ex - 70 + (i % 7) * 23} y={py - 14 - Math.floor(i / 7) * 22 + 3 * Math.sin(t * 2 + i)} r={5} color="gold" opacity={q} />;
                      })}
                  <Label x={ex} y={py + 72} size={34} weight={600} color={s === 0 ? C.heat : C.gold} opacity={s === 0 ? (0.45 + 0.55 * zalimP) * (1 - 0.45 * just) : 0.4 + 0.6 * just}>
                    {s === 0 ? 'kezaliman' : 'keadilan'}
                  </Label>
                </g>
              );
            })}
            <Ripple x={PX} y={PY} p={ramp(t, tk, tk + 1.5)} r={260} color="gold" />
            <Twinkles x={ends[1][0]} y={ends[1][1] + 140} rx={120} ry={60} n={5} color="gold" opacity={just} />
          </g>
        ) : null}

        {/* mahkota pengakuan */}
        {crownsOn > 0.001 ? (
          <g opacity={crownsOn}>
            <line x1={240} y1={520} x2={1680} y2={520} stroke={C.gold} strokeWidth={2} opacity={0.5} />
            <Label x={240} y={556} size={22} color={C.muted} anchor="start">
              sepanjang sejarah →
            </Label>
            {Array.from({length: NC}, (_, i) => {
              const x = crownX(i);
              const a = ramp(t, c3 + 0.3 + i * 0.45, c3 + 0.9 + i * 0.45, BACK);
              const xp = ramp(t, crossA + i * 0.22, crossA + 0.5 + i * 0.22);
              const y = 420 + 6 * Math.sin(t * 1.3 + i) + 14 * xp;
              return (
                <g key={i}>
                  <line x1={x} y1={512} x2={x} y2={528} stroke={C.gold} strokeWidth={2} opacity={0.6 * a} />
                  <Glow x={x} y={y} r={90} color="spr" opacity={0.5 * a * (1 - 0.7 * xp)} />
                  <Crown x={x} y={y} s={0.6 + 0.4 * a} color={C.spr} op={a * (1 - 0.55 * xp)} />
                  <Label x={x} y={y - 64} size={20} color={C.spr} opacity={a * (1 - 0.6 * xp)} italic font="serif">
                    “akulah Mahdi”
                  </Label>
                  <DrawPath d={`M${x - 52},${y - 44} L${x + 52},${y + 46}`} p={ramp(t, crossA + i * 0.22, crossA + 0.25 + i * 0.22)} stroke={C.heat} width={6} />
                  <DrawPath d={`M${x + 52},${y - 44} L${x - 52},${y + 46}`} p={ramp(t, crossA + 0.12 + i * 0.22, crossA + 0.37 + i * 0.22)} stroke={C.heat} width={6} />
                  {xp > 0 && xp < 1 ? <Ripple x={x} y={y} p={xp} r={90} color="heat" rings={2} /> : null}
                </g>
              );
            })}
          </g>
        ) : null}
      </Stage>

      {notes.map((n, i) => (
        <Note key={n.k} x={1150} y={360 + i * 105} p={n.p * mapOp} color={C.gold} anchor="left" size={34}>
          {n.txt}
        </Note>
      ))}
      <Pill x={1400} y={700} p={pill * mapOp} text="HR Abu Dawud & Tirmidzi" />
      <Note x={960} y={668} p={note1 * crownsOn} color={C.cyan} size={40}>
        Mahdi <span style={{color: C.cyan}}>tidak dikenal karena pengakuannya</span>
      </Note>
      <Note x={960} y={790} p={note2 * crownsOn} color={C.muted} size={28}>
        umat tidak diperintah untuk mencari-carinya
      </Note>
    </AbsoluteFill>
  );
};
