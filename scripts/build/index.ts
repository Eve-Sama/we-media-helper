import { series } from 'gulp';
import { exec } from 'child_process';
import ansiColors from 'ansi-colors';

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

export const buildM1 = series(_buildPackageForM1, _buildDmgForM1);
export const buildIntel = series(_buildPackageForIntel, _buildDmgForIntel);
export const build = series(buildM1, buildIntel);
