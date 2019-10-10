// Copyright (c) 2018-19 MalvaHQ
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
import { getFileName } from './compiler';
import { Prefixer } from './autoprefix';
import postcss = require('postcss');

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

    public compileDocument(document: vscode.TextDocument, dartsassConfig: CompilerConfig,
        compileSingleFile: boolean, _channel: vscode.OutputChannel) {
        this.compile(document, dartsassConfig, compileSingleFile, _channel);
    }

    handleError(err: sass.SassException, config : CompilerConfig, compilerResult: CompilerResult,
            _channel: vscode.OutputChannel) {
        const fileonly = path.basename(err.file);
        const formattedMessage = ` ${err.line}:${err.column} ${err.formatted}`;
        vscode.window.showErrorMessage(`${fileonly}: ${formattedMessage}`);
        _channel.appendLine(`${err.formatted}`);
        compilerResult.onFailure();
    }

    writeSassOutput(output: string, data: any, compilerResult: CompilerResult, _channel: vscode.OutputChannel) {
        fs.writeFile(output, data, (err: NodeJS.ErrnoException | null) => {
            if (err !== null) {
                vscode.window.showErrorMessage(`Error while writing the generated css file ${output}`);
                _channel.appendLine(`${err} while writing ${output}`);
                compilerResult.onFailure();
                return;
            }
            compilerResult.onSuccess();
        });
    }

    writeFinalResult(output: string, data: any,
        config : CompilerConfig,
        prefixer: Prefixer,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        const self = this;
        if (config.debug) {
            _channel.appendLine("disableAutoPrefixer: " + config.disableAutoPrefixer);
        }
        if (!config.disableAutoPrefixer) {
            prefixer.process(data,
                function(prefixedResult: postcss.Result) {
                    self.writeSassOutput(output, prefixedResult.css, compilerResult, _channel);
                }
                );
        } else {
            this.writeSassOutput(output, data, compilerResult, _channel);
        }

    }

    compileToFileSync(document: vscode.TextDocument, compressed: boolean, output: string,
        config : CompilerConfig,
        prefixer: Prefixer,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        const sassWorkingDirectory  = xformPath(document.uri, config.sassWorkingDirectory);
        const includePaths = xformPaths(document.uri, config.includePath);
        const options = this.getOptions(sassWorkingDirectory);
        const result = sass.renderSync({
            file: document.fileName,
            importer: packageImporter(options),
            includePaths: includePaths,
            outputStyle: compressed ? 'compressed': 'expanded',
            outFile: output
        });
        if (result) {
            this.writeFinalResult(output, result.css, config, prefixer, compilerResult, _channel);
        }

    }

    compileToFileAsync(document: vscode.TextDocument, compressed: boolean, output: string,
        config : CompilerConfig,
        prefixer: Prefixer,
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
                self.writeFinalResult(output, result.css, config, prefixer, compilerResult, _channel);
            }
        });
    }

    compileToFile(document: vscode.TextDocument, compressed: boolean, output: string,
        config : CompilerConfig,
        prefixer: Prefixer,
        compilerResult: CompilerResult,
        _channel: vscode.OutputChannel) {
        if (config.debug) {
            _channel.appendLine("Sync compilation: " + config.sync);
        }
        if (config.sync) {
            this.compileToFileSync(document, compressed, output, config, prefixer, compilerResult, _channel);
        } else {
            this.compileToFileAsync(document, compressed, output, config, prefixer, compilerResult, _channel);
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
        config : CompilerConfig,
        compileSingleFile: boolean, _channel: vscode.OutputChannel) {
        const input = document.fileName;
        const fileonly = getFileName(document);
        if (fileonly.length === 0) {
            return;
        }
        const filedir = path.dirname(input);
        const output = path.join(filedir, fileonly + '.css');
        const compressedOutput = path.join(filedir, fileonly + '.min.css');
        const self = this;
        if (config.debug) {
            _channel.appendLine("Scss working directory: " + config.sassWorkingDirectory);
            _channel.appendLine("include path: " + config.includePath.join(","));
        }
        const prefixer = Prefixer.NewPrefixer(config.autoPrefixBrowsersList);
        const compilerResult:CompilerResult = {
            onFailure() {

            },
            onSuccess() {
                if (config.debug) {
                    _channel.appendLine(`${input} -> ${output}`);
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
                                _channel.appendLine(`Min: ${input} -> ${compressedOutput}`);
                            }
                        }
                    };
                    self.compileToFile(document, true, compressedOutput, config, prefixer, tmpResult, _channel);
                }
            }
        };
        this.compileToFile(document, false, output, config, prefixer, compilerResult, _channel);
    }

}
