// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { GetProjectRoot } from './doc';
import { myStatusBarItem } from './statusbar';
import  { GetActiveProjectRoot, PersistWatchers } from './project';

const watcher = new common.Watcher();


function updateStatusBar(watcher: common.Watcher) {
    const watchList: Map<string, Array<number>> = watcher.GetWatchList();
    const numWatchers: number = watchList.size;
    if (numWatchers > 0) {
        myStatusBarItem.text = `Sass Watchers: ${numWatchers}`;
        myStatusBarItem.show();
    } else {
        myStatusBarItem.text = `Sass Watchers: 0`;
        myStatusBarItem.hide();
    }
}

export function WatchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, workspaceState: vscode.Memento, vsconf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    const uri = GetProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    const srcdir =  common.xformPath(projectRoot, _srcdir.fsPath);
    common.watchDirectory(srcdir, config).then(
        (value:boolean) => {
            if (value) {
                vscode.window.showInformationMessage(`About to watch directory ${srcdir}`);
                PersistWatchers(workspaceState, config.watchDirectories, _log);
                RestartWatchers(config, _log);
            } else {
                vscode.window.showInformationMessage(`${srcdir} already being watched earlier`);
            }
        },
        err => {
            vscode.window.showErrorMessage(`${err}`);
        }
    );
}

export function UnwatchDirectory(_srcdir: vscode.Uri, config: common.CompilerConfig, workspaceState: vscode.Memento, vsconf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    const uri = GetProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    const srcdir =  common.xformPath(projectRoot, _srcdir.fsPath);
    common.unwatchDirectory(srcdir, config).then(
        value => {
            PersistWatchers(workspaceState, config.watchDirectories, _log);
            if (!watcher.ClearWatch(_srcdir.fsPath, projectRoot, _log)) {
                vscode.window.showWarningMessage(`Unable to clear watch for directory ${_srcdir.fsPath}.`);
            } else {
                vscode.window.showInformationMessage(`Directory ${_srcdir.fsPath} unwatched now.`);
            }
            updateStatusBar(watcher);
        },
        err => {
            vscode.window.showInformationMessage(`${err}`);
        }
    );
}

export function ListWatchers(_log: common.ILog) {
    const watchList: Map<string, Array<number>> = watcher.GetWatchList();
    if (watchList.size > 0) {
        _log.appendLine(`******************* ${watchList.size} watchers begin *********`);
        watchList.forEach((pids: Array<number>, key: string) => {
            _log.appendLine(`${key} -> ${pids} ( pid )`);
        });
        _log.appendLine(`******************* ${watchList.size} watchers *********`);
        vscode.window.showInformationMessage(`Having ${watchList.size} watchers. Check "Output" -> "DartJS Sass" for more details.`);
    } else {
        vscode.window.showInformationMessage(`No watchers defined.`);
    }
}


export function ClearAllWatchers(_log: common.ILog) {
    if (watcher.GetWatchList().size > 0) {
        vscode.window.showInformationMessage(`Clearing ${watcher.GetWatchList().size} sass watchers`);
        watcher.ClearAll(_log);
        updateStatusBar(watcher);
    }
}

export function RestartWatchers(extensionConfig: common.CompilerConfig, _log: common.ILog) {
    const projectRoot = GetActiveProjectRoot();
    _log.appendLine(`Configuration reloaded with ${JSON.stringify(extensionConfig)} and projectRoot ${projectRoot}`);
    common.Validate(extensionConfig, projectRoot, _log).then(
        value => {
            if (projectRoot !== null) {
                doRestartWatchers(projectRoot, extensionConfig, _log);
            } else {
                ClearAllWatchers(_log);
            }
        },
        err => {
            ClearAllWatchers(_log);
            vscode.window.showErrorMessage(err);
        }
    );
}

function doRestartWatchers(projectRoot: string, config: common.CompilerConfig, _log: common.ILog) {
    const promises = watcher.Relaunch(projectRoot, config, _log);
    for (const promise of promises) {
        promise.then(
            value => {
                updateStatusBar(watcher);
            },
            err => {
                vscode.window.showErrorMessage(`Relaunch failed: ${err}`);
            }
        );
    }
}

