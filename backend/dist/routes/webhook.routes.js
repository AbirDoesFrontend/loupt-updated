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
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackTest = void 0;
//import { IUser } from '../models/user.interface';
function callbackTest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            return res.status(200).send("success");
        }
        catch (e) {
            console.error(`Unable to complete callbackTest request.\n ${e}`);
        }
    });
}
exports.callbackTest = callbackTest;
