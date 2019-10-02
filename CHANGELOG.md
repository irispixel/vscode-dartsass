# Change Log
All notable changes to the "dartsass" extension will be documented in this file.

### 0.0.53
 - Packed using webpack 4.41.0

### 0.0.52
 - Upgrade sass compiler to 1.22.12

### 0.0.51
 - Upgrade sass compiler to 1.22.10

### 0.0.50
 - Minimum dependency of vscode is 1.37.0 . It supports array of strings in the settings editor. Can apply to `dartsass.includePath` .

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

 - Introduce a property `dartsass.disableCompileOnSave` that disables a compilation with every save.


### 0.0.29

 - Introduce a property `dartsass.pauseInterval` indicating a pause interval in seconds before the compiler kicks off to not hog the cpu resources too frequently.

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