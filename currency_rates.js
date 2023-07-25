"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.getCurrencyRates = void 0;
var axios_1 = require("axios");
var iconv = require("iconv-lite");
var xml2js_1 = require("xml2js");
function getCurrencyRates(code, date) {
    return __awaiter(this, void 0, void 0, function () {
        var datePattern, formattedDate, url, response, xmlData, parsedData, valutes, _i, valutes_1, valute, rate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof code !== 'string' || typeof date !== 'string') {
                        throw new Error('Missing arguments. Please provide both currency code and date.');
                    }
                    datePattern = /^\d{4}-\d{2}-\d{2}$/;
                    if (!date.match(datePattern)) {
                        throw new Error('Invalid date format. Please use the format "YYYY-MM-DD".');
                    }
                    formattedDate = date.split('-').reverse().join('/');
                    url = "https://www.cbr.ru/scripts/XML_daily.asp?date_req=".concat(formattedDate);
                    return [4 /*yield*/, axios_1.default.get(url, { responseType: 'arraybuffer' })];
                case 1:
                    response = _a.sent();
                    xmlData = iconv.decode(response.data, 'windows-1251');
                    return [4 /*yield*/, (0, xml2js_1.parseStringPromise)(xmlData)];
                case 2:
                    parsedData = _a.sent();
                    valutes = parsedData.ValCurs.Valute;
                    for (_i = 0, valutes_1 = valutes; _i < valutes_1.length; _i++) {
                        valute = valutes_1[_i];
                        if (valute.CharCode[0] === code) {
                            rate = parseFloat(valute.Value[0].replace(',', '.'));
                            return [2 /*return*/, {
                                    code: code,
                                    name: valute.Name[0],
                                    rate: rate,
                                }];
                        }
                    }
                    throw new Error("Currency with code '".concat(code, "' not found for the date '").concat(date, "'."));
            }
        });
    });
}
exports.getCurrencyRates = getCurrencyRates;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, codeIndex, dateIndex, code, date, currencyData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    args = process.argv.slice(2);
                    codeIndex = args[0].indexOf('--code');
                    dateIndex = args[1].indexOf('--date');
                    code = void 0, date = void 0;
                    if (codeIndex !== -1 && dateIndex !== -1) {
                        code = args[0].slice(7);
                        date = args[1].slice(7);
                    }
                    else {
                        throw new Error('Usage: node index.js --code=USD --date=2022-10-08');
                    }
                    return [4 /*yield*/, getCurrencyRates(code, date)];
                case 1:
                    currencyData = _a.sent();
                    console.log("".concat(currencyData.code, " (").concat(currencyData.name, "): ").concat(currencyData.rate.toFixed(4)));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1 || 'An error occurred while fetching currency rates.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
main();
