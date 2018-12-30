import "reflect-metadata";
import {Service} from "typedi";

import * as http from "http";
import * as https from "https";

import * as fs from "fs";
import {Transform} from 'stream';

const archiver = require('archiver');

// child process
@Service()
class MangaDownloader {
    downloadBasePath: string = "download";
    downloadedBasePath: string = "."

    constructor(private title: string, private urlList: any[]) {
        this.createDownloadPath();
    }

    createDownloadPath() {
        const { downloadBasePath } = this;
        if (!fs.existsSync(downloadBasePath)) {
            fs.mkdirSync(downloadBasePath);
        }
    }

    async downloads() {
        const { title, urlList } = this;
        if (fs.existsSync(`${title}.zip`)) {
            console.log("already downloaded file");
            return true;
        }

        const pList: any[] = [];
        for (const url of urlList) {
            pList.push(this.download(url));
        }

        Promise.all(pList).then(async () => {
            let zipInfo: any;
            let baseInfo: any = {
                title,
                images: urlList.length,
            };
            try {
                console.log(`try ${title} zipping...`);
                zipInfo = await this.zip();
            } catch (e) {
                console.error(e);
            }
            process.send(Object.assign(baseInfo, zipInfo,));
        }, (err) => {
            console.error(err);
        });

        return true;
    }

    async getFile(url): Promise<any> {
        const urlObj: URL = new URL(url);
        const protocol: any = (urlObj.protocol === "https:") ? https : http;

        return new Promise((resolve, reject) => {
            protocol.request(url, async (response: any) => {
                switch (response.statusCode) {
                    case 200: // success
                        let data: Transform = new Transform();
                        response.on('data', (chunk: any) => data.push(chunk) );
                        response.on('end', () => resolve(data) );
                        break;
                    case 301: // redirect
                        try {
                            resolve(await this.getFile(response.headers.location));
                        } catch (e) {
                            reject(e);
                        }
                        break;
                    default: // etc
                        reject(response.statusCode);
                }
            }).end();
        })
    }

    async download(url: any) {
        const { title, downloadBasePath } = this;
        const path: string = `${downloadBasePath}/${title}`;

        try {
            const data: any = await this.getFile(url);

            const filename: string = url.split("/").pop();
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            fs.writeFileSync(`${path}/${filename}`, data.read());
        } catch (e) {
            console.error(e);
        }
    }

    zip(): Promise<any> {
        return new Promise((resolve, reject) => {
            const { title, downloadBasePath } = this;
            const archive: any = archiver("zip");
            const path: string = `${downloadBasePath}/${title}`;
    
            const output: fs.WriteStream = fs.createWriteStream(`${path}.zip`);
            output.on('close', function () {
                resolve({
                    zipFile: `${title}.zip`,
                    bytes: archive.pointer(),
                });
            });
    
            archive.on('error', (err) => reject(err) );
            archive.pipe(output);
            archive.directory(path, path);
            archive.finalize();
        })
    }
}

process.on("message", ({ title, links }: {title: string, links: any[]}) => {
    const md = new MangaDownloader(title, links);
    md.downloads();
});