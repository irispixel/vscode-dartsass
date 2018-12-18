// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
import * as vscode from 'vscode';
import { CompilerConfig } from './config';

export interface ISassCompiler {

    sayVersion() : string;

    compileAll(projectRoot: vscode.Uri, _channel: vscode.OutputChannel) : boolean;

    compileDocument(document: vscode.TextDocument, quiksassConfig: CompilerConfig, _channel: vscode.OutputChannel) : void;

}