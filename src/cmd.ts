// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';
import { extensionConfig as globalConfig, GetPluginConfiguration } from './core';
import { WatchDirectory, ListWatchers, UnwatchDirectory, RestartWatchers, ClearAllWatchers } from './watcher';
import { PersistWatchers } from './project';

function cmdWatchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, workspaceState: vscode.Memento, vsconf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    WatchDirectory(_srcdir, config, workspaceState, vsconf, _log);
}

function cmdUnwatchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, workspaceState: vscode.Memento, vsconf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    UnwatchDirectory(_srcdir, config, workspaceState, vsconf, _log);
}

function cmdViewSassWatchers(config: common.CompilerConfig,  workspaceState: vscode.Memento, _log: common.ILog) {
    ListWatchers(workspaceState, _log);
}

function cmdClearAllSassWatchers(workspaceState: vscode.Memento, _log: common.ILog) {
    ClearAllWatchers(workspaceState, _log);
    PersistWatchers(workspaceState, [], _log);
}

function cmdRestartWatchers(config: common.CompilerConfig, workspaceState: vscode.Memento, _log: common.ILog) {
    RestartWatchers(config, workspaceState, _log);
}

function cmdSayVersion(config: common.CompilerConfig, _log: common.ILog) {
    var editor = vscode.window.activeTextEditor;
    if (editor && typeof editor !== 'undefined') {
        const projectRoot =   new Doc(editor.document).getProjectRoot();
        _log.appendLine(`sayVersion with projectRoot ${projectRoot}`);
        common.SayVersion(config, projectRoot, _log).then(
            value => {
                common.getVersions();
                vscode.window.showInformationMessage(value);
            }
        );
    } else {
        vscode.window.showErrorMessage(`No Active Project Found or Editor not defined currently`);
    }
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


export function RegisterCommands(subscriptions: vscode.Disposable[], workspaceState: vscode.Memento,_log: common.ILog) {
    subscriptions.push(vscode.commands.registerCommand('dartsass.saySassVersion', () => {
        cmdSayVersion(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileCurrentFile', () => {
        cmdCompileCurrentFile(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.watchDir', (_srcdir: vscode.Uri) => {
        const vsconf = GetPluginConfiguration();
        cmdWatchDirectory(_srcdir, globalConfig, workspaceState, vsconf, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.unwatchDir', (_srcdir: vscode.Uri) => {
        const vsconf = GetPluginConfiguration();
        cmdUnwatchDirectory(_srcdir, globalConfig, workspaceState, vsconf, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.restartWatchers', () => {
        cmdRestartWatchers(globalConfig, workspaceState,  _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.viewSassWatchers', () => {
        cmdViewSassWatchers(globalConfig, workspaceState, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.clearAllWatchers', () => {
        cmdClearAllSassWatchers(workspaceState, _log);
    }));
}
