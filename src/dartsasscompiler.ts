'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import sass = require("sass");

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
        vscode.window.showInformationMessage('Print the version of sass npm package used!');
        return "";
    }

    public compileDocument(document: vscode.TextDocument, workspaceConfig: vscode.WorkspaceConfiguration) {
        this.compile(document.fileName);
    }

    compileToFile(input: string, compressed: boolean, output: string, compilerResult: CompilerResult) {
        sass.render({
            file: input,
            outputStyle: compressed ? 'compressed': 'expanded'
        }, function (err: sass.SassException, result: sass.Result) {
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
        });
    }

    public compile(input: string) {
        const filedir = path.dirname(input);
        const fileonly = path.basename(input, '.scss');
        const output = path.join(filedir, fileonly + '.css');
        const compressedOutput = path.join(filedir, fileonly + '.min.css');
        const self = this;
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
                self.compileToFile(input, true, compressedOutput, tmpResult);
            }
        };
        this.compileToFile(input, false, output, compilerResult);
    }

}
