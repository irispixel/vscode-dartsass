// Copyright (c) 2018-19 CodeLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use strict";

export interface IDocument {
  isSass(): boolean;

  getFileName(): string;

  getFileOnly(): string;

  getProjectRoot(): string;
}
