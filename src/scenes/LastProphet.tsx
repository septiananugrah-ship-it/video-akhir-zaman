import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, smoothPath} from '../anim';
import {Arrow, Badge, Card, DrawPath, Glow, Label, Motes, Ripple, Spark, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Nabi terakhir & dua jari (AUDIT): QS Al-Ahzab 33:40; Bukhari 6504 & Muslim 2951; QS Al-Qamar 54:1; QS Al-A'raf 7:187.
// Visual simbolik: cahaya (bukan sosok), dua batang bercahaya (bukan tangan), jam pasir bertirai.

const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

// rantai cahaya para nabi
const NAMES: Record<number, string> = {0: 'Adam', 2: 'Nuh', 4: 'Ibrahim', 6: 'Musa', 8: 'Isa'};
const chainPt = (i: number, t: number): [number, number] => [170 + i * 142, 520 - i * 7 + 8 * Math.sin(t * 0.9 + i * 0.8)];
const FX = 1560;
const FY = 450;

// garis waktu kanan
const TX0 = 1020;
const TX1 = 1780;
const TY = 470;
const KX = 1705;

// dua batang
const BX = 560;
const BASE = 700;

// jam pasir
const HX = 960;
const HY = 470;

const Hourglass: React.FC<{t: number; op: number; veil: number; sand: number}> = ({t, op, veil, sand}) => {
  const tilt = 1.6 * Math.sin(t * 0.5);
  const glass = 'M-118,-200 C-118,-90 -16,-40 -12,0 C-16,40 -118,90 -118,200 L118,200 C118,90 16,40 12,0 C16,-40 118,-90 118,-200 Z';
  const topLvl = mix(-150, -40, sand); // permukaan pasir atas turun
  const pileH = mix(40, 120, sand);
  return (
    <g opacity={op} transform={`translate(${HX},${HY}) rotate(${tilt})`}>
      <defs>
        <clipPath id="lp-glass">
          <path d={glass} />
        </clipPath>
        <linearGradient id="lp-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe3a0" />
          <stop offset="100%" stopColor="#c98a2a" />
        </linearGradient>
        <linearGradient id="lp-veil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2550" />
          <stop offset="50%" stopColor="#26336a" />
          <stop offset="100%" stopColor="#141d42" />
        </linearGradient>
      </defs>
      <Glow x={0} y={0} r={330} color="gold" opacity={0.35} />
      {/* kaca */}
      <path d={glass} fill="rgba(160,200,255,0.06)" stroke="#9fc6ff" strokeOpacity={0.55} strokeWidth={3} />
      <g clipPath="url(#lp-glass)">
        <path d={`M-130,${topLvl} Q0,${topLvl + 18} 130,${topLvl} L130,10 L-130,10 Z`} fill="url(#lp-sand)" />
        <path d={`M-130,205 L-130,${200 - pileH * 0.35} Q0,${200 - pileH - 10} 130,${200 - pileH * 0.35} L130,205 Z`} fill="url(#lp-sand)" />
        {Array.from({length: 14}, (_, i) => {
          const ph = (t * 1.3 + i / 14) % 1;
          const y = mix(0, 200 - pileH, ph);
          return <circle key={i} cx={1.5 * Math.sin(i * 2.3 + t * 4)} cy={y} r={2.4} fill="#ffe3a0" opacity={cyc(ph)} />;
        })}
      </g>
      {/* kilau kaca */}
      <path d="M-92,-180 C-92,-110 -40,-70 -26,-30" fill="none" stroke="#fff" strokeOpacity={0.18} strokeWidth={6} strokeLinecap="round" />
      {/* tirai */}
      {veil > 0.001 ? (
        <g>
          {(() => {
            const bottom = -215 + 430 * veil;
            const wave = (x: number) => bottom + 10 * Math.sin(x * 0.045 + t * 1.6);
            const xs = Array.from({length: 13}, (_, i) => -150 + i * 25);
            const d = `M-150,-215 L150,-215 L150,${wave(150)} ` + xs
              .slice()
              .reverse()
              .map((x) => `L${x},${wave(x).toFixed(1)}`)
              .join(' ') + ' Z';
            return (
              <>
                <path d={d} fill="url(#lp-veil)" opacity={0.96} />
                {[-100, -50, 0, 50, 100].map((x, i) => (
                  <path key={i} d={`M${x + 4 * Math.sin(t + i)},-210 Q${x + 10 * Math.sin(t * 0.8 + i)},${(bottom - 215) / 2} ${x},${wave(x) - 6}`} fill="none" stroke="#3b4c8e" strokeWidth={3} opacity={0.6} />
                ))}
                <path d={xs.map((x, i) => `${i ? 'L' : 'M'}${x},${wave(x).toFixed(1)}`).join(' ')} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.85} />
              </>
            );
          })()}
        </g>
      ) : null}
      {/* bingkai */}
      <rect x={-160} y={-232} width={320} height={26} rx={8} fill="#5a3f1c" stroke={C.gold} strokeWidth={2.5} />
      <rect x={-160} y={206} width={320} height={26} rx={8} fill="#5a3f1c" stroke={C.gold} strokeWidth={2.5} />
      {[-142, 142].map((x) => (
        <rect key={x} x={x - 7} y={-206} width={14} height={412} rx={5} fill="#6b4a20" stroke={C.gold} strokeOpacity={0.6} strokeWidth={1.5} />
      ))}
    </g>
  );
};

export const LastProphet: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // fase
  const pA = slot(t, -0.6, cue(1) + 0.3, 0.6, 0.8);
  const pB = slot(t, cue(1) - 0.2, cue(3) + 0.2, 0.6, 0.7);
  const pT = slot(t, wordOf(1, 'diutus') - 0.3, cue(4) + 0.3, 0.8, 0.7);
  const pC = slot(t, cue(3) + 0.3, cue(4) + 0.2, 0.6, 0.6);
  const pD = ramp(t, cue(4) + 0.2, cue(4) + 1.0);

  // A — rantai cahaya
  const tF = wordOf(0, 'Nabi');
  const finalP = ramp(t, tF - 0.3, tF + 0.9);
  const chain = Array.from({length: 9}, (_, i) => chainPt(i, t));
  const chainPath = smoothPath([...chain, [FX, FY]]);
  const lblP = ramp(t, wordOf(0, 'penutup'), wordOf(0, 'penutup') + 0.6);
  const pillA = ramp(t, wordOf(0, 'Surah'), wordOf(0, 'Surah') + 0.5);

  // B — dua batang
  const raise = ramp(t, wordOf(1, 'mengangkat') - 0.1, wordOf(1, 'mengangkat') + 1.2, EASE_IN_OUT);
  const lbl1 = ramp(t, wordOf(1, 'diutus'), wordOf(1, 'diutus') + 0.5);
  const lbl2 = ramp(t, wordOf(1, 'kiamat'), wordOf(1, 'kiamat') + 0.5);
  const tDua = wordOf(1, 'dua');
  const duaPulse = Math.sin(Math.PI * ramp(t, tDua - 0.1, tDua + 1.2));
  const pillB = ramp(t, wordOf(1, 'Hadis'), wordOf(1, 'Hadis') + 0.5);
  const bars = [
    {x: BX - 42, h: 330, lbl: 'diutus', p: lbl1, lx: BX - 14, anchor: 'end' as const},
    {x: BX + 42, h: 370, lbl: 'kiamat', p: lbl2, lx: BX + 14, anchor: 'start' as const},
  ];

  // garis waktu: jarak diutus–kiamat menyusut (sejarah dilihat utuh)
  const shrink = ramp(t, tDua - 0.3, cue(2) + 4, EASE_IN_OUT);
  const DX = mix(1380, 1570, shrink);
  const babak = ramp(t, wordOf(2, 'babak'), wordOf(2, 'babak') + 0.6);
  const dekat = ramp(t, wordOf(3, 'dekat'), wordOf(3, 'dekat') + 0.6);

  // C — kartu "telah dekat"
  const pillC = ramp(t, wordOf(3, 'Surah'), wordOf(3, 'Surah') + 0.5);

  // D — jam pasir bertirai
  const veil = ramp(t, wordOf(4, 'Kapan') - 0.2, wordOf(4, 'hanya') + 0.2, EASE_IN_OUT);
  const capD = ramp(t, wordOf(4, 'hanya'), wordOf(4, 'hanya') + 0.6);
  const pillD = ramp(t, wordOf(4, 'Surah'), wordOf(4, 'Surah') + 0.5);
  const sand = ramp(t, cue(4), cue(5) + 2, (x) => x);

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <radialGradient id="lp-core" cx="40%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#fffbe8" />
            <stop offset="55%" stopColor={C.gold} />
            <stop offset="100%" stopColor="#b8741a" />
          </radialGradient>
          <linearGradient id="lp-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#b8741a" />
            <stop offset="60%" stopColor={C.gold} />
            <stop offset="100%" stopColor="#fff3c4" />
          </linearGradient>
        </defs>

        {/* A: rantai cahaya → cahaya penutup */}
        {pA > 0.001 ? (
          <g opacity={pA}>
            <DrawPath d={chainPath} p={ramp(t, -0.4, 1.4)} stroke={C.gold} width={2.5} opacity={0.5} />
            <Stream pts={[...chain, [FX, FY]]} color="gold" n={9} speed={0.12} r={4} opacity={0.7} />
            {chain.map(([x, y], i) => {
              const on = ramp(t, -0.6 + i * 0.12, -0.1 + i * 0.12);
              return (
                <g key={i} opacity={on}>
                  <Glow x={x} y={y} r={44} color={i % 2 ? 'gold' : 'cyan'} opacity={0.55} />
                  <circle cx={x} cy={y} r={8 + 1.5 * Math.sin(t * 2 + i)} fill={i % 2 ? C.gold : C.cyan} opacity={0.8} />
                  <circle cx={x} cy={y} r={3.5} fill="#fff" />
                  {NAMES[i] ? (
                    <Label x={x} y={y + 46} size={24} color={C.muted} font="sans">
                      {NAMES[i]}
                    </Label>
                  ) : null}
                </g>
              );
            })}
            <g opacity={finalP}>
              <Glow x={FX} y={FY} r={260 * (0.6 + 0.4 * finalP)} color="gold" />
              {Array.from({length: 12}, (_, k) => {
                const a = (k / 12) * Math.PI * 2 + t * 0.15;
                const r0 = 46;
                const r1 = 46 + (70 + 22 * Math.sin(t * 1.7 + k)) * finalP;
                return (
                  <path
                    key={k}
                    d={`M${FX + Math.cos(a) * r0},${FY + Math.sin(a) * r0} L${FX + Math.cos(a) * r1},${FY + Math.sin(a) * r1}`}
                    stroke={C.gold}
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={0.45}
                  />
                );
              })}
              <circle cx={FX} cy={FY} r={34 * (0.5 + 0.5 * finalP) * (1 + 0.04 * Math.sin(t * 2.4))} fill="url(#lp-core)" />
              <circle cx={FX - 9} cy={FY - 10} r={9} fill="#fff" opacity={0.6} />
            </g>
            <Ripple x={FX} y={FY} p={ramp(t, tF, tF + 1.6, (x) => x)} r={220} color="gold" />
            <Motes x={FX} y={FY} rx={200} ry={150} n={26} color="gold" opacity={0.55 * finalP} />
            <Label x={FX} y={FY + 150} size={46} color={C.gold} weight={600} opacity={lblP}>
              penutup para nabi
            </Label>
            <Twinkles x={FX} y={FY} rx={170} ry={120} n={5} opacity={lblP} />
          </g>
        ) : null}

        {/* B: dua batang bercahaya */}
        {pB > 0.001 ? (
          <g opacity={pB}>
            <ellipse cx={BX} cy={BASE + 8} rx={140} ry={16} fill={C.gold} opacity={0.12} />
            <Glow x={BX} y={BASE - 190} r={300} color="gold" opacity={0.35 + 0.4 * duaPulse} />
            {bars.map((b, i) => {
              const h = b.h * raise;
              const sway = 3 * Math.sin(t * 1.1 + i * 1.3);
              return (
                <g key={i} transform={`translate(${sway},0)`}>
                  <rect x={b.x - 40} y={BASE - h - 14} width={80} height={h + 14} rx={40} fill={C.gold} opacity={0.12 + 0.12 * duaPulse} />
                  <rect x={b.x - 23} y={BASE - h} width={46} height={h} rx={23} fill="url(#lp-bar)" />
                  <rect x={b.x - 10} y={BASE - h + 14} width={8} height={Math.max(0, h - 40)} rx={4} fill="#fff" opacity={0.35} />
                  <Label x={b.lx} y={BASE + 44} size={32} color={C.gold} weight={600} opacity={b.p} anchor={b.anchor}>
                    {b.lbl}
                  </Label>
                </g>
              );
            })}
            {/* percik kecil yang memantul di celah sempit */}
            <Spark x={BX + 1.5 * Math.sin(t * 6)} y={BASE - 120 - 90 * (0.5 + 0.5 * Math.sin(t * 1.4))} r={5} color="white" opacity={raise * 0.8} />
            <Ripple x={BX} y={BASE - 200} p={ramp(t, tDua, tDua + 1.5, (x) => x)} r={200} color="gold" />
          </g>
        ) : null}

        {/* garis waktu sejarah */}
        {pT > 0.001 ? (
          <g opacity={pT}>
            <Label x={(TX0 + TX1) / 2} y={TY - 150} size={26} color={C.muted} font="sans" opacity={0.9}>
              garis waktu sejarah manusia
            </Label>
            <path d={`M${TX0},${TY} L${TX1},${TY}`} stroke={C.gold} strokeOpacity={0.18} strokeWidth={14} strokeLinecap="round" />
            <path d={`M${TX0},${TY} L${TX1},${TY}`} stroke={C.gold} strokeOpacity={0.75} strokeWidth={3.5} strokeLinecap="round" />
            {Array.from({length: 7}, (_, i) => {
              const x = mix(TX0 + 30, DX - 60, i / 6);
              return <circle key={i} cx={x} cy={TY} r={5 + Math.sin(t * 2 + i)} fill={C.cyan} opacity={0.6} />;
            })}
            <Label x={TX0} y={TY + 42} size={24} color={C.muted} font="sans" anchor="start">
              awal manusia
            </Label>
            {/* segmen babak terakhir */}
            <rect x={DX} y={TY - 12} width={Math.max(0, KX - DX)} height={24} rx={12} fill={C.gold} opacity={0.18 + 0.2 * babak} />
            <Label x={(DX + KX) / 2} y={TY + 46} size={26} color={C.gold} weight={600} opacity={babak}>
              babak terakhir
            </Label>
            {/* diutus */}
            <Glow x={DX} y={TY} r={60} color="gold" />
            <circle cx={DX} cy={TY} r={11} fill={C.gold} />
            <circle cx={DX} cy={TY} r={4.5} fill="#fff" />
            <Label x={DX + 10} y={TY - 44} size={28} color={C.gold} weight={600} anchor="end">
              diutus
            </Label>
            {/* kiamat: kabur, waktunya tak diketahui */}
            <Glow x={KX} y={TY} r={70 + 8 * Math.sin(t * 2)} color="heat" opacity={0.9} />
            <circle cx={KX} cy={TY} r={10} fill={C.heat} opacity={0.75} />
            <Label x={KX - 10} y={TY - 44} size={28} color={C.heat} weight={600} anchor="start">
              kiamat
            </Label>
            <Arrow x1={DX + 16} y1={TY - 90} x2={KX - 14} y2={TY - 90} color="gold" width={4} opacity={dekat} pulse={false} />
            <Label x={(DX + KX) / 2} y={TY - 118} size={26} color={C.gold} opacity={dekat}>
              dekat
            </Label>
          </g>
        ) : null}

        {/* D: jam pasir bertirai */}
        {pD > 0.001 ? (
          <>
            <Hourglass t={t} op={pD} veil={veil} sand={sand} />
            <Motes x={HX} y={HY} rx={300} ry={250} n={24} color="gold" opacity={0.45 * pD} />
            <Label x={HX} y={HY + 290} size={46} color={C.gold} weight={600} opacity={capD * pD}>
              hanya Allah yang tahu
            </Label>
            <Twinkles x={HX} y={HY - 40} rx={200} ry={200} n={4} opacity={capD * pD * 0.7} />
          </>
        ) : null}
      </Stage>

      {/* pil sumber */}
      <Badge x={FX} y={FY + 222} text="QS Al-Ahzab 40" color={C.gold} opacity={pillA * pA} scale={0.85 + 0.15 * pillA} />
      <Badge x={BX} y={BASE + 108} text="HR Bukhari & Muslim" color={C.gold} opacity={pillB * pB} scale={0.85 + 0.15 * pillB} />

      {/* C: kartu "telah dekat" */}
      <Card x={BX} y={430} opacity={pC} scale={0.94 + 0.06 * pC} accent={C.gold} style={{padding: '24px 46px'}}>
        <div style={{fontFamily: FONT.serif, fontSize: 72, fontWeight: 600, color: C.gold, textAlign: 'center'}}>telah dekat</div>
        <div style={{fontFamily: FONT.sans, fontSize: 28, color: C.muted, textAlign: 'center', marginTop: 6}}>datangnya hari kiamat</div>
      </Card>
      <Badge x={BX} y={590} text="QS Al-Qamar 1" color={C.gold} opacity={pillC * pC} scale={0.85 + 0.15 * pillC} />
      <Badge x={HX} y={HY + 362} text="QS Al-A'raf 187" color={C.gold} opacity={pillD * pD} scale={0.85 + 0.15 * pillD} />
    </AbsoluteFill>
  );
};
