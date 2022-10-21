import { dest, series, src } from 'gulp';
import { exec } from 'child_process';
import ansiColors from 'ansi-colors';
import through from 'through2';

function _buildPackageForM1(cb: Function): void {
  const child_process = exec(`electron-packager ./dist/web 'Platform Listener' --platform=darwin --arch=arm64 --icon=scripts/assets/icons/dock.icns --overwrite=true --out=dist/electron`);
  child_process.on('close', code => {
    if (code !== 0) {
      cb(new Error(`Process failed with code ${code}`));
    } else {
      cb();
    }
  });
}

function _buildDmgForM1(cb: Function): void {
  const child_process = exec(`electron-installer-dmg ./dist/electron/'Platform Listener'-darwin-arm64/'Platform Listener'.app platform-listener-m1 --overwrite --out=dist/electron`);
  child_process.on('close', code => {
    if (code !== 0) {
      cb(new Error(`Process failed with code ${code}`));
    } else {
      cb();
      console.log(`${ansiColors.bold.green('Platform Listener for M1 has been built!')}`);
    }
  });
}

function _buildPackageForIntel(cb: Function): void {
  const child_process = exec(`electron-packager ./dist/web 'Platform Listener' --platform=darwin --arch=x64 --icon=scripts/assets/icons/dock.icns --overwrite=true --out=dist/electron`);
  child_process.on('close', code => {
    if (code !== 0) {
      cb(new Error(`Process failed with code ${code}`));
    } else {
      cb();
    }
  });
}

function _buildDmgForIntel(cb: Function): void {
  const child_process = exec(`electron-installer-dmg ./dist/electron/'Platform Listener'-darwin-x64/'Platform Listener'.app platform-listener-intel --overwrite --out=dist/electron`);
  child_process.on('close', code => {
    if (code !== 0) {
      cb(new Error(`Process failed with code ${code}`));
    } else {
      cb();
      console.log(`${ansiColors.bold.green('Platform Listener for Intel has been built!')}`);
    }
  });
}

export function _createPackageJson(cb: Function): void {
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

export function _createNodeModules(cb: Function): void {
  const files = ['atomically', '.bin', '.yarn-integrity', 'ajv', 'ajv-formats', 'conf', 'dayjs', 'debounce-fn', 'dot-prop', 'electron-store', 'env-paths', 'fast-deep-equal', 'find-up', 'is-obj', 'json-schema-traverse', 'json-schema-typed', 'locate-path', 'lru-cache', 'mimic-fn', 'onetime', 'p-limit', 'p-locate', 'p-try', 'path-exists', 'pkg-up', 'punycode', 'require-from-string', 'semver', 'type-fest', 'uri-js', 'uuid', 'yallist'];
  files.forEach(v => src(`./node_modules/${v}/**/*`).pipe(dest(`./dist/web/node_modules/${v}`)));
  cb();
}

export function _createElectronFiles(cb: Function): void {
  src(`./electron/**/*`).pipe(dest(`./dist/web/electron`));
  cb();
}

export const buildM1 = series(_buildPackageForM1, _buildDmgForM1);
export const buildIntel = series(_buildPackageForIntel, _buildDmgForIntel);
export const build = series(buildM1, buildIntel);
