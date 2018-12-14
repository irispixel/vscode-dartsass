'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import sass = require("sass");
import packageImporter = require('node-sass-package-importer');
import { IPackageImporterOptions } from 'node-sass-magic-importer/src/interfaces/IImporterOptions';

export interface CompilerResult {

    onSuccess(): void;

    onFailure(): void;
}

/**
 * Compile a given sass file based on DartSass implementation.
 *
 * More details of the API at -
 * https://github.com/sass/dart-sass/blob/master/README.md#javascript-api .
 */
export class DartSassCompiler {


    constructor() {

    }

    public compileAll() : boolean {
        vscode.window.showInformationMessage('Compile All the files inside the given workspace sass compiler!');
        return false;
    }

    public sayVersion() : string {
        vscode.window.showInformationMessage(`Sass Version to be printed here`);
        return "";
    }

    xformIncludePath(projectRoot: vscode.Uri, includePath: string[]): string[] {
        const output:string[] = [];
        // TODO: For now - it is assumed the URI is a file system
        const basedir = projectRoot.fsPath;
        includePath.forEach(function(entry: string){
            if (path.isAbsolute(entry)) {
                output.push(entry);
                return;
            }
            output.push(path.join(basedir, entry));
        });
        return output;
    }

    public compileDocument(document: vscode.TextDocument, projectRoot: vscode.Uri, configuration: vscode.WorkspaceConfiguration) {
        let includePath: string[] = [];
        if (configuration.has('includePath')) {
            includePath = configuration.get<string[]>('includePath', []);
        }
        const xformedIncludePath = this.xformIncludePath(projectRoot, includePath);
        this.compile(document.fileName, projectRoot.fsPath, xformedIncludePath);
    }

    handleSassOutput(err: sass.SassException, result: sass.Result, output: string, compilerResult: CompilerResult): void {
        if (err) {
            const fileonly = path.basename(err.file);
            const formattedMessage = ` ${err.line}:${err.column} ${err.formatted}`;
            vscode.window.showErrorMessage(`Error compiling scss file ${fileonly}: ${formattedMessage}`);
            console.error(`${err.file}:${formattedMessage}`);
            compilerResult.onFailure();
            return;
        }
        fs.writeFile(output, result.css, (err) => {
            if (err) {
                vscode.window.showErrorMessage('Error while writing to css file');
                console.error(err);
                compilerResult.onFailure();
                return;
            }
            compilerResult.onSuccess();
        });
    }

    compileToFile(input: string, compressed: boolean, output: string,
        options: IPackageImporterOptions,
        includePaths: string[], compilerResult: CompilerResult) {
        const self = this;
        sass.render({
            file: input,
            importer: packageImporter(options),
            includePaths: includePaths,
            outputStyle: compressed ? 'compressed': 'expanded'
        }, function (err: sass.SassException, result: sass.Result) {
            self.handleSassOutput(err, result, output, compilerResult);
        });
    }

    getOptions(cwd: string) : IPackageImporterOptions {
        const options = {
            cwd: cwd,
            packageKeys: [
              'sass',
              'scss',
              'style',
              'css',
              'main.sass',
              'main.scss',
              'main.style',
              'main.css',
              'main'
            ],
            packagePrefix: '~'
          };
        return options;
    }
    public compile(input: string, cwd: string, includePaths: string[]) {
        const filedir = path.dirname(input);
        const fileonly = path.basename(input, '.scss');
        const output = path.join(filedir, fileonly + '.css');
        const compressedOutput = path.join(filedir, fileonly + '.min.css');
        const self = this;
        const options = this.getOptions(cwd);
        const compilerResult:CompilerResult = {
            onFailure() {

            },
            onSuccess() {
                console.log(`Compiled ${input} to ${output}`);
                const tmpResult :CompilerResult = {
                    onFailure() {

                    },
                    onSuccess() {
                        console.log(`Compiled ${input} to ${compressedOutput}`);
                    }
                };
                self.compileToFile(input, true, compressedOutput, options, includePaths, tmpResult);
            }
        };
        this.compileToFile(input, false, output, options, includePaths, compilerResult);
    }

}
