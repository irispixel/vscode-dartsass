// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { expect } from "chai";
import "mocha";
import {
  inferTargetCSSDirectory,
  getOutputCSS,
  getRelativeDirectory,
  doesContainSpaces,
  getMinCSS,
  isMinCSS,
  isCSSFile,
  safeMkdir,
} from "../src/target";
import { IDocument } from "../src/document";
import { CompilerConfig } from "../src/config";
import { getSassDocument } from "./document";

describe("inferTargetCSSDirectory function", () => {
  it("inferTargetCSSDirectory for empty config", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/abc.scss", "abc");
    const config = new CompilerConfig();
    config.targetDirectory = "";
    const result = inferTargetCSSDirectory(document, config);
    expect(result).to.equal("/tmp");
  });

  it("inferTargetCSSDirectory for relative directory", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/abc.scss", "abc");
    const config = new CompilerConfig();
    config.targetDirectory = "out";
    const result = inferTargetCSSDirectory(document, config);
    expect(result).to.equal("/tmp/out");
  });

  it("inferTargetCSSDirectory for absolute directory", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/abc.scss", "abc");
    const config = new CompilerConfig();
    config.targetDirectory = "/tmp/test-absolute";
    const result = inferTargetCSSDirectory(document, config);
    expect(result).to.equal("/tmp/test-absolute");
  });
});

describe("safeMkdir function", () => {
  it("Not Able to write root", () => {
    const result = safeMkdir("/newroot");
    expect(result).to.not.be.null;
  });
  it("Create normal directory", () => {
    const result = safeMkdir("/tmp/abc");
    expect(result).to.be.null;
  });
  it("Create normal directory - existing", () => {
    const repeatPath = "/tmp/abcrepeat";
    let result = safeMkdir(repeatPath);
    expect(result).to.be.null;
    result = safeMkdir(repeatPath);
    expect(result).to.be.null;
  });
});
describe("getOutputCSS function", () => {
  it("default", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/abc.scss", "abc");
    const config = new CompilerConfig();
    config.targetDirectory = "";
    const result = getOutputCSS(document, config, false);
    expect(result).to.equal("/tmp/abc.css");
  });
});

describe("getOutputCSS function - minified=true", () => {
  it("default", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/abc.scss", "abc");
    const config = new CompilerConfig();
    config.targetDirectory = "";
    const result = getOutputCSS(document, config, true);
    expect(result).to.equal("/tmp/abc.min.css");
  });
});

describe("getRelativeDirectory function", () => {
  it("linux", () => {
    const result = getRelativeDirectory(
      "/opt/code/src/github.com/heronci/sass-watcher/",
      "/opt/code/src/github.com/heronci/sass-watcher/src/sass"
    );
    expect(result).to.equal("src/sass");
  });

  it("linux-relative", () => {
    const result = getRelativeDirectory(
      "/opt/code/src/github.com/heronci/sass-watcher/",
      "src/sass"
    );
    expect(result).to.equal("src/sass");
  });
});

describe("isMinCSS function", () => {
  it("main.css", () => {
    const result = isMinCSS(
      "/opt/code/src/github.com/heronci/sass-watcher/main.css",
      ".min.css"
    );
    expect(result).to.equal(false);
  });

  it("main.min.css", () => {
    const result = isMinCSS(
      "/opt/code/src/github.com/heronci/sass watcher/main.min.css",
      ".min.css"
    );
    expect(result).to.equal(true);
  });
});

describe("isCSSFile function", () => {
  it("main.css", () => {
    const result = isCSSFile(
      "/opt/code/src/github.com/heronci/sass-watcher/main.css"
    );
    expect(result).to.equal(true);
  });

  it("main.css.map", () => {
    const result = isCSSFile(
      "/opt/code/src/github.com/heronci/sass watcher/main.css.map"
    );
    expect(result).to.equal(false);
  });
});

describe("getMinCSS function", () => {
  it("main.css", () => {
    const result = getMinCSS(
      "/opt/code/src/github.com/heronci/sass-watcher/main.css",
      ".min.css"
    );
    expect(result).to.equal(
      "/opt/code/src/github.com/heronci/sass-watcher/main.min.css"
    );
  });
});

describe("doesContainSpaces function", () => {
  it("no spaces", () => {
    const result = doesContainSpaces(
      "/opt/code/src/github.com/heronci/sass-watcher/"
    );
    expect(result).to.equal(false);
  });

  it("spaces", () => {
    const result = doesContainSpaces(
      "/opt/code/src/github.com/heronci/sass watcher"
    );
    expect(result).to.equal(true);
  });
});
