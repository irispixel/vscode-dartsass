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
let defaultConfig = new CompilerConfig();
const pluginName = 'quiksass';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const _channel = vscode.window.createOutputChannel(pluginName);
    context.subscriptions.push(_channel);

    _channel.appendLine('Congratulations, your extension "quiksass" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommands(context.subscriptions, sassCompiler, _channel);
    startBuildOnSaveWatcher(context.subscriptions, _channel);
}

function registerCommands(subscriptions: vscode.Disposable[], compiler :ISassCompiler, _channel: vscode.OutputChannel) {
    subscriptions.push(vscode.commands.registerCommand('quiksass.saySassVersion', compiler.sayVersion));
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
}

function getProjectRoot(documentUri: (vscode.Uri|null)) : (vscode.Uri| null) {
    if (documentUri) {
        let thisFolder = vscode.workspace.getWorkspaceFolder(documentUri);
        if (thisFolder) {
            return thisFolder.uri;
        }
    }
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return null;
    }
    return workspaceFolders[0].uri;
}

function loadConfiguration(_channel: vscode.OutputChannel, documentUri: (vscode.Uri | null)) : CompilerConfig {
    const projectRoot = getProjectRoot(documentUri);
    if (!projectRoot) {
        return defaultConfig;
    }
    const configuration = vscode.workspace.getConfiguration(pluginName);
    const quiksassConfig = CompilerConfig.extractFrom(projectRoot, configuration);
    if (quiksassConfig.debug) {
        _channel.appendLine("Scss working directory " + quiksassConfig.sassWorkingDirectory);
        _channel.appendLine("include path");
        _channel.appendLine(quiksassConfig.includePath.join(","));
    }
    return quiksassConfig;
}

function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[], _channel: vscode.OutputChannel) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            const quiksassConfig = loadConfiguration(_channel, null);
            if (quiksassConfig.debug) {
                console.log("Configuration changed for " + pluginName);
            }
        }
    });
    vscode.workspace.onDidChangeWorkspaceFolders((e: vscode.WorkspaceFoldersChangeEvent) => {
        console.log(e);
    });
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		if (document.languageId !== 'scss') {
			return;
        }
        const quiksassConfig = loadConfiguration(_channel, document.uri);
        sassCompiler.compileDocument(document, quiksassConfig, _channel);
	}, null, subscriptions);
}


// this method is called when your extension is deactivated
export function deactivate() {
}