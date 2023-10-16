import { Console } from 'console';
import { Config } from '../config';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { IUser } from '../models/user.interface';
import { User } from "../models/user.schema";
import {IFundingRound} from "../models/fundingRound.interface";
import FormData from 'form-data';
import * as fs from 'fs';
import { deleteFile } from '../utils/routeUtils';

//TODO: every single request and response should be typed

type UploadData = {
  offeringId: string;
  documentTitle: string;
  documentFileName: string;
  documentFileReferenceCode: string;
  file_name: string;
  userfile0?: Buffer;
  templateName?: string;
  approval?: 'yes' | 'no'; // I'm assuming it's either 'yes' or 'no' from the provided documentation.
  supervisorname?: string;
  date?: string;
  createdIpAddress?: string;
};

type tApiUploadResponse = {
  statusCode: string;
  statusDesc: string;
  document_details: {
    offeringId: string;
    documentId: string;
    documentReferenceCode: string;
    documentURL: string;
  }[];
};

const tapiApiFileUpload = async (
  endpoint: string,
  data: UploadData
): Promise<tApiUploadResponse> => {
  const formData = new FormData();

  formData.append('clientID', Config.TRANSACTAPI_CLIENTID);
  formData.append('developerAPIKey', Config.TRANSACTAPI_DEVKEY);
  formData.append('offeringId', data.offeringId);
  formData.append('documentTitle', "documentTitle0=" + data.documentTitle);
  formData.append('file_name', "filename0="+data.documentFileName);
  formData.append('documentFileReferenceCode', data.documentFileReferenceCode);

  Object.keys(data).forEach(key => {
    formData.append('userfile0', data['userfile0'], data['file_name']);
  });

  try {
    const response: AxiosResponse<tApiUploadResponse> = await axios({
      method: 'POST',
      url: `${Config.TRANSACTAPI_URI}/addDocumentsforOffering`,
      data: formData,
      headers: {
        ...formData.getHeaders(),
      }
    });
    console.log("response: " + response.data)
    console.log(response.data)
    return response.data;
  } 
  catch (error: any) {
    console.log("Error caught: ", error.response.data);
    //DEBUG return error.response.data;
    throw error;
  }
};

const tApiRequest = async<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    shortendpoint? : boolean
  ): Promise<any> => {
    //ternary statement 
    let uri = Config.TRANSACTAPI_URI
    if(shortendpoint)
      uri = "https://tapi-sandboxdash.norcapsecurities.com"
    try {
      console.log("tApiRequest: " + method + " " + endpoint)
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${uri}${endpoint}`,
        data: {
            developerAPIKey: Config.TRANSACTAPI_DEVKEY,
            clientID: Config.TRANSACTAPI_CLIENTID,
            ...data,
        },
      });
      console.log("response: " + JSON.stringify(response.data, null, 2));
      return response.data;
    }
    catch (error: any) {
      console.log("Error caught: " + error.response.data)
      console.log(error.response.data)
      return error.response.data
    }
};

const createIssuerIfNotExist = async(userId: string): Promise<string | undefined> => {
    const existing = await User.findOne({userId: (userId)}).exec()
    if (existing) {
      if(existing.tapiIssuerId == 'none') {

        const fname = existing.legalName.split(" ")[0]
        const lname = existing.legalName.split(" ")[1]
      

        if(fname && lname && existing.email) {
          const response = await tApiRequest<any>(
            'PUT',
            `/createIssuer`,
            {
              issuerName: existing.legalName,
              firstName: fname,
              lastName: lname,
              email: existing.email,
            }
        );
        //await 1s delay
          console.log("issuerId: " + response.issuerDetails[1][0].issuerId)
          //save issuerId to user
          existing.tapiIssuerId = response.issuerDetails[1][0].issuerId
          await existing.save()

          return response.issuerDetails[1][0].issuerId
        }
        else{
          //user is missing email, or legal name incomplete
          console.log("user is missing email, or legal name incomplete")
          return undefined
        }
    } 
    else{
      //user already has an issuerId and we will not create a new one
      console.log
      return existing.tapiIssuerId
    }
  }
  //user does not exist (somehow?)
  return undefined
}

//connect this when we create a funding round for the company
export const createOffering = async(fundingRound: IFundingRound, userId: string) : Promise<string | undefined> => {
  //const existing = await User.findOne({userId: (userId)}).exec()
  const issuerId = await createIssuerIfNotExist(userId)

  if(!issuerId){
    console.log("issuerId is undefined- either user does not exist, or user is missing email or legal name")
    return undefined
  }
  
  const result = await tApiRequest<any>(
    'PUT',
    `/createOffering`,
    {
      issuerId: issuerId,
      issueName: fundingRound.displayName,
      issueType: "Fund",
      targetAmount: fundingRound.fundingGoal,
      minAmount: fundingRound.minimumInvestmentAmount,
      maxAmount: 2 *fundingRound.fundingGoal, /* fundingRound.maximumInvestmentAmount, TODO: ask the user this*/ 
      unitPrice: "10", //TODO: what is this / how do we define it
      //startDate is today
      startDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      endDate: fundingRound.deadline.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      offeringText: fundingRound.displayName, //TODO: differentiate, and include company in params
      stampingText: fundingRound.displayName,
    }
  );
  return result.offeringDetails[1][0].offeringId
}

export const uploadDocumentToOffering = async(fundingRound: IFundingRound, doctitle: string, file: Express.Multer.File): Promise<boolean | undefined>  => {
  try{
    //TODO: will keeping file in-memory improve performance?
    const fileBuffer = fs.readFileSync(file.path);/*  file.buffer; */

    const docId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    console.log("uploadDocumentToOffering: " + fundingRound.tapiOfferingId)

    console.log("original name: " + file.originalname)

    const data: UploadData = {
        offeringId: fundingRound.tapiOfferingId.toString(),  // Adjust based on your fundingRound structure
        documentTitle: doctitle.split(".")[0],
        documentFileName: file.originalname,
        documentFileReferenceCode: docId, // Add logic to generate/reference code
        file_name: file.originalname.split(".")[0],
        userfile0: fileBuffer
    };

    const result =  tapiApiFileUpload('/tapiv3/index.php/v3/addDocumentsforOffering', data);

    if(!result){
      console.log("unable to upload document to offering")
      return false
    }


    return true
  }
  catch(error){
    console.log("error uploading document to offering")
    return false
  }
}

const createPartyIndividualIfNotExist = async(userId: string, ssn: string): Promise<string | undefined> => {

  const user = await User.findOne({userId: (userId)}).exec()

  if(!user){
    console.log("user does not exist")
    return undefined
  }

  if(user.tapiPartyId != 'none'){
    return user.tapiPartyId
  }
  
  const fname = user.legalName.split(" ")[0]
  const lname = user.legalName.split(" ")[1]

  if(!fname || !lname){
    console.log("user is missing legal name")
    return undefined
  }

  const result = await tApiRequest<any>(
    'PUT',
    `/createParty`,
    {
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
      socialSecurityNumber: ssn,
    }
  );
  return result.partyDetails[1][0].partyId
}

const linkPartyToAccount = async(partyId: string, accountId: string): Promise<boolean | undefined> => {
  const result = await tApiRequest<any>(
    'PUT',
    `/createLink`,
    {
      firstEntryType: "Account",
      firstEntry: accountId,
      relatedEntryType: "IndivACParty",
      relatedEntry: partyId,
      linkType: "owner",
      notes: "liked account to individual party",
      primary_value: 0
    }
  );
  if(result.statusDesc == "Ok"){
    console.log("linked party to account successfully")
    return true
  }
  return false
}

const getLinkedCreditCard = async(accountId: string): Promise<any> => {
  const result = await tApiRequest<any>(
    'POST',
    `/getLinkedCreditCard`,
    {
      accountId: accountId,
    },
    true //for short endpoint toggle
  );
  return result
}

const linkCreditCard = async(accountId: string/* , cardId: string */): Promise<string | undefined> => {
  const result = await tApiRequest<any>(
    'POST',
    `/linkCreditCard`,
    {
      accountId: accountId,
    }
  );
  if(result.statusDesc == "Ok")
    return result.accountDetails //return the URL to stripe iframe
  return undefined
}

const createAccountIndividualIfNotExist = async(userId: string, partyId: string): Promise<string | undefined> => {
  const user = await User.findOne({userId: (userId)}).exec()
  if(!user){
    console.log("user does not exist")
    return undefined
  }
  //if user already has an account, return it
  if(user.tapiAccountId != 'none'){
    return user.tapiAccountId
  }

  //if user does not have an account, create one
  const result = await tApiRequest<any>(
    'PUT',
    '/createAccount',
    {
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
    }
  )
  
  const accountId = result.accountDetails[0].accountId
  //save accountId to user
  user.tapiAccountId = accountId
  await user.save()
  
  const isLinked = await linkPartyToAccount(partyId, accountId)

  if(!isLinked){
    console.log("unable to link party to account")
    return undefined
  }

  //create link to party 
  return accountId
}

export const beginUserKYC = async(userId: string, ssn: string): Promise<boolean> => {
  const user = await User.findOne({userId: (userId)}).exec()
  if(!user){
    console.log("user does not exist")
    return false
  }
  console.log("beginUserKYC: " + user.tapiPartyId)
  const result = await tApiRequest<any>(
    'POST',
    '/performKycAmlBasic',
    {
      partyId: user.tapiPartyId,
    }
  )
  if(result.statusDesc == "Ok")
  return true
  return false
}

export const checkPaymentMethods = async(userId: string): Promise<any> => {
  //const partyId = await createPartyIndividualIfNotExist(userId)
  const user = await User.findOne({userId: (userId)}).exec()
  if(!user){
    console.log("user does not exist")
    return false
  }

  if(user.tapiPartyId == 'none'){
    console.log("partyId is undefined- either user does not exist, or user is missing email or legal name")
    return false
  }
  const partyId = user.tapiPartyId
/*   const accountId = await createAccountIndividualIfNotExist(userId, partyId)
 */  
  if(user.tapiAccountId == 'none'){
    console.log("accountId is undefined- either user does not exist, or user is missing email or legal name")
    return false
  }
  const accountId = user.tapiAccountId

  const response = await getLinkedCreditCard(accountId)

  if (response.statusCode == '715'){
    const stripeURL = await linkCreditCard(accountId)
    return {
      "hasCard": false,
      "stripeURL": stripeURL
    }
  }
  else{
    return {
      "hasCard": true,
      "details": response.creditcardDetails
    }
  }
}

export const ensureInvestorProvisioned = async(userId: string, ssn: string): Promise<boolean> => {
  const user = await User.findOne({userId: (userId)}).exec()
  if(!user)
  return false
  const partyId = await createPartyIndividualIfNotExist(userId, ssn)
  if(!partyId){
    console.log("ensureInvestorProvisioned: unable to create party")
    return false
  }
  user.tapiPartyId = partyId
  await user.save()
  const accountId = await createAccountIndividualIfNotExist(userId, partyId)
  if(!accountId){
    console.log("ensureInvestorProvisioned: unable to create individual account")
    return false
  }
  user.tapiAccountId = accountId
  await user.save()
  return true
}

export const getOfferingDocuments = async(offeringId: string): Promise<any> => {
  const result = await tApiRequest<any>(
    'POST',
    '/getDocumentsforOffering',
    {
      offeringId: offeringId,
    }
  )
  return result
}

export const createTapiTrade = async(userId: string, offeringId: string, amount: number): Promise<string | undefined> => {
  try {
    const user = await User.findOne({userId: (userId)}).exec();
    if (!user) {
      throw new Error("user does not exist");
    }
    const response = await tApiRequest<any>(
      'POST',
      '/createTrade',
      {
        offeringId: offeringId,
        transactionUnits: amount,
        accountId: user.tapiAccountId,
        transactionType: "CREDITCARD", // need support for "ACH"
        createdIpAddress: "10.0.0.9" // TODO: does this need to be the user's IP?
      }
    );

    if (response.statusCode === "101" && response.statusDesc === "Ok") {

      const tradeDetails = response.purchaseDetails[1];
      if (tradeDetails && tradeDetails.length > 0) {
        const tradeId = tradeDetails[0].tradeId;
        return tradeId;
      } else {
        throw new Error("No trade details found in the response");
      }
    } else {
      throw new Error("API response was not OK");
    }

  } catch (error) {
    console.error("Error creating TAPI trade:", error);
    return undefined;
  }
};

export const externalFundMove = async(userId: string, offeringId: string, tapiTradeId: string, amount: number): Promise<any | undefined> => {

  const user = await User.findOne({userId: (userId)}).exec()
  if(!user){
    console.log("user does not exist")
    return false
  }

  const result = await tApiRequest<any>(
    'POST',
    '/externalFundMove',
    {
      accountId: user.tapiAccountId,
      offeringId: offeringId,
      tradeId: tapiTradeId,
      nickname: user.legalName + " externalFundMove on Loupt",
      amount: amount,
      description: "Investment in " + offeringId,
      checkNumber: "1234567890",
    }
  )

  if(result.statusCode == "101" && result.statusDesc == "Ok")
    return result.TradeFinancialDetails[0]
  return undefined
}

export const getTradesStatus = async(/* userId: string, */ tapiTradeIds: string[]): Promise<any | undefined> => {
/*   const user = await User.findOne({userId: (userId)}).exec();
  if(!user){
    console.log("user does not exist");
    return false;
  } */
  const results = [];
  for (let id in tapiTradeIds){
    const result = await tApiRequest<any>(
      'POST',
      '/getTradeStatus',
      {
        tradeId: tapiTradeIds[id],
      }
    );
    const tradeDetails = result.tradeDetails[0];
    const dataToAppend = {
      id: tradeDetails.id,
      offeringId: tradeDetails.offeringId,
      accountId: tradeDetails.accountId,
      partyId: tradeDetails.partyId,
      party_type: tradeDetails.party_type,
      escrowId: tradeDetails.escrowId,
      orderId: tradeDetails.orderId,
      transactionType: tradeDetails.transactionType,
      totalAmount: tradeDetails.totalAmount,
      totalShares: tradeDetails.totalShares,
      orderStatus: tradeDetails.orderStatus,
      createdDate: tradeDetails.createdDate
    };
    results.push(dataToAppend);
  }
  return JSON.stringify(results);
}
