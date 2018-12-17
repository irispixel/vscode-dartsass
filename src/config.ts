// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as path from 'path';


export class CompilerConfig {

    includePath: string[] = [];

    sassWorkingDirectory: string = "";

    disableMinifiedFileGeneration: boolean = false;

    static xformPath(projectRoot: vscode.Uri, entry: string): string {
        // TODO: For now - it is assumed the URI is a file system
        if (path.isAbsolute(entry)) {
            return entry;
        }
        const basedir = projectRoot.fsPath;
        return path.join(basedir, entry);
    }

    static xformPaths(projectRoot: vscode.Uri, includePath: string[]): string[] {
        const output:string[] = [];
        const self = this;
        includePath.forEach(function(entry: string){
            output.push(self.xformPath(projectRoot, entry));
        });
        return output;
    }


    public static extractFrom(projectRoot: vscode.Uri, configuration: vscode.WorkspaceConfiguration) : CompilerConfig {
        let includePath: string[] = [];
        if (configuration.has('includePath')) {
            includePath = configuration.get<string[]>('includePath', []);
        }
        const config = new CompilerConfig();
        config.includePath = this.xformPaths(projectRoot, includePath);
        // TODO: For now - it is assumed the URI is a file system
        const sassWorkingDirectory = configuration.get<string>('sassWorkingDirectory', projectRoot.fsPath);
        config.sassWorkingDirectory = this.xformPath(projectRoot, sassWorkingDirectory);
        config.disableMinifiedFileGeneration = configuration.get<boolean>('disableMinifiedFileGeneration', false);
        return config;
    }
}