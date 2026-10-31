import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand} from '../anim';
import {Badge, Card, Glow, Label, Motes, Ripple, Spark, Stage, Twinkles} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Renungan (bukan tafsir): label ungu "Renungan · bukan tafsir" tampil sepanjang adegan.
// Status "sudah/sedang" = gambaran renungan sesuai narasi ("banyak ulama berpendapat…"), bukan klaim dalil.

const slot = (t: number, a: number, b: number, fi = 0.6, fo = 0.6) => Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, EASE_IN_OUT));

const CHECK = [
  {text: 'nabi terakhir diutus', done: true},
  {text: 'bangunan berlomba tinggi', done: true},
  {text: 'perjalanan makin singkat', done: true},
  {text: 'waktu terasa cepat', done: false},
  {text: 'ilmu makin langka', done: false},
  {text: 'amanah disia-siakan', done: false},
];

const PX = 760; // ponsel
const PY = 530;
const PW = 300;
const PH = 560;

export const Today: React.FC = () => {
  const {t, cue, wordOf} = useScene();

  // label renungan: besar di tengah → mengecil ke atas, tetap tampil
  const lblIn = ramp(t, -0.2, 0.8);
  const lblMove = ramp(t, cue(1) - 0.4, cue(1) + 0.6, EASE_IN_OUT);
  const lblY = mix(470, 196, lblMove);
  const lblSize = mix(48, 26, lblMove);
  const frame = ramp(t, 0.2, 1.4);

  // 1 — daftar periksa
  const pC = slot(t, cue(1) - 0.1, cue(2) + 0.3, 0.7, 0.7);
  const rowP = CHECK.map((_, k) => ramp(t, cue(1) + 0.2 + k * 0.25, cue(1) + 0.7 + k * 0.25));
  const tSudah = wordOf(1, 'sudah');
  const tSedang = wordOf(1, 'sedang');
  const mark = CHECK.map((c, k) => (c.done ? ramp(t, tSudah + k * 0.25, tSudah + k * 0.25 + 0.4, BACK) : ramp(t, tSedang + (k - 3) * 0.25, tSedang + (k - 3) * 0.25 + 0.4, BACK)));
  const ringDone = ramp(t, tSudah, tSudah + 1.2, EASE_IN_OUT);
  const ringNow = ramp(t, tSedang, tSedang + 1.2, EASE_IN_OUT);

  // 2 — banjir informasi vs pelita kebijaksanaan
  const pF = slot(t, cue(2) - 0.1, cue(3) + 0.3, 0.8, 0.7);
  const flood = ramp(t, cue(2) - 0.1, wordOf(2, 'melimpah') + 0.6);
  const wis = ramp(t, wordOf(2, 'kebijaksanaan') - 0.2, wordOf(2, 'kebijaksanaan') + 0.6);
  const tBc = wordOf(2, 'Siapa');
  const bc = ramp(t, tBc - 0.2, tBc + 0.5);
  const juta = ramp(t, wordOf(2, 'jutaan') - 0.1, wordOf(2, 'jutaan') + 0.6);

  // 3 — layar digulir tanpa henti, jam berputar cepat
  const pP = slot(t, cue(3) - 0.1, cue(4) + 0.3, 0.8, 0.7);
  const tau = Math.max(0, t - cue(3));
  const scroll = 160 * tau + 40 * tau * tau;
  const turns = 0.5 * tau + 0.12 * tau * tau;
  const jam = ramp(t, wordOf(3, 'berjam') - 0.1, wordOf(3, 'berjam') + 0.5);
  const kemana = ramp(t, wordOf(3, 'mana') - 0.1, wordOf(3, 'mana') + 0.6);

  // 4 — dua batang hampir bersentuhan
  const pE = ramp(t, cue(4) + 0.1, cue(4) + 0.9);
  const close = ramp(t, wordOf(4, 'dua') - 0.6, wordOf(4, 'dekat') + 0.4, EASE_IN_OUT);
  const gap = mix(260, 12, close);
  const peng = ramp(t, wordOf(4, 'pengingat'), wordOf(4, 'pengingat') + 0.6, BACK);
  const EX = 960;
  const EB = 700;

  const am = turns * Math.PI * 2 - Math.PI / 2;
  const ah = (turns / 12) * Math.PI * 2 - Math.PI / 2;

  return (
    <AbsoluteFill>
      <Stage>
        <defs>
          <clipPath id="td-screen">
            <rect x={PX - PW / 2 + 16} y={PY - PH / 2 + 50} width={PW - 32} height={PH - 100} rx={10} />
          </clipPath>
          <linearGradient id="td-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#b8741a" />
            <stop offset="60%" stopColor={C.gold} />
            <stop offset="100%" stopColor="#fff3c4" />
          </linearGradient>
        </defs>

        {/* bingkai renungan: sudut ungu */}
        <g opacity={frame * 0.7}>
          {[
            [110, 175, 1, 1],
            [1810, 175, -1, 1],
            [110, 880, 1, -1],
            [1810, 880, -1, -1],
          ].map(([x, y, sx, sy], k) => (
            <path key={k} d={`M${x},${y + sy * 70} L${x},${y} L${x + sx * 70},${y}`} fill="none" stroke={C.spr} strokeWidth={3} strokeLinecap="round" opacity={0.6 + 0.3 * Math.sin(t * 1.3 + k)} />
          ))}
        </g>

        {/* 0: pembuka */}
        <Ripple x={960} y={470} p={ramp(t, 0.6, 2.6, (x) => x)} r={420} color="spr" />
        <Motes x={960} y={470} rx={520} ry={240} n={30} color="spr" opacity={0.5 * (1 - lblMove)} />

        {/* 1: cincin sudah/sedang */}
        {pC > 0.001 ? (
          <g opacity={pC} transform={`translate(1390,520) rotate(${t * 4})`}>
            <circle cx={0} cy={0} r={170} fill="none" stroke={C.line} strokeWidth={26} />
            <circle cx={0} cy={0} r={170} fill="none" stroke={C.kin} strokeWidth={26} strokeDasharray={`${2 * Math.PI * 170 * 0.5 * ringDone} 2000`} transform="rotate(-90)" />
            <circle
              cx={0}
              cy={0}
              r={170}
              fill="none"
              stroke={C.kin}
              strokeOpacity={0.35 + 0.25 * Math.sin(t * 3)}
              strokeWidth={26}
              strokeDasharray={`${2 * Math.PI * 170 * 0.5 * ringNow} 2000`}
              transform="rotate(90)"
            />
          </g>
        ) : null}
        {pC > 0.001 ? (
          <g opacity={pC}>
            <Label x={1390} y={500} size={34} color={C.ink} weight={600}>
              tanda kecil
            </Label>
            <Label x={1390} y={545} size={22} color={C.muted} font="sans">
              (gambaran renungan)
            </Label>
            <Label x={1300} y={760} size={28} color={C.kin} weight={600} opacity={ringDone}>
              ■ sudah
            </Label>
            <Label x={1490} y={760} size={28} color={C.kin} weight={600} opacity={ringNow * (0.6 + 0.4 * Math.sin(t * 3))}>
              □ sedang
            </Label>
          </g>
        ) : null}

        {/* 2: banjir informasi */}
        {pF > 0.001 ? (
          <g opacity={pF}>
            {Array.from({length: 130}, (_, i) => {
              const sp = 0.12 + rand(i) * 0.2;
              const ph = (t * sp + rand(i + 5)) % 1;
              const x = mix(120, 1800, ph);
              const y = 250 + rand(i + 9) * 600 + 26 * Math.sin(ph * 9 + i);
              const col = i % 3 === 0 ? C.spr : i % 3 === 1 ? C.pot : C.press;
              // tersibak di sekitar pelita: butir di dekatnya didorong menjauh
              const dx = x - 1250;
              const dy = y - 560;
              const d = Math.hypot(dx, dy);
              const push = d < 150 ? (150 - d) * 0.6 * wis : 0;
              return (
                <rect
                  key={i}
                  x={x + (dx / (d || 1)) * push}
                  y={y + (dy / (d || 1)) * push}
                  width={12 + rand(i + 2) * 26}
                  height={6}
                  rx={2}
                  fill={col}
                  opacity={cyc(ph) * 0.85 * flood}
                />
              );
            })}
            <Label x={420} y={260} size={34} color={C.spr} weight={600} opacity={flood}>
              informasi melimpah
            </Label>
            {/* pelita kebijaksanaan */}
            <g opacity={wis}>
              <Glow x={1250} y={520} r={150 + 8 * Math.sin(t * 2)} color="cyan" />
              <path d="M1208,580 Q1250,612 1292,580 L1314,564 L1286,568 Q1250,556 1208,580 Z" fill="#b8862e" stroke={C.gold} strokeWidth={2} />
              <path
                d={`M1300,560 q-10,${-20 - 3 * Math.sin(t * 9)} 0,${-46 - 4 * Math.sin(t * 7)} q10,26 0,${46 + 4 * Math.sin(t * 7)} Z`}
                fill={C.cyan}
              />
              <path d="M1300,560 q-4,-10 0,-22 q4,12 0,22 Z" fill="#fff" />
              <Label x={1250} y={660} size={32} color={C.cyan} weight={600}>
                kebijaksanaan
              </Label>
            </g>
            {/* siaran tanpa ilmu */}
            <g opacity={bc}>
              <circle cx={560} cy={620} r={16} fill={C.spr} />
              {Array.from({length: 4}, (_, k) => {
                const ph = (t * 0.8 + k / 4) % 1;
                return <circle key={k} cx={560} cy={620} r={20 + ph * (120 + 240 * juta)} fill="none" stroke={C.spr} strokeWidth={3} opacity={cyc(ph) * 0.7} />;
              })}
              {Array.from({length: 36}, (_, k) => {
                const a = (k / 36) * Math.PI * 2;
                const r = 230 + 60 * rand(k);
                return <circle key={k} cx={560 + Math.cos(a) * r} cy={620 + Math.sin(a) * r * 0.55} r={4} fill={C.ink} opacity={juta * (0.4 + 0.4 * Math.sin(t * 3 + k))} />;
              })}
              <Label x={560} y={680} size={26} color={C.spr} font="sans">
                tanpa ilmu
              </Label>
            </g>
          </g>
        ) : null}

        {/* 3: ponsel & jam */}
        {pP > 0.001 ? (
          <g opacity={pP}>
            <Glow x={PX} y={PY} r={360} color="spr" opacity={0.35} />
            <rect x={PX - PW / 2} y={PY - PH / 2} width={PW} height={PH} rx={40} fill="#0b1026" stroke="#5a6aa8" strokeWidth={5} />
            <rect x={PX - 40} y={PY - PH / 2 + 18} width={80} height={10} rx={5} fill="#2a3566" />
            <g clipPath="url(#td-screen)">
              <rect x={PX - PW / 2} y={PY - PH / 2} width={PW} height={PH} fill="#121a3a" />
              {Array.from({length: 6}, (_, i) => {
                const CH = 150;
                const y = ((((i * CH - scroll) % (6 * CH)) + 6 * CH) % (6 * CH)) - CH + PY - PH / 2 + 50;
                const hueC = [C.spr, C.kin, C.cyan, C.press, C.work, C.pot][i];
                return (
                  <g key={i}>
                    <rect x={PX - PW / 2 + 28} y={y + 10} width={PW - 56} height={CH - 20} rx={12} fill="#1c2652" />
                    <circle cx={PX - PW / 2 + 54} cy={y + 36} r={14} fill={hueC} opacity={0.8} />
                    <rect x={PX - PW / 2 + 78} y={y + 28} width={120} height={8} rx={4} fill="#8a96c4" opacity={0.7} />
                    <rect x={PX - PW / 2 + 40} y={y + 60} width={PW - 80} height={56} rx={8} fill={hueC} opacity={0.25} />
                  </g>
                );
              })}
            </g>
            {/* ibu jari menggulir */}
            <circle cx={PX + 40} cy={PY + 190 - 120 * ((t * 1.6) % 1)} r={22} fill="#fff" opacity={0.22 * cyc((t * 1.6) % 1)} />
            {/* jam */}
            <Glow x={1280} y={480} r={230} color="kin" opacity={0.35} />
            <circle cx={1280} cy={480} r={150} fill="rgba(16,26,56,0.92)" stroke={C.kin} strokeWidth={5} />
            {Array.from({length: 12}, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <circle key={i} cx={1280 + Math.cos(a) * 124} cy={480 + Math.sin(a) * 124} r={i % 3 ? 3 : 6} fill={C.ink} opacity={0.7} />;
            })}
            {Array.from({length: 6}, (_, i) => (
              <path key={i} d={`M1280,480 L${1280 + Math.cos(am - i * 0.14) * 110},${480 + Math.sin(am - i * 0.14) * 110}`} stroke={C.kin} strokeWidth={6} strokeLinecap="round" opacity={0.18 * (1 - i / 6)} />
            ))}
            <path d={`M1280,480 L${1280 + Math.cos(ah) * 70},${480 + Math.sin(ah) * 70}`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
            <path d={`M1280,480 L${1280 + Math.cos(am) * 110},${480 + Math.sin(am) * 110}`} stroke={C.kin} strokeWidth={6} strokeLinecap="round" />
            <circle cx={1280} cy={480} r={9} fill={C.kin} />
            <Label x={1280} y={685} size={34} color={C.kin} weight={600} opacity={jam}>
              berjam-jam
            </Label>
            <Label x={1280} y={740} size={28} color={C.muted} font="sans" opacity={kemana}>
              ke mana waktu pergi?
            </Label>
          </g>
        ) : null}

        {/* 4: dua batang hampir bersentuhan */}
        {pE > 0.001 ? (
          <g opacity={pE}>
            <Glow x={EX} y={EB - 200} r={340} color="gold" opacity={0.35 + 0.35 * close} />
            <ellipse cx={EX} cy={EB + 8} rx={200} ry={16} fill={C.gold} opacity={0.1} />
            {[
              {x: EX - gap / 2 - 23, h: 320},
              {x: EX + gap / 2 + 23, h: 360},
            ].map((b, i) => (
              <g key={i}>
                <rect x={b.x - 40} y={EB - b.h - 14} width={80} height={b.h + 14} rx={40} fill={C.gold} opacity={0.14} />
                <rect x={b.x - 23} y={EB - b.h} width={46} height={b.h} rx={23} fill="url(#td-bar)" />
                <rect x={b.x - 10} y={EB - b.h + 14} width={8} height={b.h - 40} rx={4} fill="#fff" opacity={0.35} />
              </g>
            ))}
            <Spark x={EX} y={EB - 160 - 60 * Math.sin(t * 1.3)} r={4 + 3 * close} color="white" opacity={close} />
            <Ripple x={EX} y={EB - 180} p={ramp(t, wordOf(4, 'pengingat'), wordOf(4, 'pengingat') + 1.6, (x) => x)} r={300} color="cyan" />
            <Label x={EX} y={EB + 60} size={52} color={C.cyan} weight={600} opacity={peng}>
              pengingat
            </Label>
            <Twinkles x={EX} y={EB - 200} rx={220} ry={180} n={6} opacity={peng} />
            <Motes x={EX} y={EB - 200} rx={360} ry={240} n={26} color="gold" opacity={0.5} />
          </g>
        ) : null}
      </Stage>

      {/* daftar periksa tanda kecil */}
      <Card x={600} y={540} opacity={pC} scale={0.95 + 0.05 * pC} accent={C.kin} style={{padding: '24px 36px'}}>
        {CHECK.map((c, k) => (
          <div key={k} style={{display: 'block', fontFamily: FONT.head, fontSize: 38, lineHeight: 1.6, opacity: rowP[k], whiteSpace: 'nowrap'}}>
            <span
              style={{
                display: 'inline-block',
                width: 40,
                height: 40,
                verticalAlign: '-0.2em',
                marginRight: 18,
                borderRadius: 10,
                border: `3px solid ${C.kin}`,
                background: c.done ? `rgba(255,138,61,${0.85 * mark[k]})` : 'transparent',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '34px',
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              <span style={{opacity: c.done ? mark[k] : 0}}>✓</span>
            </span>
            {c.text}
            <span
              style={{
                display: 'inline-block',
                marginLeft: 18,
                padding: '2px 14px',
                borderRadius: 999,
                fontSize: 24,
                fontFamily: FONT.sans,
                verticalAlign: '0.15em',
                border: `2px solid ${C.kin}`,
                color: c.done ? '#fff' : C.kin,
                background: c.done ? `${C.kin}cc` : 'transparent',
                opacity: mark[k] * (c.done ? 1 : 0.65 + 0.35 * Math.sin(t * 3 + k)),
              }}
            >
              {c.done ? 'sudah' : 'sedang'}
            </span>
          </div>
        ))}
      </Card>

      {/* label renungan (sepanjang adegan) */}
      <Badge x={960} y={lblY} text="Renungan · bukan tafsir" color={C.spr} opacity={lblIn} size={lblSize} scale={1 + 0.02 * Math.sin(t * 1.5)} />
    </AbsoluteFill>
  );
};
