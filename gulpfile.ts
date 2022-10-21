import { task } from 'gulp';
import { build, buildIntel, buildM1 } from './scripts/build';

task('build', build);
task('build:m1', buildM1);
task('build:intel', buildIntel);
