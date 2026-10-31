import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp} from '../anim';
import {Glow, Label, Motes, Ripple, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT, type Hue} from '../theme';

// Peta video & cara membaca:
// (1) legenda: pil emas "QS / HR = sumber", pil ungu "Renungan · bukan tafsir", catatan "tanpa wajah — simbol",
//     masing-masing dengan ikon bergerak (gulungan bercahaya, chip berdenyut, simbol yang bergantian);
// (2) empat kartu bagian dengan ikon bergerak: bibit di atas bumi berputar, menara yang meninggi,
//     matahari terbit dari barat, chip + jam pasir yang terbalik berkala;
// (3) catatan penutup: rujukan utama para ulama · Allahu a'lam.
const fr = (v: number) => ((v % 1) + 1) % 1;
const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

const Pill: React.FC<{x: number; y: number; p: number; color: string; children: React.ReactNode; size?: number}> = ({x, y, p, color, children, size = 28}) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * Math.min(1, p)})`,
        opacity: Math.min(1, p),
        padding: '10px 26px',
        borderRadius: 999,
        background: 'rgba(10,16,36,0.92)',
        border: `2.5px solid ${color}`,
        boxShadow: `0 0 26px ${color}55`,
        color,
        fontFamily: FONT.head,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );

const ROW_Y = [380, 530, 680];
const IX = 430;
const PILL_X = 770;
const DX = 1010;

const CARDS = [
  {n: '1', title: 'Awal kisah', sub: 'khalifah · amanah · para nabi', color: C.cyan, hue: 'cyan' as Hue, key: 'awal', nth: 0},
  {n: '2', title: 'Tanda kecil', sub: 'bangunan · ilmu · amanah', color: C.kin, hue: 'kin' as Hue, key: 'tanda', nth: 0},
  {n: '3', title: 'Tanda besar', sub: 'sepuluh tanda besar', color: C.heat, hue: 'heat' as Hue, key: 'tanda', nth: 1},
  {n: '4', title: 'Renungan', sub: 'zaman teknologi & AI', color: C.spr, hue: 'spr' as Hue, key: 'renungan', nth: 0},
];
const CXS = [330, 750, 1170, 1590];
const CT = 250;
const CHt = 480;
const CW = 360;
const IY = CT + 170;

/** Jam pasir kecil yang mengalir lalu terbalik berkala (pasir habis → putar 180° → penuh lagi, tanpa loncatan). */
const Hourglass: React.FC<{x: number; y: number; s: number; t: number; color: string}> = ({x, y, s, t, color}) => {
  const ph = fr(t / 5);
  const drain = ramp(ph, 0, 0.82, (v) => v);
  const rot = 180 * ramp(ph, 0.84, 1, EASE_IN_OUT);
  const w = 30 * s;
  const h = 46 * s;
  const top = 1 - drain;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <path d={`M${x - w},${y - h} L${x + w},${y - h} L${x + 4},${y} L${x + w},${y + h} L${x - w},${y + h} L${x - 4},${y} Z`} fill="rgba(160,190,255,0.12)" stroke="#cfe0ff" strokeOpacity={0.55} strokeWidth={2} />
      <path d={`M${x - w * top},${y - h * top} L${x + w * top},${y - h * top} L${x},${y} Z`} fill={color} opacity={0.9} />
      <path d={`M${x - w * Math.sqrt(drain)},${y + h} L${x + w * Math.sqrt(drain)},${y + h} L${x},${y + h - h * 0.8 * drain} Z`} fill={color} opacity={0.9} />
      {drain < 1 && ph < 0.82 ? <line x1={x} y1={y} x2={x} y2={y + h - h * 0.8 * drain} stroke={color} strokeWidth={2} opacity={0.8} strokeDasharray="3 4" strokeDashoffset={-t * 30} /> : null}
      <rect x={x - w - 8} y={y - h - 8} width={2 * w + 16} height={8} rx={3} fill="#8a6a22" />
      <rect x={x - w - 8} y={y + h} width={2 * w + 16} height={8} rx={3} fill="#8a6a22" />
    </g>
  );
};

const Chip: React.FC<{x: number; y: number; s: number; t: number; color: string}> = ({x, y, s, t, color}) => {
  const w = 44 * s;
  return (
    <g>
      {[-1, 0, 1].map((k) => (
        <g key={k} stroke={color} strokeWidth={3} opacity={0.7}>
          <line x1={x + k * 22 * s} y1={y - w} x2={x + k * 22 * s} y2={y - w - 12 * s} />
          <line x1={x + k * 22 * s} y1={y + w} x2={x + k * 22 * s} y2={y + w + 12 * s} />
          <line x1={x - w} y1={y + k * 22 * s} x2={x - w - 12 * s} y2={y + k * 22 * s} />
          <line x1={x + w} y1={y + k * 22 * s} x2={x + w + 12 * s} y2={y + k * 22 * s} />
        </g>
      ))}
      <rect x={x - w} y={y - w} width={2 * w} height={2 * w} rx={9 * s} fill="#161a3c" stroke={color} strokeWidth={2.5} />
      {[0, 1, 2, 3].map((k) => {
        const a = (k / 4) * Math.PI * 2 + t * 1.4;
        return <circle key={k} cx={x + 18 * s * Math.cos(a)} cy={y + 18 * s * Math.sin(a)} r={4 * s} fill={color} opacity={0.5 + 0.5 * Math.sin(t * 3 + k)} />;
      })}
      <circle cx={x} cy={y} r={7 * s} fill="#f1e4ff" opacity={0.6 + 0.4 * Math.sin(t * 2.4)} />
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const legendOut = 1 - ramp(t, cue(4) - 0.2, cue(4) + 0.6, EASE_IN_OUT);
  const headA = slot(t, wordOf(0, 'cara') - 0.3, cue(4) + 0.4, 0.6, 0.6);
  const headB = ramp(t, cue(4) - 0.1, cue(4) + 0.6);

  const r1i = ramp(t, wordOf(1, 'bersumber') - 0.2, wordOf(1, 'bersumber') + 0.5);
  const r1p = ramp(t, wordOf(1, 'tanda') - 0.2, wordOf(1, 'tanda') + 0.4, BACK);
  const r2i = ramp(t, wordOf(2, 'teknologi') - 0.2, wordOf(2, 'teknologi') + 0.5);
  const r2p = ramp(t, wordOf(2, 'renungan') - 0.2, wordOf(2, 'renungan') + 0.4, BACK);
  const r2d = ramp(t, wordOf(2, 'pemikiran') - 0.2, wordOf(2, 'pemikiran') + 0.5);
  const r3i = ramp(t, wordOf(3, 'wajah') - 0.2, wordOf(3, 'wajah') + 0.5);
  const r3d = ramp(t, wordOf(3, 'ditampilkan') - 0.2, wordOf(3, 'ditampilkan') + 0.5);
  const r3p = ramp(t, wordOf(3, 'simbol') - 0.2, wordOf(3, 'simbol') + 0.4, BACK);
  const lo = legendOut;

  const cardP = CARDS.map((c) => ramp(t, wordOf(4, c.key, c.nth) - 0.3, wordOf(4, c.key, c.nth) + 0.5, BACK));
  const dim = 1 - 0.3 * ramp(t, cue(5), cue(5) + 0.8);
  const ulama = ramp(t, wordOf(5, 'ulama') - 0.2, wordOf(5, 'ulama') + 0.5);
  const allah = ramp(t, wordOf(5, 'allah') - 0.2, wordOf(5, 'allah') + 0.6);

  // simbol yang bergantian di baris 3 (silang-pudar)
  const symPh = (t - wordOf(3, 'wajah')) / 1.6;
  const symW = (k: number) => {
    const d = fr(symPh / 4 - k / 4) * 4; // 0..4
    return Math.max(0, 1 - Math.abs(d - 0.5) * 1.2) + Math.max(0, 1 - Math.abs(d - 4.5) * 1.2);
  };

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          {CXS.map((x, i) => (
            <clipPath key={i} id={`rm-earth${i}`}>
              <circle cx={x} cy={IY + 20} r={66} />
            </clipPath>
          ))}
        </defs>
        <Glow x={960} y={500} r={760} color="gold" opacity={0.12} />

        {/* ---------------- judul kecil ---------------- */}
        <g opacity={headA}>
          <path d={`M780,222 q40,-18 80,0 v40 q-40,-18 -80,0 Z M860,222 q40,-18 80,0 v40 q-40,-18 -80,0 Z`} fill="none" stroke={C.gold} strokeWidth={2.5} transform="translate(-220 -20)" />
          <Label x={1030} y={222} size={48} weight={700} color={C.ink}>
            Cara membaca video ini
          </Label>
        </g>
        <path d="M720,262 H1300" stroke={C.gold} strokeWidth={2} strokeLinecap="round" pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - ramp(t, wordOf(0, 'cara'), wordOf(0, 'membaca') + 0.8, EASE_IN_OUT))} opacity={headA * 0.6} />
        {[0, 1, 2].map((k) => {
          const ph = fr(t * 0.25 + k / 3);
          return <circle key={k} cx={720 + 580 * ph} cy={262} r={4} fill="#fff4d6" opacity={headA * cyc(ph)} />;
        })}
        <Twinkles x={1010} y={222} rx={340} ry={50} n={4} color="gold" opacity={headA} />
        <Label x={960} y={190} size={44} weight={700} color={C.ink} opacity={headB}>
          Alurnya empat bagian
        </Label>

        {/* ---------------- legenda ---------------- */}
        {lo > 0.001 ? (
          <g opacity={lo}>
            {/* baris 1: gulungan bercahaya */}
            <g opacity={r1i}>
              <Glow x={IX} y={ROW_Y[0]} r={90} color="gold" opacity={0.5} />
              <rect x={IX - 46} y={ROW_Y[0] - 26} width={92} height={52} rx={6} fill="#2a210d" stroke={C.gold} strokeWidth={2} />
              <rect x={IX - 56} y={ROW_Y[0] - 34} width={12} height={68} rx={6} fill="#c9a24a" />
              <rect x={IX + 44} y={ROW_Y[0] - 34} width={12} height={68} rx={6} fill="#c9a24a" />
              {[0, 1, 2].map((k) => (
                <line key={k} x1={IX - 32} y1={ROW_Y[0] - 12 + k * 12} x2={IX - 32 + 64 * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.8 + k)))} y2={ROW_Y[0] - 12 + k * 12} stroke={C.gold} strokeWidth={2.5} opacity={0.8} />
              ))}
              <Twinkles x={IX} y={ROW_Y[0]} rx={70} ry={40} n={3} color="gold" />
              <Label x={DX} y={ROW_Y[0]} size={32} anchor="start" color={C.ink}>
                dalil dari Al-Qur'an & hadis sahih
              </Label>
            </g>
            {/* baris 2: chip renungan */}
            <g opacity={r2i}>
              <Glow x={IX} y={ROW_Y[1]} r={90} color="spr" opacity={0.5} />
              <Chip x={IX} y={ROW_Y[1]} s={0.8} t={t} color={C.spr} />
              <Label x={DX} y={ROW_Y[1]} size={32} anchor="start" color={C.ink} opacity={r2d}>
                pemikiran, bukan kepastian
              </Label>
            </g>
            {/* baris 3: simbol bergantian (cahaya, menara, gerbang) */}
            <g opacity={r3i}>
              <Glow x={IX} y={ROW_Y[2]} r={90} color="cyan" opacity={0.45} />
              <g opacity={symW(0)}>
                <circle cx={IX} cy={ROW_Y[2]} r={34} fill="url(#soft-cyan)" />
                <circle cx={IX} cy={ROW_Y[2]} r={12} fill="#e6fbff" />
              </g>
              <g opacity={symW(1)}>
                <path d={`M${IX - 14},${ROW_Y[2] + 40} L${IX - 10},${ROW_Y[2] - 24} L${IX},${ROW_Y[2] - 44} L${IX + 10},${ROW_Y[2] - 24} L${IX + 14},${ROW_Y[2] + 40} Z`} fill="#dff4ff" opacity={0.85} />
              </g>
              <g opacity={symW(2)}>
                <path d={`M${IX - 34},${ROW_Y[2] + 40} V${ROW_Y[2] - 6} A34,34 0 0 1 ${IX + 34},${ROW_Y[2] - 6} V${ROW_Y[2] + 40}`} fill="none" stroke={C.gold} strokeWidth={5} />
                <path d={`M${IX - 20},${ROW_Y[2] + 40} V${ROW_Y[2]} A20,20 0 0 1 ${IX + 20},${ROW_Y[2]} V${ROW_Y[2] + 40}`} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={0.6} />
              </g>
              <g opacity={symW(3)}>
                <line x1={IX - 44} y1={ROW_Y[2]} x2={IX + 44} y2={ROW_Y[2]} stroke={C.gold} strokeWidth={3} />
                {[-1, 0, 1].map((k) => (
                  <circle key={k} cx={IX + k * 32} cy={ROW_Y[2]} r={6} fill={C.gold} />
                ))}
              </g>
              <Label x={DX} y={ROW_Y[2]} size={32} anchor="start" color={C.ink} opacity={r3d}>
                cahaya · menara · gerbang · garis waktu
              </Label>
            </g>
            <Ripple x={PILL_X} y={ROW_Y[0]} p={ramp(t, wordOf(1, 'tanda'), wordOf(1, 'tanda') + 1.2, (x) => x)} r={220} color="gold" rings={2} width={2} />
            <Ripple x={PILL_X} y={ROW_Y[1]} p={ramp(t, wordOf(2, 'renungan'), wordOf(2, 'renungan') + 1.2, (x) => x)} r={220} color="spr" rings={2} width={2} />
            <Ripple x={PILL_X} y={ROW_Y[2]} p={ramp(t, wordOf(3, 'simbol'), wordOf(3, 'simbol') + 1.2, (x) => x)} r={220} color="cyan" rings={2} width={2} />
          </g>
        ) : null}

        {/* ---------------- empat kartu ---------------- */}
        {CARDS.map((c, i) => {
          const p = cardP[i];
          if (p <= 0.001) return null;
          const x = CXS[i];
          const bob = 4 * Math.sin(t * 1.1 + i * 1.3);
          const lt = t - wordOf(4, c.key, c.nth);
          return (
            <g key={c.n} opacity={Math.min(1, p) * dim} transform={`translate(0 ${(1 - Math.min(1, p)) * 40 + bob})`}>
              <Glow x={x} y={IY} r={200} color={c.hue} opacity={0.3} />
              <rect x={x - CW / 2} y={CT} width={CW} height={CHt} rx={22} fill="rgba(12,18,40,0.88)" stroke={c.color} strokeOpacity={0.6} strokeWidth={2} />
              <rect x={x - CW / 2 + 20} y={CT - 1} width={CW - 40} height={3} rx={1.5} fill={c.color} opacity={0.5 + 0.5 * Math.sin(t * 1.2 + i)} />
              <circle cx={x - CW / 2 + 40} cy={CT + 40} r={22} fill="none" stroke={c.color} strokeWidth={2.5} />
              <text x={x - CW / 2 + 40} y={CT + 41} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontWeight={600} fontSize={24} fill={c.color}>
                {c.n}
              </text>

              {/* ikon bergerak */}
              {i === 0 ? (
                <g>
                  <circle cx={x} cy={IY + 20} r={66} fill="#123a6a" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={2} />
                  <g clipPath={`url(#rm-earth${i})`}>
                    {[0, 1, 2, 3].map((k) => {
                      const ex = x - 120 + fr(t * 0.06 + k * 0.27) * 240;
                      return <ellipse key={k} cx={ex} cy={IY + 20 + (k % 2 ? 22 : -18)} rx={28 + k * 5} ry={14 + (k % 2) * 6} fill={C.work} opacity={0.75} />;
                    })}
                  </g>
                  <circle cx={x - 22} cy={IY} r={40} fill="#fff" opacity={0.06} />
                  {/* bibit tumbuh di atas bumi */}
                  {(() => {
                    const g = ramp(lt, 0.2, 1.6, EASE_IN_OUT);
                    const sw = 6 * Math.sin(t * 1.6);
                    const top = IY - 46 - 54 * g;
                    return (
                      <g opacity={g}>
                        <path d={`M${x},${IY - 44} Q${x + sw * 0.5},${(IY - 44 + top) / 2} ${x + sw},${top}`} fill="none" stroke={C.work} strokeWidth={4} strokeLinecap="round" />
                        <path d={`M${x + sw * 0.6},${top + 22} q-26,-14 -30,-2 q14,10 30,2 Z`} fill={C.work} />
                        <path d={`M${x + sw},${top + 6} q26,-16 30,-4 q-14,12 -30,4 Z`} fill={C.work} />
                      </g>
                    );
                  })()}
                  <Motes x={x} y={IY} rx={110} ry={80} n={10} color="work" opacity={0.5} />
                </g>
              ) : null}
              {i === 1 ? (
                <g>
                  {(() => {
                    const g = ramp(lt, 0.1, 1.6, EASE_IN_OUT);
                    const hh = mix(40, 170, g) + 6 * Math.sin(t * 0.9);
                    const base = IY + 80;
                    return (
                      <g>
                        <rect x={x - 70} y={base - 50} width={30} height={50} fill="#1f2a50" />
                        <rect x={x + 42} y={base - 66} width={34} height={66} fill="#1f2a50" />
                        <rect x={x - 22} y={base - hh} width={44} height={hh} rx={3} fill="#2b3c70" stroke={C.kin} strokeWidth={2} />
                        <path d={`M${x - 10},${base - hh} L${x},${base - hh - 34 * g} L${x + 10},${base - hh} Z`} fill={C.kin} opacity={0.9} />
                        <line x1={x} y1={base - hh + 10} x2={x} y2={base - 8} stroke={C.gold} strokeWidth={6} strokeDasharray="6 10" strokeDashoffset={-t * 6} opacity={0.6} />
                        <circle cx={x} cy={base - hh - 36 * g} r={4} fill={C.heat} opacity={0.3 + 0.7 * Math.max(0, Math.sin(t * 3.2))} />
                        <line x1={x - 100} y1={base} x2={x + 100} y2={base} stroke={C.line} strokeWidth={2} />
                      </g>
                    );
                  })()}
                  <Motes x={x} y={IY} rx={110} ry={90} n={10} color="kin" opacity={0.5} />
                </g>
              ) : null}
              {i === 2 ? (
                <g>
                  {(() => {
                    const hy = IY + 60;
                    const rise = 0.5 - 0.5 * Math.cos(Math.max(0, lt - 0.2) * 0.9);
                    const sx = x - 70;
                    const sy = hy + 30 - 90 * rise;
                    return (
                      <g>
                        <clipPath id="rm-sun">
                          <rect x={x - CW / 2 + 10} y={CT + 60} width={CW - 20} height={hy - CT - 60} />
                        </clipPath>
                        <g clipPath="url(#rm-sun)">
                          <Glow x={sx} y={sy} r={110} color="heat" opacity={0.7} still />
                          {Array.from({length: 10}, (_, k) => {
                            const a = (k / 10) * Math.PI * 2 + t * 0.4;
                            return <line key={k} x1={sx + 40 * Math.cos(a)} y1={sy + 40 * Math.sin(a)} x2={sx + 56 * Math.cos(a)} y2={sy + 56 * Math.sin(a)} stroke={C.heat} strokeWidth={3} strokeLinecap="round" opacity={0.7} />;
                          })}
                          <circle cx={sx} cy={sy} r={30} fill="#ff7a5a" />
                        </g>
                        <line x1={x - 140} y1={hy} x2={x + 140} y2={hy} stroke={C.heat} strokeOpacity={0.6} strokeWidth={2.5} />
                        <path d={`M${x + 40},${hy - 10} v-60 m-12,14 l12,-14 l12,14`} fill="none" stroke={C.heat} strokeWidth={3} opacity={0.6 + 0.4 * Math.sin(t * 2)} />
                        <text x={x - 70} y={hy + 30} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={C.heat}>
                          barat
                        </text>
                      </g>
                    );
                  })()}
                </g>
              ) : null}
              {i === 3 ? (
                <g>
                  <Chip x={x - 58} y={IY + 10} s={0.9} t={t} color={C.spr} />
                  <Hourglass x={x + 70} y={IY + 10} s={1} t={t} color={C.gold} />
                  <Stream pts={[[x - 10, IY + 10], [x + 40, IY + 10]]} color="spr" n={3} speed={0.8} r={3} jitter={1} />
                </g>
              ) : null}

              <Label x={x} y={CT + 345} size={38} weight={700} color={C.ink}>
                {c.title}
              </Label>
              <Label x={x} y={CT + 398} size={18} color={C.muted} font="mono">
                {c.sub}
              </Label>
              <Ripple x={x} y={IY} p={ramp(t, wordOf(4, c.key, c.nth), wordOf(4, c.key, c.nth) + 1.2, (v) => v)} r={200} color={c.hue} rings={2} width={2} />
            </g>
          );
        })}
        {/* panah penghubung antar-kartu */}
        {[0, 1, 2].map((k) => {
          const p = Math.min(cardP[k], cardP[k + 1]);
          if (p <= 0.001) return null;
          const x = (CXS[k] + CXS[k + 1]) / 2;
          const ph = fr(t * 0.8 + k * 0.3);
          return (
            <g key={k} opacity={Math.min(1, p) * dim}>
              <path d={`M${x - 8 + 6 * ph},${CT + 210} l10,10 l-10,10`} fill="none" stroke={C.gold} strokeWidth={3} strokeLinecap="round" opacity={cyc(ph) * 0.9 + 0.1} />
            </g>
          );
        })}
        <Twinkles x={960} y={815} rx={380} ry={30} n={5} color="gold" opacity={allah} />
        <Motes x={960} y={500} rx={820} ry={300} n={24} color="gold" opacity={0.35} />
      </Stage>

      {/* pil legenda (HTML) */}
      <AbsoluteFill style={{opacity: lo}}>
        <Pill x={PILL_X} y={ROW_Y[0]} p={r1p} color={C.gold}>
          QS / HR = sumber
        </Pill>
        <Pill x={PILL_X} y={ROW_Y[1]} p={r2p} color={C.spr}>
          Renungan · bukan tafsir
        </Pill>
        <Pill x={PILL_X} y={ROW_Y[2]} p={r3p} color={C.cyan}>
          tanpa wajah — simbol
        </Pill>
      </AbsoluteFill>
      {/* catatan penutup */}
      {ulama > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 960,
            top: 818,
            transform: `translate(-50%, -50%) scale(${0.96 + 0.04 * ulama})`,
            opacity: Math.min(1, ulama * 1.3),
            padding: '14px 32px',
            borderRadius: 16,
            background: 'linear-gradient(160deg, rgba(22,34,72,0.94), rgba(10,16,36,0.94))',
            border: `1.5px solid ${C.gold}55`,
            borderLeft: `7px solid ${C.gold}`,
            boxShadow: `0 18px 50px rgba(0,0,0,0.45), 0 0 34px ${C.gold}22`,
            fontFamily: FONT.head,
            fontSize: 32,
            fontWeight: 500,
            color: C.ink,
            whiteSpace: 'nowrap',
          }}
        >
          Rujukan utama: <span style={{color: C.gold}}>para ulama</span>
          <span style={{opacity: allah}}>
            {'  ·  '}
            <span style={{color: C.gold, fontStyle: 'italic'}}>Allahu a'lam</span> — Allah paling mengetahui
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
