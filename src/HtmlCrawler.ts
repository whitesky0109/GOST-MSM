const { JSDOM } = require("jsdom");
import * as phantom from "phantom";
import * as querystring from "querystring";

export default class HtmlCrawler {

    constructor() { }

    public async read(link: URL | string, queryParam?: any) {
        const instance: any = await phantom.create();
        const page: any = await instance.createPage();
        const url: any = queryParam
            ? `${link}?${querystring.stringify(queryParam)}`
            : link;

        await page.open(url);
        const content: string = await page.property('content');
        await instance.exit();

        const convertJQueryDom = (content: string) => {
            const dom = new JSDOM(content);
            return (require('jquery'))(dom.window);
        };
        return convertJQueryDom(content);
    }
}
