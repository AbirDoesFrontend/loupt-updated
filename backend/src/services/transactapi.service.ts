import { Console } from 'console';
import { Config } from '../config';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { IUser } from '../models/user.interface';
import { User } from "../models/user.schema";
import {IFundingRound} from "../models/fundingRound.interface";
import FormData from 'form-data';


//incomplete
const tapiApiFileUpload = async<T>(
  method: 'POST',
  endpoint: string,
  data: {
    offeringId: string,
    documentTitle: string,
    documentFileReferenceCode: string,
    file_name: string,
    userfile0?: Buffer,
  }
): Promise<any> => {

  const formData = new FormData();

  formData.append('clientID', Config.TRANSACTAPI_CLIENTID);
  formData.append('developerAPIKey', Config.TRANSACTAPI_DEVKEY);
  formData.append('offeringId', data.offeringId);
  formData.append('documentTitle', data.documentTitle);
  formData.append('documentFileReferenceCode', data.documentFileReferenceCode);
  formData.append('file_name', data.file_name);
  if(data.userfile0)
    formData.append('userfile0', data.userfile0, data.file_name);

  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url: `${Config.TRANSACTAPI_URI}${endpoint}`,
      data: formData,  // Changed to formData
/*       headers: {
        ...formData.getHeaders(),
      } */
    });
    return response.data;
  } catch (error: any) {
    console.log("Error caught: " + error.response.data)
    console.log(error.response.data)
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
      console.log(response.data)
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
export const createOffering = async(fundingRound: IFundingRound, userId: string) : Promise<number | undefined> => {
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

export const uploadDocumentToOffering = async(fundingRound: IFundingRound, doctitle: string, file?: Express.Multer.File): Promise<boolean> => {
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
}

const createPartyIndividualIfNotExist = async(userId: string ): Promise<string | undefined> => {

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

export const beginUserKYC = async(userId: string): Promise<boolean> => {
  const user = await User.findOne({userId: (userId)}).exec()
  if(!user){
    console.log("user does not exist")
    return false
  }
  console.log("beginUserKYC: " + user.tapiPartyId)
  const result = await tApiRequest<any>(
    'POST',
    '/performKycAml',
    {
      partyId: user.tapiPartyId,
    }
  )
  return true
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

export const ensureInvestorProvisioned = async(userId: string): Promise<boolean> => {
  const user = await User.findOne({userId: (userId)}).exec()
  if(!user)
  return false
  const partyId = await createPartyIndividualIfNotExist(userId)
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