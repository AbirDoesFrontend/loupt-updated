import { Request, Response } from 'express';
import { IUser } from '../models/user.interface';
import { User } from '../models/user.schema';

import { IInvestment } from '../models/investment.interface';
import { Investment } from '../models/investment.schema';

import { updateUserKycInfo } from '../services/user.service';
import { createTapiTrade } from '../services/transactapi.service';

import { FundingRound } from '../models/fundingRound.schema';

export async function updateKycStatus(req: Request, res: Response): Promise<void|Response> {
    try {
        console.log("received callback!!!")
        console.log(req.body)

        const partyId = req.body.partyId
        const kycStatus = req.body.kycStatus
        const amlStatus = req.body.amlStatus

        const existing = await User.findOne({partyId: partyId}).exec()

        if(!existing) {
            return res.status(404).send("user not found")
        }

        const user = existing as IUser

        user.kycStatus = kycStatus
        user.amlStatus = amlStatus

        updateUserKycInfo(user)

        //Now, look at investments that we have stored
        if(user.kycStatus == "Auto Approved" || user.kycStatus == "Approved") {
            const investments = await Investment.find({userId: user.userId}).exec()

            for(const investment of investments) {

                const round = await FundingRound.findOne({roundId: investment.roundId}).exec()
                if(!round) {
                    console.error(`Unable to find round with id ${investment.roundId}`)
                    throw new Error(`Unable to find round with id ${investment.roundId}`)
                }

                const tradeId = await createTapiTrade(user.userId, round.tapiOfferingId , investment.amount)

                if(!tradeId) {
                    console.error(`Unable to create trade for user ${user.userId} for round ${round.roundId}`)
                    throw new Error(`Unable to create trade for user ${user.userId} for round ${round.roundId}`)
                }

                investment.tapiTradeId = tradeId

                await investment.save()
            }
        }


        return res.status(200).send("success")
    } catch (e) {
        console.error(`Unable to complete callbackTest request.\n ${e}`);
    }
}