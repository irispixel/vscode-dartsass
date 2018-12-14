'use strict';
import * as vscode from 'vscode';

export interface SassCompiler {

    sayVersion() : string;

    compileAll() : boolean;

    compileDocument(document: vscode.TextDocument, projectRoot: vscode.Uri, configuration: vscode.WorkspaceConfiguration) : void;

}