// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { CompilerConfig } from "./config";
import { Log } from "./log";
import { IDocument } from "./document";

let lastCompiledTime = Date.now() - 100 * 1000;

function isTooSoon(pauseInterval: number) {
  const now = Date.now();
  return now - lastCompiledTime < pauseInterval * 1000;
}

export function doesStartWithUnderscore(document: IDocument) {
  const fileOnly = document.getFileOnly();
  if (fileOnly.length === 0) {
    return true;
  }
  return fileOnly.startsWith("_");
}

export function validateDocument(
  document: IDocument,
  extensionConfig: CompilerConfig
): boolean {
  const fileonly = document.getFileOnly();
  if (fileonly.length === 0) {
    return false;
  }
  if (!document.isSass()) {
    return false;
  }
  if (
    !extensionConfig.enableStartWithUnderscores &&
    doesStartWithUnderscore(document)
  ) {
    // Ignore the files that start with underscore
    return false;
  }
  if (isTooSoon(extensionConfig.pauseInterval)) {
    Log.debug(
      `Last Compiled Time: ${lastCompiledTime}. Saved too soon and ignoring compile on save hence`
    );
    return false;
  }
  // This assignment of lastCompiledTime should be the final line before quitting this function
  lastCompiledTime = Date.now();
  return true;
}
