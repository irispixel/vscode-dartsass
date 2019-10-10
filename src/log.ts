// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';


export class Log {

    _channel: vscode.OutputChannel;

    constructor(channel: vscode.OutputChannel) {
        this._channel = channel;
    }

    public info(msg: string): any {
        vscode.window.showInformationMessage(msg);
    }

    public appendLine(msg: string): any {
        this._channel.appendLine(msg);
    }

    public error(msg: string): any {
        vscode.window.showErrorMessage(msg);
    }

    public clear(): any {
        this._channel.clear();
    }

}
