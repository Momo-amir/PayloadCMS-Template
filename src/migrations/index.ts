import * as migration_20251223_184311 from './20251223_184311';
import * as migration_20260114_175151 from './20260114_175151';
import * as migration_20260115_162244 from './20260115_162244';
import * as migration_20260115_205213 from './20260115_205213';
import * as migration_20260121_145948 from './20260121_145948';

export const migrations = [
  {
    up: migration_20251223_184311.up,
    down: migration_20251223_184311.down,
    name: '20251223_184311',
  },
  {
    up: migration_20260114_175151.up,
    down: migration_20260114_175151.down,
    name: '20260114_175151',
  },
  {
    up: migration_20260115_162244.up,
    down: migration_20260115_162244.down,
    name: '20260115_162244',
  },
  {
    up: migration_20260115_205213.up,
    down: migration_20260115_205213.down,
    name: '20260115_205213',
  },
  {
    up: migration_20260121_145948.up,
    down: migration_20260121_145948.down,
    name: '20260121_145948'
  },
];
