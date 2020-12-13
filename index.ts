'use strict'

import { get } from 'https'
import JSZip from 'jszip'
import { mkdirSync, writeFile, rmdir, mkdir } from 'fs'

export const options = {
    /**
     * It must be assigned to a valid directory path and ends with /
     */
    outDirPath: ''
}

/**
 * @param run it must only contain function calls with file extension function name
 *
 * Must Call Time(s): 1
 */
export function dependencies(run: () => void) {
    rmdir(options.outDirPath, { recursive: true }, _ => {
        mkdir(options.outDirPath, err => {
            if (err) throw err
        })
    })
    run()
}

/**
 * zip is a file extension name. It must only be called in a function that is passed to dependencies function.
 * @param url it must starts with https://
 */
export function zip(url: string) {
    get(url, res => {
        const file = new Uint8Array(Number(res.headers['content-length']));
        let fileSize = 0
        res.on('data', chunk => {
            file.set(chunk, fileSize)
            fileSize += chunk.length
        }).on('end', async () => {
            (await JSZip.loadAsync(file)).forEach((relativePath, file) => {
                if (file.dir) mkdirSync(`${options.outDirPath}${relativePath}`)
                else (async () => {
                    writeFile(`${options.outDirPath}${relativePath}`, await file.async('uint8array'), err => {
                        if (err) throw err
                    })
                })()
            })
        }).on('error', err => {
            throw err
        })
    }).on('error', err => {
        throw err
    })
}
