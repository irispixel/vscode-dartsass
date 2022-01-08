// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";
import * as vscode from "vscode";
import { ILog, WatchInfo, Watcher, CompilerConfig, Validate,
  watchDirectory as commonWatchDirectory, xformPath, unwatchDirectory } from "dartsass-plugin-common";
import { GetProjectRoot } from "./doc";
import { myStatusBarItem } from "./statusbar";
import { GetActiveProjectRoot, PersistWatchers } from "./project";
import {
  MementoKeyWatchDirectories,
  GetPluginConfigurationAsObject,
  doesRunOnWindows
} from "./config";

const watcher = new Watcher();

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
  watchDir: vscode.Uri,
  workspaceState: vscode.Memento,
  _log: ILog
) {
  const projectRootURI = GetProjectRoot(watchDir);
  if (!projectRootURI) {
    return "";
  }
  const srcdir = xformPath(projectRootURI?.fsPath, watchDir.fsPath);
  const config = GetPluginConfigurationAsObject(workspaceState);
  commonWatchDirectory(srcdir, config).then(
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
  _log: ILog
) {
  const uri = GetProjectRoot(_srcdir);
  if (!uri) {
    return "";
  }
  const projectRoot = uri.fsPath;
  const srcdir = xformPath(projectRoot, _srcdir.fsPath);
  const config = GetPluginConfigurationAsObject(workspaceState);
  unwatchDirectory(srcdir, config).then(
    (value) => {
      PersistWatchers(workspaceState, config.watchDirectories, _log);
      if (!watcher.ClearWatch(_srcdir.fsPath, projectRoot, config.isWindows)) {
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
  _log: ILog
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
  const watchList: Map<string, WatchInfo> = watcher.GetWatchList();
  if (watchList.size > 0) {
    _log.info(
      `******************* ${watchList.size} sass watcher processes begin *********`
    );
    watchList.forEach((watchInfo: WatchInfo, key: string) => {
      _log.info(`${key} -> ${watchInfo.pid} ( pid )`);
    });
    _log.info(
      `******************* ${watchList.size} sass watcher processes *********`
    );
  }
}

export function ClearAllWatchers(
  workspaceState: vscode.Memento | null | undefined,
  _log: ILog
) {
  if (watcher.GetWatchList().size > 0) {
    vscode.window.showInformationMessage(
      `Clearing ${watcher.GetWatchList().size} sass watcher processes`
    );
    watcher.ClearAll(doesRunOnWindows());
    if (workspaceState) {
      updateStatusBar(workspaceState.get<string[]>(MementoKeyWatchDirectories));
    } else {
      updateStatusBar(null);
    }
  }
}

export function RestartWatchers(
  workspaceState: vscode.Memento,
  _log: ILog
) {
  const projectRoot = GetActiveProjectRoot();
  const extensionConfig = GetPluginConfigurationAsObject(workspaceState);
  _log.debug(
    `Configuration reloaded with ${JSON.stringify(
      extensionConfig
    )} and projectRoot ${projectRoot}`
  );
  Validate(extensionConfig, projectRoot).then(
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
  config: CompilerConfig,
  workspaceState: vscode.Memento,
  _log: ILog
) {
  const promises = watcher.Relaunch(projectRoot, config);
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
