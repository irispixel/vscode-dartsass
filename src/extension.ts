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
let quiksassConfig = new CompilerConfig();
const pluginName = 'quiksass';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "quiksass" is now active!');
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    // TODO: URI is assumed to be file system
    console.log(`Project Root: ${projectRoot.fsPath}`);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('quiksass.saySassVersion', sassCompiler.sayVersion));
    context.subscriptions.push(vscode.commands.registerCommand('quiksass.compileAll', () => {
        sassCompiler.compileAll(projectRoot);
    }));
    startBuildOnSaveWatcher(context.subscriptions);
}

function getProjectRoot() : (vscode.Uri| undefined) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    return workspaceFolders[0].uri;
}

function loadConfiguration(projectRoot: vscode.Uri) {
    const configuration = vscode.workspace.getConfiguration(pluginName);
    quiksassConfig = CompilerConfig.extractFrom(projectRoot, configuration);
    if (quiksassConfig.debug) {
        console.log("Scss working directory " + quiksassConfig.sassWorkingDirectory);
        console.log("include path");
        console.log(quiksassConfig.includePath);
    }
}

function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[]) {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    loadConfiguration(projectRoot);
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            if (quiksassConfig.debug) {
                console.log("Configuration changed for " + pluginName);
            }
            loadConfiguration(projectRoot);
        }
    });
	vscode.workspace.onDidSaveTextDocument(document => {
		if (document.languageId !== 'scss') {
			return;
        }
        sassCompiler.compileDocument(document, quiksassConfig);
	}, null, subscriptions);
}


// this method is called when your extension is deactivated
export function deactivate() {
}