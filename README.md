# packify
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

It is a build tool to allow users to just simply specify their dependencies they need and it will automatically download, install and configure them properly.

## Table of Contents
- [For developers reading this in GitHub](https://gitlab.com/ii887522/packify#for-developers-reading-this-in-github)
- [Contributing](https://gitlab.com/ii887522/packify#contributing)
- [Example Usage](https://gitlab.com/ii887522/packify#example-usage)
- [References](https://gitlab.com/ii887522/packify#references)

## For developers reading this in GitHub
Please go to https://gitlab.com/ii887522/packify to start contributing instead.

## Contributing
Please go to https://gitlab.com/ii887522/packify/-/blob/master/CONTRIBUTING.md to get some information about contributing to packify.

## Example Usage
```js
'use strict'

import { options, dependencies, zip, file, dll } from '../index.js'

options.outDirPath = 'test/libs/'
options.x86DllOutDirPaths = ['test/Debug/', 'test/Release/', 'test/Test/']
options.x64DllOutDirPaths = ['test/x64/Debug/', 'test/x64/Release/', 'test/x64/Test/']
const accessToken = '<access-token>'

dependencies(async () => {
  await Promise.all([
    zip('https://github.com/glfw/glfw/releases/download/3.3.3/glfw-3.3.3.bin.WIN64.zip'),
    zip('https://www.libsdl.org/release/SDL2-devel-2.0.12-VC.zip'),
    zip('https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-2.0.5-VC.zip'),
    zip('https://www.libsdl.org/projects/SDL_ttf/release/SDL2_ttf-devel-2.0.15-VC.zip'),
    file('https://raw.githubusercontent.com/nothings/stb/master/stb_image.h'),
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

## References

### **options**
```ts
const options: {
  outDirPath: string
  x86DllOutDirPaths: string[]
  x64DllOutDirPaths: string[]
}
```
`outDirPath`: It must be assigned to a valid directory path and ends with /

`x86DllOutDirPaths`: It must be assigned to an array of valid directory paths and all ends with / if specifying some x86 dll dependencies

`x64DllOutDirPaths`: It must be assigned to an array of valid directory paths and all ends with / if specifying some x64 dll dependencies
#### **Example usage:**
```ts
options.outDirPath = 'test/libs/'
options.x86DllOutDirPaths = ['test/Debug/', 'test/Release/', 'test/Test/']
options.x64DllOutDirPaths = ['test/x64/Debug/', 'test/x64/Release/', 'test/x64/Test/']
```
<br />

### **dependencies**
```ts
function dependencies (run: () => void): void
```
Dependencies inside a code block is passed as an argument to this function to ensure proper setup is happened.

It must only be called 1 time in build script.

`run`: it must only contain function calls with file extension function name and promise related functions
#### **Example usage:**
```ts
dependencies(async () => {
  await Promise.all([
    zip('https://github.com/glfw/glfw/releases/download/3.3.3/glfw-3.3.3.bin.WIN64.zip'),
    zip('https://www.libsdl.org/release/SDL2-devel-2.0.12-VC.zip'),
    zip('https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-2.0.5-VC.zip'),
    zip('https://www.libsdl.org/projects/SDL_ttf/release/SDL2_ttf-devel-2.0.15-VC.zip'),
    file('https://raw.githubusercontent.com/nothings/stb/master/stb_image.h'),
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
<br />

### **zip**
```ts
async function zip (url: string, headers: OutgoingHttpHeaders): Promise<void>
```
zip is a file extension name. It must only be called in a function that is passed to dependencies function.

`url`: it must starts with https://
#### **Example usage:**
```ts
zip('https://www.libsdl.org/release/SDL2-devel-2.0.12-VC.zip')
```
<br />

### **file**
```ts
async function file (url: string, headers?: OutgoingHttpHeaders): Promise<void>
```
file is just a single file. It must only be called in a function that is passed to dependencies function.

`url`: it must starts with https://
#### **Example usage:**
```ts
file('https://raw.githubusercontent.com/nothings/stb/master/stb_image.h')
```
<br />

### **dll**
```ts
function dll (platform: 'x86' | 'x64', path: string): void
```
dll is a file extension name. It must only be called in a function that is passed to dependencies function.
#### **Example usage:**
```ts
dll('x86', 'SDL2-2.0.12/lib/x86/SDL2.dll')
```
