import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN, EASE_IN_OUT, mix, ramp} from '../anim';
import {Badge, Card, Glow, Label, Motes, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Amanah yang disia-siakan (AUDIT): Bukhari 59 (amanah disia-siakan; urusan diserahkan bukan ahlinya);
// Bukhari 80–81 / Muslim 2671 (kebodohan, khamar, zina) — ditampilkan sebagai teks saja.
// Tangan = siluet sederhana tanpa wajah. Amanah = bola cahaya toska (callback adegan amanah).

const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

const HANDS = [330, 690, 1050, 1410];
const HY = 600; // puncak telapak
const FLOOR = 830;

const Hand: React.FC<{x: number; y: number; tilt: number; t: number; i: number}> = ({x, y, tilt, t, i}) => (
  <g transform={`translate(${x},${y + 4 * Math.sin(t * 1.2 + i)}) rotate(${tilt})`}>
    <path
      d="M-80,-8 Q-84,30 -40,50 L-28,190 L28,190 L40,50 Q84,30 82,-8 Q72,-20 62,-8 Q52,-22 40,-10 Q28,-24 16,-10 Q4,-22 -8,-10 Q-20,-20 -40,-10 L-56,-14 Q-74,-46 -96,-36 Q-104,-20 -80,-8 Z"
      fill="#25305e"
      stroke={C.cyan}
      strokeOpacity={0.35}
      strokeWidth={2.5}
    />
    <path d="M-50,10 Q0,36 56,10" fill="none" stroke="#3a4a86" strokeWidth={3} />
    {[-22, 6, 32].map((fx) => (
      <path key={fx} d={`M${fx},-8 L${fx + 2},14`} stroke="#3a4a86" strokeWidth={2.5} strokeLinecap="round" />
    ))}
  </g>
);

const Door: React.FC<{x: number; color: string; glow: number; t: number; label: string; lp: number; shake?: number}> = ({x, color, glow, t, label, lp}) => (
  <g>
    <Glow x={x} y={620} r={230} color={color === C.cyan ? 'cyan' : 'heat'} opacity={glow} />
    <path d={`M${x - 105},${FLOOR - 40} L${x - 105},470 Q${x},380 ${x + 105},470 L${x + 105},${FLOOR - 40} Z`} fill="#1a2550" stroke={color} strokeWidth={4} />
    <path d={`M${x - 78},${FLOOR - 70} L${x - 78},490 Q${x},420 ${x + 78},490 L${x + 78},${FLOOR - 70} Z`} fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={2} />
    <path d={`M${x - 78},610 L${x + 78},610`} stroke={color} strokeOpacity={0.3} strokeWidth={2} />
    {/* lubang kunci */}
    <circle cx={x + 58} cy={640} r={11} fill="#05070f" stroke={color} strokeWidth={2} />
    <path d={`M${x + 52},646 L${x + 64},646 L${x + 62},672 L${x + 54},672 Z`} fill="#05070f" />
    <circle cx={x + 58} cy={640} r={22 + 3 * Math.sin(t * 2)} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={2} />
    <Label x={x} y={FLOOR - 4} size={30} color={color} weight={600} opacity={lp}>
      {label}
    </Label>
  </g>
);

const Key: React.FC<{x: number; y: number; rot: number; glow: number}> = ({x, y, rot, glow}) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <Glow x={0} y={0} r={120} color="gold" opacity={glow} />
    <circle cx={-70} cy={0} r={34} fill="none" stroke={C.gold} strokeWidth={14} />
    <circle cx={-70} cy={0} r={10} fill={C.gold} opacity={0.5} />
    <rect x={-38} y={-7} width={140} height={14} rx={7} fill={C.gold} />
    <path d="M70,7 L70,30 L82,30 L82,7 M92,7 L92,22 L102,22 L102,7" fill={C.gold} stroke={C.gold} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-30} y={-4} width={120} height={3} rx={1.5} fill="#fff" opacity={0.5} />
  </g>
);

const Balance: React.FC<{x: number; s: number; tilt: number; t: number; op: number; orbGlow: number}> = ({x, s, tilt, t, op, orbGlow}) => {
  if (op <= 0.001) return null;
  const PY = 360;
  const L = 270;
  const th = (tilt * Math.PI) / 180;
  const ends: [number, number][] = [
    [-L * Math.cos(th), -L * Math.sin(th)],
    [L * Math.cos(th), L * Math.sin(th)],
  ];
  const sw = 2 * Math.sin(t * 1.4);
  return (
    <g opacity={op} transform={`translate(${x},${PY}) scale(${s})`}>
      <Glow x={0} y={60} r={360} color="gold" opacity={0.25} />
      <rect x={-10} y={0} width={20} height={430} rx={6} fill="#6b4a20" stroke={C.gold} strokeOpacity={0.6} />
      <path d="M-110,440 L110,440 L80,410 L-80,410 Z" fill="#5a3f1c" stroke={C.gold} strokeWidth={2} />
      <path d={`M${ends[0][0]},${ends[0][1]} L${ends[1][0]},${ends[1][1]}`} stroke={C.gold} strokeWidth={10} strokeLinecap="round" />
      <circle cx={0} cy={0} r={16} fill={C.gold} />
      <path d="M0,-34 L-8,-14 L8,-14 Z" fill={C.gold} transform={`rotate(${tilt})`} />
      {ends.map(([ex, ey], k) => {
        const px = ex + sw * (k ? -1 : 1);
        const py = ey + 160;
        return (
          <g key={k}>
            <path d={`M${ex},${ey} L${px - 70},${py} M${ex},${ey} L${px + 70},${py}`} stroke={C.gold} strokeOpacity={0.6} strokeWidth={2} />
            <path d={`M${px - 86},${py} Q${px},${py + 46} ${px + 86},${py} Z`} fill="#5a3f1c" stroke={C.gold} strokeWidth={3} />
            {k === 0 ? (
              <g>
                <Glow x={px} y={py - 22} r={70} color="cyan" opacity={orbGlow} />
                <circle cx={px} cy={py - 22} r={22} fill={interpolateColors(orbGlow, [0, 1], ['#4a5a7a', C.cyan])} />
                <circle cx={px - 7} cy={py - 29} r={6} fill="#fff" opacity={0.3 + 0.4 * orbGlow} />
              </g>
            ) : (
              <g>
                {[
                  [-44, -16],
                  [-10, -18],
                  [26, -16],
                  [-28, -46],
                  [8, -48],
                  [-8, -76],
                ].map(([dx, dy], j) => (
                  <rect key={j} x={px + dx - 17} y={py + dy - 14} width={34} height={28} rx={5} fill="#7a3a2a" stroke={C.kin} strokeWidth={2} opacity={0.9} />
                ))}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

const SIGNS = [
  {w: 'kebodohan', text: 'kebodohan merebak'},
  {w: 'khamar', text: 'khamar diminum'},
  {w: 'perzinaan', text: 'zina tampak terang-terangan'},
];

export const Trust: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // 1 — bola amanah dioper lalu dijatuhkan
  const pH = slot(t, -0.4, cue(1) + 0.4, 0.8, 0.8);
  const tA = wordOf(0, 'amanah');
  const hop = (k: number) => mix(cue(0) - 0.2, tA - 1.4, k / 2);
  const tDrop = wordOf(0, 'disia');
  let ox = HANDS[0];
  let oy = HY - 24;
  for (let k = 0; k < 3; k++) {
    const u = ramp(t, hop(k), hop(k) + 1.2, EASE_IN_OUT);
    if (t >= hop(k)) {
      ox = mix(HANDS[k], HANDS[k + 1], u);
      oy = HY - 24 - 170 * 4 * u * (1 - u);
    }
  }
  const tilt3 = 38 * ramp(t, tDrop - 0.3, tDrop + 0.5, EASE_IN_OUT);
  const fall = ramp(t, tDrop + 0.2, tDrop + 1.0, EASE_IN);
  const bounce = Math.abs(Math.sin(Math.PI * ramp(t, tDrop + 1.0, tDrop + 1.5))) * 40;
  if (t >= tDrop + 0.2) {
    ox = mix(HANDS[3] + 30, HANDS[3] + 150, ramp(t, tDrop + 0.2, tDrop + 1.5));
    oy = mix(HY - 30, FLOOR - 22, fall) - bounce;
  }
  const dim = ramp(t, tDrop + 1.1, tDrop + 2.6);
  const orbCol = interpolateColors(dim, [0, 1], [C.cyan, '#4a5a7a']);
  const tunggu = ramp(t, wordOf(0, 'tunggulah'), wordOf(0, 'tunggulah') + 0.6);

  // 2 — kunci ke pintu yang salah
  const pK = slot(t, cue(1) - 0.1, cue(2) + 0.3, 0.7, 0.7);
  const tGive = wordOf(1, 'diserahkan');
  const move = ramp(t, tGive - 0.3, wordOf(1, 'orang') + 0.3, EASE_IN_OUT);
  const DA = 1100;
  const DB = 1500;
  const kxEnd = DB + 58 - 102;
  const kx = mix(420, kxEnd, move);
  const ky = mix(560, 640, move) - 120 * 4 * move * (1 - move);
  const tBukan = wordOf(1, 'bukan');
  const shakeEnv = Math.sin(Math.PI * ramp(t, tBukan - 0.1, tBukan + 1.4));
  const rot = 9 * Math.sin(t * 28) * shakeEnv;
  const bukan = ramp(t, tBukan, tBukan + 0.5, BACK);
  const pill2 = ramp(t, wordOf(1, 'Hadis'), wordOf(1, 'Hadis') + 0.5);

  // 3 — timbangan miring
  const shift = ramp(t, cue(3) - 0.2, cue(3) + 1.0, EASE_IN_OUT);
  const pB = ramp(t, cue(2) + 0.1, cue(2) + 0.9);
  // sisi kanan (tumpukan) lebih berat → turun; bola amanah di kiri terangkat
  const tiltB = 3 * ramp(t, cue(2), cue(2) + 1) + 10 * ramp(t, wordOf(2, 'Akhir'), wordOf(2, 'diukur') + 0.6, EASE_IN_OUT) + 5 * ramp(t, cue(3) + 1, cue(3) + 4, EASE_IN_OUT);
  const tiltNow = tiltB + 0.8 * Math.sin(t * 0.9);
  const bX = mix(960, 1400, shift);
  const bS = mix(1, 0.74, shift);
  const thB = (tiltNow * Math.PI) / 180;
  const amX = bX - 270 * Math.cos(thB) * bS;
  const amY = 360 + (-270 * Math.sin(thB) + 225) * bS;
  const sama = ramp(t, wordOf(2, 'sama'), wordOf(2, 'sama') + 0.6);

  // 4 — tanda berikutnya (teks)
  const pL = ramp(t, cue(3) + 0.4, cue(3) + 1.1);
  const sp = SIGNS.map((s) => ramp(t, wordOf(3, s.w) - 0.1, wordOf(3, s.w) + 0.5));
  const pill4 = ramp(t, wordOf(3, 'Hadis'), wordOf(3, 'Hadis') + 0.5);

  return (
    <AbsoluteFill>
      <Stage>
        {/* 1: tangan & bola amanah */}
        {pH > 0.001 ? (
          <g opacity={pH}>
            <path d={`M140,${FLOOR} L1780,${FLOOR}`} stroke={C.line} strokeWidth={3} opacity={0.8} />
            {HANDS.map((x, i) => (
              <Hand key={i} x={x} y={HY} tilt={i === 3 ? tilt3 : 0} t={t} i={i} />
            ))}
            {/* lintasan oper */}
            {HANDS.slice(0, 3).map((x, k) => (
              <path
                key={k}
                d={`M${x},${HY - 30} Q${(x + HANDS[k + 1]) / 2},${HY - 370} ${HANDS[k + 1]},${HY - 30}`}
                fill="none"
                stroke={C.cyan}
                strokeWidth={2}
                strokeDasharray="6 10"
                opacity={0.25 * ramp(t, hop(k), hop(k) + 0.6)}
              />
            ))}
            <Glow x={ox} y={oy} r={110 * (1 - 0.6 * dim)} color="cyan" opacity={1 - 0.7 * dim} />
            <circle cx={ox} cy={oy} r={24} fill={orbCol} />
            <circle cx={ox - 8} cy={oy - 8} r={7} fill="#fff" opacity={0.6 - 0.4 * dim} />
            <Motes x={ox} y={oy} rx={80} ry={60} n={14} color="cyan" opacity={0.6 * (1 - dim)} />
            <Label x={ox} y={oy - 62} size={28} color={C.cyan} weight={600} opacity={1 - dim}>
              amanah
            </Label>
            <Ripple x={HANDS[3] + 150} y={FLOOR - 10} p={ramp(t, tDrop + 1.0, tDrop + 2.4, (x) => x)} r={160} color="heat" />
            <Label x={960} y={250} size={44} color={C.heat} weight={600} opacity={tunggu}>
              …maka tunggulah kiamat
            </Label>
          </g>
        ) : null}

        {/* 2: kunci & pintu */}
        {pK > 0.001 ? (
          <g opacity={pK}>
            <path d={`M900,${FLOOR - 40} L1720,${FLOOR - 40}`} stroke={C.line} strokeWidth={3} />
            <Door x={DA} color={C.cyan} glow={0.35 + 0.15 * Math.sin(t * 1.5)} t={t} label="ahlinya" lp={ramp(t, cue(1) + 0.6, cue(1) + 1.2)} />
            <Door x={DB} color={C.heat} glow={0.25 + 0.6 * bukan} t={t} label="bukan ahlinya" lp={bukan} />
            <Key x={kx} y={ky} rot={rot} glow={0.6 + 0.2 * Math.sin(t * 2)} />
            <Label x={420} y={420} size={30} color={C.gold} font="sans" opacity={1 - move}>
              urusan
            </Label>
            {/* tanda silang saat tak cocok */}
            <g opacity={bukan} transform={`translate(${DB + 58},${560}) scale(${0.6 + 0.4 * bukan})`}>
              <circle cx={0} cy={0} r={34} fill="rgba(10,16,36,0.9)" stroke={C.heat} strokeWidth={4} />
              <path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke={C.heat} strokeWidth={6} strokeLinecap="round" />
            </g>
            <Ripple x={DB + 58} y={640} p={ramp(t, tBukan, tBukan + 1.4, (x) => x)} r={140} color="heat" />
          </g>
        ) : null}

        {/* 3–4: timbangan */}
        <Balance x={bX} s={bS} tilt={tiltNow} t={t} op={pB} orbGlow={0.35 + 0.15 * Math.sin(t * 2)} />
        {pB > 0.001 ? (
          <g opacity={pB}>
            <Label x={amX} y={amY} size={30} color={C.cyan} weight={600}>
              amanah
            </Label>
            <Twinkles x={mix(960, 1400, shift)} y={360} rx={260} ry={120} n={4} opacity={sama * (1 - shift)} />
            <Spark x={mix(960, 1400, shift)} y={360} r={6} color="gold" opacity={0.6 + 0.3 * Math.sin(t * 3)} />
          </g>
        ) : null}
      </Stage>

      <Badge x={DB} y={300} text="HR Bukhari" color={C.gold} opacity={pill2 * pK} scale={0.85 + 0.15 * pill2} />

      {/* 4: daftar tanda berikutnya */}
      <Card x={590} y={490} opacity={pL} scale={0.95 + 0.05 * pL} accent={C.kin} style={{padding: '26px 42px'}}>
        <div style={{fontFamily: FONT.sans, fontSize: 28, color: C.muted, marginBottom: 14}}>Tanda-tanda berikutnya</div>
        {SIGNS.map((s, k) => (
          <div key={k} style={{fontFamily: FONT.head, fontSize: 50, fontWeight: 500, lineHeight: 1.45, opacity: sp[k], transform: `translateX(${(1 - sp[k]) * 24}px)`}}>
            <span style={{color: C.kin, fontWeight: 700, marginRight: 18}}>•</span>
            {s.text}
          </div>
        ))}
      </Card>
      <Badge x={590} y={720} text="HR Bukhari" color={C.gold} opacity={pill4 * pL} scale={0.85 + 0.15 * pill4} />
    </AbsoluteFill>
  );
};
