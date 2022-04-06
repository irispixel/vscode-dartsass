// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import * as path from "path";
import { CompilerConfig, SASSOutputFormat } from "./config";
import { Log } from "./log";
import { ProcessOutput, getWatcherPattern, xformPath } from "./platform";
import { getPlatform } from "./platform_factory";
import { getCurrentCompiler } from "./select";
import { ISassCompiler } from "./compiler";
import { doAutoprefixCSS } from "./autoprefix";
import {
  getWatchTargetDirectory,
  isMinCSS,
  isCSSFile,
  getMinCSS,
  defaultMinCSSExtension,
} from "./target";
import { cssWatch, closeChokidarWatcher } from "./chokidar_util";
import { FSWatcher } from "chokidar";
import { IMinifier, getSourceMapComment } from "./minifier";
import { CSSFile, writeCSSFile } from "./cssfile";
import { CleanCSSMinifier } from "./cleancss";
import { deleteFile, readFileSync } from "./fileutil";

const minifier: IMinifier = new CleanCSSMinifier();

const quirkyMinifiedFiles = `
** There is some quirkiness with sass watcher / chokidar that expects "dartsass.targetDirectory" to be set, for minified files to be generated as output **
`;

function doSingleLaunch(
  compiler: ISassCompiler,
  srcdir: string,
  projectRoot: string,
  config: CompilerConfig
): Promise<ProcessOutput> {
  return compiler.watch(srcdir, projectRoot, config);
}

async function getTransformation(
  contents: CSSFile,
  config: CompilerConfig,
  to: string,
  minifier: IMinifier
): Promise<CSSFile> {
  const cssfile = await doAutoprefixCSS(
    contents,
    to,
    config.disableAutoPrefixer,
    config.disableSourceMap
  );
  const comments = getSourceMapComment(config.disableSourceMap, to + ".map");
  return await minifier.minify(cssfile, config.disableSourceMap, comments);
}

async function _internalMinify(
  cwd: string,
  _docPath: string,
  config: CompilerConfig
): Promise<void> {
  const fqPath = path.join(cwd, _docPath);
  if (!isCSSFile(fqPath)) {
    return;
  }
  if (isMinCSS(fqPath, defaultMinCSSExtension)) {
    return;
  }
  Log.debug(`CSS File changed ${fqPath}`);
  const minifiedCSS = getMinCSS(fqPath, defaultMinCSSExtension);
  const inputSourceMapFile = fqPath + ".map";
  Log.debug(
    `About to minify ${fqPath} (inputSourceMap: ${inputSourceMapFile}) to ${minifiedCSS}`
  );
  const inputCSSFile = {
    css: readFileSync(fqPath, config.sourceEncoding),
    sourceMap: config.disableSourceMap
      ? null
      : readFileSync(inputSourceMapFile, "utf8"),
  };
  const minifiedFileOnly = path.basename(minifiedCSS);
  const cssfile = await getTransformation(
    inputCSSFile,
    config,
    minifiedFileOnly,
    minifier
  );
  await writeCSSFile(minifiedCSS, cssfile);
  Log.debug(`Wrote to ${minifiedCSS}[.map]`);
  return;
}

function doDelete(docPath: string, config: CompilerConfig): any {
  Log.debug(`Deletion event received for ${docPath}`);
  if (!isCSSFile(docPath)) {
    return;
  }
  if (isMinCSS(docPath, defaultMinCSSExtension)) {
    return;
  }
  const minifiedCSS = getMinCSS(docPath, defaultMinCSSExtension);
  deleteFile(minifiedCSS);
}

function doMinify(
  srcdir: string,
  projectRoot: string,
  config: CompilerConfig
): FSWatcher | null {
  if (
    config.outputFormat === SASSOutputFormat.MinifiedOnly ||
    config.outputFormat === SASSOutputFormat.CompiledCSSOnly
  ) {
    return null;
  }
  if (config.targetDirectory.length === 0) {
    Log.notify(`${quirkyMinifiedFiles}`);
    return null;
  }
  const targetDirectory = xformPath(
    projectRoot,
    getWatchTargetDirectory(srcdir, config)
  );
  const cwd = path.dirname(targetDirectory);
  const pattern = getWatcherPattern(path.basename(targetDirectory), "css");
  const fsWatcher = cssWatch(
    pattern,
    (docPath: string) => {
      _internalMinify(cwd, docPath, config);
    },
    (docPath: string) => {
      doDelete(docPath, config);
    },
    cwd
  );
  Log.debug(`Started chokidar watcher for ${targetDirectory}`);
  return fsWatcher;
}

export interface WatchInfo {
  pid: number;

  fsWatcher: FSWatcher | null;
}

export class Watcher {
  watchList: Map<string, WatchInfo> = new Map<string, WatchInfo>();

  async doLaunch(
    _srcdir: string,
    projectRoot: string,
    config: CompilerConfig
  ): Promise<string> {
    const srcdir = xformPath(projectRoot, _srcdir);
    const compiler = getCurrentCompiler(config);
    const pids = this.watchList.get(srcdir);
    if (pids !== null && pids !== undefined) {
      throw new Error(`${srcdir} already being watched ( pids ${pids} )`);
    }
    const value = await doSingleLaunch(compiler, srcdir, projectRoot, config);
    if (value.killed) {
      throw new Error(
        `Unable to launch sass watcher for ${srcdir}. process killed. Please check sassBinPath property.`
      );
    }
    if (value.pid === undefined || value.pid === null || value.pid <= 0) {
      this.watchList.delete(srcdir);
      throw new Error(
        `Unable to launch sass watcher for ${srcdir}. pid is undefined. Please check sassBinPath property.`
      );
    }
    const fsWatcher = doMinify(srcdir, projectRoot, config);
    this.watchList.set(srcdir, {
      pid: value.pid,
      fsWatcher: fsWatcher,
    });
    return `Launched scss/sass watchers`;
  }

  public ClearWatchDirectory(srcdir: string, isWindows: boolean): boolean {
    const watchInfo = this.watchList.get(srcdir);
    let cleared = false;
    const thisPlatform = getPlatform(isWindows);
    if (watchInfo !== null && watchInfo !== undefined) {
      Log.debug(
        `About to unwatch ${srcdir} with sass watcher pid ${watchInfo.pid}`
      );
      thisPlatform.killProcess(watchInfo.pid);
      if (watchInfo.fsWatcher !== undefined && watchInfo.fsWatcher !== null) {
        Log.debug(
          `About to clear chokidar watcher for sass watcher pid ${watchInfo.pid}`
        );
        closeChokidarWatcher(watchInfo.fsWatcher);
      } else {
        Log.debug(
          `No chokidar watcher for ${srcdir}, sass watcher pid ${watchInfo.pid}`
        );
      }
      cleared = true;
    } else {
      Log.debug(`Trying to unwatch ${srcdir}. But no watcher launched earlier`);
      cleared = true;
    }
    this.watchList.delete(srcdir);
    return cleared;
  }

  public ClearWatch(
    _srcdir: string,
    projectRoot: string,
    isWindows: boolean
  ): boolean {
    const srcdir = xformPath(projectRoot, _srcdir);
    return this.ClearWatchDirectory(srcdir, isWindows);
  }

  public ClearAll(isWindows: boolean) {
    const thisPlatform = getPlatform(isWindows);
    this.watchList.forEach((watchInfo: WatchInfo, key: string) => {
      Log.debug(`Unwatching ${key} with pid ${watchInfo.pid}`);
      thisPlatform.killProcess(watchInfo.pid);
      if (watchInfo.fsWatcher !== undefined && watchInfo.fsWatcher !== null) {
        closeChokidarWatcher(watchInfo.fsWatcher);
      }
    });
    this.watchList.clear();
  }

  /**
   * Relaunch relaunches all the watch processes for the watch directories
   */
  public Relaunch(
    projectRoot: string,
    config: CompilerConfig
  ): Array<Promise<string>> {
    this.ClearAll(config.isWindows);
    return config.watchDirectories.map((_srcdir: string, _: number) => {
      return this.doLaunch(_srcdir, projectRoot, config);
    });
  }

  public GetWatchList(): Map<string, WatchInfo> {
    return this.watchList;
  }
}

/**
 * watchDirectory adds a given directory to the list of directories being watched.
 *
 * Returns false, if directory already being watched. true, if the directory is being watched anew.
 * @param srcdir
 * @param config
 */
export async function watchDirectory(
  srcdir: string,
  config: CompilerConfig
): Promise<boolean> {
  for (const watchDir of config.watchDirectories) {
    if (watchDir === srcdir) {
      return false;
    }
  }
  config.watchDirectories.push(srcdir);
  return true;
}

export async function unwatchDirectory(
  srcdir: string,
  config: CompilerConfig
): Promise<string> {
  for (let i = 0; i < config.watchDirectories.length; ++i) {
    if (config.watchDirectories[i] === srcdir) {
      config.watchDirectories.splice(i, 1);
      return `${srcdir} unwatched successfully`;
    }
  }
  throw new Error(`${srcdir} not being watched before`);
}
