import * as migration_20251223_184311 from './20251223_184311';
import * as migration_20260114_175151 from './20260114_175151';
import * as migration_20260115_162244 from './20260115_162244';
import * as migration_20260115_205213 from './20260115_205213';
import * as migration_20260121_145948 from './20260121_145948';
import * as migration_20260122_095942 from './20260122_095942';
import * as migration_20260126_150339 from './20260126_150339';
import * as migration_20260126_172242 from './20260126_172242';
import * as migration_20260131_130950 from './20260131_130950';

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
    name: '20260121_145948',
  },
  {
    up: migration_20260122_095942.up,
    down: migration_20260122_095942.down,
    name: '20260122_095942',
  },
  {
    up: migration_20260126_150339.up,
    down: migration_20260126_150339.down,
    name: '20260126_150339',
  },
  {
    up: migration_20260126_172242.up,
    down: migration_20260126_172242.down,
    name: '20260126_172242',
  },
  {
    up: migration_20260131_130950.up,
    down: migration_20260131_130950.down,
    name: '20260131_130950'
  },
];
