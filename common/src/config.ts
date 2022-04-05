// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";

export const DefaultBrowsersList: Array<string> = ["> 1%", "last 2 versions"];

export enum SASSOutputFormat {
  Both = 1,
  CompiledCSSOnly,
  MinifiedOnly,
}

export class CompilerConfig {

  sassBinPath = "";

  includePath: Array<string> = [];

  outputFormat: SASSOutputFormat = SASSOutputFormat.Both;

  disableSourceMap = false;

  sourceEncoding: BufferEncoding = 'utf-8';

  nodeExePath = "node.exe";

  debug = false;

  disableCompileOnSave = false;

  pauseInterval = 3;

  enableStartWithUnderscores = false;

  disableAutoPrefixer = false;

  targetDirectory = "";

  watchDirectories: Array<string> = [];

  isWindows = false;

  canCompileCSS(): boolean {
    const outputformat = this.outputFormat;
    return (
      outputformat === SASSOutputFormat.Both ||
      outputformat === SASSOutputFormat.CompiledCSSOnly
    );
  }

  canCompileMinified(): boolean {
    const outputformat = this.outputFormat;
    return (
      outputformat === SASSOutputFormat.Both ||
      outputformat === SASSOutputFormat.MinifiedOnly
    );
  }

  public static encodingFrom(encoding: string): BufferEncoding {
    if (encoding === undefined || encoding === null) {
      return 'utf-8'
    }
    switch(encoding) {
      case 'ascii':
        return 'ascii';
      case 'utf-8':
      case 'utf8':
        return 'utf-8';
      case 'utf161e':
        return 'utf16le';
      default:
        return 'utf-8';
    }
  }
}
