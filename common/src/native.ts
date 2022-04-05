// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { CompilerConfig, SASSOutputFormat } from "./config";
import { IDocument } from "./document";
import { ProcessOutput, xformPaths } from "./platform";
import { getPlatform } from "./platform_factory";
import { Log } from "./log";
import {
  getWatchTargetDirectory,
  getOutputCSS,
  getRelativeDirectory,
} from "./target";
import { autoPrefixCSSBytes } from "./autoprefix";
import { readFileSync } from "./fileutil";
import { isBeingWatched } from "./compiler";
import util from "util";
import fs from "fs";

const VersionArgs = ["--version"];

/**
 * NativeCompiler uses the sass executable present in config.sassBinPath and uses the cmd line to compile the same.
 */
export class NativeCompiler {


  public async sayVersion(config: CompilerConfig, projectRoot: string): Promise<string> {
    let platform = getPlatform(config.isWindows);
    let runPromise = platform.sayVersion(config, projectRoot, VersionArgs);
    return await runPromise;
  }

  public async validate(config: CompilerConfig, projectRoot: string): Promise<string> {
    let platform = getPlatform(config.isWindows);
    const sassBinPath = platform.getSassBinPath(projectRoot, config.sassBinPath);
    if (!fs.existsSync(sassBinPath)) {
      throw new Error(
        `ProjectRoot: ${projectRoot}. Sass Binary Path ${sassBinPath} does not exist`
      );
    }
    if (fs.lstatSync(sassBinPath).isDirectory()) {
      throw new Error(
        `ProjectRoot: ${projectRoot}. Sass Binary Path ${sassBinPath} is a directory`
      );
    }
    return "";
  }

  async doCompileDocument(csspath: string, config: CompilerConfig, cwd: string, args: string[]): Promise<string> {
    const projectRoot = cwd;
    let platform = getPlatform(config.isWindows);
    let runPromise = platform.compileDocument(config, projectRoot, cwd, args);
    await runPromise;
    await autoPrefixCSSBytes(
      csspath,
      {
        css: readFileSync(csspath, config.sourceEncoding),
        sourceMap: readFileSync(csspath + ".map", 'utf-8'),
      },
      config.disableAutoPrefixer,
      config.disableSourceMap
    );
    return csspath;
  }

  getArgs(document: IDocument, config: CompilerConfig, output: string, minified: boolean): string[] {
    const result = this.doGetArgs(document.getProjectRoot(), config, minified);
    const input = document.getFileName();
    const base = document.getProjectRoot();
    result.push(
      util.format(
        "%s:%s",
        getRelativeDirectory(base, input),
        getRelativeDirectory(base, output)
      )
    );
    return result;
  }

  public async compileDocument(document: IDocument, config: CompilerConfig): Promise<string> {
    if (isBeingWatched(document, config)) {
      return "Document already being watched";
    }
    let value = "";
    if (config.canCompileCSS()) {
      const output = getOutputCSS(document, config, false);
      const args = this.getArgs(document, config, output, false);
      value = await this.doCompileDocument(
        output,
        config,
        document.getProjectRoot(),
        args
      );
    }
    if (!config.canCompileMinified()) {
      return value;
    }
    const minifiedOutput = getOutputCSS(document, config, true);
    const minArgs = this.getArgs(document, config, minifiedOutput, true);
    return await this.doCompileDocument(
      minifiedOutput,
      config,
      document.getProjectRoot(),
      minArgs
    );
  }

  doGetArgs(projectRoot: string, config: CompilerConfig, minified: boolean): Array<string> {
    const includePaths = xformPaths(projectRoot, config.includePath);
    const result = new Array<string>();
    if (minified) {
      result.push("--style");
      result.push("compressed");
    }
    if (config.disableSourceMap) {
      result.push("--no-source-map");
    }
    for (const path of includePaths) {
      result.push("-I");
      const relativePath = getRelativeDirectory(projectRoot, path);
      let includePath = relativePath;
      if (relativePath.indexOf(" ") !== -1) {
        // has spaces in it so encode it better
        includePath = util.format('"%s"', relativePath);
      }
      result.push(includePath);
    }
    return result;
  }

  doGetWatchArgs(projectRoot: string, config: CompilerConfig, _srcdir: string): Array<string> {
    const minified = config.outputFormat === SASSOutputFormat.MinifiedOnly;
    const args = this.doGetArgs(projectRoot, config, minified);
    args.push("--watch");
    const relativeSrcDir = getRelativeDirectory(projectRoot, _srcdir);
    const targetDirectory = getWatchTargetDirectory(relativeSrcDir, config);
    args.push(util.format("%s:%s", relativeSrcDir, targetDirectory));
    return args;
  }

  public watch(srcdir: string, projectRoot: string, config: CompilerConfig): Promise<ProcessOutput> {
    const watchArgs = this.doGetWatchArgs(projectRoot, config, srcdir);
    Log.debug(`Watching ${srcdir}.`);
    let platform = getPlatform(config.isWindows);
    return platform.watch(config, projectRoot, watchArgs);
  }
}
