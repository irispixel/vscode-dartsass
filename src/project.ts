// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';
import { MementoKeyWatchDirectories } from './config';

export function GetActiveProjectRoot() {
    var editor = vscode.window.activeTextEditor;
    var projectRoot = "";
    if (editor && typeof editor !== 'undefined') {
        projectRoot = new Doc(editor.document).getProjectRoot();
    }
    return projectRoot;
}

export function PersistWatchers(workspaceState: vscode.Memento, watchDirectories: Array<string>, _log: common.ILog) {
    workspaceState.update(MementoKeyWatchDirectories, watchDirectories).then(
        value => {
            _log.debug(`Updated watchDirectories to ${watchDirectories}`);
        },
        err => {
            _log.warning(`Failed to update watchDirectories ${err}`);
            vscode.window.showErrorMessage(`Failed to update watchDirectories ${err}`);
        }
    );
}
