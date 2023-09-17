import { Request, Response } from 'express';
import { FundingRound } from '../models/fundingRound.schema';
import { addInvestment, createFundingRound, getFundingRound, linkFundingRoundToOffering, updateFundingRound } from '../services/investment.service';
import { getUserById, updateUserKycInfo } from '../services/user.service';
import { authenticatedUserId } from '../utils/routeUtils';
import { uploadDocumentToOffering, createOffering, checkPaymentMethods, beginUserKYC, ensureInvestorProvisioned, /* createPartyIndividualIfNotExist */} from '../services/transactapi.service';
import { create } from 'domain';

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
        return res.status(200).send(round)
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
        if (!req.body || !req.body.roundId || !req.body.amount || !req.body.shareCount || !req.body.domicile || !req.body.firstName || !req.body.lastName || !req.body.dob || !req.body.primCountry || !req.body.primAddress1 || !req.body.primCity || !req.body.primState || !req.body.primZip || !req.body.ssn || !req.body.phone) {
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
            user.dob = /* new Date(dob) */ new Date(dob)
            user.primCountry = primCountry
            user.primAddress1 = primAddress1
            user.primCity = primCity
            user.primState = primState
            user.primZip = primZip
            //user.ssn = "not stored" //TODO: how do we manage this?
            //user.kycStatus = "pending"
            //user.amlStatus = "pending"
            const result = await updateUserKycInfo(user/* , ssn */)
            if(!result){
                console.log("did not find user")
            }
            const isProvisioned = await ensureInvestorProvisioned(userId)
            if(!isProvisioned){
                return res.status(400).send("Unable to provision investor through transactAPI")
            }
            const kycHasStarted = await beginUserKYC(userId)
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

    } catch (e) {
        console.error(`Unable to complete addInvestmentWithKYC request.\n ${e}`);
    }
}

//For now, only CC is going to be supported. 
export async function getPaymentMethodsRoute(req: Request, res: Response): Promise<void|Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }
    const response = await checkPaymentMethods(userId)
    if(!response){
        return res.status(400).send("Error checking payment methods- is user enrolled in transactAPI?")
    }
    return res.status(200).send(response)
}


export async function fileUploadRoute(req: Request, res: Response): Promise<void|Response> {
    try {
        // Extract uploaded file and other data
        const file = req.file;
        const { roundId } = req.params;
        const doctitle = req.body.doctitle;

        console.log("inside fileUploadRoute")

        const fundingRound = await getFundingRound(roundId)

        if (!fundingRound) {
            return res.status(404).send("Funding round does not exist")
        }
/*         if (!file){
            const result = await uploadDocumentToOffering(fundingRound, doctitle)
            //return res.status(400).send("No file uploaded")
        } */

        const result = await uploadDocumentToOffering(fundingRound, doctitle, file)
        if(!result){
            return res.status(400).send("Error uploading document")
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

    } catch (error) {
        console.error('Error uploading document:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
