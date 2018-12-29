const { fork } = require('child_process');
const { MangaShowMeCrawler } = require("./MangashowmeCrawler");
const { MangaSync } = require("./MangaSync");

(async () => {
    const title = `아빠는 영웅, 엄마는 정령, 딸인 나는 전생자`;
    const mc = new MangaShowMeCrawler();
    const ms = new MangaSync();

    const list = await mc.readMangaList(title);

    for (const item of list) {
        console.log(`try ${item.title} downloading...`)
        mc.getMangaLinks(item).then((links) => {
            const cp = fork(`${__dirname}/MangaDownloader.js`);

            cp.on("message", (info) => {
                ms.addManga(title, info.title, info);
                ms.fileSync();
                cp.kill();
            });

            cp.send({
                title: item.title,
                links
            });
        })
    }
})();