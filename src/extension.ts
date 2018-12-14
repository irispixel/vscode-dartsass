'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { SassCompiler } from './compiler';
import { DartSassCompiler } from './dartsasscompiler';

let sassCompiler: SassCompiler = new DartSassCompiler();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sasscodeplugin" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand('sasscodeplugin.saySassVersion', sassCompiler.sayVersion));
    context.subscriptions.push(vscode.commands.registerCommand('sasscodeplugin.compileAll', sassCompiler.compileAll));
    startBuildOnSaveWatcher(context.subscriptions);
}

function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[]) {
	vscode.workspace.onDidSaveTextDocument(document => {
		if (document.languageId !== 'scss') {
			return;
		}
        sassCompiler.compileDocument(document, vscode.workspace.getConfiguration('scss', document.uri));
	}, null, subscriptions);
}


// this method is called when your extension is deactivated
export function deactivate() {
}