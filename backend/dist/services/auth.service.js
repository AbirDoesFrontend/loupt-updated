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
exports.generateToken = exports.loginUserCheck = exports.signupUser = void 0;
const user_schema_1 = require("../models/user.schema");
const idUtils_1 = require("../utils/idUtils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const signupUser = (email, legalName, phoneNumber, pass) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = yield bcrypt.hash(pass, saltRounds);
    const user = new user_schema_1.User({
        userId: (0, idUtils_1.generateUserId)(),
        legalName,
        bio: "",
        email,
        secret,
        countryCode: "+1",
        phoneNumber,
        fundsBalance: 0,
        companies: [],
        connections: [],
        investments: []
    });
    yield user.save();
    return user;
});
exports.signupUser = signupUser;
const loginUserCheck = (email, pass) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: this will need to be modified. 
    const toVerify = user_schema_1.User.findOne({ email: email });
    const user = yield toVerify.exec();
    //if there is no user, return null (invalid credentials)
    if (!user) {
        return null;
    }
    user.secret = user.secret || "$2b$10$qEV4Qxebr9mnAtJJGyONHOaW8cKrBnpg0sr3cxYQZbQzh95WXgYNe"; // TODO: remove hard-coded default password
    const match = yield bcrypt.compare(pass, user.secret);
    //if the password doesn't match, return null (invalid credentials)
    if (!match) {
        return null;
    }
    //successful auth
    return user;
});
exports.loginUserCheck = loginUserCheck;
const generateToken = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ userId, email }, config_1.Config.JWT_SECRET, { expiresIn: "7d" });
    return token;
});
exports.generateToken = generateToken;
