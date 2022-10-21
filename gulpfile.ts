import { task } from 'gulp';
import { build, buildIntel, buildM1, _createPackageJson } from './scripts';

task('build', build);
task('build:m1', buildM1);
task('build:intel', buildIntel);
task('createPackageJson', _createPackageJson);
