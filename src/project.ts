// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import {Doc} from './doc';

export function getActiveProjectRoot() {
    var editor = vscode.window.activeTextEditor;
    var projectRoot = "";
    if (editor && typeof editor !== 'undefined') {
        projectRoot = new Doc(editor.document).getProjectRoot();
    }
    return projectRoot;
}