import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath, win} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Spark, Stage, Twinkles, pointAlong} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {Renungan} from './Peak';

// Renungan (bukan tafsir): jejak 40 hari di peta (Muslim 2937) → daya bayang zaman sahabat (unta) vs zaman kita (pesawat & internet)
// → kabut "belum terbayangkan" → "perkirakanlah waktunya" (HR Muslim) → wilayah gaib (milik Allah) di samping wilayah akal yang terang.
const fr = (v: number) => ((v % 1) + 1) % 1;
const MAP = {x: 300, y: 240, w: 1320, h: 470};
const blob = (cx: number, cy: number, rx: number, ry: number, seed: number) =>
  smoothPath(
    Array.from({length: 13}, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const k = 0.75 + 0.35 * rand(seed * 7 + (i % 12));
      return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as [number, number];
    }),
  );
const LANDS = [
  blob(560, 380, 150, 90, 1),
  blob(620, 580, 90, 100, 2),
  blob(930, 360, 190, 80, 3),
  blob(980, 560, 120, 110, 4),
  blob(1300, 400, 200, 100, 5),
  blob(1400, 610, 110, 60, 6),
];
const TRAIL: [number, number][] = [
  [980, 470],
  [900, 380],
  [760, 340],
  [560, 360],
  [520, 470],
  [640, 590],
  [920, 600],
  [1010, 520],
  [1180, 380],
  [1360, 360],
  [1450, 470],
  [1380, 610],
  [1180, 640],
];
const TRAIL_D = smoothPath(TRAIL);
const ROWS = [
  {y: 360, key: 'sahabat', label: 'zaman sahabat', fill: 0.18, hue: 'gold' as const},
  {y: 520, key: 'pesawat', label: 'zaman kita', fill: 0.5, hue: 'cyan' as const},
  {y: 680, key: 'generasi', label: 'generasi setelah kita', fill: 0.95, hue: 'spr' as const},
];
const BX0 = 640;
const BX1 = 1560;

const Camel: React.FC<{t: number}> = ({t}) => {
  const s = Math.sin(t * 3);
  return (
    <g transform={`translate(0 ${1.5 * Math.abs(s)})`}>
      <path d="M-40,0 C-40,-22 -28,-34 -16,-30 C-10,-46 4,-46 8,-30 C14,-44 26,-40 28,-26 L38,-40 L46,-42 L48,-34 L40,-30 L34,-8 C30,0 -36,4 -40,0 Z" fill="#c9a26a" />
      {[-30, -16, 14, 28].map((x, i) => (
        <line key={i} x1={x} y1={0} x2={x + (i % 2 ? -1 : 1) * 5 * s} y2={26} stroke="#c9a26a" strokeWidth={4} strokeLinecap="round" />
      ))}
    </g>
  );
};
const Plane: React.FC<{t: number}> = ({t}) => (
  <g transform={`translate(${-12 + 4 * Math.sin(t * 1.4)} ${2 * Math.sin(t * 2)})`}>
    <path d="M-36,0 L30,-4 C40,-4 44,0 40,3 L-36,6 Z" fill="#dfe8ff" />
    <path d="M-2,0 L-18,-24 L-8,-24 L12,0 Z M-2,4 L-18,26 L-8,26 L12,4 Z M-30,0 L-38,-14 L-32,-14 L-24,0 Z" fill={C.cyan} />
    {[0, 1, 2].map((k) => {
      const q = fr(t * 0.8 + k / 3);
      return <path key={k} d={`M${42},${-22 - q * 18} a${10 + q * 16},${10 + q * 16} 0 0 1 ${20 + q * 32},0`} fill="none" stroke={C.cyan} strokeWidth={2.5} opacity={cyc(q)} transform="translate(-14 4)" />;
    })}
  </g>
);

export const Unseen: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  const map = win(t, cue(0) - 0.4, cue(1) - 0.1, 0.7, 0.7);
  const draw = ramp(t, cue(0) + 0.6, wordOf(0, 'hari') + 0.8, EASE_IN_OUT);
  const day = 1 + Math.round(39 * draw);
  const year = win(t, wordOf(0, 'setahun') - 0.4, cue(1) - 0.1, 0.5, 0.6);
  const bars = win(t, cue(1) - 0.2, cue(3) - 0.1, 0.6, 0.7);
  const rowOn = [ramp(t, cue(1) - 0.2, cue(1) + 0.6), ramp(t, wordOf(1, 'kita') - 0.3, wordOf(1, 'kita') + 0.4), ramp(t, cue(2) - 0.2, cue(2) + 0.6)];
  const rowFill = [ramp(t, wordOf(1, 'sahabat'), wordOf(1, 'membayangkan') + 0.8), ramp(t, wordOf(1, 'pesawat'), wordOf(1, 'membayangkannya') + 0.6), ramp(t, wordOf(2, 'generasi'), wordOf(2, 'belum') + 1.2)];
  const fog = ramp(t, cue(2) + 0.2, cue(2) + 2);
  const belum = ramp(t, wordOf(2, 'belum') - 0.2, wordOf(2, 'belum') + 0.8);
  const clock = win(t, cue(3) - 0.2, cue(4) - 0.1, 0.7, 0.7);
  const perk = ramp(t, wordOf(3, 'perkirakanlah') - 0.2, wordOf(3, 'perkirakanlah') + 0.6);
  const pM = win(t, wordOf(3, 'perkirakanlah'), cue(4) - 0.1, 0.5, 0.6);
  const guide = ramp(t, wordOf(3, 'petunjuk') - 0.4, wordOf(3, 'petunjuk') + 0.4);
  const akal = ramp(t, cue(4) - 0.2, cue(4) + 0.9);
  const gaib = ramp(t, wordOf(4, 'gaib') - 0.3, wordOf(4, 'gaib') + 0.9);
  const head = pointAlong(TRAIL, draw);
  const hSpin = t * (0.2 + 1.6 * clock);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* peta & jejak 40 hari */}
        <g opacity={map}>
          <rect x={MAP.x} y={MAP.y} width={MAP.w} height={MAP.h} rx={20} fill="#0b1430" stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} />
          {Array.from({length: 7}, (_, k) => (
            <line key={k} x1={MAP.x + 20} y1={MAP.y + 60 + k * 60} x2={MAP.x + MAP.w - 20} y2={MAP.y + 60 + k * 60} stroke={C.grid} strokeWidth={1} />
          ))}
          {LANDS.map((d, k) => (
            <path key={k} d={d} fill="#1d3358" stroke="#4e6fa8" strokeOpacity={0.6} strokeWidth={1.5} />
          ))}
          <DrawPath d={TRAIL_D} p={draw} stroke="spr" width={4} halo />
          {TRAIL.map(([x, y], k) => {
            const on = ramp(draw, k / (TRAIL.length - 1) - 0.02, k / (TRAIL.length - 1) + 0.05);
            return <circle key={k} cx={x} cy={y} r={6 + 2 * Math.sin(t * 3 + k)} fill={C.spr} opacity={on} />;
          })}
          <Spark x={head[0]} y={head[1]} r={7} color="spr" opacity={ramp(draw, 0, 0.03) * (0.8 + 0.2 * Math.sin(t * 3))} />
          {/* penghitung hari */}
          <rect x={MAP.x + MAP.w - 270} y={MAP.y + 20} width={250} height={70} rx={12} fill="#120d2c" stroke={C.spr} strokeWidth={2} />
          <text x={MAP.x + MAP.w - 145} y={MAP.y + 55} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={30} fontWeight={600} fill={C.ink}>
            hari {day} / 40
          </text>
          <Label x={MAP.x + 40} y={MAP.y + 40} size={22} color={C.muted} anchor="start" opacity={0.85}>
            seluruh negeri (ilustrasi)
          </Label>
          {/* 1 hari seperti setahun */}
          <g opacity={year} transform={`translate(${MAP.x + 170} ${MAP.y + MAP.h - 70})`}>
            <rect x={-130} y={-44} width={330} height={88} rx={12} fill="#120d2c" stroke={C.gold} strokeWidth={2} />
            <circle cx={-80} cy={0} r={28} fill="none" stroke={C.gold} strokeWidth={2} />
            <circle cx={-80 + 22 * Math.cos(t * 1.8)} cy={22 * Math.sin(t * 1.8)} r={7} fill={C.gold} />
            <text x={50} y={0} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontSize={28} fill={C.gold}>
              1 hari ≈ setahun
            </text>
          </g>
        </g>

        {/* batang daya bayang */}
        <g opacity={bars}>
          <Label x={BX0} y={270} size={22} color={C.muted} anchor="start" font="mono" spacing={2}>
            DAYA MEMBAYANGKAN →
          </Label>
          {ROWS.map((r, i) => {
            const len = (BX1 - BX0) * r.fill * rowFill[i];
            return (
              <g key={r.key} opacity={rowOn[i]}>
                <g transform={`translate(${BX0 - 120} ${r.y})`}>
                  {i === 0 ? <Camel t={t} /> : i === 1 ? <Plane t={t} /> : <circle r={22 + 3 * Math.sin(t * 2)} fill="none" stroke={C.spr} strokeWidth={3} strokeDasharray="4 6" strokeDashoffset={-t * 10} />}
                </g>
                <Label x={BX0 - 190} y={r.y} size={26} color={C[r.hue]} anchor="end">
                  {r.label}
                </Label>
                <rect x={BX0} y={r.y - 18} width={BX1 - BX0} height={36} rx={18} fill="#0d1430" stroke={C.line} strokeWidth={2} />
                <rect x={BX0 + 3} y={r.y - 15} width={Math.max(0, len - 6)} height={30} rx={15} fill={C[r.hue]} opacity={0.8} />
                <circle cx={BX0 + Math.max(15, len - 15)} cy={r.y} r={11 + 2 * Math.sin(t * 4 + i)} fill="#fff" opacity={0.5 * ramp(len, 10, 40)} />
              </g>
            );
          })}
          {/* kabut */}
          <g opacity={fog}>
            {Array.from({length: 16}, (_, k) => {
              const x = 1150 + rand(k * 3.3) * 460 + 30 * Math.sin(t * 0.3 + k);
              const y = 420 + rand(k * 5.5) * 360 + 14 * Math.sin(t * 0.4 + k * 2);
              return <circle key={k} cx={x} cy={y} r={70 + rand(k) * 60} fill="url(#soft-muted)" opacity={0.75} />;
            })}
            <Label x={1380} y={780} size={34} color={C.ink} opacity={belum} weight={600} italic font="serif">
              belum terbayangkan
            </Label>
          </g>
        </g>

        {/* jam: perkirakanlah waktunya */}
        <g opacity={clock} transform="translate(640 560)">
          <Glow x={0} y={0} r={260} color="gold" opacity={0.35} />
          <circle r={160} fill="#0d1430" stroke={C.gold} strokeWidth={4} />
          {Array.from({length: 12}, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            return <line key={k} x1={140 * Math.sin(a)} y1={-140 * Math.cos(a)} x2={152 * Math.sin(a)} y2={-152 * Math.cos(a)} stroke={C.gold} strokeWidth={3} />;
          })}
          {[0.12, 0.33, 0.52, 0.72, 0.86].map((u, k) => {
            const a = u * Math.PI * 2;
            const on = ramp(perk, k * 0.15, k * 0.15 + 0.3);
            return <circle key={k} cx={118 * Math.sin(a)} cy={-118 * Math.cos(a)} r={10} fill={C.cyan} opacity={0.25 + 0.75 * on} />;
          })}
          <line x1={0} y1={0} x2={70 * Math.sin(hSpin * 0.2)} y2={-70 * Math.cos(hSpin * 0.2)} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={0} y1={0} x2={115 * Math.sin(hSpin * 2.4)} y2={-115 * Math.cos(hSpin * 2.4)} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          <circle r={10} fill={C.gold} />
          <text y={210} textAnchor="middle" fontFamily={FONT.head} fontSize={24} fill={C.cyan} opacity={perk}>
            lima waktu salat tetap diperkirakan
          </text>
          <Ripple x={0} y={0} p={(t - wordOf(3, 'perkirakanlah')) / 1.5} r={260} color="cyan" rings={2} />
        </g>
        <Twinkles x={1260} y={520} rx={300} ry={90} n={5} color="gold" opacity={guide * clock} seed={3} />

        {/* gaib vs akal */}
        <g opacity={gaib}>
          <Glow x={620} y={540} r={330} color="gold" opacity={0.4} />
          <Glow x={620} y={540} r={240} color="spr" opacity={0.35} />
          <rect x={360} y={300} width={520} height={460} rx={24} fill="#120d2c" fillOpacity={0.6} stroke={C.gold} strokeOpacity={0.6} strokeWidth={2} />
          {Array.from({length: 13}, (_, k) => {
            const x = 380 + k * 40;
            const w = 8 * Math.sin(t * 0.9 + k * 0.7);
            return <path key={k} d={`M${x},310 C${x + w},420 ${x - w},560 ${x + w * 0.6},750`} fill="none" stroke={k % 2 ? C.gold : C.spr} strokeOpacity={0.35} strokeWidth={14} />;
          })}
          <Motes x={620} y={530} rx={220} ry={200} n={20} color="gold" opacity={0.6} seed={8} />
          <Label x={620} y={530} size={38} color={C.gold} weight={600}>
            gaib — milik Allah
          </Label>
          <Label x={620} y={590} size={22} color={C.muted}>
            diimani tanpa memastikan bentuknya
          </Label>
        </g>
        <g opacity={akal} transform={`translate(${mix(960, 1320, gaib)} 0)`}>
          <Glow x={0} y={520} r={260} color="cyan" opacity={0.55} />
          {Array.from({length: 12}, (_, k) => {
            const a = (k / 12) * Math.PI * 2 + t * 0.2;
            const r1 = 120 + 14 * Math.sin(t * 2 + k);
            return <line key={k} x1={70 * Math.cos(a)} y1={500 + 70 * Math.sin(a)} x2={r1 * Math.cos(a)} y2={500 + r1 * Math.sin(a)} stroke={C.cyan} strokeWidth={3} strokeLinecap="round" opacity={0.6} />;
          })}
          <path d="M-34,520 C-60,480 -40,430 0,430 C40,430 60,480 34,520 L22,548 L-22,548 Z" fill={C.cyan} fillOpacity={0.85} stroke="#e8fbff" strokeWidth={2} />
          <rect x={-22} y={550} width={44} height={22} rx={5} fill="#5f7bb0" />
          <Label x={0} y={640} size={38} color={C.cyan} weight={600}>
            akal
          </Label>
          <Label x={0} y={690} size={22} color={C.muted}>
            boleh bertanya & merenung
          </Label>
        </g>
      </Stage>

      <Renungan t={t} />
      <Note x={1240} y={460} p={perk * clock} color={C.gold} size={42}>
        “perkirakanlah waktunya”
      </Note>
      <Badge x={1240} y={550} text="HR Muslim" color={C.gold} opacity={pM} scale={0.9 + 0.1 * pM} size={24} />
      <Note x={1240} y={660} p={guide * clock} color={C.cyan} size={26}>
        petunjuk tetap ada, bahkan di keadaan paling aneh
      </Note>
    </AbsoluteFill>
  );
};
