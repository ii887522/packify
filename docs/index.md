# index

## Table of contents
- [options](https://github.com/ii887522/packify/blob/master/docs/index.md#options)
- [dependencies](https://github.com/ii887522/packify/blob/master/docs/index.md#dependencies)
- [zip](https://github.com/ii887522/packify/blob/master/docs/index.md#zip)
- [file](https://github.com/ii887522/packify/blob/master/docs/index.md#file)
- [dll](https://github.com/ii887522/packify/blob/master/docs/index.md#dll)

## **options**
```ts
const options: {
  outDirPath: string,
  x86DllOutDirPaths: string[],
  x64DllOutDirPaths: string[]
}
```
`outDirPath`: It must be assigned to a valid directory path but must not ends with /

`x86DllOutDirPaths`: It must be assigned to an array of valid directory paths but all paths must not end with /

`x64DllOutDirPaths`: It must be assigned to an array of valid directory paths but all paths must not end with /

### **Example usage:**
```ts
options.outDirPath = `${projectDirPath}/lib`
options.x86DllOutDirPaths = [`${projectDirPath}/Debug`, `${projectDirPath}/Release`, `${projectDirPath}/Test`]
options.x64DllOutDirPaths = [`${projectDirPath}/x64/Debug`, `${projectDirPath}/x64/Release`, `${projectDirPath}/x64/Test`]
```
<br />

## **dependencies**
```ts
function dependencies (run: () => void): void
```
This function will help you to automatically download and install dependencies specified in the `run` function received from its parameter.

`run`: It must only contains calls to functions such as `zip`, `file` and promise related functions.

### **Example usage:**
```ts
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
<br />

## **zip**
```ts
async function zip (url: string, headers?: OutgoingHttpHeaders): Promise<void>
```
`zip` is a file extension name. It is called to specify the dependency on a `zip` file stored in the internet. It must only be called in a function that is passed to the `dependencies` function.

`url`: The uniform resource locator that refers to a `zip` file stored in the internet. It must starts with https://

`headers`: The HTTP headers used to retrieve the `zip` file stored in the internet specified by the `url` if any.

### **Example usage:**
```ts
zip(`https://github.com/glfw/glfw/releases/download/${glfwVersion}/glfw-${glfwVersion}.bin.WIN64.zip`)
```
<br />

## **file**
```ts
async function file (url: string, name?: string, headers?: OutgoingHttpHeaders): Promise<void>
```
`file` is just a single file. It is called to specify the dependency on a `file` stored in the internet. It must only be called in a function that is passed to the `dependencies` function.

`url`: The uniform resource locator that refers to a `file` stored in the internet. It must starts with https://

`name`: The file name used to store the `file` in the output directory.

`headers`: The HTTP headers used to retrieve the `zip` file stored in the internet specified by the `url` if any.

### **Example usage:**
```ts
file('https://raw.githubusercontent.com/nothings/stb/master/stb_image.h')
```
<br />

## **dll**
```ts
function dll (platform: 'x86' | 'x64', path: string): void
```
`dll` is a file extension name. It is called to copy the dependency specified by the `path` from its parameter to the `dll` output directory specified in the `options`. It must only be called in a function that is passed to the `dependencies` function.

`platform`: The platform which the `dll` file is going to run on.

`path`: The file path which is relative to the output directory path specified in the `options` where its file is going to be copied.

### **Example usage:**
```ts
dll('x86', `SDL2-${sdl2Version}/lib/x86/SDL2.dll`)
```
<br />
