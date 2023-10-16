"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investment = exports.InvestmentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.InvestmentSchema = new mongoose_1.Schema({
    investmentId: { type: String, required: true },
    roundId: { type: String, default: "none" },
    userId: { type: String, required: true },
    companyId: { type: String, default: "none" },
    amount: { type: Number, required: true },
    shareCount: { type: Number, required: true },
    tapiTradeId: { type: String, default: "none" }
}, { timestamps: true, _id: true });
exports.Investment = (0, mongoose_1.model)('investments', exports.InvestmentSchema);
