import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath} from '../anim';
import {Badge, DrawPath, Glow, Label, Motes, Note, Ripple, Spark, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Dajjal (Muslim 2946; Bukhari 7131; Muslim 2934–2936). Tanpa sosok, tanpa wajah/mata: hanya badai ungu gelap abstrak.
// Ciri dari hadis ditulis sebagai kartu teks. Ilusi "surga"/"neraka": dua gerbang, pendar bersilang-pudar memperlihatkan kenyataan.

const slot = (t: number, a: number, b: number, fi = 0.5, fo = 0.45) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
const Pill: React.FC<{x: number; y: number; p: number; text: string}> = ({x, y, p, text}) => (
  <Badge x={x} y={y} text={text} color={C.gold} opacity={p} scale={0.9 + 0.1 * p} size={27} />
);

/** Badai ungu gelap abstrak (lengan spiral berputar + butir yang mengorbit). */
const Storm: React.FC<{x: number; y: number; r: number; t: number; op?: number}> = ({x, y, r, t, op = 1}) =>
  op <= 0.001 ? null : (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r * 1.9} fill="url(#soft-spr)" opacity={0.8} />
      <circle cx={x} cy={y} r={r * 1.05} fill="url(#dj-core)" />
      {Array.from({length: 5}, (_, k) => {
        const pts = Array.from({length: 12}, (_, s) => {
          const a = -t * 1.1 + (k * 2 * Math.PI) / 5 + s * 0.36;
          const rr = r * (0.18 + 0.075 * s) * (1 + 0.04 * Math.sin(t * 2 + k));
          return [x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.86] as [number, number];
        });
        const d = smoothPath(pts);
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={C.spr} strokeWidth={r * 0.12} strokeOpacity={0.14} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#8a5cd6" strokeWidth={r * 0.035} strokeOpacity={0.75} strokeLinecap="round" />
          </g>
        );
      })}
      {Array.from({length: 22}, (_, i) => {
        const a = -t * (0.5 + rand(i) * 0.7) + rand(i + 3) * 6.28;
        const rr = r * (0.5 + 0.55 * rand(i + 5));
        return <circle key={i} cx={x + Math.cos(a) * rr} cy={y + Math.sin(a) * rr * 0.86} r={1.5 + rand(i + 1) * 2.5} fill="#c9a6ff" opacity={0.35 + 0.4 * Math.sin(t * 2 + i) ** 2} />;
      })}
      {[0, 1].map((k) => {
        const ph = (t * 0.45 + k * 0.5) % 1;
        const a0 = rand(Math.floor(t * 0.45 + k * 0.5) + k * 9) * 6.28;
        const pts = Array.from({length: 5}, (_, s) => [x + Math.cos(a0 + s * 0.15) * r * (0.3 + 0.17 * s) + (s % 2 ? 8 : -8), y + Math.sin(a0 + s * 0.15) * r * (0.3 + 0.17 * s)] as [number, number]);
        return <path key={k} d={pts.map((p, s) => `${s ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')} fill="none" stroke="#e5d4ff" strokeWidth={2.5} opacity={ph < 0.12 ? Math.sin((ph / 0.12) * Math.PI) * 0.8 : 0} />;
      })}
    </g>
  );

const Garden: React.FC<{cx: number; t: number}> = ({cx, t}) => (
  <g>
    <rect x={cx - 160} y={300} width={320} height={420} fill="#0e3a2e" />
    <circle cx={cx} cy={430} r={150} fill="url(#soft-work)" />
    <path d={`M${cx - 160},${600 + 6 * Math.sin(t)} Q${cx},${560} ${cx + 160},${610}`} fill="none" stroke="#7fe8ff" strokeWidth={10} opacity={0.6} />
    <path d={`M${cx - 160},${600 + 6 * Math.sin(t)} Q${cx},${560} ${cx + 160},${610}`} fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="10 22" strokeDashoffset={-t * 40} opacity={0.6} />
    {[-100, -30, 50, 110].map((dx, i) => {
      const sw = 4 * Math.sin(t * 1.2 + i);
      return (
        <g key={i}>
          <line x1={cx + dx} y1={700} x2={cx + dx + sw} y2={520 - (i % 2) * 40} stroke="#5a3a20" strokeWidth={8} />
          <circle cx={cx + dx + sw} cy={500 - (i % 2) * 40} r={44} fill={C.work} opacity={0.75} />
          <circle cx={cx + dx + sw - 12} cy={488 - (i % 2) * 40} r={20} fill="#9df5c8" opacity={0.6} />
        </g>
      );
    })}
    {Array.from({length: 9}, (_, i) => (
      <circle key={i} cx={cx - 130 + i * 32} cy={660 + 8 * Math.sin(t * 2 + i)} r={7} fill={i % 2 ? C.force : C.press} />
    ))}
    {Array.from({length: 6}, (_, i) => {
      const ph = (t * 0.3 + i / 6) % 1;
      return <circle key={i} cx={cx - 120 + i * 48 + 10 * Math.sin(t + i)} cy={680 - ph * 300} r={3} fill="#c8ffe4" opacity={cyc(ph)} />;
    })}
  </g>
);

const Flames: React.FC<{cx: number; t: number}> = ({cx, t}) => (
  <g>
    <rect x={cx - 160} y={300} width={320} height={420} fill="#3a0c10" />
    <circle cx={cx} cy={640} r={220} fill="url(#soft-heat)" />
    {Array.from({length: 7}, (_, i) => {
      const x = cx - 135 + i * 45;
      const h = 190 + 60 * Math.sin(t * 5 + i * 1.7) + 30 * Math.sin(t * 9 + i);
      const sw = 14 * Math.sin(t * 3 + i);
      return (
        <g key={i}>
          <path d={`M${x - 34},720 Q${x - 40},${620} ${x + sw},${720 - h} Q${x + 40},${620} ${x + 34},720 Z`} fill={C.heat} opacity={0.85} />
          <path d={`M${x - 18},720 Q${x - 18},${660} ${x + sw * 0.6},${720 - h * 0.6} Q${x + 18},${660} ${x + 18},720 Z`} fill={C.kin} />
          <path d={`M${x - 8},720 Q${x - 8},${690} ${x + sw * 0.3},${720 - h * 0.3} Q${x + 8},${690} ${x + 8},720 Z`} fill={C.force} />
        </g>
      );
    })}
    {Array.from({length: 10}, (_, i) => {
      const ph = (t * 0.5 + i / 10) % 1;
      return <circle key={i} cx={cx - 140 + i * 30 + 14 * Math.sin(t * 2 + i)} cy={700 - ph * 380} r={3} fill={C.force} opacity={cyc(ph)} />;
    })}
  </g>
);

const GX = [640, 1280];
const archD = (cx: number) => `M${cx - 150},710 L${cx - 150},440 A150,150 0 0 1 ${cx + 150},440 L${cx + 150},710 Z`;

export const Dajjal: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- baris 0 ----------
  const stormIn = ramp(t, -0.3, 1.6);
  const move1 = ramp(t, cue(1) - 0.4, cue(1) + 1.2, EASE_IN_OUT);
  const move2 = ramp(t, cue(2) - 0.5, cue(2) + 1.0, EASE_IN_OUT);
  const sx = mix(mix(960, 520, move1), 960, move2);
  const sy = mix(mix(470, 500, move1), 236, move2) + 8 * Math.sin(t * 0.9);
  const sr = mix(mix(190, 150, move1), 62, move2) * (0.7 + 0.3 * stormIn);
  const tBig = wordOf(0, 'besar');
  const bigLbl = slot(t, tBig - 0.3, cue(1) + 0.2);
  const pillM = slot(t, wordOf(0, 'riwayat') - 0.3, cue(1) + 0.4);
  const tlOn = slot(t, 0.2, cue(2) + 0.3, 0.8, 0.6);
  const tlDraw = ramp(t, 0.3, wordOf(0, 'kiamat') + 0.3, EASE_IN_OUT);

  // ---------- baris 1 ----------
  const warn = wordOf(1, 'nabi');
  const card1 = ramp(t, wordOf(1, 'buta') - 0.3, wordOf(1, 'buta') + 0.4);
  const card1b = ramp(t, wordOf(1, 'tuhan') - 0.2, wordOf(1, 'tuhan') + 0.5);
  const card2 = ramp(t, wordOf(1, 'kafir') - 0.3, wordOf(1, 'kafir') + 0.4);
  const card2b = ramp(t, wordOf(1, 'mukmin') - 0.3, wordOf(1, 'mukmin') + 0.5);
  const pillB = ramp(t, wordOf(1, 'bukhari') - 0.3, wordOf(1, 'bukhari') + 0.4);
  const out1 = 1 - ramp(t, cue(2) - 0.5, cue(2) + 0.1, EASE_IN_OUT);

  // ---------- baris 2–3: gerbang ilusi ----------
  const gates = ramp(t, wordOf(2, 'tampak') - 0.4, wordOf(2, 'surga') + 0.4);
  const rv = [wordOf(2, 'sebenarnya', 0), wordOf(2, 'sebenarnya', 1)].map((a) => ramp(t, a - 0.2, a + 1.3, EASE_IN_OUT));
  const noteP = ramp(t, wordOf(3, 'berlawanan') - 0.4, wordOf(3, 'berlawanan') + 0.4);

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <radialGradient id="dj-core">
            <stop offset="0%" stopColor="#06030f" stopOpacity="1" />
            <stop offset="55%" stopColor="#24104a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a2385" stopOpacity="0" />
          </radialGradient>
          {GX.map((cx, i) => (
            <clipPath key={i} id={`dj-g${i}`}>
              <path d={archD(cx)} />
            </clipPath>
          ))}
        </defs>

        {/* garis waktu: sejak Adam sampai kiamat */}
        {tlOn > 0.001 ? (
          <g opacity={tlOn * (1 - 0.5 * move1)}>
            <DrawPath d="M300,215 L1620,215" p={tlDraw} stroke={C.gold} width={3} opacity={0.7} />
            <Label x={300} y={180} size={24} color={C.gold} opacity={ramp(t, 0.4, 1.2)}>
              Adam
            </Label>
            <Label x={1620} y={180} size={24} color={C.gold} opacity={ramp(t, wordOf(0, 'kiamat') - 0.2, wordOf(0, 'kiamat') + 0.4)}>
              kiamat
            </Label>
            {Array.from({length: 14}, (_, i) => {
              const x = 360 + i * 92;
              const lit = ramp(t, warn + i * 0.12, warn + 0.4 + i * 0.12);
              return (
                <g key={i} opacity={ramp(tlDraw, i / 14, i / 14 + 0.05)}>
                  <circle cx={x} cy={215} r={5 + 3 * lit} fill={C.gold} opacity={0.5 + 0.5 * lit} />
                  {lit > 0 ? <circle cx={x} cy={215} r={16 + 4 * Math.sin(t * 3 + i)} fill="url(#soft-gold)" opacity={lit} /> : null}
                </g>
              );
            })}
            <Label x={960} y={252} size={22} color={C.gold} opacity={ramp(t, warn, warn + 0.6) * out1} italic font="serif">
              setiap nabi memperingatkan umatnya
            </Label>
          </g>
        ) : null}

        <Ripple x={960} y={470} p={ramp(t, tBig - 0.2, tBig + 2.4)} r={900} color="spr" rings={4} width={6} />
        <Ripple x={960} y={470} p={ramp(t, tBig + 0.4, tBig + 3.0)} r={600} color="spr" rings={2} width={4} />
        <Storm x={sx} y={sy} r={sr} t={t} op={stormIn} />
        <Motes x={sx} y={sy} rx={sr * 2.2} ry={sr * 1.8} n={24} color="spr" opacity={0.5 * stormIn} seed={4} />
        <Label x={960} y={760} size={68} weight={700} color={C.spr} opacity={bigLbl}>
          fitnah terbesar
        </Label>

        {/* mukmin membaca: cahaya toska kecil */}
        {card2b > 0
          ? Array.from({length: 7}, (_, i) => {
              const a = (i / 7) * Math.PI * 2 + t * 0.2;
              return <Spark key={i} x={sx + Math.cos(a) * 250} y={sy + Math.sin(a) * 200} r={6} color="cyan" opacity={card2b * out1 * (0.6 + 0.4 * Math.sin(t * 2 + i))} />;
            })
          : null}

        {/* gerbang ilusi */}
        {gates > 0.001 ? (
          <g opacity={gates}>
            {GX.map((cx, i) => {
              const r = rv[i];
              const illusionGarden = i === 0;
              return (
                <g key={i} transform={`translate(0 ${4 * Math.sin(t * 0.8 + i)})`}>
                  <Glow x={cx} y={520} r={330} color={illusionGarden ? 'work' : 'heat'} opacity={0.75 * (1 - r)} />
                  <Glow x={cx} y={520} r={330} color={illusionGarden ? 'heat' : 'work'} opacity={0.75 * r} />
                  <g clipPath={`url(#dj-g${i})`}>
                    <g opacity={1 - r}>{illusionGarden ? <Garden cx={cx} t={t} /> : <Flames cx={cx} t={t} />}</g>
                    <g opacity={r}>{illusionGarden ? <Flames cx={cx} t={t} /> : <Garden cx={cx} t={t} />}</g>
                    {/* selubung ilusi ungu yang berkilau */}
                    <rect x={cx - 160} y={290} width={320} height={430} fill={C.spr} opacity={(0.16 + 0.06 * Math.sin(t * 3 + i)) * (1 - r)} />
                    {Array.from({length: 4}, (_, k) => {
                      const ph = (t * 0.35 + k / 4 + i * 0.2) % 1;
                      return <rect key={k} x={cx - 200 + ph * 400} y={290} width={26} height={430} fill="#e7d8ff" opacity={cyc(ph) * 0.18 * (1 - r)} transform={`skewX(-14)`} />;
                    })}
                  </g>
                  <path d={archD(cx)} fill="none" stroke={C.gold} strokeWidth={5} />
                  <path d={archD(cx)} fill="none" stroke={C.gold} strokeWidth={14} opacity={0.15} />
                  <Ripple x={cx} y={520} p={ramp(t, wordOf(2, 'sebenarnya', i) - 0.1, wordOf(2, 'sebenarnya', i) + 1.5)} r={300} color={illusionGarden ? 'heat' : 'work'} />
                  <Label x={cx} y={752} size={40} weight={600} color={C.spr}>
                    {illusionGarden ? '“surga”' : '“neraka”'}
                  </Label>
                  <Label x={cx} y={800} size={28} weight={600} color={illusionGarden ? C.heat : C.work} opacity={r}>
                    {illusionGarden ? 'sebenarnya neraka' : 'sebenarnya surga'}
                  </Label>
                </g>
              );
            })}
            {/* aliran ilusi dari badai ke gerbang */}
            {GX.map((cx, i) => (
              <path
                key={i}
                d={`M${sx},${sy + sr} Q${(sx + cx) / 2},${sy + 40} ${cx},${300}`}
                fill="none"
                stroke={C.spr}
                strokeWidth={3}
                strokeDasharray="8 14"
                strokeDashoffset={-t * 50}
                opacity={0.5 * gates * (1 - 0.6 * rv[i])}
              />
            ))}
          </g>
        ) : null}
      </Stage>

      <Pill x={960} y={840} p={pillM} text="HR Muslim" />
      <Note x={1000} y={400} p={card1 * out1} color={C.spr} anchor="left" size={44}>
        buta sebelah
        <div style={{fontSize: 26, color: C.muted, opacity: card1b}}>— sedangkan Tuhan kalian tidak</div>
      </Note>
      <Note x={1000} y={560} p={card2 * out1} color={C.cyan} anchor="left" size={38}>
        tertulis <span style={{color: C.spr}}>kafir</span>
        <div style={{fontSize: 28, color: C.cyan, opacity: card2b}}>terbaca oleh setiap mukmin</div>
      </Note>
      <Pill x={1240} y={690} p={pillB * out1} text="HR Bukhari" />
      <Note x={960} y={852} p={noteP} color={C.spr} size={32}>
        yang tampak di mata <span style={{color: C.spr}}>berlawanan</span> dengan kenyataan
      </Note>
    </AbsoluteFill>
  );
};
