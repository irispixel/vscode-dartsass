// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import * as common from 'dartsass-plugin-common';

const watcher = new common.Watcher();

export function watchDirectory(_srcdir: string, projectRoot: string, config: common.CompilerConfig, _log: common.ILog) {
    watcher.Watch(_srcdir, projectRoot, config, _log).then(
        value => {

        },
        err => {

        }
    );
}