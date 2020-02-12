// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';
import { Log } from './log';
import { SayVersion,Compile } from './core';
import { WatchDirectory, ListWatchers, UnwatchDirectory, RestartWatchers, ClearAllWatchers } from './watcher';
import { PersistWatchers } from './project';

function cmdWatchDirectory(_srcdir: vscode.Uri, workspaceState: vscode.Memento,  _log: common.ILog) {
    WatchDirectory(_srcdir, workspaceState, _log);
}

function cmdUnwatchDirectory(_srcdir: vscode.Uri, workspaceState: vscode.Memento, _log: common.ILog) {
    UnwatchDirectory(_srcdir, workspaceState, _log);
}

function cmdViewSassWatchers(workspaceState: vscode.Memento, _log: common.ILog) {
    ListWatchers(workspaceState, _log);
}

function cmdClearAllSassWatchers(workspaceState: vscode.Memento, _log: common.ILog) {
    ClearAllWatchers(workspaceState, _log);
    PersistWatchers(workspaceState, [], _log);
}

function cmdRestartWatchers(workspaceState: vscode.Memento, _log: common.ILog) {
    RestartWatchers(workspaceState, _log);
}

function cmdSayVersion(workspaceState: vscode.Memento, _log: Log) {
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        const projectRoot =   new Doc(editor.document).getProjectRoot();
        SayVersion(projectRoot, workspaceState, _log);
    } else {
        vscode.window.showErrorMessage(`No Active Project Found or Editor not defined currently`);
    }
}

function cmdCompileCurrentFile(workspaceState: vscode.Memento, _log: common.ILog) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        console.log(`No workspace folders present to compile scss files`);
        return null;
    }
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        Compile(editor.document, workspaceState, _log);
    } else {
        console.log(`Editor not defined currently`);
    }
}


export function RegisterCommands(subscriptions: vscode.Disposable[], workspaceState: vscode.Memento,_log: Log) {
    subscriptions.push(vscode.commands.registerCommand('dartsass.saySassVersion', () => {
        cmdSayVersion(workspaceState, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileCurrentFile', () => {
        cmdCompileCurrentFile(workspaceState, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.watchDir', (_srcdir: vscode.Uri) => {
        cmdWatchDirectory(_srcdir, workspaceState, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.unwatchDir', (_srcdir: vscode.Uri) => {
        cmdUnwatchDirectory(_srcdir, workspaceState, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.restartWatchers', () => {
        cmdRestartWatchers(workspaceState,  _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.viewSassWatchers', () => {
        cmdViewSassWatchers(workspaceState, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.clearAllWatchers', () => {
        cmdClearAllSassWatchers(workspaceState, _log);
    }));
}
