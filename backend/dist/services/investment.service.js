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
exports.linkDocToFundingRound = exports.linkFundingRoundToOffering = exports.addInvestment = exports.createFundingRound = exports.updateFundingRound = exports.getFundingRound = void 0;
const investment_schema_1 = require("../models/investment.schema");
const fundingRound_schema_1 = require("../models/fundingRound.schema");
const user_schema_1 = require("../models/user.schema");
const idUtils_1 = require("../utils/idUtils");
const company_schema_1 = require("../models/company.schema");
/* import { createPartyIndividualIfNotExist } from "./transactapi.service";
 */
const getFundingRound = (roundId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
});
exports.getFundingRound = getFundingRound;
const updateFundingRound = (roundId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage) => __awaiter(void 0, void 0, void 0, function* () {
    const currentRound = yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
    if (!currentRound) {
        return null;
    }
    else {
        currentRound.displayName = displayName || currentRound.displayName;
        currentRound.fundingGoal = fundingGoal || currentRound.fundingGoal;
        currentRound.deadline = deadline || currentRound.deadline;
        currentRound.minimumInvestmentAmount = minimumInvestmentAmount || currentRound.minimumInvestmentAmount;
        currentRound.maximumInvestmentAmount = maximumInvestmentAmount || currentRound.maximumInvestmentAmount;
        currentRound.discountPercentage = discountPercentage || currentRound.discountPercentage;
        return yield currentRound.save();
    }
});
exports.updateFundingRound = updateFundingRound;
const createFundingRound = (companyId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage) => __awaiter(void 0, void 0, void 0, function* () {
    const roundId = (0, idUtils_1.generateInvestmentRoundId)();
    const round = new fundingRound_schema_1.FundingRound({
        roundId,
        companyId,
        displayName,
        fundingGoal,
        deadline,
        amountRaised: 0,
        investments: [],
        minimumInvestmentAmount,
        maximumInvestmentAmount,
        discountPercentage
    });
    const company = yield company_schema_1.Company.findOne({ companyId: companyId }).exec();
    if (!company) {
        return null;
    }
    else {
        company.fundingRounds.push(roundId);
        yield company.save();
        return yield round.save();
    }
});
exports.createFundingRound = createFundingRound;
const addInvestment = (roundId, userId, amount, shareCount) => __awaiter(void 0, void 0, void 0, function* () {
    const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
    const user = yield user_schema_1.User.findOne({ userId: userId }).exec();
    if (!round || !user /* || user.fundsBalance < amount */) { //TODO: we don't need these funds balance checks
        //DEBUG console.log("round or user not found")
        return null;
    }
    const investmentId = (0, idUtils_1.generateInvestmentId)();
    const investment = new investment_schema_1.Investment({
        investmentId: investmentId,
        roundId: roundId,
        userId: userId,
        companyId: round.companyId,
        amount: amount,
        shareCount: shareCount
    });
    user.investments.push(investment);
    user.fundsBalance = user.fundsBalance - amount;
    round.investments.push(investment);
    round.amountRaised = round.amountRaised + amount;
    yield round.save();
    yield user.save();
    return yield investment.save();
});
exports.addInvestment = addInvestment;
const linkFundingRoundToOffering = (roundId, tapiOfferingId) => __awaiter(void 0, void 0, void 0, function* () {
    const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
    if (!round) {
        return null;
    }
    if (round.tapiOfferingId == "none") {
        round.tapiOfferingId = tapiOfferingId;
        yield round.save();
        return round;
    }
    else {
        //user already has an issuerId and we will not create a new one
        return round;
    }
});
exports.linkFundingRoundToOffering = linkFundingRoundToOffering;
/* export const
 */
const linkDocToFundingRound = (roundId, docref) => __awaiter(void 0, void 0, void 0, function* () {
    const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
    if (!round) {
        return null;
    }
    round.tapiDocumentIds.push(docref);
    yield round.save();
    return round;
});
exports.linkDocToFundingRound = linkDocToFundingRound;
