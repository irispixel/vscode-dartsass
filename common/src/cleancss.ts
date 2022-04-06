// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { CSSFile } from "./cssfile";
import { Log } from "./log";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CleanCSS = require("clean-css");

export class CleanCSSMinifier {
  public async minify(
    src: CSSFile,
    disableSourceMap: boolean,
    comment: Buffer
  ): Promise<CSSFile> {
    return this.minifySync(src, disableSourceMap, comment);
  }

  public minifySync(
    src: CSSFile,
    disableSourceMap: boolean,
    comment: Buffer
  ): CSSFile {
    const cleancss = new CleanCSS({
      sourceMap: !disableSourceMap,
    });
    let data = null;
    if (src.sourceMap !== undefined && src.sourceMap !== null) {
      const jsonSourceMap = JSON.parse(src.sourceMap);
      data = cleancss.minify(src.css, jsonSourceMap);
      Log.debug(`typeof sourcemap : ${typeof data.sourceMap}`);
    } else {
      data = cleancss.minify(src.css);
    }
    return {
      css: data.styles + comment,
      sourceMap: !disableSourceMap
        ? data.sourceMap
          ? JSON.stringify(data.sourceMap)
          : null
        : null,
    };
  }
}
