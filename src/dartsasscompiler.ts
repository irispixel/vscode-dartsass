// Copyright (c) 2018 AltosCode, LLC
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import sass = require("sass");
import packageImporter = require('node-sass-package-importer');
import { IPackageImporterOptions } from 'node-sass-magic-importer/src/interfaces/IImporterOptions';
import { CompilerConfig } from './config';

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

    public compileAll(projectRoot: vscode.Uri, _channel: vscode.OutputChannel) : boolean {
        vscode.window.showErrorMessage('Not yet implemented. To Compile All the sass files inside the given workspace');
        return false;
    }

    public sayVersion() : string {
        // TODO: To print sass library version automatically imported from package
        // as opposed to hardcoding it here.
        const version = "1.15.2";
        vscode.window.showInformationMessage(`Uses sass pure Dart/JS compiler: ${version}`);
        return "Uses sass@npm: 1.15.2";
    }

    public compileDocument(document: vscode.TextDocument, quiksassConfig: CompilerConfig, _channel: vscode.OutputChannel) {
        this.compile(document.fileName, quiksassConfig, _channel);
    }

    handleError(err: sass.SassException, config : CompilerConfig, result: sass.Result, compilerResult: CompilerResult,
            _channel: vscode.OutputChannel) {
        const fileonly = path.basename(err.file);
        const formattedMessage = ` ${err.line}:${err.column} ${err.formatted}`;
        vscode.window.showErrorMessage(`Error compiling scss file ${fileonly}: ${formattedMessage}`);
        _channel.appendLine(`Formatted Error: ${err.formatted} running from ${config.sassWorkingDirectory}`);
        compilerResult.onFailure();
    }

    writeSassOutput(result: sass.Result, output: string, compilerResult: CompilerResult) {
        fs.writeFile(output, result.css, (err: NodeJS.ErrnoException) => {
            if (err) {
                vscode.window.showErrorMessage('Error while writing the generated css file');
                console.error(err);
                compilerResult.onFailure();
                return;
            }
            compilerResult.onSuccess();
        });
    }

    compileToFile(input: string, compressed: boolean, output: string,
        config : CompilerConfig,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        const options = this.getOptions(config.sassWorkingDirectory);
        const self = this;
        sass.render({
            file: input,
            importer: packageImporter(options),
            includePaths: config.includePath,
            outputStyle: compressed ? 'compressed': 'expanded',
            outFile: output
        }, function (err: sass.SassException, result: sass.Result) {
            if (err) {
                self.handleError(err, config, result, compilerResult, _channel);
            } else {
                self.writeSassOutput(result, output, compilerResult);
            }
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

    public compile(input: string, config : CompilerConfig, _channel: vscode.OutputChannel) {
        const filedir = path.dirname(input);
        const fileonly = path.basename(input, '.scss');
        const output = path.join(filedir, fileonly + '.css');
        const compressedOutput = path.join(filedir, fileonly + '.min.css');
        const self = this;
        const compilerResult:CompilerResult = {
            onFailure() {

            },
            onSuccess() {
                if (config.debug) {
                    _channel.appendLine(`Compiled ${input} to ${output}`);
                }
                if (!config.disableMinifiedFileGeneration) {
                    const tmpResult :CompilerResult = {
                        onFailure() {

                        },
                        onSuccess() {
                            if (config.debug) {
                                _channel.appendLine(`Compiled ${input} to ${compressedOutput}`);
                            }
                        }
                    };
                    self.compileToFile(input, true, compressedOutput, config, tmpResult, _channel);
                }
            }
        };
        this.compileToFile(input, false, output, config, compilerResult, _channel);
    }

}
