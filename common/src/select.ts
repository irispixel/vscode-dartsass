// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";

import { CompilerConfig } from "./config";
import { ISassCompiler } from "./compiler";
import { DartSassCompiler } from "./dartsasscompiler";
import { NativeCompiler } from "./native";

const sassCompiler: ISassCompiler = new DartSassCompiler();
const nativeCompiler: ISassCompiler = new NativeCompiler();


export function getCurrentCompiler(
  extensionConfig: CompilerConfig
): ISassCompiler {
  if (extensionConfig.sassBinPath !== null &&
    extensionConfig.sassBinPath !== undefined &&
    extensionConfig.sassBinPath.length > 0) {
    return nativeCompiler;
  } else {
    return sassCompiler;
  }
}
