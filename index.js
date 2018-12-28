const { fork } = require('child_process');
const { MangaShowMeCrawler } = require("./mangashowmeCrawler");

(async function () {
    const mc = new MangaShowMeCrawler();

    const list = await mc.readMangaList("지상 100층");

    for (const item of list) {
        console.log(`try ${item.title} downloading...`)
        mc.getMangaLinks(item).then((links) => {
            let cp = fork(`${__dirname}/MangaDownloader.js`);
            cp.send({
                title: item.title,
                links
            });
        })
    }
})();