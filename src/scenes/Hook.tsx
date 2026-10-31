import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath} from '../anim';
import {DrawPath, Glow, Label, Motes, Ripple, Spark, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Pembuka "Dunia yang berlari" (semua gerak analitik per frame):
// (A) satu abad dipercepat: desa (gubuk) → kota menara; kabar dibawa titik pelan berhari-hari (matahari berputar),
//     lalu "hari ini" titik pesan berkelip seketika antar-atap, ledakan "satu miliar orang";
// (B) menara menembus awan; chip + jaringan saraf yang menulis, menggambar, dan berbicara;
// (C) tanda tanya besar;
// (D) gulungan emas terbentang: garis waktu "awal manusia" → "akhir dunia";
// (E) lensa renungan (cahaya abstrak, bukan citra Dajjal) dengan cincin waktu yang makin cepat.
const fr = (v: number) => ((v % 1) + 1) % 1;
const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
type P = [number, number];

const GY = 800; // garis tanah kota
const BLD = Array.from({length: 15}, (_, i) => {
  const tall = i === 3 || i === 7 || i === 11;
  return {
    x: 150 + i * 116 + (rand(i * 3.3) - 0.5) * 24,
    w: 58 + rand(i * 5.1) * 36,
    h: 150 + rand(i * 7.9) * 230 + (tall ? 120 : 0),
    extra: tall ? 200 + rand(i) * 40 : 0,
    tall,
  };
});
const ARCS = Array.from({length: 14}, (_, i) => {
  const a = Math.floor(rand(i * 2.7 + 1) * BLD.length);
  let b = Math.floor(rand(i * 4.9 + 3) * BLD.length);
  if (b === a) b = (a + 4) % BLD.length;
  return {a, b, ph: rand(i * 6.3), sp: 1.4 + rand(i * 8.1) * 1.2};
});
const BURST = Array.from({length: 64}, (_, i) => ({x: 160 + rand(i * 3.9) * 1600, y: 200 + rand(i * 7.3) * 420, f: 1.5 + rand(i * 1.9) * 3, ph: rand(i * 5.5) * 6}));

// chip
const CX = 1360;
const CY = 480;
const LAYERS = [3, 4, 3];
const NODES: P[][] = LAYERS.map((n, l) => Array.from({length: n}, (_, k) => [CX - 58 + l * 58, CY + (k - (n - 1) / 2) * 38] as P));
const PANELS = [
  {y: 300, label: 'menulis', key: 'menulis'},
  {y: 480, label: 'menggambar', key: 'menggambar'},
  {y: 660, label: 'berbicara', key: 'berbicara'},
];
const PX = 1660;
const WRITE = [0, 1, 2].map((r) => smoothPath(Array.from({length: 13}, (_, j) => [PX - 80 + j * 13, 290 + r * 22 - 8 + 6 * Math.sin(j * 1.9 + r)] as P)));
const DRAW = smoothPath(
  Array.from({length: 41}, (_, j) => {
    const a = (j / 40) * Math.PI * 2;
    const r = 46 + 16 * Math.cos(5 * a);
    return [PX + r * Math.sin(a), 470 - r * Math.cos(a)] as P;
  }),
);

// gulungan
const SY = 520;
const SH = 190;
const TL0 = 260;
const TL1 = 1660;
const TICKS = Array.from({length: 9}, (_, i) => TL0 + ((TL1 - TL0) * i) / 8);

export const Hook: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const c0 = cue(0);
  const wBerhari = wordOf(0, 'berhari');
  const wHariIni = wordOf(0, 'hari', 1);
  const wMiliar = wordOf(0, 'miliar');
  const wAwan = wordOf(1, 'awan');
  const wMesin = wordOf(1, 'mesin');
  const wTulis = wordOf(1, 'menulis');
  const wGambar = wordOf(1, 'menggambar');
  const wBicara = wordOf(1, 'berbicara');
  const wManusia = wordOf(1, 'manusia');
  const wTanya = wordOf(2, 'bertanya');
  const wQuran = wordOf(3, "qur");
  const wAlur = wordOf(3, 'alur');
  const wAwal = wordOf(3, 'awal');
  const wAkhir = wordOf(3, 'akhir');
  const wRenung = wordOf(4, 'merenungkannya');
  const wCepat = wordOf(4, 'cepat');

  const push = 1 + 0.03 * ramp(t, 0, dur, EASE_IN_OUT);

  // ---------- (A/B) kota ----------
  const cityOp = ramp(t, -0.4, 0.8) * (1 - 0.6 * ramp(t, cue(2), cue(2) + 0.8)) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.6, EASE_IN_OUT));
  const grow = (i: number) => ramp(t, wHariIni - 0.5 + i * 0.06, wHariIni + 1.3 + i * 0.06, EASE_IN_OUT);
  const pierce = ramp(t, cue(1) - 0.2, wAwan + 0.7, EASE_IN_OUT);
  const shift = ramp(t, wMesin - 0.3, wMesin + 0.9, EASE_IN_OUT);
  const cs = mix(1, 0.62, shift);
  const cdx = mix(0, -300, shift);
  const year = Math.round(mix(1925, 2025, ramp(t, c0, wHariIni + 0.9, EASE_IN_OUT)));
  const yearOp = slot(t, c0 - 0.2, wMiliar, 0.6, 0.5);
  const milOp = slot(t, wMiliar - 0.1, cue(1) + 0.6, 0.5, 0.5);
  const dayOp = 1 - ramp(t, wHariIni - 0.3, wHariIni + 0.4, EASE_IN_OUT);
  const netOp = ramp(t, wHariIni + 0.3, wHariIni + 1.0) * (1 - ramp(t, wMesin, wMesin + 0.8, EASE_IN_OUT) * 0.6);
  const burst = ramp(t, wMiliar - 0.1, wMiliar + 0.3) * (1 - ramp(t, cue(1), cue(1) + 1.2, EASE_IN_OUT));
  const msgU = ramp(t, c0 + 0.6, wHariIni - 0.1, (x) => x);
  const msgX = mix(240, 1660, msgU);
  const msgY = GY + 34 + 6 * Math.sin(msgU * 30);
  const cloudOp = ramp(t, cue(1) - 0.3, cue(1) + 0.8) * (1 - ramp(t, cue(2), cue(2) + 0.8, EASE_IN_OUT));

  // ---------- chip ----------
  const chipOp = ramp(t, wMesin - 0.2, wMesin + 0.6, BACK) * (1 - 0.75 * ramp(t, cue(2), cue(2) + 0.8)) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.6, EASE_IN_OUT));
  const panP = PANELS.map((p, k) => ramp(t, [wTulis, wGambar, wBicara][k] - 0.25, [wTulis, wGambar, wBicara][k] + 0.4));
  const human = ramp(t, wManusia - 0.3, wManusia + 0.5);

  // ---------- tanda tanya ----------
  const qIn = ramp(t, wTanya - 0.4, wTanya + 0.6, BACK);
  const qOut = 1 - ramp(t, cue(3) - 0.1, cue(3) + 0.7, EASE_IN_OUT);
  const qOp = Math.min(1, qIn) * qOut;

  // ---------- gulungan ----------
  const toEye = ramp(t, cue(4) - 0.3, cue(4) + 1.1, EASE_IN_OUT);
  const scrOp = ramp(t, cue(3) - 0.1, cue(3) + 0.5) * (1 - ramp(t, cue(4) + 0.3, cue(4) + 1.2, EASE_IN_OUT));
  const unroll = ramp(t, cue(3) + 0.2, wAlur + 0.2, EASE_IN_OUT);
  const half = mix(24, 780, unroll);
  const lineP = ramp(t, cue(3) + 0.6, wAlur + 0.4, EASE_IN_OUT);
  const awalOp = ramp(t, wAwal - 0.2, wAwal + 0.5);
  const akhirOp = ramp(t, wAkhir - 0.2, wAkhir + 0.5);
  const abadOp = ramp(t, cue(3), cue(3) + 0.6);
  const quranOp = ramp(t, wQuran - 0.2, wQuran + 0.5, BACK);
  const sScale = mix(1, 0.16, toEye);

  // ---------- lensa renungan ----------
  const eyeOpen = ramp(t, cue(4) + 0.2, cue(4) + 1.4, EASE_IN_OUT);
  const eyeOp = ramp(t, cue(4) - 0.1, cue(4) + 0.6);
  // lingkaran cahaya (bukan bentuk mata)
  const LR = Math.max(0.1, 175 * eyeOpen);
  const fast = ramp(t, wCepat - 0.6, wCepat + 0.8, EASE_IN_OUT);
  // putaran jarum waktu: kecepatan naik halus (integral analitik)
  const handA = t * 40 + 260 * Math.max(0, t - (wCepat - 0.6)) * fast;
  const renungOp = ramp(t, wRenung - 0.2, wRenung + 0.6);

  return (
    <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 50%'}}>
      <Stage>
        <defs>
          <linearGradient id="hk-tower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b3c70" />
            <stop offset="100%" stopColor="#121a38" />
          </linearGradient>
          <linearGradient id="hk-parch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b2e12" />
            <stop offset="50%" stopColor="#2a210d" />
            <stop offset="100%" stopColor="#3b2e12" />
          </linearGradient>
          <linearGradient id="hk-roll" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6a22" />
            <stop offset="50%" stopColor="#ffd77a" />
            <stop offset="100%" stopColor="#8a6a22" />
          </linearGradient>
          <linearGradient id="hk-q" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff2c8" />
            <stop offset="100%" stopColor={C.gold} />
          </linearGradient>
          <radialGradient id="hk-eye">
            <stop offset="0%" stopColor="#0f2a44" />
            <stop offset="100%" stopColor="#060a18" />
          </radialGradient>
          <clipPath id="hk-scroll">
            <rect x={960 - half} y={SY - SH / 2} width={half * 2} height={SH} />
          </clipPath>
          <clipPath id="hk-eyeclip">
            <path d={`M${960 - LR},500 A${LR} ${LR} 0 1 0 ${960 + LR},500 A${LR} ${LR} 0 1 0 ${960 - LR},500 Z`} />
          </clipPath>
        </defs>

        {/* ================= (A/B) kota ================= */}
        {cityOp > 0.001 ? (
          <g opacity={cityOp} transform={`translate(${960 + cdx} ${GY}) scale(${cs}) translate(-960 ${-GY})`}>
            <Glow x={960} y={GY - 120} r={760} color="pot" opacity={0.18} />
            {/* matahari berputar cepat: hari-hari berlalu */}
            {dayOp > 0.001
              ? (() => {
                  const ph = fr((t - c0) / 1.3);
                  const a = Math.PI * ph;
                  const x = 960 - 720 * Math.cos(a);
                  const y = GY - 40 - 380 * Math.sin(a);
                  return (
                    <g opacity={dayOp * ramp(t, c0, c0 + 0.6)}>
                      <path d={`M240,${GY - 40} A720,380 0 0 1 1680,${GY - 40}`} fill="none" stroke={C.gold} strokeOpacity={0.15} strokeWidth={2} strokeDasharray="4 12" />
                      <g opacity={cyc(ph)}>
                        <Glow x={x} y={y} r={70} color="gold" still />
                        <circle cx={x} cy={y} r={16} fill="#ffe08a" />
                      </g>
                    </g>
                  );
                })()
              : null}
            {/* awan yang ditembus menara */}
            {cloudOp > 0.001
              ? Array.from({length: 7}, (_, k) => {
                  const x = fr(rand(k * 3.1) + t * 0.012) * 2100 - 90;
                  return <ellipse key={k} cx={x} cy={330 + (k % 3) * 22} rx={150 + (k % 2) * 60} ry={26} fill="#c9d6ff" opacity={0.09 * cloudOp} />;
                })
              : null}
            {/* tanah & jalan */}
            <line x1={100} y1={GY} x2={1820} y2={GY} stroke={C.line} strokeWidth={3} />
            <path d={`M140,${GY + 34} Q960,${GY + 46} 1780,${GY + 34}`} fill="none" stroke={C.faint} strokeWidth={2} strokeDasharray="10 12" opacity={0.7} />
            {/* bangunan: gubuk → menara */}
            {BLD.map((b, i) => {
              const g = grow(i);
              const hh = mix(38, b.h, g) + b.extra * pierce;
              const top = GY - hh;
              const lit = 0.35 + 0.35 * Math.sin(t * 1.3 + i * 1.7);
              return (
                <g key={i}>
                  <rect x={b.x - b.w / 2} y={top} width={b.w} height={hh} rx={3} fill="url(#hk-tower)" stroke={b.tall ? C.kin : C.line} strokeOpacity={b.tall ? 0.5 * g : 1} strokeWidth={1.6} />
                  {/* atap gubuk memudar */}
                  <path d={`M${b.x - b.w / 2 - 8},${top + 1} L${b.x},${top - 30} L${b.x + b.w / 2 + 8},${top + 1} Z`} fill="#5a4426" opacity={1 - g} />
                  {/* jendela berkedip (garis putus) */}
                  {g > 0.05
                    ? [-0.22, 0.22].map((f, k) => (
                        <line key={k} x1={b.x + f * b.w} y1={top + 16} x2={b.x + f * b.w} y2={GY - 10} stroke={C.gold} strokeWidth={6} strokeDasharray="7 13" opacity={g * (k ? lit : 0.7 - lit * 0.5)} />
                      ))
                    : null}
                  {b.tall ? <circle cx={b.x} cy={top - 6} r={4} fill={C.heat} opacity={g * (0.3 + 0.7 * Math.max(0, Math.sin(t * 3 + i)))} /> : null}
                </g>
              );
            })}
            {/* kabar lama: titik pelan berhari-hari */}
            {dayOp > 0.001 ? (
              <g opacity={dayOp * ramp(t, c0 + 0.4, c0 + 1)}>
                <Spark x={msgX} y={msgY} r={7} color="gold" trail={[1, 2, 3, 4, 5].map((k): P => [msgX - k * 9, GY + 34 + 6 * Math.sin((msgU - k * 0.006) * 30)])} />
                <Label x={msgX} y={GY + 72} size={22} color={C.gold} font="mono" opacity={ramp(t, wBerhari - 0.2, wBerhari + 0.4)}>
                  kabar · berhari-hari
                </Label>
              </g>
            ) : null}
            {/* hari ini: pesan seketika antar-atap */}
            {netOp > 0.001
              ? ARCS.map((a, k) => {
                  const A = BLD[a.a];
                  const B = BLD[a.b];
                  const ya = GY - (mix(38, A.h, grow(a.a)) + A.extra * pierce) - 8;
                  const yb = GY - (mix(38, B.h, grow(a.b)) + B.extra * pierce) - 8;
                  const mx = (A.x + B.x) / 2;
                  const my = Math.min(ya, yb) - 60 - Math.abs(A.x - B.x) * 0.18;
                  const ph = fr(t * a.sp + a.ph);
                  const s = Math.min(1, ph * 3.5);
                  const px = (1 - s) * (1 - s) * A.x + 2 * (1 - s) * s * mx + s * s * B.x;
                  const py = (1 - s) * (1 - s) * ya + 2 * (1 - s) * s * my + s * s * yb;
                  return (
                    <g key={k} opacity={netOp}>
                      <path d={`M${A.x},${ya} Q${mx},${my} ${B.x},${yb}`} fill="none" stroke={C.cyan} strokeOpacity={0.18} strokeWidth={1.5} />
                      <circle cx={px} cy={py} r={9} fill="url(#soft-cyan)" opacity={cyc(ph)} />
                      <circle cx={px} cy={py} r={3.5} fill="#e9fbff" opacity={cyc(ph)} />
                    </g>
                  );
                })
              : null}
            {burst > 0.001
              ? BURST.map((d, k) => <circle key={k} cx={d.x} cy={d.y} r={2.6} fill={k % 3 ? C.cyan : C.gold} opacity={burst * (0.35 + 0.65 * Math.max(0, Math.sin(t * d.f + d.ph)))} />)
              : null}
            <Ripple x={960} y={420} p={ramp(t, wMiliar - 0.1, wMiliar + 1.5, (x) => x)} r={620} color="cyan" rings={3} width={2.5} />
          </g>
        ) : null}

        {/* tahun & miliar (pojok kanan atas, di atas kota) */}
        <g opacity={yearOp}>
          <Label x={1560} y={210} size={58} color={C.gold} font="mono" weight={600}>
            {String(year)}
          </Label>
          <Label x={1560} y={262} size={22} color={C.muted} font="mono">
            satu abad dipercepat ▸▸
          </Label>
        </g>
        <g opacity={milOp}>
          <Label x={1500} y={212} size={54} color={C.cyan} weight={700}>
            1 miliar orang
          </Label>
          <Label x={1500} y={264} size={24} color={C.muted} font="mono">
            satu video · semalam
          </Label>
          <Twinkles x={1500} y={220} rx={220} ry={50} n={5} color="cyan" />
        </g>

        {/* ================= chip + jaringan saraf ================= */}
        {chipOp > 0.001 ? (
          <g opacity={Math.min(1, chipOp)}>
            <Glow x={CX} y={CY} r={260} color="spr" opacity={0.35 + 0.25 * human} />
            {/* pin */}
            {Array.from({length: 6}, (_, k) => {
              const o = -75 + k * 30;
              return (
                <g key={k} stroke={C.spr} strokeWidth={4} strokeLinecap="round" opacity={0.75}>
                  <line x1={CX + o} y1={CY - 112} x2={CX + o} y2={CY - 132} />
                  <line x1={CX + o} y1={CY + 112} x2={CX + o} y2={CY + 132} />
                  <line x1={CX - 112} y1={CY + o} x2={CX - 132} y2={CY + o} />
                  <line x1={CX + 112} y1={CY + o} x2={CX + 132} y2={CY + o} />
                </g>
              );
            })}
            <rect x={CX - 110} y={CY - 110} width={220} height={220} rx={22} fill="#141a3a" stroke={C.spr} strokeWidth={3} />
            <rect x={CX - 94} y={CY - 94} width={188} height={188} rx={14} fill="none" stroke={C.spr} strokeOpacity={0.35} strokeWidth={1.5} />
            {/* sambungan antar-lapisan */}
            {NODES.slice(0, -1).map((layer, l) =>
              layer.map((a, i) =>
                NODES[l + 1].map((b, j) => {
                  const ph = fr(t * 0.9 + (i * 0.37 + j * 0.21 + l * 0.5));
                  return (
                    <g key={`${l}${i}${j}`}>
                      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.spr} strokeOpacity={0.3} strokeWidth={1.4} />
                      <circle cx={mix(a[0], b[0], ph)} cy={mix(a[1], b[1], ph)} r={2.6} fill="#f1e4ff" opacity={cyc(ph)} />
                    </g>
                  );
                }),
              ),
            )}
            {NODES.flat().map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={8} fill={C.spr} stroke="#efe2ff" strokeWidth={1.4} opacity={0.6 + 0.4 * Math.sin(t * 3 + k * 1.3)} />
            ))}
            <Label x={CX} y={CY + 170} size={22} color={C.spr} font="mono">
              mesin belajar
            </Label>
            {/* keluaran: menulis, menggambar, berbicara */}
            {PANELS.map((pn, k) => {
              const p = panP[k];
              if (p <= 0.001) return null;
              return (
                <g key={pn.key} opacity={p}>
                  <Stream pts={[[CX + 132, CY + (k - 1) * 30], [PX - 150, pn.y]]} color="spr" n={4} speed={0.9} r={3.5} jitter={2} seed={k} />
                  <rect x={PX - 110} y={pn.y - 62} width={220} height={124} rx={14} fill="#0e1430" stroke={C.spr} strokeOpacity={0.6} strokeWidth={2} />
                  <Label x={PX} y={pn.y + 84} size={21} color={C.muted} font="mono">
                    {pn.label}
                  </Label>
                </g>
              );
            })}
            {/* menulis: baris tulisan tergambar berulang */}
            {panP[0] > 0.001
              ? WRITE.map((d, r) => {
                  const ph = fr((t - wTulis) * 0.35);
                  const p = Math.max(0, Math.min(1, ph * 3 - r));
                  return <DrawPath key={r} d={d} p={p} stroke={C.ink} width={3} opacity={panP[0] * (1 - ramp(ph, 0.86, 1))} />;
                })
              : null}
            {panP[1] > 0.001 ? <DrawPath d={DRAW} p={ramp(t, wGambar, wGambar + 1.6, EASE_IN_OUT)} stroke={C.gold} width={3.5} opacity={panP[1]} halo /> : null}
            {panP[2] > 0.001
              ? Array.from({length: 13}, (_, j) => {
                  const h = 8 + 38 * Math.abs(Math.sin(t * 6 + j * 0.9) * Math.sin(t * 2.3 + j * 0.4));
                  return <rect key={j} x={PX - 84 + j * 13} y={660 - h / 2} width={7} height={h} rx={3.5} fill={C.cyan} opacity={panP[2] * 0.85} />;
                })
              : null}
            <Twinkles x={CX} y={CY} rx={160} ry={160} n={5} color="spr" opacity={human} />
          </g>
        ) : null}

        {/* ================= tanda tanya ================= */}
        {qOp > 0.001 ? (
          <g opacity={qOp}>
            <Stream pts={[[300, 700], [600, 640], [860, 560]]} color="cyan" n={6} speed={0.5} r={4} />
            <Stream pts={[[1620, 700], [1320, 640], [1060, 560]]} color="spr" n={6} speed={0.5} r={4} seed={2} />
            <Glow x={960} y={500} r={360} color="gold" opacity={0.45} />
            {Array.from({length: 12}, (_, k) => {
              const a = t * 0.6 + (k / 12) * Math.PI * 2;
              return <circle key={k} cx={960 + 260 * Math.cos(a)} cy={500 + 200 * Math.sin(a)} r={3 + (k % 3)} fill={k % 2 ? C.gold : C.cyan} opacity={0.6} />;
            })}
            {Array.from({length: 9}, (_, k) => {
              const ph = fr(t * 0.18 + rand(k * 4.1));
              return (
                <text key={`q${k}`} x={260 + rand(k * 7.7) * 1400} y={820 - ph * 560} fontFamily={FONT.head} fontWeight={700} fontSize={34 + (k % 3) * 14} fill={k % 2 ? C.spr : C.gold} opacity={0.35 * cyc(ph)} textAnchor="middle">
                  ?
                </text>
              );
            })}
            <g transform={`translate(960 520) rotate(${4 * Math.sin(t * 0.9)}) scale(${(0.6 + 0.4 * qIn) * (1 + 0.03 * Math.sin(t * 2))})`}>
              <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontWeight={700} fontSize={440} fill="url(#hk-q)" style={{paintOrder: 'stroke', stroke: 'rgba(7,11,24,0.6)', strokeWidth: 10}}>
                ?
              </text>
            </g>
          </g>
        ) : null}

        {/* ================= gulungan garis waktu ================= */}
        {scrOp > 0.001 ? (
          <g opacity={scrOp} transform={`translate(960 ${SY}) scale(${sScale}) translate(-960 ${-SY})`}>
            <Glow x={960} y={SY} r={620} color="gold" opacity={0.25} />
            <g clipPath="url(#hk-scroll)">
              <rect x={150} y={SY - SH / 2} width={1620} height={SH} fill="url(#hk-parch)" />
              <line x1={150} y1={SY - SH / 2 + 14} x2={1770} y2={SY - SH / 2 + 14} stroke={C.gold} strokeOpacity={0.5} strokeWidth={1.5} />
              <line x1={150} y1={SY + SH / 2 - 14} x2={1770} y2={SY + SH / 2 - 14} stroke={C.gold} strokeOpacity={0.5} strokeWidth={1.5} />
              {/* hiasan rantai belah ketupat */}
              {Array.from({length: 40}, (_, k) => {
                const x = 170 + k * 40 + fr(t * 0.05) * 40;
                return <path key={k} d={`M${x},${SY - SH / 2 + 26} l6,6 l-6,6 l-6,-6 Z`} fill={C.gold} opacity={0.3} />;
              })}
              <DrawPath d={`M${TL0},${SY + 6} L${TL1},${SY + 6}`} p={lineP} stroke={C.gold} width={5} />
              {TICKS.map((x, k) => (
                <circle key={k} cx={x} cy={SY + 6} r={k === 0 || k === 8 ? 11 : 6} fill={k === 8 ? C.heat : C.gold} opacity={ramp(lineP, k / 8 - 0.05, k / 8 + 0.02) * (0.7 + 0.3 * Math.sin(t * 2 + k))} />
              ))}
              {/* butir cahaya "sebuah alur" yang merambat */}
              {(() => {
                const ph = fr((t - wAlur) * 0.22);
                const x = mix(TL0, TL1, ph);
                return <Spark x={x} y={SY + 6} r={7} color="gold" opacity={ramp(t, wAlur, wAlur + 0.5) * cyc(ph)} trail={[1, 2, 3, 4, 5, 6].map((k): P => [x - k * 12, SY + 6])} />;
              })()}
              <Label x={TL0} y={SY - 42} size={30} color={C.cyan} anchor="start" weight={600} opacity={awalOp}>
                awal manusia
              </Label>
              <Label x={TL1} y={SY - 42} size={30} color={C.heat} anchor="end" weight={600} opacity={akhirOp}>
                akhir dunia
              </Label>
              <Label x={960} y={SY + 50} size={22} color={C.gold} font="mono" opacity={ramp(t, wAlur, wAlur + 0.6) * 0.85}>
                sebuah alur
              </Label>
            </g>
            {/* penggulung */}
            {[-1, 1].map((s) => {
              const x = 960 + s * half;
              return (
                <g key={s}>
                  <rect x={x - 16} y={SY - SH / 2 - 26} width={32} height={SH + 52} rx={14} fill="url(#hk-roll)" />
                  <circle cx={x} cy={SY - SH / 2 - 32} r={10} fill="#ffd77a" />
                  <circle cx={x} cy={SY + SH / 2 + 32} r={10} fill="#ffd77a" />
                  {[0, 1, 2, 3].map((k) => {
                    const a = unroll * 14 * s + (k * Math.PI) / 2;
                    return <line key={k} x1={x - 14} y1={SY + 90 * Math.sin(a)} x2={x + 14} y2={SY + 90 * Math.sin(a)} stroke="#7a5a18" strokeWidth={2.5} opacity={0.6 * Math.max(0, Math.cos(a))} />;
                  })}
                </g>
              );
            })}
            <Label x={960} y={SY - SH / 2 - 92} size={26} color={C.muted} font="mono" opacity={abadOp}>
              14 abad yang lalu
            </Label>
            <Motes x={960} y={SY} rx={820} ry={140} n={26} color="gold" opacity={0.5} />
          </g>
        ) : null}
        {/* pil sumber di bawah gulungan */}
        <g opacity={quranOp * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.5, EASE_IN_OUT))}>
          <rect x={960 - 190} y={SY + SH / 2 + 50} width={380} height={52} rx={26} fill="rgba(10,16,36,0.9)" stroke={C.gold} strokeWidth={2} />
          <text x={960} y={SY + SH / 2 + 77} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontWeight={600} fontSize={25} fill={C.gold}>
            Al-Qur'an · sabda Nabi
          </text>
        </g>

        {/* ================= lensa renungan ================= */}
        {eyeOp > 0.001 ? (
          <g opacity={eyeOp}>
            <Glow x={960} y={500} r={560} color="cyan" opacity={0.35} />
            {/* sinar memancar pelan */}
            {Array.from({length: 28}, (_, k) => {
              const a = (k / 28) * Math.PI * 2 + t * 0.05;
              const r0 = 300 + 20 * Math.sin(t * 1.2 + k);
              const r1 = r0 + 70 + 40 * Math.sin(t * 0.8 + k * 2.1);
              return <line key={k} x1={960 + r0 * 1.45 * Math.cos(a)} y1={500 + r0 * 0.8 * Math.sin(a)} x2={960 + r1 * 1.45 * Math.cos(a)} y2={500 + r1 * 0.8 * Math.sin(a)} stroke={C.gold} strokeOpacity={0.22 * eyeOpen} strokeWidth={2} strokeLinecap="round" />;
            })}
            {/* cincin waktu: jarum makin cepat */}
            <g opacity={0.35 + 0.65 * fast}>
              <circle cx={960} cy={500} r={300} fill="none" stroke={C.gold} strokeOpacity={0.25} strokeWidth={1.5} />
              {Array.from({length: 24}, (_, k) => {
                const a = (k / 24) * Math.PI * 2;
                const l = k % 6 === 0 ? 18 : 8;
                return <line key={k} x1={960 + 300 * Math.cos(a)} y1={500 + 300 * Math.sin(a)} x2={960 + (300 - l) * Math.cos(a)} y2={500 + (300 - l) * Math.sin(a)} stroke={C.gold} strokeOpacity={0.6} strokeWidth={2} />;
              })}
              {[0, 1, 2, 3].map((k) => {
                const a = ((handA - k * (4 + 10 * fast)) * Math.PI) / 180;
                return <circle key={k} cx={960 + 300 * Math.cos(a)} cy={500 + 300 * Math.sin(a)} r={7 - k * 1.4} fill={C.cyan} opacity={1 - k * 0.22} />;
              })}
            </g>
            {/* bentuk lensa */}
            <path d={`M${960 - LR},500 A${LR} ${LR} 0 1 0 ${960 + LR},500 A${LR} ${LR} 0 1 0 ${960 - LR},500 Z`} fill="url(#hk-eye)" stroke={C.gold} strokeWidth={3} />
            <g clipPath="url(#hk-eyeclip)">
              {[118, 92, 66].map((r, k) => (
                <circle key={r} cx={960} cy={500} r={r} fill="none" stroke={k === 1 ? C.gold : C.cyan} strokeOpacity={0.55} strokeWidth={2} strokeDasharray={k === 1 ? '3 9' : '14 10'} transform={`rotate(${(k % 2 ? -1 : 1) * t * (14 + k * 8)} 960 500)`} />
              ))}
              <circle cx={960} cy={500} r={56} fill="url(#soft-cyan)" />
              <circle cx={960} cy={500} r={22} fill="#dff8ff" opacity={0.85 + 0.15 * Math.sin(t * 2.2)} />
              {/* pantulan garis waktu di dalam lensa */}
              <line x1={860} y1={500} x2={1060} y2={500} stroke={C.gold} strokeWidth={2.5} opacity={0.75} />
              {[0, 1, 2, 3, 4].map((k) => {
                const x = 860 + fr(t * 0.12 + k / 5) * 200;
                return <circle key={k} cx={x} cy={500} r={3.5} fill={C.gold} opacity={cyc(fr(t * 0.12 + k / 5))} />;
              })}
              <Motes x={960} y={500} rx={300} ry={110} n={18} color="cyan" opacity={0.6} />
            </g>
            <Label x={960} y={820} size={34} color={C.cyan} weight={600} opacity={renungOp}>
              merenung dengan akal
            </Label>
            <Label x={960} y={208} size={22} color={C.muted} font="mono" opacity={ramp(t, wCepat - 0.4, wCepat + 0.4)}>
              zaman berubah sangat cepat
            </Label>
          </g>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
