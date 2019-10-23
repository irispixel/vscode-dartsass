// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { getProjectRoot } from './doc';
import { myStatusBarItem } from './statusbar';

const watcher = new common.Watcher();


export function updateStatusBar(watcher: common.Watcher) {
    const watchList: Map<string, number> = watcher.GetWatchList();
    const numWatchers: number = watchList.size;
    if (numWatchers > 0) {
        myStatusBarItem.text = `Sass Watchers: ${numWatchers}`;
        myStatusBarItem.show();
    } else {
        myStatusBarItem.hide();
    }
}

export function watchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, _log: common.ILog) {
    const uri = getProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    watcher.Watch(_srcdir.fsPath, projectRoot, config, _log).then(
        value => {
            vscode.window.showInformationMessage(`Watching Directory ${_srcdir.fsPath}`);
            updateStatusBar(watcher);
        },
        err => {
            vscode.window.showErrorMessage(`${err}`);
        }
    );
}

export function unwatchDirectory(_srcdir: vscode.Uri) {
    const uri = getProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    if (!watcher.ClearWatch(_srcdir.fsPath, projectRoot)) {
        vscode.window.showWarningMessage(`Directory ${_srcdir.fsPath} not being watched before.`);
    } else {
        vscode.window.showInformationMessage(`Directory ${_srcdir.fsPath} unwatched now.`);
    }
    updateStatusBar(watcher);
}

export function listWatchers(_log: common.ILog) {
    const watchList: Map<string, number> = watcher.GetWatchList();
    if (watchList.size > 0) {
        _log.appendLine(`Having ${watchList.size} watchers`);
        watchList.forEach((value: number, key: string) => {
            _log.appendLine(`${key} -> ${value} ( pid )`);
        });
        _log.appendLine(`End Of ${watchList.size} watchers`);
        vscode.window.showInformationMessage(`Having ${watchList.size} watchers. Check output for more details.`);
    } else {
        vscode.window.showWarningMessage(`No watchers defined.`);
    }
}


export function stopWatching(_srcdir: string) {
    watcher.ClearWatchDirectory(_srcdir);
}

export function clearAllWatchers() {
    if (watcher.GetWatchList().size > 0) {
        vscode.window.showInformationMessage(`Clearing ${watcher.GetWatchList().size} sass watchers`);
        watcher.ClearAll();
    }

}

export function relaunch(projectRoot: string, config: common.CompilerConfig, _log: common.ILog) {
    watcher.Relaunch(projectRoot, config, _log);
}