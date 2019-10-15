// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';

export let myStatusBarItem: vscode.StatusBarItem;

export function createStatusBarItem(subscriptions: vscode.Disposable[], viewWatchersCmd: string) {
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = viewWatchersCmd;
	subscriptions.push(myStatusBarItem);
}
