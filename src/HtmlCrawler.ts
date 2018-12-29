const { JSDOM } = require("jsdom");
import * as phantom from "phantom";
import * as querystring from "querystring";

export default class HtmlCrawler {
    constructor() { }

    public async read(link, queryParam?) {
        const instance = await phantom.create();
        const page = await instance.createPage();
        const url = queryParam
            ? `${link}?${querystring.stringify(queryParam)}`
            : link;
        await page.open(url);
        const content = await page.property('content');

        await instance.exit();

        const convertJQueryDom = (content) => {
            const dom = new JSDOM(content);
            return (require('jquery'))(dom.window);
        };

        return convertJQueryDom(content);
    }
}
