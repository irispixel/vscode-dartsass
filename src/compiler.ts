// Copyright (c) 2018-19 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

import { CompilerConfig } from './config';
let lastCompiledTime = Date.now() - 100 * 1000;

export interface ISassCompiler {

    sayVersion(_channel: vscode.OutputChannel) : string;

    compileAll(projectRoot: vscode.Uri, _channel: vscode.OutputChannel) : boolean;

    compileDocument(document: vscode.TextDocument, dartsassConfig: CompilerConfig, compileSingleFile: boolean, _channel: vscode.OutputChannel) : void;

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
    if (doesStartWithUnderscore(document)) {
        // Ignore the files that start with underscore
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


export function getFileName(document: vscode.TextDocument) {
    if (document.languageId === 'scss') {
        return  path.basename(document.fileName, '.scss');
    } else if (document.languageId === 'sass') {
        return  path.basename(document.fileName, '.sass');
    } else {
        return "";
    }
}

export function doesStartWithUnderscore(document: vscode.TextDocument) {
    const fileOnly = getFileName(document);
    if (fileOnly.length === 0) {
        return true;
    }
    return fileOnly.startsWith("_");
}