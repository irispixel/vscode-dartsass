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
    console.log('Congratulations, your extension "quiksass" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommands(context.subscriptions, sassCompiler);
    startBuildOnSaveWatcher(context.subscriptions);
}

function registerCommands(subscriptions: vscode.Disposable[], compiler :ISassCompiler) {
    subscriptions.push(vscode.commands.registerCommand('quiksass.saySassVersion', compiler.sayVersion));
    subscriptions.push(vscode.commands.registerCommand('quiksass.compileAll', () => {
        const projectRoot = getProjectRoot();
        if (!projectRoot) {
            return;
        }
        compiler.compileAll(projectRoot);
    }));

}

function getProjectRoot() : (vscode.Uri| undefined) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    return workspaceFolders[0].uri;
}

function loadConfiguration() : CompilerConfig {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return defaultConfig;
    }
    const configuration = vscode.workspace.getConfiguration(pluginName);
    const quiksassConfig = CompilerConfig.extractFrom(projectRoot, configuration);
    if (quiksassConfig.debug) {
        console.log("Scss working directory " + quiksassConfig.sassWorkingDirectory);
        console.log("include path");
        console.log(quiksassConfig.includePath);
    }
    return quiksassConfig;
}

function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[]) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            const quiksassConfig = loadConfiguration();
            if (quiksassConfig.debug) {
                console.log("Configuration changed for " + pluginName);
            }
        }
    });
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		if (document.languageId !== 'scss') {
			return;
        }
        let workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }
        const quiksassConfig = loadConfiguration();
        sassCompiler.compileDocument(document, quiksassConfig);
	}, null, subscriptions);
}


// this method is called when your extension is deactivated
export function deactivate() {
}