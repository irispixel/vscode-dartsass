// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

export class FsUri {


    public xformPathFromRoot(projectRoot: vscode.Uri, entry: string): string {
        // TODO: For now - it is assumed the URI is a file system
        if (path.isAbsolute(entry)) {
            return entry;
        }
        const basedir = projectRoot.fsPath;
        return path.join(basedir, entry);
    }

}