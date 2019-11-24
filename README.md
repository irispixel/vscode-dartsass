[![VSCode Marketplace Badge](https://img.shields.io/vscode-marketplace/v/malvahq.dartsass.svg?label=VSCode%20Marketplace&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=malvahq.dartsass) [![Total Installs](https://img.shields.io/visual-studio-marketplace/i/malvahq.dartsass.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=malvahq.dartsass) [![Total Install](https://img.shields.io/vscode-marketplace/d/malvahq.dartsass.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=malvahq.dartsass) [![Avarage Rating Badge](https://img.shields.io/vscode-marketplace/r/malvahq.dartsass.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=malvahq.dartsass) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/malvahq/vscode-plugin-dartsass/)


Compiles .scss files using [Dart SASS Compiler](https://sass-lang.com/dart-sass) to css and minified css.

* [Usage](#usage)
* [Install](#install)
    * [Inside VSCode](#inside-vscode)
    * [Marketplace](#marketplace)
* [Activation](#activation)
* [Menus](#menus)
    * [DartSass: Sass Watch](#dartsass-sass-watch)
    * [DartSass: Sass Unwatch](#dartsass-sass-unwatch)
* [Commands](#commands)
    * [QuikSass: Compile Current File](#quiksass-compile-current-file)
    * [QuikSass: Sass Compiler Version](#quiksass-sass-compiler-version)
    * [QuikSass: View Watcher List](#quiksass-view-watcher-list)
* [Properties](#properties)
* [Features](#features)
    * [Pure Javascript SASS](#pure-javascript-sass)
    * [Smart Imports](#smart-imports)
    * [Customize Directory](#customize-directory)
* [FAQ](#faq)
* [License](#license)
* [ChangeLog](#changelog)


## Usage

<img src="https://github.com/malvahq/vscode-plugin-dartsass/raw/master/images/how_to_use_it.gif" width="600"/>

It uses the Dart/JS Sass Compiler to generate the .css and .min.css files automatically for the given .scss file in the editor.

## Install

### Inside VSCode

You can install it from inside VSCode by using the following command

`
ext install malvahq.dartsass
`

### Marketplace

You can install [malvahq.dartsass](https://marketplace.visualstudio.com/items?itemName=malvahq.dartsass) from the VSCode Marketplace.

## Activation

The plugin gets activated when .scss files are opened.

By default, with every save of .scss file - the plugin uses the built-in Sass Compiler to compile the scss files

## Configuration

More details of the plugin can be found at [vscode-plugin-dartsass Page](https://malvahq.github.io/vscode-plugin-dartsass/).

### Menus

#### DartSass: Sass Watch

  In the file explorer on the left hand side, when we right-click on a directory, we get a menuitem `DartSass: Sass Watch` .
  This option appears only in the case of a directory and not in case of individual files.


  This command `watches` the directory using the option `sass --watch input:output` .

  ```
  Important: For this menu / feature to work, the sassBinPath
  property must point to an external sass binary.
  Otherwise it will indicate an error.
  ```

  After the directory is successfully watched, an entry is added to the statusbar on the lower right bottom - `Sass Watchers: 1` (or any number as appropriate).

  When the IDE is closed the subprocesses launched for watching get killed automatically.

  To view the list of watched processes / directories, use the command: `DartSass: View Sass Watchers` and then check the `Output` under `DartJS Sass`.

  It will list all the watched source directories and the pid (tested in unix) for those processes.

  ```
  TODO: 1) Right now, there is no way to kill / unwatch the directories from
  inside the IDE individually one at a time.

  Although all the processes eventually get killed when we close the IDE though.

  2) Also the list of watchers need to be better visualized than the naive output in the console.
  ```

#### DartSass: Sass Unwatch

  In the file explorer on the left hand side, when we right-click on a directory, we get a menuitem `DartSass: Sass UnWatch` .
  This option appears only in the case of a directory and not in case of individual files.

  If a directory was watched before, this kills the process used to watch the directory.

  In case the directory was not watched before, a warning message appears indicating that no watcher exists for that directory.

### Commands

#### QuikSass: Compile Current File

Compiles the current scss file in the active editor to .css and .min.css file as appropriate.

#### QuikSass: Sass Compiler Version

Prints out the current sass compiler version being used.

#### QuikSass: View Watcher List

Views the list of watchers by this sass plugin

### Properties

This extension contributes the following properties:

  1. `dartsass.includePath`: Default: [ ]. Set of directories to be specified as includePath for sass compilation.
  1. `dartsass.sassWorkingDirectory`: Default: Project Root. The working directory from which to run the sass compiler to be used by `node-sass-package-importer`.

     This can be an absolute directory or a directory, relative to project root.
  1. `dartsass.disableMinifiedFileGeneration`: Default: False. Flag to disable minified file generation. Minified files are generated by default.
  1. `dartsass.disableCompileOnSave`: Default: False. This disables a compilation with every save.
  1. `dartsass.pauseInterval`: Default: 10. Pause Interval (in seconds) before kicking off another scss compilation to not compile frequently and hog resources.
  1. `dartsass.enableStartWithUnderscores`: Default: false. Enables compilation of files that start with underscores.
  1. `dartsass.disableAutoPrefixer`: Default: false. Disables postcss processing using autoprefixer library.
  1. `dartsass.autoPrefixBrowsersList`: Default: `["> 1%", "last 2 versions"]`. List of browsers to be specified for autoprefixer. See https://github.com/browserslist/browserslist#readme for more details.
  1. `dartsass.targetDirectory`: Default: Empty. The target directory to write the generated css files.

     This can be an absolute directory or a directory, relative to project root.
  1. `dartsass.targetMinifiedDirectory`: Default: Empty. The target directory to write the generated minified css files.

      This can be an absolute directory or a directory, relative to project root.

      If this property is empty, then the value defaults to `dartsass.targetDirectory` . If `dartsass.targetDirectory` is also empty, then this value defaults to the same directory as that of the source files.
   1. `dartsass.sassBinPath`: Default: Empty.

       Eg: `/usr/local/bin/sass` PATH of sass binary to be used to compile. [ `Beta` yet. ]

       By default, the property is empty and in that case, the plugin uses the `sass` npm package built along with this plugin.
   1. `dartsass.debug`: Default: false. Best applicable for developers of this extension only.

## Features

### Pure Javascript SASS

This VSCode plugin directly depends on the native pure-javascript `sass` implementation.

Check [Dart implementation of SASS](https://sass-lang.com/dart-sass) for more details.

It does not depend on `node-sass` (or indirectly the platform-specific `libcss` either !).

### Smart Imports

It automatically imports [node-sass-package-importer](https://github.com/maoberlehner/node-sass-magic-importer/tree/master/packages/node-sass-package-importer) as well.


So it is possible to use the following the import notation in the scss files.


Eg:

Assume, we define a dependency in package.json as below (say, sass-mq).

`package.json`
```json
"dependencies": {
    "sass-mq": "~5.2.1",
}
```

We should pull the npm modules in the `node_modules` directory as below.

```
$ npm i
```
The above command will pull the node modules from npm to `node_modules` directory at the same level as package.json.

Then, we can import the package, `sass-mq` in our scss file using a shorthand notation starting with `~` as below.

`app.scss`
```scss
@import '~sass-mq/mq';
```

The plugin will include the modules defined in `package.json` (and hence, the generated modules present in the `node_modules` directory) when transpiling the .scss files inline.

### Customize Directory

By default, it looks for packages in `package.json` in the root directory of the current project. ( and hence, the packages in `node_modules`)

To customize the same, check `dartsass.sassWorkingDirectory`. More details below in extension settings.

## FAQ

 1. Does this plugin come pre-built with Sass Compiler ?

    Yes. by default - the plugin comes pre-built with one of the more recent releases of sass compiler. So - you would not need to install sass compiler locally in your system for the plugin to be active.

 1. I already have Sass compiler installed in my system in PATH or would like to try a sass compiler installed in a specific path ? How can I configure the same ?

    By default - the plugin uses the built-in sass compiler used internally. To use an external binary, see option `sassBinPath` mentioned above. Point `sassBinPath` to the binary (say, `/usr/local/bin/sass` ) in User / Workspace for vscode and then start saving the files. Now the plugin will use the external sass binary as opposed to the built-in sass library for the compilation.

 1. The autocompile (of sass) files that comes predefined with the plugin is too aggressive and is killing the CPU. What can I do ?

    By default, the Dart/JS compiler gets activated with every save of the current editor file.
If that is too aggressive, see `pauseInterval` configuration option above ( in seconds ). It can be used to configure the pause interval between successive compilations to use resources less aggressively.


 1. I would like to use Autoprefixer for my compilation. Does this plugin support the same ?

    The plugin comes built-in with autoprefixer support. See `autoPrefixBrowsersList` option to configure the browserslist for which autoprefixer needs to generate code (using postcss).


## License

This VSCode extension is released under [MIT license](LICENSE).

## ChangeLog

See [CHANGELOG](CHANGELOG.md) for more details.

[ TOC Credit: [github-markdown-toc](https://github.com/ekalinin/github-markdown-toc) ]