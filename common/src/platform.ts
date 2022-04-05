// Copyright (c) 2019 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { CompilerConfig } from "./config";
import { Log } from "./log";
import { getRelativeDirectory } from "./target";
import * as child from "child_process";
import * as path from "path";

export const NoSpaceInPath = `
    The cmd path / include path / watch directory contains a space.

    Please use a cmd / include path / watch directory with no space in it.
`;

export interface ProcessOutput {
    pid: number;
  
    killed: boolean;
}
  
export interface IPlatform {
    getSassBinPath(projectRoot: string, sassBinPath: string): string  ;
    
    sayVersion(
        config: CompilerConfig,
        projectRoot: string,
        versionArgs: Array<string>
    ): Promise<string> ;

    watch(config: CompilerConfig,
        projectRoot: string,
        watchArgs: string[]): Promise<ProcessOutput>;

    compileDocument(config: CompilerConfig,
        projectRoot: string,
        cwd: string,
        compileArgs: string[]): Promise<string>;     
        
    validateCmd(relativeCmd: string): boolean;

    killProcess(pid: number): void;
}

export async function Run(
    cmd: string,
    args: string[],
    cwd: string
  ): Promise<string> {
    const relativeCmd = getRelativeDirectory(cwd, cmd);
    let output = "";
    const message = `Run: Cwd: ${cwd}. Exec: ${relativeCmd} ${args.join("  ")}`;
    const prc = child.spawn(relativeCmd, args, {
      cwd: cwd,
      shell: false,
      windowsHide: true,
    });
    if (prc.killed) {
      Log.warning(`${message} killed. pid - ${prc.pid}`);
      throw new Error(`${message} killed. pid - ${prc.pid}`);
    } else if (prc.pid === null || prc.pid === undefined) {
      Log.warning(
        `${message} did not launch correctly. pid is null / undefined - ${prc.pid}`
      );
      throw new Error(
        `${message} did not launch correctly. pid is null / undefined - ${prc.pid}`
      );
    } else {
      Log.debug(`${message} launched with pid ${prc.pid}`);
    }
    prc.stdout.setEncoding("utf8");
    prc.stdout.on("data", (data: any) => {
      Log.line(`${data}`);
      output = data;
    });
    prc.stderr.setEncoding("utf8");
    prc.stderr.on("data", (data: any) => {
      Log.warning(`Error: ${data}`);
    });
    const execPromise = new Promise<string>((resolve, reject) => {
      prc.on("exit", (code: any) => {
        if (code === 0) {
          resolve(removeLineBreaks(output));
        } else {
          reject(`Process exited with code: ${code}`);
        }
      });
    });
    return await execPromise;
  }
  
export async function RunDetached(
    cmd: string,
    cwd: string,
    args: string[]
  ): Promise<ProcessOutput> {
    const relativeCmd = getRelativeDirectory(cwd, cmd);
    Log.debug(
      `RunDetached: Cwd: ${cwd}. Exec: ${relativeCmd} ${args.join("  ")}`
    );
    const prc = child.spawn(relativeCmd, args, {
      cwd: cwd,
      detached: true,
      stdio: "ignore",
      shell: false,
      windowsHide: true,
    });
    if (prc.killed) {
      const killMsg =  `Detached Process ${cmd} killed. pid - ${prc.pid}`;
      Log.warning(killMsg);
      prc.unref(); // Parent should not be waiting for the child process at all
      throw new Error(killMsg);
    } else if (prc.pid === null || prc.pid === undefined) {
      const launchMsg =  `Detached process ${cmd} did not launch correctly. pid is null / undefined - ${prc.pid}`;
      Log.warning(launchMsg);
      prc.unref(); // Parent should not be waiting for the child process at all
      throw new Error(launchMsg);
    } 
    Log.debug(`Detached process ${cmd} launched with pid ${prc.pid}`);
    if (prc.stdout) {
      prc.stdout.setEncoding("utf8");
      prc.stdout.on("data", (data: any) => {
        Log.line(`${data}`);
      });
    }
    if (prc.stderr) {
      prc.stderr.setEncoding("utf8");
      prc.stderr.on("data", (data: any) => {
        Log.line(`Error: ${data}`);
      });
    }
    prc.unref(); // Parent should not be waiting for the child process at all
    const processOutput: ProcessOutput = {
      pid: prc.pid,
      killed: prc.killed,
    };
    return processOutput;
  }
  


export function removeLineBreaks(value: string): string {
    return value.replace(/(\r\n|\n|\r)/gm, "");
}
 
export function getWatcherPattern(
    sourceDirectory: string,
    ext: string
  ): string {
    return sourceDirectory + "/**/*." + ext;
}

function xformPathFromRoot(projectRoot: string, entry: string): string {
  if (path.isAbsolute(entry)) {
    return entry;
  }
  return path.join(projectRoot, entry);
}

function xformPathsFromRoot(
  projectRoot: string,
  includePath: Array<string>
): Array<string> {
  const output: Array<string> = new Array<string>();
  includePath.forEach(function (entry: string) {
    output.push(xformPathFromRoot(projectRoot, entry));
  });
  return output;
}

export function xformPath(projectRoot: string, entry: string): string {
  if (!projectRoot) {
    return entry;
  }
  return xformPathFromRoot(projectRoot, entry);
}


export function xformPaths(
  projectRoot: string,
  includePath: Array<string>
): Array<string> {
  if (!projectRoot) {
    return includePath;
  }
  return xformPathsFromRoot(projectRoot, includePath);
}
