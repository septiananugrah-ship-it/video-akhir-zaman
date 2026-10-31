import React from 'react';
import {AbsoluteFill, Img, interpolateColors, staticFile} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand} from '../anim';
import {Glow, Ripple, Stage, Twinkles} from '../components/primitives';
import {BRAND} from '../brand';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Judul "Gulungan Malam":
//  · busur garis waktu emas melengkung di langit (manik-manik zaman), matahari bergerak turun ke ufuk BARAT (kiri) dan terbenam;
//  · jam pasir di kanan: pasir atas menyusut, tumpukan bawah tumbuh, butir mengalir;
//  · kata "Akhir": emas → jingga senja, berpendar.
const fr = (v: number) => ((v % 1) + 1) % 1;
const HZ = 840; // ufuk
// busur garis waktu (elips) dari ufuk kiri ke ufuk kanan
const AX = 960;
const ARX = 820;
const ARY = 640;
const arcPt = (u: number): [number, number] => {
  // u = 0 di ufuk kanan (timur), 1 di ufuk kiri (barat)
  const a = Math.PI * u;
  return [AX + ARX * Math.cos(a), HZ - ARY * Math.sin(a)];
};
const ARC_D = `M${AX + ARX},${HZ} A${ARX},${ARY} 0 0 0 ${AX - ARX},${HZ}`;

// jam pasir
const GX = 1700;
const GYc = 520;
const GW = 70;
const GH = 120;

export const Title: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0.2, 1.4);
  const sub = ramp(t, 1.5, 2.5);
  const brand = ramp(t, 2.6, 3.6);
  const out = 1 - ramp(t, dur - 1.0, dur - 0.1, EASE_IN_OUT);
  const push = 1 + 0.035 * ramp(t, -0.8, dur, EASE_IN_OUT);
  const rig = ramp(t, 0.0, 1.2);
  const arcP = ramp(t, 0.1, 2.2, EASE_IN_OUT);
  const title = BRAND.title;
  const HL = 'Akhir';
  const split = title.indexOf(HL);

  // matahari: dari u = 0,76 turun ke ufuk barat (u = 1) lalu tenggelam
  const su = mix(0.76, 1, ramp(t, 0.3, dur - 1.2, EASE_IN_OUT));
  const [sx, sy0] = arcPt(su);
  const sink = ramp(t, dur - 3.2, dur - 0.6, EASE_IN_OUT);
  const sy = sy0 + 40 * sink;
  const dusk = ramp(su, 0.85, 1);
  const sunCol = interpolateColors(dusk, [0, 1], ['#ffe08a', '#ff8a3d']);

  // pasir
  const sand = ramp(t, 0.6, dur, (x) => x);
  const topH = GH * 0.82 * (1 - sand * 0.75);
  const botH = GH * 0.18 + GH * 0.6 * sand;
  const tilt = 2 * Math.sin(t * 0.7);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 48%'}}>
        <Stage>
          <defs>
            <radialGradient id="ti-duskR">
              <stop offset="0%" stopColor={C.kin} stopOpacity={0.32} />
              <stop offset="45%" stopColor={C.heat} stopOpacity={0.1} />
              <stop offset="100%" stopColor={C.heat} stopOpacity={0} />
            </radialGradient>
            <linearGradient id="ti-glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9fc4ff" stopOpacity={0.08} />
              <stop offset="50%" stopColor="#9fc4ff" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#9fc4ff" stopOpacity={0.06} />
            </linearGradient>
            <clipPath id="ti-sky">
              <rect x={0} y={0} width={1920} height={HZ} />
            </clipPath>
          </defs>
          <Glow x={960} y={470} r={720} color="gold" opacity={0.1 * a} />
          {/* senja di sisi barat */}
          <ellipse cx={260} cy={HZ} rx={900} ry={330} fill="url(#ti-duskR)" opacity={rig * (0.55 + 0.45 * dusk)} />

          {/* busur garis waktu emas */}
          <g opacity={rig}>
            <path d={ARC_D} fill="none" stroke={C.gold} strokeOpacity={0.12} strokeWidth={14} pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - arcP)} />
            <path d={ARC_D} fill="none" stroke={C.gold} strokeOpacity={0.55} strokeWidth={2.5} pathLength={1000} strokeDasharray="1000 1000" strokeDashoffset={1000 * (1 - arcP)} />
            {Array.from({length: 13}, (_, k) => {
              const u = k / 12;
              const [x, y] = arcPt(u);
              const on = ramp(arcP, u - 0.02, u + 0.05);
              return (
                <g key={k} opacity={on}>
                  <circle cx={x} cy={y} r={k % 3 === 0 ? 7 : 4} fill={C.gold} opacity={0.5 + 0.4 * Math.sin(t * 1.6 + k)} />
                  {k % 3 === 0 ? <circle cx={x} cy={y} r={14} fill="none" stroke={C.gold} strokeOpacity={0.35} strokeWidth={1.5} /> : null}
                </g>
              );
            })}
            {/* butir cahaya yang merambat dari timur ke barat */}
            {[0, 1, 2].map((k) => {
              const ph = fr(t * 0.12 + k / 3);
              const [x, y] = arcPt(ph);
              return <circle key={k} cx={x} cy={y} r={5} fill="#fff4d6" opacity={cyc(ph) * arcP} />;
            })}
          </g>

          {/* matahari terbenam di barat */}
          <g clipPath="url(#ti-sky)" opacity={rig}>
            <Glow x={sx} y={sy} r={220} color="kin" opacity={0.55} />
            <circle cx={sx} cy={sy} r={46} fill={sunCol} opacity={0.95} />
            {Array.from({length: 4}, (_, k) => (
              <line key={k} x1={sx - 60} y1={sy + 10 + k * 10} x2={sx + 60} y2={sy + 10 + k * 10} stroke={C.bg} strokeWidth={3} opacity={dusk * 0.6} />
            ))}
          </g>
          {/* ufuk & bukit pasir */}
          <g opacity={rig}>
            <path d={`M0,${HZ} Q320,${HZ - 26} 640,${HZ - 6} T1280,${HZ - 10} T1920,${HZ - 4} V1080 H0 Z`} fill="#060914" />
            <line x1={80} y1={HZ} x2={1840} y2={HZ} stroke={C.gold} strokeOpacity={0.25} strokeWidth={1.5} />
            <text x={AX - ARX + 60} y={HZ + 34} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={C.kin} opacity={0.7}>
              barat
            </text>
            <text x={AX + ARX - 60} y={HZ + 34} textAnchor="middle" fontFamily={FONT.mono} fontSize={18} fill={C.muted} opacity={0.55}>
              timur
            </text>
            {/* pantulan matahari di ufuk */}
            <ellipse cx={sx} cy={HZ + 6} rx={90 + 10 * Math.sin(t * 2)} ry={5} fill={C.kin} opacity={0.35} />
          </g>

          {/* jam pasir */}
          <g opacity={rig} transform={`rotate(${tilt} ${GX} ${GYc})`}>
            <Glow x={GX} y={GYc} r={170} color="gold" opacity={0.3} />
            <rect x={GX - GW - 16} y={GYc - GH - 18} width={2 * GW + 32} height={14} rx={6} fill="#8a6a22" />
            <rect x={GX - GW - 16} y={GYc + GH + 4} width={2 * GW + 32} height={14} rx={6} fill="#8a6a22" />
            <path d={`M${GX - GW},${GYc - GH} L${GX + GW},${GYc - GH} L${GX + 8},${GYc} L${GX + GW},${GYc + GH} L${GX - GW},${GYc + GH} L${GX - 8},${GYc} Z`} fill="url(#ti-glass)" stroke="#cfe0ff" strokeOpacity={0.5} strokeWidth={2} />
            {/* pasir atas: segitiga yang menyusut */}
            {(() => {
              const y0 = GYc - topH;
              const k = topH / GH;
              return <path d={`M${GX - GW * k - 6},${y0} L${GX + GW * k + 6},${y0} L${GX + 4},${GYc - 4} L${GX - 4},${GYc - 4} Z`} fill={C.gold} opacity={0.85} />;
            })()}
            {/* pasir bawah: gundukan yang tumbuh */}
            <path d={`M${GX - GW + 4},${GYc + GH - 2} L${GX - GW + 4 + (GW - 4) * (1 - botH / GH) * 0.4},${GYc + GH - botH * 0.55} Q${GX},${GYc + GH - botH - 6} ${GX + GW - 4 - (GW - 4) * (1 - botH / GH) * 0.4},${GYc + GH - botH * 0.55} L${GX + GW - 4},${GYc + GH - 2} Z`} fill={C.gold} opacity={0.85} />
            {/* aliran butir */}
            {Array.from({length: 9}, (_, k) => {
              const ph = fr(t * 1.4 + k / 9);
              const y = GYc + ph * (GH - botH - 4);
              return <circle key={k} cx={GX + 1.5 * Math.sin(k * 3 + t * 6)} cy={y} r={2.2} fill="#ffe7a6" opacity={cyc(ph)} />;
            })}
            <line x1={GX} y1={GYc} x2={GX} y2={GYc + GH - botH} stroke={C.gold} strokeOpacity={0.4} strokeWidth={2} />
          </g>

          {/* debu emas melayang */}
          {Array.from({length: 18}, (_, i) => {
            const ph = fr(t * (0.05 + rand(i) * 0.05) + rand(i * 3.3));
            const x = 360 + rand(i * 7.7) * 1200 + 24 * Math.sin(t * 0.9 + i);
            const y = 820 - ph * 620;
            return <circle key={i} cx={x} cy={y} r={1.6 + rand(i * 2.1) * 2.2} fill={i % 3 ? C.gold : C.cyan} opacity={0.3 * cyc(ph) * a} />;
          })}

          <Ripple x={960} y={470} p={(t - 0.8) / 2.2} r={760} color="gold" rings={2} width={2} />
          <Twinkles x={960} y={460} rx={600} ry={90} n={7} color="gold" opacity={ramp(t, 2.2, 3.0)} seed={6} />
        </Stage>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 150}}>
          <div style={{fontFamily: FONT.head, fontSize: 28, letterSpacing: 12, color: C.gold, fontWeight: 600, opacity: a}}>{BRAND.series.toUpperCase()}</div>
          <div style={{display: 'flex', marginTop: 18, alignItems: 'flex-end'}}>
            {title.split('').map((ch, i) => {
              const p = ramp(t, 0.5 + i * 0.045, 1.4 + i * 0.045, BACK);
              const hot = split >= 0 && i >= split && i < split + HL.length;
              const k = i - split;
              const bob = 4 * Math.sin(t * 1.3 - i * 0.4) * ramp(t, 1.8, 2.8);
              // "Akhir": emas → jingga senja yang beriak pelan dari huruf ke huruf
              const col = hot ? interpolateColors(0.5 + 0.5 * Math.sin(t * 1.2 - k * 0.6), [0, 1], [C.gold, C.kin]) : C.ink;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: FONT.head,
                    fontWeight: 700,
                    fontSize: 118,
                    letterSpacing: -3,
                    whiteSpace: 'pre',
                    display: 'inline-block',
                    color: col,
                    opacity: Math.min(1, p),
                    translate: `0px ${(1 - p) * 60 + bob}px`,
                    textShadow: hot ? `0 0 ${36 + 14 * Math.sin(t * 2 + i * 0.4)}px ${col}99` : '0 0 40px rgba(170,200,255,0.22)',
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          <div style={{fontFamily: FONT.head, fontSize: 50, color: C.ink, fontWeight: 500, marginTop: 8, opacity: sub, translate: `0px ${(1 - sub) * 16}px`}}>{BRAND.subtitle}</div>
          <div style={{fontFamily: FONT.sans, fontSize: 26, color: C.muted, marginTop: 14, opacity: ramp(t, 2.1, 3.1)}}>{BRAND.course}</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 34,
              padding: '10px 26px 10px 14px',
              borderRadius: 999,
              border: '1.5px solid rgba(255,201,74,0.38)',
              background: 'rgba(30,22,40,0.55)',
              opacity: brand,
              translate: `0px ${(1 - brand) * 14}px`,
              boxShadow: `0 0 ${24 + 10 * Math.sin(t * 1.8)}px rgba(255,201,74,0.22)`,
            }}
          >
            <Img src={staticFile('scientian-logo.png')} style={{width: 46, height: 46, rotate: `${4 * Math.sin(t * 0.9)}deg`}} />
            <div style={{fontFamily: FONT.head, fontSize: 30, color: C.ink, fontWeight: 500, letterSpacing: 2}}>
              Explore <span style={{color: C.gold, fontWeight: 600}}>Science</span> with Yayan
            </div>
          </div>
          <div style={{fontFamily: FONT.mono, fontSize: 22, color: C.muted, marginTop: 40, opacity: ramp(t, 4.2, 5.2), letterSpacing: 3 + 2 * (1 - ramp(t, 4.2, 5.6))}}>
            <span style={{color: C.cyan}}>awal manusia</span> → <span style={{color: C.gold}}>tanda-tanda</span> → <span style={{color: C.kin}}>akhir dunia</span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
