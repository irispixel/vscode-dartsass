// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import { expect } from "chai";
import "mocha";
import { getDocumentForFile } from "./document";
import { IDocument } from "../src/document";

describe("documet.spec.ts:: getDocumentForFile function", () => {
  it("getDocumentForFile", () => {
    const document: IDocument = getDocumentForFile("hello.scss");
    expect(document.getFileOnly()).to.equal("hello");
  });
});
