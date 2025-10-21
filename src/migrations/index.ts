import * as migration_20251005_184831 from './20251005_184831';
import * as migration_20251009_133440 from './20251009_133440';
import * as migration_20251015_183039 from './20251015_183039';
import * as migration_20251017_092813 from './20251017_092813';
import * as migration_20251021_112801 from './20251021_112801';
import * as migration_20251021_113943 from './20251021_113943';

export const migrations = [
  {
    up: migration_20251005_184831.up,
    down: migration_20251005_184831.down,
    name: '20251005_184831',
  },
  {
    up: migration_20251009_133440.up,
    down: migration_20251009_133440.down,
    name: '20251009_133440',
  },
  {
    up: migration_20251015_183039.up,
    down: migration_20251015_183039.down,
    name: '20251015_183039',
  },
  {
    up: migration_20251017_092813.up,
    down: migration_20251017_092813.down,
    name: '20251017_092813',
  },
  {
    up: migration_20251021_112801.up,
    down: migration_20251021_112801.down,
    name: '20251021_112801',
  },
  {
    up: migration_20251021_113943.up,
    down: migration_20251021_113943.down,
    name: '20251021_113943'
  },
];
