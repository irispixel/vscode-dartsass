// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";
import * as path from "path";
import browserslist from "browserslist";
import { Info } from "./version";
import { Log } from "./log";
import { CSSFile, writeCSSFile } from "./cssfile";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcss = require("postcss");
import { Warning } from "postcss";
import autoprefixer from "autoprefixer";

function getProcessArgs(to: string, sourceMap: string | null): any {
  if (sourceMap === undefined || sourceMap === null || sourceMap.length === 0) {
    return {
      to: to,
    };
  }
  return {
    to: to,
    map: {
      prev: sourceMap.toString(),
      inline: false,
    },
  };
}

export async function doAutoprefixCSS(
  inputcss: CSSFile,
  output: string,
  disableAutoPrefixer: boolean,
  disableSourceMap: boolean
): Promise<CSSFile> {
  if (disableAutoPrefixer) {
    return inputcss;
  }
  // TODO: autoprefixer preferences have been removed.
  const processor = postcss([autoprefixer()]);
  Log.debug(`Postcss: About to process`);
  const result = await processor.process(
    inputcss.css,
    getProcessArgs(output, inputcss.sourceMap)
  );
  Log.debug(`Postcss: processor.process completed`);
  result.warnings().forEach((warn: Warning[]) => {
    Log.warning(`Autoprefixer: ${warn}`);
  });
  Log.debug(`Typeof result.css ${typeof result.css}`);
  return {
    css: result.css,
    sourceMap: disableSourceMap
      ? null
      : result.map
      ? result.map.toString()
      : null,
  };
}

export async function autoPrefixCSSBytes(
  output: string,
  inFile: CSSFile,
  disableAutoPrefixer: boolean,
  disableSourceMap: boolean
): Promise<number> {
  const cssfile = await doAutoprefixCSS(
    inFile,
    path.basename(output),
    disableAutoPrefixer,
    disableSourceMap
  );
  Log.debug(`doAutoprefixCSS completed to ${output}`);
  const value = await writeCSSFile(output, cssfile);
  Log.debug(`writeCSSFile completed to ${output}`);
  return value;
}

export function getVersions(): Array<string> {
  const result = new Array<string>();

  const postcssInfo = postcss as unknown as Info;
  result.push(`PostCSS: ${postcssInfo.info}`);

  const autoprefixerInfo = autoprefixer as unknown as Info;
  result.push(`autoprefixer: ${autoprefixerInfo.info}`);

  const browserslistInfo = browserslist as unknown as Info;
  result.push(`browserslist: ${browserslistInfo.info}`);

  return result;
}
