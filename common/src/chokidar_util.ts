// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";

import chokidar, { FSWatcher } from "chokidar";
import { Log } from "./log";

function doWatch(
  pattern: string,
  ignorePattern: string,
  fnOnChangeFile: (docPath: string) => any,
  fnOnDeleteFile: (docPath: string) => any,
  cwd: string
): FSWatcher {
  const watcher = chokidar.watch(pattern, {
    ignored: ignorePattern,
    awaitWriteFinish: true,
    persistent: true,
    ignoreInitial: true,
    cwd: cwd,
  });
  // Add event listeners.
  watcher
    .on("add", (docPath) => fnOnChangeFile(docPath))
    .on("change", (docPath) => fnOnChangeFile(docPath))
    .on("unlink", (docPath) => fnOnDeleteFile(docPath));
  return watcher;
}

export function cssWatch(
  pattern: string,
  fnOnFile: (docPath: string) => any,
  fnOnDeleteFile: (docPath: string) => any,
  cwd: string
): FSWatcher {
  Log.debug(`About to start css watcher for ${pattern}. cwd: ${cwd}`);
  const ignoreBlackListRegEx = `[*.scss|*.min.css|*.map|*.jpg|*.png|*.html|*.js|*.ts]`;
  return doWatch(pattern, ignoreBlackListRegEx, fnOnFile, fnOnDeleteFile, cwd);
}

export function scssWatch(
  pattern: string,
  fnOnFile: (docPath: string) => any,
  fnOnDeleteFile: (docPath: string) => any,
  cwd: string
): FSWatcher {
  const ignoreBlackListRegEx = `[*.css|*.min.css|*.map|*.jpg|*.png|*.html|*.js|*.ts]`;
  return doWatch(pattern, ignoreBlackListRegEx, fnOnFile, fnOnDeleteFile, cwd);
}

export function closeChokidarWatcher(watcher: FSWatcher) {
  watcher.close().then(() => {
    Log.debug(`Closed a FSWatcher`);
  });
}
