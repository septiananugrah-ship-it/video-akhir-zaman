import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand} from '../anim';
import {Card, DrawPath, Glow, Label, Motes, Ripple, Stage, Stream, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Rantai para nabi (QS An-Nahl 36; kaum yang dibinasakan: QS Al-Haqqah 5–6, Hud 67, Nuh). Tanpa sosok — hanya cahaya & nama.
// (1) rantai cahaya di garis waktu emas: Adam, Nuh, Ibrahim, Musa, Isa;
// (2) garis umat manusia yang terus menyimpang lalu diluruskan di setiap cahaya; pesan yang sama mengalir ke satu kartu;
// (3) kaum yang dibinasakan sebagai simbol: banjir naik (Nuh), badai pasir ('Ad), gelombang kejut (Tsamud);
// (4) diagram siklus kemakmuran → kesombongan → peringatan → kehancuran yang berputar.
const fr = (v: number) => ((v % 1) + 1) % 1;
const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
type P = [number, number];

const SrcPill: React.FC<{x: number; y: number; p: number; children: React.ReactNode; size?: number}> = ({x, y, p, children, size = 27}) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * Math.min(1, p)})`,
        opacity: Math.min(1, p),
        padding: '9px 24px 9px 18px',
        borderRadius: 999,
        background: 'rgba(16,14,8,0.92)',
        border: `2px solid ${C.gold}`,
        boxShadow: `0 0 24px ${C.gold}55`,
        color: C.gold,
        fontFamily: FONT.head,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{display: 'inline-block', width: 12, height: 12, rotate: '45deg', background: C.gold}} />
      {children}
    </div>
  );

const NAMES = ['Adam', 'Nuh', 'Ibrahim', 'Musa', 'Isa'];
const KEYS = ['adam', 'nuh', 'ibrahim', 'musa', 'isa'];
const LX = [330, 645, 960, 1275, 1590];
const X0 = 170;
const X1 = 1760;

// garis umat: menyimpang di antara cahaya, kembali lurus di tiap cahaya
const devAt = (x: number) => {
  for (let k = 0; k < LX.length - 1; k++) {
    if (x >= LX[k] && x <= LX[k + 1]) {
      const u = (x - LX[k]) / (LX[k + 1] - LX[k]);
      return 6.75 * u * u * (1 - u);
    }
  }
  if (x < LX[0]) return 0;
  const u = Math.min(1, (x - LX[4]) / 300);
  return 6.75 * u * u * (1 - u) * 0.8;
};
const HUM_Y = 470;

// panel kaum
const PX = [400, 960, 1520];
const PT = 270;
const PH = 420;
const PW = 440;
const GND = PT + PH - 70;

// siklus
const CCX = 960;
const CCY = 510;
const CR = 220;
const CYC = [
  {key: 'kemakmuran', c: C.work, hue: 'work' as const},
  {key: 'kesombongan', c: C.spr, hue: 'spr' as const},
  {key: 'peringatan', c: C.gold, hue: 'gold' as const},
  {key: 'kehancuran', c: C.heat, hue: 'heat' as const},
];

const Tent: React.FC<{x: number; y: number; s?: number; c?: string; rot?: number}> = ({x, y, s = 1, c = '#3a4a7c', rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-26,0 L0,-34 L26,0 Z" fill={c} stroke="#7d8cc0" strokeOpacity={0.6} strokeWidth={1.5} />
    <path d="M-6,0 L0,-12 L6,0 Z" fill="#0b1126" />
  </g>
);

export const Prophets: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const wPetunjuk = wordOf(0, 'petunjuk');
  const wName = KEYS.map((k) => wordOf(0, k));
  const wSilih = wordOf(0, 'silih');
  const wSimpang = wordOf(1, 'menyimpang');
  const wLurus = wordOf(1, 'meluruskan');
  const wPesan = wordOf(1, 'pesannya');
  const wNahl = wordOf(1, 'nahl');
  const wBinasa = wordOf(2, 'dibinasakan');
  const wKaum = [1, 2, 3].map((n) => wordOf(2, 'kaum', n));
  const wFx = [wordOf(2, 'banjir'), wordOf(2, 'angin'), wordOf(2, 'suara')];
  const wNode = CYC.map((c) => wordOf(3, c.key));
  const wQuran = wordOf(3, "qur");
  const wPelajaran = wordOf(3, 'pelajaran');

  // ---------- rantai ----------
  const up = ramp(t, cue(1) - 0.3, cue(1) + 0.8, EASE_IN_OUT);
  const LY = mix(500, 270, up);
  const chainOut = 1 - ramp(t, cue(2) - 0.3, cue(2) + 0.5, EASE_IN_OUT);
  const lineP = ramp(t, -0.2, wName[0] + 0.2, EASE_IN_OUT);
  const lit = wName.map((w) => ramp(t, w - 0.3, w + 0.4, BACK));
  const silih = ramp(t, wSilih - 0.1, wSilih + 1.6, (v) => v);

  // ---------- garis umat ----------
  const humOp = ramp(t, wSimpang - 0.6, wSimpang) * (1 - 0.55 * ramp(t, wPesan, wPesan + 0.6)) * chainOut;
  const humP = ramp(t, wSimpang - 0.6, wLurus + 1.0, EASE_IN_OUT);
  const A = 80;
  const humPts: P[] = Array.from({length: 90}, (_, i) => {
    const x = X0 + ((X1 - X0) * i) / 89;
    return [x, HUM_Y + A * devAt(x) + 5 * Math.sin(x * 0.03 + t * 1.5)];
  });
  const humD = humPts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const msgCard = slot(t, wPesan - 0.3, cue(2) + 0.2, 0.6, 0.6);
  const pNahl = slot(t, wNahl - 0.2, cue(2) + 0.2, 0.5, 0.6);

  // ---------- kaum ----------
  const panOut = 1 - ramp(t, cue(3) - 0.3, cue(3) + 0.5, EASE_IN_OUT);
  const binasa = slot(t, wBinasa - 0.3, cue(3) + 0.2, 0.5, 0.6);
  const panIn = PX.map((_, k) => ramp(t, wKaum[k] - 0.5, wKaum[k] + 0.2) * panOut);
  const fx = wFx.map((w) => ramp(t, w - 0.3, w + 1.6, EASE_IN_OUT));

  // ---------- siklus ----------
  const cycIn = ramp(t, cue(3) - 0.2, cue(3) + 0.6);
  const nodeIn = wNode.map((w) => ramp(t, w - 0.3, w + 0.4, BACK));
  const rot = (t - cue(3)) * 7 * cycIn;
  const centerA = slot(t, cue(3), wPelajaran + 0.1, 0.6, 0.5);
  const centerB = ramp(t, wPelajaran - 0.2, wPelajaran + 0.5);
  const quranLab = ramp(t, wQuran - 0.2, wQuran + 0.5);
  const allOn = ramp(t, wNode[3] + 0.3, wNode[3] + 1.0);

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <linearGradient id="pr-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="pr-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.water} stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0b2f66" stopOpacity="0.95" />
          </linearGradient>
          {PX.map((x, k) => (
            <clipPath key={k} id={`pr-pan${k}`}>
              <rect x={x - PW / 2} y={PT} width={PW} height={PH} rx={20} />
            </clipPath>
          ))}
        </defs>

        {/* ================= rantai cahaya ================= */}
        {chainOut > 0.001 ? (
          <g opacity={chainOut}>
            <DrawPath d={`M${X0},${LY} L${LX[4] + 40},${LY}`} p={lineP} stroke={C.gold} width={4} halo />
            <line x1={LX[4] + 60} y1={LY} x2={X1} y2={LY} stroke={C.gold} strokeOpacity={0.4 * lineP} strokeWidth={3} strokeDasharray="4 12" />
            <Stream pts={[[X0, LY], [LX[4], LY]]} color="gold" n={10} speed={0.12} r={3.5} jitter={1} opacity={ramp(t, wName[4], wName[4] + 0.8)} />
            {LX.map((x, k) => {
              const p = lit[k];
              if (p <= 0.001) return null;
              const pulse = Math.max(0, 1 - Math.abs(silih * 5.5 - k - 0.5) * 1.2);
              return (
                <g key={k} opacity={Math.min(1, p)}>
                  {/* petunjuk turun dari atas */}
                  <rect x={x - 14} y={LY - 230 * (1 - up) - 60} width={28} height={230 * (1 - up) + 60} fill="url(#pr-beam)" opacity={0.6 * (1 - up) + 0.25} />
                  <Glow x={x} y={LY} r={90 + 40 * pulse} color="cyan" opacity={0.7 + 0.3 * pulse} />
                  <circle cx={x} cy={LY} r={(18 + 3 * Math.sin(t * 2.2 + k)) * Math.min(1.2, p)} fill="#e8fbff" />
                  <circle cx={x} cy={LY} r={30} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray="5 7" transform={`rotate(${t * 30 * (k % 2 ? -1 : 1)} ${x} ${LY})`} />
                  <Label x={x} y={LY + mix(64, 56, up)} size={mix(34, 28, up)} weight={600} color={C.ink}>
                    {NAMES[k]}
                  </Label>
                  <Ripple x={x} y={LY} p={ramp(t, wName[k], wName[k] + 1.2, (v) => v)} r={120} color="cyan" rings={2} width={2} />
                </g>
              );
            })}
            <Label x={960} y={LY - 90} size={26} color={C.muted} font="mono" opacity={slot(t, wPetunjuk - 0.2, cue(1), 0.6, 0.5)}>
              petunjuk demi petunjuk
            </Label>
            <Label x={X1 - 40} y={LY - 36} size={22} color={C.gold} font="mono" opacity={ramp(t, wSilih, wSilih + 0.8) * (1 - up)}>
              silih berganti …
            </Label>

            {/* garis umat manusia */}
            {humOp > 0.001 ? (
              <g opacity={humOp}>
                <DrawPath d={humD} p={humP} stroke={C.ink} width={3.5} opacity={0.75} />
                {LX.map((x, k) => {
                  const on = ramp(humP, (x - X0) / (X1 - X0) - 0.02, (x - X0) / (X1 - X0) + 0.04);
                  return (
                    <g key={k} opacity={on}>
                      <line x1={x} y1={LY + 70} x2={x} y2={HUM_Y - 8} stroke={C.cyan} strokeOpacity={0.35} strokeWidth={6} />
                      <circle cx={x} cy={HUM_Y} r={7} fill={C.cyan} />
                      <Ripple x={x} y={HUM_Y} p={fr(t * 0.4 + k * 0.2)} r={40} color="cyan" rings={1} width={2} />
                    </g>
                  );
                })}
                <Label x={(LX[1] + LX[2]) / 2 + 60} y={HUM_Y + A * 1.1 + 34} size={24} color={C.spr} font="mono" opacity={ramp(t, wSimpang, wSimpang + 0.6)}>
                  menyimpang
                </Label>
                <Label x={LX[2]} y={HUM_Y - 34} size={24} color={C.cyan} font="mono" opacity={ramp(t, wLurus, wLurus + 0.6) * (1 - ramp(t, wPesan, wPesan + 0.5))}>
                  diluruskan
                </Label>
              </g>
            ) : null}
            {/* pesan yang sama mengalir dari tiap cahaya ke kartu */}
            {msgCard > 0.001
              ? LX.map((x, k) => <Stream key={k} pts={[[x, LY + 30], [mix(x, 960, 0.5), 520], [960, 600]]} color="gold" n={5} speed={0.45} r={3.5} jitter={2} seed={k} opacity={msgCard} />)
              : null}
          </g>
        ) : null}

        {/* ================= kaum yang dibinasakan ================= */}
        <Label x={960} y={205} size={34} color={C.heat} weight={700} opacity={binasa}>
          didustakan → dibinasakan
        </Label>
        {PX.map((x, k) => {
          const p = panIn[k];
          if (p <= 0.001) return null;
          const f = fx[k];
          const lt = t - wFx[k];
          const shake = k === 2 ? 3 * f * Math.sin(t * 40) * Math.max(0, Math.sin(t * 2.6)) : 0;
          return (
            <g key={k} opacity={Math.min(1, p)} transform={`translate(0 ${(1 - Math.min(1, p)) * 30})`}>
              <rect x={x - PW / 2} y={PT} width={PW} height={PH} rx={20} fill="rgba(10,15,34,0.9)" stroke={[C.water, C.kin, C.heat][k]} strokeOpacity={0.55} strokeWidth={2} />
              <g clipPath={`url(#pr-pan${k})`}>
                {/* tanah & permukiman */}
                <rect x={x - PW / 2} y={GND} width={PW} height={80} fill="#151d3a" />
                {[-110, -40, 30, 100].map((dx, j) => {
                  const lean = k === 1 ? f * (8 + 6 * Math.sin(t * 3 + j)) : 0;
                  const gone = k === 1 ? ramp(lt, 1.2 + j * 0.3, 2.6 + j * 0.3) : 0;
                  return (
                    <g key={j} opacity={1 - 0.7 * gone}>
                      <Tent x={x + dx + shake + gone * 60} y={GND} s={0.9 + (j % 2) * 0.25} rot={lean} />
                    </g>
                  );
                })}
                {/* Nuh: hujan + air naik */}
                {k === 0 ? (
                  <g>
                    {Array.from({length: 22}, (_, j) => {
                      const ph = fr(t * 1.6 + rand(j * 3.1));
                      const rx = x - PW / 2 + rand(j * 5.3) * PW;
                      const ry = PT + ph * (PH - 40);
                      return <line key={j} x1={rx} y1={ry} x2={rx - 6} y2={ry + 22} stroke="#9fd0ff" strokeWidth={2} opacity={0.5 * f * cyc(ph)} />;
                    })}
                    {(() => {
                      const lvl = mix(PT + PH + 10, PT + 150, f);
                      const d = Array.from({length: 23}, (_, j) => {
                        const wx = x - PW / 2 + (j / 22) * PW;
                        const wy = lvl + 10 * Math.sin(wx * 0.04 + t * 2.4) + 5 * Math.sin(wx * 0.09 - t * 3.1);
                        return `${j ? 'L' : 'M'}${wx.toFixed(1)},${wy.toFixed(1)}`;
                      }).join(' ');
                      return (
                        <g>
                          <path d={`${d} L${x + PW / 2},${PT + PH} L${x - PW / 2},${PT + PH} Z`} fill="url(#pr-water)" />
                          <path d={d} fill="none" stroke="#bfe4ff" strokeWidth={2.5} opacity={0.7} />
                        </g>
                      );
                    })()}
                  </g>
                ) : null}
                {/* Ad: angin badai pasir */}
                {k === 1 ? (
                  <g>
                    {Array.from({length: 12}, (_, j) => {
                      const ph = fr(t * (0.9 + rand(j) * 0.6) + rand(j * 4.4));
                      const yy = PT + 50 + rand(j * 7.1) * (PH - 120);
                      const xx = x - PW / 2 - 120 + ph * (PW + 240);
                      return <path key={j} d={`M${xx - 90},${yy} q45,-14 90,0 t60,-6`} fill="none" stroke={C.kin} strokeWidth={2.5} strokeLinecap="round" opacity={0.7 * f * cyc(ph)} />;
                    })}
                    {Array.from({length: 30}, (_, j) => {
                      const ph = fr(t * (1.2 + rand(j * 2.2) * 0.8) + rand(j * 9.9));
                      const yy = PT + 40 + rand(j * 3.7) * (PH - 80) + 10 * Math.sin(t * 4 + j);
                      return <circle key={`s${j}`} cx={x - PW / 2 + ph * PW} cy={yy} r={2 + (j % 3)} fill="#e0b070" opacity={0.6 * f * cyc(ph)} />;
                    })}
                    <rect x={x - PW / 2} y={PT} width={PW} height={PH} fill={C.kin} opacity={0.1 * f} />
                  </g>
                ) : null}
                {/* Tsamud: gelombang kejut suara keras */}
                {k === 2 ? (
                  <g>
                    {[0, 1, 2, 3].map((j) => {
                      const ph = fr(t * 0.7 + j / 4);
                      return <circle key={j} cx={x} cy={PT + 80} r={20 + ph * 380} fill="none" stroke={C.heat} strokeWidth={5 * (1 - ph) + 1} opacity={0.8 * f * cyc(ph)} />;
                    })}
                    <Glow x={x} y={PT + 80} r={110} color="heat" opacity={0.6 * f} />
                    {[0, 1, 2, 3, 4].map((j) => (
                      <path key={`c${j}`} d={`M${x - 150 + j * 70},${GND + 10} l12,22 l-10,16 l14,20`} fill="none" stroke={C.heat} strokeWidth={2} opacity={0.6 * ramp(lt, 0.6 + j * 0.15, 1.2 + j * 0.15)} />
                    ))}
                  </g>
                ) : null}
              </g>
              <Label x={x} y={PT + 40} size={30} weight={700} color={C.ink}>
                {['kaum Nuh', "kaum 'Ad", 'kaum Tsamud'][k]}
              </Label>
              <Label x={x} y={PT + PH + 36} size={26} color={[C.water, C.kin, C.heat][k]} font="mono" opacity={ramp(t, wFx[k] - 0.2, wFx[k] + 0.5)}>
                {['banjir', 'angin', 'suara keras'][k]}
              </Label>
            </g>
          );
        })}

        {/* ================= siklus ================= */}
        {cycIn > 0.001 ? (
          <g opacity={cycIn}>
            <Glow x={CCX} y={CCY} r={360} color="gold" opacity={0.25} />
            <circle cx={CCX} cy={CCY} r={CR} fill="none" stroke={C.gold} strokeOpacity={0.18} strokeWidth={14} />
            {/* busur panah antar-simpul (searah jarum jam) */}
            {CYC.map((c, k) => {
              const p = Math.min(nodeIn[k], nodeIn[(k + 1) % 4] ?? 0, k === 3 ? allOn : 1);
              if (p <= 0.001) return null;
              const a0 = ((-90 + k * 90 + rot + 20) * Math.PI) / 180;
              const a1 = ((-90 + (k + 1) * 90 + rot - 20) * Math.PI) / 180;
              const am = a0 + (a1 - a0) * Math.min(1, p);
              const P0: P = [CCX + CR * Math.cos(a0), CCY + CR * Math.sin(a0)];
              const P1: P = [CCX + CR * Math.cos(am), CCY + CR * Math.sin(am)];
              const tip = am;
              const tx = -Math.sin(tip);
              const ty = Math.cos(tip);
              return (
                <g key={k}>
                  <path d={`M${P0[0]},${P0[1]} A${CR},${CR} 0 0 1 ${P1[0]},${P1[1]}`} fill="none" stroke={CYC[(k + 1) % 4].c} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
                  <path
                    d={`M${P1[0] - 16 * tx + 10 * Math.cos(tip)},${P1[1] - 16 * ty + 10 * Math.sin(tip)} L${P1[0]},${P1[1]} L${P1[0] - 16 * tx - 10 * Math.cos(tip)},${P1[1] - 16 * ty - 10 * Math.sin(tip)}`}
                    fill="none"
                    stroke={CYC[(k + 1) % 4].c}
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={0.8 * Math.min(1, p)}
                  />
                </g>
              );
            })}
            {/* butir yang terus berputar searah siklus */}
            {Array.from({length: 10}, (_, j) => {
              const a = ((-90 + rot) * Math.PI) / 180 + fr(t * 0.12 + j / 10) * Math.PI * 2;
              return <circle key={j} cx={CCX + CR * Math.cos(a)} cy={CCY + CR * Math.sin(a)} r={3.5} fill="#fff4d6" opacity={0.7 * allOn} />;
            })}
            {CYC.map((c, k) => {
              const p = nodeIn[k];
              if (p <= 0.001) return null;
              const a = ((-90 + k * 90 + rot) * Math.PI) / 180;
              const x = CCX + CR * Math.cos(a);
              const y = CCY + CR * Math.sin(a);
              const lx = CCX + (CR + 72 + 112 * Math.abs(Math.cos(a))) * Math.cos(a);
              const ly = CCY + (CR + 66 + 20 * Math.abs(Math.sin(a))) * Math.sin(a);
              const s = Math.min(1.15, p);
              return (
                <g key={c.key}>
                  <Glow x={x} y={y} r={90} color={c.hue} opacity={0.6} />
                  <circle cx={x} cy={y} r={50 * s} fill="#0e1430" stroke={c.c} strokeWidth={3} />
                  <g transform={`translate(${x} ${y}) scale(${s})`}>
                    {k === 0 ? (
                      <g>
                        <path d={`M0,26 V-10`} stroke={c.c} strokeWidth={3} />
                        {[-1, 1].map((sd) => (
                          <path key={sd} d={`M0,${4 - 0} q${sd * 22},-6 ${sd * 24},-24 q${-sd * 20},2 ${-sd * 24},24 Z`} fill={c.c} transform={`rotate(${sd * 4 * Math.sin(t * 1.5)})`} />
                        ))}
                        <circle cx={0} cy={-16} r={6} fill={C.gold} />
                      </g>
                    ) : null}
                    {k === 1 ? (
                      <g>
                        <rect x={-10} y={-26 - 4 * Math.sin(t * 1.2)} width={20} height={52 + 4 * Math.sin(t * 1.2)} fill={c.c} opacity={0.85} />
                        <rect x={-24} y={0} width={12} height={26} fill={c.c} opacity={0.5} />
                        <rect x={13} y={-8} width={12} height={34} fill={c.c} opacity={0.5} />
                      </g>
                    ) : null}
                    {k === 2 ? (
                      <g>
                        {Array.from({length: 8}, (_, j) => {
                          const aa = (j / 8) * Math.PI * 2 + t * 0.8;
                          return <line key={j} x1={14 * Math.cos(aa)} y1={14 * Math.sin(aa)} x2={28 * Math.cos(aa)} y2={28 * Math.sin(aa)} stroke={c.c} strokeWidth={3} strokeLinecap="round" />;
                        })}
                        <circle cx={0} cy={0} r={10} fill="#fff4d6" />
                      </g>
                    ) : null}
                    {k === 3 ? (
                      <g>
                        <path d="M-22,-24 L-4,-4 L-14,4 L8,26" fill="none" stroke={c.c} strokeWidth={4} strokeLinejoin="round" />
                        <path d={`M4,-22 L14,-6 L24,-12`} fill="none" stroke={c.c} strokeWidth={3} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
                      </g>
                    ) : null}
                  </g>
                  <Label x={lx} y={ly} size={30} weight={600} color={c.c} opacity={Math.min(1, p)}>
                    {c.key}
                  </Label>
                  <Ripple x={x} y={y} p={ramp(t, wNode[k], wNode[k] + 1.2, (v) => v)} r={120} color={c.hue} rings={2} width={2} />
                </g>
              );
            })}
            {/* pusat: ikon berulang → pelajaran */}
            <g transform={`rotate(${-rot * 3} ${CCX} ${CCY})`} opacity={0.7}>
              <path d={`M${CCX + 60},${CCY} A60,60 0 1 1 ${CCX},${CCY - 60}`} fill="none" stroke={C.gold} strokeWidth={3} strokeOpacity={0.5} />
              <path d={`M${CCX - 10},${CCY - 70} L${CCX + 2},${CCY - 60} L${CCX - 10},${CCY - 50}`} fill="none" stroke={C.gold} strokeWidth={3} strokeOpacity={0.6} />
            </g>
            <Label x={CCX} y={CCY} size={36} weight={700} color={C.ink} opacity={centerA}>
              berulang
            </Label>
            <Label x={CCX} y={CCY - 8} size={32} weight={700} color={C.gold} opacity={centerB}>
              ambil
            </Label>
            <Label x={CCX} y={CCY + 30} size={32} weight={700} color={C.gold} opacity={centerB}>
              pelajaran
            </Label>
            <Label x={CCX} y={CCY + 44} size={20} color={C.muted} font="mono" opacity={quranLab * centerA}>
              kisah Al-Qur'an
            </Label>
            <Twinkles x={CCX} y={CCY} rx={110} ry={60} n={4} color="gold" opacity={centerB} />
          </g>
        ) : null}
        <Motes x={960} y={520} rx={820} ry={300} n={22} color="gold" opacity={0.35} />
      </Stage>

      {/* ---------- kartu & pil ---------- */}
      <Card x={960} y={650} opacity={msgCard} accent={C.gold} scale={0.95 + 0.05 * msgCard} style={{padding: '18px 40px'}}>
        <div style={{fontFamily: FONT.head, fontSize: 24, color: C.muted, textAlign: 'center', letterSpacing: 1}}>pesan yang sama</div>
        <div style={{fontFamily: FONT.serif, fontSize: 58, lineHeight: 1.25, textAlign: 'center'}}>
          Sembahlah <span style={{color: C.gold}}>Allah</span>, jauhi <span style={{color: C.spr}}>thaghut</span>
        </div>
      </Card>
      <SrcPill x={960} y={800} p={pNahl}>
        QS An-Nahl 36
      </SrcPill>
      <SrcPill x={960} y={845} p={slot(t, wBinasa - 0.2, cue(3) + 0.1, 0.5, 0.6)} size={22}>
        QS Al-Haqqah 5–6 · Hud 67 · Nuh
      </SrcPill>
    </AbsoluteFill>
  );
};
