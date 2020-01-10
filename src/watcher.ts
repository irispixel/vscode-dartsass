// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { getProjectRoot } from './doc';
import { myStatusBarItem } from './statusbar';
import  { getActiveProjectRoot } from './project';

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

export function restoreWatchers(config: common.CompilerConfig, _log: common.ILog) {
    const projectRoot = getActiveProjectRoot();
    if (config.watchDirectories.length === 0) {
        return;
    }
    for (const watchDir of config.watchDirectories) {
        watcher.Watch(watchDir, projectRoot, config, _log).then(
            value => {
                vscode.window.showInformationMessage(`Watching Directory ${watchDir}`);
                updateStatusBar(watcher);
            },
            err => {
                vscode.window.showErrorMessage(`${err}`);
            }
        );
    }

}

export function unwatchDirectory(_srcdir: vscode.Uri, _log: common.ILog) {
    const uri = getProjectRoot(_srcdir);
    if (!uri) {
        return "";
    }
    const projectRoot = uri.fsPath;
    if (!watcher.ClearWatch(_srcdir.fsPath, projectRoot, _log)) {
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
        _log.appendLine(`******************* ${watchList.size} watchers *********`);
        vscode.window.showInformationMessage(`Having ${watchList.size} watchers. Check "Output" -> "DartJS Sass" for more details.`);
    } else {
        vscode.window.showInformationMessage(`No watchers defined.`);
    }
}


export function stopWatching(_srcdir: string, _log: common.ILog) {
    watcher.ClearWatchDirectory(_srcdir, _log);
}

export function persistWatchers(conf: vscode.WorkspaceConfiguration, _log: common.ILog) {
    if (watcher.GetWatchList().size > 0) {
        vscode.window.showInformationMessage(`Persisting ${watcher.GetWatchList().size} sass watchers`);
        const watchDirectories = new Array<string>();
        watcher.GetWatchList().forEach((value: number, key: string) => {
            watchDirectories.push(key);
        });
        _log.appendLine(`Persisting ${watchDirectories}`);
        conf.update("watchDirectories", watchDirectories, false).then(
            value => {
                console.log(`Updated watchDirectories to ${watchDirectories}`);
            },
            err => {
                vscode.window.showErrorMessage(`Failed to update value ${err}`);
            }
        );
    }
}

export function clearAllWatchers(_log: common.ILog) {
    if (watcher.GetWatchList().size > 0) {
        vscode.window.showInformationMessage(`Clearing ${watcher.GetWatchList().size} sass watchers`);
        watcher.ClearAll(_log);
    }

}

export function relaunch(projectRoot: string, config: common.CompilerConfig, _log: common.ILog) {
    watcher.Relaunch(projectRoot, config, _log);
}