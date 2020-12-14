# packify
It is a build tool to allow users to just simply specify their dependencies they need and it will automatically download, install and configure them properly.

## Table of Contents
- [Prerequisites](https://gitlab.com/ii887522/packify#prerequisites)
- [Build custom-node docker image](https://gitlab.com/ii887522/packify#build-custom-node-docker-image)
- [Install dependencies](https://gitlab.com/ii887522/packify#install-dependencies)
- [Build project](https://gitlab.com/ii887522/packify#build-project)
- [Test project](https://gitlab.com/ii887522/packify#test-project)
- [Deploy project](https://gitlab.com/ii887522/packify#deploy-project)
- [Example Usage](https://gitlab.com/ii887522/packify#example-usage)

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) using Linux containers
- [Visual Studio Code](https://code.visualstudio.com/)
    - Docker
    - EditorConfig for VS Code
    - Markdown All in One
    - Remote - WSL

## Build custom-node docker image
```sh
cd custom-node
build
cd ..
```

## Install dependencies
```sh
install
```

## Build project
```sh
build
```

## Test project
```sh
test
```

## Deploy project
```sh
deploy
```

## Example Usage
```js
'use strict'

import { options, dependencies, zip, dll } from '@ii887522/packify'

options.outDirPath = 'test/libs/'
options.x86DllOutDirPaths = ['test/Debug/', 'test/Release/', 'test/Test/'],
options.x64DllOutDirPaths = ['test/x64/Debug/', 'test/x64/Release/', 'test/x64/Test/']

dependencies(async () => {
    await Promise.all([
        zip('https://www.libsdl.org/release/SDL2-devel-2.0.12-VC.zip'),
        zip('https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-2.0.5-VC.zip'),
        zip('https://www.libsdl.org/projects/SDL_ttf/release/SDL2_ttf-devel-2.0.15-VC.zip')
    ])
    dll('x86', 'SDL2-2.0.12/lib/x86/SDL2.dll')
    dll('x64', 'SDL2-2.0.12/lib/X64/SDL2.dll')
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
