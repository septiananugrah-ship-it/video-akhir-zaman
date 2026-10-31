import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN, EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Turunnya Nabi Isa (Muslim 2937; Bukhari 2222, Muslim 155). Tanpa sosok: hanya cahaya yang turun di menara putih timur Damaskus,
// diapit dua pendar berbentuk sayap (tanpa figur malaikat). Badai ungu abstrak dikejar ke gerbang Lud lalu lenyap.

const slot = (t: number, a: number, b: number, fi = 0.5, fo = 0.45) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
const Pill: React.FC<{x: number; y: number; p: number; text: string}> = ({x, y, p, text}) => (
  <Badge x={x} y={y} text={text} color={C.gold} opacity={p} scale={0.9 + 0.1 * p} size={27} />
);

const GROUND = 720;
const MX = 1230; // menara
const MTOP = 268;

const Storm: React.FC<{x: number; y: number; r: number; t: number; op: number; burst: number}> = ({x, y, r, t, op, burst}) => (
  <g>
    <g opacity={op * (1 - burst)}>
      <circle cx={x} cy={y} r={r * 1.8} fill="url(#soft-spr)" />
      <circle cx={x} cy={y} r={r} fill="url(#isa-core)" />
      {Array.from({length: 4}, (_, k) => {
        const pts = Array.from({length: 10}, (_, s) => {
          const a = -t * 1.5 + (k * Math.PI) / 2 + s * 0.4;
          const rr = r * (0.2 + 0.085 * s) * (1 + burst);
          return [x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.82] as [number, number];
        });
        return <path key={k} d={smoothPath(pts)} fill="none" stroke="#8a5cd6" strokeWidth={4} strokeOpacity={0.8} strokeLinecap="round" />;
      })}
    </g>
    {burst > 0
      ? Array.from({length: 26}, (_, i) => {
          const a = rand(i) * 6.28;
          const d = r * (0.3 + burst * (1.5 + 2 * rand(i + 4)));
          return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.8} r={2 + 3 * rand(i + 2)} fill="#c9a6ff" opacity={op * (1 - burst) * 0.9} />;
        })
      : null}
  </g>
);

const Minaret: React.FC<{x: number; t: number}> = ({x}) => (
  <g>
    <path d={`M${x - 34},${GROUND} L${x - 26},${MTOP + 120} L${x + 26},${MTOP + 120} L${x + 34},${GROUND} Z`} fill="#e9eef8" />
    <path d={`M${x + 6},${GROUND} L${x + 8},${MTOP + 120} L${x + 26},${MTOP + 120} L${x + 34},${GROUND} Z`} fill="#b9c3da" />
    <rect x={x - 46} y={MTOP + 108} width={92} height={14} rx={4} fill="#f5f8ff" />
    <rect x={x - 22} y={MTOP + 40} width={44} height={68} fill="#eef2fb" />
    {[MTOP + 62, MTOP + 200, MTOP + 300].map((y, i) => (
      <path key={i} d={`M${x - 7},${y + 22} L${x - 7},${y + 6} A7,7 0 0 1 ${x + 7},${y + 6} L${x + 7},${y + 22} Z`} fill="#55618a" />
    ))}
    <rect x={x - 40} y={MTOP + 30} width={80} height={12} rx={4} fill="#f5f8ff" />
    <path d={`M${x - 24},${MTOP + 30} Q${x},${MTOP - 34} ${x + 24},${MTOP + 30} Z`} fill="#f5f8ff" />
    <line x1={x} y1={MTOP - 2} x2={x} y2={MTOP - 26} stroke={C.gold} strokeWidth={3} />
    <circle cx={x} cy={MTOP - 30} r={5} fill={C.gold} />
  </g>
);

export const Isa: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- baris 0 ----------
  const s0 = ramp(t, -0.3, 1.0) * (1 - ramp(t, cue(1) + 1.0, cue(1) + 2.2, EASE_IN_OUT));
  const minOp = ramp(t, wordOf(0, 'menara') - 1.2, wordOf(0, 'menara') + 0.2) * (1 - 0.7 * ramp(t, cue(1), cue(1) + 1.5, EASE_IN_OUT)) * (1 - ramp(t, cue(2) - 0.5, cue(2) + 0.2, EASE_IN_OUT));
  const descend = ramp(t, wordOf(0, 'menurunkan') - 0.3, wordOf(0, 'menara') + 1.4, EASE_IN_OUT);
  const wings = ramp(t, wordOf(0, 'sayap') - 0.4, wordOf(0, 'sayap') + 0.6);
  const eastP = ramp(t, wordOf(0, 'timur') - 0.3, wordOf(0, 'timur') + 0.5);
  const pill0 = slot(t, wordOf(0, 'menara') - 0.2, cue(1) + 0.2);

  // ---------- baris 1: pengejaran ke Lud ----------
  const tLud = wordOf(1, 'lud');
  const chase = ramp(t, cue(1) - 0.2, tLud, EASE_IN_OUT);
  const stormOn = ramp(t, cue(1) - 0.6, cue(1) + 0.3);
  const burst = ramp(t, tLud - 0.1, tLud + 1.4, EASE_IN);
  const GATE = 360;
  const sX = mix(1000, GATE + 40, chase) + 8 * Math.sin(t * 2) * (1 - burst);
  const sY = 520 + 14 * Math.sin(t * 1.6) * (1 - chase);
  const lightOrbY = mix(-40, MTOP - 80, descend);
  const toChase = ramp(t, cue(1) - 0.4, cue(1) + 0.9, EASE_IN_OUT);
  const lx = mix(MX, sX + mix(260, 200, chase), toChase) + 10 * Math.sin(t * 1.3) * (1 - toChase);
  const ly = mix(lightOrbY, 500 + 6 * Math.sin(t * 2), toChase);
  const lightOn = ramp(t, wordOf(0, 'menurunkan') - 0.3, wordOf(0, 'menurunkan') + 0.4) * (1 - ramp(t, cue(2) - 0.5, cue(2) + 0.2, EASE_IN_OUT));
  const gateOn = ramp(t, cue(1) + 0.2, cue(1) + 1.2) * (1 - ramp(t, cue(2) - 0.5, cue(2) + 0.2, EASE_IN_OUT));
  const endLbl = slot(t, wordOf(1, 'berakhir') - 0.5, cue(2) + 0.1);

  // ---------- baris 2 ----------
  const s2 = slot(t, cue(2) - 0.2, cue(3) + 0.1, 0.7, 0.6);
  const tBreak = wordOf(2, 'mematahkan');
  const brk = ramp(t, tBreak - 0.1, tBreak + 1.2, EASE_IN_OUT);
  const crossIn = ramp(t, wordOf(2, 'mematahkan') - 1.2, wordOf(2, 'mematahkan') - 0.4);
  const tJiz = wordOf(2, 'jizyah');
  const jizIn = ramp(t, tJiz - 1.4, tJiz - 0.6);
  const jizX = ramp(t, tJiz - 0.1, tJiz + 0.7);
  const tHarta = wordOf(2, 'harta');
  const flow = ramp(t, tHarta - 0.8, tHarta + 0.6);
  const heap = ramp(t, tHarta - 0.2, tHarta + 4.5, EASE_IN_OUT);
  const pillBM = ramp(t, wordOf(2, 'bukhari') - 0.3, wordOf(2, 'bukhari') + 0.4);
  const syariat = ramp(t, cue(2) - 0.1, cue(2) + 0.6);

  // ---------- baris 3 ----------
  const s3 = ramp(t, cue(3) - 0.3, cue(3) + 0.6);
  const crack = ramp(t, wordOf(3, 'belum') - 0.1, wordOf(3, 'cerita') + 0.8, EASE_IN_OUT);
  const note3 = ramp(t, wordOf(3, 'belum') - 0.3, wordOf(3, 'belum') + 0.4, BACK);

  const BX = 1360;
  const BY = 600;

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <radialGradient id="isa-core">
            <stop offset="0%" stopColor="#06030f" />
            <stop offset="60%" stopColor="#24104a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a2385" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="isa-wing">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#bdefff" stopOpacity="0.45" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ---------- Damaskus & menara ---------- */}
        {s0 > 0.001 ? (
          <g opacity={s0}>
            <rect x={160} y={GROUND} width={1600} height={6} rx={3} fill="#2a3a66" />
            <rect x={160} y={GROUND + 6} width={1600} height={70} fill="url(#ground)" />
            {[
              [300, 120, 90],
              [400, 180, 70],
              [480, 140, 110],
              [600, 210, 80],
              [690, 130, 100],
              [790, 160, 70],
            ].map(([x, h, w], i) => (
              <g key={i}>
                <rect x={x - w / 2} y={GROUND - h} width={w} height={h} fill="#1b2650" stroke="#2f3e70" strokeWidth={2} />
                {i % 2 === 0 ? <path d={`M${x - w / 2 + 8},${GROUND - h} A${w / 2 - 8},${w / 2 - 8} 0 0 1 ${x + w / 2 - 8},${GROUND - h} Z`} fill="#22306a" stroke="#3a4b80" strokeWidth={2} /> : null}
                {Array.from({length: 3}, (_, k) => (
                  <rect key={k} x={x - w / 2 + 12 + k * (w - 24) / 3} y={GROUND - h + 30} width={10} height={16} rx={2} fill={C.gold} opacity={0.25 + 0.35 * Math.sin(t * 1.5 + i * 2 + k) ** 2} />
                ))}
              </g>
            ))}
            <Label x={545} y={GROUND + 44} size={30} color={C.muted}>
              Damaskus
            </Label>
            <g opacity={eastP}>
              <line x1={860} y1={GROUND + 44} x2={1120} y2={GROUND + 44} stroke={C.gold} strokeWidth={3} markerEnd="url(#arrow-gold)" strokeDasharray="10 8" strokeDashoffset={-t * 30} />
              <Label x={990} y={GROUND + 12} size={26} color={C.gold}>
                timur
              </Label>
            </g>
          </g>
        ) : null}
        {minOp > 0.001 ? (
          <g opacity={minOp}>
            <Glow x={MX} y={MTOP + 100} r={260} color="cyan" opacity={0.5 * descend} />
            <Minaret x={MX} t={t} />
            <Label x={MX} y={GROUND + 44} size={30} color={C.ink} opacity={s0}>
              menara putih
            </Label>
          </g>
        ) : null}

        {/* cahaya yang turun + dua pendar sayap */}
        {lightOn > 0.001 ? (
          <g opacity={lightOn}>
            <rect x={lx - 30} y={0} width={60} height={Math.max(0, ly)} fill={C.cyan} opacity={0.1 * (1 - toChase)} />
            {[-1, 1].map((s) => (
              <ellipse
                key={s}
                cx={lx + s * 70}
                cy={ly - 6}
                rx={120}
                ry={46}
                transform={`rotate(${s * (-20 + 5 * Math.sin(t * 1.2))} ${lx + s * 70} ${ly - 6})`}
                fill="url(#isa-wing)"
                opacity={0.75 * wings}
              />
            ))}
            {[-1, 1].map((s) => (
              <ellipse key={`b${s}`} cx={lx + s * 60} cy={ly - 2} rx={50} ry={14} transform={`rotate(${s * (-14 + 6 * Math.sin(t * 1.6 + 0.5))} ${lx + s * 60} ${ly - 2})`} fill="url(#isa-wing)" opacity={0.35 * wings} />
            ))}
            <Glow x={lx} y={ly} r={140} color="cyan" />
            <circle cx={lx} cy={ly} r={22} fill={C.cyan} opacity={0.6} />
            <circle cx={lx} cy={ly} r={12} fill="#fff" />
            {Array.from({length: 8}, (_, i) => {
              const ph = (t * 0.5 + i / 8) % 1;
              return <circle key={i} cx={lx + 50 * Math.sin(i * 2.1 + t)} cy={ly - 120 + ph * 160} r={3} fill="#dff6ff" opacity={cyc(ph) * 0.8} />;
            })}
            <Ripple x={MX} y={MTOP - 74} p={ramp(t, wordOf(0, 'menara') + 1.0, wordOf(0, 'menara') + 2.6)} r={200} color="cyan" />
            <Motes x={lx} y={ly} rx={200} ry={140} n={20} color="cyan" opacity={0.5} />
          </g>
        ) : null}

        {/* gerbang Lud & badai */}
        {gateOn > 0.001 ? (
          <g opacity={gateOn}>
            <path d={`M${GATE - 90},${GROUND} L${GATE - 90},440 A90,90 0 0 1 ${GATE + 90},440 L${GATE + 90},${GROUND}`} fill="#121a3a" stroke={C.gold} strokeWidth={5} />
            <path d={`M${GATE - 120},${GROUND} L${GATE - 120},420 L${GATE - 90},420 M${GATE + 120},${GROUND} L${GATE + 120},420 L${GATE + 90},420`} fill="none" stroke="#4a5a8a" strokeWidth={8} />
            <Label x={GATE} y={GROUND + 44} size={34} weight={600} color={C.gold}>
              gerbang Lud
            </Label>
          </g>
        ) : null}
        {stormOn > 0.001 && burst < 1 ? <Storm x={sX} y={sY} r={70} t={t} op={stormOn * gateOn} burst={burst} /> : null}
        <Ripple x={GATE + 40} y={520} p={ramp(t, tLud - 0.1, tLud + 1.6)} r={360} color="cyan" rings={4} />
        <Label x={960} y={250} size={40} weight={600} color={C.cyan} opacity={endLbl}>
          fitnah terbesar pun berakhir
        </Label>

        {/* ---------- salib, jizyah, harta ---------- */}
        {s2 > 0.001 ? (
          <g opacity={s2}>
            {/* salib dipatahkan (sederhana, tenang) */}
            <g opacity={crossIn} transform={`translate(0 ${3 * Math.sin(t * 1.1)})`}>
              <g transform={`rotate(${-10 * brk} 420 500) translate(${-10 * brk} ${-8 * brk})`}>
                <path d="M406,370 L434,370 L434,410 L470,410 L470,436 L434,436 L434,500 L428,492 L420,504 L412,494 L406,500 L406,436 L370,436 L370,410 L406,410 Z" fill="#cfd5e6" />
              </g>
              <g transform={`rotate(${6 * brk} 420 600) translate(${6 * brk} ${10 * brk})`}>
                <path d="M406,500 L412,494 L420,504 L428,492 L434,500 L434,600 L406,600 Z" fill="#aab3cc" />
              </g>
              <Label x={420} y={656} size={28} color={C.ink} opacity={brk}>
                salib dipatahkan
              </Label>
            </g>
            {/* jizyah dihapus */}
            <g opacity={jizIn * (1 - 0.55 * jizX)} transform={`translate(0 ${3 * Math.sin(t * 1.3 + 1) + 16 * jizX})`}>
              <rect x={690} y={440} width={200} height={110} rx={12} fill="#1b2650" stroke={C.gold} strokeWidth={2.5} />
              <circle cx={735} cy={495} r={22} fill={C.gold} opacity={0.8} />
              <text x={800} y={500} fontFamily="Space Grotesk" fontSize={30} fill={C.ink} dominantBaseline="central">
                jizyah
              </text>
              <DrawPath d="M680,520 L900,470" p={jizX} stroke={C.heat} width={5} />
            </g>
            <Label x={790} y={656} size={28} color={C.ink} opacity={jizX}>
              jizyah dihapus
            </Label>
            {/* harta melimpah */}
            <Glow x={BX} y={BY - 40} r={260} color="gold" opacity={flow} />
            {Array.from({length: 26}, (_, i) => {
              const ph = (t * 0.7 + i / 26) % 1;
              const x = BX - 70 + rand(i) * 140;
              const yTop = 230;
              const y = mix(yTop, BY - 20 - 90 * heap, ph * ph);
              return <ellipse key={i} cx={x} cy={y} rx={13} ry={6 + 4 * Math.abs(Math.sin(t * 6 + i))} fill={C.gold} stroke="#b98a1e" strokeWidth={1.5} opacity={flow * cyc(ph)} />;
            })}
            {/* tumpukan di atas mangkuk */}
            <path d={`M${BX - 130},${BY - 10} Q${BX},${BY - 10 - 200 * heap} ${BX + 130},${BY - 10} Z`} fill={C.gold} opacity={0.85 * Math.min(1, heap * 4)} />
            {Array.from({length: 14}, (_, i) => {
              const u = (i + 0.5) / 14;
              const x = BX - 120 + u * 240;
              const y = BY - 14 - 100 * heap * 4 * u * (1 - u) * rand(i + 30);
              return <ellipse key={i} cx={x} cy={y} rx={12} ry={5} fill="#ffe08a" stroke="#b98a1e" strokeWidth={1.2} opacity={Math.min(1, heap * 4)} />;
            })}
            {/* luapan ke samping */}
            {Array.from({length: 16}, (_, i) => {
              const ph = (t * 0.5 + i / 16) % 1;
              const s = i % 2 ? 1 : -1;
              const x = BX + s * (130 + ph * (60 + 40 * rand(i)));
              const y = BY - 10 + ph * ph * (GROUND - BY + 4);
              return <ellipse key={i} cx={x} cy={y} rx={11} ry={5} fill={C.gold} stroke="#b98a1e" strokeWidth={1.2} opacity={cyc(ph) * ramp(heap, 0.15, 0.4)} transform={`rotate(${s * ph * 40} ${x} ${y})`} />;
            })}
            {[-1, 1].map((s) => (
              <path key={s} d={`M${BX + s * 150},${GROUND} Q${BX + s * 200},${GROUND - 50 * heap} ${BX + s * 260},${GROUND} Z`} fill={C.gold} opacity={0.8 * heap} />
            ))}
            <path d={`M${BX - 140},${BY - 10} Q${BX - 130},${BY + 90} ${BX},${BY + 92} Q${BX + 130},${BY + 90} ${BX + 140},${BY - 10} Z`} fill="#2a3466" stroke={C.gold} strokeWidth={3} />
            <rect x={BX - 50} y={BY + 88} width={100} height={GROUND - BY - 88} fill="#2a3466" stroke={C.gold} strokeWidth={2} />
            <Twinkles x={BX} y={BY - 80} rx={200} ry={100} n={6} color="gold" opacity={heap} />
            <Label x={BX} y={GROUND + 44} size={34} weight={600} color={C.gold} opacity={flow}>
              harta melimpah
            </Label>
            <Label x={BX} y={GROUND + 84} size={22} color={C.muted} italic font="serif" opacity={ramp(t, wordOf(2, 'menerimanya') - 0.3, wordOf(2, 'menerimanya') + 0.5)}>
              sampai tak ada yang mau menerimanya
            </Label>
          </g>
        ) : null}

        {/* ---------- belum akhir cerita ---------- */}
        {s3 > 0.001 ? (
          <g opacity={s3}>
            <Glow x={960} y={600} r={600} color="work" opacity={0.25} />
            <path d="M160,640 Q400,560 640,620 T1100,600 T1760,610 L1760,720 L160,720 Z" fill="#14204a" opacity={0.9} />
            <path d="M1060,640 L1180,470 L1260,560 L1300,640 Z M1500,640 L1560,560 L1640,450 L1760,640 Z" fill="#1d2a58" stroke="#33447a" strokeWidth={2} />
            <rect x={1290} y={540} width={220} height={100} fill="#3a2e2a" stroke="#c07a3a" strokeWidth={2} />
            {Array.from({length: 4}, (_, r) => (
              <line key={r} x1={1290} y1={560 + r * 20} x2={1510} y2={560 + r * 20} stroke="#6a4a34" strokeWidth={1.5} />
            ))}
            <path d="M1400,540 L1390,566 L1408,590 L1394,614 L1404,640" fill="none" stroke={C.heat} strokeWidth={12} opacity={0.25 * crack * (0.6 + 0.4 * Math.sin(t * 4))} />
            <DrawPath d="M1400,540 L1390,566 L1408,590 L1394,614 L1404,640" p={crack} stroke={C.heat} width={4} />
            {crack > 0
              ? Array.from({length: 6}, (_, i) => {
                  const ph = (t * 0.6 + i / 6) % 1;
                  return <circle key={i} cx={1398 + 14 * Math.sin(i * 3)} cy={560 + ph * 80} r={2.5} fill="#c07a3a" opacity={cyc(ph) * crack} />;
                })
              : null}
            <Label x={1400} y={GROUND - 40} size={22} color={C.muted} italic font="serif" opacity={crack}>
              nun jauh di sana…
            </Label>
            {Array.from({length: 5}, (_, i) => (
              <Spark key={i} x={300 + i * 150 + 20 * Math.sin(t * 0.5 + i)} y={560 + 14 * Math.sin(t * 0.8 + i * 2)} r={4} color="work" opacity={0.6} />
            ))}
          </g>
        ) : null}
      </Stage>

      <Pill x={1560} y={470} p={pill0} text="HR Muslim" />
      <Note x={960} y={240} p={syariat * s2} color={C.cyan} size={30}>
        memimpin dengan <span style={{color: C.cyan}}>syariat Nabi Muhammad</span>
      </Note>
      <Pill x={960} y={830} p={pillBM * s2} text="HR Bukhari & Muslim" />
      <Note x={700} y={400} p={note3} color={C.heat} size={52}>
        belum akhir cerita…
      </Note>
    </AbsoluteFill>
  );
};
