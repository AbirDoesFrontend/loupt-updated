import { Document } from 'mongoose';

export interface ICompany {
    companyId: string; // nanoid
    name: string;
    logo: string; // base64 encoded string; TODO: use S3 urls
    banner: string;
    bio: string;
    shortBio: string;
    partners: string[]; // Changed to string[]
    industry: string[]; // Changed to string[]
    website: string; // url
    valuation: number;
    minimumInvestment: number;
    sharePrice: number;
    sharesOutstanding: number;
    location: string;
    fundingRounds: string[]; // Changed to string[], array of roundIDs
}

export interface ICompanyDoc extends ICompany, Document {} // Extending with Document for Mongoose compatibility