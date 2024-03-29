'use strict'

import { options, dependencies, zip, file, dll } from '../index.js'

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
