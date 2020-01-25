// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';
import { extensionConfig as globalConfig, getPluginConfiguration } from './core';
import { WatchDirectory, listWatchers, UnwatchDirectory, RestartWatchers } from './watcher';


function cmdWatchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, vsconf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    WatchDirectory(_srcdir, config, vsconf, _log);
}

function cmdUnwatchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, vsconf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    UnwatchDirectory(_srcdir, config, vsconf, _log);
}

function cmdViewSassWatchers(config: common.CompilerConfig, _log: common.ILog) {
    listWatchers(_log);
}

function cmdRestartWatchers(config: common.CompilerConfig, _log: common.ILog) {
    RestartWatchers(config, _log);
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


export function registerCommands(subscriptions: vscode.Disposable[], _log: common.ILog) {
    subscriptions.push(vscode.commands.registerCommand('dartsass.saySassVersion', () => {
        cmdSayVersion(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.compileCurrentFile', () => {
        cmdCompileCurrentFile(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.watchDir', (_srcdir: vscode.Uri) => {
        const vsconf = getPluginConfiguration();
        cmdWatchDirectory(_srcdir, globalConfig, vsconf, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.unwatchDir', (_srcdir: vscode.Uri) => {
        const vsconf = getPluginConfiguration();
        cmdUnwatchDirectory(_srcdir, globalConfig, vsconf, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.restartWatchers', () => {
        cmdRestartWatchers(globalConfig, _log);
    }));
    subscriptions.push(vscode.commands.registerCommand('dartsass.viewSassWatchers', () => {
        cmdViewSassWatchers(globalConfig, _log);
    }));
}
