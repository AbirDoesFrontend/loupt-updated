import { Request, Response } from 'express';
//import { IUser } from '../models/user.interface';

export async function callbackTest(req: Request, res: Response): Promise<void|Response> {
    try {
        console.log(req.body)
        return res.status(200).send("success")
    } catch (e) {
        console.error(`Unable to complete callbackTest request.\n ${e}`);
    }
}