// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

function xformPathFromRoot(projectRoot: vscode.Uri, entry: string): string {
    // TODO: For now - it is assumed the URI is a file system
    if (path.isAbsolute(entry)) {
        return entry;
    }
    const basedir = projectRoot.fsPath;
    return path.join(basedir, entry);
}

function xformPathsFromRoot(projectRoot: vscode.Uri, includePath: Array<string>): Array<string> {
    // TODO: For now - it is assumed the URI is a file system
    const output:Array<string> = new Array<string>();
    includePath.forEach(function(entry: string) {
        output.push(xformPathFromRoot(projectRoot, entry));
    });
    return output;
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

export function xformPath(docUri: vscode.Uri, entry: string): string {
    const projectRoot = getProjectRoot(docUri);
    if (!projectRoot) {
        return entry;
    }
    return xformPathFromRoot(projectRoot, entry);
}

export function xformPaths(docUri: vscode.Uri, includePath: Array<string>): Array<string> {
    const projectRoot = getProjectRoot(docUri);
    if (!projectRoot) {
        return includePath;
    }
    return xformPathsFromRoot(projectRoot, includePath);
}