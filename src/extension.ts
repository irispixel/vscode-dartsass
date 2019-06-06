// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ISassCompiler } from './compiler';
import { DartSassCompiler } from './dartsasscompiler';
import { CompilerConfig } from './config';

let sassCompiler: ISassCompiler = new DartSassCompiler();
let extensionConfig = new CompilerConfig();
const pluginName = 'quiksass';
let _channel: (vscode.OutputChannel|null) = null;
let lastCompiledTime = Date.now() - 100 * 1000;

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
    registerCommands(context.subscriptions, sassCompiler, _channel);
    startBuildOnSaveWatcher(context.subscriptions, _channel);
}

function registerCommands(subscriptions: vscode.Disposable[], compiler :ISassCompiler, _channel: vscode.OutputChannel) {
    subscriptions.push(vscode.commands.registerCommand('quiksass.saySassVersion', () => {
        compiler.sayVersion(_channel);
    }));
    subscriptions.push(vscode.commands.registerCommand('quiksass.compileAll', () => {
        let workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage(`No workspace folders present to compile scss files`);
            return null;
        }
        workspaceFolders.forEach(
            (folder:vscode.WorkspaceFolder) => {
                compiler.compileAll(folder.uri, _channel);
            }
        );
    }));
    subscriptions.push(vscode.commands.registerCommand('quiksass.compileCurrentFile', () => {
        let workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            console.log(`No workspace folders present to compile scss files`);
            return null;
        }
        var editor = vscode.window.activeTextEditor;
        if (editor && typeof editor !== 'undefined') {
            compileCurrentFile(editor.document, _channel, true);
        } else {
            console.log(`Editor not defined currently`);
        }
    }));
}

function reloadConfiguration(_channel: vscode.OutputChannel) : void {
    const configuration = vscode.workspace.getConfiguration(pluginName);
    extensionConfig = CompilerConfig.extractFrom(configuration);
    _channel.appendLine(`Configuration reloaded with ${extensionConfig}`);
}

function isTooSoon(pauseInterval: number) {
    const now = Date.now();
    return (now - lastCompiledTime) < (pauseInterval * 1000);
}

function compileCurrentFile(document: vscode.TextDocument, _channel: vscode.OutputChannel, compileSingleFile: boolean) {
    if (document.languageId !== 'scss' && document.languageId !== 'sass') {
        return;
    }
    if (isTooSoon(extensionConfig.pauseInterval)) {
        if (extensionConfig.debug) {
            _channel.appendLine(`Last Compiled Time at ${lastCompiledTime}. Compiling too soon and ignoring hence`);
        }
    } else {
        sassCompiler.compileDocument(document, extensionConfig, compileSingleFile, _channel);
        lastCompiledTime = Date.now();
    }
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
            compileCurrentFile(document, _channel, false);
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