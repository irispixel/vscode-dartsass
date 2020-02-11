// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';
import { Doc } from './doc';
import { Config }  from './config';
import { RestartWatchers } from './watcher';

export let extensionConfig = new common.CompilerConfig();
const pluginName = 'dartsass';

const legacyWatchDirectoryMessage = `
    dartsass.watchDirectories configuration property removed and internally implemented using the Memento API.

    The functionality is still supported though. To have persistent sass watchers, you have have to invoke DartSass: Watch Directory again (one-time only) on directories you wish to watch.

    To prevent this warning from recurring again, you may want to delete this property - dartsass.watchDirectories - locally in your .vscode/settings.json in workspace manually.

    See Issue #21 in the project for more details.
`;


const legacyTargetMinifiedDirectoryMessage = `
    dartsass.targetMinifiedDirectory configuration property removed.

    To prevent this warning from recurring again, you may want to delete this property - dartsass.targetMinifiedDirectory - locally in your .vscode/settings.json in workspace manually.

    See Issue #21 in the project for more details.
`;


export function GetPluginConfiguration(): vscode.WorkspaceConfiguration {
    const configuration = vscode.workspace.getConfiguration(pluginName);
    return configuration;
}

export function VerifyLegacyWatchDir(_log: common.ILog) {
    const configuration = GetPluginConfiguration();
    const legacyWatchDirectories = configuration.get<Array<string>>('watchDirectories', new Array<string>());
    if (legacyWatchDirectories === undefined || legacyWatchDirectories === null) {
        _log.warning(legacyWatchDirectoryMessage);
    }
}

export function VerifyTargetMinifiedDirectory(_log: common.ILog) {
    const configuration = GetPluginConfiguration();
    const targetMinifiedDirectory = configuration.get<string>('targetMinifiedDirectory', '');
    if (targetMinifiedDirectory === undefined || targetMinifiedDirectory === null) {
        _log.warning(legacyTargetMinifiedDirectoryMessage);
    }

}

export function ReloadConfiguration(workspaceState: vscode.Memento, _log: common.ILog) : common.CompilerConfig {
    const configuration = GetPluginConfiguration();
    extensionConfig = Config.extractFrom(configuration, workspaceState);
    RestartWatchers(extensionConfig, _log);
    return extensionConfig;
}


export function StartBuildOnSaveWatcher(subscriptions: vscode.Disposable[], workspaceState: vscode.Memento, _log: common.ILog) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(pluginName)) {
            ReloadConfiguration(workspaceState, _log);
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
