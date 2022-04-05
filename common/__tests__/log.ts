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

    clear(): any {},
  };
  return _log;
}

export class BufLog {
  buf = Buffer.alloc(20);


  line(msg: string): any {}

  debug(msg: string): any {}

  info(msg: string): any {}

  warning(msg: string): any {}

  error(msg: string): any {}

  notify(msg: string): any {}

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
