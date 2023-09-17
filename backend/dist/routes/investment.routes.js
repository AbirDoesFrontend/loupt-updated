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
exports.fileUploadRoute = exports.addInvestmentRoute = exports.updateFundingRoundRoute = exports.getFundingRoundRoute = exports.createFundingRoundRoute = void 0;
const fundingRound_schema_1 = require("../models/fundingRound.schema");
const investment_service_1 = require("../services/investment.service");
const user_service_1 = require("../services/user.service");
const routeUtils_1 = require("../utils/routeUtils");
const transactapi_service_1 = require("../services/transactapi.service");
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
            return res.status(200).send(round);
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
            const round = yield fundingRound_schema_1.FundingRound.findOne({ roundId: roundId }).exec();
            if (!round) {
                return res.status(404).send("Funding round does not found");
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
            /*         if (!file){
                        const result = await uploadDocumentToOffering(fundingRound, doctitle)
                        //return res.status(400).send("No file uploaded")
                    } */
            const result = yield (0, transactapi_service_1.uploadDocumentToOffering)(fundingRound, doctitle, file);
            if (!result) {
                return res.status(400).send("Error uploading document");
            }
            return res.status(200).json({ message: 'Document uploaded successfully!', data: file });
            /*         // Construct form data for the TransactAPI
                     const formData = new FormData();
                    formData.append('clientID', 'YourClientID'); // Replace with your client ID
                    formData.append('developerAPIKey', 'YourDeveloperAPIKey'); // Replace with your API key
                    formData.append('offeringId', roundId);
                    formData.append('documentTitle', 'TitleForYourDocument'); // Modify as required
                    formData.append('documentFileReferenceCode', 'SomeReferenceCode'); // Modify as required
                    formData.append('file_name', file.originalname);
                    formData.append('userfile0', file.buffer, { filename: file.originalname });
            
                    // You can add additional fields like approval, supervisorname, etc. to formData as required.
            
                    // Call TransactAPI to upload the document
                    const apiResponse = await axios.post('https://api-sandboxdash.norcapsecurities.com/tapiv3/index.php/v3/addDocumentsforOffering', formData, {
                        headers: formData.getHeaders()
                    });
            
                    // Check the response and send a reply back to the frontend
                    if (apiResponse.data && apiResponse.data.statusCode === "101") {
                        return res.status(200).json({ message: 'Document uploaded successfully!', data: apiResponse.data });
                    } else {
                        return res.status(400).json({ message: 'Error uploading document.', error: apiResponse.data });
                    } */
        }
        catch (error) {
            console.error('Error uploading document:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    });
}
exports.fileUploadRoute = fileUploadRoute;
