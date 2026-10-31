import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, rand, win} from '../anim';
import {Badge, Glow, Label, Motes, Note, Ripple, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Matahari dari barat (Bukhari 4635, QS Al-An'am 158) → pintu taubat menutup → binatang dari bumi (QS An-Naml 82, siluet abstrak).
const HY = 700;
const SC = {x: 960, rx: 680, ry: 400};
const fr = (v: number) => ((v % 1) + 1) % 1;
const sunAt = (s: number): [number, number] => [SC.x + SC.rx * Math.cos(Math.PI * s), HY - SC.ry * Math.sin(Math.PI * s)];
const PEOPLE = Array.from({length: 26}, (_, i) => ({x: 200 + i * 58 + (rand(i * 3.3) - 0.5) * 24, h: 22 + rand(i * 1.7) * 8, ph: rand(i * 5.1) * 6.28}));

const arcD = (s0: number, s1: number, n = 40) =>
  Array.from({length: n + 1}, (_, i) => {
    const [x, y] = sunAt(s0 + ((s1 - s0) * i) / n);
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

/** Siluet binatang abstrak (gundukan berlapis, tanpa wajah). */
const Beast: React.FC<{x: number; rise: number; t: number}> = ({x, rise, t}) => {
  const dy = (1 - rise) * 300 + 3 * Math.sin(t * 1.2);
  const d = `M${x - 190},${HY + 10} C${x - 180},${HY - 120} ${x - 110},${HY - 190} ${x - 10},${HY - 200} C${x + 40},${HY - 260} ${x + 120},${HY - 250} ${x + 140},${HY - 190} C${x + 170},${HY - 140} ${x + 190},${HY - 60} ${x + 200},${HY + 10} Z`;
  return (
    <g transform={`translate(0 ${dy})`}>
      <path d={d} fill="#1a1430" stroke={C.heat} strokeWidth={3} strokeOpacity={0.8} />
      {[0.82, 0.64, 0.46].map((k, i) => (
        <path key={i} d={d} fill="none" stroke={C.heat} strokeOpacity={0.18 + 0.08 * Math.sin(t * 2 + i)} strokeWidth={2} transform={`translate(${x * (1 - k)} ${(HY + 10) * (1 - k)}) scale(${k})`} />
      ))}
    </g>
  );
};

export const Sunset: React.FC = () => {
  const {t, cue, cueEnd, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  const tWest = wordOf(0, 'barat');
  const p1 = ramp(t, -0.8, tWest - 0.6, EASE_IN_OUT);
  const p2 = ramp(t, tWest - 0.3, cue(1) + 3.5, EASE_IN_OUT);
  const p3 = ramp(t, cue(1) + 3.5, cue(2), EASE_IN_OUT);
  const s = mix(mix(0.5, 1.14, p1), 0.74, p2) - 0.08 * p3;
  const [sx, sy] = sunAt(s);
  const sunCol = interpolateColors(p2, [0, 1], [C.gold, C.heat]);
  const dim = 1 - 0.6 * ramp(t, cue(2) - 0.8, cue(2) + 0.2);
  const believe = ramp(t, wordOf(1, 'beriman') - 0.2, wordOf(1, 'beriman') + 1.2);
  const useless = win(t, wordOf(1, 'tetapi'), cue(2) - 0.3, 0.6, 0.5);
  const pB = win(t, wordOf(1, 'bukhari') - 0.2, cue(2) - 0.3, 0.5, 0.5);
  const pQ = win(t, wordOf(1, "an'am") - 0.2, cue(2) - 0.3, 0.5, 0.5);
  const westLbl = win(t, tWest, cue(2) - 0.5, 0.6, 0.6);

  // pintu taubat
  const doorOn = ramp(t, cue(2) - 0.8, cue(2) + 0.2);
  const close = ramp(t, cue(2), cueEnd(2) + 0.5, EASE_IN_OUT);
  const tShut = cueEnd(2) + 0.5;
  const shift = ramp(t, cue(3) - 0.4, cue(3) + 1, EASE_IN_OUT);
  const dX = mix(960, 500, shift);
  const dS = mix(1, 0.78, shift);
  // binatang
  const rise = ramp(t, wordOf(3, 'binatang') - 0.3, wordOf(3, 'berbicara') + 0.4, EASE_IN_OUT);
  const talk = ramp(t, wordOf(3, 'berbicara'), wordOf(3, 'berbicara') + 0.8);
  const pN = win(t, wordOf(3, 'an-naml') - 0.2, cue(4) + 1.5, 0.5, 0.6);
  const last = ramp(t, cue(4), cue(4) + 0.9);
  const BX = 1330;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <defs>
          <clipPath id="ss-sky">
            <rect x={0} y={0} width={1920} height={HY} />
          </clipPath>
          <clipPath id="ss-arch">
            <path d="M-110,0 V-280 A110,110 0 0 1 110,-280 V0 Z" />
          </clipPath>
          <linearGradient id="ss-hz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sunCol} stopOpacity={0.28} />
            <stop offset="100%" stopColor={sunCol} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* langit senja di dekat cakrawala */}
        <rect x={0} y={HY - 220} width={1920} height={220} fill="url(#ss-hz)" opacity={0.6 * dim} transform={`scale(1 -1) translate(0 ${-2 * HY + 220})`} />
        <g opacity={dim}>
          {/* jalur biasa (timur → barat) */}
          <path d={arcD(0.02, 0.98)} fill="none" stroke={C.gold} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="6 10" strokeDashoffset={-t * 16} />
          <Label x={960} y={272} size={22} color={C.gold} opacity={0.7 * (1 - p2)} font="mono">
            biasanya: timur → barat
          </Label>
          {/* matahari */}
          <g clipPath="url(#ss-sky)">
            <Glow x={sx} y={sy} r={260} color="gold" opacity={0.6 * (1 - p2)} />
            <Glow x={sx} y={sy} r={280} color="heat" opacity={0.6 * p2} />
            {Array.from({length: 12}, (_, k) => {
              const a = (k / 12) * Math.PI * 2 + t * 0.25;
              const r0 = 66;
              const r1 = 92 + 8 * Math.sin(t * 2 + k);
              return <line key={k} x1={sx + r0 * Math.cos(a)} y1={sy + r0 * Math.sin(a)} x2={sx + r1 * Math.cos(a)} y2={sy + r1 * Math.sin(a)} stroke={sunCol} strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
            })}
            <circle cx={sx} cy={sy} r={54} fill={sunCol} />
            <circle cx={sx - 14} cy={sy - 14} r={22} fill="#fff" opacity={0.35} />
          </g>
          {/* panah terbalik: terbit dari barat */}
          <g opacity={westLbl}>
            <path d={arcD(1.0, 0.8)} fill="none" stroke={C.heat} strokeWidth={5} markerEnd="url(#arrow-heat)" strokeOpacity={0.85} transform="translate(0 40) scale(1 1)" />
            <Label x={330} y={470} size={30} color={C.heat} weight={600}>
              terbit dari barat
            </Label>
          </g>
          {/* cakrawala & arah mata angin */}
          <line x1={140} y1={HY} x2={1780} y2={HY} stroke={C.gold} strokeOpacity={0.55} strokeWidth={2.5} />
          <Label x={230} y={742} size={24} color={C.heat} font="mono" weight={600} spacing={3}>
            BARAT
          </Label>
          <Label x={1690} y={742} size={24} color={C.gold} font="mono" weight={600} spacing={3}>
            TIMUR
          </Label>
          <Label x={960} y={742} size={18} color={C.muted} font="mono" opacity={0.6}>
            ◇ cakrawala
          </Label>
          {/* manusia (siluet jauh tanpa wajah) → semua beriman */}
          {PEOPLE.map((p, i) => {
            const col = interpolateColors(ramp(believe, i / 40, i / 40 + 0.4), [0, 1], [C.muted, C.cyan]);
            const bob = 1.5 * Math.sin(t * 1.4 + p.ph);
            return (
              <g key={i} opacity={0.85}>
                <rect x={p.x - 5} y={HY - p.h + 9 + bob} width={10} height={p.h - 9} rx={5} fill={col} opacity={0.75} />
                <circle cx={p.x} cy={HY - p.h + 3 + bob} r={5} fill={col} />
              </g>
            );
          })}
          <Twinkles x={960} y={HY - 40} rx={760} ry={30} n={6} color="cyan" opacity={believe * (1 - shift)} seed={6} />
        </g>

        {/* pintu taubat */}
        <g opacity={doorOn} transform={`translate(${dX} ${HY}) scale(${dS})`}>
          <Glow x={0} y={-180} r={260} color="cyan" opacity={0.6 * (1 - close)} />
          <path d="M-110,0 V-280 A110,110 0 0 1 110,-280 V0 Z" fill="#cfefff" opacity={0.18 + 0.5 * (1 - close)} />
          <g clipPath="url(#ss-arch)">
            <rect x={-110} y={-400} width={110 * mix(0.1, 1, close)} height={400} fill="#3a2a1e" stroke={C.gold} strokeWidth={2} />
            <rect x={110 - 110 * mix(0.1, 1, close)} y={-400} width={110 * mix(0.1, 1, close)} height={400} fill="#3a2a1e" stroke={C.gold} strokeWidth={2} />
            {[-1, 1].map((sd) => (
              <path key={sd} d={`M${sd * 110 * (1 - mix(0.1, 1, close) / 2)},-330 l${sd * -20 * close},18 l${sd * 20 * close},18 l${sd * 20 * close},-18 Z`} fill={C.gold} opacity={0.6 * close} />
            ))}
          </g>
          <path d="M-126,0 V-280 A126,126 0 0 1 126,-280 V0" fill="none" stroke={C.gold} strokeWidth={6} />
          <path d="M-142,0 V-280 A142,142 0 0 1 142,-280 V0" fill="none" stroke={C.gold} strokeOpacity={0.35} strokeWidth={2} />
          <circle cx={0} cy={-160} r={9} fill={C.gold} opacity={close} />
          <Ripple x={0} y={-160} p={(t - tShut) / 1.3} r={220} color="gold" rings={3} />
          <circle cx={0} cy={-160} r={26 + 4 * Math.sin(t * 2)} fill="none" stroke={C.gold} strokeOpacity={0.5 * ramp(t, tShut, tShut + 0.6)} strokeWidth={2} />
          <text x={0} y={46} textAnchor="middle" fontFamily={FONT.head} fontSize={30} fontWeight={600} fill={C.gold} style={{paintOrder: 'stroke', stroke: '#070b18', strokeWidth: 6}}>
            pintu taubat
          </text>
        </g>

        {/* binatang dari bumi */}
        <g opacity={ramp(t, wordOf(3, 'binatang') - 0.4, wordOf(3, 'binatang') + 0.3)}>
          <g clipPath="url(#ss-sky)">
            <Glow x={BX} y={HY - 120} r={300} color="heat" opacity={0.35 * rise} />
            <Beast x={BX} rise={rise} t={t} />
          </g>
          {/* retakan & debu di tanah */}
          {Array.from({length: 14}, (_, k) => {
            const u = fr(t * 0.6 + k / 14);
            const x0 = BX - 200 + rand(k * 2.2) * 400;
            return <circle key={k} cx={x0 + (rand(k) - 0.5) * 60 * u} cy={HY - 6 - u * 70} r={2 + rand(k * 3) * 3} fill="#a08670" opacity={cyc(u) * 0.6 * win(t, wordOf(3, 'binatang') - 0.3, cue(4), 0.4, 1.2)} />;
          })}
          {/* glif gelombang bicara */}
          <g opacity={talk} transform={`translate(${BX + 210} ${HY - 300})`}>
            {[0, 1, 2].map((k) => {
              const q = fr(t * 0.7 + k / 3);
              return <path key={k} d={`M${20 + q * 70},-${36 + q * 50} A${50 + q * 70},${50 + q * 70} 0 0 1 ${20 + q * 70},${36 + q * 50}`} fill="none" stroke={C.heat} strokeWidth={3} opacity={cyc(q)} />;
            })}
            {Array.from({length: 9}, (_, k) => {
              const h = 8 + 26 * Math.abs(Math.sin(t * 6 + k * 0.9)) * talk;
              return <rect key={k} x={-30 + k * 9} y={-h / 2} width={5} height={h} rx={2.5} fill={C.heat} opacity={0.85} />;
            })}
          </g>
          <Label x={BX} y={742} size={26} color={C.heat}>
            binatang dari bumi
          </Label>
        </g>
        <Motes x={960} y={480} rx={760} ry={260} n={20} color="gold" opacity={0.35 * (1 - p2)} seed={9} />
        <Motes x={960} y={480} rx={760} ry={260} n={20} color="heat" opacity={0.35 * p2} seed={10} />
        <Ripple x={960} y={HY} p={(t - cue(4)) / 1.8} r={700} color="heat" rings={2} width={2} />
      </Stage>

      <Badge x={800} y={210} text="HR Bukhari" color={C.gold} opacity={pB} scale={0.9 + 0.1 * pB} size={24} />
      <Badge x={1100} y={210} text="QS Al-An'am 158" color={C.gold} opacity={pQ} scale={0.9 + 0.1 * pQ} size={24} />
      <Badge x={BX} y={210} text="QS An-Naml 82" color={C.gold} opacity={pN} scale={0.9 + 0.1 * pN} size={24} />
      <Note x={1260} y={330} p={useless} color={C.heat} size={32}>
        iman <span style={{color: C.heat}}>tidak lagi bermanfaat</span>
        <div style={{fontSize: 22, color: C.muted, marginTop: 4}}>bagi yang sebelumnya belum beriman</div>
      </Note>
      <Note x={1150} y={290} p={last} color={C.heat} size={40}>
        tidak ada lagi kesempatan
      </Note>
    </AbsoluteFill>
  );
};
