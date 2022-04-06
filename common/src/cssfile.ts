// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { Log } from "./log";
import { writeToFile, deleteFile } from "./fileutil";

export interface CSSFile {
  css: string;

  sourceMap: string | null;
}

async function writeSourceMap(
  sourceMapFile: string,
  value: any
): Promise<number> {
  if (value === undefined || value === null) {
    Log.debug(
      `Warning: sourcemap is null. Hence ${sourceMapFile} not being written but deleted`
    );
    deleteFile(sourceMapFile);
    return 0;
  } else {
    return writeToFile(sourceMapFile, value);
  }
}

export async function writeCSSFile(
  filename: string,
  cssfile: CSSFile
): Promise<number> {
  await writeToFile(filename, cssfile.css);
  Log.debug(`wrote raw css to ${filename}`);
  const sourceMapFile = filename + ".map";
  const value = await writeSourceMap(sourceMapFile, cssfile.sourceMap);
  Log.debug(`wrote css.map to ${sourceMapFile}`);
  return value;
}
