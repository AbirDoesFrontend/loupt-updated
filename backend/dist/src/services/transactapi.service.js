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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssuerIfNotExist = exports.getApiCount = void 0;
const config_1 = require("../config");
const axios_1 = __importDefault(require("axios"));
const user_schema_1 = require("../models/user.schema");
const tApiRequest = (method, endpoint, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method,
            url: `${config_1.Config.TRANSACTAPI_URI}${endpoint}`,
            data: Object.assign({ developerAPIKey: config_1.Config.TRANSACTAPI_DEVKEY, clientID: config_1.Config.TRANSACTAPI_CLIENTID }, data),
        });
        return response.data;
    }
    catch (error) {
        console.log("here: " + error.response.data);
    }
});
const getApiCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield tApiRequest('POST', `/getApiCount`);
});
exports.getApiCount = getApiCount;
const createIssuerIfNotExist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (existing) {
        if (existing.issuerId == 'none') {
            const response = yield tApiRequest('PUT', `/createIssuer`);
            console.log(response);
        }
        else {
            return false;
        }
    }
});
exports.createIssuerIfNotExist = createIssuerIfNotExist;
