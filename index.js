'use strict';
import { get } from 'https';
import JSZip from 'jszip';
import { mkdirSync, writeFile, rmdir, mkdir, copyFile } from 'fs';
export const options = {
    outDirPath: '',
    x86DllOutDirPaths: [''],
    x64DllOutDirPaths: ['']
};
export function dependencies(run) {
    rmdir(options.outDirPath, { recursive: true }, _err => {
        mkdir(options.outDirPath, err => {
            if (err)
                throw err;
        });
    });
    run();
}
export function zip(url) {
    return new Promise((resolve, reject) => {
        get(url, res => {
            const file = new Uint8Array(Number(res.headers['content-length']));
            let fileSize = 0;
            res.on('data', chunk => {
                file.set(chunk, fileSize);
                fileSize += chunk.length;
            }).on('end', async () => {
                const jsZip = await JSZip.loadAsync(file);
                let pendingEntryCount = 0;
                jsZip.forEach((_relativePath, _file) => {
                    ++pendingEntryCount;
                });
                jsZip.forEach((relativePath, file) => {
                    if (file.dir) {
                        mkdirSync(`${options.outDirPath}${relativePath}`);
                        --pendingEntryCount;
                    }
                    else
                        (async () => {
                            writeFile(`${options.outDirPath}${relativePath}`, await file.async('uint8array'), err => {
                                if (err)
                                    reject(err);
                                if (--pendingEntryCount === 0)
                                    resolve();
                            });
                        })();
                });
            }).on('error', _err => reject);
        }).on('error', _err => reject);
    });
}
export function getFileName(path) {
    return path.substring(path.lastIndexOf('/') + 1);
}
export function dll(platform, path) {
    let dllOutDirPaths;
    switch (platform) {
        case 'x86':
            dllOutDirPaths = options.x86DllOutDirPaths;
            break;
        case 'x64': dllOutDirPaths = options.x64DllOutDirPaths;
    }
    for (const dllOutDirPath of dllOutDirPaths) {
        copyFile(`${options.outDirPath}${path}`, `${dllOutDirPath}${getFileName(path)}`, err => {
            if (err)
                throw err;
        });
    }
}
