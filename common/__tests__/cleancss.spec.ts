// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import "mocha";
import { CleanCSSMinifier } from "../src/cleancss";
import { expect } from "chai";

describe("CleanCSSMinifier", () => {
  it("minifySync", () => {
    const minifier = new CleanCSSMinifier();
    const minifyOutput = minifier.minifySync(
      {
        css: `a { color: brown; }`,
        sourceMap: null,
      },
      false,
      Buffer.from("/*# sourceMappingURL*/")
    );
    const should = require("chai").should();
    should.exist(minifyOutput.css);
    expect(minifyOutput.css.length).to.be.greaterThan(0);
    expect(minifyOutput.css).to.have.string("sourceMappingURL");
    should.exist(minifyOutput.sourceMap);
    // expect(minifyOutput.sourceMap.length).to.be.greaterThan(0);
  });
});
