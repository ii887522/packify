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
