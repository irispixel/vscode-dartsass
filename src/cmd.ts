// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';
import { extensionConfig as globalConfig  } from './core';
import { watchDirectory, listWatchers } from './watcher';

function cmdWatchDirectory(_srcdir: vscode.Uri, compressed: boolean, config: common.CompilerConfig, _log: common.ILog) {
    watchDirectory(_srcdir, compressed, config, _log);
}

function cmdViewSassWatchers(config: common.CompilerConfig, _log: common.ILog) {
    listWatchers(_log);
}

function cmdWhichPath(config: common.CompilerConfig, _log: common.ILog) {
    common.Which(config, _log).then(
        (value: string) => {
            vscode.window.showInformationMessage(value);
        }
    );
}

function cmdSayVersion(config: common.CompilerConfig, _log: common.ILog) {
    common.SayVersion(config, _log).then(
        value => {
            vscode.window.showInformationMessage(value);
        }
    );
}

function cmdCompileCurrentFile(config: common.CompilerConfig,
    _log: common.ILog) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.log(`No workspace folders present to compile scss files`);
        return null;
    }
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        common.CompileCurrentFile(new Doc(editor.document), config,_log).then(
            value => {

            },
            err => {
                vscode.window.showErrorMessage(err);
            }
        );
    } else {
        console.log(`Editor not defined currently`);
    }
}


export function registerCommands(subscriptions: vscode.Disposable[], _log: common.ILog) {
    // _log.appendLine(sassCompiler.sayVersion(_log));
    subscriptions.push(vscode.commands.registerCommand('dartsass.whichSassPath', () => {
        cmdWhichPath(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.saySassVersion', () => {
        cmdSayVersion(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileCurrentFile', () => {
        cmdCompileCurrentFile(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.watchDir', (_srcdir: vscode.Uri) => {
        cmdWatchDirectory(_srcdir, false, globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.watchDirCompressed', (_srcdir: vscode.Uri) => {
        cmdWatchDirectory(_srcdir, true, globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.viewSassWatchers', () => {
        cmdViewSassWatchers(globalConfig, _log);
    }));
}
