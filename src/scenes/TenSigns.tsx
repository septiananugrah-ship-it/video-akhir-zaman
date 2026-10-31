import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Spark, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Sepuluh tanda besar (Muslim 2901, Hudzaifah bin Asid) — urutan ikon mengikuti lafaz narasi.
// Baris 0: untaian manik-manik putus, manik berjatuhan beruntun (tanda susul-menyusul, riwayat Ahmad, tanpa pil).
// Baris 2–3: sepuluh ikon simbolik menyala sesuai kata. Baris 4: catatan "urutan diperselisihkan ulama".

const slot = (t: number, a: number, b: number, fi = 0.5, fo = 0.45) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

const Pill: React.FC<{x: number; y: number; p: number; text: string}> = ({x, y, p, text}) => (
  <Badge x={x} y={y} text={text} color={C.gold} opacity={p} scale={0.9 + 0.1 * p} size={27} />
);

const COLS = [360, 660, 960, 1260, 1560];
const ROWS = [395, 640];
const R = 78;
const POS = Array.from({length: 10}, (_, i) => [COLS[i % 5], ROWS[Math.floor(i / 5)]] as [number, number]);
const NAMES = ['asap', 'Dajjal', 'binatang dari bumi', 'matahari dari barat', 'turunnya Isa', 'Yakjuj Makjuj', 'ambles · timur', 'ambles · barat', 'ambles · Jazirah Arab', 'api dari Yaman'];

// ---------- ikon (koordinat lokal, pusat 0,0, |x|,|y| < 62) ----------
const Smoke: React.FC<{t: number}> = ({t}) => (
  <g>
    {Array.from({length: 6}, (_, i) => {
      const ph = (t * 0.32 + i / 6) % 1;
      return <circle key={i} cx={-18 + (i % 3) * 18 + 10 * Math.sin(t * 1.3 + i)} cy={44 - ph * 96} r={12 + ph * 20} fill="#a7acc4" opacity={cyc(ph) * 0.55} />;
    })}
    <ellipse cx={0} cy={46} rx={40} ry={7} fill="#5b6280" opacity={0.6} />
  </g>
);

const DEmblem: React.FC<{t: number}> = ({t}) => (
  <g>
    <circle r={44} fill="#1a0f2e" stroke={C.spr} strokeWidth={2} strokeOpacity={0.7} />
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={smoothPath(Array.from({length: 9}, (_, s) => {
          const a = t * 0.9 + (k * 2 * Math.PI) / 3 + s * 0.42;
          const rr = 22 + s * 4.6;
          return [Math.cos(a) * rr, Math.sin(a) * rr] as [number, number];
        }))}
        fill="none"
        stroke={C.spr}
        strokeWidth={3}
        strokeOpacity={0.55}
        strokeLinecap="round"
      />
    ))}
    <text x={0} y={2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.serif} fontWeight={600} fontSize={46} fill="#d9c2ff">
      D
    </text>
  </g>
);

const Beast: React.FC<{t: number}> = ({t}) => {
  const rise = 6 * Math.sin(t * 1.4);
  return (
    <g>
      <path d={`M-40,${8 - rise} Q-30,${-26 - rise} -6,${-24 - rise} L2,${-38 - rise} L8,${-22 - rise} Q34,${-18 - rise} 42,${8 - rise} Z`} fill="#2a2140" stroke="#6d5a92" strokeWidth={2} />
      <rect x={-56} y={10} width={112} height={40} fill="#0a1024" />
      <path d="M-56,12 L-14,12 L-6,4 L2,14 L10,6 L56,12" fill="none" stroke={C.heat} strokeWidth={3} strokeOpacity={0.7} />
      {Array.from({length: 5}, (_, i) => {
        const ph = (t * 0.6 + i / 5) % 1;
        return <circle key={i} cx={-30 + i * 15} cy={10 - ph * 30} r={2.4} fill="#9b8bb8" opacity={cyc(ph) * 0.8} />;
      })}
    </g>
  );
};

const SunWest: React.FC<{t: number; k: number}> = ({t, k}) => {
  const sy = mix(36, -6, k) + 2 * Math.sin(t * 1.1);
  return (
    <g>
      <clipPath id="ts-hz">
        <rect x={-62} y={-62} width={124} height={84} />
      </clipPath>
      <g clipPath="url(#ts-hz)">
        {Array.from({length: 10}, (_, i) => {
          const a = t * 0.4 + (i * Math.PI) / 5;
          return <line key={i} x1={-22 + Math.cos(a) * 24} y1={sy + Math.sin(a) * 24} x2={-22 + Math.cos(a) * 36} y2={sy + Math.sin(a) * 36} stroke={C.kin} strokeWidth={3} strokeLinecap="round" opacity={0.7} />;
        })}
        <circle cx={-22} cy={sy} r={19} fill={C.kin} />
        <circle cx={-26} cy={sy - 5} r={7} fill="#ffd9a8" opacity={0.8} />
      </g>
      <line x1={-56} y1={22} x2={56} y2={22} stroke="#6b7aa8" strokeWidth={2.5} />
      <text x={-40} y={42} textAnchor="middle" fontFamily={FONT.head} fontSize={15} fontWeight={600} fill={C.kin}>
        BARAT
      </text>
      <text x={40} y={42} textAnchor="middle" fontFamily={FONT.head} fontSize={15} fill="#6b7aa8">
        TIMUR
      </text>
    </g>
  );
};

const Descend: React.FC<{t: number}> = ({t}) => {
  const ph = (t * 0.3) % 1;
  const y = -58 + ph * 90;
  return (
    <g>
      <rect x={-7} y={-60} width={14} height={110} fill={C.cyan} opacity={0.14} rx={7} />
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={s * 20} cy={y} rx={16} ry={7} transform={`rotate(${s * (-24 + 8 * Math.sin(t * 2))} ${s * 20} ${y})`} fill="#dff6ff" opacity={0.35 * cyc(ph) + 0.1} />
      ))}
      <circle cx={0} cy={y} r={9} fill="#fff" opacity={0.3 + 0.7 * cyc(ph)} />
      <circle cx={0} cy={y} r={20} fill={C.cyan} opacity={0.25 * cyc(ph)} />
      <path d="M-14,50 L-14,30 L-8,22 L-2,30 L-2,50 Z" fill="#e8eefc" opacity={0.85} />
    </g>
  );
};

const Swarm: React.FC<{t: number; n?: number; spread?: number}> = ({t, n = 34, spread = 1}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const a = t * (0.6 + rand(i) * 0.8) + rand(i + 7) * 6.28;
      return (
        <circle
          key={i}
          cx={spread * (Math.cos(a) * 34 * rand(i + 2) + 14 * Math.sin(t * 1.7 + i))}
          cy={spread * (Math.sin(a * 1.3) * 28 * rand(i + 4) + 8 * Math.cos(t * 1.2 + i))}
          r={2.6 + rand(i + 9) * 1.6}
          fill={C.heat}
          opacity={0.85}
        />
      );
    })}
  </g>
);

/** Bumi mini dengan retakan di timur (side=1), barat (-1), atau Jazirah Arab (0). */
const Crack: React.FC<{t: number; side: -1 | 0 | 1; k: number}> = ({t, side, k}) => {
  const glow = 0.5 + 0.5 * Math.sin(t * 3 + side);
  if (side === 0) {
    const pen = 'M-34,-34 L-6,-36 L10,-24 L30,-26 L40,-10 L34,6 L22,22 L-2,38 L-12,28 L-20,6 L-30,-14 Z';
    return (
      <g>
        <path d={pen} fill="#2a3a66" stroke="#8fa0d0" strokeWidth={2} />
        <path d="M-12,-20 L-4,-6 L-10,4 L0,16 L-4,26" fill="none" stroke={C.heat} strokeWidth={6} opacity={0.25 * k * glow} />
        <DrawPath d="M-12,-20 L-4,-6 L-10,4 L0,16 L-4,26" p={k} stroke={C.heat} width={3} />
        <text x={0} y={52} textAnchor="middle" fontFamily={FONT.head} fontSize={14} fill="#8fa0d0">
          ARAB
        </text>
      </g>
    );
  }
  const cx = side * 24;
  const d = `M${cx - 4},-30 L${cx + 6},-14 L${cx - 4},0 L${cx + 6},14 L${cx - 2},30`;
  return (
    <g>
      <circle r={46} fill="#1d2b55" stroke="#8fa0d0" strokeWidth={2} />
      <ellipse rx={46} ry={16} fill="none" stroke="#3a4b80" strokeWidth={1.5} />
      <ellipse rx={20} ry={46} fill="none" stroke="#3a4b80" strokeWidth={1.5} />
      <path d={d} fill="none" stroke={C.heat} strokeWidth={8} opacity={0.25 * k * glow} />
      <DrawPath d={d} p={k} stroke={C.heat} width={3.5} />
      <text x={side * 50} y={-50} textAnchor="middle" fontFamily={FONT.head} fontSize={15} fontWeight={600} fill={C.heat} opacity={k}>
        {side > 0 ? 'T' : 'B'}
      </text>
    </g>
  );
};

const Fire: React.FC<{t: number}> = ({t}) => (
  <g>
    {[-22, 0, 22].map((x, i) => {
      const h = 46 + 10 * Math.sin(t * 6 + i * 2) + 5 * Math.sin(t * 11 + i);
      const sw = 6 * Math.sin(t * 4 + i);
      return (
        <g key={i}>
          <path d={`M${x - 15},34 Q${x - 18},${10} ${x + sw},${34 - h} Q${x + 18},${10} ${x + 15},34 Z`} fill={C.heat} opacity={0.85} />
          <path d={`M${x - 8},34 Q${x - 8},${18} ${x + sw * 0.6},${34 - h * 0.6} Q${x + 8},${18} ${x + 8},34 Z`} fill={C.force} opacity={0.85} />
        </g>
      );
    })}
    {Array.from({length: 6}, (_, i) => {
      const ph = (t * 0.7 + i / 6) % 1;
      return <circle key={i} cx={-30 + i * 12 + 6 * Math.sin(t * 2 + i)} cy={30 - ph * 90} r={2.2} fill={C.kin} opacity={cyc(ph)} />;
    })}
    <rect x={-50} y={34} width={100} height={6} rx={3} fill="#3a2a2a" />
  </g>
);

export const TenSigns: React.FC = () => {
  const {t, cue, cueEnd, wordOf} = useScene();

  // ---------- baris 0: manik-manik ----------
  const NB = 23;
  const tSnap = wordOf(0, 'terputus');
  const BRK = 11;
  const beadsOn = ramp(t, -0.2, 1.2) * (1 - ramp(t, cue(1) + 1.5, cue(1) + 2.3, EASE_IN_OUT));
  const beads = Array.from({length: NB}, (_, i) => {
    const u = i / (NB - 1);
    const x0 = 300 + u * 1320;
    const sway = 10 * Math.sin(t * 1.1) * Math.sin(Math.PI * u);
    const y0 = 360 + 120 * Math.sin(Math.PI * u) + sway;
    const order = Math.abs(i - BRK + 0.5);
    const ti = tSnap + 0.05 + order * 0.09;
    const dt = Math.max(0, t - ti);
    const dir = i < BRK ? -1 : 1;
    const x = x0 + dir * 60 * dt;
    const y = y0 + 0.5 * 1500 * dt * dt;
    const fall = Math.min(1, dt / 0.15);
    const op = 1 - ramp(y, 700, 830);
    return {x, y, fall, op, x0, y0};
  });
  const snapP = ramp(t, tSnap - 0.05, tSnap + 0.6);

  const bigLbl = slot(t, wordOf(0, 'besar') - 0.2, cue(1) + 0.6);

  // ---------- baris 1–3: grid ikon ----------
  const gridOn = ramp(t, cue(1) - 0.1, cue(1) + 0.9);
  const LIT = [
    wordOf(2, 'asap'),
    wordOf(2, 'dajjal'),
    wordOf(2, 'binatang'),
    wordOf(2, 'matahari'),
    wordOf(2, 'isa'),
    wordOf(2, 'yakjuj'),
    wordOf(3, 'timur'),
    wordOf(3, 'barat'),
    wordOf(3, 'jazirah'),
    wordOf(3, 'api'),
  ];
  const lit = LIT.map((a) => ramp(t, a - 0.15, a + 0.55));
  const pill = ramp(t, wordOf(1, 'riwayat') - 0.3, wordOf(1, 'riwayat') + 0.4);

  // ---------- baris 4: urutan diperselisihkan ----------
  const disp = ramp(t, cue(4) - 0.2, cue(4) + 0.8);
  const noteP = ramp(t, wordOf(4, 'diperselisihkan') - 0.3, wordOf(4, 'diperselisihkan') + 0.5);
  const chainP = ramp(t, wordOf(4, 'salah') - 0.3, cueEnd(4), EASE_IN_OUT);
  const jig = (i: number) => disp * 6 * Math.sin(t * 1.6 + i * 1.9);
  const chainPts = POS.map(([x, y], i) => [x + jig(i), y] as [number, number]);

  return (
    <AbsoluteFill>
      <Stage>
        {/* manik-manik */}
        {beadsOn > 0.001 ? (
          <g opacity={beadsOn}>
            <Glow x={960} y={420} r={520} color="heat" opacity={0.18} />
            {beads.slice(0, -1).map((b, i) => {
              const nb = beads[i + 1];
              const cut = i === BRK - 1 ? 1 - snapP : 1;
              const op = Math.min(1 - b.fall, 1 - nb.fall) * cut;
              if (op <= 0.01) return null;
              return <line key={i} x1={b.x0} y1={b.y0} x2={nb.x0} y2={nb.y0} stroke={C.gold} strokeWidth={2} opacity={0.6 * op} />;
            })}
            <circle cx={beads[0].x0 - 30} cy={beads[0].y0 - 30} r={6} fill={C.gold} opacity={0.6} />
            <line x1={beads[0].x0 - 30} y1={beads[0].y0 - 30} x2={beads[0].x0} y2={beads[0].y0} stroke={C.gold} strokeWidth={2} opacity={0.6 * (1 - beads[0].fall)} />
            <circle cx={beads[NB - 1].x0 + 30} cy={beads[NB - 1].y0 - 30} r={6} fill={C.gold} opacity={0.6} />
            <line x1={beads[NB - 1].x0 + 30} y1={beads[NB - 1].y0 - 30} x2={beads[NB - 1].x0} y2={beads[NB - 1].y0} stroke={C.gold} strokeWidth={2} opacity={0.6 * (1 - beads[NB - 1].fall)} />
            {beads.map((b, i) =>
              b.op <= 0.01 ? null : (
                <g key={i} opacity={b.op}>
                  <circle cx={b.x} cy={b.y} r={20} fill={C.heat} opacity={0.18} />
                  <circle cx={b.x} cy={b.y} r={13} fill={i % 2 ? '#c8344a' : C.heat} />
                  <circle cx={b.x - 4} cy={b.y - 4} r={4} fill="#ffd0d6" opacity={0.75} />
                </g>
              ),
            )}
            <Ripple x={(beads[BRK - 1].x0 + beads[BRK].x0) / 2} y={(beads[BRK - 1].y0 + beads[BRK].y0) / 2} p={ramp(t, tSnap - 0.05, tSnap + 1.1)} r={140} color="heat" />
            <Label x={960} y={235} size={58} color={C.heat} weight={600} opacity={bigLbl}>
              tanda-tanda besar
            </Label>
          </g>
        ) : null}

        {/* rantai urutan (baris 4) */}
        {chainP > 0 ? (
          <g>
            <DrawPath d={smoothPath(chainPts)} p={chainP} stroke={C.gold} width={2.5} opacity={0.5} />
            <Stream pts={chainPts} color="gold" n={14} speed={0.08} r={4} opacity={chainP * 0.8} />
          </g>
        ) : null}

        {/* grid sepuluh ikon */}
        {gridOn > 0.001
          ? POS.map(([x0, y], i) => {
              const k = lit[i];
              const x = x0 + jig(i);
              const appear = ramp(t, cue(1) - 0.1 + i * 0.09, cue(1) + 0.7 + i * 0.09, BACK);
              const tenP = ramp(t, wordOf(1, 'sepuluh') - 0.1 + i * 0.06, wordOf(1, 'sepuluh') + 1.2 + i * 0.06);
              const bob = 3 * Math.sin(t * 1.2 + i);
              const tl = t - (LIT[i] - 0.15);
              const icon =
                i === 0 ? <Smoke t={t} /> : i === 1 ? <DEmblem t={t} /> : i === 2 ? <Beast t={t} /> : i === 3 ? <SunWest t={t} k={ramp(t, LIT[3], LIT[3] + 2.2, EASE_IN_OUT)} /> : i === 4 ? <Descend t={t} /> : i === 5 ? <Swarm t={t} /> : i === 9 ? <Fire t={t} /> : <Crack t={t} side={i === 6 ? 1 : i === 7 ? -1 : 0} k={ramp(t, LIT[i], LIT[i] + 0.9)} />;
              return (
                <g key={i} opacity={gridOn} transform={`translate(${x} ${y + bob}) scale(${0.6 + 0.4 * appear})`}>
                  <circle r={R + 30} fill={`url(#soft-heat)`} opacity={0.55 * k} />
                  <circle r={R} fill="#0c1430" stroke={C.faint} strokeWidth={2.5} opacity={0.95} />
                  <circle r={R} fill="none" stroke={C.heat} strokeWidth={3.5} opacity={k} />
                  <circle r={R - 9} fill="none" stroke={C.gold} strokeWidth={1} opacity={0.25 + 0.25 * k} strokeDasharray="3 7" transform={`rotate(${t * 12 * (i % 2 ? 1 : -1)})`} />
                  <g opacity={0.12 + 0.88 * k}>{icon}</g>
                  <circle cx={-R * 0.72} cy={-R * 0.72} r={17} fill="#0c1430" stroke={C.heat} strokeOpacity={0.2 + 0.8 * k} strokeWidth={2} />
                  <text x={-R * 0.72} y={-R * 0.72 + 1} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={17} fontWeight={600} fill={C.ink} opacity={0.5 + 0.5 * k}>
                    {i + 1}
                  </text>
                  {tl > 0 && tl < 1.4 ? <Ripple x={0} y={0} p={tl / 1.4} r={R + 70} color="heat" /> : null}
                  <Ripple x={0} y={0} p={tenP} r={R + 30} color="gold" rings={1} />
                </g>
              );
            })
          : null}
        {gridOn > 0.001
          ? POS.map(([x0, y], i) => (
              <Label key={i} x={x0 + jig(i)} y={y + R + 32} size={24} color={C.ink} opacity={gridOn * (0.45 + 0.55 * lit[i])}>
                {NAMES[i]}
              </Label>
            ))
          : null}
        {gridOn > 0.001 ? <Motes x={960} y={520} rx={820} ry={300} n={30} color="heat" opacity={0.35 * gridOn} seed={3} /> : null}
        {lit[9] > 0 ? <Twinkles x={POS[9][0]} y={POS[9][1]} rx={90} ry={80} n={4} color="kin" opacity={lit[9]} /> : null}
        {lit[4] > 0 ? <Spark x={POS[4][0] + jig(4)} y={POS[4][1] - R - 6 + 3 * Math.sin(t * 2)} r={5} color="cyan" opacity={lit[4] * 0.8} /> : null}
      </Stage>
      <Pill x={960} y={212} p={pill} text="HR Muslim · Hudzaifah bin Asid" />
      <Note x={960} y={842} p={noteP} color={C.gold} size={32}>
        Urutan pastinya <span style={{color: C.gold}}>diperselisihkan ulama</span> — ini salah satu urutan
      </Note>
    </AbsoluteFill>
  );
};
