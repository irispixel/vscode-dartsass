// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { Doc } from './doc';
import { Config }  from './config';
import { ClearAllWatchers, RestartWatchers } from './watcher';
import  { getActiveProjectRoot } from './project';

export let extensionConfig = new common.CompilerConfig();
const pluginName = 'dartsass';


export function GetPluginConfiguration(): vscode.WorkspaceConfiguration {
    const configuration = vscode.workspace.getConfiguration(pluginName);
    return configuration;
}

export function ReloadConfiguration(_log: common.ILog) : common.CompilerConfig {
    const configuration = GetPluginConfiguration();
    extensionConfig = Config.extractFrom(configuration);
    const projectRoot = getActiveProjectRoot();
    _log.appendLine(`Configuration reloaded with ${JSON.stringify(extensionConfig)} and projectRoot ${projectRoot}`);
    common.Validate(extensionConfig, projectRoot, _log).then(
        value => {
            RestartWatchers(extensionConfig, _log);
        },
        err => {
            ClearAllWatchers(_log);
            vscode.window.showErrorMessage(err);
        }
    );
    return extensionConfig;
}


export function StartBuildOnSaveWatcher(subscriptions: vscode.Disposable[], _log: common.ILog) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            ReloadConfiguration(_log);
        }
    });
    vscode.workspace.onDidChangeWorkspaceFolders((e: vscode.WorkspaceFoldersChangeEvent) => {
        console.log(e);
    });
	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (!extensionConfig.disableCompileOnSave) {
            common.CompileCurrentFile(new Doc(document), extensionConfig, _log).then(
                value => {

                },
                err => {
                    vscode.window.showErrorMessage(err);
                }
            );
        }
	}, null, subscriptions);
}
