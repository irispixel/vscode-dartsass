// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import { CmdViewSassWatchers } from './cmd';

export let myStatusBarItem: vscode.StatusBarItem;

export function getStatusBarItems(): vscode.Disposable[] {
    const disposables = new Array<vscode.Disposable>();
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = CmdViewSassWatchers;
    disposables.push(myStatusBarItem);
    return disposables;
}
