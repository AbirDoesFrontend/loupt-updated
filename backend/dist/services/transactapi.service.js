"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ensureInvestorProvisioned = exports.checkPaymentMethods = exports.beginUserKYC = exports.uploadDocumentToOffering = exports.createOffering = void 0;
const config_1 = require("../config");
const axios_1 = __importDefault(require("axios"));
const user_schema_1 = require("../models/user.schema");
const form_data_1 = __importDefault(require("form-data"));
const fs = __importStar(require("fs"));
const tapiApiFileUpload = (endpoint, data) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new form_data_1.default();
    formData.append('clientID', config_1.Config.TRANSACTAPI_CLIENTID);
    formData.append('developerAPIKey', config_1.Config.TRANSACTAPI_DEVKEY);
    formData.append('offeringId', data.offeringId);
    formData.append('documentTitle', data.documentTitle);
    formData.append('file_name', data.documentFileName);
    formData.append('documentFileReferenceCode', data.documentFileReferenceCode);
    Object.keys(data).forEach(key => {
        /*     //formData.append(key, data[key as keyof UploadData]);
         */ formData.append('userfile0', data['userfile0'], data['file_name']);
    });
    try {
        const response = yield (0, axios_1.default)({
            method: 'POST',
            url: `${config_1.Config.TRANSACTAPI_URI}/addDocumentsforOffering`,
            data: formData,
            headers: Object.assign({}, formData.getHeaders())
        });
        return response.data;
    }
    catch (error) {
        console.log("Error caught: ", error);
        throw error;
    }
});
const tApiRequest = (method, endpoint, data, shortendpoint) => __awaiter(void 0, void 0, void 0, function* () {
    //ternary statement 
    let uri = config_1.Config.TRANSACTAPI_URI;
    if (shortendpoint)
        uri = "https://tapi-sandboxdash.norcapsecurities.com";
    try {
        console.log("tApiRequest: " + method + " " + endpoint);
        const response = yield (0, axios_1.default)({
            method,
            url: `${uri}${endpoint}`,
            data: Object.assign({ developerAPIKey: config_1.Config.TRANSACTAPI_DEVKEY, clientID: config_1.Config.TRANSACTAPI_CLIENTID }, data),
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.log("Error caught: " + error.response.data);
        console.log(error.response.data);
        return error.response.data;
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
//connect this when we create a funding round for the company
const createOffering = (fundingRound, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //const existing = await User.findOne({userId: (userId)}).exec()
    const issuerId = yield createIssuerIfNotExist(userId);
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
/* export const uploadDocumentToOffering = async(fundingRound: IFundingRound, doctitle: string, file?: Express.Multer.File): Promise<boolean> => {
  if(fundingRound.tapiOfferingId == 0){
    console.log("funding round is not connected to an offering")
    return false;
  }

  //generate random alphanumeric ID for the document
  const docId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  return await tapiApiFileUpload<any>(
    'POST',
    `/addDocumentsforOffering`,
    {
      offeringId: fundingRound.tapiOfferingId.toString(),
      documentTitle: doctitle,
      documentFileReferenceCode: docId,
      file_name: doctitle,
      userfile0: file?.buffer,  // Pass the buffer from multer's file object
    }
  );
} */
const uploadDocumentToOffering = (fundingRound, doctitle, file) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: will keeping file in-memory improve performance?
    const fileBuffer = fs.readFileSync(file.path); /*  file.buffer; */
    const docId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log("uploadDocumentToOffering: " + fundingRound.tapiOfferingId);
    console.log("original name: " + file.originalname);
    const data = {
        offeringId: fundingRound.tapiOfferingId.toString(),
        documentTitle: doctitle,
        documentFileName: file.originalname,
        documentFileReferenceCode: docId,
        file_name: file.originalname,
        userfile0: fileBuffer
    };
    //console.log("uploadDocumentToOffering: " + fundingRound.offeringId)
    const result = tapiApiFileUpload('/tapiv3/index.php/v3/addDocumentsforOffering', data);
});
exports.uploadDocumentToOffering = uploadDocumentToOffering;
const createPartyIndividualIfNotExist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (!user) {
        console.log("user does not exist");
        return undefined;
    }
    if (user.tapiPartyId != 'none') {
        return user.tapiPartyId;
    }
    const fname = user.legalName.split(" ")[0];
    const lname = user.legalName.split(" ")[1];
    if (!fname || !lname) {
        console.log("user is missing legal name");
        return undefined;
    }
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
        emailAddress: user.email,
    });
    return result.partyDetails[1][0].partyId;
});
const linkPartyToAccount = (partyId, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tApiRequest('PUT', `/createLink`, {
        firstEntryType: "Account",
        firstEntry: accountId,
        relatedEntryType: "IndivACParty",
        relatedEntry: partyId,
        linkType: "owner",
        notes: "liked account to individual party",
        primary_value: 0
    });
    if (result.statusDesc == "Ok") {
        console.log("linked party to account successfully");
        return true;
    }
    return false;
});
const getLinkedCreditCard = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tApiRequest('POST', `/getLinkedCreditCard`, {
        accountId: accountId,
    }, true //for short endpoint toggle
    );
    return result;
});
/*
const createTrade = async(accountId: string, offeringId: string, amount: number): Promise<any> => {
  const response = await tApiRequest<any>(
    'DELETE',
    '/createTrade',
    {
      accountId: accountId,
      offeringId: offeringId,
      amount: amount,
    }
    //TODO: this is incorrect and needs proper implementation
  )
  //no-op TODO: implement
}

const executeTrade = async(accountId: string, offeringId: string, amount: number): Promise<any> => {
  //no-op TODOD: implement
}
 */
const linkCreditCard = (accountId /* , cardId: string */) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tApiRequest('POST', `/linkCreditCard`, {
        accountId: accountId,
    });
    if (result.statusDesc == "Ok")
        return result.accountDetails; //return the URL to stripe iframe
    return undefined;
});
const createAccountIndividualIfNotExist = (userId, partyId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (!user) {
        console.log("user does not exist");
        return undefined;
    }
    //if user already has an account, return it
    if (user.tapiAccountId != 'none') {
        return user.tapiAccountId;
    }
    //if user does not have an account, create one
    const result = yield tApiRequest('PUT', '/createAccount', {
        accountRegistration: user.legalName,
        type: "Individual",
        domesticYN: (user.domicile ? "domestic_account" : "international_account"),
        streetAddress1: user.primAddress1,
        city: user.primCity,
        state: user.primState,
        zip: user.primZip,
        country: user.primCountry,
        KYCstatus: user.kycStatus,
        AMLstatus: user.amlStatus,
        AccreditedStatus: "Not Accredited",
        approvalStatus: "Pending"
    });
    const accountId = result.accountDetails[0].accountId;
    //save accountId to user
    user.tapiAccountId = accountId;
    yield user.save();
    const isLinked = yield linkPartyToAccount(partyId, accountId);
    if (!isLinked) {
        console.log("unable to link party to account");
        return undefined;
    }
    //create link to party 
    return accountId;
});
const beginUserKYC = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (!user) {
        console.log("user does not exist");
        return false;
    }
    console.log("beginUserKYC: " + user.tapiPartyId);
    const result = yield tApiRequest('POST', '/performKycAml', {
        partyId: user.tapiPartyId,
    });
    return true;
});
exports.beginUserKYC = beginUserKYC;
const checkPaymentMethods = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //const partyId = await createPartyIndividualIfNotExist(userId)
    const user = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (!user) {
        console.log("user does not exist");
        return false;
    }
    if (user.tapiPartyId == 'none') {
        console.log("partyId is undefined- either user does not exist, or user is missing email or legal name");
        return false;
    }
    const partyId = user.tapiPartyId;
    /*   const accountId = await createAccountIndividualIfNotExist(userId, partyId)
     */
    if (user.tapiAccountId == 'none') {
        console.log("accountId is undefined- either user does not exist, or user is missing email or legal name");
        return false;
    }
    const accountId = user.tapiAccountId;
    const response = yield getLinkedCreditCard(accountId);
    if (response.statusCode == '715') {
        const stripeURL = yield linkCreditCard(accountId);
        return {
            "hasCard": false,
            "stripeURL": stripeURL
        };
    }
    else {
        return {
            "hasCard": true,
            "details": response.creditcardDetails
        };
    }
});
exports.checkPaymentMethods = checkPaymentMethods;
const ensureInvestorProvisioned = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.User.findOne({ userId: (userId) }).exec();
    if (!user)
        return false;
    const partyId = yield createPartyIndividualIfNotExist(userId);
    if (!partyId) {
        console.log("ensureInvestorProvisioned: unable to create party");
        return false;
    }
    user.tapiPartyId = partyId;
    yield user.save();
    const accountId = yield createAccountIndividualIfNotExist(userId, partyId);
    if (!accountId) {
        console.log("ensureInvestorProvisioned: unable to create individual account");
        return false;
    }
    user.tapiAccountId = accountId;
    yield user.save();
    return true;
});
exports.ensureInvestorProvisioned = ensureInvestorProvisioned;
