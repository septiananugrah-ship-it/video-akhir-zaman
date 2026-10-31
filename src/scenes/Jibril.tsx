import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, smoothPath} from '../anim';
import {Arrow, Badge, Glow, Label, Motes, Ripple, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Hadis Jibril (AUDIT): Muslim 8 — budak melahirkan tuannya; penggembala berlomba meninggikan bangunan.
// Gedung tertinggi: Burj Khalifa 828 m (Dubai). Skala: 620 px = 828 m. 828 / 1,7 ≈ 490 tinggi orang.
// Tanpa sosok malaikat/nabi: hanya cahaya lembut.

const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

const GROUND = 840;
const KPX = 620 / 828; // px per meter
const SCX = 725; // pusat panggung gurun (koordinat asli)
const SCY = 520;
const RX = 1335; // penggaris

type Tower = {x: number; w: number; m: number; d: number; dur: number};
const TOWERS: Tower[] = [
  {x: 430, w: 70, m: 300, d: 0.0, dur: 2.2},
  {x: 560, w: 84, m: 440, d: 0.25, dur: 2.8},
  {x: 1150, w: 74, m: 380, d: 0.15, dur: 2.5},
  {x: 1010, w: 82, m: 560, d: 0.35, dur: 3.2},
  {x: 760, w: 116, m: 828, d: 0.1, dur: 4.0},
];

const Goat: React.FC<{x: number; y: number; t: number; i: number; dir?: number}> = ({x, y, t, i, dir = 1}) => {
  const step = Math.sin(t * 4 + i * 1.7);
  const head = 2 * Math.sin(t * 1.3 + i);
  return (
    <g transform={`translate(${x},${y}) scale(${dir},1)`}>
      <ellipse cx={0} cy={-18} rx={22} ry={11} fill="#d8cdb8" />
      <circle cx={22} cy={-26 + head} r={7} fill="#d8cdb8" />
      <path d={`M24,${-32 + head} l6,-7`} stroke="#b9ab90" strokeWidth={2.5} strokeLinecap="round" />
      {[-14, -6, 8, 15].map((lx, k) => (
        <path key={k} d={`M${lx},-9 L${lx + (k % 2 ? 1 : -1) * 3 * step},0`} stroke="#b9ab90" strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
};

const Tent: React.FC<{x: number; w: number; h: number; t: number; i: number}> = ({x, w, h, t, i}) => (
  <g>
    <path d={`M${x - w / 2},${GROUND} L${x},${GROUND - h} L${x + w / 2},${GROUND} Z`} fill="#6b4a2e" stroke="#c99a5e" strokeWidth={2.5} />
    <path d={`M${x - w * 0.12},${GROUND} L${x},${GROUND - h * 0.55} L${x + w * 0.12},${GROUND} Z`} fill="#2a1a10" />
    <path d={`M${x},${GROUND - h} L${x + 10 + 3 * Math.sin(t * 2 + i)},${GROUND - h - 20}`} stroke="#c99a5e" strokeWidth={2.5} />
    {/* bendera kecil berkibar */}
    <path
      d={`M${x + 10 + 3 * Math.sin(t * 2 + i)},${GROUND - h - 20} q12,${4 * Math.sin(t * 3 + i)} 22,0 l-22,8 Z`}
      fill={C.kin}
      opacity={0.8}
    />
  </g>
);

const TowerShape: React.FC<{tw: Tower; g: number; t: number; i: number}> = ({tw, g, t, i}) => {
  const H = tw.m * KPX;
  const top = GROUND - H * g;
  const tall = tw.m === 828;
  const segs = tall
    ? [
        {w: tw.w, y0: 0, y1: 0.55},
        {w: tw.w * 0.66, y0: 0.55, y1: 0.78},
        {w: tw.w * 0.36, y0: 0.78, y1: 0.92},
      ]
    : [{w: tw.w, y0: 0, y1: 1}];
  const rows = Math.floor(H / 24);
  return (
    <g>
      <defs>
        <clipPath id={`jb-clip-${i}`}>
          <rect x={tw.x - tw.w} y={top} width={tw.w * 2} height={H * g + 2} />
        </clipPath>
      </defs>
      <g clipPath={`url(#jb-clip-${i})`}>
        {segs.map((s, k) => (
          <rect key={k} x={tw.x - s.w / 2} y={GROUND - H * s.y1} width={s.w} height={H * (s.y1 - s.y0)} fill="url(#jb-glass)" stroke="#7fa4e8" strokeOpacity={0.5} strokeWidth={2} />
        ))}
        {tall ? <rect x={tw.x - 3} y={GROUND - H} width={6} height={H * 0.08} fill="#cfe0ff" /> : null}
        {Array.from({length: rows}, (_, r) => {
          const fy = (r + 0.5) / rows;
          const seg = segs.find((s) => fy >= s.y0 && fy < s.y1);
          if (!seg) return null;
          const lit = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.7 + r * 1.9 + i * 3.1));
          return <rect key={r} x={tw.x - seg.w / 2 + 7} y={GROUND - H * fy - 2} width={seg.w - 14} height={4} rx={2} fill={C.kin} opacity={lit * 0.75} />;
        })}
        <rect x={tw.x - (segs[0].w / 2) + 4} y={GROUND - H} width={5} height={H} fill="#fff" opacity={0.12} />
      </g>
      {g > 0.02 && g < 0.995 ? <circle cx={tw.x} cy={top} r={5} fill={C.kin} opacity={0.9} /> : null}
      {tall ? <circle cx={tw.x} cy={GROUND - H} r={4} fill={C.heat} opacity={g * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 3)))} /> : null}
    </g>
  );
};

export const Jibril: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // gulungan hadis
  const pS = slot(t, 0.2, cue(3) + 0.3, 0.9, 0.7);
  const unroll = ramp(t, 0.2, 1.8, EASE_IN_OUT);
  const it1 = ramp(t, wordOf(1, 'budak'), wordOf(1, 'budak') + 0.6);
  const it2 = ramp(t, wordOf(2, 'berlomba'), wordOf(2, 'berlomba') + 0.6);
  const pill = ramp(t, wordOf(2, 'Hadis'), wordOf(2, 'Hadis') + 0.5);

  // cahaya kehadiran (tanpa sosok)
  const tGurun = wordOf(2, 'beralas');
  const pL = slot(t, 0.5, tGurun + 0.6, 1.2, 0.9);

  // panggung gurun → menara
  const pG = ramp(t, tGurun - 0.2, tGurun + 0.8);
  const center = ramp(t, cue(3) - 0.2, cue(3) + 1.4, EASE_IN_OUT);
  const s = mix(0.56, 1, center);
  const gx = mix(1385, SCX, center);
  const gy = mix(560, SCY, center);
  const tH = wordOf(3, 'Hari');
  const desertOp = 1 - ramp(t, wordOf(3, 'gedung'), wordOf(3, 'gedung') + 2.5, EASE_IN_OUT);
  const stackOp = slot(t, wordOf(2, 'berlomba') - 0.1, cue(3) + 0.6, 0.4, 0.8);
  const grow = (k: number) => ramp(t, tH + TOWERS[k].d, tH + TOWERS[k].d + TOWERS[k].dur, EASE_IN_OUT);
  const gTall = grow(4);
  const era1 = slot(t, wordOf(3, 'Empat'), tH + 0.3, 0.5, 0.5);
  const era2 = ramp(t, tH, tH + 0.6);

  // penggaris & pembanding
  const pR = slot(t, tH + 0.3, cue(5) + 2, 0.8, 0.6);
  const lebih = ramp(t, wordOf(3, 'lebih'), wordOf(3, 'lebih') + 0.6, BACK);
  const pInset = slot(t, wordOf(3, 'lebih') + 0.5, cue(4) + 0.4, 0.7, 0.6);

  // batang perubahan sosial
  const pBar = ramp(t, cue(4) + 0.3, cue(4) + 1.1);
  const fill = ramp(t, wordOf(4, 'perubahan'), wordOf(4, 'kemewahan') + 0.4, EASE_IN_OUT);
  const drastis = Math.sin(Math.PI * ramp(t, wordOf(4, 'drastis'), wordOf(4, 'drastis') + 1.2));
  const bangga = ramp(t, wordOf(4, 'berbangga'), wordOf(4, 'berbangga') + 0.6);

  const BX = 1640;
  const BY0 = 790;
  const BY1 = 300;
  const by = mix(BY0, BY1, fill);

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <linearGradient id="jb-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a3d78" />
            <stop offset="55%" stopColor="#1a2a5a" />
            <stop offset="100%" stopColor="#101a3c" />
          </linearGradient>
          <linearGradient id="jb-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a6436" />
            <stop offset="100%" stopColor="#3a2814" />
          </linearGradient>
          <linearGradient id="jb-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={C.work} />
            <stop offset="100%" stopColor={C.kin} />
          </linearGradient>
        </defs>

        {/* cahaya lembut kehadiran */}
        {pL > 0.001 ? (
          <g opacity={pL}>
            <Glow x={1390} y={470} r={300} color="white" opacity={0.5} />
            <Glow x={1390} y={470} r={180} color="cyan" opacity={0.6} />
            {Array.from({length: 10}, (_, k) => {
              const a = (k / 10) * Math.PI * 2 + t * 0.12;
              const r1 = 110 + 40 * Math.sin(t * 1.2 + k * 1.7);
              return (
                <path
                  key={k}
                  d={`M${1390 + Math.cos(a) * 50},${470 + Math.sin(a) * 50} L${1390 + Math.cos(a) * r1},${470 + Math.sin(a) * r1}`}
                  stroke="#e8f6ff"
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.25}
                />
              );
            })}
            <circle cx={1390} cy={470} r={30 + 3 * Math.sin(t * 2)} fill="#f2fbff" opacity={0.85} />
            <Motes x={1390} y={470} rx={260} ry={220} n={30} color="cyan" opacity={0.6} />
          </g>
        ) : null}

        {/* panggung gurun */}
        {pG > 0.001 ? (
          <g opacity={pG} transform={`translate(${gx},${gy}) scale(${s}) translate(${-SCX},${-SCY})`}>
            {/* bulan & bukit pasir */}
            <circle cx={230} cy={390} r={34} fill="#fff3d0" opacity={0.75 * desertOp} />
            <Glow x={230} y={390} r={120} color="gold" opacity={0.4 * desertOp} />
            <path d={smoothPath([[150, 840], [300, 785], [470, 805], [640, 770], [830, 800], [1000, 765], [1170, 795], [1300, 780], [1300, 840]])} fill="url(#jb-sand)" opacity={0.75} />
            <path d={`M150,${GROUND} L1300,${GROUND}`} stroke="#c99a5e" strokeWidth={3} opacity={0.6} />
            {/* tenda & kambing */}
            <g opacity={desertOp}>
              <Tent x={360} w={150} h={100} t={t} i={0} />
              <Tent x={1080} w={130} h={90} t={t} i={1} />
              <Tent x={1220} w={90} h={66} t={t} i={2} />
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 560 + i * 85 + 30 * Math.sin(t * 0.25 + i * 1.4);
                return <Goat key={i} x={x} y={GROUND - 4} t={t} i={i} dir={Math.cos(t * 0.25 + i * 1.4) > 0 ? 1 : -1} />;
              })}
              {/* penggembala: siluet jauh tanpa wajah */}
              <g transform={`translate(${490 + 6 * Math.sin(t * 0.4)},${GROUND})`} opacity={0.9}>
                <path d="M-10,0 L-6,-46 L6,-46 L10,0 Z" fill="#2a1f36" />
                <circle cx={0} cy={-56} r={9} fill="#2a1f36" />
                <path d="M14,0 L18,-72 q2,-8 -6,-8" stroke="#c99a5e" strokeWidth={3} fill="none" strokeLinecap="round" />
              </g>
            </g>
            {/* tumpukan bata kecil: mulai berlomba */}
            {stackOp > 0.001
              ? [700, 900].map((x, k) => (
                  <g key={k} opacity={stackOp}>
                    {Array.from({length: 5}, (_, j) => {
                      const on = ramp(t, wordOf(2, 'berlomba') + j * 0.35 + k * 0.15, wordOf(2, 'berlomba') + j * 0.35 + k * 0.15 + 0.3, BACK);
                      return <rect key={j} x={x - 26} y={GROUND - 26 * (j + 1) - (1 - on) * 30} width={52} height={22} rx={3} fill="#8a6436" stroke={C.kin} strokeWidth={2} opacity={on} />;
                    })}
                    <Arrow x1={x + 50} y1={GROUND - 30} x2={x + 50} y2={GROUND - 150} color="kin" width={4} opacity={0.8} />
                  </g>
                ))
              : null}
            {/* menara berlomba ke atas */}
            {TOWERS.map((tw, k) => (
              <TowerShape key={k} tw={tw} g={grow(k)} t={t} i={k} />
            ))}
            {gTall > 0.05 ? <Motes x={760} y={GROUND - 400} rx={260} ry={300} n={20} color="kin" opacity={0.4 * gTall} /> : null}
          </g>
        ) : null}

        {/* penggaris tinggi */}
        {pR > 0.001 ? (
          <g opacity={pR * (1 - 0.45 * pBar)}>
            <path d={`M${RX},${GROUND} L${RX},${GROUND - 828 * KPX}`} stroke={C.muted} strokeWidth={3} />
            {Array.from({length: 9}, (_, k) => {
              const y = GROUND - k * 100 * KPX;
              return (
                <g key={k}>
                  <path d={`M${RX - (k % 2 ? 8 : 14)},${y} L${RX},${y}`} stroke={C.muted} strokeWidth={2.5} />
                  {k % 2 === 0 ? (
                    <Label x={RX + 16} y={y} size={22} color={C.muted} font="mono" anchor="start">
                      {k * 100} m
                    </Label>
                  ) : null}
                </g>
              );
            })}
            <path d={`M${760 + 60},${GROUND - 828 * KPX} L${RX},${GROUND - 828 * KPX}`} stroke={C.kin} strokeWidth={2} strokeDasharray="8 8" opacity={gTall} />
            <Label x={RX - 24} y={GROUND - 828 * KPX - 26} size={28} color={C.kin} font="mono" weight={600} anchor="end" opacity={gTall}>
              828 m
            </Label>
            <Twinkles x={760} y={GROUND - 828 * KPX} rx={60} ry={40} n={4} color="kin" opacity={lebih} />
          </g>
        ) : null}

        {/* pembanding skala manusia */}
        {pInset > 0.001 ? (
          <g opacity={pInset}>
            <circle cx={760} cy={GROUND - 10} r={26} fill="none" stroke={C.cyan} strokeWidth={2.5} />
            <path d={`M786,${GROUND - 18} C1100,${GROUND - 40} 1300,700 1470,640`} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="6 7" opacity={0.7} />
            <rect x={1470} y={470} width={300} height={330} rx={14} fill="rgba(10,16,36,0.9)" stroke={C.cyan} strokeWidth={2} />
            {/* dinding menara (keluar kotak) */}
            <rect x={1490} y={480} width={70} height={250} fill="url(#jb-glass)" stroke="#7fa4e8" strokeOpacity={0.6} />
            {Array.from({length: 8}, (_, k) => (
              <rect key={k} x={1498} y={498 + k * 30} width={54} height={4} rx={2} fill={C.kin} opacity={0.5} />
            ))}
            {/* manusia (siluet tanpa wajah) */}
            <g transform={`translate(1610,730)`}>
              <path d="M-14,0 L-10,-62 L10,-62 L14,0 Z" fill="#c9d4f2" opacity={0.85} />
              <circle cx={0} cy={-76} r={12} fill="#c9d4f2" opacity={0.85} />
            </g>
            <path d="M1650,730 L1650,642" stroke={C.cyan} strokeWidth={2.5} />
            <Label x={1662} y={686} size={22} color={C.cyan} font="mono" anchor="start">
              1,7 m
            </Label>
            <Label x={1620} y={765} size={22} color={C.ink} font="sans">
              828 m ≈ 490 × tinggi orang
            </Label>
          </g>
        ) : null}

        {/* batang perubahan sosial */}
        {pBar > 0.001 ? (
          <g opacity={pBar}>
            <Label x={BX} y={240} size={30} color={C.ink} weight={600}>
              perubahan sosial
            </Label>
            <rect x={BX - 26} y={BY1 - 10} width={52} height={BY0 - BY1 + 20} rx={26} fill="rgba(255,255,255,0.05)" stroke={C.line} strokeWidth={2} />
            <rect x={BX - 18} y={by} width={36} height={Math.max(0, BY0 - by + 2)} rx={18} fill="url(#jb-bar)" opacity={0.9} />
            {Array.from({length: 6}, (_, k) => {
              const ph = (t * 0.6 + k / 6) % 1;
              return <circle key={k} cx={BX + 8 * Math.sin(k * 2.1 + t)} cy={mix(BY0, by, ph)} r={3} fill="#fff" opacity={cyc(ph) * 0.6 * fill} />;
            })}
            <circle cx={BX} cy={by} r={18 + 6 * drastis} fill={C.kin} />
            <circle cx={BX} cy={by} r={7} fill="#fff" />
            <Ripple x={BX} y={by} p={ramp(t, wordOf(4, 'drastis'), wordOf(4, 'drastis') + 1.4, (x) => x)} r={110} color="kin" />
            <Label x={BX + 46} y={BY0} size={28} color={C.work} anchor="start" font="sans">
              sederhana
            </Label>
            <Label x={BX + 46} y={BY1} size={28} color={C.kin} anchor="start" font="sans" weight={600}>
              mewah
            </Label>
            <Twinkles x={BX} y={BY1} rx={80} ry={40} n={5} color="kin" opacity={bangga} />
          </g>
        ) : null}
      </Stage>

      {/* gulungan hadis */}
      {pS > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 520,
            top: 500,
            transform: `translate(-50%, -50%) scale(${0.95 + 0.05 * pS})`,
            opacity: pS,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{height: 22, borderRadius: 11, background: 'linear-gradient(180deg,#d9a85a,#7a5222)', boxShadow: `0 0 18px ${C.gold}55`}} />
          <div
            style={{
              clipPath: `inset(0 0 ${(1 - unroll) * 100}% 0)`,
              margin: '0 14px',
              padding: '26px 34px 30px',
              background: 'linear-gradient(170deg, rgba(36,44,82,0.96), rgba(16,22,48,0.96))',
              borderLeft: `2px solid ${C.gold}66`,
              borderRight: `2px solid ${C.gold}66`,
              fontFamily: FONT.sans,
              color: C.ink,
            }}
          >
            <div style={{fontFamily: FONT.head, fontSize: 56, fontWeight: 600, color: C.gold, lineHeight: 1.1}}>Hadis Jibril</div>
            <div style={{fontSize: 26, color: C.muted, marginTop: 10, lineHeight: 1.4}}>
              Jibril datang bertanya kepada Nabi
              <br />
              tentang Islam, iman, ihsan, dan kiamat.
            </div>
            <div style={{height: 2, background: `linear-gradient(90deg, ${C.gold}88, transparent)`, margin: '18px 0'}} />
            <div style={{fontSize: 26, color: C.muted, marginBottom: 10}}>Tanda-tandanya:</div>
            <div style={{fontSize: 32, lineHeight: 1.35, opacity: it1, transform: `translateX(${(1 - it1) * 20}px)`}}>
              <span style={{color: C.kin, fontWeight: 600}}>1.</span> budak perempuan melahirkan tuannya
            </div>
            <div style={{fontSize: 32, lineHeight: 1.35, marginTop: 10, opacity: it2, transform: `translateX(${(1 - it2) * 20}px)`}}>
              <span style={{color: C.kin, fontWeight: 600}}>2.</span> para penggembala berlomba-lomba
              <br />
              <span style={{paddingLeft: 30}}>meninggikan bangunan</span>
            </div>
          </div>
          <div style={{height: 22, borderRadius: 11, background: 'linear-gradient(180deg,#d9a85a,#7a5222)', marginTop: -2, boxShadow: `0 0 18px ${C.gold}55`}} />
          <div style={{position: 'absolute', right: 30, bottom: -60, opacity: pill}}>
            <Badge x={0} y={0} text="HR Muslim" color={C.gold} scale={0.85 + 0.15 * pill} />
          </div>
        </div>
      ) : null}

      {/* label zaman */}
      <Badge x={300} y={225} text="14 abad lalu" color={C.muted} opacity={era1} />
      <Badge x={300} y={225} text="hari ini" color={C.kin} opacity={era2 * (1 - ramp(t, cue(4) + 0.2, cue(4) + 0.8, EASE_IN_OUT))} />
      <Badge x={1590} y={330} text="lebih dari 800 m" color={C.kin} opacity={lebih * pR * (1 - pBar)} scale={0.8 + 0.2 * lebih} size={30} />
    </AbsoluteFill>
  );
};
