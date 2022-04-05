// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { CompilerConfig } from "./config";
import { Run, RunDetached, ProcessOutput, xformPath } from "./platform";
import { SIGINT } from "constants";
import * as path from "path";

export class LinuxCompiler {

    getSassBinPath(projectRoot: string, sassBinPath: string): string {
        if (!sassBinPath) {
            sassBinPath = path.join("node_modules", ".bin", "sass");
        }
        return xformPath(projectRoot, sassBinPath);
    }

    /**
    validateCmd(relativeCmd: string, args: string[]): boolean {
        let validated = platform.validateCmd(relativeCmd);
        if (validated) {
            for (const arg of args) {
                if (doesContainSpaces(arg)) {
                    Log.warning(`${NoSpaceInPath}: ${arg}`);
                    validated = false;
                    break;
                }
            }
        }
        return validated;
    }
    */

    verifySassBinPath(sassBinPath: string): boolean {
        return true;
    }
    
    public async sayVersion(
        config: CompilerConfig,
        projectRoot: string,
        versionArgs: Array<string>
    ): Promise<string> {
        const sassBinPath = this.getSassBinPath(projectRoot, config.sassBinPath);
        return Run(sassBinPath, versionArgs, projectRoot);        
    }

    public async watch(config: CompilerConfig,
        projectRoot: string,
        watchArgs: string[]): Promise<ProcessOutput> {
        const sassBinPath = this.getSassBinPath(projectRoot, config.sassBinPath);
        return RunDetached(sassBinPath, projectRoot, watchArgs);
    }

    public async compileDocument(config: CompilerConfig,
        projectRoot: string,
        cwd: string,
        compileArgs: string[]): Promise<string> {
        const sassBinPath = this.getSassBinPath(projectRoot, config.sassBinPath)
        return Run(sassBinPath, compileArgs, cwd);
    }

    public validateCmd(relativeCmd: string): boolean {
        return true;
    }

    public killProcess(pid: number): void {
        process.kill(-pid, SIGINT);
    }
}