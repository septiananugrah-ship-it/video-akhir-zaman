import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand, win} from '../anim';
import {Glow, Motes, Ripple, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Enam kartu rangkuman alur akhir zaman, masing-masing dengan animasi mini yang terus berulang:
// khalifah & amanah · dua jari · tanda kecil (menara) · tanda besar (matahari dari barat + lambang fitnah) · renungan (chip + lampu hati) · bibit.
// Lalu pertanyaan penutup: "bibit apa yang sedang kita tanam hari ini?" — Wallahu a'lam.
const SW = 444;
const SH = 104;
const CW = 500;
const CH = 226;
const COLS = [400, 960, 1520];
const ROWS = [330, 590];
const fr = (v: number) => ((v % 1) + 1) % 1;
const hex2 = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
const heart = (s: number) => `M0,${10 * s} C${-4 * s},${6 * s} ${-18 * s},${-2 * s} ${-18 * s},${-10 * s} C${-18 * s},${-19 * s} ${-6 * s},${-22 * s} 0,${-14 * s} C${6 * s},${-22 * s} ${18 * s},${-19 * s} ${18 * s},${-10 * s} C${18 * s},${-2 * s} ${4 * s},${6 * s} 0,${10 * s} Z`;

const MiniAmanah: React.FC<{t: number}> = ({t}) => {
  const u = fr(t / 6);
  const stops: [number, number][] = [
    [90, 22],
    [210, 34],
    [330, 30],
    [222, 60],
  ];
  const seg = Math.min(2.999, u * 3);
  const i = Math.floor(seg);
  const k = seg - i;
  const a = stops[i];
  const b = stops[i + 1];
  const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const ox = mix(a[0], b[0], e);
  const oy = mix(a[1], b[1], e) - 16 * Math.sin(Math.PI * k);
  return (
    <g>
      <circle cx={90} cy={30} r={3} fill={C.ink} opacity={0.6} />
      <circle cx={70} cy={20} r={2} fill={C.ink} opacity={0.5} />
      <path d="M150,96 Q210,60 270,96" fill="#1d3358" stroke="#4e6fa8" strokeWidth={1.5} />
      <path d="M300,96 L340,40 L380,96 Z" fill="#26305a" stroke={C.muted} strokeWidth={1.5} />
      <rect x={215} y={70} width={14} height={26} rx={7} fill={C.cyan} opacity={0.8} />
      <circle cx={222} cy={64} r={7} fill={C.cyan} opacity={0.8} />
      <g opacity={Math.min(1, u * 10, (1 - u) * 10)}>
        <circle cx={ox} cy={oy} r={20} fill="url(#soft-gold)" />
        <circle cx={ox} cy={oy} r={7} fill={C.gold} />
      </g>
      <text x={420} y={96} textAnchor="end" fontFamily={FONT.mono} fontSize={14} fill={C.muted}>
        langit · bumi · gunung → manusia
      </text>
    </g>
  );
};

const MiniJari: React.FC<{t: number}> = ({t}) => {
  const g = 6 + 4 * Math.sin(t * 1.4);
  const u = fr(t * 0.4);
  return (
    <g>
      <line x1={30} y1={84} x2={414} y2={84} stroke={C.gold} strokeOpacity={0.4} strokeWidth={2} />
      <circle cx={30 + 384 * u} cy={84} r={5} fill={C.gold} opacity={cyc(u)} />
      <rect x={222 - g / 2 - 26} y={14} width={26} height={70} rx={13} fill="#2a3560" stroke={C.gold} strokeWidth={2} />
      <rect x={222 + g / 2} y={6} width={26} height={78} rx={13} fill="#2a3560" stroke={C.gold} strokeWidth={2} />
      <Glow x={222} y={44} r={60} color="gold" opacity={0.4} />
      <text x={120} y={50} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={C.muted}>
        Nabi
      </text>
      <text x={330} y={50} textAnchor="middle" fontFamily={FONT.mono} fontSize={15} fill={C.heat}>
        kiamat
      </text>
    </g>
  );
};

const MiniTower: React.FC<{t: number}> = ({t}) => {
  const u = fr(t / 5);
  const hs = [40, 56, 72, 50, 92];
  return (
    <g>
      <line x1={40} y1={96} x2={300} y2={96} stroke={C.muted} strokeWidth={2} />
      {hs.map((h, k) => {
        const g = ramp(u, k * 0.12, k * 0.12 + 0.3, EASE_IN_OUT) * (1 - ramp(u, 0.9, 1));
        const H = 10 + (h - 10) * g;
        return <rect key={k} x={60 + k * 44} y={96 - H} width={30} height={H} rx={3} fill="#2a3560" stroke={C.kin} strokeWidth={2} />;
      })}
      <circle cx={370} cy={52} r={34} fill="none" stroke={C.kin} strokeWidth={2.5} />
      <line x1={370} y1={52} x2={370 + 26 * Math.sin(t * 5)} y2={52 - 26 * Math.cos(t * 5)} stroke={C.kin} strokeWidth={3} strokeLinecap="round" />
      <line x1={370} y1={52} x2={370 + 16 * Math.sin(t * 0.6)} y2={52 - 16 * Math.cos(t * 0.6)} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

const MiniBesar: React.FC<{t: number}> = ({t}) => {
  const u = fr(t / 5);
  const s = 1 - 0.3 * ramp(u, 0.05, 0.8, EASE_IN_OUT);
  const x = 150 + 120 * Math.cos(Math.PI * s);
  const y = 92 - 70 * Math.sin(Math.PI * s);
  return (
    <g>
      <defs>
        <clipPath id="rc-hz">
          <rect x={0} y={0} width={300} height={92} />
        </clipPath>
      </defs>
      <g clipPath="url(#rc-hz)">
        <circle cx={x} cy={y} r={30} fill="url(#soft-heat)" opacity={cyc(u)} />
        <circle cx={x} cy={y} r={13} fill={C.heat} opacity={cyc(u)} />
      </g>
      <line x1={20} y1={92} x2={290} y2={92} stroke={C.gold} strokeOpacity={0.6} strokeWidth={2} />
      <text x={24} y={80} fontFamily={FONT.mono} fontSize={13} fill={C.heat}>
        B
      </text>
      <text x={276} y={80} fontFamily={FONT.mono} fontSize={13} fill={C.gold}>
        T
      </text>
      <g transform={`translate(372 50) rotate(${t * 12})`}>
        <rect x={-24} y={-24} width={48} height={48} fill="none" stroke={C.spr} strokeWidth={2.5} />
        <rect x={-24} y={-24} width={48} height={48} fill="none" stroke={C.spr} strokeWidth={2.5} transform="rotate(45)" />
      </g>
      <circle cx={372} cy={50} r={8} fill={C.spr} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
    </g>
  );
};

const MiniRenung: React.FC<{t: number}> = ({t}) => {
  const b = 0.5 + 0.5 * Math.sin(t * 1.6);
  return (
    <g>
      <g transform="translate(130 52)">
        <rect x={-30} y={-30} width={60} height={60} rx={8} fill="#1a1540" stroke={C.spr} strokeWidth={2.5} />
        {[-18, -6, 6, 18].map((o) => (
          <g key={o}>
            <line x1={o} y1={-30} x2={o} y2={-40} stroke={C.spr} strokeWidth={2} />
            <line x1={o} y1={30} x2={o} y2={40} stroke={C.spr} strokeWidth={2} />
          </g>
        ))}
        <rect x={-10} y={-10} width={20} height={20} fill={C.cyan} opacity={0.4 + 0.4 * Math.sin(t * 4)} />
      </g>
      <line x1={186} y1={52} x2={258} y2={52} stroke={C.muted} strokeWidth={2} strokeDasharray="4 6" strokeDashoffset={-t * 14} />
      <g transform="translate(320 58)">
        <circle r={36 + 14 * b} fill="url(#soft-cyan)" />
        <path d={heart(1.7)} fill={C.cyan} opacity={0.5 + 0.5 * b} stroke="#e8fbff" strokeWidth={1.5} />
      </g>
    </g>
  );
};

const MiniBibit: React.FC<{t: number}> = ({t}) => {
  const u = fr(t / 6);
  const g = ramp(u, 0.05, 0.7, EASE_IN_OUT) * (1 - ramp(u, 0.92, 1));
  const H = 70 * g;
  const sw = 3 * Math.sin(t * 1.3);
  return (
    <g>
      <line x1={120} y1={96} x2={320} y2={96} stroke="#4a3b2e" strokeWidth={3} />
      <path d="M180,96 Q222,82 264,96 Z" fill="#4a3627" />
      <circle cx={222} cy={96 - H / 2} r={30 + 20 * g} fill="url(#soft-work)" />
      <path d={`M222,94 Q${222 + sw},${94 - H / 2} ${222 + sw},${94 - H}`} fill="none" stroke={C.work} strokeWidth={4} strokeLinecap="round" opacity={ramp(g, 0, 0.05)} />
      {[1, -1].map((sd, k) => {
        const p = ramp(g, 0.35 + k * 0.2, 0.8 + k * 0.1);
        const y = 94 - H * (0.55 + k * 0.25);
        const L = 26 * p;
        return <path key={sd} d={`M${222 + sw * 0.6},${y} q${sd * L * 0.4},${-L * 0.7} ${sd * L},${-L * 0.2} q${-sd * L * 0.4},${L * 0.5} ${-sd * L},${L * 0.2} Z`} fill={C.work} opacity={p} />;
      })}
    </g>
  );
};

const ITEMS = [
  {title: 'Khalifah & amanah', body: 'manusia memikul amanah', color: C.cyan, Mini: MiniAmanah},
  {title: 'Dua jari', body: 'kiamat sedekat dua jari', color: C.gold, Mini: MiniJari},
  {title: 'Tanda-tanda kecil', body: 'bangunan menjulang · ilmu dicabut', color: C.kin, Mini: MiniTower},
  {title: 'Tanda-tanda besar', body: 'Dajjal · Isa · matahari dari barat', color: C.heat, Mini: MiniBesar},
  {title: 'Renungan', body: 'kekuatan · ilusi · tunduk pada Allah', color: C.spr, Mini: MiniRenung},
  {title: 'Bibit', body: 'tanamlah, walau esok kiamat', color: C.work, Mini: MiniBibit},
];

export const Recap: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.7, dur + 0.3, EASE_IN_OUT);
  const starts = [wordOf(1, 'khalifah') - 0.4, wordOf(1, 'dua') - 0.4, wordOf(2, 'tanda') - 0.3, wordOf(3, 'tanda') - 0.3, cue(4) + 0.2, wordOf(5, 'bibit') - 0.5];
  const nextOf = (i: number) => (i < 5 ? starts[i + 1] : dur);
  const q = ramp(t, wordOf(5, 'pertanyaannya') - 0.3, wordOf(5, 'pertanyaannya') + 0.6);
  const hl = ramp(t, wordOf(5, 'bibit') - 0.2, wordOf(5, 'bibit') + 0.6);
  const wa = ramp(t, wordOf(5, 'wallahu') - 0.3, wordOf(5, 'wallahu') + 0.6);
  const head = ramp(t, cue(0) - 0.4, cue(0) + 0.6);
  const tunduk = ramp(t, wordOf(4, 'tunduk') - 0.2, wordOf(4, 'tunduk') + 0.6) * (1 - ramp(t, cue(5), cue(5) + 1));
  const dimQ = 1 - 0.3 * q;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* garis waktu emas yang menghubungkan kartu */}
        <path
          d={`M${COLS[0]},${ROWS[0] + CH / 2 + 8} L${COLS[2]},${ROWS[0] + CH / 2 + 8}`}
          stroke={C.gold}
          strokeOpacity={0.25 * head}
          strokeWidth={2}
          strokeDasharray="5 10"
          strokeDashoffset={-t * 16}
        />
        {Array.from({length: 6}, (_, i) => (
          <Ripple key={i} x={COLS[i % 3]} y={ROWS[Math.floor(i / 3)]} p={(t - starts[i] - 0.2) / 1.3} r={320} color={(['cyan', 'gold', 'kin', 'heat', 'spr', 'work'] as const)[i]} rings={2} />
        ))}
        <Glow x={1520} y={590} r={360} color="work" opacity={0.6 * hl} />
        <Glow x={960} y={330} r={900} color="gold" opacity={0.18 * tunduk} />
        <Motes x={960} y={470} rx={860} ry={330} n={30} color="gold" opacity={0.35 * head} seed={22} />
        <Twinkles x={960} y={850} rx={200} ry={20} n={4} color="gold" opacity={wa} seed={9} />
      </Stage>
      <div style={{position: 'absolute', left: 0, right: 0, top: 172, textAlign: 'center', fontFamily: FONT.head, fontSize: 26, letterSpacing: 8 + 2 * (1 - head), color: C.gold, fontWeight: 600, opacity: head * (1 - 0.5 * q)}}>
        ALUR AKHIR ZAMAN
      </div>
      {ITEMS.map((it, i) => {
        const p = ramp(t, starts[i], starts[i] + 0.8, BACK);
        if (p <= 0.001) return null;
        const act = win(t, starts[i], nextOf(i), 0.5, 0.6);
        const last = i === 5 ? hl : 0;
        const bob = 3 * Math.sin(t * 1.1 + i * 1.3);
        const Mini = it.Mini;
        const a = Math.max(act, last);
        return (
          <div
            key={it.title}
            style={{
              position: 'absolute',
              left: COLS[i % 3] - CW / 2,
              top: ROWS[Math.floor(i / 3)] - CH / 2,
              width: CW,
              height: CH,
              boxSizing: 'border-box',
              borderRadius: 18,
              background: 'linear-gradient(160deg, rgba(22,34,72,0.95), rgba(10,16,36,0.95))',
              border: `1.5px solid ${it.color}${hex2(0x55 + 0x44 * a)}`,
              borderLeft: `8px solid ${it.color}`,
              boxShadow: `0 16px 44px rgba(0,0,0,0.45), 0 0 ${26 + 30 * a}px ${it.color}${hex2(0x22 + 0x22 * a)}`,
              padding: '14px 24px 0',
              opacity: Math.min(1, p) * (i === 5 ? 1 : dimQ),
              scale: String(0.9 + 0.1 * p + 0.025 * a),
              translate: `0px ${bob - 6 * a}px`,
              color: C.ink,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(105deg, transparent ${-40 + Math.min(1, p) * 150 - 16}%, rgba(255,245,220,0.12) ${-40 + Math.min(1, p) * 150}%, transparent ${-40 + Math.min(1, p) * 150 + 16}%)`,
                pointerEvents: 'none',
              }}
            />
            <div style={{fontFamily: FONT.head, fontSize: 28, color: it.color, fontWeight: 600, letterSpacing: 0.5}}>
              {String(i + 1).padStart(2, '0')} · {it.title}
            </div>
            <div style={{fontFamily: FONT.sans, fontSize: 23, color: C.ink, marginTop: 4, whiteSpace: 'nowrap'}}>{it.body}</div>
            <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{display: 'block', marginTop: 4, overflow: 'visible', opacity: ramp(t, starts[i] + 0.3, starts[i] + 1.1)}}>
              <Mini t={t + rand(i) * 3} />
            </svg>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 762,
          textAlign: 'center',
          fontFamily: FONT.head,
          fontSize: 44,
          fontWeight: 700,
          color: C.ink,
          opacity: q,
          translate: `0px ${(1 - q) * 20}px`,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: C.muted, fontWeight: 500}}>bukan kapan, melainkan: </span>
        <span style={{color: C.work, textShadow: `0 0 ${28 * hl}px ${C.work}aa`, opacity: 0.55 + 0.45 * hl}}>bibit apa yang sedang kita tanam</span> hari ini?
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 830,
          textAlign: 'center',
          fontFamily: FONT.serif,
          fontStyle: 'italic',
          fontSize: 38,
          color: C.gold,
          opacity: wa,
          letterSpacing: 1 + 2 * (1 - wa),
          textShadow: `0 0 ${14 + 8 * Math.sin(t * 1.5)}px ${C.gold}66`,
        }}
      >
        Wallahu a&apos;lam
      </div>
    </AbsoluteFill>
  );
};
