import { IUser } from "../models/user.interface"
import { User } from "../models/user.schema"
import { generateUserId } from "../utils/idUtils"
import jwt from 'jsonwebtoken'
import { Config } from "../config"

const bcrypt = require('bcrypt');

const saltRounds = 10;

export const signupUser = async (email: string, legalName: string, phoneNumber: number, pass: string): Promise<IUser> => {

    const secret = await bcrypt.hash(pass, saltRounds);

    const user = new User({
        userId: generateUserId(),
        legalName,
        bio: "",
        email,
        secret,
        countryCode: "+1",
        phoneNumber,
        fundsBalance: 0,
        companies: [],
        connections: [],
        investments: []
    })
    await user.save()
    return user
}

export const loginUserCheck = async (email: string, pass: string): Promise<IUser | null> => {
    //TODO: this will need to be modified. 
    const toVerify = User.findOne({email: email})

    const user = await toVerify.exec()
    //if there is no user, return null (invalid credentials)
    if (!user) {
        return null
    }
    user.secret = user.secret || "$2b$10$qEV4Qxebr9mnAtJJGyONHOaW8cKrBnpg0sr3cxYQZbQzh95WXgYNe" // TODO: remove hard-coded default password
    const match = await bcrypt.compare(pass, user.secret);
    //if the password doesn't match, return null (invalid credentials)
    if (!match) {
        return null
    }
    //successful auth
    return user
}

export const generateToken = async (userId: string, email: string): Promise<string> => {
    const token = jwt.sign({userId, email}, Config.JWT_SECRET, { expiresIn: "7d" })
    return token
}