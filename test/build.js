'use strict'

import { options, dependencies, zip } from '../index.js'

options.outDirPath = 'test/libs/'

dependencies(() => {
    zip('https://www.libsdl.org/release/SDL2-devel-2.0.12-VC.zip')
    zip('https://www.libsdl.org/projects/SDL_image/release/SDL2_image-devel-2.0.5-VC.zip')
    zip('https://www.libsdl.org/projects/SDL_ttf/release/SDL2_ttf-devel-2.0.15-VC.zip')
})
