# packify
[![Semantic Versioning 2.0.0](https://img.shields.io/badge/semver-2.0.0-standard.svg)](https://semver.org/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Linux](https://svgshare.com/i/Zhy.svg)](https://svgshare.com/i/Zhy.svg)
[![Windows](https://svgshare.com/i/ZhY.svg)](https://svgshare.com/i/ZhY.svg)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-ffff00.svg)](https://www.javascript.com)
[![made-with-typescript](https://img.shields.io/badge/Made%20with-TypeScript-0000e0.svg)](https://www.typescriptlang.org/)
[![Npm package version](https://badgen.net/npm/v/@ii887522/packify)](https://www.npmjs.com/package/@ii887522/packify)
[![Npm package daily downloads](https://badgen.net/npm/dm/@ii887522/packify)](https://npmjs.com/package/@ii887522/packify)
[![Npm package license](https://badgen.net/npm/license/@ii887522/packify)](https://npmjs.com/package/@ii887522/packify)
[![Npm package dependents](https://badgen.net/npm/dependents/@ii887522/packify)](https://npmjs.com/package/@ii887522/packify)

It is a build tool to allow users to just simply specify their dependencies they need and it will automatically download, install and configure them properly.

## Table of contents
- [Coding style](https://github.com/ii887522/packify#coding-style)
- [Prerequisites](https://github.com/ii887522/packify#prerequisites)
- [Install dependencies](https://github.com/ii887522/packify#install-dependencies)
- [Lint the project](https://github.com/ii887522/packify#lint-the-project)
- [Build the project](https://github.com/ii887522/packify#build-the-project)
- [Test the project](https://github.com/ii887522/packify#test-the-project)
- [Example usage](https://github.com/ii887522/packify#example-usage)

## Coding style
This project follows [Javascript Standard Style](https://standardjs.com/). Please familiarize yourself with the rules provided in the coding style and
make sure all the proposed code changes in your commits are conforming to the style before making a merge request. You can also make use of
StandardJS - Javascript Standard Style which is a [Visual Studio Code](https://code.visualstudio.com/) plugin and `npm run lint` command under the
[Lint the project](https://github.com/ii887522/packify#lint-the-project) section to support you.

## Prerequisites
- Windows 11 or Linux
- [Visual Studio Code](https://code.visualstudio.com/) with plugins:
  - EditorConfig for VS Code
  - Markdown All in One
  - StandardJS - Javascript Standard Style
  - YAML
- [Node.js 16.3.2](https://nodejs.org/en/) and later

## Install dependencies
```sh
npm install
```

### Lint the project
```sh
npm run lint
```

### Build the project
```sh
npm run build
```

### Test the project
```sh
npm test
```

## Example usage
```js
'use strict'

import { options, dependencies, zip, file, dll } from '@ii887522/packify'

const projectDirPath = 'test'

options.outDirPath = `${projectDirPath}/lib`
options.x86DllOutDirPaths = [`${projectDirPath}/Debug`, `${projectDirPath}/Release`, `${projectDirPath}/Test`]
options.x64DllOutDirPaths = [`${projectDirPath}/x64/Debug`, `${projectDirPath}/x64/Release`, `${projectDirPath}/x64/Test`]

dependencies(async () => {
  const glfwVersion = '3.3.6'
  const sdl2Version = '2.0.20'
  const sdl2ImageVersion = '2.0.5'
  const sdl2TTFVersion = '2.0.18'
  const nitroVersion = '1.4.4'
  await Promise.all([
    zip(`https://github.com/glfw/glfw/releases/download/${glfwVersion}/glfw-${glfwVersion}.bin.WIN64.zip`),
    zip(`https://www.libsdl.org/release/SDL2-devel-${sdl2Version}-VC.zip`),
    zip(`https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-${sdl2ImageVersion}-VC.zip`),
    zip(`https://www.libsdl.org/projects/SDL_ttf/release/SDL2_ttf-devel-${sdl2TTFVersion}-VC.zip`),
    file('https://raw.githubusercontent.com/nothings/stb/master/stb_image.h'),
    zip('https://github.com/ubawurinna/freetype-windows-binaries/archive/refs/tags/v2.11.1.zip'),
    zip(`https://github.com/ii887522/nitro/releases/download/v${nitroVersion}/nitro-${nitroVersion}.zip`),
    file('https://github.com/catchorg/Catch2/releases/download/v2.13.8/catch.hpp')
  ])
  dll('x86', `SDL2-${sdl2Version}/lib/x86/SDL2.dll`)
  dll('x64', `SDL2-${sdl2Version}/lib/x64/SDL2.dll`)
  dll('x86', `SDL2_image-${sdl2ImageVersion}/lib/x86/libpng16-16.dll`)
  dll('x86', `SDL2_image-${sdl2ImageVersion}/lib/x86/SDL2_image.dll`)
  dll('x86', `SDL2_image-${sdl2ImageVersion}/lib/x86/zlib1.dll`)
  dll('x64', `SDL2_image-${sdl2ImageVersion}/lib/x64/libpng16-16.dll`)
  dll('x64', `SDL2_image-${sdl2ImageVersion}/lib/x64/SDL2_image.dll`)
  dll('x64', `SDL2_image-${sdl2ImageVersion}/lib/x64/zlib1.dll`)
  dll('x86', `SDL2_ttf-${sdl2TTFVersion}/lib/x86/SDL2_ttf.dll`)
  dll('x64', `SDL2_ttf-${sdl2TTFVersion}/lib/x64/SDL2_ttf.dll`)
})
```
