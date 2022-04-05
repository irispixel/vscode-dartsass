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
  line(msg: string): any {}

  debug(msg: string): any {}

  warning(msg: string): any {}

  info(msg: string): any {}

  error(msg: string): any {}

  notify(msg: string): any {}

  clear(): any {}
}

export let Log: ILog = new NullLog();

export function setLog(_log: ILog) {
  Log = _log;
}
