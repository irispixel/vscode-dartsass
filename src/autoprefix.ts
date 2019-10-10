// Copyright (c) 2018-19 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';


import postcss = require('postcss');
import autoprefixer = require('autoprefixer');

export class Prefixer {

    processor: postcss.Processor | undefined;

    public static NewPrefixer(browsers: string | string[]| undefined) : Prefixer {
        const prefixer = new Prefixer();
        prefixer.processor = postcss().use(
            autoprefixer({
              browsers: browsers
            })
          );
        return prefixer;
    }

    public static NewDefaultPrefixer(): Prefixer {
        return Prefixer.NewPrefixer(undefined);
    }
    public process(css: postcss.ParserInput | postcss.Result | postcss.LazyResult | postcss.Root, cb: (result: postcss.Result) => any) {
        if (this.processor !== undefined && this.processor !== null) {
            return this.processor.process(css, {from:'', to: ''}).then(result => cb(result));
        }
    }
}
