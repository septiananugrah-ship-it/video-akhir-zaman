import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand, win} from '../anim';
import {Glow, Label, Motes, Note, Ripple, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';
import {Renungan} from './Peak';

// Renungan (bukan tafsir): apakah AI = Dajjal? → mayoritas ulama: sosok manusia nyata → pola fitnahnya: ilusi
// (surga yang sebenarnya neraka; foto asli vs buatan AI tak bisa dibedakan — wajah abstrak bentuk sederhana, bukan tokoh agama)
// → lampu hati yang jernih → tulisan "kafir" terbaca setiap mukmin: iman, bukan kecerdasan.
const fr = (v: number) => ((v % 1) + 1) % 1;
const heartD = (s: number) =>
  `M0,${32 * s} C${-12 * s},${20 * s} ${-60 * s},${-6 * s} ${-60 * s},${-34 * s} C${-60 * s},${-62 * s} ${-22 * s},${-74 * s} 0,${-46 * s} C${22 * s},${-74 * s} ${60 * s},${-62 * s} ${60 * s},${-34 * s} C${60 * s},${-6 * s} ${12 * s},${20 * s} 0,${32 * s} Z`;

/** Chip mesin dengan jejak sirkuit berdenyut. */
const Chip: React.FC<{t: number; s?: number}> = ({t, s = 1}) => (
  <g transform={`scale(${s})`}>
    {Array.from({length: 6}, (_, k) => {
      const o = -50 + k * 20;
      return (
        <g key={k}>
          <line x1={o} y1={-70} x2={o} y2={-92} stroke={C.spr} strokeWidth={4} />
          <line x1={o} y1={70} x2={o} y2={92} stroke={C.spr} strokeWidth={4} />
          <line x1={-70} y1={o} x2={-92} y2={o} stroke={C.spr} strokeWidth={4} />
          <line x1={70} y1={o} x2={92} y2={o} stroke={C.spr} strokeWidth={4} />
        </g>
      );
    })}
    <rect x={-70} y={-70} width={140} height={140} rx={14} fill="#1a1540" stroke={C.spr} strokeWidth={4} />
    <rect x={-42} y={-42} width={84} height={84} rx={8} fill="none" stroke={C.spr} strokeOpacity={0.5} strokeWidth={2} />
    {Array.from({length: 4}, (_, k) => {
      const u = fr(t * 0.7 + k / 4);
      const side = k % 4;
      const p = -70 - 22 * u;
      const pos: [number, number] = side === 0 ? [-30, p] : side === 1 ? [30, -p] : side === 2 ? [p, 30] : [-p, -30];
      return <circle key={k} cx={pos[0]} cy={pos[1]} r={4} fill={C.cyan} opacity={cyc(u)} />;
    })}
  </g>
);

/** Wajah abstrak dari bentuk sederhana (orang biasa, tanpa ciri tokoh). g = derau/glitch 0..1. */
const Face: React.FC<{t: number; g: number; seed: number}> = ({t, g, seed}) => {
  const j = (k: number) => g * 14 * Math.sin(t * 9 + k * 2.7 + seed);
  const blink = 1 - 0.9 * Math.max(0, Math.sin(t * 0.9 + seed) ** 40);
  return (
    <g>
      <path d="M-92,150 C-92,80 -50,60 0,60 C50,60 92,80 92,150 Z" fill="#3b4f7e" transform={`translate(${j(1)} 0)`} />
      <ellipse cx={j(2)} cy={-10} rx={68} ry={84} fill="#d9b48f" />
      <path d={`M-70,-30 C-70,-100 70,-100 70,-30 C50,-70 -40,-74 -70,-30 Z`} fill="#3a2a22" transform={`translate(${j(3)} ${j(4) * 0.3})`} />
      <ellipse cx={-24 + j(5)} cy={-10} rx={7} ry={7 * blink} fill="#1d1d2a" />
      <ellipse cx={24 + j(6)} cy={-10 + j(7) * 0.4} rx={7} ry={7 * blink} fill="#1d1d2a" />
      <path d={`M${-22 + j(8)},28 Q0,${42 + j(9) * 0.5} ${22 + j(8)},28`} fill="none" stroke="#7a3b3b" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

const Frame: React.FC<{x: number; y: number; t: number; g: number; seed: number; col: string}> = ({x, y, t, g, seed, col}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-170} y={-190} width={340} height={360} rx={12} fill="#0c1430" stroke={col} strokeWidth={3} />
    <g clipPath={`url(#ad-clip)`}>
      <rect x={-170} y={-190} width={340} height={360} fill="#1c2c56" />
      <Face t={t} g={g} seed={seed} />
      {Array.from({length: 7}, (_, k) => {
        const u = fr(t * 0.6 + k / 7 + seed);
        return <rect key={k} x={-170} y={-190 + u * 360} width={340} height={4 + 6 * rand(k + seed)} fill={C.spr} opacity={0.35 * g * cyc(u)} />;
      })}
    </g>
  </g>
);

export const AiDajjal: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);

  const q = win(t, cue(0) - 0.2, cue(1) + 0.3, 0.6, 0.6);
  const chip = win(t, cue(0), cue(2) - 0.2, 0.7, 0.6);
  const ulama = win(t, cue(1) + 0.3, cue(2) - 0.2, 0.6, 0.6);
  const tech = win(t, wordOf(1, 'teknologi') - 0.2, cue(2) - 0.2, 0.5, 0.6);
  const ill = win(t, cue(2) - 0.2, cue(3) - 0.1, 0.7, 0.6);
  const rev = ramp(t, wordOf(2, 'sebenarnya') - 0.2, wordOf(2, 'neraka') + 0.8, EASE_IN_OUT);
  const fake = win(t, wordOf(2, 'palsu') - 0.2, cue(3) - 0.2, 0.5, 0.6);
  const frames = win(t, cue(3) - 0.3, cue(5) - 0.3, 0.7, 0.8);
  const conv = ramp(t, wordOf(3, 'wajah'), wordOf(3, 'aslinya') + 0.6, EASE_IN_OUT);
  const qmark = ramp(t, wordOf(3, 'aslinya'), wordOf(3, 'aslinya') + 1);
  const eye = win(t, wordOf(3, 'mata') - 0.2, cue(4) + 0.6, 0.6, 0.6);
  const lamp = win(t, cue(4) - 0.2, cue(5) + 0.4, 0.7, 0.8);
  const bright = ramp(t, wordOf(4, 'selamat'), wordOf(4, 'jernih') + 0.6);
  const spread = ramp(t, cue(4), cue(4) + 1.2, EASE_IN_OUT);
  const kafir = ramp(t, cue(5) + 0.2, cue(5) + 1.1, BACK);
  const reads = ramp(t, wordOf(5, 'mukmin') - 0.2, wordOf(5, 'mukmin') + 1.2);
  const iman = ramp(t, wordOf(5, 'iman') - 0.2, wordOf(5, 'iman') + 0.7);
  const ag = 1 - conv; // AI masih tampak janggal sebelum menyatu
  const fx = mix(0, 330, spread);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <defs>
          <clipPath id="ad-clip">
            <rect x={-170} y={-190} width={340} height={360} rx={12} />
          </clipPath>
          <clipPath id="ad-rev">
            <rect x={700} y={400} width={520 * rev} height={320} />
          </clipPath>
          <radialGradient id="ad-heart" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor={C.cyan} />
            <stop offset="100%" stopColor="#0f5e7a" />
          </radialGradient>
        </defs>

        {/* chip + tanda tanya */}
        <g opacity={chip} transform={`translate(960 ${mix(600, 620, ramp(t, cue(1), cue(1) + 1))})`}>
          <Glow x={0} y={0} r={240} color="spr" opacity={0.5} />
          <Chip t={t} />
          <text x={0} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontWeight={700} fontSize={84} fill={C.spr} opacity={(1 - tech) * (0.8 + 0.2 * Math.sin(t * 3))}>
            ?
          </text>
          <text x={0} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.head} fontWeight={700} fontSize={70} fill={C.cyan} opacity={tech}>
            ≠
          </text>
        </g>
        <Label x={960} y={810} size={30} color={C.cyan} opacity={tech}>
          teknologi bukan Dajjal itu sendiri
        </Label>

        {/* ilusi: taman yang sebenarnya api */}
        <g opacity={ill}>
          <Glow x={960} y={560} r={420} color="spr" opacity={0.4} />
          <rect x={700} y={400} width={520} height={320} rx={14} fill="#123a2e" />
          {Array.from({length: 7}, (_, k) => {
            const x = 740 + k * 72;
            const sw = 4 * Math.sin(t * 1.2 + k);
            return (
              <g key={k}>
                <line x1={x} y1={700} x2={x + sw} y2={600} stroke="#6b4a2e" strokeWidth={6} />
                <circle cx={x + sw} cy={585 - (k % 2) * 30} r={34} fill={C.work} opacity={0.75} />
              </g>
            );
          })}
          <g clipPath="url(#ad-rev)">
            <rect x={700} y={400} width={520} height={320} fill="#3a0d14" />
            {Array.from({length: 16}, (_, k) => {
              const x = 720 + k * 32;
              const h = 80 + 70 * Math.abs(Math.sin(t * 3 + k * 1.3));
              return <path key={k} d={`M${x - 16},720 Q${x - 8},${720 - h * 0.6} ${x},${720 - h} Q${x + 8},${720 - h * 0.6} ${x + 16},720 Z`} fill={k % 2 ? C.heat : C.kin} opacity={0.8} />;
            })}
          </g>
          <line x1={700 + 520 * rev} y1={400} x2={700 + 520 * rev} y2={720} stroke={C.spr} strokeWidth={4} opacity={Math.min(1, rev * 20, (1 - rev) * 20)} />
          <rect x={700} y={400} width={520} height={320} rx={14} fill="none" stroke={C.spr} strokeWidth={4} />
          <Label x={790} y={380} size={22} color={C.work} opacity={1 - rev * 0.6} anchor="start">
            tampak: surga
          </Label>
          <Label x={1210} y={380} size={22} color={C.heat} opacity={rev} anchor="end">
            sebenarnya: neraka
          </Label>
        </g>
        <Label x={960} y={790} size={34} color={C.spr} opacity={fake} weight={600}>
          yang palsu tampak benar
        </Label>

        {/* foto asli vs buatan AI */}
        <g opacity={frames * (1 - 0.7 * spread)}>
          <Frame x={640 - fx} y={560} t={t} g={0} seed={0.3} col={C.cyan} />
          <Frame x={1280 + fx} y={560} t={t} g={ag} seed={0.3} col={interpolateColors(conv, [0, 1], [C.spr, C.cyan])} />
          {/* label: ASLI / AI → ? */}
          <Label x={640 - fx} y={340} size={26} color={C.cyan} opacity={1 - qmark} font="mono" weight={600}>
            ASLI
          </Label>
          <Label x={1280 + fx} y={340} size={26} color={C.spr} opacity={1 - qmark} font="mono" weight={600}>
            BUATAN AI
          </Label>
          <Label x={640 - fx} y={340} size={30} color={C.spr} opacity={qmark} font="mono" weight={700}>
            ?
          </Label>
          <Label x={1280 + fx} y={340} size={30} color={C.spr} opacity={qmark} font="mono" weight={700}>
            ?
          </Label>
          {/* wajah · suara · video */}
          {[
            {k: 'wajah', l: 'wajah'},
            {k: 'suara', l: 'suara'},
            {k: 'video', l: 'video'},
          ].map((m, i) => {
            const on = ramp(t, wordOf(3, m.k) - 0.2, wordOf(3, m.k) + 0.5);
            const x = 860 + i * 100;
            return (
              <g key={m.k} opacity={on * (1 - spread)}>
                <circle cx={x} cy={520} r={34} fill="#140f30" stroke={C.spr} strokeWidth={2} />
                {i === 0 ? <circle cx={x} cy={514} r={12} fill="none" stroke={C.spr} strokeWidth={3} /> : null}
                {i === 0 ? <path d={`M${x - 16},538 Q${x},524 ${x + 16},538`} fill="none" stroke={C.spr} strokeWidth={3} /> : null}
                {i === 1
                  ? Array.from({length: 5}, (_, k) => {
                      const h = 6 + 18 * Math.abs(Math.sin(t * 6 + k));
                      return <rect key={k} x={x - 16 + k * 7} y={520 - h / 2} width={4} height={h} rx={2} fill={C.spr} />;
                    })
                  : null}
                {i === 2 ? <path d={`M${x - 9},506 L${x + 13},520 L${x - 9},534 Z`} fill={C.spr} /> : null}
                <Label x={x} y={574} size={18} color={C.muted}>
                  {m.l}
                </Label>
              </g>
            );
          })}
          <Ripple x={1280 + fx} y={560} p={(t - wordOf(3, 'aslinya')) / 1.4} r={260} color="spr" rings={2} />
        </g>
        <Motes x={960} y={560} rx={700} ry={260} n={26} color="spr" opacity={0.45 * Math.max(frames, ill)} seed={11} />

        {/* lampu hati yang jernih */}
        <g opacity={lamp} transform={`translate(960 ${mix(560, 520, ramp(t, cue(5), cue(5) + 1, EASE_IN_OUT))}) scale(${mix(1, 0.62, ramp(t, cue(5), cue(5) + 1, EASE_IN_OUT))})`}>
          <Glow x={0} y={-10} r={200 + 160 * bright} color="cyan" opacity={0.3 + 0.7 * bright} />
          {Array.from({length: 14}, (_, k) => {
            const a = (k / 14) * Math.PI * 2 + t * 0.15;
            const r0 = 120;
            const r1 = 150 + 50 * bright + 10 * Math.sin(t * 2 + k);
            return <line key={k} x1={r0 * Math.cos(a)} y1={-14 + r0 * Math.sin(a)} x2={r1 * Math.cos(a)} y2={-14 + r1 * Math.sin(a)} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" opacity={0.2 + 0.7 * bright} />;
          })}
          <path d={heartD(1.6)} fill="url(#ad-heart)" opacity={0.35 + 0.65 * bright} stroke={C.cyan} strokeWidth={3} transform={`scale(${1 + 0.03 * Math.sin(t * 2.2)})`} />
          <text y={238} textAnchor="middle" fontFamily={FONT.head} fontWeight={600} fontSize={32} fill={C.cyan} opacity={ramp(t, wordOf(4, 'jernih') - 0.4, wordOf(4, 'jernih') + 0.4) * (1 - ramp(t, cue(5), cue(5) + 0.6))}>
            hati yang jernih
          </text>
        </g>
        <Twinkles x={960} y={540} rx={260} ry={200} n={6} color="cyan" opacity={bright * lamp} seed={12} />

        {/* "kafir" terbaca setiap mukmin */}
        <g opacity={Math.min(1, kafir)}>
          {Array.from({length: 9}, (_, k) => {
            const a = Math.PI * (0.08 + (k / 8) * 0.84);
            const x = 960 + 520 * Math.cos(a) * -1;
            const y = 690 - 120 * Math.sin(a) + 160;
            const bob = 2 * Math.sin(t * 1.4 + k);
            const on = ramp(reads, k / 12, k / 12 + 0.3);
            return (
              <g key={k}>
                <line x1={x} y1={y - 30} x2={960 + (x - 960) * 0.35} y2={540} stroke={C.cyan} strokeOpacity={0.35 * on} strokeWidth={2} strokeDasharray="4 7" strokeDashoffset={-t * 20} />
                <rect x={x - 8} y={y - 18 + bob} width={16} height={30} rx={8} fill={C.cyan} opacity={0.4 + 0.5 * on} />
                <circle cx={x} cy={y - 28 + bob} r={8} fill={C.cyan} opacity={0.4 + 0.5 * on} />
                <circle cx={x} cy={y - 10} r={22} fill="url(#soft-cyan)" opacity={on} />
              </g>
            );
          })}
        </g>
      </Stage>

      <Renungan t={t} />
      <Note x={960} y={330} p={q} color={C.spr} size={46}>
        Apakah <span style={{color: C.spr}}>kecerdasan buatan</span> adalah Dajjal?
      </Note>
      <Note x={960} y={330} p={ulama} color={C.gold} size={34}>
        mayoritas ulama: Dajjal <span style={{color: C.gold}}>sosok manusia nyata</span>
        <div style={{fontSize: 22, color: C.muted, marginTop: 4}}>dengan ciri fisik yang disebut Nabi</div>
      </Note>
      <Note x={960} y={262} p={eye} color={C.spr} size={36}>
        mata tidak lagi bisa dipercaya
      </Note>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540,
          transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * Math.min(1, kafir)})`,
          opacity: Math.min(1, kafir),
          padding: '18px 54px',
          borderRadius: 16,
          background: 'rgba(10,16,36,0.92)',
          border: `2px solid ${C.cyan}`,
          boxShadow: `0 0 ${24 + 30 * reads}px ${C.cyan}66`,
          fontFamily: FONT.serif,
          fontSize: 76,
          fontStyle: 'italic',
          color: C.ink,
          letterSpacing: 6,
          whiteSpace: 'nowrap',
        }}
      >
        kafir
        <div style={{fontFamily: FONT.sans, fontStyle: 'normal', fontSize: 22, color: C.muted, letterSpacing: 0, textAlign: 'center'}}>terbaca oleh setiap mukmin</div>
      </div>
      <Note x={960} y={300} p={iman} color={C.cyan} size={48}>
        <span style={{color: C.cyan}}>Iman</span>, bukan kecerdasan
      </Note>
    </AbsoluteFill>
  );
};
