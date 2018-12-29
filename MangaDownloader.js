const http = require("http");
const https = require('https');
const { URL } = require("url");

const fs = require('fs');
const { Transform } = require('stream');

const archiver = require('archiver');

// child process
class MangaDownloader {

    constructor(title, urlList) {
        this.title = title;
        this.urlList = urlList;
        this.downloadBasePath = "download";
        this.downloadedBasePath = ".";

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

        const pList = [];
        for (const url of urlList) {
            pList.push(this.download(url));
        }

        Promise.all(pList).then(() => {
            this.zip();
        }, (err) => {
            console.error(err);
        });

        return true;
    }

    async getFile(url) {
        const urlObj = new URL(url);
        const protocol = (urlObj.protocol === "https:") ? https : http;

        return new Promise((resolve, reject) => {
            protocol.request(url, async (response) => {
                switch (response.statusCode) {
                    case 200: // success
                        let data = new Transform();
                        response.on('data', (chunk) => data.push(chunk) );
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

    async download(url) {
        const { title, downloadBasePath } = this;
        const path = `${downloadBasePath}/${title}`;

        try {
            const data = await this.getFile(url);

            const filename = url.split("/").pop();
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            fs.writeFileSync(`${path}/${filename}`, data.read());
        } catch (e) {
            console.error(e);
        }
    }

    zip() {
        const { title, downloadBasePath, downloadedBasePath } = this;
        const archive = archiver("zip");
        const path = `${downloadBasePath}/${title}`;

        const output = fs.createWriteStream(`${path}.zip`);
        output.on('close', function () {
            console.log(`generated ${path}.zip`);
        });

        output.on('end', function () {
            fs.rmdir(path);
        });

        archive.on('error', function (err) {
            throw err;
        });
        archive.pipe(output);
        archive.directory(path, path);
        archive.finalize();
    }
}

process.on("message", ({ title, links }) => {
    const md = new MangaDownloader(title, links);
    md.downloads();
});