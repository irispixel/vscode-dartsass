// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";

import * as vscode from "vscode";
import * as common from "dartsass-plugin-common";
import { Doc } from "./doc";
import {
  GetRawPluginConfiguration,
  GetPluginConfigurationAsObject,
  pluginName,
} from "./config";
import { RestartWatchers } from "./watcher";
import { Log } from "./log";

const legacyWatchDirectoryMessage = `
    dartsass.watchDirectories configuration property removed and internally implemented using the Memento API.

    The functionality is still supported though. To have persistent sass watchers, you have have to invoke DartSass: Watch Directory again (one-time only) on directories you wish to watch.

    To prevent this warning from recurring again, you may want to delete this property - dartsass.watchDirectories - locally in your .vscode/settings.json in workspace manually.

    See Issue #21 in the project for more details.
`;

const legacyTargetMinifiedDirectoryMessage = `
    dartsass.targetMinifiedDirectory configuration property removed.

    To prevent this warning from recurring again, you may want to delete this property - dartsass.targetMinifiedDirectory - locally in your .vscode/settings.json in workspace manually.

    See Issue #25 in the project for more details.
`;

export function VerifyLegacyWatchDir(_log: common.ILog) {
  const configuration = GetRawPluginConfiguration();
  const legacyWatchDirectories = configuration.get<Array<string>>(
    "watchDirectories",
    new Array<string>()
  );
  if (legacyWatchDirectories === undefined || legacyWatchDirectories === null) {
    _log.warning(legacyWatchDirectoryMessage);
  }
}

export function VerifyTargetMinifiedDirectory(_log: common.ILog) {
  const configuration = GetRawPluginConfiguration();
  const targetMinifiedDirectory = configuration.get<string>(
    "targetMinifiedDirectory",
    ""
  );
  if (
    targetMinifiedDirectory === undefined ||
    targetMinifiedDirectory === null
  ) {
    _log.warning(legacyTargetMinifiedDirectoryMessage);
  }
}

export function ReloadConfiguration(workspaceState: vscode.Memento, _log: Log) {
  const extensionConfig = GetPluginConfigurationAsObject(workspaceState);
  _log.setDebugFlag(extensionConfig.debug);
  RestartWatchers(workspaceState, _log);
}

export function StartBuildOnSaveWatcher(
  subscriptions: vscode.Disposable[],
  workspaceState: vscode.Memento,
  _log: Log
) {
  vscode.workspace.onDidChangeConfiguration(
    (e: vscode.ConfigurationChangeEvent) => {
      if (e.affectsConfiguration(pluginName)) {
        ReloadConfiguration(workspaceState, _log);
      }
    }
  );
  vscode.workspace.onDidChangeWorkspaceFolders(
    (e: vscode.WorkspaceFoldersChangeEvent) => {
      _log.warning(`Unhandled change in workspacefolder event ${e}`);
    }
  );
  vscode.workspace.onDidSaveTextDocument(
    (document: vscode.TextDocument) => {
      Compile(document, workspaceState, true);
    },
    null,
    subscriptions
  );
}

export function SayVersion(
  projectRoot: string,
  workspaceState: vscode.Memento,
  _log: Log
) {
  const extensionConfig = GetPluginConfigurationAsObject(workspaceState);
  _log.debug(`sayVersion with projectRoot ${projectRoot}`);
  try {
    common.SayVersion(extensionConfig, projectRoot).then((value) => {
      common.getVersions();
      vscode.window.showInformationMessage(value);
    });
  } catch (err) {
    vscode.window.showErrorMessage(`${err}`);
  }
}

export function Compile(
  document: vscode.TextDocument,
  workspaceState: vscode.Memento,
  checkCompileOnSave: boolean
) {
  const config = GetPluginConfigurationAsObject(workspaceState);
  if (checkCompileOnSave && config.disableCompileOnSave) {
    return;
  }
  common.CompileCurrentFile(new Doc(document), config).then(
    (value) => {},
    (err) => {
      vscode.window.showErrorMessage(`${err}`);
    }
  );
}
