// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";
import * as path from "path";
import { CompilerConfig } from "./config";
import { xformPath } from "./platform";
import { IDocument } from "./document";
import * as fs from "fs";

export const defaultMinCSSExtension = ".min.css";

export function getWatchTargetDirectory(
  srcdir: string,
  config: CompilerConfig
): string {
  let targetDirectory = srcdir;
  if (config.targetDirectory.length > 0) {
    targetDirectory = config.targetDirectory;
  }
  return targetDirectory;
}

export function getRelativeDirectory(
  projectRoot: string,
  srcdir: string
): string {
  if (!path.isAbsolute(srcdir)) {
    return srcdir;
  }
  return path.relative(projectRoot, srcdir);
}

export function inferTargetCSSDirectory(
  document: IDocument,
  config: CompilerConfig
): string {
  let targetDirectory = path.dirname(document.getFileName());
  const projectRoot = document.getProjectRoot();
  if (config.targetDirectory.length > 0) {
    targetDirectory = xformPath(projectRoot, config.targetDirectory);
  }
  return targetDirectory;
}

export function safeMkdir(directory: string) {
  try {
    // https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
    // Since nodejs 10.12.0
    fs.mkdirSync(directory, { recursive: true });
    return null;
  } catch (err) {
    let exc = err as NodeJS.ErrnoException;
    if (exc.code === "EEXIST") {
      return null;
    }
    return err;
  }
}

export function validateTargetDirectories(
  document: IDocument,
  config: CompilerConfig
) {
  const targetCSSDirectory = inferTargetCSSDirectory(document, config);
  const err = safeMkdir(targetCSSDirectory);
  if (err) {
    return err;
  }
  return null;
}

function doGetOutputCSS(document: IDocument, config: CompilerConfig): string {
  const targetDirectory = inferTargetCSSDirectory(document, config);
  const fileonly = document.getFileOnly();
  return path.join(targetDirectory, fileonly + ".css");
}

function doGetOutputMinifiedCSS(
  document: IDocument,
  config: CompilerConfig
): string {
  const targetDirectory = inferTargetCSSDirectory(document, config);
  const fileNameOnly = path.basename(document.getFileName(), ".scss");
  return doGetMinCSS(
    fileNameOnly,
    targetDirectory,
    defaultMinCSSExtension
  );
}
export function getOutputCSS(
  document: IDocument,
  config: CompilerConfig,
  minified: boolean
): string {
  return !minified
    ? doGetOutputCSS(document, config)
    : doGetOutputMinifiedCSS(document, config);
}

function doGetMinCSS(
  fileNameOnly: string,
  dir: string,
  minCSSExtension: string
): string {
  return path.join(dir, fileNameOnly + minCSSExtension);
}

export function getMinCSS(docPath: string, minCSSExtension: string): string {
  const fileNameOnly = path.basename(docPath, ".css");
  return doGetMinCSS(fileNameOnly, path.dirname(docPath), minCSSExtension);
}

export function isMinCSS(docPath: string, minCSSExtension: string): boolean {
  return docPath.endsWith(minCSSExtension);
}

export function isCSSFile(docPath: string): boolean {
  return docPath.endsWith(".css");
}

export function doesContainSpaces(value: string): boolean {
  return value.indexOf(" ") !== -1;
}
