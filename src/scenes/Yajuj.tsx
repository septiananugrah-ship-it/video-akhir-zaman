import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN, EASE_IN_OUT, cyc, mix, ramp, rand} from '../anim';
import {Badge, Glow, Label, Motes, Note, Ripple, Spark, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Yakjuj & Makjuj dalam Al-Qur'an (QS Al-Kahfi 18:94–98; QS Al-Anbiya 21:96). Tanpa sosok Dzulqarnain (hanya cahaya emas
// penjelajah) dan tanpa sosok Yakjuj Makjuj (kawanan titik merah abstrak). Manusia umum = siluet kecil tanpa wajah.
// Dinding: balok besi bertumpuk di celah dua gunung → tembaga cair menyala → kawanan tak mampu mendaki → kelak hancur rata.

const slot = (t: number, a: number, b: number, fi = 0.5, fo = 0.45) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
const Pill: React.FC<{x: number; y: number; p: number; text: string}> = ({x, y, p, text}) => (
  <Badge x={x} y={y} text={text} color={C.gold} opacity={p} scale={0.9 + 0.1 * p} size={27} />
);

const GROUND = 720;
const TOPW = 390; // puncak dinding
const xL = (y: number) => 680 + ((y - 250) * 220) / 470;
const xR = (y: number) => 1240 - ((y - 240) * 220) / 480;
const ROWS = 8;
const RH = (GROUND - TOPW) / ROWS;
const BLOCKS = (() => {
  const out: {x: number; y: number; w: number; row: number; k: number}[] = [];
  let k = 0;
  for (let r = 0; r < ROWS; r++) {
    const y = GROUND - (r + 1) * RH;
    const a = xL(y + RH) - 6;
    const b = xR(y + RH) + 6;
    const n = Math.max(2, Math.round((b - a) / 62));
    const w = (b - a) / n;
    for (let i = 0; i < n; i++) out.push({x: a + i * w, y, w, row: r, k: k++});
  }
  return out;
})();
const NBLK = BLOCKS.length;
const WALL_D = `M${xL(GROUND)},${GROUND} L${xL(TOPW)},${TOPW} L${xR(TOPW)},${TOPW} L${xR(GROUND)},${GROUND} Z`;

const Person: React.FC<{x: number; y: number; s?: number; t: number; i: number}> = ({x, y, s = 1, t, i}) => {
  const b = 2 * Math.sin(t * 2 + i);
  const arm = -30 - 20 * Math.max(0, Math.sin(t * 1.6 + i * 1.3));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#6c7aa8">
      <circle cx={0} cy={-58 + b} r={9} />
      <path d={`M-10,${-46 + b} Q0,${-50 + b} 10,${-46 + b} L13,-14 L-13,-14 Z`} />
      <rect x={-10} y={-16} width={7} height={16} rx={3} />
      <rect x={3} y={-16} width={7} height={16} rx={3} />
      <line x1={8} y1={-42 + b} x2={8 + 20 * Math.cos((arm * Math.PI) / 180)} y2={-42 + b + 20 * Math.sin((arm * Math.PI) / 180)} stroke="#6c7aa8" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

export const Yajuj: React.FC = () => {
  const {t, cue, cueEnd, wordOf} = useScene();

  // ---------- baris 0: perjalanan timur & barat ----------
  const s0 = ramp(t, -0.3, 0.8) * (1 - ramp(t, cue(1) - 0.2, cue(1) + 0.7, EASE_IN_OUT));
  const pE = ramp(t, 0.6, wordOf(0, 'timur') + 0.6, EASE_IN_OUT);
  const pW = ramp(t, wordOf(0, 'barat') - 0.4, cueEnd(0) + 0.4, EASE_IN_OUT);
  const pC = ramp(t, cueEnd(0) + 0.3, cue(1) + 0.6, EASE_IN_OUT);
  const tx = mix(mix(mix(960, 1580, pE), 340, pW), 960, pC);
  const txAt = (s: number) => mix(mix(mix(960, 1580, ramp(s, 0.6, wordOf(0, 'timur') + 0.6, EASE_IN_OUT)), 340, ramp(s, wordOf(0, 'barat') - 0.4, cueEnd(0) + 0.4, EASE_IN_OUT)), 960, ramp(s, cueEnd(0) + 0.3, cue(1) + 0.6, EASE_IN_OUT));
  const vx = (txAt(t + 0.05) - txAt(t - 0.05)) / 0.1;
  const trailK = Math.max(-1, Math.min(1, vx / 300));
  const ty = 560 - 40 * Math.sin(Math.PI * ((tx - 340) / 1240)) + 4 * Math.sin(t * 3);
  const nameP = ramp(t, wordOf(0, 'dzulqarnain') - 0.3, wordOf(0, 'dzulqarnain') + 0.5);
  const pillK0 = slot(t, wordOf(0, 'dzulqarnain'), cue(1) + 0.4);

  // ---------- baris 1: dua gunung, kaum mengeluh ----------
  const mtn = ramp(t, cue(1) - 0.6, cue(1) + 0.8);
  const people = ramp(t, wordOf(1, 'kaum') - 0.4, wordOf(1, 'kaum') + 0.4);
  const say = slot(t, wordOf(1, 'mengeluh') - 0.2, cue(2) + 0.4);
  const harm = ramp(t, wordOf(1, 'kerusakan') - 0.4, wordOf(1, 'kerusakan') + 0.4);
  const swarmA = ramp(t, wordOf(1, 'yakjuj') - 0.4, wordOf(1, 'yakjuj') + 0.6);

  // ---------- baris 2: besi + tembaga ----------
  const bA = cue(2) + 0.3;
  const bB = wordOf(2, 'tembaga') - 0.4;
  const blockT = (k: number) => bA + ((bB - bA) * k) / NBLK;
  const tCu = wordOf(2, 'tembaga');
  const pour = slot(t, tCu - 0.3, tCu + 3.2, 0.4, 0.8);
  const molten = ramp(t, tCu, tCu + 1.8);
  const cool = ramp(t, tCu + 2.5, tCu + 6);
  const tClimb = wordOf(2, 'mendaki');
  const climb = ramp(t, tClimb - 0.8, tClimb) * (1 - ramp(t, cue(3) + 1, cue(3) + 2));
  const pillK = ramp(t, tCu - 0.3, tCu + 0.4) * (1 - ramp(t, cue(4) - 0.4, cue(4) + 0.1, EASE_IN_OUT));
  const pillPulse = Math.max(0, 1 - Math.abs(t - wordOf(3, 'surah')) / 0.6);

  // ---------- baris 3: rahmat, kelak hancur rata ----------
  const rahmat = slot(t, wordOf(3, 'rahmat') - 0.3, wordOf(3, 'hancur') - 0.2, 0.6, 0.8);
  const tH = wordOf(3, 'hancur');
  const janji = slot(t, wordOf(3, 'janji') - 0.3, tH + 2.2);
  const hancurLbl = slot(t, tH - 0.2, cue(4) + 0.2);

  // ---------- baris 4: turun dari setiap tempat tinggi ----------
  const pillA = ramp(t, wordOf(4, 'anbiya') - 0.3, wordOf(4, 'anbiya') + 0.4);
  const pourDown = ramp(t, wordOf(4, 'dilepaskan') - 0.3, wordOf(4, 'turun') + 0.6);
  const highLbl = ramp(t, wordOf(4, 'tinggi') - 0.6, wordOf(4, 'tinggi') + 0.3);

  const shake = climb * 1.6 * Math.sin(t * 23);
  const PEAKS: [number, number][] = [[680, 250], [1240, 240], [300, 430], [1640, 420], [470, 380], [1460, 360]];

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <clipPath id="yj-above">
            <rect x={0} y={0} width={1920} height={TOPW + 2} />
          </clipPath>
          <linearGradient id="yj-mtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c3a6c" />
            <stop offset="100%" stopColor="#141c3e" />
          </linearGradient>
        </defs>

        {/* ---------- perjalanan ---------- */}
        {s0 > 0.001 ? (
          <g opacity={s0}>
            <path d="M200,600 Q960,470 1720,600" fill="none" stroke="#3a4b80" strokeWidth={3} />
            <path d="M200,600 Q960,470 1720,600 L1720,640 L200,640 Z" fill="#14204a" opacity={0.7} />
            {Array.from({length: 9}, (_, i) => {
              const x = 330 + i * 150;
              const y = 600 - 130 * (1 - ((x - 960) / 760) ** 2) * 0.55;
              return <path key={i} d={`M${x - 26},${y + 4} L${x},${y - 30 - 10 * (i % 3)} L${x + 26},${y + 4} Z`} fill="#22306a" opacity={0.8} />;
            })}
            {/* matahari terbenam (barat) & terbit (timur) */}
            <Glow x={300} y={560} r={150} color="kin" opacity={0.6 + 0.4 * pW} />
            <circle cx={300} cy={570 + 10 * Math.sin(t * 0.6)} r={30} fill={C.kin} opacity={0.85} />
            <Glow x={1620} y={540} r={150} color="force" opacity={0.6 + 0.4 * pE} />
            <circle cx={1620} cy={548 - 10 * Math.sin(t * 0.6)} r={30} fill={C.force} opacity={0.85} />
            <Label x={300} y={680} size={30} color={C.kin} weight={600}>
              barat
            </Label>
            <Label x={1620} y={680} size={30} color={C.force} weight={600}>
              timur
            </Label>
            {/* jejak & cahaya penjelajah */}
            {Array.from({length: 10}, (_, k) => {
              const ph = (t * 0.8 + k / 10) % 1;
              return <circle key={k} cx={tx - trailK * ph * 120} cy={ty + 6} r={3} fill={C.gold} opacity={cyc(ph) * 0.6} />;
            })}
            <Spark x={tx} y={ty} r={11} color="gold" />
            <Glow x={tx} y={ty} r={90} color="gold" />
            <Label x={960} y={300} size={58} weight={600} color={C.gold} opacity={nameP}>
              Dzulqarnain
            </Label>
            <Label x={960} y={360} size={24} color={C.muted} italic font="serif" opacity={nameP}>
              penjelajah ke timur dan barat
            </Label>
          </g>
        ) : null}

        {/* ---------- gunung, kawanan, dinding ---------- */}
        {mtn > 0.001 ? (
          <g opacity={mtn}>
            {/* puncak jauh */}
            {PEAKS.slice(2).map(([x, y], i) => (
              <path key={i} d={`M${x - 220},${GROUND} L${x},${y} L${x + 220},${GROUND} Z`} fill="#18224a" opacity={0.7} />
            ))}
            {/* kawanan di balik celah */}
            <g opacity={swarmA}>
              {Array.from({length: 70}, (_, i) => {
                const a = t * (0.5 + rand(i) * 0.9) + rand(i + 7) * 6.28;
                const cx = 960 + Math.cos(a) * 200 * rand(i + 2) + 30 * Math.sin(t * 1.3 + i);
                const cy = 600 + Math.sin(a * 1.4) * 90 * rand(i + 4) + 10 * Math.cos(t * 1.7 + i);
                return <circle key={i} cx={cx} cy={cy} r={3 + rand(i + 9) * 2} fill={C.heat} opacity={0.85} />;
              })}
              <Glow x={960} y={600} r={220} color="heat" opacity={0.5 * harm} />
            </g>
            {/* dua gunung */}
            <path d={`M380,${GROUND} L680,250 L${xL(GROUND)},${GROUND} Z`} fill="url(#yj-mtn)" stroke="#3a4b80" strokeWidth={2} />
            <path d={`M${xR(GROUND)},${GROUND} L1240,240 L1560,${GROUND} Z`} fill="url(#yj-mtn)" stroke="#3a4b80" strokeWidth={2} />
            <path d="M680,250 L640,310 L668,300 L690,320 L716,296 Z" fill="#c8d2ee" opacity={0.6} />
            <path d="M1240,240 L1202,300 L1228,290 L1250,310 L1276,286 Z" fill="#c8d2ee" opacity={0.6} />
            <rect x={160} y={GROUND} width={1600} height={6} rx={3} fill="#2a3a66" />
            <rect x={160} y={GROUND + 6} width={1600} height={60} fill="url(#ground)" />

            {/* balok besi */}
            <g transform={`translate(${shake} 0)`}>
              {BLOCKS.map((b) => {
                const tb = blockT(b.k);
                const drop = ramp(t, tb, tb + 0.45, EASE_IN);
                if (drop <= 0) return null;
                // hancur rata: jatuh ke tumpukan rendah
                const delay = (ROWS - 1 - b.row) * 0.12 + rand(b.k) * 0.3;
                const fall = ramp(t, tH + delay, tH + delay + 0.8, EASE_IN);
                const ry = GROUND - 14 - rand(b.k + 50) * 22;
                const rx = b.x + (rand(b.k + 70) - 0.5) * 160;
                const y0 = mix(b.y - 260, b.y, drop);
                const x = mix(b.x, rx, fall);
                const y = mix(y0, ry, fall);
                const rot = fall * (rand(b.k + 90) - 0.5) * 120;
                const hot = molten * (1 - cool);
                const h = mix(RH - 3, 16, fall);
                return (
                  <g key={b.k} transform={`rotate(${rot} ${x + b.w / 2} ${y + h / 2})`} opacity={drop}>
                    <rect x={x + 1.5} y={y + 1.5} width={b.w - 3} height={h} rx={4} fill="#58637f" stroke="#8d97b3" strokeWidth={1.5} />
                    <rect x={x + 1.5} y={y + 1.5} width={b.w - 3} height={h} rx={4} fill={C.kin} opacity={hot * 0.85 * (1 - fall)} />
                    <rect x={x + 1.5} y={y + 1.5} width={b.w - 3} height={h} rx={4} fill="#b06a32" opacity={cool * 0.75 * (1 - fall)} />
                    <rect x={x + 6} y={y + 5} width={b.w - 14} height={4} rx={2} fill="#c8d0e4" opacity={0.35} />
                  </g>
                );
              })}
            </g>
            {/* tembaga cair dituang */}
            {pour > 0.001 ? (
              <g opacity={pour}>
                {[-120, 0, 120].map((dx, i) => {
                  const x = 960 + dx + 6 * Math.sin(t * 4 + i);
                  return (
                    <g key={i}>
                      <rect x={x - 9} y={262} width={18} height={TOPW - 262} rx={9} fill={C.kin} opacity={0.9} />
                      <rect x={x - 3} y={262} width={6} height={TOPW - 262} rx={3} fill={C.force} opacity={0.9} />
                      <path d={`M${x - 40},262 L${x + 40},262 L${x + 24},242 L${x - 24},242 Z`} fill="#4a3a2a" stroke="#c07a3a" strokeWidth={2} />
                    </g>
                  );
                })}
                {Array.from({length: 14}, (_, i) => {
                  const ph = (t * 1.1 + i / 14) % 1;
                  return <circle key={i} cx={840 + (i % 7) * 40 + 10 * Math.sin(t * 2 + i)} cy={TOPW - ph * 60} r={3} fill={C.force} opacity={cyc(ph)} />;
                })}
              </g>
            ) : null}
            <g opacity={molten * (1 - ramp(t, tH, tH + 0.6))}>
              <path d={WALL_D} fill="url(#soft-kin)" opacity={(1 - cool) * (0.8 + 0.2 * Math.sin(t * 5))} />
              <path d={`M${xL(TOPW) - 4},${TOPW} L${xR(TOPW) + 4},${TOPW}`} stroke={C.kin} strokeWidth={8} opacity={0.6 + 0.4 * (1 - cool)} strokeLinecap="round" />
            </g>
            <Glow x={960} y={560} r={360} color="kin" opacity={molten * (1 - cool) * 0.9} />
            <Glow x={960} y={540} r={380} color="gold" opacity={rahmat} />
            <Twinkles x={960} y={540} rx={220} ry={150} n={6} color="gold" opacity={rahmat} />

            {/* kawanan berusaha mendaki — terlihat hanya di atas tepi dinding */}
            <g clipPath="url(#yj-above)" opacity={climb}>
              {Array.from({length: 18}, (_, i) => {
                const ph = (t * (0.7 + rand(i) * 0.5) + rand(i + 3)) % 1;
                const x = xL(TOPW) + 20 + rand(i + 5) * (xR(TOPW) - xL(TOPW) - 40);
                const y = TOPW + 14 - 34 * Math.sin(Math.PI * ph);
                return <circle key={i} cx={x} cy={y} r={4} fill={C.heat} opacity={0.9} />;
              })}
            </g>
            {climb > 0
              ? [0, 1, 2].map((k) => {
                  const ph = (t * 0.8 + k / 3) % 1;
                  return <Ripple key={k} x={860 + k * 100} y={560 + 40 * Math.sin(k * 2)} p={ph} r={60} color="heat" rings={1} width={2} />;
                })
              : null}

            {/* debu saat hancur */}
            {t > tH - 0.2 && t < tH + 4
              ? Array.from({length: 18}, (_, i) => {
                  const ph = ramp(t, tH + rand(i) * 0.8, tH + 1.6 + rand(i) * 0.8);
                  return <circle key={i} cx={xL(GROUND) + rand(i + 3) * 160 + (rand(i + 6) - 0.5) * 120 * ph} cy={GROUND - 20 - 120 * ph} r={10 + 20 * ph} fill="#7a7f9a" opacity={0.35 * Math.sin(Math.PI * ph)} />;
                })
              : null}

            {/* turun dari setiap tempat tinggi */}
            {pourDown > 0
              ? PEAKS.map(([px, py], i) => (
                  <g key={i}>
                    <Stream pts={[[px, py + 6], [px + (i % 2 ? -1 : 1) * 110, (py + GROUND) / 2], [px + (i % 2 ? -1 : 1) * 210, GROUND - 6]]} color="heat" n={16} speed={0.55} r={6} opacity={pourDown} seed={i} jitter={4} />
                    <Stream pts={[[px, py + 6], [px + (i % 2 ? 1 : -1) * 120, (py + GROUND) / 2], [px + (i % 2 ? 1 : -1) * 200, GROUND - 6]]} color="heat" n={12} speed={0.5} r={6} opacity={pourDown * 0.8} seed={i + 9} jitter={4} />
                  </g>
                ))
              : null}
            {pourDown > 0
              ? Array.from({length: 40}, (_, i) => {
                  const ph = (t * 0.25 + rand(i)) % 1;
                  const x0 = 260 + rand(i + 2) * 1400;
                  return <circle key={i} cx={x0 + (rand(i + 4) - 0.5) * 120 * ph} cy={GROUND - 4 - 6 * rand(i + 8)} r={3.5} fill={C.heat} opacity={pourDown * cyc(ph)} />;
                })
              : null}

            {/* siluet kaum (tanpa wajah) */}
            <g opacity={people * (1 - ramp(t, cue(3), cue(3) + 0.8))}>
              {[0, 1, 2, 3].map((i) => (
                <Person key={i} x={220 + i * 42} y={GROUND} s={0.9 + 0.08 * (i % 2)} t={t} i={i} />
              ))}
            </g>
            <Motes x={960} y={500} rx={600} ry={240} n={24} color={pourDown > 0 ? 'heat' : 'gold'} opacity={0.35} />
          </g>
        ) : null}

        {/* label */}
        <Label x={960} y={GROUND + 46} size={30} color="#aab3cc" opacity={slot(t, cue(2) + 0.2, tCu - 0.1)}>
          potongan besi ditumpuk di antara dua gunung
        </Label>
        <Label x={960} y={GROUND + 46} size={30} color={C.kin} opacity={slot(t, tCu - 0.1, tClimb - 0.3)}>
          tembaga cair dituang di atasnya
        </Label>
        <Label x={960} y={GROUND + 46} size={30} color={C.heat} opacity={slot(t, tClimb - 0.3, cue(3) + 0.3)}>
          tak mampu mendaki maupun melubanginya
        </Label>
        <Label x={960} y={GROUND + 46} size={30} color={C.gold} opacity={slot(t, wordOf(3, 'rahmat') - 0.3, wordOf(3, 'janji') - 0.1)}>
          “ini rahmat dari Tuhanku”
        </Label>
        <Label x={960} y={GROUND + 46} size={26} color={C.muted} italic font="serif" opacity={janji * (1 - hancurLbl)}>
          kelak, bila janji Tuhanku datang…
        </Label>
        <Label x={960} y={300} size={64} weight={700} color={C.heat} opacity={hancurLbl}>
          hancur rata
        </Label>
        <Label x={960} y={GROUND + 46} size={30} color={C.heat} weight={600} opacity={highLbl}>
          turun dengan cepat dari setiap tempat yang tinggi
        </Label>
        <Ripple x={960} y={600} p={ramp(t, tH, tH + 1.8)} r={420} color="heat" rings={3} />
        {pour > 0 ? <Spark x={960} y={TOPW} r={7} color="kin" opacity={pour} /> : null}
      </Stage>

      <Pill x={960} y={220} p={pillK0} text="QS Al-Kahfi" />
      <Note x={420} y={500} p={say * people} color={C.muted} size={28}>
        “Yakjuj dan Makjuj
        <div>berbuat kerusakan di bumi!”</div>
      </Note>
      <Pill x={960} y={200} p={pillK} text="QS Al-Kahfi 94–98" />
      {pillPulse > 0 ? <div style={{position: 'absolute', left: 960, top: 200, width: 0, height: 0, boxShadow: `0 0 ${60 * pillPulse}px ${30 * pillPulse}px ${C.gold}55`}} /> : null}
      <Pill x={960} y={200} p={pillA} text="QS Al-Anbiya 96" />
    </AbsoluteFill>
  );
};
