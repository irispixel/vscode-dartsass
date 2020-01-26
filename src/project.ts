// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import {Doc} from './doc';

export function GetActiveProjectRoot() {
    var editor = vscode.window.activeTextEditor;
    var projectRoot = "";
    if (editor && typeof editor !== 'undefined') {
        projectRoot = new Doc(editor.document).getProjectRoot();
    }
    return projectRoot;
}

export function PersistWatchers(conf: vscode.WorkspaceConfiguration, watchDirectories: Array<string>, _log: common.ILog) {
    // vscode.ConfigurationTarget.WorkspaceFolder
    conf.update("watchDirectories", watchDirectories, false).then(
        value => {
            _log.appendLine(`Updated watchDirectories to ${watchDirectories}`);
        },
        err => {
            vscode.window.showErrorMessage(`Failed to update watchDirectories ${err}`);
        }
    );
}
