// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
import * as vscode from 'vscode';

export interface ISassCompiler {

    sayVersion() : string;

    compileAll(projectRoot: vscode.Uri) : boolean;

    compileDocument(document: vscode.TextDocument, projectRoot: vscode.Uri, configuration: vscode.WorkspaceConfiguration) : void;

}