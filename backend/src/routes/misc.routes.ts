import { Request, Response } from 'express';
import { User } from '../models/user.schema';
import { Company } from '../models/company.schema';
import { authenticatedUserId } from "../utils/routeUtils"
import { generatePresignedPutUrl } from '../services/aws.service';


export interface SearchResult {
    type: "Company" | "User",
    url: string,
    title: string,
}

export async function generatePresignedUrlRoute(req: Request, res: Response): Promise<void | Response> {
    const userId = await authenticatedUserId(req)
    if (!userId) {
        return res.status(401).send("Unauthorized request")
    }

    //rndomly generate a file name 
    const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    //const fileName = req.query.filename;
    const fileType = req.query.filetype;

    if (typeof fileName !== 'string' || typeof fileType !== 'string') {
        return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const result = await generatePresignedPutUrl(fileName, fileType)

    if(result){
        return res.status(200).send(result)
    }
    else{
        return res.status(500).send("Unable to generate presigned url")
    }
}


export async function handleSearchRoute(req: Request, res: Response): Promise<void | Response> {
    const searchQuery = req.query.q;

    if (typeof searchQuery !== 'string') {
        return res.status(400).json({ message: 'Invalid query parameter' });
    }

    try {
        const userResults = await User.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: "textScore" } }
        ).limit(10).exec();

        const companyResults = await Company.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: "textScore" } }
        ).limit(10).exec();

        const combinedResults = [...userResults, ...companyResults];

        const sortedResults = combinedResults.sort((a, b) => {
            return (b as any)._doc.score - (a as any)._doc.score;
        });

        // Map the results to the desired output format
        const formattedResults: SearchResult[] = sortedResults.slice(0, 10).map(result => {
            if (result instanceof User) {
                return {
                    type: "User",
                    url: `/user-profile/${result.userId}`,
                    title: result.legalName
                };
            } else if (result instanceof Company) {
                return {
                    type: "Company",
                    url: `/company/${result.companyId}`,
                    title: result.name
                };
            } else {
                throw new Error("Unexpected result type.");
            }
        });

        res.json(formattedResults);

    } catch (err) {
        res.status(500).json({ message: 'Error occurred', error: err });
    }
}
