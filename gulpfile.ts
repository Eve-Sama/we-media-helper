import { task } from 'gulp';
import { buildAll, buildIntel, buildM1 } from './scripts/build';

task('build:all', buildAll);
task('build:m1', buildM1);
task('build:intel', buildIntel);