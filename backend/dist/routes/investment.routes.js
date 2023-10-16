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
exports.executeInvestmentRoute = exports.fileUploadRoute = exports.getPaymentMethodsRoute = exports.addInvestmentRouteWithKYC = exports.addInvestmentRoute = exports.updateFundingRoundRoute = exports.getFundingRoundRoute = exports.createFundingRoundRoute = void 0;
const fundingRound_schema_1 = require("../models/fundingRound.schema");
const investment_service_1 = require("../services/investment.service");
const user_service_1 = require("../services/user.service");
const routeUtils_1 = require("../utils/routeUtils");
const transactapi_service_1 = require("../services/transactapi.service");
const routeUtils_2 = require("../utils/routeUtils");
function createFundingRoundRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = yield (0, routeUtils_1.authenticatedUserId)(req);
            if (!userId) {
                return res.status(401).send("Unauthorized request");
            }
            if (!req.body || !req.body.companyId || !req.body.displayName || !req.body.fundingGoal || !req.body.deadline) {
                return res.status(400).send("Expected: { companyId: string, displayName: string, fundingGoal: number, deadline: Date(epoch) }");
            }
            const { companyId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage } = req.body;
            const user = yield (0, user_service_1.getUserById)(userId);
            if (!(user === null || user === void 0 ? void 0 : user.companies.includes(companyId))) {
                return res.status(401).send("Only company partners and founders can create a funding round");
            }
            //create funding round in db
            let round = yield (0, investment_service_1.createFundingRound)(companyId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage);
            //create offering through transactapi
            if (!round) {
                return res.status(400).send("Unable to create funding round");
            }
            const offeringNum = yield (0, transactapi_service_1.createOffering)(round, userId);
            if (!offeringNum) {
                return res.status(400).send("Unable to create offering through transactAPI");
            }
            console.log("offeringNum: " + offeringNum);
            round = yield (0, investment_service_1.linkFundingRoundToOffering)(round.roundId, offeringNum);
            return res.status(200).send(round);
        }
        catch (e) {
            console.error(`Unable to complete createFundingRound request.\n ${e}`);
        }
    });
}
exports.createFundingRoundRoute = createFundingRoundRoute;
function getFundingRoundRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const roundId = req.params.roundId;
            const round = yield (0, investment_service_1.getFundingRound)(roundId);
            if (!round) {
                return res.status(404).send("Funding round not found");
            }
            const documents = yield (0, transactapi_service_1.getOfferingDocuments)((round === null || round === void 0 ? void 0 : round.tapiOfferingId) || "none");
            const response = {
                roundId: round === null || round === void 0 ? void 0 : round.roundId,
                displayName: round === null || round === void 0 ? void 0 : round.displayName,
                companyId: round === null || round === void 0 ? void 0 : round.companyId,
                amountRaised: round === null || round === void 0 ? void 0 : round.amountRaised,
                minimumInvestmentAmount: round === null || round === void 0 ? void 0 : round.minimumInvestmentAmount,
                maximumInvestmentAmount: round === null || round === void 0 ? void 0 : round.maximumInvestmentAmount,
                fundingGoal: round === null || round === void 0 ? void 0 : round.fundingGoal,
                deadline: round === null || round === void 0 ? void 0 : round.deadline,
                discountPercentage: round === null || round === void 0 ? void 0 : round.discountPercentage,
                investments: round === null || round === void 0 ? void 0 : round.investments,
                tapiOfferingId: round === null || round === void 0 ? void 0 : round.tapiOfferingId,
                tapiDocumentIds: ["currently not in use- refer below for information on documents."],
                tapiDocuments: documents.document_details
            };
            return res.status(200).send(response);
        }
        catch (e) {
            console.error(`Unable to complete getFundingRound request.\n ${e}`);
        }
    });
}
exports.getFundingRoundRoute = getFundingRoundRoute;
function updateFundingRoundRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = yield (0, routeUtils_1.authenticatedUserId)(req);
            if (!userId) {
                return res.status(401).send("Unauthorized request");
            }
            if (!req.body || !req.body.roundId) {
                return res.status(400).send("Expected: { roundId: string }");
            }
            const user = yield (0, user_service_1.getUserById)(userId);
            const roundId = req.params.roundId;
            const round = yield (0, investment_service_1.getFundingRound)(roundId);
            if (!round) {
                return res.status(404).send("Funding round does not exist");
            }
            if (!(user === null || user === void 0 ? void 0 : user.companies.includes(round.companyId))) {
                return res.status(401).send("Only company partners and founders can update a funding round");
            }
            const { displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage } = req.body;
            const updatedRound = yield (0, investment_service_1.updateFundingRound)(roundId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage);
            return res.status(200).send(updatedRound);
        }
        catch (e) {
            console.error(`Unable to complete updateFundingRound request.\n ${e}`);
        }
    });
}
exports.updateFundingRoundRoute = updateFundingRoundRoute;
function addInvestmentRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = yield (0, routeUtils_1.authenticatedUserId)(req);
            if (!userId) {
                return res.status(401).send("Unauthorized request");
            }
            if (!req.body || !req.body.roundId || !req.body.amount || !req.body.shareCount) {
                return res.status(400).send("Expected: { roundId: string, amount: number, shareCount: number }");
            }
            const { roundId, amount, shareCount } = req.body;
            /*         const party = createPartyIfNotExist(userId)
             */
            const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
            if (!round) {
                return res.status(404).send("Funding round not found");
            }
            const investment = yield (0, investment_service_1.addInvestment)(roundId, userId, amount, shareCount);
            if (!investment) {
                return res.status(400).send("Unable to add investment. Verify funding round and ensure that the user has sufficient funds available.");
            }
            return res.status(200).send(investment);
        }
        catch (e) {
            console.error(`Unable to complete addInvestment request.\n ${e}`);
        }
    });
}
exports.addInvestmentRoute = addInvestmentRoute;
//NEW ROUTES
function addInvestmentRouteWithKYC(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            /*         const partyId = await createPartyIndividualIfNotExist(userId)
             */
            //DEBUG console.log("inside addInvestmentRouteWithKYC")
            const userId = yield (0, routeUtils_1.authenticatedUserId)(req);
            if (!userId) {
                return res.status(401).send("Unauthorized request");
            }
            console.log(req.body);
            if (!req.body || !req.body.roundId || !req.body.amount || !req.body.shareCount || !req.body.domicile || !req.body.firstName || !req.body.lastName || !req.body.dob || !req.body.primCountry || !req.body.primAddress1 || !req.body.primCity || !req.body.primState || !req.body.primZip || !req.body.ssn || !req.body.phone) {
                console.log("missing param!!");
                return res.status(400).send("Expected: { roundId: string, amount: number, shareCount: number, domicile: boolean, firstName: string, lastName: string, dob: string, primCountry: string, primAddress1: string, primCity: string, primState: string, primZip: string, ssn: string, phone: string }");
            }
            const { roundId, //TODO: create a new interface for this
            amount, shareCount, domicile, firstName, lastName, dob, primCountry, primAddress1, primCity, primState, primZip, ssn, phone, paymentmethod } = req.body;
            //first, update user with kyc info
            //user should already be a party here
            const user = yield (0, user_service_1.getUserById)(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }
            console.log("kyc status: " + user.kycStatus);
            if (user.kycStatus == "Disapproved") {
                return res.status(401).send("KYC disapproved");
            }
            if (user.kycStatus == "none") {
                user.domicile = domicile;
                user.legalName = firstName + " " + lastName;
                user.dob = new Date(dob);
                user.primCountry = primCountry;
                user.primAddress1 = primAddress1;
                user.primCity = primCity;
                user.primState = primState;
                user.primZip = primZip;
                const result = yield (0, user_service_1.updateUserKycInfo)(user /* , ssn */);
                if (!result) {
                    console.log("did not find user");
                }
                const isProvisioned = yield (0, transactapi_service_1.ensureInvestorProvisioned)(userId, ssn);
                if (!isProvisioned) {
                    return res.status(400).send("Unable to provision investor through transactAPI");
                }
                const kycHasStarted = yield (0, transactapi_service_1.beginUserKYC)(userId, ssn);
                if (!kycHasStarted) {
                    return res.status(400).send("Unable to begin KYC through transactAPI");
                }
                //need to add webhook logic to execute trade once kyc is passed TODO
                if (user.amlStatus == "Disapproved") {
                    return res.status(401).send("AML disapproved");
                }
                //for now, just create investment object as done before
                const investment = yield (0, investment_service_1.addInvestment)(roundId, userId, amount, shareCount);
                return res.status(200).send(investment);
            }
            else if (user.kycStatus == "passed")
                console.log("KYC already passed");
            const investment = yield (0, investment_service_1.addInvestment)(roundId, userId, amount, shareCount);
            return res.status(200).send(investment);
        }
        catch (e) {
            return res.status(500).send("Internal server error");
        }
    });
}
exports.addInvestmentRouteWithKYC = addInvestmentRouteWithKYC;
//For now, only CC is going to be supported. 
function getPaymentMethodsRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = yield (0, routeUtils_1.authenticatedUserId)(req);
            if (!userId) {
                return res.status(401).send("Unauthorized request");
            }
            const response = yield (0, transactapi_service_1.checkPaymentMethods)(userId);
            if (!response) {
                return res.status(400).send("Error checking payment methods- is user enrolled in transactAPI?");
            }
            return res.status(200).send(response);
        }
        catch (e) {
            //console.error(`Unable to complete getPaymentMethodsRoute request.\n ${e}`);
            return res.status(500).send("Internal server error");
        }
    });
}
exports.getPaymentMethodsRoute = getPaymentMethodsRoute;
function fileUploadRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Extract uploaded file and other data
            const file = req.file;
            const { roundId } = req.params;
            const doctitle = req.body.doctitle;
            console.log("inside fileUploadRoute");
            const fundingRound = yield (0, investment_service_1.getFundingRound)(roundId);
            if (!fundingRound) {
                return res.status(404).send("Funding round does not exist");
            }
            if (!file) {
                return res.status(400).send("No file uploaded");
            }
            const offeringNum = fundingRound.tapiOfferingId;
            if (!offeringNum) {
                return res.status(400).send("No offering number found for this funding round");
            }
            console.log("offeringNum: " + offeringNum);
            const result = yield (0, transactapi_service_1.uploadDocumentToOffering)(fundingRound, doctitle, file);
            if (!result) {
                return res.status(400).send("Error uploading document to TransactAPI");
            }
            (0, routeUtils_2.deleteFile)(file.path);
            return res.status(200).json({ message: 'Document uploaded successfully!', data: file.filename }); // Using file.filename to send the name of the uploaded file
        }
        catch (error) {
            console.error('Error uploading document:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    });
}
exports.fileUploadRoute = fileUploadRoute;
function executeInvestmentRoute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //find all investments for the user
            const userId = yield (0, routeUtils_1.authenticatedUserId)(req);
            if (!userId) {
                return res.status(401).send("Unauthorized request");
            }
            const user = yield (0, user_service_1.getUserById)(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }
            const investments = user.investments;
            const investmentId = req.body.investmentId;
            if (!investmentId) {
                return res.status(400).send("Expected: { investmentId: string }");
            }
            const investment = investments.find(investment => investment.investmentId == investmentId);
            if (!investment) {
                return res.status(404).send("Investment not found");
            }
            //create trade in transactAPI
            const tradeId = yield (0, transactapi_service_1.createTapiTrade)(user.userId, investment.roundId, investment.amount);
            if (!tradeId) {
                return res.status(400).send("Unable to create trade");
            }
            //update investment with tradeId
            investment.tapiTradeId = tradeId;
            const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: investment.roundId }).exec();
            if (!round) {
                return res.status(404).send("Round not found");
            }
            const result = (0, transactapi_service_1.externalFundMove)(user.userId, round.tapiOfferingId, tradeId, investment.amount);
            if (!result) {
                return res.status(400).send("Unable to execute trade");
            }
        }
        catch (e) {
            console.error(`Unable to complete executeInvestmentRoute request.\n ${e}`);
            return res.status(500).send("Internal server error");
        }
    });
}
exports.executeInvestmentRoute = executeInvestmentRoute;
