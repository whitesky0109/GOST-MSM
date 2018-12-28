const { JSDOM } = require("jsdom");
const phantom = require('phantom');
const querystring = require('querystring');

class HtmlCrawler {
    constructor() { }

    async read(link, queryParam) {
        const instance = await phantom.create();
        const page = await instance.createPage();
        const url = queryParam
            ? `${link}?${querystring.stringify(queryParam)}`
            : link;
        const status = await page.open(url);
        const content = await page.property('content');

        await instance.exit();

        const convertJQueryDom = (content) => {
            const dom = new JSDOM(content);
            return (require('jquery'))(dom.window);
        };

        return convertJQueryDom(content);
    }
}

module.exports = {
    HtmlCrawler,
}