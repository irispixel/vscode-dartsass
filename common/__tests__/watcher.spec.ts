// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { expect } from "chai";
import "mocha";
import path from "path";
import fs from "fs";
import { CompilerConfig, SASSOutputFormat } from "../src/config";
import { getConsoleLog } from "./log";
import { Watcher, watchDirectory, unwatchDirectory } from "../src/watcher";
import { getLocalSass } from "./testutil";
import { setLog } from "../src/log";
import { isWindows } from "../src/platform_factory";

describe("doLaunch", () => {
  let localSass: string;

  before(function (done) {
    localSass = getLocalSass();
    if (!fs.existsSync(localSass)) {
      done(`${localSass} does not exist`);
    } else {
      done();
    }
  });

  it("doLaunch compressed = false", (done) => {
    const watcher = new Watcher();
    const config = new CompilerConfig();
    config.targetDirectory = "out";
    config.sassBinPath = localSass;
    const srcdir = path.join(__dirname, "input");
    config.outputFormat = SASSOutputFormat.CompiledCSSOnly;
    watcher
      .doLaunch(srcdir, __dirname, config)
      .then(
        (result) => {
          const watchList = watcher.GetWatchList();
          expect(watchList.size).to.be.equal(1);
          expect(watcher.ClearWatch(srcdir, __dirname, isWindows())).to.be.true;
          expect(watchList.size).to.be.equal(0);
        },
        (err) => {
          expect(err).to.be.null;
        }
      )
      .finally(done);
  });

  it("doLaunch compressed = true", (done) => {
    const watcher = new Watcher();
    const config = new CompilerConfig();
    config.targetDirectory = "out";
    config.sassBinPath = localSass;
    const srcdir = path.join(__dirname, "input");
    watcher
      .doLaunch(srcdir, __dirname, config)
      .then(
        (result) => {
          const watchList = watcher.GetWatchList();
          expect(watchList.size).to.be.equal(1);
          expect(watcher.ClearWatch(srcdir, __dirname, isWindows())).to.be.true;
          expect(watchList.size).to.be.equal(0);
        },
        (err) => {
          expect(err).to.be.null;
        }
      )
      .finally(done);
  });

  it("relaunch", (done) => {
    const watcher = new Watcher();
    const config = new CompilerConfig();
    config.targetDirectory = "out";
    config.sassBinPath = localSass;
    setLog(getConsoleLog());
    const srcdir = path.join(__dirname, "input");
    config.watchDirectories.push(srcdir);
    const promises = watcher.Relaunch(__dirname, config);
    Promise.all(promises).then(
      (result) => {
        expect(watcher.ClearWatchDirectory(srcdir, isWindows())).to.be.equal(
          true
        );
        done();
      },
      (err) => {
        done(err);
      }
    );
  });

  it("watchDirectoryCycle", () => {
    const config = new CompilerConfig();
    const srcdir = path.join(__dirname, "input");
    watchDirectory(srcdir, config);
    expect(config.watchDirectories.length).to.be.equal(1);
    unwatchDirectory(srcdir, config);
    expect(config.watchDirectories.length).to.be.equal(0);
  });
});
