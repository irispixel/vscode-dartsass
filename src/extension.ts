// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { Config }  from './config';
import { registerCommands } from './cmd';
import { Log } from './log';

let sassCompiler: common.ISassCompiler = new common.DartSassCompiler();
let extensionConfig = new common.CompilerConfig();
const pluginName = 'dartsass';
let _channel: (vscode.OutputChannel|null) = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    _channel = vscode.window.createOutputChannel(pluginName);
    context.subscriptions.push(_channel);
    _channel.appendLine('Extension "dartsass" activated now!');


    const _log = getLog(_channel);
    reloadConfiguration(_log);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommands(sassCompiler, extensionConfig, context.subscriptions, _log);
    startBuildOnSaveWatcher(context.subscriptions, _log);
}

function getLog(_channel: vscode.OutputChannel) : common.ILog {
    return new Log(_channel);
}

function reloadConfiguration(_log: common.ILog) : void {
    const configuration = vscode.workspace.getConfiguration(pluginName);
    extensionConfig = Config.extractFrom(configuration);
    _log.appendLine(`Configuration reloaded with ${JSON.stringify(extensionConfig)}`);
}


function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[], _log: common.ILog) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            reloadConfiguration(_log);
        }
    });
    vscode.workspace.onDidChangeWorkspaceFolders((e: vscode.WorkspaceFoldersChangeEvent) => {
        console.log(e);
    });
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (!extensionConfig.disableCompileOnSave) {
            common.compileCurrentFile(sassCompiler, document, extensionConfig, _log, false);
        }
	}, null, subscriptions);
}


// this method is called when your extension is deactivated
export function deactivate() {
    if (_channel) {
        console.log("Disposing channel");
        _channel.clear();
        _channel.dispose();
    }
}