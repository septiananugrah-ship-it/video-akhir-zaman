import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath} from '../anim';
import {Card, DrawPath, Glow, Label, Motes, Ripple, Spark, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Awal kisah: khalifah & amanah (QS Al-Baqarah 30, QS Al-Ahzab 72). Tanpa sosok malaikat — dialog hanya kartu teks.
// (1) bumi berpendar, cahaya turun dari firman → bumi; (2) kartu pertanyaan & jawaban, pil sumber;
// (3) bola cahaya amanah ditawarkan ke langit, bumi, gunung → ketiganya meredup & mundur; siluet manusia (tanpa wajah) menerimanya;
// (4) dua jalan bercabang (kebebasan memilih); (5) neraca "dijaga / disia-siakan" di pangkal garis waktu panjang.
const fr = (v: number) => ((v % 1) + 1) % 1;
const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
type P = [number, number];
type KF = [number, number, number]; // [waktu, x, y]
const kf = (t: number, f: KF[]): P => {
  if (t <= f[0][0]) return [f[0][1], f[0][2]];
  for (let i = 1; i < f.length; i++) {
    if (t <= f[i][0]) {
      const p = ramp(t, f[i - 1][0], f[i][0], EASE_IN_OUT);
      return [mix(f[i - 1][1], f[i][1], p), mix(f[i - 1][2], f[i][2], p)];
    }
  }
  const l = f[f.length - 1];
  return [l[1], l[2]];
};

const SrcPill: React.FC<{x: number; y: number; p: number; children: React.ReactNode}> = ({x, y, p, children}) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * Math.min(1, p)})`,
        opacity: Math.min(1, p),
        padding: '9px 24px 9px 18px',
        borderRadius: 999,
        background: 'rgba(16,14,8,0.92)',
        border: `2px solid ${C.gold}`,
        boxShadow: `0 0 24px ${C.gold}55`,
        color: C.gold,
        fontFamily: FONT.head,
        fontWeight: 600,
        fontSize: 27,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{display: 'inline-block', width: 12, height: 12, rotate: '45deg', background: C.gold}} />
      {children}
    </div>
  );

/** Siluet manusia umum tanpa wajah (kepala polos + bahu). */
const Person: React.FC<{x: number; y: number; s?: number; glow?: number}> = ({x, y, s = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-62} r={70} fill="url(#soft-cyan)" opacity={glow} />
    <circle cx={0} cy={-96} r={17} fill="#1a2550" stroke={C.cyan} strokeOpacity={0.5 + 0.5 * glow} strokeWidth={2} />
    <path d="M-34,0 C-34,-40 -26,-70 0,-72 C26,-70 34,-40 34,0 Z" fill="#1a2550" stroke={C.cyan} strokeOpacity={0.5 + 0.5 * glow} strokeWidth={2} />
  </g>
);

const ROW_Y = 640;
const OBJ = [
  {key: 'langit', label: 'langit', x: 400},
  {key: 'bumi', label: 'bumi', x: 760},
  {key: 'gunung', label: 'gunung', x: 1120},
];
const HUX = 1500;

// jalan bercabang
const FORK_L: P[] = [[960, 720], [960, 610], [900, 500], [760, 400], [600, 340]];
const FORK_R: P[] = [[960, 720], [960, 610], [1020, 500], [1160, 400], [1320, 340]];

// garis waktu
const TLY = 650;
const TLX0 = 500;
const TLX1 = 1830;
const MARKS = Array.from({length: 16}, (_, i) => ({x: TLX0 + 50 + i * 80, up: rand(i * 3.7 + 1) > 0.42}));

export const Amanah: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const wFirman = wordOf(0, 'berfirman');
  const wAku = wordOf(0, 'aku');
  const wKhalifah = wordOf(0, 'khalifah');
  const wTanya = wordOf(1, 'bertanya');
  const wJawab = wordOf(1, 'menjawab');
  const wBaqarah = wordOf(1, 'baqarah');
  const wAmanah = wordOf(2, 'amanah');
  const wLangit = wordOf(2, 'langit');
  const wBumi = wordOf(2, 'bumi');
  const wGunung = wordOf(2, 'gunung');
  const wEnggan = wordOf(2, 'enggan');
  const wManusia = wordOf(2, 'manusialah');
  const wPikul2 = wordOf(2, 'memikulnya', 1);
  const wAhzab = wordOf(2, 'ahzab');
  const wBebas = wordOf(3, 'kebebasan');
  const wTanggung = wordOf(3, 'tanggung');
  const wSejarah = wordOf(4, 'sejarah');
  const wDijaga = wordOf(4, 'dijaga');
  const wSia = wordOf(4, 'disia');

  // ---------- bumi ----------
  const k1 = ramp(t, cue(1) - 0.3, cue(1) + 0.8, EASE_IN_OUT);
  const k2 = ramp(t, cue(2) - 0.3, cue(2) + 0.8, EASE_IN_OUT);
  const ex = mix(mix(960, 430, k1), OBJ[1].x, k2);
  const ey = mix(mix(570, 540, k1), ROW_Y - 20, k2);
  const er = mix(mix(165, 145, k1), 80, k2);
  const earthIn = ramp(t, -0.4, 1.0);
  const declineK = ramp(t, wEnggan - 0.2, wEnggan + 0.9, EASE_IN_OUT);
  const rowOut = 1 - ramp(t, cue(3) - 0.3, cue(3) + 0.5, EASE_IN_OUT);
  const earthOp = earthIn * mix(1, 0.4, declineK) * rowOut;
  const earthS = mix(1, 0.85, declineK);
  const earthY = ey - 24 * declineK;

  const beam = slot(t, wFirman - 0.3, cue(2) + 0.2, 0.9, 0.8);
  const beamTop = mix(310, 230, k1);
  const quote0 = slot(t, wAku - 0.3, cue(1) + 0.1, 0.6, 0.6);
  const khal = slot(t, wKhalifah - 0.2, cue(2), 0.5, 0.6);

  const qCard = slot(t, wTanya - 0.3, cue(2) + 0.2, 0.6, 0.6) * (1 - 0.45 * ramp(t, wJawab - 0.2, wJawab + 0.5));
  const aCard = slot(t, wJawab - 0.3, cue(2) + 0.2, 0.6, 0.6);
  const pBaq = slot(t, wBaqarah - 0.2, cue(2) + 0.3, 0.5, 0.6);

  // ---------- amanah ----------
  const rowIn = (k: number) => ramp(t, [wLangit, wBumi, wGunung][k] - 0.6, [wLangit, wBumi, wGunung][k] + 0.2);
  const orbOp = ramp(t, wAmanah - 0.3, wAmanah + 0.5) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.5, EASE_IN_OUT));
  const orbP = kf(t, [
    [wAmanah, 960, 300],
    [wLangit - 0.1, 960, 300],
    [wLangit + 0.35, OBJ[0].x, 470],
    [wBumi + 0.35, OBJ[1].x, 470],
    [wGunung + 0.35, OBJ[2].x, 470],
    [wEnggan + 0.2, OBJ[2].x, 470],
    [wEnggan + 0.9, 1180, 320],
    [wManusia - 0.1, 1300, 330],
    [wPikul2 + 0.1, HUX, ROW_Y - 40],
    [cue(3) - 0.1, HUX, ROW_Y - 40],
    [cue(3) + 0.9, 960, 790],
  ]);
  const humanIn = ramp(t, wManusia - 0.6, wManusia + 0.3);
  const humanGlow = ramp(t, wPikul2 - 0.2, wPikul2 + 0.6);
  const hk = ramp(t, cue(3) - 0.1, cue(3) + 0.9, EASE_IN_OUT);
  const humanOp = humanIn * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.5, EASE_IN_OUT));
  const hx = mix(HUX, 960, hk);
  const hy = mix(ROW_Y + 60, 860, hk);
  const pAhz = slot(t, wAhzab - 0.2, cue(3), 0.5, 0.5);

  // ---------- jalan bercabang ----------
  const forkOp = ramp(t, wBebas - 0.4, wBebas + 0.3) * (1 - ramp(t, cue(4) - 0.2, cue(4) + 0.5, EASE_IN_OUT));
  const forkP = ramp(t, wBebas - 0.3, wBebas + 1.3, EASE_IN_OUT);
  const nBebas = slot(t, wBebas - 0.2, cue(4) + 0.2, 0.5, 0.6);
  const nTang = ramp(t, wTanggung - 0.2, wTanggung + 0.5);

  // ---------- neraca + garis waktu ----------
  const balIn = ramp(t, cue(4) - 0.1, cue(4) + 0.8, BACK);
  const tilt = 9 * Math.sin(t * 0.75) * ramp(t, cue(4), cue(4) + 1.5);
  const tlP = ramp(t, wSejarah - 0.3, wSejarah + 3.0, EASE_IN_OUT);
  const dj = ramp(t, wDijaga - 0.2, wDijaga + 0.5);
  const ds = ramp(t, wSia - 0.2, wSia + 0.5);

  const BX = 300;
  const BY = 420;
  const arm = 130;
  const ca = Math.cos((tilt * Math.PI) / 180);
  const sa = Math.sin((tilt * Math.PI) / 180);
  const panL: P = [BX - arm * ca, BY - arm * sa];
  const panR: P = [BX + arm * ca, BY + arm * sa];

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <radialGradient id="am-earth" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor="#3f8fd8" />
            <stop offset="55%" stopColor="#1a4a86" />
            <stop offset="100%" stopColor="#0a1c3e" />
          </radialGradient>
          <linearGradient id="am-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.gold} stopOpacity="0.6" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="am-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d2f66" />
            <stop offset="100%" stopColor="#0b1430" />
          </linearGradient>
          <clipPath id="am-eclip">
            <circle cx={0} cy={0} r={1} />
          </clipPath>
        </defs>

        {/* ---------- cahaya turun dari atas ke bumi ---------- */}
        {beam > 0.001 ? (
          <g opacity={beam}>
            {[-1, 0, 1].map((k) => {
              const w = (k ? 26 : 54) * (1 + 0.12 * Math.sin(t * 1.6 + k));
              const x = ex + k * 46;
              return <rect key={k} x={x - w / 2} y={beamTop} width={w} height={Math.max(0, ey - er - beamTop + 10)} fill="url(#am-beam)" opacity={k ? 0.5 : 0.8} />;
            })}
            <Stream pts={[[ex, beamTop + 10], [ex, ey - er]]} color="gold" n={6} speed={0.6} r={4} jitter={10} />
          </g>
        ) : null}

        {/* ---------- bumi ---------- */}
        {earthOp > 0.001 ? (
          <g opacity={earthOp} transform={`translate(${ex} ${earthY}) scale(${earthS})`}>
            <Glow x={0} y={0} r={er * 2.4} color="cyan" opacity={0.5} />
            <circle cx={0} cy={0} r={er} fill="url(#am-earth)" />
            <g transform={`scale(${er})`}>
              <g clipPath="url(#am-eclip)">
                {[0, 1, 2, 3, 4].map((k) => {
                  const x = -1.8 + fr(t * 0.035 + k * 0.21) * 3.6;
                  return <ellipse key={k} cx={x} cy={(k % 3) * 0.42 - 0.4} rx={0.32 + (k % 2) * 0.12} ry={0.16 + (k % 3) * 0.05} fill={C.work} opacity={0.6} transform={`rotate(${-20 + k * 13} ${x} 0)`} />;
                })}
              </g>
            </g>
            <circle cx={0} cy={0} r={er} fill="none" stroke={C.cyan} strokeOpacity={0.55} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={er + 12 + 4 * Math.sin(t * 1.4)} fill="none" stroke={C.cyan} strokeOpacity={0.15} strokeWidth={6} />
            <Motes x={0} y={0} rx={er * 1.5} ry={er * 1.3} n={16} color="cyan" opacity={0.5} />
          </g>
        ) : null}
        {/* "khalifah" di permukaan bumi */}
        {khal > 0.001 ? (
          <g opacity={khal}>
            <Spark x={ex} y={ey - er - 6} r={7} color="cyan" />
            <Ripple x={ex} y={ey - er} p={ramp(t, wKhalifah, wKhalifah + 1.3, (v) => v)} r={160} color="cyan" rings={2} width={2} />
            <Label x={ex + (k1 > 0.5 ? 0 : 0)} y={ey + er + 46} size={30} color={C.cyan} weight={600}>
              khalifah di bumi
            </Label>
          </g>
        ) : null}

        {/* ---------- objek: langit, bumi, gunung ---------- */}
        {OBJ.map((o, k) => {
          const p = rowIn(k) * rowOut;
          if (p <= 0.001) return null;
          const op = mix(1, 0.38, declineK);
          const s = mix(1, 0.85, declineK);
          const dy = -24 * declineK;
          return (
            <g key={o.key} opacity={p * op} transform={`translate(${o.x} ${ROW_Y + dy}) scale(${s}) translate(${-o.x} ${-ROW_Y})`}>
              {k === 0 ? (
                <g>
                  <path d={`M${o.x - 120},${ROW_Y + 40} A120,120 0 0 1 ${o.x + 120},${ROW_Y + 40} Z`} fill="url(#am-sky)" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} />
                  {Array.from({length: 7}, (_, j) => {
                    const a = Math.PI * (0.12 + 0.76 * rand(j * 2.3));
                    const r = 40 + rand(j * 5.1) * 66;
                    return <circle key={j} cx={o.x + r * Math.cos(a)} cy={ROW_Y + 40 - r * Math.sin(a)} r={2 + (j % 2)} fill="#fff" opacity={0.4 + 0.5 * Math.sin(t * 2 + j)} />;
                  })}
                  <path d={`M${o.x + 34},${ROW_Y - 50} a22,22 0 1 0 14,32 a18,18 0 1 1 -14,-32 Z`} fill={C.gold} opacity={0.75} />
                </g>
              ) : null}
              {k === 2 ? (
                <g>
                  <path d={`M${o.x - 130},${ROW_Y + 40} L${o.x - 40},${ROW_Y - 80} L${o.x + 20},${ROW_Y + 0} L${o.x + 60},${ROW_Y - 50} L${o.x + 130},${ROW_Y + 40} Z`} fill="#25335e" stroke={C.cyan} strokeOpacity={0.4} strokeWidth={2} />
                  <path d={`M${o.x - 40},${ROW_Y - 80} L${o.x - 62},${ROW_Y - 51} L${o.x - 44},${ROW_Y - 56} L${o.x - 30},${ROW_Y - 46} L${o.x - 18},${ROW_Y - 51} Z`} fill="#dfe8ff" opacity={0.8} />
                  <ellipse cx={o.x} cy={ROW_Y - 10 + 4 * Math.sin(t * 0.6)} rx={70} ry={10} fill="#c9d6ff" opacity={0.12} />
                </g>
              ) : null}
              <Label x={o.x} y={ROW_Y + 90} size={28} color={C.muted}>
                {o.label}
              </Label>
              <Label x={o.x} y={ROW_Y + 128} size={20} color={C.muted} font="mono" opacity={declineK * 0.9}>
                enggan
              </Label>
            </g>
          );
        })}

        {/* ---------- jalan bercabang ---------- */}
        {forkOp > 0.001 ? (
          <g opacity={forkOp}>
            <DrawPath d={smoothPath(FORK_L)} p={forkP} stroke={C.cyan} width={6} halo />
            <DrawPath d={smoothPath(FORK_R)} p={forkP} stroke={C.spr} width={6} halo />
            <Stream pts={FORK_L} color="cyan" n={7} speed={0.35} r={4} jitter={2} opacity={forkP} />
            <Stream pts={FORK_R} color="spr" n={7} speed={0.35} r={4} jitter={2} seed={3} opacity={forkP} />
            <Glow x={600} y={340} r={90} color="cyan" opacity={0.7 * forkP} />
            <Glow x={1320} y={340} r={90} color="spr" opacity={0.7 * forkP} />
            <Label x={540} y={400} size={26} color={C.cyan} font="mono" opacity={forkP}>
              pilihan
            </Label>
            <Label x={1380} y={400} size={26} color={C.spr} font="mono" opacity={forkP}>
              pilihan
            </Label>
            <Ripple x={960} y={600} p={ramp(t, wBebas, wBebas + 1.4, (v) => v)} r={200} color="gold" rings={2} width={2} />
          </g>
        ) : null}

        {/* ---------- siluet manusia ---------- */}
        {humanOp > 0.001 ? (
          <g opacity={humanOp}>
            <Person x={hx} y={hy} s={mix(1, 0.95, hk)} glow={humanGlow} />
            <Label x={hx} y={hy + 30} size={26} color={C.cyan} opacity={humanIn * (1 - hk)}>
              manusia
            </Label>
          </g>
        ) : null}

        {/* ---------- bola amanah ---------- */}
        {orbOp > 0.001 ? (
          <g opacity={orbOp}>
            <Glow x={orbP[0]} y={orbP[1]} r={120} color="gold" opacity={0.8} />
            <circle cx={orbP[0]} cy={orbP[1]} r={22 + 2 * Math.sin(t * 3)} fill="#fff1c4" />
            <circle cx={orbP[0]} cy={orbP[1]} r={34} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray="4 8" transform={`rotate(${t * 40} ${orbP[0]} ${orbP[1]})`} />
            <Twinkles x={orbP[0]} y={orbP[1]} rx={60} ry={60} n={4} color="gold" />
            <Label x={orbP[0]} y={orbP[1] - 66} size={30} color={C.gold} weight={600} opacity={slot(t, wAmanah - 0.2, wManusia, 0.5, 0.5)}>
              amanah
            </Label>
          </g>
        ) : null}
        <Ripple x={HUX} y={ROW_Y - 40} p={ramp(t, wPikul2, wPikul2 + 1.4, (v) => v)} r={220} color="gold" rings={3} width={2.5} />

        {/* ---------- neraca + garis waktu ---------- */}
        {balIn > 0.001 ? (
          <g opacity={Math.min(1, balIn)}>
            <Glow x={BX} y={BY + 60} r={240} color="gold" opacity={0.3} />
            <line x1={BX} y1={BY - 20} x2={BX} y2={TLY} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
            <path d={`M${BX - 60},${TLY} L${BX + 60},${TLY} L${BX + 30},${TLY - 22} L${BX - 30},${TLY - 22} Z`} fill="#8a6a22" />
            <line x1={panL[0]} y1={panL[1]} x2={panR[0]} y2={panR[1]} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
            <circle cx={BX} cy={BY} r={9} fill={C.gold} />
            {[
              {p: panL, c: C.cyan, hue: 'cyan' as const, lab: 'dijaga', op: dj},
              {p: panR, c: C.spr, hue: 'spr' as const, lab: 'disia-siakan', op: ds},
            ].map((q, k) => (
              <g key={k}>
                <line x1={q.p[0]} y1={q.p[1]} x2={q.p[0] - 44} y2={q.p[1] + 90} stroke={C.gold} strokeOpacity={0.6} strokeWidth={1.5} />
                <line x1={q.p[0]} y1={q.p[1]} x2={q.p[0] + 44} y2={q.p[1] + 90} stroke={C.gold} strokeOpacity={0.6} strokeWidth={1.5} />
                <path d={`M${q.p[0] - 54},${q.p[1] + 90} Q${q.p[0]},${q.p[1] + 124} ${q.p[0] + 54},${q.p[1] + 90} Z`} fill="#3b2e12" stroke={C.gold} strokeWidth={2} />
                <Glow x={q.p[0]} y={q.p[1] + 80} r={60} color={q.hue} opacity={0.4 + 0.5 * q.op} />
                <circle cx={q.p[0]} cy={q.p[1] + 84} r={10} fill={q.c} opacity={0.4 + 0.6 * q.op} />
                <Label x={q.p[0]} y={q.p[1] - 36} size={28} color={q.c} weight={600} opacity={q.op}>
                  {q.lab}
                </Label>
              </g>
            ))}
            {/* garis waktu panjang */}
            <DrawPath d={`M${BX + 60},${TLY} L${TLX1},${TLY}`} p={tlP} stroke={C.gold} width={4} halo />
            {MARKS.map((m, k) => {
              const on = ramp(tlP, (m.x - BX) / (TLX1 - BX) - 0.04, (m.x - BX) / (TLX1 - BX));
              if (on <= 0.001) return null;
              const bob = 5 * Math.sin(t * 1.4 + k);
              const y = m.up ? TLY - 34 + bob : TLY + 34 - bob;
              const fade = Math.min(1, (TLX1 - m.x) / 220);
              return (
                <g key={k} opacity={on * fade}>
                  <line x1={m.x} y1={TLY} x2={m.x} y2={y} stroke={m.up ? C.cyan : C.spr} strokeOpacity={0.5} strokeWidth={2} />
                  <circle cx={m.x} cy={y} r={7} fill={m.up ? C.cyan : C.spr} />
                </g>
              );
            })}
            {(() => {
              const ph = fr((t - wSejarah) * 0.15);
              const x = mix(BX + 60, TLX1, ph);
              return <Spark x={x} y={TLY} r={7} color="gold" opacity={tlP * cyc(ph)} trail={[1, 2, 3, 4, 5].map((k): P => [x - k * 14, TLY])} />;
            })()}
            <Label x={1160} y={TLY + 96} size={28} color={C.gold} opacity={ramp(t, wSejarah, wSejarah + 0.8)}>
              sejarah manusia →
            </Label>
          </g>
        ) : null}
        <Motes x={960} y={520} rx={820} ry={300} n={22} color="gold" opacity={0.35} />
      </Stage>

      {/* ---------- kartu & pil (HTML) ---------- */}
      <Card x={960} y={250} opacity={quote0} accent={C.gold} style={{padding: '16px 34px'}}>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.2}}>
          “Aku hendak menjadikan <span style={{color: C.gold}}>khalifah</span> di bumi.”
        </div>
      </Card>
      <Card x={1200} y={380} opacity={qCard} accent={C.cyan} scale={0.96 + 0.04 * qCard}>
        <div style={{fontFamily: FONT.head, fontSize: 24, color: C.cyan, letterSpacing: 1, marginBottom: 6}}>para malaikat bertanya:</div>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.25}}>
          “Apakah Engkau akan menjadikan di sana
          <br />
          makhluk yang berbuat <span style={{color: C.heat}}>kerusakan</span>
          <br />
          dan menumpahkan darah?”
        </div>
      </Card>
      <Card x={1200} y={690} opacity={aCard} accent={C.gold} scale={0.96 + 0.04 * aCard}>
        <div style={{fontFamily: FONT.head, fontSize: 24, color: C.gold, letterSpacing: 1, marginBottom: 6}}>Allah menjawab:</div>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 56, lineHeight: 1.25}}>
          “Aku mengetahui apa yang
          <br />
          tidak kamu ketahui.”
        </div>
      </Card>
      <SrcPill x={430} y={800} p={pBaq}>
        QS Al-Baqarah 30
      </SrcPill>
      <SrcPill x={960} y={830} p={pAhz}>
        QS Al-Ahzab 72
      </SrcPill>
      <Card x={960} y={200} opacity={nBebas} accent={C.gold} scale={0.96 + 0.04 * nBebas} style={{padding: '14px 30px'}}>
        <div style={{fontFamily: FONT.head, fontSize: 40, fontWeight: 600}}>
          <span style={{color: C.gold}}>kebebasan memilih</span>
          <span style={{opacity: nTang}}> + tanggung jawab</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
