import { Schema, model } from "mongoose";
import { IInvestment } from "./investment.interface";

export const InvestmentSchema = new Schema<IInvestment>({

    investmentId: { type : String, required : true },
    roundId: { type : String, default : "none" }, //should be required- not for now to fix errors
    userId: { type : String, required : true },
    companyId: { type : String, default : "none" },
    amount: { type : Number, required : true },
    shareCount: { type : Number, required : true },
    tapiTradeId: { type : String, default : "none" }

}, {timestamps: true, _id: true})

export const Investment = model<IInvestment>('investments', InvestmentSchema)