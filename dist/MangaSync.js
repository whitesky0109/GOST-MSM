"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var MangaSync = /** @class */ (function () {
    function MangaSync() {
        this.file = "setting.json";
        var fileContent = fs.existsSync("" + this.file)
            ? fs.readFileSync(this.file)
            : JSON.stringify({
                manga: {},
            });
        this.meta = JSON.parse(fileContent);
        if (!fs.existsSync("" + this.file)) {
            this.meta.created = (new Date()).toISOString();
            this.fileSync();
        }
    }
    MangaSync.prototype.fileSync = function () {
        try {
            this.meta.updated = (new Date()).toISOString();
            fs.writeFileSync(this.file, JSON.stringify(this.meta, null, 2));
        }
        catch (e) {
            console.error(e);
        }
    };
    MangaSync.prototype.addManga = function (title, subtitle, info) {
        if (!this.meta.manga[title]) {
            this.meta.manga[title] = {};
        }
        this.meta.manga[title][subtitle] = Object.assign(info, {
            created: (new Date()).toISOString(),
        });
    };
    MangaSync.prototype.findManga = function (name) {
        var manga = this.meta.manga;
        return manga[name];
    };
    return MangaSync;
}());
exports.default = MangaSync;
//# sourceMappingURL=MangaSync.js.map