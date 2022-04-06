// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";

export interface ILog {
  line(msg: string): any;

  debug(msg: string): any;

  warning(msg: string): any;

  info(msg: string): any;

  error(msg: string): any;

  notify(msg: string): any;

  clear(): any;
}

export class NullLog {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  line(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  debug(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  warning(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  info(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  error(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  notify(msg: string): any {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clear(): any {}
}

export let Log: ILog = new NullLog();

export function setLog(_log: ILog) {
  Log = _log;
}
