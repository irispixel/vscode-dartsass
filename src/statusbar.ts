// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';

let myStatusBarItem: vscode.StatusBarItem;

export function createStatusBarItem(subscriptions: vscode.Disposable[], viewWatchersCmd: string) {
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = viewWatchersCmd;
	subscriptions.push(myStatusBarItem);
}

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