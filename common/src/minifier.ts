// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";

import { CSSFile } from "./cssfile";

export interface IMinifier {
  minify(
    src: CSSFile,
    disableSourceMap: boolean,
    comments: Buffer
  ): Promise<CSSFile>;

  minifySync(
    src: CSSFile,
    disableSourceMap: boolean,
    comments: Buffer
  ): CSSFile;
}

export function getSourceMapComment(
  disableSourceMap: boolean,
  mapFile: string
): Buffer {
  if (!disableSourceMap) {
    return Buffer.from("\r\n/*# sourceMappingURL=" + mapFile + " */");
  } else {
    return Buffer.from("");
  }
}
