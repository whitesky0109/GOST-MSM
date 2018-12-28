const http = require("http");
const https = require('https');
const { URL } = require("url");

const fs = require('fs');
const { Transform } = require('stream');

const archiver = require('archiver');

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

    download() {
        const { title, urlList, downloadBasePath } = this;
        let downloadCnt = 0;
        if (fs.existsSync(`${title}.zip`)) {
            console.log("already downloaded file");
            return true;
        }

        const path = `${downloadBasePath}/${title}`;
        for (const url of urlList) {
            const urlObj = new URL(url);
            const protocol = (urlObj.protocol === "https:") ? https : http;
    
            const self = this;
            protocol.request(url, function (response) {
                var data = new Transform();
    
                response.on('data', (chunk) => data.push(chunk));
                response.on('end', function () {
                    const filename = url.split("/").pop();
                    if (!fs.existsSync(path)) {
                        fs.mkdirSync(path);
                    }
                    fs.writeFileSync(`${path}/${filename}`, data.read());
                    console.log(`${title} ${filename} download complete`);

                    downloadCnt++;
                    if (urlList.length === downloadCnt) {
                        self.zip();
                    }
                });
            }).end();
        }

        return true;
    }

    zip() {
        const { title, downloadBasePath, downloadedBasePath } = this;
        const archive = archiver("zip");
        const path = `${downloadBasePath}/${title}`;
        console.log(`generate ${title}.zip`);

        const output = fs.createWriteStream(`${path}.zip`);
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        output.on('end', function() {
            fs.rmdir(path);
        });
         
        archive.on('error', function(err){
            throw err;
        });
        archive.pipe(output);
        archive.directory(title, title);
        archive.finalize();
    }
}

module.exports = {
    MangaDownloader,
}