// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import * as vscode from 'vscode';
import { xformPathsFromRoot, Uri } from './uri';
import { FsUri } from './fsuri';

let uri: Uri = new FsUri();
// TODO: For now - it is assumed the URI is a file system


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
    return uri.xformPathFromRoot(projectRoot, entry);
}

export function xformPaths(docUri: vscode.Uri, includePath: Array<string>): Array<string> {
    const projectRoot = getProjectRoot(docUri);
    if (!projectRoot) {
        return includePath;
    }
    return xformPathsFromRoot(uri, projectRoot, includePath);
}