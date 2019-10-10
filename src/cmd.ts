// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';



function cmdSayVersion(sassCompiler: common.ISassCompiler, _log: common.ILog) {
    vscode.window.showInformationMessage(sassCompiler.sayVersion(_log));
}

function cmdCompileAll(sassCompiler: common.ISassCompiler, _log: common.ILog) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage(`No workspace folders present to compile scss files`);
        return null;
    }
    workspaceFolders.forEach(
        (folder:vscode.WorkspaceFolder) => {
            sassCompiler.compileAll(folder.uri, _log);
        }
    );
}


function cmdCompileCurrentFile(sassCompiler: common.ISassCompiler, extensionConfig: common.CompilerConfig,
    _log: common.ILog) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.log(`No workspace folders present to compile scss files`);
        return null;
    }
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        compileCurrentFile(sassCompiler, editor.document, extensionConfig,_log, true);
    } else {
        console.log(`Editor not defined currently`);
    }
}


export function registerCommands(sassCompiler: common.ISassCompiler,
    extensionConfig: common.CompilerConfig,
    subscriptions: vscode.Disposable[], _log: common.ILog) {
    _log.appendLine(sassCompiler.sayVersion(_log));
    subscriptions.push(vscode.commands.registerCommand('dartsass.saySassVersion', () => {
        cmdSayVersion(sassCompiler, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileAll', () => {
        cmdCompileAll(sassCompiler, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileCurrentFile', () => {
        cmdCompileCurrentFile(sassCompiler, extensionConfig, _log);
    }));
}

