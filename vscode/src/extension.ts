// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { setLog } from "dartsass-plugin-common";
import { RegisterCommands } from "./cmd";
import { CreateLog, CreateNullLog } from "./log";
import {
  ReloadConfiguration,
  StartBuildOnSaveWatcher,
  VerifyLegacyWatchDir,
  VerifyTargetMinifiedDirectory,
} from "./core";
import { getStatusBarItems } from "./statusbar";
import { ClearAllWatchers } from "./watcher";

let _channel: vscode.OutputChannel | null = null;
const _nullLog = CreateNullLog();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  _channel = vscode.window.createOutputChannel("DartJS Sass");
  context.subscriptions.push(_channel);
  _channel.appendLine('Extension "dartsass" activated now!');

  const _log = CreateLog(_channel);
  setLog(_log);
  ReloadConfiguration(context.workspaceState, _log);
  RegisterCommands(context.subscriptions, context.workspaceState, _log);
  addStatusItems(context.subscriptions);
  StartBuildOnSaveWatcher(context.subscriptions, context.workspaceState, _log);
  VerifyLegacyWatchDir(_log);
  VerifyTargetMinifiedDirectory(_log);
}

function addStatusItems(subscriptions: vscode.Disposable[]) {
  subscriptions.push.apply(getStatusBarItems());
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (_channel) {
    console.log("Disposing channel");
    _channel.clear();
    _channel.dispose();
  }
  ClearAllWatchers(null, _nullLog);
  setTimeout(function () {
    _nullLog.info("deactivate completed");
  }, 10000);
  return undefined;
}
