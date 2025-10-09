import * as migration_20251005_184831 from './20251005_184831';
import * as migration_20251009_133440 from './20251009_133440';

export const migrations = [
  {
    up: migration_20251005_184831.up,
    down: migration_20251005_184831.down,
    name: '20251005_184831',
  },
  {
    up: migration_20251009_133440.up,
    down: migration_20251009_133440.down,
    name: '20251009_133440'
  },
];
