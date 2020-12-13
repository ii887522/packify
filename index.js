'use strict';
import { get } from 'https';
import JSZip from 'jszip';
import { mkdirSync, writeFile, rmdir, mkdir } from 'fs';
export const options = {
    outDirPath: ''
};
export function dependencies(run) {
    rmdir(options.outDirPath, { recursive: true }, _ => {
        mkdir(options.outDirPath, err => {
            if (err)
                throw err;
        });
    });
    run();
}
export function zip(url) {
    get(url, res => {
        const file = new Uint8Array(Number(res.headers['content-length']));
        let fileSize = 0;
        res.on('data', chunk => {
            file.set(chunk, fileSize);
            fileSize += chunk.length;
        }).on('end', async () => {
            (await JSZip.loadAsync(file)).forEach((relativePath, file) => {
                if (file.dir)
                    mkdirSync(`${options.outDirPath}${relativePath}`);
                else
                    (async () => {
                        writeFile(`${options.outDirPath}${relativePath}`, await file.async('uint8array'), err => {
                            if (err)
                                throw err;
                        });
                    })();
            });
        }).on('error', err => {
            throw err;
        });
    }).on('error', err => {
        throw err;
    });
}
