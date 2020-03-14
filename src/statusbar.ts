// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';

export let myStatusBarItem: vscode.StatusBarItem;

export function getStatusBarItems(viewWatchersCmd: string): vscode.Disposable[] {
    const disposables = new Array<vscode.Disposable>();
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = viewWatchersCmd;
    disposables.push(myStatusBarItem);
    return disposables;
}
