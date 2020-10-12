"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.SyncState = void 0;
var event_emitter_1 = require("@antv/event-emitter");
var SyncState;
(function (SyncState) {
    SyncState["reading"] = "reading";
    SyncState["finish"] = "finish";
    SyncState["error"] = "error";
})(SyncState = exports.SyncState || (exports.SyncState = {}));
var Datax = /** @class */ (function (_super) {
    __extends(Datax, _super);
    function Datax(reader, writer) {
        var _this = _super.call(this) || this;
        _this.syncDataCount = 0;
        _this.start(reader, writer);
        return _this;
    }
    Datax.prototype.start = function (reader, writer) {
        return __awaiter(this, void 0, void 0, function () {
            var state, readerData, result, result, writeRes, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, reader.init()];
                    case 1:
                        _a.sent();
                        state = SyncState.reading;
                        _a.label = 2;
                    case 2: return [4 /*yield*/, reader.read()];
                    case 3:
                        readerData = _a.sent();
                        state = readerData.state;
                        if (!(state === SyncState.finish)) return [3 /*break*/, 4];
                        result = { count: this.syncDataCount, msg: '完成数据同步' };
                        this.emit('finish', result);
                        return [3 /*break*/, 7];
                    case 4:
                        if (!(state === SyncState.error)) return [3 /*break*/, 5];
                        result = { count: this.syncDataCount, msg: readerData.msg, err: readerData.err };
                        this.emit('error', result);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, writer.write(readerData.data).catch(function (err) {
                            state = SyncState.error;
                            var result = { count: _this.syncDataCount, msg: '数据写入失败', err: err };
                            _this.emit('error', result);
                        })];
                    case 6:
                        writeRes = _a.sent();
                        if (writeRes !== undefined) {
                            this.syncDataCount += readerData.data.length;
                            result = { count: this.syncDataCount };
                            this.emit('data', result);
                        }
                        _a.label = 7;
                    case 7:
                        if (state === SyncState.reading) return [3 /*break*/, 2];
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Datax;
}(event_emitter_1.default));
exports.default = Datax;
