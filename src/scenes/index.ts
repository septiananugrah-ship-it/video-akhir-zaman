import type React from 'react';
import {AiDajjal} from './AiDajjal';
import {AiYajuj} from './AiYajuj';
import {Amanah} from './Amanah';
import {Dajjal} from './Dajjal';
import {Dajjal40} from './Dajjal40';
import {Final} from './Final';
import {Hook} from './Hook';
import {Isa} from './Isa';
import {Jibril} from './Jibril';
import {Knowledge} from './Knowledge';
import {LastProphet} from './LastProphet';
import {Mahdi} from './Mahdi';
import {Outro} from './Outro';
import {Peak} from './Peak';
import {Prophets} from './Prophets';
import {Provision} from './Provision';
import {Recap} from './Recap';
import {Roadmap} from './Roadmap';
import {Sunset} from './Sunset';
import {TenSigns} from './TenSigns';
import {Title} from './Title';
import {Today} from './Today';
import {Trust} from './Trust';
import {Unseen} from './Unseen';
import {Yajuj} from './Yajuj';
import {YajujEnd} from './YajujEnd';

// Pemetaan id adegan di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  amanah: Amanah,
  prophets: Prophets,
  lastprophet: LastProphet,
  jibril: Jibril,
  knowledge: Knowledge,
  trust: Trust,
  today: Today,
  tenSigns: TenSigns,
  mahdi: Mahdi,
  dajjal: Dajjal,
  dajjal40: Dajjal40,
  isa: Isa,
  yajuj: Yajuj,
  yajujEnd: YajujEnd,
  sunset: Sunset,
  final: Final,
  peak: Peak,
  aiDajjal: AiDajjal,
  aiYajuj: AiYajuj,
  unseen: Unseen,
  provision: Provision,
  recap: Recap,
  outro: Outro,
};
