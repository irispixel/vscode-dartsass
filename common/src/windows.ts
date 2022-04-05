// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { Log } from "./log";
import { CompilerConfig } from "./config";
import { Run, RunDetached, ProcessOutput, NoSpaceInPath, xformPath } from "./platform";
import {
    doesContainSpaces,
    getRelativeDirectory
} from "./target";
import * as path from 'path';


export class WindowsCompiler {

    public getSassBinPath(projectRoot: string, sassBinPath: string): string {
        if (!sassBinPath) {
            sassBinPath = path.join("node_modules", "sass", "sass.js");
        }        
        return xformPath(projectRoot, sassBinPath);
    }

    verifySassBinPath(sassBinPath: string): boolean {
        return true;
    }

    public async sayVersion(
        config: CompilerConfig,
        projectRoot: string,
        versionArgs: Array<string>
    ): Promise<string> {
        const sassBinPath = this.getSassBinPath(projectRoot, config.sassBinPath);
        const relativeCmd = getRelativeDirectory(projectRoot, sassBinPath);
        this.verifySassBinPath(relativeCmd);
        let args = versionArgs;
        versionArgs.unshift(relativeCmd);
        return Run(config.nodeExePath, args, projectRoot);
    }

    public async watch(config: CompilerConfig,
        projectRoot: string,
        watchArgs: string[]): Promise<ProcessOutput> {
        const sassBinPath = this.getSassBinPath(projectRoot, config.sassBinPath);
        const relativeCmd = getRelativeDirectory(projectRoot, sassBinPath);
        this.verifySassBinPath(relativeCmd);
        watchArgs.unshift(relativeCmd);
        return RunDetached(config.nodeExePath, projectRoot, watchArgs);
    }

    public async compileDocument(config: CompilerConfig,
        projectRoot: string,
        cwd: string,
        compileArgs: string[]) {
        const sassBinPath = this.getSassBinPath(projectRoot, config.sassBinPath);
        const relativeCmd = getRelativeDirectory(cwd, sassBinPath);
        this.verifySassBinPath(relativeCmd);
        compileArgs.unshift(relativeCmd);
        return Run(config.nodeExePath, compileArgs, cwd);
    }

    public validateCmd(relativeCmd: string): boolean {
        let validated = true;
        if (doesContainSpaces(relativeCmd)) {
            Log.warning(`${NoSpaceInPath}: ${relativeCmd}`);
            validated = false;
        }
        return validated;
    }

    public killProcess(pid: number): void {
        // windows does not kill processes apparently.
        const spawn = require("child_process").spawn;
        const cmd = spawn("taskkill", ["/pid", pid, "/f", "/t"]);
        cmd.on("exit", (data: any) => {
           Log.debug(`${data}`);
        });
    }

}