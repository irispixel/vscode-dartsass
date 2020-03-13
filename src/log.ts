// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import * as vscode from 'vscode';
import * as common from 'dartsass-plugin-common';

export class Log {

    _channel: vscode.OutputChannel;

    debugFlag: boolean;

    constructor(channel: vscode.OutputChannel) {
        this._channel = channel;
        this.debugFlag = false;
    }

    public setDebugFlag(debugFlag: boolean) {
        this.debugFlag = debugFlag;
    }

    public debug(msg: string): any {
        if (this.debugFlag) {
            this._channel.appendLine(`DEBUG: ${msg}`);
        }
    }

    public info(msg: string): any {
        this._channel.appendLine(`INFO: ${msg}`);
    }

    public warning(msg: string): any {
        this._channel.appendLine(`WARN: ${msg}`);
    }

    public error(msg: string): any {
        this._channel.appendLine(`ERROR: ${msg}`);
    }

    public notify(msg: string): any {
        this.warning(msg);
        vscode.window.showErrorMessage(`${msg}`);
    }

    public appendLine(msg: string): any {
        this._channel.appendLine(msg);
    }

    public clear(): any {
        this._channel.clear();
    }

}


export function CreateLog(_channel: vscode.OutputChannel) : Log {
    return new Log(_channel);
}

export class NullLog {


    constructor() {
    }

    public debug(msg: string): any {

    }

    public warning(msg: string): any {
    }

    public info(msg: string): any {
    }

    public error(msg: string): any {
    }

    public notify(msg: string): any {
    }

    public appendLine(msg: string): any {
    }

    public clear(): any {
    }

}


export function CreateNullLog() : common.ILog {
    return new NullLog();
}
