// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { CompilerConfig } from "./config";
import { Log } from "./log";
import { IDocument } from "./document";
import { ProcessOutput, xformPath } from "./platform";
import { getRelativeDirectory } from "./target";

export interface ISassCompiler {
  sayVersion(config: CompilerConfig, projectRoot: string): Promise<string>;

  validate(config: CompilerConfig, projectRoot: string): Promise<string>;

  compileDocument(document: IDocument, config: CompilerConfig): Promise<string>;

  watch(
    srcdir: string,
    projectRoot: string,
    config: CompilerConfig
  ): Promise<ProcessOutput>;
}

export function isBeingWatched(
  document: IDocument,
  config: CompilerConfig
): boolean {
  const projectRoot = document.getProjectRoot();
  const docPath = document.getFileName();
  let watched = false;
  for (const watchDirectory of config.watchDirectories) {
    const fqWatchDirectory = xformPath(projectRoot, watchDirectory);
    const relativeDocPath = getRelativeDirectory(fqWatchDirectory, docPath);
    Log.debug(
      `relativeDocPath: ${relativeDocPath}, docPath: ${docPath} for fqWatchDirectory: ${fqWatchDirectory}`
    );
    if (!relativeDocPath.startsWith("..") && relativeDocPath !== docPath) {
      // Indeed it is a subdirectory of watchDirectory so being watched
      Log.debug(
        `Warning: Failed to compile on save ${docPath} as the directory ( ${watchDirectory} ) is already being watched `
      );
      watched = true;
      break;
    }
  }
  return watched;
}
