'use strict';
import * as vscode from 'vscode';

export interface SassCompiler {

    sayVersion() : string;

    compileAll() : boolean;

    compileDocument(document: vscode.TextDocument, workspaceConfig: vscode.WorkspaceConfiguration) : void;

}