// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerCommands } from './cmd';
import { createLog } from './log';
import { reloadConfiguration, startBuildOnSaveWatcher } from './core';
import { createStatusBarItem } from './statusbar';

let _channel: (vscode.OutputChannel|null) = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    _channel = vscode.window.createOutputChannel('DartJS Sass');
    context.subscriptions.push(_channel);
    _channel.appendLine('Extension "dartsass" activated now!');


    const _log = createLog(_channel);
    reloadConfiguration(_log);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommands(context.subscriptions, _log);
    createStatusBarItem(context.subscriptions, 'dartsass.viewSassWatchers');
    startBuildOnSaveWatcher(context.subscriptions, _log);
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (_channel) {
        console.log("Disposing channel");
        _channel.clear();
        _channel.dispose();
    }
}