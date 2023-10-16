export interface IInvestment {
    investmentId: string,
    roundId: string, // nanoid
    userId: string, // nanoid
    companyId: string, // nanoid
    amount: number,
    shareCount: number
    tapiTradeId: string
}