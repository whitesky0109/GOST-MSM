"use strict";
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
var http = require("http");
var https = require("https");
var fs = require("fs");
var stream_1 = require("stream");
var archiver = require('archiver');
// child process
var MangaDownloader = /** @class */ (function () {
    function MangaDownloader(title, urlList) {
        this.title = title;
        this.urlList = urlList;
        this.downloadBasePath = "download";
        this.downloadedBasePath = ".";
        this.createDownloadPath();
    }
    MangaDownloader.prototype.createDownloadPath = function () {
        var downloadBasePath = this.downloadBasePath;
        if (!fs.existsSync(downloadBasePath)) {
            fs.mkdirSync(downloadBasePath);
        }
    };
    MangaDownloader.prototype.downloads = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, urlList, pList, _i, urlList_1, url;
            var _this = this;
            return __generator(this, function (_b) {
                _a = this, title = _a.title, urlList = _a.urlList;
                if (fs.existsSync(title + ".zip")) {
                    console.log("already downloaded file");
                    return [2 /*return*/, true];
                }
                pList = [];
                for (_i = 0, urlList_1 = urlList; _i < urlList_1.length; _i++) {
                    url = urlList_1[_i];
                    pList.push(this.download(url));
                }
                Promise.all(pList).then(function () { return __awaiter(_this, void 0, void 0, function () {
                    var zipInfo, baseInfo, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                baseInfo = {
                                    title: title,
                                    images: urlList.length,
                                };
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                console.log("try " + title + " zipping...");
                                return [4 /*yield*/, this.zip()];
                            case 2:
                                zipInfo = _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.error(e_1);
                                return [3 /*break*/, 4];
                            case 4:
                                process.send(Object.assign(baseInfo, zipInfo));
                                return [2 /*return*/];
                        }
                    });
                }); }, function (err) {
                    console.error(err);
                });
                return [2 /*return*/, true];
            });
        });
    };
    MangaDownloader.prototype.getFile = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var urlObj, protocol;
            var _this = this;
            return __generator(this, function (_a) {
                urlObj = new URL(url);
                protocol = (urlObj.protocol === "https:") ? https : http;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        protocol.request(url, function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, data_1, _b, e_2;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = response.statusCode;
                                        switch (_a) {
                                            case 200: return [3 /*break*/, 1];
                                            case 301: return [3 /*break*/, 2];
                                        }
                                        return [3 /*break*/, 6];
                                    case 1:
                                        data_1 = new stream_1.Transform();
                                        response.on('data', function (chunk) { return data_1.push(chunk); });
                                        response.on('end', function () { return resolve(data_1); });
                                        return [3 /*break*/, 7];
                                    case 2:
                                        _c.trys.push([2, 4, , 5]);
                                        _b = resolve;
                                        return [4 /*yield*/, this.getFile(response.headers.location)];
                                    case 3:
                                        _b.apply(void 0, [_c.sent()]);
                                        return [3 /*break*/, 5];
                                    case 4:
                                        e_2 = _c.sent();
                                        reject(e_2);
                                        return [3 /*break*/, 5];
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        reject(response.statusCode);
                                        _c.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); }).end();
                    })];
            });
        });
    };
    MangaDownloader.prototype.download = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, downloadBasePath, path, data, filename, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, title = _a.title, downloadBasePath = _a.downloadBasePath;
                        path = downloadBasePath + "/" + title;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getFile(url)];
                    case 2:
                        data = _b.sent();
                        filename = url.split("/").pop();
                        if (!fs.existsSync(path)) {
                            fs.mkdirSync(path);
                        }
                        fs.writeFileSync(path + "/" + filename, data.read());
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _b.sent();
                        console.error(e_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MangaDownloader.prototype.zip = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a = _this, title = _a.title, downloadBasePath = _a.downloadBasePath;
            var archive = archiver("zip");
            var path = downloadBasePath + "/" + title;
            var output = fs.createWriteStream(path + ".zip");
            output.on('close', function () {
                resolve({
                    zipFile: title + ".zip",
                    bytes: archive.pointer(),
                });
            });
            archive.on('error', function (err) { return reject(err); });
            archive.pipe(output);
            archive.directory(path, path);
            archive.finalize();
        });
    };
    return MangaDownloader;
}());
process.on("message", function (_a) {
    var title = _a.title, links = _a.links;
    var md = new MangaDownloader(title, links);
    md.downloads();
});
//# sourceMappingURL=MangaDownloader.js.map