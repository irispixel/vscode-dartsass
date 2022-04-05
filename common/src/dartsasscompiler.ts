// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
// import * as path from "path";
import { CompilerConfig } from "./config";
import { IDocument } from "./document";
import { Log } from "./log";
import { getOutputCSS } from "./target";
import { autoPrefixCSSBytes } from "./autoprefix";
import { ProcessOutput, xformPaths } from "./platform";
import { Info } from "./version";
import { ISassCompiler } from "./compiler";
import { NativeCompiler } from "./native";

import sass = require("sass");

const nativeCompiler: ISassCompiler = new NativeCompiler();

/**
 * Compile a given sass file based on DartSass implementation.
 *
 * More details of the API at -
 * https://github.com/sass/dart-sass/blob/master/README.md#javascript-api .
 */
export class DartSassCompiler {
  public async validate(
    config: CompilerConfig,
    projectRoot: string
  ): Promise<string> {
    return "";
  }

  public async sayVersion(
    config: CompilerConfig,
    projectRoot: string,
  ): Promise<string> {
    const info = (sass as unknown) as Info;
    const version = info.info;
    return version;
  }

  public async compileDocument(
    document: IDocument,
    config: CompilerConfig,
  ): Promise<string> {
    const output = getOutputCSS(document, config, false);
    Log.debug(
      `${document.getFileName()} -> ${output}, include path: ${config.includePath.join(
        ","
      )}`
    );
    if (config.canCompileCSS()) {
      await this.asyncCompile(document, false, output, config);
    }
    if (!config.canCompileMinified()) {
      return "";
    }
    const compressedOutput = getOutputCSS(document, config, true);
    await this.asyncCompile(document, true, compressedOutput, config);
    return "";
  }

  public async watch(
    srcdir: string,
    projectRoot: string,
    config: CompilerConfig
  ): Promise<ProcessOutput> {
    return nativeCompiler.watch(srcdir, projectRoot, config);
  }

  handleError(
    err: sass.Exception,
    config: CompilerConfig
  ): string {
    // const fileonly = path.basename(err.);
    // const formattedMessage = ` ${err.line}:${err.column} ${err.formatted}`;
    const formattedMessage = `${err.name} : ${err.message}`;
    Log.warning(`${formattedMessage}`);
    return `${err.message}`;
  }

  async asyncCompile(
    document: IDocument,
    compressed: boolean,
    output: string,
    config: CompilerConfig
  ): Promise<string> {
    const includePaths = xformPaths(
      document.getProjectRoot(),
      config.includePath
    );
    Log.debug(
      `asyncCompile (compileOnSave) ${document.getFileName()} to ${output}, IncludePaths: ${includePaths}, minified: ${compressed}`
    );
    try {
      const result = sass.renderSync({
        file: document.getFileName(),
        includePaths: includePaths,
        outputStyle: compressed ? "compressed" : "expanded",
        outFile: output,
        sourceMap: !config.disableSourceMap,
      });
      Log.debug(
        `Completed asyncCompile(compileOnSave) ${document.getFileName()} to ${output}. Starting autoprefix - sourceMap`
      );
      const inputCSSFile = {
        css: result.css.toString(config.sourceEncoding),
        sourceMap: (result.map ? result.map.toString() : null),
      };
      const value = await autoPrefixCSSBytes(output, inputCSSFile, config.disableAutoPrefixer, config.disableCompileOnSave);
      return `${value}`;
    } catch (err) {
      const msg = this.handleError(err as sass.Exception, config);
      throw new Error(`${msg}`);
    }
  }
}
