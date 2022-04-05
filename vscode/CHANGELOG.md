# Change Log

### 0.9.0
  * Upgrade sass library to 1.47.0 . 
  * Property `dartsass.autoPrefixBrowsersList` removed altogether as that overrides the `.browserlistrc ` values unnecessarily.
  * Experimental support added for remote ssh execution platform through `dartsass.execPlatform` property. 

### 0.8.7
  * Bug fix regarding repository path. Change to the right git repository.

### 0.8.6
  * Bug fix where the minified css files' ( .min.css ) sourcemap were not getting generated when they were watched. 

### 0.8.4
  * Upgrade sass library to 1.34.0
  * Upgrade postcss library to 8.3.0
  

### 0.8.0
  * Introduce encoding property to specify encoding of files. Possible values - ascii, utf8 and utf16.
    Default value - utf8.


### 0.7.5
  * Upgrade sass library to 1.32.13

### 0.7.4
  * Better documentation

### 0.7.3
  * Upgrade sass library to 1.32.5
  * Introduce a new property - `dartsass.outputFormat` that takes possible values `both`, `cssonly` and `minified` to generate files as appropriate.
  * Deprecate property `dartsass.disableMinifiedFileGeneration` . See `dartsass.outputFormat` above for replacement.

### 0.7.2
  * Upgrade sass library to 1.28.0 .

### 0.7.1
  * Bug not showing the sass compilation errors inside vscode fixed.

### 0.7.0
  * Upgrade sass library to 1.27.0 and autoprefixer to 10.0.0

### 0.6.8
  * Upgrade autoprefixer and postcss libraries

### 0.6.7
  * Upgrade sass compiler to 1.26.5

### 0.6.6
  * Much smaller crisper dependencies without types.

### 0.6.5
  * Minimum required version of vscode is now `1.40.0` . Updated accordingly.

### 0.6.4
  * Upgrade browserslist and autoprefixer packages.

### 0.6.0
  * Move the plugin to `codelios.dartsass` publisher.

### 0.5.20
  * Address `We found a potential security vulnerability in one of your dependencies` alert as issued by github.

### 0.5.19
  * Remove redundant messages appearing in case of an error.

### 0.5.17
  * Upgrade sass compiler to 1.26.3

### 0.5.15
  * Better logging information.

### 0.5.14
  * Add better debugging information. Crisper sass chokidar watchers.

### 0.5.13
  * Do not start any chokidar file watcher at all if `disableMinifiedFileGeneration` is set to true.

### 0.5.12
  * Upgrade sass compiler to 1.26.2
  * Upgrade browserslist to 4.9.1

### 0.5.11
  * Better README.

### 0.5.10

  * Upgrade to typescript 3.8.2

### 0.5.9
  * For sourcemap for minified files (.min.css.map), the sourceMappingURL comment was missing. Adding it now.

### 0.5.8
  * When `disableSourceMap` is set, we were getting an invalid sourcemap (.min.css.map). Bug fix to delete it altogether.

### 0.5.7
  * Bug fix related to invalid sourcemap suffix for "compile on save" functionality rolled in.

### 0.5.6
  * New property `nodeExePath` added. This helps to configure the path to `node.exe` . This is applicable on windows only. On Linux, this property is completely ignored.

### 0.5.5
  * First cut of fixing sourcemap generation, regression introduced since v0.5.0 . See #28 for more details
  * browserlist upgraded to 4.8.7

### 0.5.4
  * Add sourcemaps as well in case of generating minified files (using our own `chokidar` implementation).

### 0.5.3
  * When `sassBinPath` is set, minified files were not getting generated. Possibly a regression from v0.5.0. Fixed now.

### 0.5.2
  * Fix some issues related to encoding - Buffer / string issues.

### 0.5.1
  * Windows specific bug fix only. Regression introduced as part of 0.5.0 so sayVersion and compileOnSave inside the IDE still works.

### 0.5.0
  * Use `chokidar` to minify files better using autoprefixer as opposed to launching 2 sass watch processes. See #25 for more details.
  * In Windows, use `node.exe` to launch processes better (to avoid the console windows). Important: `sassBinPath` needs to be set to `node_modules\\sass\\sass.js` though for it to work.

### 0.4.3
  * Regression introduced since 0.4.0 , where if we "rewatch" a directory by mistake, it spawns and recreates the "sass watcher" processes again. Ideally it should simply say the directory was already being watched earlier.

### 0.4.2
  * In case there are spaces in includePath or watchDirectory , we do not support them currently. So flag an error then.

### 0.4.1
  * Regression of bug #12 got reintroduced recently. See #22 for more details.

### 0.4.0
  * `dartsass.watchDirectories` removed completely since it is supposed to be encapsulated from the user. See #21 (and updated README.md) for migration instructions as the equivalent functionality is supported still.

### 0.3.20
  * In Windows, processes were not getting killed at all when we `unwatch` a directory. Hopefully they get killed in the future.

### 0.3.19
  * Currently if we start a watcher for a directory and then save a file from within the IDE ( under the directory being watched ) , it compiles 2 times potentially.
    Once by the sass watcher process and then the second by the compilation process by save. We don't need the second one as that is redundant and almost certainly results in buggy output.

### 0.3.18
  * Add better documentation.

### 0.3.17
  * Fix for windows version of sass watcher. Include path should be relative as well.

### 0.3.16
  * In windows, projectRoot with spaces was not working earlier. Fix in for now.

### 0.3.15
  * Release to fix regression.

### 0.3.14
  * Buggy release introducing a crazy regression. Please ignore.

### 0.3.13
  * Followup fix to 0.3.12 but addresses the issue of spaces in project directories.

### 0.3.12
  * The sass watcher was not working on windows until now. See #16 for more details. First cut debugging + fix is in.

### 0.3.11
  * This is the same as 0.3.9 - but just made a newer release to fix regression introduced by 0.3.10

### 0.3.10
  * This release inadvertently brought back a bug regarding watchers. Please upgrade to 0.3.11 .

### 0.3.9
  * In case process is killed, do not return soon but rather let the api user handle it better. API internals only. Transparent to the user.

### 0.3.6
  * In case the external sass process gets killed then indicate the error as opposed to (silently) ignoring the same.

### 0.3.4
  * Bug fix in case of sass watchers. In case , the sass watcher process is not launched correctly, a false positive is reported today.
    After this release, in case pid is undefined or null, the watcher is not launched at all.

### 0.3.2
  * Documentation changes with some clarity about `dartsass.sassBinPath` and "Sass watcher" functionality.

### 0.3.1
  * Documentation changes

### 0.3.0
  * Bugfix related to `DartSass: Clear All Sass watchers` not updating sass watchers in case of corner cases.

### 0.2.9
  * Plugin activated in case of sass files also. So far, plugin was activated only  in case of scss files.
  * New command `DartSass: Clear All Sass Watchers` added. This is useful if we want to clear all sass watchers without trying to figure out the existing watchers and unwatching individually.

### 0.2.8
  * In case of minified files, the sass watcher still uses the prefix .css (as opposed to .min.css which seems more logical) when we specify `targetMinifiedDirectory`.

    Until now, when we edit files in the editor and save, the plugin used to save minified files with a .min.css extension.

    To synchronize behavior with underlying sass watcher nomenclature, from now on, even in editor when we save files, the minified files are saved as `.css` files only without the `.min` suffix in it.

    Of course, in case `targetDirectory` and `targetMinifiedDirectory` are the same , then `.min.css` suffix is used so as to not step on/overwrite non-minified files by mistake.

### 0.2.7
  * Follow up to the previous release addressing #17.

    In case, `targetMinifiedDirectory` is not specified then the second sass watcher for minified directory is not launched.
    Since this would end up with having 2 watchers with the same destination directory and it causes confusion , the plugin prefer to not launch the minified sass launcher in case `targetMinifiedDirectory` is not specified.

### 0.2.6
  * Very important bugfix. See #17 for more details.
    There was a bug related to how watchers were generating only minified files and not the non-minified files. Also there was an issue with nomenclature ( minified files getting generated in files without the .min.css suffix). Please upgrade to fix the same.
    From now on, 2 sass watcher processes get launched with every `DartSass: Watch Directory` menuitem/command.  The first watcher generates normal css files without being minified and the second watcher generates the minified files as well. More CPU load as well.
    If the flag - `disableMinifiedFileGeneration` is set , then the second watcher process is not launched at all.


### 0.2.5
  * Upgrade built-in sass to 1.25.0 .

### 0.2.4
  * Upgrade built-in sass to 1.24.5 .
  * Upgrade autoprefixer to 9.7.4


### 0.2.3
  * Better documentation explaining `watchDirectories` property added.

### 0.2.2
  * Remove deprecated command from the list of watchers.

### 0.2.1
  * A better efficient way of restarting watchers after a session of vsce.


### 0.2.0
  * Upgrade built-in sass library to 1.24.4.
  * New feature added to watch directories that persists across sessions.
    Hence, sass directories previously watched before the last exit of vsce , continue to get watched after the restart as well.

### 0.1.1
  * Upgrade sass to 1.24.1 , browserslist and postcss libraries as well.

### 0.1.0
  * Remove support for `node-sass-package-importer` altogether.
    This would also indicate removal of support of "~" prefix in import statements.
    If you had used "~" earlier, feel free to remove the "~" in the import statements and add `node_modules` to `importPath` property (list of strings) to include the same.
    Hence `sassWorkingDirectory` property has been removed as well, as it is completely irrelevant.
    See [FAQ 3,4 and 5](https://github.com/codelios/vscode-dartsass#faq) for more details.


### 0.0.88
  * Add important logging statements for watching directory with custom sassBinPath.

### 0.0.87
  * Bugfix on 0.0.86 where the `includePath` directories were not used by the `--watch` option for sass

### 0.0.86
  * Patch `sassBinPath` such that it accepts relative path as well. It accepts relativePath to the current projectRoot (identified by the file edited by the active editor. )

### 0.0.85
### 0.0.84
  * Development version(s) published by mistake. Ignore.

### 0.0.83
  * Upgrade sass to 1.24.0
  * Upgrade postcss, autoprefixer and browserslist libraries.
  * Introduce new property `dartsass.disableSourceMap` that disables source map generation if not necessary. By default, sourceMaps are generated though, as before.

### 0.0.82
  * Add better FAQ documentation to README.

### 0.0.81
  * Upgrade sass , autoprefixer, postcss and browserslist libraries.

### 0.0.80
  * browserlist: default option changed to "> 1%" and "last 2 versions" .

### 0.0.79
  * Upgrade autoprefixer to 9.7.0 , browserslist: 4.7.2  and postcss: 7.0.21.

### 0.0.78
  * Fix a bug about incorrect reloading of watchers when configuration changes.

### 0.0.77
  * Upgrade built-in compiler to sass 1.23.1
  * Fix npm audit errors

### 0.0.76
  * Bugfix about removing inconsistent keyboard shortcuts. See #9 for more details

### 0.0.75
  * Fix 1: SourceMap is consistently generated by the built-in sass compiler or by the external compiler `sassBinPath` as well.
  * Fix 2: When watching directories, minified files are also getting generated (unless `disableMinifiedFileGeneration` is set ). If `disableMinifiedFileGeneration` is set - then the watchers need to be unwatched and rewatched again manually for the changes to be effected.
  * Fix 3: No shell launched when sass watcher is launched.
  * Feature 4: Add menu to unwatch a directory as well. In case the directory was not watched before or being unwatched twice , a warning message appears indicating the same.

### 0.0.74
  * Support for watching directories implemented. See README.md for more details ( menu `DartSass: Sass Compiler Watch` to be specific ).

### 0.0.73
  * Autprefixer now works when `sassBinPath` is set. Fixed now.

### 0.0.72
  * In case, `sassBinPath` is a directory or it does not exist, indicate an error right after config value is set/changed.

### 0.0.71
  * Bug fix related to config not getting properly reloaded and propagated across the plugin

### 0.0.70

  * `dartsass.sassBinPath` property introduced.

    Eg: `/usr/local/bin/sass` PATH of sass binary to be used to compile , as opposed to the sass compiler that comes built-in with the plugin. `Beta` support only.

### 0.0.69
 * Fixed a regression bug related to files with underscores.

### 0.0.68
 * Fixed a regression bug related to targetDirectory. In case, `targetMinifiedDirectory` is empty, it defaults to `targetDirectory`. If that is empty too, it defaults to the same folder as that of the source file.

### 0.0.67
 * Rereleasing 0.0.66 because of an issue with `webpack --mode production`. For now, webpack is used in development mode and published.

### 0.0.66
 * `targetDirectory`: Default: Empty. The target directory to write the generated css files. This can be an absolute directory or a directory, relative to project root.
 * `targetMinifiedDirectory`: Default: Empty. The target directory to write the generated minified css files. This can be an absolute directory or a directory, relative to project root.

### 0.0.65
  * Bogus release. Published under the wrong name by mistake. Ignore.

### 0.0.64
 - Introduce a property `disableAutoPrefixer` to disable postcss processing using autoprefixer library.
 - Introduce a property `autoPrefixBrowsersList`: Default: `[ "last 2 version"]`. List of browsers to be specified for autoprefixer. See https://github.com/browserslist/browserslist#readme for more details.


### 0.0.63
 - Ignore.


### 0.0.62
 - Introduce a property `enableStartWithUnderscores` to enable compilation of files that start with underscores. By default, `false`. See #2 for more details.

### 0.0.61
 - Ignore files that start with underscores ( See #2 )

### 0.0.60
 - sass compiler 1.23.0

### 0.0.53
 - Packed using webpack 4.41.0

### 0.0.52
 - Upgrade sass compiler to 1.22.12

### 0.0.51
 - Upgrade sass compiler to 1.22.10

### 0.0.50
 - Minimum dependency of vscode is 1.37.0 . It supports array of strings in the settings editor. Can apply to `includePath` property .

### 0.0.49
 - Upgrade sass compiler to 1.22.9

### 0.0.48
 - Upgrade sass compiler to 1.22.8
 - Upgrade node to 10.x

### 0.0.47
 - Upgrade sass compiler to 1.22.7

### 0.0.46
 - Upgrade sass compiler to 1.22.6

### 0.0.45
 - Upgrade sass compiler to 1.22.5

### 0.0.43
 - Upgrade sass compiler to 1.22.4

### 0.0.42
 - Use webpack for faster extension loading

### 0.0.40
 - Minimum requirement is vscode 1.32.0 (Feb 2019)

### 0.0.39
 - Split vscode to @types/vscode and vscode-test

### 0.0.38
 - Sass 1.22.3

### 0.0.34
 - Print the dart sass compiler version at startup in the console log for reference.
 - Better printing of configuration options

### 0.0.33
 - Keyboard shortcut: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd> to print sass Compiler version

### 0.0.32
 - Do not use. Errorneous publishing

### 0.0.31

 - Upgrade to Dart/JS sass compiler 1.21.0

### 0.0.30

 - Introduce a property `disableCompileOnSave` that disables a compilation with every save.


### 0.0.29

 - Introduce a property `pauseInterval` indicating a pause interval in seconds before the compiler kicks off to not hog the cpu resources too frequently.

### 0.0.28
 - Upgrade to sass package `1.20.3` .
 - New Extension Command  `dartsass: Compile Current File` added. Keyboard shortcut: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>

### 0.0.27
### 0.0.26
### 0.0.25
### 0.0.24
 - Do not use. Erroneous publishing.

### 0.0.23
 - Upgrade to sass package `1.20.1` .
 - Sass Compiler Version printed. ( See: dartsass: Sass Compiler Version command)

### 0.0.20
 - Upgrade to sass package `1.16.0` .

### 0.0.19
 - Introduces flag `sync` to use the renderSync API.

### 0.0.18
 - Fix a bug where the workspace folder is not the first one by default, but the one where the document is present.

### 0.0.14
 - Crisper Error dialogs

### 0.0.13
 - Introduce Channels for capturing output

### 0.0.11
 - Bug fix to prevent deactivation

### 0.0.10
 - Fixing details about preserving less state

### 0.0.9
 - First valid version that works with node_modules installed. See INSTALL.md for more details.

### 0.0.8
 - False Version

### 0.0.7
 - False Version

### 0.0.6
 - Add `debug` flag to debug the same.

### 0.0.5
 - Add `disableMinifiedFileGeneration` flag to configure generation of minified files.

### 0.0.4
- Better documentation with more examples

### 0.0.1
- Initial release of dartsass


Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.
