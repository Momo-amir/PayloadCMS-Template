import * as migration_20250615_110940 from './20250615_110940';

export const migrations = [
  {
    up: migration_20250615_110940.up,
    down: migration_20250615_110940.down,
    name: '20250615_110940'
  },
];
