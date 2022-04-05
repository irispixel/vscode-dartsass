// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { expect } from "chai";
import "mocha";
import { validateDocument, doesStartWithUnderscore } from "../src/validate";
import { IDocument } from "../src/document";
import { CompilerConfig } from "../src/config";
import { getSassDocument } from "./document";

describe("doesStartWithUnderscore function", () => {
  it("normal files without underscores", () => {
    const document: IDocument = getSassDocument(
      "/tmp",
      "/tmp/abc.scss",
      "abc.scss"
    );
    expect(false).to.equal(doesStartWithUnderscore(document));
  });

  it("starts with underscores", () => {
    const document: IDocument = getSassDocument(
      "/tmp",
      "/tmp/_abc.scss",
      "_abc.scss"
    );
    expect(true).to.equal(doesStartWithUnderscore(document));
  });

  it("empty file only should be true", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/_abc.scss", "");
    expect(true).to.equal(doesStartWithUnderscore(document));
  });
});

describe("validateDocument function", () => {
  it("empty fileOnly", () => {
    const document: IDocument = getSassDocument("/tmp", "/tmp/abc.scss", "");
    const config = new CompilerConfig();
    const result = validateDocument(document, config);
    expect(false).to.equal(result);
  });

  it("validate underscore files", () => {
    const document: IDocument = getSassDocument(
      "/tmp",
      "/tmp/_abc.scss",
      "_abc.scss"
    );
    const config = new CompilerConfig();
    const result = validateDocument(document, config);
    expect(false).to.equal(result);
  });

  it("validate too soon", () => {
    const document: IDocument = getSassDocument(
      "/tmp",
      "/tmp/_abc.scss",
      "abc.scss"
    );
    const config = new CompilerConfig();
    config.pauseInterval = 150; // 150 seconds beyond the threshold
    const result = validateDocument(document, config);
    expect(false).to.equal(result);
  });

  it("validate normal", () => {
    const document: IDocument = getSassDocument(
      "/tmp",
      "/tmp/_abc.scss",
      "abc.scss"
    );
    const config = new CompilerConfig();
    const result = validateDocument(document, config);
    expect(true).to.equal(result);
  });
});
