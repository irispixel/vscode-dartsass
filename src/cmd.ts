// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as vscode from 'vscode';
import { ISassCompiler, compileCurrentFile } from './compiler';
import { CompilerConfig } from './config';



export function cmdSayVersion(sassCompiler: ISassCompiler, _channel: vscode.OutputChannel) {
    sassCompiler.sayVersion(_channel);
}

export function cmdCompileAll(sassCompiler: ISassCompiler, _channel: vscode.OutputChannel) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage(`No workspace folders present to compile scss files`);
        return null;
    }
    workspaceFolders.forEach(
        (folder:vscode.WorkspaceFolder) => {
            sassCompiler.compileAll(folder.uri, _channel);
        }
    );
}


export function cmdCompileCurrentFile(sassCompiler: ISassCompiler, extensionConfig: CompilerConfig,
    _channel: vscode.OutputChannel) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.log(`No workspace folders present to compile scss files`);
        return null;
    }
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        compileCurrentFile(sassCompiler, editor.document, extensionConfig,_channel, true);
    } else {
        console.log(`Editor not defined currently`);
    }
}


export function registerCommands(sassCompiler: ISassCompiler,
    extensionConfig: CompilerConfig,
    subscriptions: vscode.Disposable[], _channel: vscode.OutputChannel) {
    subscriptions.push(vscode.commands.registerCommand('quiksass.saySassVersion', () => {
        cmdSayVersion(sassCompiler, _channel);
    }));
    subscriptions.push(vscode.commands.registerCommand('quiksass.compileAll', () => {
        cmdCompileAll(sassCompiler, _channel);
    }));
    subscriptions.push(vscode.commands.registerCommand('quiksass.compileCurrentFile', () => {
        cmdCompileCurrentFile(sassCompiler, extensionConfig, _channel);
    }));
}

