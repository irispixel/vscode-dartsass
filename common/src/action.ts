// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { CompilerConfig } from "./config";
import { Log } from "./log";
import { IDocument } from "./document";
import { validateDocument } from "./validate";
import { validateTargetDirectories } from "./target";
import { getCurrentCompiler } from "./select";

export async function CompileCurrentFile(
  document: IDocument,
  extensionConfig: CompilerConfig
): Promise<string> {
  if (!validateDocument(document, extensionConfig)) {
    return "";
  }
  const err = validateTargetDirectories(document, extensionConfig);
  if (err) {
    throw new Error('${err}');
  }
  Log.debug(`About to compile current file: ${document.getFileName()}`);
  return getCurrentCompiler(extensionConfig).compileDocument(
    document,
    extensionConfig
  );
}

export function SayVersion(
  extensionConfig: CompilerConfig,
  projectRoot: string
): Promise<string> {
  return getCurrentCompiler(extensionConfig).sayVersion(
    extensionConfig,
    projectRoot
  );
}

export function Validate(
  extensionConfig: CompilerConfig,
  projectRoot: string
): Promise<string> {
  return getCurrentCompiler(extensionConfig).validate(
    extensionConfig,
    projectRoot
  );
}
