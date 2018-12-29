import * as fs from "fs";

export default class MangaSync {
    private file: string = "setting.json";
    private meta: any;

    constructor() {
        const fileContent: any = fs.existsSync(`${this.file}`)
            ? fs.readFileSync(this.file)
            : JSON.stringify({
                manga: {},
            });
        this.meta = JSON.parse(fileContent);

        if (!fs.existsSync(`${this.file}`)) {
            this.meta.created = (new Date()).toISOString();
            this.fileSync();
        }
    }

    fileSync() {
        try {
            this.meta.updated = (new Date()).toISOString();
            fs.writeFileSync(this.file, JSON.stringify(this.meta, null, 2) );
        } catch (e) {
            console.error(e);
        }
    }

    addManga(title, subtitle, info) {
        if (!this.meta.manga[title]) {
            this.meta.manga[title] = {};
        }

        this.meta.manga[title][subtitle] = Object.assign(info, {
            created: (new Date()).toISOString(),
        });
    }

    findManga(name) {
        const { manga } = this.meta;
        return manga[name];
    }

}
