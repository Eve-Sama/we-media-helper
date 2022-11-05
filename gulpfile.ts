import { task } from 'gulp';

import { buildAll, buildEB, buildIntel, buildM1, buildWindows } from './scripts/build';

task('build:all', buildAll);
task('build:m1', buildM1);
task('build:intel', buildIntel);
task('build:windows', buildWindows);
task('build:eb', buildEB);
