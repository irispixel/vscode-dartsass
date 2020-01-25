// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as vscode from 'vscode';
import * as path from 'path';

function getFileName(document: vscode.TextDocument) {
    if (document.languageId === 'scss') {
        return  path.basename(document.fileName, '.scss');
    } else if (document.languageId === 'sass') {
        return  path.basename(document.fileName, '.sass');
    } else {
        return "";
    }
}

export function GetProjectRoot(documentUri: (vscode.Uri|null)) : (vscode.Uri| null) {
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


export class Doc {

    document: vscode.TextDocument;

    constructor(document: vscode.TextDocument) {
        this.document = document;
    }

    isSass(): boolean {
        return this.document.languageId === 'scss' || this.document.languageId === 'sass';
    }

    getFileName(): string {
        return this.document.fileName;
    }

    getFileOnly(): string {
        return getFileName(this.document);
    }

    getProjectRoot(): string {
        const uri = GetProjectRoot(this.document.uri);
        if (!uri) {
            return "";
        }
        return uri.fsPath;
    }

}

