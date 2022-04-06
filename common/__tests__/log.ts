// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";
import { ILog } from "../src/log";

export function getConsoleLog(): ILog {
  const _log: ILog = {
    line(msg: string): any {
      console.log(`${msg}`);
    },

    debug(msg: string): any {
      console.log(`DEBUG: ${msg}`);
    },

    warning(msg: string): any {
      console.log(msg);
    },

    error(msg: string): any {
      console.log(msg);
    },

    notify(msg: string): any {
      console.log(msg);
    },

    info(msg: string): any {
      console.log(msg);
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clear(): any {},
  };
  return _log;
}

export class BufLog {
  buf = Buffer.alloc(20);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  line(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  debug(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  info(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  warning(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  error(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  notify(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clear(): any {}

  getInfo(): string {
    let raw = this.buf.toString("utf-8");
    raw = raw.replace(/(\r\n|\n|\r)/gm, "");
    return raw;
  }
}

export function getBufLog(): BufLog {
  const log = new BufLog();
  return log;
}
