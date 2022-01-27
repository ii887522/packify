'use strict'

import { get } from 'https'
import JSZip from 'jszip'
import { mkdirSync, writeFile, copyFile } from 'fs'
import { OutgoingHttpHeaders } from 'http'
import { consume, emptyDir, getFileName, substring, DynamicUint8Array, removeFiles } from '@ii887522/hydro'
import { decode } from 'html-entities'

export const options = {
  /**
   * It must be assigned to a valid directory path but must not ends with /
   */
  outDirPath: '',

  /**
   * It must be assigned to an array of valid directory paths but all paths must not end with /
   */
  x86DllOutDirPaths: [''],

  /**
   * It must be assigned to an array of valid directory paths but all paths must not end with /
   */
  x64DllOutDirPaths: ['']
}

let emptyDirPromise: Promise<void>

function cleanDirs (): void {
  emptyDirPromise = emptyDir(options.outDirPath)
  cleanX86DllOutDirPaths()
  cleanX64DllOutDirPaths()
}

function cleanX86DllOutDirPaths (): void {
  for (const path of options.x86DllOutDirPaths) consume(removeFiles('dll', path))
}

function cleanX64DllOutDirPaths (): void {
  for (const path of options.x64DllOutDirPaths) consume(removeFiles('dll', path))
}

/**
 * This function will help you to automatically download and install dependencies specified in the `run` function received from its parameter.
 *
 * @param run It must only contains calls to functions such as `zip`, `file` and promise related functions.
 */
export function dependencies (run: () => void): void {
  cleanDirs()
  run()
}

/**
 * `zip` is a file extension name. It is called to specify the dependency on a `zip` file stored in the internet. It must only be called in a function that is passed to the
 * `dependencies` function.
 *
 * @param url The uniform resource locator that refers to a `zip` file stored in the internet. It must starts with https://
 * @param headers The HTTP headers used to retrieve the `zip` file stored in the internet specified by the `url` if any.
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
                mkdirSync(`${options.outDirPath}/${relativePath}`, { recursive: true })
                --pendingEntryCount
              } else {
                consume((async () => {
                  writeFile(`${options.outDirPath}/${relativePath}`, await file.async('uint8array'), err => {
                    if (err !== null) {
                      reject(err)
                      return
                    }
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
                mkdirSync(`${options.outDirPath}/${relativePath}`, { recursive: true })
                --pendingEntryCount
              } else {
                consume((async () => {
                  writeFile(`${options.outDirPath}/${relativePath}`, await file.async('uint8array'), err => {
                    if (err !== null) {
                      reject(err)
                      return
                    }
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
 * `file` is just a single file. It is called to specify the dependency on a `file` stored in the internet. It must only be called in a function that is passed to the
 * `dependencies` function.
 *
 * @param url The uniform resource locator that refers to a `file` stored in the internet. It must starts with https://
 * @param name The file name used to store the `file` in the output directory.
 * @param headers The HTTP headers used to retrieve the `zip` file stored in the internet specified by the `url` if any.
 */
export async function file (url: string, name?: string, headers?: OutgoingHttpHeaders): Promise<void> {
  return await new Promise((resolve, reject) => {
    get(url, { headers }, res => {
      if (res.headers['content-type']?.startsWith('text/html') === true) {
        let fileContent = ''
        res.on('data', chunk => {
          fileContent += chunk as string
        }).on('end', () => {
          consume((async () => {
            await file(decode(substring(fileContent, 'http', '"')), name ?? getFileName(url))
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
            writeFile(`${options.outDirPath}/${name ?? getFileName(url)}`, fileContent, err => {
              if (err !== null) {
                reject(err)
                return
              }
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
            writeFile(`${options.outDirPath}/${name ?? getFileName(url)}`, fileContent.get(), err => {
              if (err !== null) {
                reject(err)
                return
              }
              resolve()
            })
          })())
        }).on('error', _err => reject)
      }
    }).on('error', _err => reject)
  })
}

/**
 * `dll` is a file extension name. It is called to copy the dependency specified by the `path` from its parameter to the `dll` output directory specified in the `options`.
 * It must only be called in a function that is passed to the `dependencies` function.
 *
 * @param platform The platform which the `dll` file is going to run on.
 * @param path The file path which is relative to the output directory path specified in the `options` where its file is going to be copied.
 */
export function dll (platform: 'x86' | 'x64', path: string): void {
  for (const dllOutDirPath of getDllOutDirPaths(platform)) {
    copyFile(`${options.outDirPath}/${path}`, `${dllOutDirPath}/${getFileName(path)}`, err => {
      if (err !== null) throw err
    })
  }
}

function getDllOutDirPaths (platform: 'x86' | 'x64'): string[] {
  switch (platform) {
    case 'x86': return options.x86DllOutDirPaths
    case 'x64': return options.x64DllOutDirPaths
  }
}
