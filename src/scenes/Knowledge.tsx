import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand} from '../anim';
import {Badge, Card, Glow, Label, Motes, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Ilmu diangkat, waktu dipercepat (AUDIT): Bukhari 1036 (lima tanda); Bukhari 100 & Muslim 2673 (wafatnya ulama).
// Tanda kecil = jingga, fitnah = ungu. Tanpa citra kekerasan: pembunuhan hanya titik merah berdenyut.

const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

/** Kalender yang dibalik (phi = jumlah halaman yang sudah terbalik, kontinu). */
const Calendar: React.FC<{x: number; y: number; s: number; phi: number; op: number}> = ({x, y, s, phi, op}) => {
  if (op <= 0.001) return null;
  const k = Math.floor(phi);
  const f = phi - k;
  const page = (m: number, key: string, extra?: string, o = 1) => (
    <g key={key} transform={extra} opacity={o}>
      <rect x={-150} y={-150} width={300} height={320} rx={16} fill="#f4ecd8" />
      <rect x={-150} y={-150} width={300} height={78} rx={16} fill={C.kin} />
      <rect x={-150} y={-90} width={300} height={18} fill={C.kin} />
      <text x={0} y={-108} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontWeight={700} fontSize={44} fill="#fff">
        {MONTHS[((m % 12) + 12) % 12]}
      </text>
      {Array.from({length: 28}, (_, d) => (
        <rect key={d} x={-125 + (d % 7) * 36} y={-50 + Math.floor(d / 7) * 50} width={24} height={24} rx={5} fill="#c9b994" opacity={0.7} />
      ))}
    </g>
  );
  return (
    <g opacity={op} transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={190} rx={170} ry={16} fill="#000" opacity={0.3} />
      {/* tumpukan halaman */}
      <rect x={-146} y={-140} width={300} height={320} rx={16} fill="#cfc4a8" />
      {page(k + 1, 'under')}
      {/* halaman yang terangkat: memipih ke atas & memudar */}
      {page(k, 'flip', `translate(0,-150) scale(1,${(1 - f).toFixed(3)}) skewX(${(-14 * f).toFixed(2)}) translate(0,150)`, 1 - f * 0.6)}
      {/* cincin */}
      {[-90, -30, 30, 90].map((rx) => (
        <rect key={rx} x={rx - 6} y={-166} width={12} height={34} rx={6} fill="#8a93b8" />
      ))}
    </g>
  );
};

const Clock: React.FC<{x: number; y: number; r: number; turns: number; op: number}> = ({x, y, r, turns, op}) => {
  if (op <= 0.001) return null;
  const am = turns * Math.PI * 2 - Math.PI / 2;
  const ah = (turns / 12) * Math.PI * 2 - Math.PI / 2;
  return (
    <g opacity={op}>
      <Glow x={x} y={y} r={r * 1.6} color="kin" opacity={0.4} />
      <circle cx={x} cy={y} r={r} fill="rgba(16,26,56,0.92)" stroke={C.kin} strokeWidth={5} />
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={x + Math.cos(a) * r * 0.82} cy={y + Math.sin(a) * r * 0.82} r={i % 3 ? 3 : 6} fill={C.ink} opacity={0.7} />;
      })}
      {/* jejak putaran jarum menit */}
      {Array.from({length: 6}, (_, i) => {
        const a = am - i * 0.12;
        return (
          <path key={i} d={`M${x},${y} L${x + Math.cos(a) * r * 0.74},${y + Math.sin(a) * r * 0.74}`} stroke={C.kin} strokeWidth={6} strokeLinecap="round" opacity={0.18 * (1 - i / 6)} />
        );
      })}
      <path d={`M${x},${y} L${x + Math.cos(ah) * r * 0.48},${y + Math.sin(ah) * r * 0.48}`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${x},${y} L${x + Math.cos(am) * r * 0.74},${y + Math.sin(am) * r * 0.74}`} stroke={C.kin} strokeWidth={6} strokeLinecap="round" />
      <circle cx={x} cy={y} r={9} fill={C.kin} />
    </g>
  );
};

const Lamp: React.FC<{x: number; y: number; lit: number; t: number; i: number}> = ({x, y, lit, t, i}) => {
  const fl = 1 + 0.08 * Math.sin(t * 9 + i * 2) + 0.05 * Math.sin(t * 13 + i);
  return (
    <g>
      {/* buku di bawah pelita */}
      <rect x={x - 52} y={y + 30} width={104} height={20} rx={3} fill="#5a3f8a" opacity={0.5 + 0.5 * lit} />
      <rect x={x - 46} y={y + 50} width={96} height={20} rx={3} fill="#2f5a8a" opacity={0.5 + 0.5 * lit} />
      <Glow x={x} y={y - 38} r={110 * (0.3 + 0.7 * lit)} color="gold" opacity={lit} />
      <path d={`M${x - 42},${y + 10} Q${x},${y + 40} ${x + 42},${y + 10} L${x + 64},${y - 6} L${x + 36},${y - 2} Q${x},${y - 14} ${x - 42},${y + 10} Z`} fill="#b8862e" stroke={C.gold} strokeWidth={2} />
      <path
        d={`M${x + 50},${y - 10} q-11,${-18 * fl * lit - 4} 0,${-44 * fl * lit - 6} q11,${26 * fl * lit} 0,${44 * fl * lit + 6} Z`}
        fill="#ffd27a"
        opacity={lit}
      />
      <path d={`M${x + 50},${y - 10} q-5,-10 0,${-22 * lit - 2} q5,12 0,${22 * lit + 2} Z`} fill="#fff" opacity={lit * 0.8} />
      {/* asap tipis saat padam */}
      {Array.from({length: 3}, (_, k) => {
        const ph = (t * 0.5 + k / 3 + i * 0.13) % 1;
        return (
          <circle key={k} cx={x + 50 + 8 * Math.sin(ph * 6 + k)} cy={y - 20 - ph * 90} r={5 + ph * 10} fill="#8a93b8" opacity={cyc(ph) * 0.3 * (1 - lit)} />
        );
      })}
    </g>
  );
};

const ITEMS = [
  {w: 'ilmu', n: 0, text: 'ilmu dicabut', c: C.kin},
  {w: 'gempa', n: 0, text: 'banyak gempa', c: C.kin},
  {w: 'zaman', n: 0, text: 'zaman saling berdekatan', c: C.kin},
  {w: 'fitnah', n: 0, text: 'fitnah bermunculan', c: C.spr},
  {w: 'pembunuhan', n: 0, text: 'banyak pembunuhan', c: C.heat},
];

/** Ikon tanda di sisi kanan (fase 1). */
const SignIcon: React.FC<{k: number; x: number; y: number; p: number; t: number}> = ({k, x, y, p, t}) => {
  if (p <= 0.001) return null;
  const c = ITEMS[k].c;
  return (
    <g opacity={p} transform={`translate(${x},${y}) scale(${0.7 + 0.3 * p})`}>
      <circle cx={0} cy={0} r={62} fill="rgba(12,20,44,0.9)" stroke={c} strokeWidth={3} />
      {k === 0 ? (
        <g>
          <rect x={-30} y={4} width={60} height={22} rx={3} fill="#5a3f8a" />
          {Array.from({length: 5}, (_, i) => {
            const ph = (t * 0.7 + i / 5) % 1;
            return <circle key={i} cx={-20 + i * 10} cy={0 - ph * 50} r={3.5} fill={C.gold} opacity={cyc(ph)} />;
          })}
        </g>
      ) : k === 1 ? (
        <path
          d={Array.from({length: 25}, (_, i) => `${i ? 'L' : 'M'}${-44 + i * 3.67},${(i % 2 ? -1 : 1) * 22 * Math.abs(Math.sin(t * 3 + i * 0.5)) * Math.sin((i / 24) * Math.PI)}`).join(' ')}
          fill="none"
          stroke={c}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      ) : k === 2 ? (
        <g>
          <circle cx={0} cy={0} r={34} fill="none" stroke={C.ink} strokeWidth={3} opacity={0.7} />
          <path d={`M0,0 L${Math.cos(t * 6) * 26},${Math.sin(t * 6) * 26}`} stroke={c} strokeWidth={4} strokeLinecap="round" />
          <path d={`M0,0 L${Math.cos(t * 0.5) * 16},${Math.sin(t * 0.5) * 16}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : k === 3 ? (
        <path
          d={Array.from({length: 40}, (_, i) => {
            const a = i * 0.42 + t * 1.6;
            const r = 3 + i * 1.0;
            return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
          }).join(' ')}
          fill="none"
          stroke={c}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ) : (
        <g>
          <circle cx={0} cy={0} r={12 + 3 * Math.sin(t * 4)} fill={c} />
          <circle cx={0} cy={0} r={24 + 12 * ((t * 0.8) % 1)} fill="none" stroke={c} strokeWidth={2.5} opacity={cyc((t * 0.8) % 1)} />
        </g>
      )}
    </g>
  );
};

// perjalanan
const ROWS = [
  {y: 330, label: '≈ 1 bulan', period: 14, c: C.kin},
  {y: 480, label: 'lebih singkat', period: 4.5, c: C.kin},
  {y: 630, label: 'beberapa jam', period: 1.4, c: C.kin},
];
const AX = 210;
const BXr = 900;

const Camel: React.FC<{t: number}> = ({t}) => {
  const st = Math.sin(t * 3);
  return (
    <g>
      <ellipse cx={0} cy={-34} rx={32} ry={16} fill="#c99a5e" />
      <ellipse cx={-4} cy={-48} rx={14} ry={11} fill="#c99a5e" />
      <path d="M26,-38 Q40,-50 38,-70" stroke="#c99a5e" strokeWidth={9} strokeLinecap="round" fill="none" />
      <ellipse cx={44} cy={-70} rx={10} ry={6} fill="#c99a5e" />
      {[-22, -12, 14, 24].map((lx, k) => (
        <path key={k} d={`M${lx},-22 L${lx + (k % 2 ? 1 : -1) * 4 * st},0`} stroke="#a77d45" strokeWidth={5} strokeLinecap="round" />
      ))}
    </g>
  );
};
const Ship: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${2 * Math.sin(t * 2)})`}>
    <path d="M-44,-14 L44,-14 L30,4 L-32,4 Z" fill="#6b4a2e" stroke={C.gold} strokeWidth={2} />
    <path d="M0,-14 L0,-70" stroke="#c9b994" strokeWidth={3} />
    <path d={`M3,-66 Q${30 + 4 * Math.sin(t * 3)},-44 3,-20 Z`} fill="#f4ecd8" />
    <path d="M-3,-60 L-28,-22 L-3,-22 Z" fill="#e2d6b8" />
    <path d={`M-60,8 Q-30,${2 + 3 * Math.sin(t * 4)} 0,8 T60,8`} stroke={C.water} strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);
const Plane: React.FC = () => (
  <g>
    <path d="M-46,-24 L36,-24 Q52,-24 52,-18 Q52,-12 36,-12 L-46,-12 L-52,-30 L-42,-30 Z" fill="#dfe8ff" />
    <path d="M-6,-20 L-24,6 L-12,6 L12,-20 Z" fill="#b9c6ea" />
    <path d="M-6,-16 L-20,-40 L-10,-40 L10,-16 Z" fill="#b9c6ea" />
  </g>
);

export const Knowledge: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // 1 — daftar lima tanda
  const pList = slot(t, 0.4, cue(1) + 0.3, 0.7, 0.7);
  const itemP = ITEMS.map((it) => ramp(t, wordOf(0, it.w, it.n) - 0.1, wordOf(0, it.w, it.n) + 0.5));
  const pill1 = ramp(t, wordOf(0, 'Hadis'), wordOf(0, 'Hadis') + 0.5);

  // 2 — pelita ulama padam, pengeras suara membesar
  const pLamp = slot(t, cue(1) - 0.1, cue(2) + 0.3, 0.7, 0.7);
  const tW = wordOf(1, 'wafatnya');
  const lampLit = (i: number) => 1 - ramp(t, tW + i * 0.55, tW + i * 0.55 + 0.9, EASE_IN_OUT);
  const tMeg = wordOf(1, 'pemimpin');
  const meg = ramp(t, tMeg - 0.4, wordOf(1, 'ilmu', 1) + 0.4, EASE_IN_OUT);
  const tanpa = ramp(t, wordOf(1, 'tanpa'), wordOf(1, 'tanpa') + 0.5, BACK);
  const pill2 = ramp(t, wordOf(1, 'hadis'), wordOf(1, 'hadis') + 0.5);

  // 3 — kalender & jam makin cepat
  const t2 = cue(2);
  const pCal = slot(t, t2 - 0.1, cue(3) + 0.3, 0.7, 0.7);
  const tau = Math.max(0, t - (t2 - 0.1));
  // laju naik linear lalu ditahan (agar tidak berkedip): ∫ min(a + b·τ, cap) dτ
  const accel = (a: number, b: number, cap: number) => {
    const tc = (cap - a) / b;
    return tau < tc ? a * tau + 0.5 * b * tau * tau : a * tc + 0.5 * b * tc * tc + cap * (tau - tc);
  };
  const phi = accel(0.7, 0.75, 6.5);
  const turns = accel(0.2, 0.4, 3);
  const setahun = ramp(t, wordOf(2, 'Setahun'), wordOf(2, 'Setahun') + 0.6);
  const berkah = slot(t, wordOf(2, 'berkahnya') - 0.2, cue(3), 0.5, 0.8);

  // 4 — perjalanan menyusut & bola dunia
  const pTr = slot(t, cue(3) + 0.2, cue(4) + 0.3, 0.7, 0.7);
  const rowP = [
    ramp(t, wordOf(3, 'Perjalanan') - 0.2, wordOf(3, 'Perjalanan') + 0.5),
    ramp(t, wordOf(3, 'sebulan') + 0.3, wordOf(3, 'sebulan') + 0.9),
    ramp(t, wordOf(3, 'beberapa') - 0.1, wordOf(3, 'beberapa') + 0.5),
  ];
  const routeP = ramp(t, cue(3) + 0.3, cue(3) + 1.3);
  const pGlobe = ramp(t, wordOf(3, 'kabar') - 0.3, wordOf(3, 'kabar') + 0.5);
  const tEnd = cue(4);
  const pEnd = ramp(t, tEnd + 0.2, tEnd + 1.0);
  const akrab = ramp(t, wordOf(4, 'akrab'), wordOf(4, 'akrab') + 0.6);
  const GX = 1480;
  const GY = mix(480, 470, pEnd);
  const GR = 190;

  const iconPos = (k: number): [number, number] => {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2 + 0.08 * Math.sin(t * 0.3);
    return [1440 + Math.cos(a) * 220, 500 + Math.sin(a) * 210];
  };

  return (
    <AbsoluteFill>
      <Stage>
        {/* 1: ikon lima tanda mengitari bintang delapan */}
        {pList > 0.001 ? (
          <g opacity={pList}>
            <g transform={`translate(1440,500) rotate(${t * 6})`}>
              {[0, 45].map((r) => (
                <rect key={r} x={-90} y={-90} width={180} height={180} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.35} transform={`rotate(${r})`} />
              ))}
            </g>
            <Glow x={1440} y={500} r={200} color="kin" opacity={0.3} />
            {ITEMS.map((_, k) => {
              const [x, y] = iconPos(k);
              return <SignIcon key={k} k={k} x={x} y={y} p={itemP[k]} t={t} />;
            })}
            {ITEMS.map((_, k) => (
              <Ripple key={k} x={iconPos(k)[0]} y={iconPos(k)[1]} p={ramp(t, wordOf(0, ITEMS[k].w), wordOf(0, ITEMS[k].w) + 1.2, (x) => x)} r={110} color={k === 3 ? 'spr' : k === 4 ? 'heat' : 'kin'} />
            ))}
          </g>
        ) : null}

        {/* 2: pelita ulama padam satu per satu */}
        {pLamp > 0.001 ? (
          <g opacity={pLamp}>
            <Label x={620} y={260} size={30} color={C.gold} font="sans">
              ilmu para ulama
            </Label>
            <g transform="translate(620,450) scale(1.35) translate(-620,-450)">
              {Array.from({length: 5}, (_, i) => (
                <Lamp key={i} x={380 + i * 120} y={450 + 5 * Math.sin(t * 0.8 + i)} lit={lampLit(i)} t={t} i={i} />
              ))}
            </g>
            {/* pengeras suara */}
            <g transform={`translate(1430,470) scale(${0.45 + 0.65 * meg}) rotate(${-8 + 3 * Math.sin(t * 1.5)})`} opacity={ramp(t, tMeg - 0.4, tMeg + 0.3)}>
              <Glow x={60} y={0} r={240} color="spr" opacity={0.45} />
              <rect x={-150} y={-30} width={60} height={60} rx={10} fill="#4a3a7a" />
              <path d="M-92,-34 L60,-110 L60,110 L-92,34 Z" fill="#7a5ab8" stroke={C.spr} strokeWidth={4} />
              <ellipse cx={60} cy={0} rx={18} ry={110} fill="#5c4596" stroke={C.spr} strokeWidth={4} />
              <path d="M-120,30 L-110,90" stroke="#4a3a7a" strokeWidth={14} strokeLinecap="round" />
              {Array.from({length: 4}, (_, k) => {
                const ph = (t * 0.9 + k / 4) % 1;
                const r = 90 + ph * 220;
                return (
                  <path
                    key={k}
                    d={`M${60 + r * Math.cos(-0.6)},${r * Math.sin(-0.6)} A${r},${r} 0 0 1 ${60 + r * Math.cos(0.6)},${r * Math.sin(0.6)}`}
                    fill="none"
                    stroke={C.spr}
                    strokeWidth={6}
                    strokeLinecap="round"
                    opacity={cyc(ph) * 0.8}
                  />
                );
              })}
            </g>
            <Label x={1470} y={720} size={44} color={C.spr} weight={600} opacity={tanpa}>
              tanpa ilmu
            </Label>
          </g>
        ) : null}

        {/* 3: kalender & jam */}
        <Calendar x={mix(600, 560, pEnd)} y={mix(500, 470, pEnd)} s={mix(1, 0.85, pEnd)} phi={phi} op={Math.max(pCal, pEnd)} />
        {pCal > 0.001 ? (
          <g opacity={pCal}>
            <Clock x={1090} y={480} r={140} turns={turns} op={1} />
            {/* berkah memudar: butir emas yang lepas & hilang */}
            {Array.from({length: 14}, (_, i) => {
              const ph = (t * 0.35 + i / 14) % 1;
              const x = 600 + (rand(i) - 0.5) * 300 + ph * 60 * (rand(i + 3) - 0.5);
              return <circle key={i} cx={x} cy={330 - ph * 140} r={3 + rand(i + 1) * 3} fill={C.gold} opacity={cyc(ph) * 0.8 * berkah} />;
            })}
          </g>
        ) : null}

        {/* 4: perjalanan */}
        {pTr > 0.001 ? (
          <g opacity={pTr}>
            {ROWS.map((r, k) => {
              const p = rowP[k];
              const ph = (t / r.period + k * 0.3) % 1;
              const vx = mix(AX + 40, BXr - 40, ph);
              const op = Math.min(1, ph * 12, (1 - ph) * 12);
              return (
                <g key={k}>
                  <path d={`M${AX},${r.y} L${mix(AX, BXr, routeP)},${r.y}`} stroke={C.muted} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
                  <circle cx={AX} cy={r.y} r={9} fill={C.gold} opacity={routeP} />
                  <circle cx={BXr} cy={r.y} r={9} fill={C.gold} opacity={routeP} />
                  <g opacity={p}>
                    <g transform={`translate(${vx},${r.y - (k === 2 ? 30 : 4)})`} opacity={op}>
                      {k === 0 ? <Camel t={t} /> : k === 1 ? <Ship t={t} /> : <Plane />}
                    </g>
                    {k === 2 ? <path d={`M${vx - 60},${r.y - 48} L${vx - 160},${r.y - 48}`} stroke="#dfe8ff" strokeWidth={2} opacity={op * 0.5} /> : null}
                    <Label x={BXr + 34} y={r.y - 6} size={30} color={k === 2 ? C.gold : C.kin} anchor="start" weight={600}>
                      {r.label}
                    </Label>
                  </g>
                </g>
              );
            })}
          </g>
        ) : null}

        {/* bola dunia & kabar sekejap */}
        {pGlobe > 0.001 ? (
          <g opacity={pGlobe}>
            <Glow x={GX} y={GY} r={GR * 1.6} color="cyan" opacity={0.4} />
            <circle cx={GX} cy={GY} r={GR} fill="#0f2a5a" stroke={C.cyan} strokeWidth={3} />
            {Array.from({length: 6}, (_, i) => {
              const ph = ((i / 6 + t * 0.05) % 1) * Math.PI;
              const rx = Math.abs(Math.cos(ph)) * GR;
              return <ellipse key={i} cx={GX} cy={GY} rx={rx} ry={GR} fill="none" stroke={C.cyan} strokeWidth={1.5} opacity={0.35} />;
            })}
            {[-0.5, 0, 0.5].map((f) => (
              <ellipse key={f} cx={GX} cy={GY + f * GR} rx={GR * Math.sqrt(1 - f * f)} ry={GR * 0.12 * Math.sqrt(1 - f * f)} fill="none" stroke={C.cyan} strokeWidth={1.5} opacity={0.35} />
            ))}
            {Array.from({length: 6}, (_, i) => {
              const per = 1.1 + rand(i) * 0.6;
              const raw = t / per + rand(i + 7);
              const cy = Math.floor(raw);
              const ph = raw - cy;
              const a1 = rand(i * 3 + cy) * Math.PI * 2;
              const a2 = a1 + 1.2 + rand(i * 5 + cy) * 2.4;
              const r1 = GR * (0.3 + 0.6 * rand(i + cy * 2.7));
              const r2 = GR * (0.3 + 0.6 * rand(i + cy * 3.1 + 1));
              const p1: [number, number] = [GX + Math.cos(a1) * r1, GY + Math.sin(a1) * r1];
              const p2: [number, number] = [GX + Math.cos(a2) * r2, GY + Math.sin(a2) * r2];
              const mx = (p1[0] + p2[0]) / 2 + (GX - (p1[0] + p2[0]) / 2) * -0.6;
              const my = (p1[1] + p2[1]) / 2 - 90;
              const u = Math.min(1, ph * 3);
              const bx = (1 - u) * (1 - u) * p1[0] + 2 * (1 - u) * u * mx + u * u * p2[0];
              const by = (1 - u) * (1 - u) * p1[1] + 2 * (1 - u) * u * my + u * u * p2[1];
              const o = cyc(ph);
              return (
                <g key={i} opacity={o}>
                  <path d={`M${p1[0]},${p1[1]} Q${mx},${my} ${p2[0]},${p2[1]}`} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={0.7} />
                  <circle cx={p1[0]} cy={p1[1]} r={5} fill={C.gold} />
                  <circle cx={p2[0]} cy={p2[1]} r={5} fill={C.gold} opacity={u} />
                  <Spark x={bx} y={by} r={5} color="gold" />
                </g>
              );
            })}
            <Label x={GX} y={GY + GR + 44} size={30} color={C.cyan} weight={600}>
              kabar tiba dalam sekejap
            </Label>
          </g>
        ) : null}

        {/* penutup: dua makna */}
        {pEnd > 0.001 ? (
          <g opacity={pEnd}>
            <Label x={560} y={720} size={32} color={C.kin} weight={600}>
              waktu terasa cepat
            </Label>
            <Twinkles x={560} y={470} rx={200} ry={180} n={5} color="kin" opacity={akrab} />
            <Twinkles x={GX} y={GY} rx={200} ry={180} n={5} color="cyan" opacity={akrab} />
            <Ripple x={1020} y={470} p={ramp(t, wordOf(4, 'akrab'), wordOf(4, 'akrab') + 1.6, (x) => x)} r={300} color="gold" />
            <Motes x={1020} y={470} rx={700} ry={300} n={30} color="gold" opacity={0.4} />
          </g>
        ) : null}
      </Stage>

      {/* daftar lima tanda */}
      <Card x={560} y={500} opacity={pList} scale={0.95 + 0.05 * pList} accent={C.kin} style={{padding: '26px 40px'}}>
        <div style={{fontFamily: FONT.sans, fontSize: 28, color: C.muted, marginBottom: 14}}>Kiamat tidak terjadi sampai…</div>
        {ITEMS.map((it, k) => (
          <div
            key={k}
            style={{
              fontFamily: FONT.head,
              fontSize: 46,
              fontWeight: 500,
              lineHeight: 1.42,
              opacity: itemP[k],
              transform: `translateX(${(1 - itemP[k]) * 24}px)`,
              display: 'block',
            }}
          >
            <span style={{color: it.c, fontWeight: 700, marginRight: 16}}>{k + 1}</span>
            {it.text}
          </div>
        ))}
      </Card>
      <Badge x={560} y={820} text="HR Bukhari" color={C.gold} opacity={pill1 * pList} scale={0.85 + 0.15 * pill1} />
      <Badge x={620} y={660} text="HR Bukhari & Muslim" color={C.gold} opacity={pill2 * pLamp} scale={0.85 + 0.15 * pill2} />

      {/* setahun ≈ sebulan */}
      <Card x={1560} y={480} opacity={setahun * pCal} scale={0.95 + 0.05 * setahun} accent={C.kin} style={{padding: '22px 36px'}}>
        <div style={{fontFamily: FONT.head, fontSize: 56, fontWeight: 600, textAlign: 'center', lineHeight: 1.2}}>
          setahun
          <br />
          <span style={{color: C.kin}}>≈ sebulan</span>
        </div>
        <div style={{fontFamily: FONT.sans, fontSize: 24, color: C.muted, textAlign: 'center', marginTop: 8}}>terasa</div>
      </Card>
    </AbsoluteFill>
  );
};
