// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IPlatform } from "./platform";
import { LinuxCompiler } from "./linux";
import { WindowsCompiler } from "./windows";
import * as os from "os";

const linuxPlatform: IPlatform = new LinuxCompiler();
const windowsPlatform: IPlatform = new WindowsCompiler();

export function getPlatform(isWindows: boolean) {
  return isWindows ? windowsPlatform: linuxPlatform;
}

export function isWindows(): boolean {
  return os.platform() === "win32";
}