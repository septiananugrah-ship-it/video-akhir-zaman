import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, pathOf, ramp, rand, win} from '../anim';
import {Badge, Glow, Label, Motes, Note, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bekal: 10 ayat pertama Al-Kahfi (Muslim 809) · doa 4 perlindungan (Muslim 588) · tiga lampu (amanah, ilmu, jernih)
// · jam pasir "kiamat setiap orang = wafat" · tangan menanam bibit yang tumbuh saat langit menggelap (HR Ahmad).
const fr = (v: number) => ((v % 1) + 1) % 1;
const GY = 770;

const star8 = (cx: number, cy: number, r: number) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.55 : r;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return pathOf(pts) + ' Z';
};

const PROT = [
  {k: 'neraka', l: 'azab neraka'},
  {k: 'kubur', l: 'azab kubur'},
  {k: 'hidup', l: 'fitnah hidup & mati'},
  {k: 'dajjal', l: 'fitnah Al-Masih Ad-Dajjal'},
];
const LAMPS = [
  {k: 'amanah', l: 'amanah', x: 560},
  {k: 'ilmu', l: 'ilmu dari ahlinya', x: 960},
  {k: 'jernih', l: 'hati jernih', x: 1360},
];

const ProtIcon: React.FC<{k: number; t: number}> = ({k, t}) => {
  if (k === 0)
    return (
      <g>
        {[-14, 0, 14].map((x, j) => {
          const h = 34 + 10 * Math.sin(t * 6 + j * 2);
          return <path key={j} d={`M${x - 10},20 Q${x - 6},${20 - h * 0.6} ${x},${20 - h} Q${x + 6},${20 - h * 0.6} ${x + 10},20 Z`} fill={j === 1 ? C.kin : C.heat} opacity={0.85} />;
        })}
      </g>
    );
  if (k === 1)
    return (
      <g>
        <path d="M-36,22 Q0,-14 36,22 Z" fill="#5a4636" stroke="#a08670" strokeWidth={2} />
        {[0, 1, 2].map((j) => {
          const u = fr(t * 0.4 + j / 3);
          return <circle key={j} cx={-14 + j * 14} cy={10 - u * 30} r={2.5} fill={C.muted} opacity={cyc(u) * 0.7} />;
        })}
      </g>
    );
  if (k === 2) {
    const off = fr(t * 0.5) * 80;
    const pts = Array.from({length: 40}, (_, j) => {
      const x = -40 + j * 2;
      const ph = ((x + 40 + off) % 80) / 80;
      const y = ph > 0.42 && ph < 0.58 ? -26 * Math.sin(((ph - 0.42) / 0.16) * Math.PI * 2) : 0;
      return [x, y] as [number, number];
    });
    return <path d={pathOf(pts)} fill="none" stroke={C.work} strokeWidth={3} strokeLinejoin="round" />;
  }
  return (
    <g>
      <path d={star8(0, 0, 30)} fill={C.spr} fillOpacity={0.3} stroke={C.spr} strokeWidth={2} transform={`rotate(${t * 15})`} />
      <circle r={9} fill={C.spr} />
    </g>
  );
};

const Lantern: React.FC<{on: number; t: number; seed: number}> = ({on, t, seed}) => {
  const fl = 1 + 0.12 * Math.sin(t * 9 + seed) + 0.06 * Math.sin(t * 17 + seed);
  return (
    <g>
      <line x1={0} y1={-170} x2={0} y2={-120} stroke={C.gold} strokeWidth={2} />
      <Glow x={0} y={-40} r={120 + 90 * on} color="gold" opacity={0.15 + 0.85 * on} />
      <path d="M-30,-120 L30,-120 L22,-104 L-22,-104 Z" fill={C.gold} />
      <path d="M-40,-104 C-56,-60 -56,-10 -36,24 L36,24 C56,-10 56,-60 40,-104 Z" fill="#1d2a52" fillOpacity={0.6} stroke={C.gold} strokeWidth={3} />
      <path d={`M0,${-6} C-12,-20 -10,${-40 * fl} 0,${-62 * fl} C10,${-40 * fl} 12,-20 0,-6 Z`} fill={C.force} opacity={0.15 + 0.85 * on} />
      <path d={`M0,-12 C-5,-20 -4,${-32 * fl} 0,${-44 * fl} C4,${-32 * fl} 5,-20 0,-12 Z`} fill="#fff" opacity={on * 0.9} />
      <path d="M-36,24 L36,24 L28,42 L-28,42 Z" fill={C.gold} />
    </g>
  );
};

export const Provision: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  const ask = win(t, cue(0) - 0.3, cue(1) - 0.1, 0.6, 0.6);
  const kahfi = win(t, cue(1) - 0.2, cue(2) - 0.1, 0.7, 0.7);
  const cnt = ramp(t, wordOf(1, 'sepuluh') - 0.2, wordOf(1, 'kahfi') + 1.4, (x) => x);
  const shield = ramp(t, wordOf(1, 'terlindung') - 0.2, wordOf(1, 'terlindung') + 0.8);
  const pK = win(t, wordOf(1, 'muslim') - 0.3, cue(2) - 0.1, 0.5, 0.6);
  const doa = win(t, cue(2) - 0.2, cue(3) - 0.1, 0.7, 0.7);
  const pD = win(t, wordOf(2, 'muslim') - 0.3, cue(3) - 0.1, 0.5, 0.6);
  const lamps = win(t, cue(3) - 0.2, cue(4) - 0.1, 0.7, 0.7);
  const glass = win(t, cue(4) - 0.2, cue(5) + 0.2, 0.7, 0.7);
  const wafat = ramp(t, wordOf(4, 'wafat') - 0.3, wordOf(4, 'wafat') + 0.5);
  const kapan = ramp(t, wordOf(4, 'kapan') - 0.3, wordOf(4, 'kapan') + 0.5);
  const plant = ramp(t, cue(5) - 0.3, cue(5) + 0.9);
  const handIn = ramp(t, cue(5), wordOf(5, 'bibit') + 0.6, EASE_IN_OUT);
  const drop = ramp(t, wordOf(5, 'menanamnya') - 0.2, wordOf(5, 'menanamnya') + 0.8, EASE_IN_OUT);
  const handOut = ramp(t, wordOf(5, 'tanamlah') + 0.3, wordOf(5, 'tanamlah') + 1.8, EASE_IN_OUT);
  const growP = ramp(t, wordOf(5, 'tanamlah') - 0.2, dur - 0.8, EASE_IN_OUT);
  const dark = ramp(t, cue(5) + 1, dur - 1, EASE_IN_OUT);
  const tanam = ramp(t, wordOf(5, 'tanamlah') - 0.2, wordOf(5, 'tanamlah') + 0.6);
  const pA = ramp(t, wordOf(5, 'ahmad') - 0.3, wordOf(5, 'ahmad') + 0.4);
  const SY = GY - 4;
  const stemH = 220 * growP;
  const sway = 5 * Math.sin(t * 1.2) * growP;
  const leaf = (k: number) => ramp(growP, 0.2 + k * 0.18, 0.5 + k * 0.18, BACK);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* 0: pertanyaan + kompas kecil */}
        <g opacity={ask} transform="translate(960 600)">
          <circle r={90} fill="none" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} />
          <path d={star8(0, 0, 70)} fill="none" stroke={C.gold} strokeOpacity={0.4} strokeWidth={1.5} transform={`rotate(${t * 8})`} />
          <path d="M0,-70 L10,0 L0,70 L-10,0 Z" fill={C.cyan} opacity={0.8} transform={`rotate(${20 * Math.sin(t * 0.9)})`} />
        </g>

        {/* 1: Al-Kahfi + 10 ayat pertama */}
        <g opacity={kahfi}>
          <Glow x={960} y={400} r={420} color="gold" opacity={0.3} />
          <rect x={600} y={300} width={720} height={190} rx={18} fill="#10173a" stroke={C.gold} strokeWidth={3} />
          <rect x={614} y={314} width={692} height={162} rx={12} fill="none" stroke={C.gold} strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="6 6" strokeDashoffset={-t * 10} />
          {[
            [600, 300],
            [1320, 300],
            [600, 490],
            [1320, 490],
          ].map(([x, y], k) => (
            <path key={k} d={star8(x, y, 22)} fill="#10173a" stroke={C.gold} strokeWidth={2} transform={`rotate(${t * 12 * (k % 2 ? 1 : -1)} ${x} ${y})`} />
          ))}
          <text x={960} y={385} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontSize={72} fontWeight={600} fill={C.gold}>
            Al-Kahfi
          </text>
          <text x={960} y={448} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={24} fill={C.muted}>
            surah ke-18 · hafalkan 10 ayat pertama
          </text>
          {Array.from({length: 10}, (_, k) => {
            const x = 960 + (k - 4.5) * 92;
            const on = ramp(cnt, k / 10, k / 10 + 0.08);
            return (
              <g key={k}>
                <Glow x={x} y={630} r={60} color="gold" opacity={on * 0.7} still />
                <circle cx={x} cy={630} r={30} fill={interpolateColors(on, [0, 1], ['#0d1430', '#3a2e10'])} stroke={C.gold} strokeOpacity={0.3 + 0.7 * on} strokeWidth={3} />
                <text x={x} y={631} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={24} fontWeight={600} fill={C.gold} opacity={0.35 + 0.65 * on}>
                  {k + 1}
                </text>
              </g>
            );
          })}
          <g opacity={shield}>
            <path d="M470,700 C520,540 1400,540 1450,700" fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.8} />
            <path d="M470,700 C520,540 1400,540 1450,700" fill="none" stroke={C.cyan} strokeWidth={18} opacity={0.15 + 0.1 * Math.sin(t * 2)} />
            <Label x={960} y={730} size={26} color={C.cyan}>
              terlindung dari fitnah Dajjal
            </Label>
          </g>
          <Ripple x={960} y={630} p={(t - wordOf(1, 'terlindung')) / 1.6} r={520} color="cyan" rings={3} />
        </g>

        {/* 2: doa empat perlindungan */}
        <g opacity={doa}>
          {PROT.map((p, k) => {
            const x = 960 + (k - 1.5) * 330;
            const on = ramp(t, wordOf(2, p.k) - 0.3, wordOf(2, p.k) + 0.5);
            const col = k === 3 ? C.spr : k === 2 ? C.work : k === 1 ? C.muted : C.heat;
            return (
              <g key={p.k} transform={`translate(${x} ${560 + 4 * Math.sin(t * 1.1 + k)})`} opacity={0.3 + 0.7 * on}>
                <Glow x={0} y={0} r={170} color="cyan" opacity={on * 0.4} />
                <rect x={-140} y={-110} width={280} height={220} rx={18} fill="#0f1838" stroke={col} strokeOpacity={0.7} strokeWidth={2} />
                <g transform="translate(0 -20)">
                  <ProtIcon k={k} t={t} />
                </g>
                <path d={`M0,-96 C-50,-96 -80,-80 -80,-60 L-80,-10 C-80,40 -30,70 0,84 C30,70 80,40 80,-10 L80,-60 C80,-80 50,-96 0,-96 Z`} fill="none" stroke={C.cyan} strokeWidth={3} opacity={on * (0.6 + 0.3 * Math.sin(t * 2 + k))} transform="scale(0.85) translate(0 -20)" />
                <text y={80} textAnchor="middle" fontFamily={FONT.head} fontSize={k === 3 ? 21 : 25} fontWeight={600} fill={C.ink}>
                  {p.l}
                </text>
              </g>
            );
          })}
        </g>

        {/* 3: tiga lampu */}
        <g opacity={lamps}>
          {LAMPS.map((l, k) => {
            const on = ramp(t, wordOf(3, l.k) - 0.2, wordOf(3, l.k) + 0.8);
            return (
              <g key={l.k} transform={`translate(${l.x} ${560 + 6 * Math.sin(t * 0.9 + k)}) rotate(${2 * Math.sin(t * 0.8 + k)} 0 -170)`}>
                <Lantern on={on} t={t} seed={k * 2} />
                <text y={110} textAnchor="middle" fontFamily={FONT.head} fontSize={32} fontWeight={600} fill={C.gold} opacity={0.4 + 0.6 * on}>
                  {l.l}
                </text>
              </g>
            );
          })}
          <Motes x={960} y={520} rx={560} ry={180} n={24} color="gold" opacity={0.5} seed={4} />
        </g>

        {/* 4: jam pasir */}
        <g opacity={glass} transform={`translate(960 ${560 + 3 * Math.sin(t)})`}>
          <Glow x={0} y={0} r={240} color="cyan" opacity={0.3} />
          <rect x={-100} y={-170} width={200} height={16} rx={6} fill={C.gold} />
          <rect x={-100} y={154} width={200} height={16} rx={6} fill={C.gold} />
          <path d="M-80,-154 C-80,-60 -12,-30 -12,0 C-12,30 -80,60 -80,154 L80,154 C80,60 12,30 12,0 C12,-30 80,-60 80,-154 Z" fill="#cfefff" fillOpacity={0.08} stroke="#cfefff" strokeOpacity={0.6} strokeWidth={3} />
          {(() => {
            const u = fr((t - cue(4)) / 8);
            const top = 1 - u;
            return (
              <g>
                <path d={`M${-70 * top},${-20 - 110 * top} L${70 * top},${-20 - 110 * top} L12,-6 L-12,-6 Z`} fill={C.gold} opacity={0.75} />
                <path d={`M-74,150 L74,150 L${60 * u + 8},${150 - 90 * u} L${-60 * u - 8},${150 - 90 * u} Z`} fill={C.gold} opacity={0.75} />
                {Array.from({length: 6}, (_, k) => {
                  const q = fr(t * 1.6 + k / 6);
                  return <circle key={k} cx={0.6 * Math.sin(k)} cy={-4 + q * (150 - 90 * u)} r={2.2} fill={C.gold} opacity={0.9} />;
                })}
              </g>
            );
          })()}
        </g>
        <Label x={960} y={790} size={28} color={C.muted} opacity={kapan * glass}>
          bisa datang kapan saja
        </Label>

        {/* 5: menanam bibit saat langit menggelap */}
        <g opacity={plant}>
          <rect x={0} y={0} width={1920} height={GY} fill="#02030a" opacity={0.55 * dark} />
          <rect x={0} y={GY} width={1920} height={140} fill="url(#ground)" />
          <line x1={120} y1={GY} x2={1800} y2={GY} stroke="#4a3b2e" strokeWidth={3} />
          <path d={`M820,${GY} Q960,${GY - 36} 1100,${GY} Z`} fill="#4a3627" />
          <Glow x={960} y={SY - stemH * 0.6} r={160 + 160 * growP} color="work" opacity={0.25 + 0.6 * growP} />
          {/* batang & daun */}
          <path d={`M960,${SY} C${960 + sway * 0.3},${SY - stemH * 0.4} ${960 - sway * 0.5},${SY - stemH * 0.7} ${960 + sway},${SY - stemH}`} fill="none" stroke={C.work} strokeWidth={5 + 4 * growP} strokeLinecap="round" opacity={ramp(growP, 0, 0.05)} />
          {[0, 1, 2].map((k) => {
            const p = leaf(k);
            const y = SY - stemH * (0.35 + k * 0.25);
            const sd = k % 2 ? -1 : 1;
            const L = 70 * p * (1 - k * 0.15);
            return p > 0.001 ? (
              <path
                key={k}
                d={`M${960 + sway * (0.4 + k * 0.25)},${y} C${960 + sd * L * 0.3},${y - L * 0.5} ${960 + sd * L},${y - L * 0.4} ${960 + sd * L * 1.1},${y - 4} C${960 + sd * L * 0.8},${y + L * 0.15} ${960 + sd * L * 0.3},${y + 6} ${960 + sway * (0.4 + k * 0.25)},${y} Z`}
                fill={C.work}
                opacity={0.9}
                transform={`rotate(${sd * 4 * Math.sin(t * 1.3 + k)} 960 ${y})`}
              />
            ) : null;
          })}
          {/* benih */}
          <circle cx={mix(1040, 960, drop)} cy={mix(560, SY - 10, drop)} r={9} fill="#c9a26a" opacity={ramp(handIn, 0.6, 1) * (1 - ramp(growP, 0.02, 0.1))} />
          {/* siluet tangan (umum, tanpa wajah) */}
          <g transform={`translate(${mix(1700, 1060, handIn) + 500 * handOut} ${mix(300, 540, handIn) + 70 * drop - 240 * handOut}) rotate(-28)`} opacity={1 - handOut}>
            <path d="M40,-10 L420,-60 L430,40 L40,46 Z" fill="#2a3560" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} />
            <path d="M-60,10 C-70,-30 -30,-46 20,-40 L60,-34 C70,-10 70,30 60,46 L0,52 C-40,52 -56,36 -60,10 Z" fill="#2a3560" stroke={C.gold} strokeOpacity={0.6} strokeWidth={2.5} />
            <path d="M-60,10 C-80,8 -92,0 -96,-8 C-80,-12 -66,-8 -56,-2" fill="#2a3560" stroke={C.gold} strokeOpacity={0.6} strokeWidth={2.5} />
            <path d="M-30,46 C-40,60 -60,64 -78,58" fill="none" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2.5} />
          </g>
          <Spark x={960 + sway} y={SY - stemH - 6} r={4} color="work" opacity={growP * (0.6 + 0.4 * Math.sin(t * 3))} />
          <Twinkles x={960} y={SY - stemH * 0.6} rx={160} ry={120} n={5} color="work" opacity={growP} seed={5} />
          {Array.from({length: 12}, (_, k) => {
            const u = fr(t * 0.15 + rand(k));
            return <circle key={k} cx={300 + rand(k * 3.3) * 1320} cy={GY - 20 - u * 500} r={1.8} fill={C.work} opacity={cyc(u) * 0.5 * growP} />;
          })}
        </g>
        <Ripple x={960} y={SY} p={(t - wordOf(5, 'tanamlah')) / 1.6} r={300} color="work" rings={3} />
      </Stage>

      <Note x={960} y={380} p={ask} color={C.gold} size={46}>
        Lalu, apa yang harus kita lakukan?
      </Note>
      <Badge x={960} y={235} text="HR Muslim" color={C.gold} opacity={Math.max(pK, pD)} scale={0.95 + 0.05 * Math.max(pK, pD)} size={24} />
      <Note x={960} y={330} p={doa} color={C.cyan} size={34}>
        doa di akhir salat: <span style={{color: C.cyan}}>berlindung kepada Allah</span> dari…
      </Note>
      <Note x={960} y={290} p={wafat * glass} color={C.cyan} size={40}>
        kiamat setiap orang = <span style={{color: C.cyan}}>saat ia wafat</span>
      </Note>
      <Badge x={960} y={235} text="HR Ahmad" color={C.gold} opacity={pA} scale={0.9 + 0.1 * pA} size={24} />
      <Note x={960} y={330} p={tanam} color={C.work} size={56}>
        <span style={{color: C.work, fontWeight: 700}}>tanamlah.</span>
      </Note>
    </AbsoluteFill>
  );
};
