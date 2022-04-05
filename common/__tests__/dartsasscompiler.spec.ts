// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { expect } from "chai";
import "mocha";
import { DartSassCompiler } from "../src/dartsasscompiler";
import { IDocument } from "../src/document";
import { CompilerConfig, SASSOutputFormat } from "../src/config";
import { validateTargetDirectories } from "../src/target";
import { getDocumentForFile } from "./document";
import { getBufLog } from "./log";
import path from "path";
import fs from "fs";
import { getLocalSass } from "./testutil";
import { setLog } from "../src/log";

describe("DartsassCompiler SayVersion", () => {
  let localSass: string;

  before(function (done) {
    localSass = getLocalSass();
    if (!fs.existsSync(localSass)) {
      done(`${localSass} does not exist`);
    } else {
      done();
    }
  });

  it("sayVersion", (done) => {
    const compiler = new DartSassCompiler();
    const config = new CompilerConfig();
    config.sassBinPath = getLocalSass();
    setLog(getBufLog());
    compiler.sayVersion(config, "").then(
      (data: string) => {
        done();
      },
      (err) => {
        done(err);
      }
    );
  });
});

describe("DartsassCompiler CompileDocument", () => {
  it("DartsassCompiler::compileDocument", (done) => {
    const compiler = new DartSassCompiler();
    const document: IDocument = getDocumentForFile("hello.scss");
    const config = new CompilerConfig();
    config.targetDirectory = "out";
    console.info(`Compiling ${document.getFileName()}`);
    expect(validateTargetDirectories(document, config)).to.be.null;
    const outputDirectory = path.join(__dirname, config.targetDirectory);
    compiler.compileDocument(document, config).then(
      (result: string) => {
        fs.stat(path.join(outputDirectory, "hello.css.map"), (exists) => {
          expect(exists).to.be.null;
        });
        done();
      },
      (err) => {
        done(err);
      }
    );
  });

  it("DartsassCompiler::compileDocument::Both", (done) => {
    const compiler = new DartSassCompiler();
    const document: IDocument = getDocumentForFile("hello.scss");
    const config = new CompilerConfig();
    config.targetDirectory = "outboth";
    console.info(`Compiling ${document.getFileName()}`);
    expect(validateTargetDirectories(document, config)).to.be.null;
    const outputDirectory = path.join(__dirname, config.targetDirectory);
    compiler.compileDocument(document, config).then(
      (result: string) => {
        fs.stat(path.join(outputDirectory, "hello.css"), (exists) => {
          expect(exists).to.be.null;
        });
        fs.stat(path.join(outputDirectory, "hello.min.css"), (exists) => {
          expect(exists).to.be.null;
        });
        done();
      },
      (err) => {
        done(err);
      }
    );
  });

  it("DartsassCompiler::compileDocument::MinOnly", (done) => {
    const compiler = new DartSassCompiler();
    const document: IDocument = getDocumentForFile("hello.scss");
    const config = new CompilerConfig();
    config.outputFormat = SASSOutputFormat.MinifiedOnly;
    config.targetDirectory = "outmin";
    console.info(`Compiling ${document.getFileName()}`);
    expect(validateTargetDirectories(document, config)).to.be.null;
    const outputDirectory = path.join(__dirname, config.targetDirectory);
    compiler.compileDocument(document, config).then(
      (result: string) => {
        fs.stat(path.join(outputDirectory, "hello.css"), (exists) => {
          expect(exists).to.be.not.null;
        });
        fs.stat(path.join(outputDirectory, "hello.min.css"), (exists) => {
          expect(exists).to.be.null;
        });
        done();
      },
      (err) => {
        done(err);
      }
    );
  });

  it("DartsassCompiler::compileDocument::CompiledCSSOnly", (done) => {
    const compiler = new DartSassCompiler();
    const document: IDocument = getDocumentForFile("hello.scss");
    const config = new CompilerConfig();
    config.outputFormat = SASSOutputFormat.CompiledCSSOnly;
    config.targetDirectory = "outcompiled";
    console.info(`Compiling ${document.getFileName()}`);
    expect(validateTargetDirectories(document, config)).to.be.null;
    const outputDirectory = path.join(__dirname, config.targetDirectory);
    compiler.compileDocument(document, config).then(
      (result: string) => {
        fs.stat(path.join(outputDirectory, "hello.css"), (exists) => {
          expect(exists).to.be.null;
        });
        fs.stat(path.join(outputDirectory, "hello.min.css"), (exists) => {
          expect(exists).to.be.not.null;
        });
        done();
      },
      (err) => {
        done(err);
      }
    );
  });
});
