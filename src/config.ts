// Copyright (c) 2018-19 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';


export class CompilerConfig {

    includePath: Array<string> = [];

    sassWorkingDirectory: string = "";

    disableMinifiedFileGeneration: boolean = false;

    debug: boolean = false;

    sync: boolean = false;

    disableCompileOnSave: boolean = false;

    pauseInterval: number = 10;

    public static extractFrom(configuration: vscode.WorkspaceConfiguration) : CompilerConfig {
        const config = new CompilerConfig();
        config.includePath = configuration.get<Array<string>>('includePath', new Array<string>());
        config.sassWorkingDirectory = configuration.get<string>('sassWorkingDirectory', '');
        config.disableMinifiedFileGeneration = configuration.get<boolean>('disableMinifiedFileGeneration', false);
        config.debug = configuration.get<boolean>('debug', false);
        config.sync = configuration.get<boolean>('sync', false);
        config.disableCompileOnSave = configuration.get<boolean>('disableCompileOnSave', false);
        config.pauseInterval = configuration.get<number>('pauseInterval', 10);
        return config;
    }
}