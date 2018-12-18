// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as path from 'path';


export class CompilerConfig {

    includePath: Array<string> = [];

    sassWorkingDirectory: string = "";

    disableMinifiedFileGeneration: boolean = false;

    debug: boolean = false;

    static xformPath(projectRoot: vscode.Uri, entry: string): string {
        // TODO: For now - it is assumed the URI is a file system
        if (path.isAbsolute(entry)) {
            return entry;
        }
        const basedir = projectRoot.fsPath;
        return path.join(basedir, entry);
    }

    static xformPaths(projectRoot: vscode.Uri, includePath: Array<string>): Array<string> {
        const output:Array<string> = new Array<string>();
        const self = this;
        includePath.forEach(function(entry: string) {
            output.push(self.xformPath(projectRoot, entry));
        });
        return output;
    }


    public static extractFrom(projectRoot: vscode.Uri, configuration: vscode.WorkspaceConfiguration) : CompilerConfig {
        const includePath = configuration.get<Array<string>>('includePath', new Array<string>());
        const config = new CompilerConfig();
        config.includePath = this.xformPaths(projectRoot, includePath);
        // TODO: For now - it is assumed the URI is a file system
        const sassWorkingDirectory = configuration.get<string>('sassWorkingDirectory', projectRoot.fsPath);
        config.sassWorkingDirectory = this.xformPath(projectRoot, sassWorkingDirectory);
        config.disableMinifiedFileGeneration = configuration.get<boolean>('disableMinifiedFileGeneration', false);
        config.debug = configuration.get<boolean>('debug', false);
        console.log()
        return config;
    }
}