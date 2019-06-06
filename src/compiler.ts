// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
import * as vscode from 'vscode';
import { CompilerConfig } from './config';
let lastCompiledTime = Date.now() - 100 * 1000;

export interface ISassCompiler {

    sayVersion(_channel: vscode.OutputChannel) : string;

    compileAll(projectRoot: vscode.Uri, _channel: vscode.OutputChannel) : boolean;

    compileDocument(document: vscode.TextDocument, quiksassConfig: CompilerConfig, compileSingleFile: boolean, _channel: vscode.OutputChannel) : void;

}



function isTooSoon(pauseInterval: number) {
    const now = Date.now();
    return (now - lastCompiledTime) < (pauseInterval * 1000);
}

export function compileCurrentFile(compiler: ISassCompiler,
    document: vscode.TextDocument,
    extensionConfig: CompilerConfig,
    _channel: vscode.OutputChannel, compileSingleFile: boolean) {
    if (document.languageId !== 'scss' && document.languageId !== 'sass') {
        return;
    }
    if (isTooSoon(extensionConfig.pauseInterval)) {
        if (extensionConfig.debug) {
            _channel.appendLine(`Last Compiled Time at ${lastCompiledTime}. Compiling too soon and ignoring hence`);
        }
    } else {
        compiler.compileDocument(document, extensionConfig, compileSingleFile, _channel);
        lastCompiledTime = Date.now();
    }
}
