'use strict'

import { get } from 'https'
import JSZip from 'jszip'
import { mkdirSync, writeFile, rmdir, mkdir, copyFile } from 'fs'
import { OutgoingHttpHeaders } from 'http'

export const options = {
    /**
     * It must be assigned to a valid directory path and ends with /
     */
    outDirPath: '',

    /**
     * It must be assigned to an array of valid directory paths and all ends with / if specifying some x86 dll dependencies
     */
    x86DllOutDirPaths: [''],

    /**
     * It must be assigned to an array of valid directory paths and all ends with / if specifying some x64 dll dependencies
     */
    x64DllOutDirPaths: ['']
}

/**
 * @param dirPath it must ends with /
 */
function emptyDir(dirPath: string) {
    rmdir(dirPath, { recursive: true }, _err => {
        mkdir(dirPath, err => {
            if (err) throw err
        })
    })
}

/**
 * Must Call Time(s): 1
 */
function emptyDirs() {
    emptyDir(options.outDirPath)
    for (const path of options.x86DllOutDirPaths) emptyDir(path)
    for (const path of options.x64DllOutDirPaths) emptyDir(path)
}

/**
 * @param run it must only contain function calls with file extension function name and promise related functions
 *
 * Must Call Time(s): 1
 */
export function dependencies(run: () => void) {
    emptyDirs()
    run()
}

/**
 * zip is a file extension name. It must only be called in a function that is passed to dependencies function.
 * @param url it must starts with https://
 */
export function zip(url: string, headers: OutgoingHttpHeaders): Promise<void> {
    return new Promise((resolve, reject) => {
        get(url, { headers }, res => {
            const file = new Uint8Array(Number(res.headers['content-length']));
            let fileSize = 0
            res.on('data', chunk => {
                file.set(chunk, fileSize)
                fileSize += chunk.length
            }).on('end', async () => {
                const jsZip = await JSZip.loadAsync(file)
                let pendingEntryCount = 0
                jsZip.forEach((_relativePath, _file) => {
                    ++pendingEntryCount
                })
                jsZip.forEach((relativePath, file) => {
                    if (file.dir) {
                        mkdirSync(`${options.outDirPath}${relativePath}`)
                        --pendingEntryCount
                    } else (async () => {
                        writeFile(`${options.outDirPath}${relativePath}`, await file.async('uint8array'), err => {
                            if (err) reject(err)
                            if (--pendingEntryCount === 0) resolve()
                        })
                    })()
                })
            }).on('error', _err => reject)
        }).on('error', _err => reject)
    })
}

export function getFileName(path: string) {
    return path.substring(path.lastIndexOf('/') + 1)
}

/**
 * dll is a file extension name. It must only be called in a function that is passed to dependencies function.
 */
export function dll(platform: 'x86' | 'x64', path: string) {
    let dllOutDirPaths: string[]
    switch (platform) {
        case 'x86': dllOutDirPaths = options.x86DllOutDirPaths
            break
        case 'x64': dllOutDirPaths = options.x64DllOutDirPaths
    }
    for (const dllOutDirPath of dllOutDirPaths) {
        copyFile(`${options.outDirPath}${path}`, `${dllOutDirPath}${getFileName(path)}`, err => {
            if (err) throw err
        })
    }
}
