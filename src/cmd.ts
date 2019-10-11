// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';


function cmdSayVersion(extensionConfig: common.CompilerConfig, _log: common.ILog) {
    vscode.window.showInformationMessage(common.SayVersion(extensionConfig, _log));
}

function cmdCompileAll(extensionConfig: common.CompilerConfig, _log: common.ILog) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage(`No workspace folders present to compile scss files`);
        return null;
    }
    workspaceFolders.forEach(
        (folder:vscode.WorkspaceFolder) => {
            common.CompileAll(extensionConfig, folder.uri.fsPath, _log);
        }
    );
}


function cmdCompileCurrentFile(extensionConfig: common.CompilerConfig,
    _log: common.ILog) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.log(`No workspace folders present to compile scss files`);
        return null;
    }
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        common.CompileCurrentFile(new Doc(editor.document), extensionConfig,_log, true);
    } else {
        console.log(`Editor not defined currently`);
    }
}


export function registerCommands(extensionConfig: common.CompilerConfig,
    subscriptions: vscode.Disposable[], _log: common.ILog) {
    // _log.appendLine(sassCompiler.sayVersion(_log));
    subscriptions.push(vscode.commands.registerCommand('dartsass.saySassVersion', () => {
        cmdSayVersion(extensionConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileAll', () => {
        cmdCompileAll(extensionConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileCurrentFile', () => {
        cmdCompileCurrentFile(extensionConfig, _log);
    }));
}

