// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { getProjectRoot } from './doc';

const watcher = new common.Watcher();

export function watchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, _log: common.ILog) {
    const uri = getProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    watcher.Watch(_srcdir.fsPath, projectRoot, config, _log).then(
        value => {
            vscode.window.showInformationMessage(`Watching Directory ${_srcdir.fsPath} - ${value}`);
        },
        err => {
            vscode.window.showErrorMessage(`${err}`);
        }
    );
}

export function listWatchers() {
    const watchList: Map<string, number> = watcher.GetWatchList();
    vscode.window.showInformationMessage(`Having ${watchList.size} watchers`);
}


export function stopWatching(_srcdir: vscode.Uri) {
    const uri = getProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    watcher.ClearWatch(_srcdir.fsPath, projectRoot);
}