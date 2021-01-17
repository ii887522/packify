# packify
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

It is a build tool to allow users to just simply specify their dependencies they need and it will automatically download, install and configure them properly.

## Table of Contents
- [For developers reading this in GitHub](https://gitlab.com/ii887522/packify#for-developers-reading-this-in-github)
- [Coding Style](https://gitlab.com/ii887522/packify#coding-style)
- [Prerequisites](https://gitlab.com/ii887522/packify#prerequisites)
- [Build custom-node docker image](https://gitlab.com/ii887522/packify#build-custom-node-docker-image)
- [Install dependencies, build and test project](https://gitlab.com/ii887522/packify#install-dependencies-build-and-test-project)
- [Deploy project](https://gitlab.com/ii887522/packify#deploy-project)
- [Example Usage](https://gitlab.com/ii887522/packify#example-usage)

## For developers reading this in GitHub
Please go to https://gitlab.com/ii887522/packify to start contributing instead.

## Coding Style
This project follows [Javascript Standard Style](https://standardjs.com/). Please familiarize yourself with the rules provided in the coding style and
make sure all the proposed code changes in your commits are conforming to the style before making a merge request. You can also make use of
StandardJS - Javascript Standard Style which is a [Visual Studio Code](https://code.visualstudio.com/) plugin and `test` command under the
[Install dependencies, build and test project](https://gitlab.com/ii887522/packify#install-dependencies-build-and-test-project) section to support you.

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) using Linux containers
- [Visual Studio Code](https://code.visualstudio.com/)
  - Docker
  - EditorConfig for VS Code
  - Markdown All in One
  - Remote - WSL
  - StandardJS - Javascript Standard Style
  - YAML

## Build custom-node docker image

### For Windows:
```sh
cd custom-node
build
cd ..
```

### For Linux:
```sh
cd custom-node
sh build.sh
cd ..
```
<br />

## Install dependencies, build and test project

### For Windows:
```sh
test
```

### For Linux:
```sh
sh test.sh
```
<br />

## Deploy project

### For Windows:
```sh
deploy
```

### For Linux:
```sh
sh deploy.sh
```
<br />

## Example Usage
```js
'use strict'

import { options, dependencies, zip, dll } from '@ii887522/packify'

options.outDirPath = 'test/libs/'
options.x86DllOutDirPaths = ['test/Debug/', 'test/Release/', 'test/Test/']
options.x64DllOutDirPaths = ['test/x64/Debug/', 'test/x64/Release/', 'test/x64/Test/']
const accessToken = '<access-token>'

dependencies(async () => {
  await Promise.all([
    zip('https://www.libsdl.org/release/SDL2-devel-2.0.12-VC.zip'),
    zip('https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-2.0.5-VC.zip'),
    zip('https://www.libsdl.org/projects/SDL_ttf/release/SDL2_ttf-devel-2.0.15-VC.zip'),
    zip('https://gitlab.com/api/v4/projects/23071534/packages/generic/utfcpp/3.1.2/utfcpp-3.1.2.zip', { 'PRIVATE-TOKEN': accessToken })
  ])
  dll('x86', 'SDL2-2.0.12/lib/x86/SDL2.dll')
  dll('x64', 'SDL2-2.0.12/lib/x64/SDL2.dll')
  dll('x86', 'SDL2_image-2.0.5/lib/x86/libpng16-16.dll')
  dll('x86', 'SDL2_image-2.0.5/lib/x86/SDL2_image.dll')
  dll('x86', 'SDL2_image-2.0.5/lib/x86/zlib1.dll')
  dll('x64', 'SDL2_image-2.0.5/lib/x64/libpng16-16.dll')
  dll('x64', 'SDL2_image-2.0.5/lib/x64/SDL2_image.dll')
  dll('x64', 'SDL2_image-2.0.5/lib/x64/zlib1.dll')
  dll('x86', 'SDL2_ttf-2.0.15/lib/x86/libfreetype-6.dll')
  dll('x86', 'SDL2_ttf-2.0.15/lib/x86/SDL2_ttf.dll')
  dll('x64', 'SDL2_ttf-2.0.15/lib/x64/libfreetype-6.dll')
  dll('x64', 'SDL2_ttf-2.0.15/lib/x64/SDL2_ttf.dll')
})
```
