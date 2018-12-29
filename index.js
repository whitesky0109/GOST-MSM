const { fork } = require('child_process');
const { MangaShowMeCrawler } = require("./MangashowmeCrawler");

(async () => {
    const mc = new MangaShowMeCrawler();

    const list = await mc.readMangaList("아빠는 영웅, 엄마는 정령, 딸인 나는 전생자");

    for (const item of list) {
        console.log(`try ${item.title} downloading...`)
        mc.getMangaLinks(item).then((links) => {
            const cp = fork(`${__dirname}/MangaDownloader.js`);

            cp.on("message", msg => {
                console.log(msg);
            });

            cp.send({
                title: item.title,
                links
            });
        })
    }
})();