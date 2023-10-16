import { Request, Response } from 'express';
import { FundingRound } from '../models/fundingRound.schema';
import { addInvestment, createFundingRound, getFundingRound, linkFundingRoundToOffering, updateFundingRound } from '../services/investment.service';
import { getUserById, updateUserKycInfo } from '../services/user.service';
import { authenticatedUserId } from '../utils/routeUtils';
import { uploadDocumentToOffering, createOffering, checkPaymentMethods, beginUserKYC, ensureInvestorProvisioned, getOfferingDocuments, createTapiTrade, externalFundMove, getTradesStatus} from '../services/transactapi.service';
import { create } from 'domain';
import { deleteFile } from '../utils/routeUtils';


export async function createFundingRoundRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        if (!req.body || !req.body.companyId || !req.body.displayName || !req.body.fundingGoal || !req.body.deadline) {
            return res.status(400).send("Expected: { companyId: string, displayName: string, fundingGoal: number, deadline: Date(epoch) }");
        }
        const {companyId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage} = req.body
        const user = await getUserById(userId)
        if (!user?.companies.includes(companyId)) {
            return res.status(401).send("Only company partners and founders can create a funding round")
        }
        //create funding round in db
        let round = await createFundingRound(companyId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage)
        //create offering through transactapi
        if(!round){
            return res.status(400).send("Unable to create funding round")
        }        

        const offeringNum = await createOffering(round, userId)

        if(!offeringNum){
            return res.status(400).send("Unable to create offering through transactAPI")
        }

        console.log("offeringNum: " + offeringNum)

        round = await linkFundingRoundToOffering(round.roundId, offeringNum);
        
        return res.status(200).send(round)

    } catch (e) {
        console.error(`Unable to complete createFundingRound request.\n ${e}`);
    }
}

export async function getFundingRoundRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        const roundId = req.params.roundId
        const round = await getFundingRound(roundId)
        if(!round){
            return res.status(404).send("Funding round not found")
        }
        const documents = await getOfferingDocuments(round?.tapiOfferingId || "none")


        const response = {
            roundId: round?.roundId,
            displayName: round?.displayName,
            companyId: round?.companyId,
            amountRaised: round?.amountRaised,
            minimumInvestmentAmount: round?.minimumInvestmentAmount,
            maximumInvestmentAmount: round?.maximumInvestmentAmount,
            fundingGoal: round?.fundingGoal,
            deadline: round?.deadline,
            discountPercentage: round?.discountPercentage,
            investments: round?.investments,
            tapiOfferingId: round?.tapiOfferingId,
            tapiDocumentIds: ["currently not in use- refer below for information on documents."],
            tapiDocuments: documents.document_details
        }
        return res.status(200).send(response)
    } catch (e) {
        console.error(`Unable to complete getFundingRound request.\n ${e}`);
    }
}

export async function updateFundingRoundRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        if (!req.body || !req.body.roundId) {
            return res.status(400).send("Expected: { roundId: string }")
        }
        const user = await getUserById(userId)
        const roundId = req.params.roundId
        const round = await getFundingRound(roundId)
        if (!round) {
            return res.status(404).send("Funding round does not exist")
        }
        if (!user?.companies.includes(round.companyId)) {
            return res.status(401).send("Only company partners and founders can update a funding round")
        }
        const {displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage } = req.body
        const updatedRound = await updateFundingRound(roundId, displayName, fundingGoal, deadline, minimumInvestmentAmount, maximumInvestmentAmount, discountPercentage)
        return res.status(200).send(updatedRound)
    } catch (e) {
        console.error(`Unable to complete updateFundingRound request.\n ${e}`);
    }
}

export async function addInvestmentRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        if (!req.body || !req.body.roundId || !req.body.amount || !req.body.shareCount) {
            return res.status(400).send("Expected: { roundId: string, amount: number, shareCount: number }")
        }
        
        const {roundId, amount, shareCount} = req.body

/*         const party = createPartyIfNotExist(userId)
 */        
        const round = await FundingRound.findOne({roundId : roundId}).exec()
        if (!round) {
            return res.status(404).send("Funding round not found")
        }
        const investment = await addInvestment(roundId, userId, amount, shareCount)
        if (!investment) {
            return res.status(400).send("Unable to add investment. Verify funding round and ensure that the user has sufficient funds available.")
        }
        return res.status(200).send(investment)
    } catch (e) {
        console.error(`Unable to complete addInvestment request.\n ${e}`);
    }
}

//NEW ROUTES

export async function addInvestmentRouteWithKYC(req: Request, res: Response): Promise<void|Response> {
    try {
/*         const partyId = await createPartyIndividualIfNotExist(userId)
 */
        //DEBUG console.log("inside addInvestmentRouteWithKYC")
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        console.log(req.body)
        if (!req.body || !req.body.roundId || !req.body.amount || !req.body.shareCount || !req.body.domicile || !req.body.firstName || !req.body.lastName || !req.body.dob || !req.body.primCountry || !req.body.primAddress1 || !req.body.primCity || !req.body.primState || !req.body.primZip || !req.body.ssn || !req.body.phone) {
            console.log("missing param!!")
            return res.status(400).send("Expected: { roundId: string, amount: number, shareCount: number, domicile: boolean, firstName: string, lastName: string, dob: string, primCountry: string, primAddress1: string, primCity: string, primState: string, primZip: string, ssn: string, phone: string }")
        }
        const {roundId, //TODO: create a new interface for this
            amount, 
            shareCount, 
            domicile, 
            firstName, 
            lastName, 
            dob,
            primCountry,
            primAddress1,
            primCity,
            primState,
            primZip,
            ssn,
            phone,
            paymentmethod
        } = req.body


        //first, update user with kyc info

        //user should already be a party here
        const user = await getUserById(userId)
        if(!user){
            return res.status(404).send("User not found")
        }
        console.log("kyc status: " + user.kycStatus)

        if(user.kycStatus == "Disapproved"){
            return res.status(401).send("KYC disapproved")
        }

        if(user.kycStatus == "none"){
            user.domicile = domicile
            user.legalName = firstName + " " + lastName
            user.dob = new Date(dob)
            user.primCountry = primCountry
            user.primAddress1 = primAddress1
            user.primCity = primCity
            user.primState = primState
            user.primZip = primZip

            const result = await updateUserKycInfo(user/* , ssn */)
            if(!result){
                console.log("did not find user")
            }

            const isProvisioned = await ensureInvestorProvisioned(userId, ssn)

            if(!isProvisioned){
                return res.status(400).send("Unable to provision investor through transactAPI")
            }

            const kycHasStarted = await beginUserKYC(userId, ssn)
            if(!kycHasStarted){
                return res.status(400).send("Unable to begin KYC through transactAPI")
            }

            //need to add webhook logic to execute trade once kyc is passed TODO

            if(user.amlStatus == "Disapproved"){
                return res.status(401).send("AML disapproved")
            }


            //for now, just create investment object as done before
            const investment = await addInvestment(roundId, userId, amount, shareCount)

            return res.status(200).send(investment)


        }
        else if (user.kycStatus == "passed")
            console.log("KYC already passed")

            const investment = await addInvestment(roundId, userId, amount, shareCount)

            return res.status(200).send(investment)

    } catch (e) {

        return res.status(500).send("Internal server error")

    }
}

//For now, only CC is going to be supported. 
export async function getPaymentMethodsRoute(req: Request, res: Response): Promise<void|Response> {
    try{
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        const response = await checkPaymentMethods(userId)
        if(!response){
            return res.status(400).send("Error checking payment methods- is user enrolled in transactAPI?")
        }
        return res.status(200).send(response)
    } catch (e) {
        //console.error(`Unable to complete getPaymentMethodsRoute request.\n ${e}`);
        return res.status(500).send("Internal server error")
    }
}

export async function fileUploadRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        // Extract uploaded file and other data
        const file = req.file;
        const { roundId } = req.params;
        const doctitle = req.body.doctitle;

        console.log("inside fileUploadRoute");

        const fundingRound = await getFundingRound(roundId);

        if (!fundingRound) {
            return res.status(404).send("Funding round does not exist");
        }

        if (!file) {
            return res.status(400).send("No file uploaded");
        }
        const offeringNum = fundingRound.tapiOfferingId;
        if(!offeringNum){
            return res.status(400).send("No offering number found for this funding round");
        }
        console.log("offeringNum: " + offeringNum);

        const result = await uploadDocumentToOffering(fundingRound, doctitle, file);

        if(!result) {
            return res.status(400).send("Error uploading document to TransactAPI");
        }

        deleteFile(file.path);

        return res.status(200).json({ message: 'Document uploaded successfully!', data: file.filename }); // Using file.filename to send the name of the uploaded file

    } catch (error) {
        console.error('Error uploading document:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function executeInvestmentRoute(req: Request, res: Response): Promise<void|Response> {
    try{
        //find all investments for the user
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        const user = await getUserById(userId)
        if(!user){
            return res.status(404).send("User not found")
        }
        const investments = user.investments
        const investmentId = req.body.investmentId

        if(!investmentId){
            return res.status(400).send("Expected: { investmentId: string }")
        }

        const investment = investments.find(investment => investment.investmentId == investmentId)

        if(!investment){
            return res.status(404).send("Investment not found")
        }

        //create trade in transactAPI
        const tradeId = await createTapiTrade(user.userId, investment.roundId , investment.amount)

        if(!tradeId){
            return res.status(400).send("Unable to create trade")
        }

        //update investment with tradeId
        investment.tapiTradeId = tradeId
        const round = await FundingRound.findOne({roundId: investment.roundId}).exec()
        if(!round){
            return res.status(404).send("Round not found")
        }

        const result = externalFundMove(user.userId, round.tapiOfferingId, tradeId,  investment.amount)
        if(!result){
            return res.status(400).send("Unable to execute trade")
        }

    } catch (e) {
    console.error(`Unable to complete executeInvestmentRoute request.\n ${e}`);
    return res.status(500).send("Internal server error")
    }
}

export async function userTradeStatusRoute(req: Request, res: Response): Promise<void|Response> {
    try{
        //find all investments for the user
        const userId = await authenticatedUserId(req)
        if (!userId) {
            return res.status(401).send("Unauthorized request")
        }
        const user = await getUserById(userId)
        if(!user){
            return res.status(404).send("User not found")
        }
        const investmentIds: string[] = []//user.investments

        for(let investment of user.investments){
            investmentIds.push(investment.investmentId)
        }

        if(investmentIds.length === 0) {
            res.status(404).send('No investments found');
        }
        //const investmentId = req.body.investmentId
        const result = await getTradesStatus(investmentIds)
        if(result){
            return res.status(200).send(result)
        }
        else{
            return res.status(400).send("Unable to get trade status")
        }
    }
    catch (e) {
        console.error(`Unable to complete userTradeStatusRoute request.\n ${e}`);
        return res.status(500).send("Internal server error")
    }
}