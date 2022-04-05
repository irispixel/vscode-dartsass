// Copyright (c) 2019 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use strict";
import "mocha";
import { CSSFile } from "../src/cssfile";
import { doAutoprefixCSS } from "../src/autoprefix";
import { expect } from "chai";

const InputCSS = `
.example {
    display: grid;
    transition: all .5s;
    user-select: none;
    background: linear-gradient(to bottom, white, black);
}
`;

describe("autoprefix API", () => {
  it("doAutoprefixCSS", (done) => {
    doAutoprefixCSS(
      {
        css: InputCSS,
        sourceMap: null,
      },
      "main.css",
      false,
      false
    ).then(
      (value: CSSFile) => {
        expect(value.css).to.be.not.null;
        // expect(value.sourceMap).to.be.not.null;
        // expect(value.sourceMap).to.be.not.undefined;
        const defaultString = value.css.toString();
        expect(defaultString).to.match(/-webkit-transition/);
        expect(defaultString).to.match(/-moz-user-select/);
        done();
      },
      (err) => {
        done(err);
      }
    );
  });
});
