import { dest, series, src } from 'gulp';
import { exec } from 'child_process';
import through from 'through2';
import { consoleMessage, errorHandle } from './utils';

function _buildReact(cb: Function): void {
  exec(`cross-env BUILD_PATH=dist/web react-scripts build`, error => errorHandle(error, cb));
}

function _createPackageJson(cb: Function): void {
  const files = ['./package.json'];
  src(files)
    .pipe(
      through.obj(function (file, _encode, cb) {
        const targetPackage = {
          version: '0.0.0',
          main: 'electron/main.js',
          dependencies: {
            dayjs: '^1.11.5',
            'electron-store': '^8.1.0',
            uuid: '^9.0.0',
          },
        };
        const sourcePackage: string = file.contents.toString();
        targetPackage.version = JSON.parse(sourcePackage).version;
        file.contents = Buffer.from(JSON.stringify(targetPackage, null, 2) + '\n');
        this.push(file);
        cb();
      }),
    )
    .pipe(dest('./dist/web'));
  cb();
}

function _createNodeModules(cb: Function): void {
  const files = ['atomically', '.bin', '.yarn-integrity', 'ajv', 'ajv-formats', 'conf', 'dayjs', 'debounce-fn', 'dot-prop', 'electron-store', 'env-paths', 'fast-deep-equal', 'find-up', 'is-obj', 'json-schema-traverse', 'json-schema-typed', 'locate-path', 'lru-cache', 'mimic-fn', 'onetime', 'p-limit', 'p-locate', 'p-try', 'path-exists', 'pkg-up', 'punycode', 'require-from-string', 'semver', 'type-fest', 'uri-js', 'uuid', 'yallist'];
  files.forEach(v => src(`./node_modules/${v}/**/*`).pipe(dest(`./dist/web/node_modules/${v}`)));
  cb();
}

function _createElectronFiles(cb: Function): void {
  src(`./electron/**/*`).pipe(dest(`./dist/web/electron`));
  cb();
}

function _buildPackageForM1(cb: Function): void {
  exec(`electron-packager ./dist/web 'Platform Listener' --platform=darwin --arch=arm64 --icon=scripts/assets/icons/dock.icns --overwrite=true --out=dist/electron`, error => errorHandle(error, cb));
}

function _buildDmgForM1(cb: Function): void {
  exec(`electron-installer-dmg ./dist/electron/'Platform Listener'-darwin-arm64/'Platform Listener'.app platform-listener-m1 --overwrite --out=dist/electron`, error => errorHandle(error, cb));
}

function _buildPackageForIntel(cb: Function): void {
  exec(`electron-packager ./dist/web 'Platform Listener' --platform=darwin --arch=x64 --icon=scripts/assets/icons/dock.icns --overwrite=true --out=dist/electron`, error => errorHandle(error, cb));
}

function _buildDmgForIntel(cb: Function): void {
  exec(`electron-installer-dmg ./dist/electron/'Platform Listener'-darwin-x64/'Platform Listener'.app platform-listener-intel --overwrite --out=dist/electron`, error => errorHandle(error, cb));
}

const _buildWebDist = series(_buildReact, _createPackageJson, _createNodeModules, _createElectronFiles, consoleMessage(`Web dist has been created, it's ready for building app!`));

const _buildM1Arr = [_buildWebDist, _buildPackageForM1, _buildDmgForM1, consoleMessage('Platform Listener for M1 has been built!')];
const _buildIntelArr = [_buildWebDist, _buildPackageForIntel, _buildDmgForIntel, consoleMessage('Platform Listener for Intel has been built!')];

export const buildM1 = series(..._buildM1Arr);
export const buildIntel = series(..._buildIntelArr);
// 如果打包所有平台, 那么 _buildWebDist 只做一次就可以了, 因此重复的都去掉吧.
const set = new Set([..._buildM1Arr, ..._buildIntelArr]);
export const buildAll = series(Array.from(set));
