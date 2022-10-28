import ansiColors from 'ansi-colors';

import { ExecException } from 'child_process';

export function errorHandle(error: ExecException | null, cb: () => void): void {
  if (error) {
    console.log(error);
    console.log(`${ansiColors.bold.red('Something error happed so that building failed!')}`);
  }
  cb();
}

export function consoleMessage(message: string): (cb: () => void) => void {
  function consoleMessage(cb: () => void) {
    console.log(`${ansiColors.bold.green(message)}`);
    cb();
  }
  return consoleMessage;
}
