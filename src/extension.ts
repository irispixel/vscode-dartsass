// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ISassCompiler, compileCurrentFile } from './compiler';
import { DartSassCompiler } from './dartsasscompiler';
import { CompilerConfig } from './config';
import { registerCommands } from './cmd';

let sassCompiler: ISassCompiler = new DartSassCompiler();
let extensionConfig = new CompilerConfig();
const pluginName = 'quiksass';
let _channel: (vscode.OutputChannel|null) = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    _channel = vscode.window.createOutputChannel(pluginName);
    context.subscriptions.push(_channel);
    _channel.appendLine('Extension "quiksass" activated now!');
    reloadConfiguration(_channel);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommands(sassCompiler, extensionConfig, context.subscriptions, _channel);
    startBuildOnSaveWatcher(context.subscriptions, _channel);
}

function reloadConfiguration(_channel: vscode.OutputChannel) : void {
    const configuration = vscode.workspace.getConfiguration(pluginName);
    extensionConfig = CompilerConfig.extractFrom(configuration);
    _channel.appendLine(`Configuration reloaded with ${JSON.stringify(extensionConfig)}`);
}


function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[], _channel: vscode.OutputChannel) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            reloadConfiguration(_channel);
        }
    });
    vscode.workspace.onDidChangeWorkspaceFolders((e: vscode.WorkspaceFoldersChangeEvent) => {
        console.log(e);
    });
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (!extensionConfig.disableCompileOnSave) {
            compileCurrentFile(sassCompiler, document, extensionConfig, _channel, false);
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