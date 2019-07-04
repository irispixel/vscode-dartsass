// Copyright (c) 2018-19 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import * as vscode from 'vscode';

export interface Uri {
    xformPathFromRoot(projectRoot: vscode.Uri, entry: string): string;
}

export function xformPathsFromRoot(uri: Uri, projectRoot: vscode.Uri, includePath: Array<string>): Array<string> {
    const output:Array<string> = new Array<string>();
    includePath.forEach(function(entry: string) {
        output.push(uri.xformPathFromRoot(projectRoot, entry));
    });
    return output;
}
