import { dest, series, src } from 'gulp';
import through from 'through2';

import { exec } from 'child_process';

import { consoleMessage, errorHandle } from './utils';

const webOutput = './dist/web';
const applicationOutput = './dist/installer';
const applicationName = 'We-Media-Helper';
let version: string;

function _buildReact(cb: () => void): void {
  exec(`cross-env BUILD_PATH=${webOutput} react-scripts build`, error => errorHandle(error, cb));
}

function _createPackageJson(cb: () => void): void {
  const files = ['./package.json'];
  src(files)
    .pipe(
      through.obj(function (file, _encode, cb) {
        const targetPackage = {
          name: null,
          version: null,
          description: null,
          author: null,
          productName: null,
          main: 'electron/main.js',
          dependencies: {
            dayjs: '^1.11.5',
            'electron-store': '^8.1.0',
            uuid: '^9.0.0',
          },
        };
        const sourcePackage: string = file.contents.toString();
        const obj = JSON.parse(sourcePackage);
        targetPackage.name = obj.name;
        targetPackage.version = obj.version;
        targetPackage.description = obj.description;
        targetPackage.author = obj.author;
        targetPackage.productName = obj.productName;
        file.contents = Buffer.from(`${JSON.stringify(targetPackage, null, 2)}\n`);
        this.push(file);
        version = obj.version;
        cb();
      }),
    )
    .pipe(dest(webOutput));
  cb();
}

function _createNodeModules(cb: () => void): void {
  const files = ['atomically', '.bin', '.yarn-integrity', 'ajv', 'ajv-formats', 'conf', 'dayjs', 'debounce-fn', 'dot-prop', 'electron-store', 'env-paths', 'fast-deep-equal', 'find-up', 'is-obj', 'json-schema-traverse', 'json-schema-typed', 'locate-path', 'lru-cache', 'mimic-fn', 'onetime', 'p-limit', 'p-locate', 'p-try', 'path-exists', 'pkg-up', 'punycode', 'require-from-string', 'semver', 'type-fest', 'uri-js', 'uuid', 'yallist'];
  files.forEach(v => src(`./node_modules/${v}/**/*`).pipe(dest(`${webOutput}/node_modules/${v}`)));
  cb();
}

function _createElectronFiles(cb: () => void): void {
  src(`./electron/**/*`).pipe(dest(`${webOutput}/electron`));
  cb();
}

function _buildPackageForM1(cb: () => void): void {
  exec(`electron-packager ${webOutput} ${applicationName} --platform=darwin --arch=arm64 --icon=scripts/assets/icons/mac-dock.icns --overwrite --out=${applicationOutput}`, error => errorHandle(error, cb));
}

function _buildDmgForM1(cb: () => void): void {
  exec(`electron-installer-dmg ${applicationOutput}/${applicationName}-darwin-arm64/${applicationName}.app wmh-${version}-m1-arm64 --overwrite --out=${applicationOutput}`, error => errorHandle(error, cb));
}

function _buildPackageForIntel(cb: () => void): void {
  exec(`electron-packager ${webOutput} ${applicationName} --platform=darwin --arch=x64 --icon=scripts/assets/icons/mac-dock.icns --overwrite --out=${applicationOutput}`, error => errorHandle(error, cb));
}

function _buildDmgForIntel(cb: () => void): void {
  exec(`electron-installer-dmg ${applicationOutput}/${applicationName}-darwin-x64/${applicationName}.app wmh-${version}-intel-x64 --overwrite --out=${applicationOutput}`, error => errorHandle(error, cb));
}

function _buildPackageForWindows(cb: () => void): void {
  exec(`electron-packager ${webOutput} ${applicationName} --platform=win32 --arch=x64 --icon=scripts/assets/icons/win-taskbar.ico --overwrite --out=${applicationOutput}`, error => errorHandle(error, cb));
}

function _buildExeForWindows(cb: () => void): void {
  exec(`electron-installer-windows --src ${applicationOutput}/${applicationName}-win32-x64 --dest ${applicationOutput}`, error => errorHandle(error, cb));
}

const _buildWebDist = series(_buildReact, _createPackageJson, _createNodeModules, _createElectronFiles, consoleMessage(`Web dist has been created, it's ready for building app!`));

const _buildM1Arr = [_buildWebDist, _buildPackageForM1, _buildDmgForM1, consoleMessage('${applicationName} for M1 has been built!')];
const _buildIntelArr = [_buildWebDist, _buildPackageForIntel, _buildDmgForIntel, consoleMessage('${applicationName} for Intel has been built!')];
const _buildWindowsArr = [_buildWebDist, _buildPackageForWindows, _buildExeForWindows, consoleMessage('${applicationName} for Windows has been built!')];

export const buildM1 = series(..._buildM1Arr);
export const buildIntel = series(..._buildIntelArr);
// windows 平台打包有问题, 暂时先不使用
export const buildWindows = series(..._buildWindowsArr);
// 如果打包所有平台, 那么 _buildWebDist 只做一次就可以了, 因此重复的都去掉吧.
const set = new Set([..._buildM1Arr, ..._buildIntelArr]);
export const buildAll = series(Array.from(set));
// brew install --cask wine-stable
// brew install mono
