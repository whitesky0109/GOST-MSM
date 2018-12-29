"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlCrawler_1 = require("./HtmlCrawler");
var MangaShowMeCrawler = /** @class */ (function (_super) {
    __extends(MangaShowMeCrawler, _super);
    function MangaShowMeCrawler() {
        var _this = _super.call(this) || this;
        _this.host = "https://mangashow.me";
        return _this;
    }
    MangaShowMeCrawler.prototype.readMangaList = function (manga_name) {
        return __awaiter(this, void 0, void 0, function () {
            var jq;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("query " + manga_name + " from " + this.host);
                        return [4 /*yield*/, this.read(this.host + "/bbs/page.php", {
                                hid: "manga_detail",
                                manga_name: manga_name,
                            })];
                    case 1:
                        jq = _a.sent();
                        return [2 /*return*/, this.parseMangaList(jq)];
                }
            });
        });
    };
    MangaShowMeCrawler.prototype.parseMangaList = function ($) {
        var slotList = $.find(".slot");
        var list = [];
        var getTitle = function (slot) {
            var slotTexts = $(slot).text().split("\n");
            var title;
            for (var _i = 0, slotTexts_1 = slotTexts; _i < slotTexts_1.length; _i++) {
                var text = slotTexts_1[_i];
                if (text) {
                    title = text.trim();
                    break;
                }
            }
            return title;
        };
        var getLink = function (slot) {
            var aTag = $(slot).find("a");
            return aTag.attr("href");
        };
        for (var _i = 0, slotList_1 = slotList; _i < slotList_1.length; _i++) {
            var slot = slotList_1[_i];
            var title = getTitle(slot);
            var link = getLink(slot);
            list.push({
                title: title,
                link: link,
            });
        }
        return list;
    };
    MangaShowMeCrawler.prototype.getMangaLinks = function (_a) {
        var link = _a.link;
        return __awaiter(this, void 0, void 0, function () {
            var $, links, imgs, _i, imgs_1, img;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.read(link)];
                    case 1:
                        $ = _b.sent();
                        links = [];
                        imgs = $.find(".view-content img");
                        for (_i = 0, imgs_1 = imgs; _i < imgs_1.length; _i++) {
                            img = imgs_1[_i];
                            links.push($(img).attr("src"));
                        }
                        return [2 /*return*/, links];
                }
            });
        });
    };
    return MangaShowMeCrawler;
}(HtmlCrawler_1.default));
exports.default = MangaShowMeCrawler;
//# sourceMappingURL=MangashowmeCrawler.js.map