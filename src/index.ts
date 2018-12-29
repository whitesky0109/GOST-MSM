const {fork} = require("child_process");

import MangaShowMeCrawler from "./MangashowmeCrawler";
import MangaSync from "./MangaSync";

(async () => {
    const title: string = `아빠는 영웅, 엄마는 정령, 딸인 나는 전생자`;
    const mc: MangaShowMeCrawler = new MangaShowMeCrawler();
    const ms: MangaSync = new MangaSync();

    const list: any[] = await mc.readMangaList(title);

    for (const item of list) {
        mc.getMangaLinks(item).then((links: any): void => {
            console.log(`try ${item.title} downloading...`);

            const cp: any = fork(`${__dirname}/./MangaDownloader.js`);
            cp.on("message", (info: any): void => {
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