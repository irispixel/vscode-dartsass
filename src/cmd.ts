// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";

import * as vscode from "vscode";
import { ILog } from "dartsass-plugin-common";
import { Doc } from "./doc";
import { Log } from "./log";
import { SayVersion, Compile } from "./core";
import {
  WatchDirectory,
  ListWatchers,
  UnwatchDirectory,
  RestartWatchers,
  ClearAllWatchers,
} from "./watcher";
import { PersistWatchers } from "./project";

export const CmdViewSassWatchersString = `dartsass.viewSassWatchers`;

function cmdWatchDirectory(
  _srcdir: vscode.Uri,
  workspaceState: vscode.Memento,
  _log: ILog
) {
  WatchDirectory(_srcdir, workspaceState, _log);
}

function cmdUnwatchDirectory(
  _srcdir: vscode.Uri,
  workspaceState: vscode.Memento,
  _log: ILog
) {
  UnwatchDirectory(_srcdir, workspaceState, _log);
}

function cmdViewSassWatchers(
  workspaceState: vscode.Memento,
  _log: ILog
) {
  ListWatchers(workspaceState, _log);
}

function cmdClearAllSassWatchers(
  workspaceState: vscode.Memento,
  _log: ILog
) {
  PersistWatchers(workspaceState, [], _log);
  ClearAllWatchers(workspaceState, _log);
}

function cmdRestartWatchers(workspaceState: vscode.Memento, _log: ILog) {
  RestartWatchers(workspaceState, _log);
}

function cmdSayVersion(workspaceState: vscode.Memento, _log: Log) {
  const editor = vscode.window.activeTextEditor;
  if (editor && typeof editor !== "undefined") {
    const projectRoot = new Doc(editor.document).getProjectRoot();
    SayVersion(projectRoot, workspaceState, _log);
  } else {
    vscode.window.showErrorMessage(
      `No Active Project Found or Editor not defined currently`
    );
  }
}

function cmdCompileCurrentFile(
  workspaceState: vscode.Memento,
  _log: ILog
) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    console.log(`No workspace folders present to compile scss files`);
    return null;
  }
  const editor = vscode.window.activeTextEditor;
  if (editor && typeof editor !== undefined) {
    Compile(editor.document, workspaceState, false);
  } else {
    console.log(`Editor not defined currently`);
  }
}

export function RegisterCommands(
  subscriptions: vscode.Disposable[],
  workspaceState: vscode.Memento,
  _log: Log
): number {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  subscriptions.push(
    vscode.commands.registerCommand("dartsass.saySassVersion", () => {
      cmdSayVersion(workspaceState, _log);
    })
  );
  subscriptions.push(
    vscode.commands.registerCommand("dartsass.compileCurrentFile", () => {
      cmdCompileCurrentFile(workspaceState, _log);
    })
  );
  subscriptions.push(
    vscode.commands.registerCommand(
      "dartsass.watchDir",
      (watchDir: vscode.Uri) => {
        cmdWatchDirectory(watchDir, workspaceState, _log);
      }
    )
  );
  subscriptions.push(
    vscode.commands.registerCommand(
      "dartsass.unwatchDir",
      (watchDir: vscode.Uri) => {
        cmdUnwatchDirectory(watchDir, workspaceState, _log);
      }
    )
  );
  subscriptions.push(
    vscode.commands.registerCommand("dartsass.restartWatchers", () => {
      cmdRestartWatchers(workspaceState, _log);
    })
  );
  subscriptions.push(
    vscode.commands.registerCommand(CmdViewSassWatchersString, () => {
      cmdViewSassWatchers(workspaceState, _log);
    })
  );
  return subscriptions.push(
    vscode.commands.registerCommand("dartsass.clearAllWatchers", () => {
      cmdClearAllSassWatchers(workspaceState, _log);
    })
  );
}
