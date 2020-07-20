// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";
import * as vscode from "vscode";
import * as common from "dartsass-plugin-common";
import { GetProjectRoot } from "./doc";
import { myStatusBarItem } from "./statusbar";
import { GetActiveProjectRoot, PersistWatchers } from "./project";
import {
  MementoKeyWatchDirectories,
  GetPluginConfigurationAsObject,
} from "./config";

const watcher = new common.Watcher();

function updateStatusBar(watchDirectories: string[] | undefined | null) {
  let numWatchers = 0;
  if (watchDirectories) {
    numWatchers = watchDirectories.length;
  }
  if (numWatchers > 0) {
    myStatusBarItem.text = `Sass Watchers: ${numWatchers}`;
    myStatusBarItem.show();
  } else {
    myStatusBarItem.text = `Sass Watchers: 0`;
    myStatusBarItem.hide();
  }
}

export function WatchDirectory(
  _srcdir: vscode.Uri,
  workspaceState: vscode.Memento,
  _log: common.ILog
) {
  const uri = GetProjectRoot(_srcdir);
  if (!uri) {
    return "";
  }
  const projectRoot = uri.fsPath;
  const srcdir = common.xformPath(projectRoot, _srcdir.fsPath);
  const config = GetPluginConfigurationAsObject(workspaceState);
  common.watchDirectory(srcdir, config).then(
    (value: boolean) => {
      if (value) {
        vscode.window.showInformationMessage(
          `About to watch directory ${srcdir}`
        );
        PersistWatchers(workspaceState, config.watchDirectories, _log);
        RestartWatchers(workspaceState, _log);
      } else {
        vscode.window.showInformationMessage(
          `${srcdir} already being watched earlier`
        );
      }
    },
    (err) => {
      vscode.window.showErrorMessage(`${err}`);
    }
  );
}

export function UnwatchDirectory(
  _srcdir: vscode.Uri,
  workspaceState: vscode.Memento,
  _log: common.ILog
) {
  const uri = GetProjectRoot(_srcdir);
  if (!uri) {
    return "";
  }
  const projectRoot = uri.fsPath;
  const srcdir = common.xformPath(projectRoot, _srcdir.fsPath);
  const config = GetPluginConfigurationAsObject(workspaceState);
  common.unwatchDirectory(srcdir, config).then(
    (value) => {
      PersistWatchers(workspaceState, config.watchDirectories, _log);
      if (!watcher.ClearWatch(_srcdir.fsPath, projectRoot, _log)) {
        _log.notify(`Unable to clear watch for directory ${_srcdir.fsPath}.`);
      } else {
        _log.info(`Directory ${_srcdir.fsPath} unwatched now.`);
        vscode.window.showInformationMessage(
          `Directory ${_srcdir.fsPath} unwatched now.`
        );
      }
      updateStatusBar(workspaceState.get<string[]>(MementoKeyWatchDirectories));
    },
    (err) => {
      _log.warning(`${err}`);
      vscode.window.showWarningMessage(`${err}`);
    }
  );
}

export function ListWatchers(
  workspaceState: vscode.Memento,
  _log: common.ILog
) {
  const watchDirectories = workspaceState.get<string[]>(
    MementoKeyWatchDirectories
  );
  let numWatchers = 0;
  if (watchDirectories) {
    numWatchers = watchDirectories.length;
  }
  _log.info(
    `******************* ${numWatchers} watchers in memento begin *********`
  );
  if (watchDirectories) {
    watchDirectories.forEach((watchDirectory: string) => {
      _log.info(`${watchDirectory}`);
    });
    vscode.window.showInformationMessage(
      `Having ${numWatchers} watchers. Check "Output" -> "DartJS Sass" for more details.`
    );
  } else {
    vscode.window.showInformationMessage(`No watchers defined.`);
  }
  _log.info(`******************* ${numWatchers} watchers *********`);
  const watchList: Map<string, common.WatchInfo> = watcher.GetWatchList();
  if (watchList.size > 0) {
    _log.info(
      `******************* ${watchList.size} sass watcher processes begin *********`
    );
    watchList.forEach((watchInfo: common.WatchInfo, key: string) => {
      _log.info(`${key} -> ${watchInfo.pid} ( pid )`);
    });
    _log.info(
      `******************* ${watchList.size} sass watcher processes *********`
    );
  }
}

export function ClearAllWatchers(
  workspaceState: vscode.Memento | null | undefined,
  _log: common.ILog
) {
  if (watcher.GetWatchList().size > 0) {
    vscode.window.showInformationMessage(
      `Clearing ${watcher.GetWatchList().size} sass watcher processes`
    );
    watcher.ClearAll(_log);
    if (workspaceState) {
      updateStatusBar(workspaceState.get<string[]>(MementoKeyWatchDirectories));
    } else {
      updateStatusBar(null);
    }
  }
}

export function RestartWatchers(
  workspaceState: vscode.Memento,
  _log: common.ILog
) {
  const projectRoot = GetActiveProjectRoot();
  const extensionConfig = GetPluginConfigurationAsObject(workspaceState);
  _log.debug(
    `Configuration reloaded with ${JSON.stringify(
      extensionConfig
    )} and projectRoot ${projectRoot}`
  );
  common.Validate(extensionConfig, projectRoot, _log).then(
    (value) => {
      if (projectRoot !== null) {
        doRestartWatchers(projectRoot, extensionConfig, workspaceState, _log);
      } else {
        ClearAllWatchers(workspaceState, _log);
      }
    },
    (err) => {
      ClearAllWatchers(workspaceState, _log);
      vscode.window.showErrorMessage(`${err}`);
    }
  );
}

function doRestartWatchers(
  projectRoot: string,
  config: common.CompilerConfig,
  workspaceState: vscode.Memento,
  _log: common.ILog
) {
  const promises = watcher.Relaunch(projectRoot, config, _log);
  for (const promise of promises) {
    promise.then(
      (value) => {},
      (err) => {
        _log.notify(`Relaunch failed: ${err}`);
      }
    );
  }
  updateStatusBar(workspaceState.get<string[]>(MementoKeyWatchDirectories));
}
