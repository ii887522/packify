'use strict'

import { get } from 'https'
import JSZip from 'jszip'
import { mkdirSync, writeFile, copyFile } from 'fs'
import { OutgoingHttpHeaders } from 'http'
import { consume, emptyDir, getFileName, substring, DynamicUint8Array } from '@ii887522/hydro'
import { decode } from 'html-entities'

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

let emptyDirPromise: Promise<void>

/**
 * It must only be called 1 time in dependencies function
 */
function emptyDirs (): void {
  emptyDirPromise = emptyDir(options.outDirPath)
  for (const path of options.x86DllOutDirPaths) consume(emptyDir(path))
  for (const path of options.x64DllOutDirPaths) consume(emptyDir(path))
}

/**
 * Dependencies inside a code block is passed as an argument to this function to ensure proper setup is happened.
 *
 * It must only be called 1 time in build script.
 * @param run it must only contain function calls with file extension function name and promise related functions
 */
export function dependencies (run: () => void): void {
  emptyDirs()
  run()
}

/**
 * zip is a file extension name. It must only be called in a function that is passed to dependencies function.
 * @param url it must starts with https://
 */
export async function zip (url: string, headers?: OutgoingHttpHeaders): Promise<void> {
  return await new Promise((resolve, reject) => {
    get(url, { headers }, res => {
      if (res.headers['content-type']?.startsWith('text/html') === true) {
        let file = ''
        res.on('data', chunk => {
          file += chunk as string
        }).on('end', () => {
          consume((async () => {
            await zip(decode(substring(file, 'http', '"')))
            resolve()
          })())
        }).on('error', _err => reject)
      } else if (res.headers['content-length'] !== undefined) {
        const file = new Uint8Array(Number(res.headers['content-length']))
        let fileSize = 0
        res.on('data', chunk => {
          file.set(chunk, fileSize)
          fileSize += chunk.length as number
        }).on('end', () => {
          consume((async () => {
            const jsZip = await JSZip.loadAsync(file)
            let pendingEntryCount = 0
            jsZip.forEach((_relativePath, _file) => {
              ++pendingEntryCount
            })
            await emptyDirPromise
            jsZip.forEach((relativePath, file) => {
              if (file.dir) {
                mkdirSync(`${options.outDirPath}${relativePath}`)
                --pendingEntryCount
              } else {
                consume((async () => {
                  writeFile(`${options.outDirPath}${relativePath}`, await file.async('uint8array'), err => {
                    if (err !== null) reject(err)
                    if (--pendingEntryCount === 0) resolve()
                  })
                })())
              }
            })
          })())
        }).on('error', _err => reject)
      } else {
        const file = new DynamicUint8Array()
        res.on('data', chunk => {
          file.add(chunk)
        }).on('end', () => {
          consume((async () => {
            const jsZip = await JSZip.loadAsync(file.get())
            let pendingEntryCount = 0
            jsZip.forEach((_relativePath, _file) => {
              ++pendingEntryCount
            })
            await emptyDirPromise
            jsZip.forEach((relativePath, file) => {
              if (file.dir) {
                mkdirSync(`${options.outDirPath}${relativePath}`)
                --pendingEntryCount
              } else {
                consume((async () => {
                  writeFile(`${options.outDirPath}${relativePath}`, await file.async('uint8array'), err => {
                    if (err !== null) reject(err)
                    if (--pendingEntryCount === 0) resolve()
                  })
                })())
              }
            })
          })())
        }).on('error', _err => reject)
      }
    }).on('error', _err => reject)
  })
}

/**
 * file is just a single file. It must only be called in a function that is passed to dependencies function.
 * @param url it must starts with https://
 */
export async function file (url: string, headers?: OutgoingHttpHeaders): Promise<void> {
  return await new Promise((resolve, reject) => {
    get(url, { headers }, res => {
      if (res.headers['content-type']?.startsWith('text/html') === true) {
        let fileContent = ''
        res.on('data', chunk => {
          fileContent += chunk as string
        }).on('end', () => {
          consume((async () => {
            await file(decode(substring(fileContent, 'http', '"')))
            resolve()
          })())
        }).on('error', _err => reject)
      } else if (res.headers['content-length'] !== undefined) {
        const fileContent = new Uint8Array(Number(res.headers['content-length']))
        let fileSize = 0
        res.on('data', chunk => {
          fileContent.set(chunk, fileSize)
          fileSize += chunk.length as number
        }).on('end', () => {
          consume((async () => {
            await emptyDirPromise
            writeFile(`${options.outDirPath}${getFileName(url)}`, fileContent, err => {
              if (err !== null) reject(err)
              resolve()
            })
          })())
        }).on('error', _err => reject)
      } else {
        const fileContent = new DynamicUint8Array()
        res.on('data', chunk => {
          fileContent.add(chunk)
        }).on('end', () => {
          consume((async () => {
            await emptyDirPromise
            writeFile(`${options.outDirPath}${getFileName(url)}`, fileContent.get(), err => {
              if (err !== null) reject(err)
              resolve()
            })
          })())
        }).on('error', _err => reject)
      }
    }).on('error', _err => reject)
  })
}

/**
 * dll is a file extension name. It must only be called in a function that is passed to dependencies function.
 */
export function dll (platform: 'x86' | 'x64', path: string): void {
  let dllOutDirPaths: string[]
  switch (platform) {
    case 'x86': dllOutDirPaths = options.x86DllOutDirPaths
      break
    case 'x64': dllOutDirPaths = options.x64DllOutDirPaths
  }
  for (const dllOutDirPath of dllOutDirPaths) {
    copyFile(`${options.outDirPath}${path}`, `${dllOutDirPath}${getFileName(path)}`, err => {
      if (err !== null) throw err
    })
  }
}
