// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';

//  MementoKeyWatchDirectories indicates the key to store the memento
export const MementoKeyWatchDirectories = "watchDirectories";

export class Config {

    public static extractFrom(configuration: vscode.WorkspaceConfiguration, workspaceState: vscode.Memento) : common.CompilerConfig {
        const config = new common.CompilerConfig();
        config.includePath = configuration.get<Array<string>>('includePath', new Array<string>());
        config.sassBinPath = configuration.get<string>('sassBinPath', '');
        config.targetDirectory = configuration.get<string>('targetDirectory', '');
        config.disableMinifiedFileGeneration = configuration.get<boolean>('disableMinifiedFileGeneration', false);
        config.disableSourceMap = configuration.get<boolean>('disableSourceMap', false);
        config.debug = configuration.get<boolean>('debug', false);
        config.disableCompileOnSave = configuration.get<boolean>('disableCompileOnSave', false);
        config.pauseInterval = configuration.get<number>('pauseInterval', 10);
        config.enableStartWithUnderscores = configuration.get<boolean>('enableStartWithUnderscores', false);
        config.disableAutoPrefixer = configuration.get<boolean>('disableAutoPrefixer', false);
        config.autoPrefixBrowsersList = configuration.get<Array<string>>('autoPrefixBrowsersList', new Array<string>("> 1%", "last 2 versions"));
        const watchDirectories = workspaceState.get<string[]>(MementoKeyWatchDirectories);
        if (watchDirectories === undefined || watchDirectories === null) {
            config.watchDirectories = [];
        } else {
            config.watchDirectories = watchDirectories;
        }
        return config;
    }
}