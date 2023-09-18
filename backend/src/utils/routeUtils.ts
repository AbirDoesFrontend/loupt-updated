import { Request } from 'express';
import axios from 'axios';
import { Config } from "../config"
import { User } from '../models/user.schema';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const auth0_key = "-----BEGIN CERTIFICATE-----\nMIIDHTCCAgWgAwIBAgIJOZnzt50F/eqfMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi00cWpoOGtpYWJkNnVxdG42LnVzLmF1dGgwLmNvbTAeFw0yMzA4MTAxNTA3MzhaFw0zNzA0MTgxNTA3MzhaMCwxKjAoBgNVBAMTIWRldi00cWpoOGtpYWJkNnVxdG42LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANUDyeWcJ/e/EiuPKDZfkvjnZxYLdVis/VUfN8mbPxWIFWS4NBHkuTGIyDqu3M2yC73UA0Yh9M9TegBdrDJ+QN3hu6WQmYEoYeq2ClJcvb0nYhIrh9q6CSyR0SbM8jfVR9LCuIm1SvzzZ5M0esV2II880MC7AC9B6AQimIz0uqMiqvD2NUT78lzB5Ctqk9oqRReEO2Cyqf1ROqAb2r5/giV9IDHv7Ny7N9JEKcszpjllEBu7yqbxvMf2+liahFBwto5Qel5SuKxZLUUUdfdZkvYgfKS4+CNMO/6Zmems6/Wc9614KfMsBguhiXLzX/EFE5czrB6QUHCmMN7Bg2SjBWMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUOq3klZ1nr5WFWu6s+qK83/NmQp4wDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBSpT7clJ1Amr053NRKjuwSBBh/DS+1d1YmoAiM7xxDIcCDnQ7pYK9/HZdtOvf+sEIj6jldUFKUPvuFS0NHSTomE7J8iM/rh2Xz+HWsz45nCzYXxQHlY4AIhVUDSerUd+TWelgRfGI8v2fqJi89LRzUdI9s1iGw8RJWkkvNDN2A8msIk1tnkIqh8JTYgPoUYMyZf1syD0IfHBJVboxHM3kvv0c5HMYE9jMagiS+p31l/erk3QnFJ5GRZgYQ33iN7p3JMeM1RN2LLUm2yUsIu05hNvPKigCy7ryyZG5lfN6d9kLrcygdky8pOFqDLo9F176wNFfWkOZ60K6C8fpqPfU6\n-----END CERTIFICATE-----"

type DecodedJWT = {
    header: {
        alg: string;
        typ: string;
        kid: string;
    };
    payload: {
        iss: string;
        sub: string;
        aud: string[];
        iat: number;
        exp: number;
        azp: string;
        scope: string;
    };
}

function decodeJWT(token: string): DecodedJWT {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
        throw new Error('Invalid token');
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    return {
        header,
        payload
    };
}

//get the auth0userId as URI Encoded string
export const getAuth0UserId = (req: Request): string => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return "";
    }
    // Extract the token from the 'Bearer TOKEN' format
    const token = authHeader.split(' ')[1];
    return encodeURI(decodeJWT(token).payload.sub);
}

//given a jwt, verify it and return true if valid
export const verifyJWT = (token: string): boolean => {
    //remove "bearer" from token
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
/*     const decoded = decodeJWT(actualToken)
    if(decoded.payload.exp < Date.now() / 1000) {
        console.log("JWT expired")
        return false
    } */
    try {
        //DEBUG console.log("verifying JWT: " + actualToken)
        jwt.verify(actualToken, auth0_key, { algorithms: ['RS256'] });
        return true;
    } catch (e) {
        return false;
    }
}

//given a request, return the userId if the user is authenticated. main entry point
export const authenticatedUserId = async (req : Request) : Promise<string | null> => {
    const auth0Sub = getAuth0UserId(req)

    //veify JWT locally
    if(!verifyJWT(req.headers.authorization || '')) {
        console.log("JWT not verified")
        return null
    }
    console.log("JWT verified")

    //check if user exists in db
    //TODO: change user schema
    console.log("auth0Sub: " + auth0Sub)
    const url = `https://${Config.AUTH0_DOMAIN}/api/v2/users/${decodeURI(auth0Sub)}`
    const existing = await User.findOne({ userId: auth0Sub }).exec()
    try {
        if(!existing){
            const response = await axios.get(url, {headers: {authorization: req.headers.authorization}})
            if (response && response.status > 199 && response.status < 300 && response.data) {
                const auth0User = response.data as Auth0User
                const user = new User({
                    userId: encodeURI(auth0User.user_id),
                    email: auth0User.email,
                    legalName: auth0User.name,
                    bio: auth0User.nickname,
                    profilePic: auth0User.picture,
                    countryCode: '+1',
                    fundsBalance: 0
                })
                //DEBUG console.log("User provisioned as " + user.userId)
                await user.save()
                return user.userId;
            }
            else {
                //DEBUG console.log("recieved error from auth0 in authenticatedUserId")
                return null
            }
        }
        else {
            //DEBUG console.log("user already exists in db: " + existing.userId)
            return existing.userId
        }
    } catch (e) {
        //DEBUG console.log(`error provisioning user: ${e}`)
        return null
    }
    //return null
}

export const deleteFile = (path: string): void  => {
    fs.unlink(path, (err) => {
        if (err) {
            console.error(`Error deleting file at ${path}:`, err);
        } else {
            console.log(`Successfully deleted file at ${path}`);
        }
    });
}


export type CreateCompanyRequest = {
    name: string, 
    logo: string, 
    bio: string, 
    partners: string[], 
    industry: string[], 
    website: string, 
    valuation: number, 
    minimumInvestment: number, 
    sharePrice: number, 
    sharesOutstanding: number, 
    location: string
}

export type Auth0User = {
    email: string,
    name: string,
    nickname: string,
    picture: string,
    user_id: string
}