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
exports.createPartyIndividualIfNotExist = exports.uploadDocumentToOffering = exports.createOffering = exports.createIssuerIfNotExist = void 0;
const config_1 = require("../config");
const axios_1 = __importDefault(require("axios"));
const user_schema_1 = require("../models/user.schema");
const form_data_1 = __importDefault(require("form-data"));
//incomplete
const tapiApiFileUpload = (method, endpoint, data) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new form_data_1.default();
    formData.append('clientID', config_1.Config.TRANSACTAPI_CLIENTID);
    formData.append('developerAPIKey', config_1.Config.TRANSACTAPI_DEVKEY);
    formData.append('offeringId', data.offeringId);
    formData.append('documentTitle', data.documentTitle);
    formData.append('documentFileReferenceCode', data.documentFileReferenceCode);
    formData.append('file_name', data.file_name);
    if (data.userfile0)
        formData.append('userfile0', data.userfile0, data.file_name);
    try {
        const response = yield (0, axios_1.default)({
            method,
            url: `${config_1.Config.TRANSACTAPI_URI}${endpoint}`,
            data: formData, // Changed to formData
            /*       headers: {
                    ...formData.getHeaders(),
                  } */
        });
        return response.data;
    }
    catch (error) {
        console.log("Error caught: " + error.response.data);
        console.log(error.response.data);
    }
});
const tApiRequest = (method, endpoint, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method,
            url: `${config_1.Config.TRANSACTAPI_URI}${endpoint}`,
            data: Object.assign({ developerAPIKey: config_1.Config.TRANSACTAPI_DEVKEY, clientID: config_1.Config.TRANSACTAPI_CLIENTID }, data),
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log("Error caught: " + error.response.data);
        console.log(error.response.data);
    }
});
const createIssuerIfNotExist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (existing) {
        if (existing.tapiIssuerId == 'none') {
            const fname = existing.legalName.split(" ")[0];
            const lname = existing.legalName.split(" ")[1];
            if (fname && lname && existing.email) {
                const response = yield tApiRequest('PUT', `/createIssuer`, {
                    issuerName: existing.legalName,
                    firstName: fname,
                    lastName: lname,
                    email: existing.email,
                });
                //await 1s delay
                /*           await new Promise(resolve => setTimeout(resolve, 1000));
                 */
                console.log("issuerId: " + response.issuerDetails[1][0].issuerId);
                //save issuerId to user
                existing.tapiIssuerId = response.issuerDetails[1][0].issuerId;
                yield existing.save();
                return response.issuerDetails[1][0].issuerId;
            }
            else {
                //user is missing email, or legal name incomplete
                console.log("user is missing email, or legal name incomplete");
                return undefined;
            }
        }
        else {
            //user already has an issuerId and we will not create a new one
            console.log;
            return existing.tapiIssuerId;
        }
    }
    //user does not exist (somehow?)
    return undefined;
});
exports.createIssuerIfNotExist = createIssuerIfNotExist;
//connect this when we create a funding round for the company
const createOffering = (fundingRound, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //const existing = await User.findOne({userId: (userId)}).exec()
    const issuerId = yield (0, exports.createIssuerIfNotExist)(userId);
    if (!issuerId) {
        console.log("issuerId is undefined- either user does not exist, or user is missing email or legal name");
        return undefined;
    }
    const result = yield tApiRequest('PUT', `/createOffering`, {
        issuerId: issuerId,
        issueName: fundingRound.displayName,
        issueType: "Fund",
        targetAmount: fundingRound.fundingGoal,
        minAmount: fundingRound.minimumInvestmentAmount,
        maxAmount: 2 * fundingRound.fundingGoal,
        unitPrice: "10",
        //startDate is today
        startDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
        endDate: fundingRound.deadline.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
        offeringText: fundingRound.displayName,
        stampingText: fundingRound.displayName,
    });
    return result.offeringDetails[1][0].offeringId;
});
exports.createOffering = createOffering;
const uploadDocumentToOffering = (fundingRound, doctitle, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (fundingRound.tapiOfferingId == 0) {
        console.log("funding round is not connected to an offering");
        return false;
    }
    //generate random alphanumeric ID for the document
    const docId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return yield tapiApiFileUpload('POST', `/addDocumentsforOffering`, {
        offeringId: fundingRound.tapiOfferingId.toString(),
        documentTitle: doctitle,
        documentFileReferenceCode: docId,
        file_name: doctitle,
        userfile0: file === null || file === void 0 ? void 0 : file.buffer, // Pass the buffer from multer's file object
    });
});
exports.uploadDocumentToOffering = uploadDocumentToOffering;
const createPartyIndividualIfNotExist = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const fname = user.legalName.split(" ")[0];
    const lname = user.legalName.split(" ")[1];
    const result = yield tApiRequest('PUT', `/createParty`, {
        domicile: (user.domicile ? "U.S. Citizen" : "Non-U.S. Citizen"),
        firstName: fname,
        lastName: lname,
        dob: user.dob.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
        primCountry: user.primCountry,
        primAddress1: user.primAddress1,
        primCity: user.primCity,
        primState: user.primState,
        primZip: user.primZip,
    });
    return result.partyDetails[1][0].partyId;
});
exports.createPartyIndividualIfNotExist = createPartyIndividualIfNotExist;
//this "executes" the deal- open an escrow account, and transfer funds from investors to the escrow account
/* export const submitDealRequest */ 
