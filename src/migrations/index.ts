import * as migration_20251221_233800 from './20251221_233800';

export const migrations = [
  {
    up: migration_20251221_233800.up,
    down: migration_20251221_233800.down,
    name: '20251221_233800'
  },
];
