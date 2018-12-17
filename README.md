# quiksass README

This plugin generates the .css and .min.css files for the given .scss file.
It gets activated by default for .scss files.

## Features

### Pure Javascript SASS

This VSCode plugin directly depends on the native pure-javascript `sass` implementation.

Check [Dart implementation of SASS](https://sass-lang.com/dart-sass) for more details.

So - it does not depend on node-sass (or indirectly the platform-specific libcss either !).

### NodeSASSPackageImporter

It automatically imports `node-sass-package-importer` as well.

So it is possible to use the following the import notation in the scss files.

Eg:

```
@import '~sass-mq/mq';
```

This will include the modules defined in `package.json` and generated at the `node_modules` directory at the same directory.

By default, it looks at the root directory of the current project.

To customize the same, check `quiksass.sassWorkingDirectory`. More details below in extension settings.

## Requirements



## Extension Settings

This extension contributes the following settings:

* `quiksass.includePath`: Set of directories to be specified as includePath for sass compilation.
* `quiksass.sassWorkingDirectory`: The working directory from which to run the sass compiler. By default it is set to project root. If set, this can be an absolute directory or a directory, relative to project root.

## Known Issues

* Currently the version of ```sass``` package is hardcoded. It would be useful to get it automatically inferred.

## Release Notes

See [CHANGELOG](CHANGELOG.md) for more details.