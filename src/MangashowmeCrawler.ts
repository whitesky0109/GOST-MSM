import "reflect-metadata";
import {Service} from "typedi";

import HtmlCrawler from "./HtmlCrawler";

@Service()
export default class MangaShowMeCrawler extends HtmlCrawler {
    private host: string = "https://mangashow.me";

    constructor() {
        super();
    }

    async readMangaList(manga_name: string) {
        console.log(`query ${manga_name} from ${this.host}`);
        const jq = await this.read(`${this.host}/bbs/page.php`, {
            hid: "manga_detail",
            manga_name,
        });

        return this.parseMangaList(jq);
    }

    parseMangaList($) {
        const slotList = $.find(".slot");
        const list = [];

        const getTitle = (slot) => {
            const slotTexts = $(slot).text().split("\n");
            let title;
            for (const text of slotTexts) {
                if (text) {
                    title = text.trim();
                    break;
                }
            }

            return title;
        }
        const getLink = (slot) => {
            const aTag = $(slot).find("a");

            return aTag.attr("href");
        }

        for (const slot of slotList) {
            const title = getTitle(slot);
            const link = getLink(slot);

            list.push({
                title,
                link,
            });
        }

        return list;
    }


    async getMangaLinks({ link }) {
        const $ = await this.read(link);
        const links = [];

        const imgs = $.find(".view-content img");

        for (const img of imgs) {
            links.push($(img).attr("src"));
        }

        return links;
    }
}