
import { IInvestment } from "../models/investment.interface";
import { Investment } from "../models/investment.schema";
import { IFundingRound } from "../models/fundingRound.interface";
import { FundingRound } from "../models/fundingRound.schema";
import { User } from "../models/user.schema";
import { generateInvestmentId, generateInvestmentRoundId } from "../utils/idUtils";
import { Company } from "../models/company.schema";
/* import { createPartyIndividualIfNotExist } from "./transactapi.service";
 */


export const getFundingRound = async ( roundId: string) : Promise<IFundingRound | null> => {
    return await FundingRound.findOne({roundId: roundId}).exec()
}

export const updateFundingRound = async (roundId: string, displayName?: string, fundingGoal?: number, deadline?: Date,
    minimumInvestmentAmount?: number, maximumInvestmentAmount?: number, discountPercentage?: number): Promise<IFundingRound | null> => {
    const currentRound = await FundingRound.findOne({ roundId: roundId }).exec()
    if (!currentRound) {
        return null
    }
    else {
        currentRound.displayName = displayName || currentRound.displayName
        currentRound.fundingGoal = fundingGoal || currentRound.fundingGoal
        currentRound.deadline = deadline || currentRound.deadline
        currentRound.minimumInvestmentAmount = minimumInvestmentAmount || currentRound.minimumInvestmentAmount
        currentRound.maximumInvestmentAmount = maximumInvestmentAmount || currentRound.maximumInvestmentAmount
        currentRound.discountPercentage = discountPercentage || currentRound.discountPercentage
        return await currentRound.save()
    }
}

export const createFundingRound = async (companyId: string, displayName: string, fundingGoal: number, deadline: Date,
    minimumInvestmentAmount?: number, maximumInvestmentAmount?: number, discountPercentage?: number): Promise<IFundingRound | null> => {
    const roundId = generateInvestmentRoundId()
    const round = new FundingRound({
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
    })
    const company = await Company.findOne({ companyId: companyId }).exec()
    if (!company) {
        return null
    } else {
        company.fundingRounds.push(roundId)
        await company.save()
        return await round.save()
    }
}

export const addInvestment = async (roundId: string, userId: string, amount: number, shareCount: number) : Promise<IInvestment | null> => {
    const round = await FundingRound.findOne({roundId: roundId}).exec()
    const user = await User.findOne({userId: userId}).exec()
    if (!round || !user /* || user.fundsBalance < amount */) { //TODO: we don't need these funds balance checks
        //DEBUG console.log("round or user not found")
        return null
    }
    
    const investmentId = generateInvestmentId()
    const investment = new Investment({
        investmentId: investmentId,
        roundId: roundId,
        userId: userId,
        companyId: round.companyId,
        amount: amount,
        shareCount: shareCount
    })
    user.investments.push(investment)
    user.fundsBalance = user.fundsBalance - amount
    round.investments.push(investment)
    round.amountRaised = round.amountRaised + amount
    await round.save()
    await user.save()
    return await investment.save()
}

export const linkFundingRoundToOffering = async (roundId: string, tapiOfferingId: string) : Promise<IFundingRound | null> => {
    const round = await FundingRound.findOne({roundId: roundId}).exec()
    if (!round) {
        return null
    }
    if(round.tapiOfferingId == "none") {
        round.tapiOfferingId = tapiOfferingId
        await round.save()
        return round
    }
    else{
        //user already has an issuerId and we will not create a new one
        return round
    }
}

/* export const 
 */
export const linkDocToFundingRound = async (roundId: string, docref: string) : Promise<IFundingRound | null> => {
    const round = await FundingRound.findOne({roundId: roundId}).exec()
    if (!round) {
        return null
    }
    round.tapiDocumentIds.push(docref)
    await round.save()
    return round
}