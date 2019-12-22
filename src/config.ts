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
        config.sassBinPath = configuration.get<string>('sassBinPath', '');
        config.targetDirectory = configuration.get<string>('targetDirectory', '');
        config.targetMinifiedDirectory = configuration.get<string>('targetMinifiedDirectory', '');
        config.disableMinifiedFileGeneration = configuration.get<boolean>('disableMinifiedFileGeneration', false);
        config.disableSourceMap = configuration.get<boolean>('disableSourceMap', false);
        config.debug = configuration.get<boolean>('debug', false);
        config.disableCompileOnSave = configuration.get<boolean>('disableCompileOnSave', false);
        config.pauseInterval = configuration.get<number>('pauseInterval', 10);
        config.enableStartWithUnderscores = configuration.get<boolean>('enableStartWithUnderscores', false);
        config.disableAutoPrefixer = configuration.get<boolean>('disableAutoPrefixer', false);
        config.autoPrefixBrowsersList = configuration.get<Array<string>>('autoPrefixBrowsersList', new Array<string>("> 1%", "last 2 versions"));
        return config;
    }
}