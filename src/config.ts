// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";
import * as vscode from "vscode";
import { CompilerConfig, SASSOutputFormat, isWindows } from 'dartsass-plugin-common';

export const pluginName = "dartsass";

//  MementoKeyWatchDirectories indicates the key to store the memento
export const MementoKeyWatchDirectories = "watchDirectories";

export function GetSASSOutputFormat(value: string): SASSOutputFormat {
  switch (value) {
    case "both":
      return SASSOutputFormat.Both;
    case "cssonly":
      return SASSOutputFormat.CompiledCSSOnly;
    case "minified":
      return SASSOutputFormat.MinifiedOnly;
  }
  return SASSOutputFormat.Both;
}

function doesExecOnWindows(execPlatform: string): boolean {
  switch (execPlatform) {
    case "windows":
      return true;
    case "linux":
      return false;
    case "host":
      return isWindows();
    default:
      return isWindows();
  }
}

export class Config {
  public static extractFrom(
    configuration: vscode.WorkspaceConfiguration,
    workspaceState: vscode.Memento
  ): CompilerConfig {
    const config = new CompilerConfig();
    config.includePath = configuration.get<Array<string>>(
      "includePath",
      new Array<string>()
    );
    config.sassBinPath = configuration.get<string>("sassBinPath", "");
    config.nodeExePath = configuration.get<string>("nodeExePath", "node.exe");
    config.targetDirectory = configuration.get<string>("targetDirectory", "");
    config.sourceEncoding = CompilerConfig.encodingFrom(configuration.get<string>("encoding", "utf-8"));
    config.outputFormat = GetSASSOutputFormat(
      configuration.get<string>("outputFormat", "both")
    );
    config.disableSourceMap = configuration.get<boolean>(
      "disableSourceMap",
      false
    );
    config.debug = configuration.get<boolean>("debug", false);
    config.disableCompileOnSave = configuration.get<boolean>(
      "disableCompileOnSave",
      false
    );
    config.pauseInterval = configuration.get<number>("pauseInterval", 3);
    config.enableStartWithUnderscores = configuration.get<boolean>(
      "enableStartWithUnderscores",
      false
    );
    config.disableAutoPrefixer = configuration.get<boolean>(
      "disableAutoPrefixer",
      false
    );
    let execPlatform = configuration.get<string>("execPlatform", "host");
    config.isWindows = doesExecOnWindows(execPlatform);
    const watchDirectories = workspaceState.get<string[]>(
      MementoKeyWatchDirectories
    );
    if (watchDirectories === undefined || watchDirectories === null) {
      config.watchDirectories = [];
    } else {
      config.watchDirectories = watchDirectories;
    }
    return config;
  }
}

export function GetRawPluginConfiguration(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(pluginName);
}

export function GetPluginConfigurationAsObject(
  workspaceState: vscode.Memento
): CompilerConfig {
  const vsconf = GetRawPluginConfiguration();
  return Config.extractFrom(vsconf, workspaceState);
}
