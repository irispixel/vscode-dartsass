// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';

export class Config {

    public static extractFrom(configuration: vscode.WorkspaceConfiguration) : common.CompilerConfig {
        const config = new common.CompilerConfig();
        config.includePath = configuration.get<Array<string>>('includePath', new Array<string>());
        config.sassWorkingDirectory = configuration.get<string>('sassWorkingDirectory', '');
        config.disableMinifiedFileGeneration = configuration.get<boolean>('disableMinifiedFileGeneration', false);
        config.debug = configuration.get<boolean>('debug', false);
        config.sync = configuration.get<boolean>('sync', false);
        config.disableCompileOnSave = configuration.get<boolean>('disableCompileOnSave', false);
        config.pauseInterval = configuration.get<number>('pauseInterval', 10);
        config.enableStartWithUnderscores = configuration.get<boolean>('enableStartWithUnderscores', false);
        config.disableAutoPrefixer = configuration.get<boolean>('disableAutoPrefixer', false);
        config.autoPrefixBrowsersList = configuration.get<Array<string>>('autoPrefixBrowsersList', new Array<string>("last 2 version"));
        return config;
    }
}