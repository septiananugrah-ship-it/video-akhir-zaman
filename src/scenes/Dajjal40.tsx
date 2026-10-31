import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand, smoothPath} from '../anim';
import {Badge, Glow, Label, Motes, Ripple, Spark, Stage, pointAlong} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Empat puluh hari (Muslim 2937, An-Nawwas bin Sam'an): hari ke-1 = setahun, ke-2 = sebulan, ke-3 = sepekan, 37 hari biasa.
// Baris 2: hujan, tumbuhan, harta karun (butir emas) mengikuti badai. Baris 3: badai cepat melintasi negeri; Makkah & Madinah
// terlindungi kubah cahaya (Bukhari 1881) — tanpa sosok malaikat. Baris 4: pil surah Al-Kahfi.

const slot = (t: number, a: number, b: number, fi = 0.5, fo = 0.45) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));
const Pill: React.FC<{x: number; y: number; p: number; text: string}> = ({x, y, p, text}) => (
  <Badge x={x} y={y} text={text} color={C.gold} opacity={p} scale={0.9 + 0.1 * p} size={27} />
);

const Storm: React.FC<{x: number; y: number; r: number; t: number; op?: number}> = ({x, y, r, t, op = 1}) =>
  op <= 0.001 ? null : (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r * 1.8} fill="url(#soft-spr)" />
      <circle cx={x} cy={y} r={r} fill="url(#d40-core)" />
      {Array.from({length: 4}, (_, k) => {
        const pts = Array.from({length: 10}, (_, s) => {
          const a = -t * 1.4 + (k * Math.PI) / 2 + s * 0.4;
          const rr = r * (0.2 + 0.085 * s);
          return [x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8] as [number, number];
        });
        return <path key={k} d={smoothPath(pts)} fill="none" stroke="#8a5cd6" strokeWidth={Math.max(2, r * 0.05)} strokeOpacity={0.8} strokeLinecap="round" />;
      })}
    </g>
  );

// peta (lon, lat) → px
const geo = (lon: number, lat: number): [number, number] => [420 + (lon - 24) * 30, 190 + (37 - lat) * 27];
const LAND: [number, number][][] = [
  // Asia barat + Jazirah
  [[35.9, 36.6], [50, 37], [56, 36.6], [56, 27.2], [54, 26.6], [51.3, 27.9], [50.1, 30], [48.6, 29.9], [48, 29.3], [48.5, 28], [50, 26.6], [50.6, 25], [51.6, 25.9], [51.5, 24.5], [54, 24.1], [56, 25.8], [56, 21], [55, 17.2], [52, 15.8], [48.7, 14], [45, 12.8], [43.4, 12.6], [42.7, 15.5], [41.2, 18.5], [39.2, 21.5], [38.4, 23.8], [36.6, 26], [35, 28.1], [34.9, 29.5], [34.3, 31.3], [35, 33], [35.9, 34.9]],
  // Afrika timur laut + Sinai
  [[24, 31.6], [29.5, 31], [32.3, 31.3], [34.2, 31.3], [34.9, 29.5], [34.2, 27.8], [32.6, 29.9], [33.5, 27.5], [35.5, 23.9], [37.3, 21], [38.6, 17.9], [39.7, 15.3], [41.5, 13.5], [43.3, 12.4], [44, 11.4], [24, 11.4]],
];
const landD = LAND.map((poly) => poly.map(([lo, la], i) => `${i ? 'L' : 'M'}${geo(lo, la)[0].toFixed(1)},${geo(lo, la)[1].toFixed(1)}`).join(' ') + ' Z');
const CITIES: [number, number][] = [[31.2, 30.0], [36.3, 33.5], [44.4, 33.3], [35.5, 31.9], [46.7, 24.7], [44.2, 15.4], [32.5, 15.6], [51.4, 35.6], [29.9, 31.2], [47.9, 29.4], [43.9, 26.3], [38.0, 26.5], [50.0, 26.4], [33.0, 25.0], [42.5, 18.3]];
const MAKKAH = geo(39.83, 21.42);
const MADINAH = geo(39.61, 24.47);
// lintasan badai: berkelok melewati negeri, membelok di sekitar kubah
const STORM_PATH: [number, number][] = [[27, 33], [31.2, 30.5], [35.5, 32.3], [36.5, 34], [44.4, 33.5], [51, 34.8], [48, 29.5], [44, 26.5], [44.5, 22.8], [46.8, 24.5], [50, 26], [47, 19], [44.2, 15.6], [41.5, 18], [37, 20], [32.6, 16.5], [31, 25.5]].map(([a, b]) => geo(a, b));

export const Dajjal40: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // ---------- baris 0–1: 40 penanda hari ----------
  const rowOn = ramp(t, wordOf(0, 'empat') - 0.4, wordOf(0, 'empat') + 0.8) * (1 - ramp(t, cue(2) - 0.5, cue(2) + 0.2, EASE_IN_OUT));
  const tY = wordOf(1, 'setahun');
  const tM = wordOf(1, 'sebulan');
  const tW = wordOf(1, 'sepekan');
  const tN = wordOf(1, 'lainnya');
  const gY = ramp(t, tY - 0.2, tY + 1.2, EASE_IN_OUT);
  const gM = ramp(t, tM - 0.2, tM + 1.0, EASE_IN_OUT);
  const gW = ramp(t, tW - 0.2, tW + 0.9, EASE_IN_OUT);
  const WN = 20;
  const GAP = 5;
  const widths = Array.from({length: 40}, (_, i) => (i === 0 ? mix(WN, 560, gY) : i === 1 ? mix(WN, 190, gM) : i === 2 ? mix(WN, 70, gW) : WN));
  const total = widths.reduce((a, b) => a + b, 0) + GAP * 39;
  const xs: number[] = [];
  widths.reduce((acc, w) => {
    xs.push(acc);
    return acc + w + GAP;
  }, 960 - total / 2);
  const appear = (i: number) => ramp(t, wordOf(0, 'empat') - 0.3 + i * 0.04, wordOf(0, 'empat') + 0.1 + i * 0.04);
  const BY = 560;
  // matahari melambat: fase = ∫ laju dt
  const speedAt = (s: number) => mix(0.55, 0.035, ramp(s, tY - 0.3, tY + 1.5));
  let phase = 0;
  for (let s = 0; s < t; s += 1 / 15) phase += speedAt(s) / 15;
  const sunPh = phase % 1;
  const sunA = Math.PI * (1 - sunPh);
  const ARC = {cx: 960, cy: 470, rx: 420, ry: 250};
  const sunX = ARC.cx + ARC.rx * Math.cos(sunA);
  const sunY = ARC.cy - ARC.ry * Math.sin(sunA);
  const sunOp = Math.min(1, sunPh * 8, (1 - sunPh) * 8);
  const pill1 = ramp(t, wordOf(1, 'riwayat') - 0.3, wordOf(1, 'riwayat') + 0.4);
  const arcOn = ramp(t, -0.3, 0.9) * (1 - ramp(t, cue(2) - 0.5, cue(2) + 0.2, EASE_IN_OUT));
  const big40 = slot(t, wordOf(0, 'empat') - 0.3, tY - 0.2);

  // ---------- baris 2: hujan, tumbuhan, harta ----------
  const s2 = slot(t, cue(2) - 0.3, cue(3) + 0.2, 0.7, 0.6);
  const tRain = wordOf(2, 'hujan');
  const tPlant = wordOf(2, 'tumbuhan');
  const tGold = wordOf(2, 'harta');
  const rain = ramp(t, tRain - 0.3, tRain + 0.6);
  const grow = ramp(t, tPlant - 0.2, tPlant + 2.2);
  const stX = mix(mix(560, 660, ramp(t, cue(2), tPlant)), 1290, ramp(t, wordOf(2, 'melewati') - 0.3, tGold + 0.6, EASE_IN_OUT)) + 20 * Math.sin(t * 0.8);
  const stY = 300 + 10 * Math.sin(t * 1.1);
  const goldP = ramp(t, tGold - 0.3, tGold + 0.6);
  const GROUND = 740;

  // ---------- baris 3: peta ----------
  const mapOn = ramp(t, cue(3) - 0.3, cue(3) + 0.4) * (1 - 0.6 * ramp(t, cue(4) - 0.3, cue(4) + 0.6, EASE_IN_OUT));
  const run = ramp(t, cue(3) + 0.3, wordOf(3, 'kecuali') + 0.4, EASE_IN_OUT);
  const [mx, my] = pointAlong(STORM_PATH, run);
  const trail = Array.from({length: 7}, (_, k) => pointAlong(STORM_PATH, Math.max(0, run - (k + 1) * 0.012)));
  const shield = ramp(t, wordOf(3, 'kecuali') - 0.3, wordOf(3, 'makkah') + 0.6);
  const pillB = ramp(t, wordOf(3, 'makkah') - 0.2, wordOf(3, 'makkah') + 0.5);
  const cityHit = (c: [number, number]) => {
    // kota yang sudah dilewati badai berubah ungu (bersilang-pudar)
    let best = 1;
    for (let k = 0; k <= 60; k++) {
      const u = k / 60;
      const [px, py] = pointAlong(STORM_PATH, u);
      if (Math.hypot(px - c[0], py - c[1]) < 70) {
        best = u;
        break;
      }
    }
    return ramp(run, best, best + 0.04);
  };

  // ---------- baris 4: Al-Kahfi ----------
  const kahfi = ramp(t, wordOf(4, 'al-kahfi') - 0.6, wordOf(4, 'al-kahfi') + 0.4, BACK);
  const pillK = ramp(t, wordOf(4, 'surah') - 0.3, wordOf(4, 'surah') + 0.3);

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <radialGradient id="d40-core">
            <stop offset="0%" stopColor="#06030f" />
            <stop offset="60%" stopColor="#24104a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4a2385" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="d40-fade" cx="0.5" cy="0.5" r="0.5">
            <stop offset="55%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <mask id="d40-mask" maskUnits="userSpaceOnUse" x={380} y={160} width={1040} height={740}>
            <rect x={380} y={160} width={1040} height={740} fill="url(#d40-fade)" />
          </mask>
        </defs>

        {/* ---------- 40 hari ---------- */}
        {arcOn > 0.001 ? (
          <g opacity={arcOn}>
            <path d={`M${ARC.cx - ARC.rx},${ARC.cy} A${ARC.rx},${ARC.ry} 0 0 1 ${ARC.cx + ARC.rx},${ARC.cy}`} fill="none" stroke={C.kin} strokeWidth={2} strokeDasharray="4 10" opacity={0.45} />
            <line x1={ARC.cx - ARC.rx - 40} y1={ARC.cy} x2={ARC.cx + ARC.rx + 40} y2={ARC.cy} stroke="#3a4b80" strokeWidth={2} />
            <g opacity={sunOp}>
              <Glow x={sunX} y={sunY} r={90} color="kin" still />
              <circle cx={sunX} cy={sunY} r={24} fill={C.kin} />
              <circle cx={sunX - 6} cy={sunY - 6} r={9} fill="#ffe0b8" opacity={0.8} />
            </g>
            <Label x={ARC.cx} y={ARC.cy - ARC.ry - 30} size={24} color={C.kin} opacity={gY} italic font="serif">
              matahari seakan melambat…
            </Label>
            <Label x={960} y={235} size={44} color={C.muted} italic font="serif" opacity={slot(t, 0.4, wordOf(0, 'empat') + 0.1)}>
              berapa lama ia tinggal di bumi?
            </Label>
            {widths.map((w, i) => {
              const a = appear(i);
              const special = i < 3;
              const col = special ? C.heat : '#5a6ea8';
              const glowOn = i === 0 ? gY : i === 1 ? gM : i === 2 ? gW : 0;
              return (
                <g key={i} opacity={a * rowOn}>
                  {special ? <rect x={xs[i] - 4} y={BY - 4} width={w + 8} height={52} rx={10} fill={C.heat} opacity={0.18 * glowOn * (0.7 + 0.3 * Math.sin(t * 2 + i))} /> : null}
                  <rect x={xs[i]} y={BY + (1 - a) * 20} width={w} height={44} rx={6} fill={col} opacity={special ? 0.35 + 0.65 * glowOn : 0.55 + 0.25 * ramp(t, tN, tN + 0.8) * Math.sin(t * 2 + i * 0.5) ** 2} />
                </g>
              );
            })}
            {['setahun', 'sebulan', 'sepekan'].map((txt, i) => {
              const g = [gY, gM, gW][i];
              return (
                <g key={txt}>
                  <Label x={xs[i] + widths[i] / 2} y={BY + 78 + (i === 2 ? 34 : 0)} size={i === 0 ? 34 : 26} weight={600} color={C.heat} opacity={g}>
                    {txt}
                  </Label>
                  <Label x={xs[i] + widths[i] / 2} y={BY - 26} size={20} color={C.muted} opacity={g} font="mono">
                    hari {i + 1}
                  </Label>
                </g>
              );
            })}
            <path d={`M${xs[3]},${BY + 58} L${xs[3]},${BY + 66} L${xs[39] + WN},${BY + 66} L${xs[39] + WN},${BY + 58}`} fill="none" stroke={C.muted} strokeWidth={2} opacity={ramp(t, tN - 0.2, tN + 0.6)} />
            <Label x={(xs[3] + xs[39] + WN) / 2} y={BY + 96} size={24} color={C.ink} opacity={ramp(t, tN - 0.2, tN + 0.6)}>
              37 hari seperti hari biasa
            </Label>
            <Label x={960} y={235} size={76} weight={700} color={C.heat} opacity={big40}>
              40 hari
            </Label>
          </g>
        ) : null}

        {/* ---------- hujan, tumbuhan, harta ---------- */}
        {s2 > 0.001 ? (
          <g opacity={s2}>
            <rect x={160} y={GROUND} width={1600} height={8} rx={4} fill="#2a3a66" />
            <rect x={160} y={GROUND + 8} width={1600} height={60} fill="url(#ground)" />
            {/* reruntuhan */}
            {[0, 1, 2, 3].map((i) => {
              const x = 1130 + i * 120;
              const h = [150, 90, 200, 70][i];
              return (
                <g key={i}>
                  <rect x={x} y={GROUND - h} width={46} height={h} fill="#26305a" stroke="#4a5a8a" strokeWidth={2} />
                  <path d={`M${x},${GROUND - h} l12,-14 l10,10 l12,-18 l12,22`} fill="#26305a" stroke="#4a5a8a" strokeWidth={2} />
                </g>
              );
            })}
            <rect x={1110} y={GROUND - 22} width={70} height={22} fill="#26305a" transform={`rotate(-8 1145 ${GROUND - 11})`} />
            {/* hujan */}
            {Array.from({length: 46}, (_, i) => {
              const ph = (t * 1.3 + rand(i) ) % 1;
              const x0 = 240 + rand(i + 3) * 680 + ph * 40;
              const y0 = 380 + ph * (GROUND - 380);
              return <line key={i} x1={x0} y1={y0} x2={x0 + 8} y2={y0 + 26} stroke={C.water} strokeWidth={2.5} strokeLinecap="round" opacity={rain * cyc(ph) * 0.8} />;
            })}
            {rain > 0 ? (
              <g opacity={rain}>
                {[300, 480, 660, 840].map((x, i) => (
                  <ellipse key={i} cx={x + 20 * Math.sin(t * 0.6 + i)} cy={360} rx={130} ry={34} fill="#3a4870" opacity={0.6} />
                ))}
              </g>
            ) : null}
            {/* tumbuhan */}
            {Array.from({length: 9}, (_, i) => {
              const x = 270 + i * 78;
              const g = ramp(grow, i * 0.06, 0.5 + i * 0.06);
              const h = g * (60 + 50 * rand(i + 11));
              const sw = 6 * Math.sin(t * 1.4 + i) * g;
              return g <= 0.001 ? null : (
                <g key={i}>
                  <path d={`M${x},${GROUND} Q${x + sw},${GROUND - h * 0.5} ${x + sw * 1.4},${GROUND - h}`} fill="none" stroke={C.work} strokeWidth={4} strokeLinecap="round" />
                  <ellipse cx={x + sw * 1.2 - 12} cy={GROUND - h * 0.6} rx={14 * g} ry={6 * g} fill={C.work} transform={`rotate(-30 ${x + sw * 1.2 - 12} ${GROUND - h * 0.6})`} />
                  <ellipse cx={x + sw * 1.2 + 12} cy={GROUND - h * 0.8} rx={14 * g} ry={6 * g} fill="#7ff0b8" transform={`rotate(30 ${x + sw * 1.2 + 12} ${GROUND - h * 0.8})`} />
                </g>
              );
            })}
            <Ripple x={560} y={GROUND} p={ramp(t, tPlant, tPlant + 1.4)} r={300} color="work" rings={2} />
            {/* harta karun mengikuti */}
            {goldP > 0
              ? Array.from({length: 12}, (_, i) => {
                  const ph = (t * 0.45 + i / 12) % 1;
                  const sx0 = 1150 + (i % 4) * 120;
                  const x = mix(sx0, stX - 60 + (i % 5) * 30, ph);
                  const y = mix(GROUND - 30, stY + 90 + 30 * Math.sin(i), ph) - 60 * Math.sin(Math.PI * ph);
                  return <Spark key={i} x={x} y={y} r={6} color="gold" opacity={goldP * cyc(ph)} />;
                })
              : null}
            <Storm x={stX} y={stY} r={64} t={t} />
            <Label x={560} y={215} size={30} color={C.water} opacity={ramp(t, tRain - 0.2, tRain + 0.5)}>
              hujan turun
            </Label>
            <Label x={560} y={GROUND + 44} size={30} color={C.work} opacity={ramp(t, tPlant - 0.2, tPlant + 0.5)}>
              tumbuhan keluar
            </Label>
            <Label x={1330} y={GROUND + 44} size={30} color={C.gold} opacity={goldP}>
              harta karun mengikutinya
            </Label>
            <Label x={stX} y={stY - 100} size={24} color={C.spr} italic font="serif" opacity={ramp(t, cue(2), cue(2) + 0.8)}>
              “atas perintahnya” — ujian
            </Label>
          </g>
        ) : null}

        {/* ---------- peta badai ---------- */}
        {mapOn > 0.001 ? (
          <g opacity={mapOn}>
            <g mask="url(#d40-mask)">
              {landD.map((d, i) => (
                <path key={i} d={d} fill="#14204a" stroke="#6f80b4" strokeWidth={2} strokeLinejoin="round" />
              ))}
            </g>
            {CITIES.map((c, i) => {
              const [x, y] = geo(c[0], c[1]);
              const h = cityHit([x, y]);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={7} fill="#8fa0d0" opacity={1 - h} />
                  <circle cx={x} cy={y} r={7} fill={C.spr} opacity={h} />
                  {h > 0 ? <circle cx={x} cy={y} r={22} fill="url(#soft-spr)" opacity={h} /> : null}
                </g>
              );
            })}
            <path d={smoothPath(STORM_PATH)} fill="none" stroke={C.spr} strokeWidth={2} strokeDasharray="6 10" opacity={0.25} />
            {[MAKKAH, MADINAH].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={70 + 4 * Math.sin(t * 2 + i)} fill="url(#soft-cyan)" opacity={shield} />
                <path d={`M${x - 46},${y + 6} A46,46 0 0 1 ${x + 46},${y + 6}`} fill={C.cyan} fillOpacity={0.12 * shield} stroke={C.cyan} strokeWidth={3} opacity={0.3 + 0.7 * shield} />
                {Array.from({length: 6}, (_, k) => {
                  const a = Math.PI + (k / 5) * Math.PI;
                  const p = (t * 0.5 + k / 6) % 1;
                  return <circle key={k} cx={x + Math.cos(a) * 46} cy={y + 6 + Math.sin(a) * 46} r={3 + 2 * cyc(p)} fill="#dff6ff" opacity={shield * (0.4 + 0.6 * cyc(p))} />;
                })}
                <circle cx={x} cy={y} r={7} fill={C.cyan} />
                <Label x={x - 64} y={y + (i === 0 ? 10 : -6)} size={24} weight={600} anchor="end" color={C.cyan}>
                  {i === 0 ? 'Makkah' : 'Madinah'}
                </Label>
              </g>
            ))}
            {[MAKKAH, MADINAH].map(([x, y], i) => {
              const d = Math.hypot(mx - x, my - y);
              const near = Math.max(0, 1 - d / 160) * shield;
              return near > 0.01 ? <Ripple key={i} x={x} y={y} p={0.3 + 0.4 * ((t * 0.9) % 1)} r={110} color="cyan" rings={2} /> : null;
            })}
            {trail.map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r={26 - k * 3} fill={C.spr} opacity={0.18 * (1 - k / 7) * Math.min(1, run * 30) * (1 - ramp(run, 0.98, 1))} />
            ))}
            <Storm x={mx} y={my} r={34} t={t} />
            {Array.from({length: 8}, (_, i) => {
              const ph = (t * 1.6 + i / 8) % 1;
              return <line key={i} x1={mx - 50 - ph * 40} y1={my - 30 + i * 8} x2={mx - 80 - ph * 40} y2={my - 30 + i * 8 + 6} stroke="#9fb4e0" strokeWidth={2} opacity={cyc(ph) * 0.5 * (1 - ramp(run, 0.97, 1))} />;
            })}
            <Label x={geo(52, 33)[0]} y={geo(52, 33)[1] + 10} size={26} color={C.spr} italic font="serif" opacity={ramp(t, cue(3), cue(3) + 0.8)}>
              secepat hujan dihembus angin
            </Label>
          </g>
        ) : null}
        {kahfi > 0 ? <Glow x={1570} y={560} r={260} color="gold" opacity={kahfi} /> : null}
        {kahfi > 0 ? <Motes x={1570} y={560} rx={220} ry={140} n={20} color="gold" opacity={0.6 * kahfi} seed={7} /> : null}
      </Stage>

      <Pill x={960} y={790} p={pill1 * rowOn} text="HR Muslim · An-Nawwas bin Sam'an" />
      <Pill x={1570} y={350} p={pillB * mapOn} text="HR Bukhari" />
      {/* kartu nama surah */}
      {kahfi > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 1570,
            top: 560,
            transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * kahfi}) rotate(${1.5 * Math.sin(t * 0.7)}deg)`,
            opacity: Math.min(1, kahfi),
            padding: '26px 46px',
            borderRadius: 18,
            background: 'linear-gradient(160deg, rgba(40,32,12,0.95), rgba(14,16,34,0.95))',
            border: `2px solid ${C.gold}`,
            boxShadow: `0 0 40px ${C.gold}44, inset 0 0 24px ${C.gold}22`,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{fontFamily: FONT.head, fontSize: 22, letterSpacing: 4, color: C.muted}}>SURAH</div>
          <div style={{fontFamily: FONT.serif, fontSize: 64, color: C.gold, fontWeight: 600, lineHeight: 1.15}}>Al-Kahfi</div>
          <div style={{fontFamily: FONT.head, fontSize: 24, color: C.ink, opacity: pillK}}>ayat-ayat pembuka</div>
        </div>
      ) : null}
      <Pill x={1570} y={720} p={pillK * kahfi} text="HR Muslim" />
    </AbsoluteFill>
  );
};
