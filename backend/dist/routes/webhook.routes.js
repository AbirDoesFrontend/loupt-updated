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
exports.updateKycStatus = void 0;
const user_schema_1 = require("../models/user.schema");
const investment_schema_1 = require("../models/investment.schema");
const user_service_1 = require("../services/user.service");
const transactapi_service_1 = require("../services/transactapi.service");
const fundingRound_schema_1 = require("../models/fundingRound.schema");
function updateKycStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("received callback!!!");
            console.log(req.body);
            const partyId = req.body.partyId;
            const kycStatus = req.body.kycStatus;
            const amlStatus = req.body.amlStatus;
            const existing = yield user_schema_1.User.findOne({ partyId: partyId }).exec();
            if (!existing) {
                return res.status(404).send("user not found");
            }
            const user = existing;
            user.kycStatus = kycStatus;
            user.amlStatus = amlStatus;
            (0, user_service_1.updateUserKycInfo)(user);
            //Now, look at investments that we have stored
            if (user.kycStatus == "Auto Approved" || user.kycStatus == "Approved") {
                const investments = yield investment_schema_1.Investment.find({ userId: user.userId }).exec();
                for (const investment of investments) {
                    const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: investment.roundId }).exec();
                    if (!round) {
                        console.error(`Unable to find round with id ${investment.roundId}`);
                        throw new Error(`Unable to find round with id ${investment.roundId}`);
                    }
                    const tradeId = yield (0, transactapi_service_1.createTapiTrade)(user.userId, round.tapiOfferingId, investment.amount);
                    if (!tradeId) {
                        console.error(`Unable to create trade for user ${user.userId} for round ${round.roundId}`);
                        throw new Error(`Unable to create trade for user ${user.userId} for round ${round.roundId}`);
                    }
                    investment.tapiTradeId = tradeId;
                    yield investment.save();
                }
            }
            return res.status(200).send("success");
        }
        catch (e) {
            console.error(`Unable to complete callbackTest request.\n ${e}`);
        }
    });
}
exports.updateKycStatus = updateKycStatus;
