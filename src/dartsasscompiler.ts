// Copyright (c) 2018-19 AltosCode, LLC
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
import { xformPath, xformPaths} from './util';

export interface Info {
    info: string;
}

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

    public sayVersion(_channel: vscode.OutputChannel) : string {
        const info = sass as unknown as Info;
        const version = info.info;
        return `${version}`;
    }

    public compileDocument(document: vscode.TextDocument, quiksassConfig: CompilerConfig, compileSingleFile: boolean, _channel: vscode.OutputChannel) {
        this.compile(document, quiksassConfig, compileSingleFile, _channel);
    }

    handleError(err: sass.SassException, config : CompilerConfig, compilerResult: CompilerResult,
            _channel: vscode.OutputChannel) {
        const fileonly = path.basename(err.file);
        const formattedMessage = ` ${err.line}:${err.column} ${err.formatted}`;
        vscode.window.showErrorMessage(`${fileonly}: ${formattedMessage}`);
        _channel.appendLine(`${err.formatted}`);
        compilerResult.onFailure();
    }

    writeSassOutput(result: sass.Result, output: string, compilerResult: CompilerResult, _channel: vscode.OutputChannel) {
        fs.writeFile(output, result.css, (err: NodeJS.ErrnoException | null) => {
            if (err !== null) {
                vscode.window.showErrorMessage(`Error while writing the generated css file ${output}`);
                _channel.appendLine(`${err} while writing ${output}`);
                compilerResult.onFailure();
                return;
            }
            compilerResult.onSuccess();
        });
    }

    compileToFileSync(document: vscode.TextDocument, compressed: boolean, output: string,
        config : CompilerConfig,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        const sassWorkingDirectory  = xformPath(document.uri, config.sassWorkingDirectory);
        const includePaths = xformPaths(document.uri, config.includePath);
        const options = this.getOptions(sassWorkingDirectory);
        const self = this;
        const result = sass.renderSync({
            file: document.fileName,
            importer: packageImporter(options),
            includePaths: includePaths,
            outputStyle: compressed ? 'compressed': 'expanded',
            outFile: output
        });
        if (result) {
            self.writeSassOutput(result, output, compilerResult, _channel);
        }

    }

    compileToFileAsync(document: vscode.TextDocument, compressed: boolean, output: string,
        config : CompilerConfig,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        const sassWorkingDirectory  = xformPath(document.uri, config.sassWorkingDirectory);
        const includePaths = xformPaths(document.uri, config.includePath);
        const options = this.getOptions(sassWorkingDirectory);
        const self = this;
        sass.render({
            file: document.fileName,
            importer: packageImporter(options),
            includePaths: includePaths,
            outputStyle: compressed ? 'compressed': 'expanded',
            outFile: output
        }, function (err: sass.SassException, result: sass.Result) {
            if (err) {
                self.handleError(err, config, compilerResult, _channel);
            } else {
                self.writeSassOutput(result, output, compilerResult, _channel);
            }
        });
    }

    compileToFile(document: vscode.TextDocument, compressed: boolean, output: string,
        config : CompilerConfig,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        if (config.debug) {
            _channel.appendLine("Sync " + config.sync);
        }
        if (config.sync) {
            this.compileToFileSync(document, compressed, output, config, compilerResult, _channel);
        } else {
            this.compileToFileAsync(document, compressed, output, config, compilerResult, _channel);
        }
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

    public compile(document: vscode.TextDocument,
        config : CompilerConfig, compileSingleFile: boolean, _channel: vscode.OutputChannel) {
        const input = document.fileName;
        const filedir = path.dirname(input);
        const fileonly = path.basename(input, '.scss');
        const output = path.join(filedir, fileonly + '.css');
        const compressedOutput = path.join(filedir, fileonly + '.min.css');
        const self = this;
        if (config.debug) {
            _channel.clear();
            _channel.appendLine("Scss working directory: " + config.sassWorkingDirectory);
            _channel.appendLine("include path: " + config.includePath.join(","));
        }
        const compilerResult:CompilerResult = {
            onFailure() {

            },
            onSuccess() {
                if (config.debug) {
                    _channel.appendLine(`Compiled ${input} to ${output}`);
                }
                if (compileSingleFile) {
                    vscode.window.showInformationMessage(`Compiled ${input} successfully`);
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
                    self.compileToFile(document, true, compressedOutput, config, tmpResult, _channel);
                }
            }
        };
        this.compileToFile(document, false, output, config, compilerResult, _channel);
    }

}
