const { spawn } = require('child_process');
const { MangaShowMeCrawler } = require("./mangashowmeCrawler");
const { MangaDownloader } = require("./MangaDownloader");

(async function () {
    const mc = new MangaShowMeCrawler();

    const list = await mc.readMangaList("지상 100층");

    for (const item of list) {
        console.log(`try ${item.title} downloading...`)
        const links = await mc.getMangaLinks(item);
        const md = new MangaDownloader(item.title, links);
        md.download();
    }
})();