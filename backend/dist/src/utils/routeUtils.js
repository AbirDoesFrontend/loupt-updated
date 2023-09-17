"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedUserId = exports.verifyJWT = exports.getAuth0UserId = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const user_schema_1 = require("../models/user.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth0_key = "-----BEGIN CERTIFICATE-----\nMIIDHTCCAgWgAwIBAgIJOZnzt50F/eqfMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi00cWpoOGtpYWJkNnVxdG42LnVzLmF1dGgwLmNvbTAeFw0yMzA4MTAxNTA3MzhaFw0zNzA0MTgxNTA3MzhaMCwxKjAoBgNVBAMTIWRldi00cWpoOGtpYWJkNnVxdG42LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANUDyeWcJ/e/EiuPKDZfkvjnZxYLdVis/VUfN8mbPxWIFWS4NBHkuTGIyDqu3M2yC73UA0Yh9M9TegBdrDJ+QN3hu6WQmYEoYeq2ClJcvb0nYhIrh9q6CSyR0SbM8jfVR9LCuIm1SvzzZ5M0esV2II880MC7AC9B6AQimIz0uqMiqvD2NUT78lzB5Ctqk9oqRReEO2Cyqf1ROqAb2r5/giV9IDHv7Ny7N9JEKcszpjllEBu7yqbxvMf2+liahFBwto5Qel5SuKxZLUUUdfdZkvYgfKS4+CNMO/6Zmems6/Wc9614KfMsBguhiXLzX/EFE5czrB6QUHCmMN7Bg2SjBWMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUOq3klZ1nr5WFWu6s+qK83/NmQp4wDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBSpT7clJ1Amr053NRKjuwSBBh/DS+1d1YmoAiM7xxDIcCDnQ7pYK9/HZdtOvf+sEIj6jldUFKUPvuFS0NHSTomE7J8iM/rh2Xz+HWsz45nCzYXxQHlY4AIhVUDSerUd+TWelgRfGI8v2fqJi89LRzUdI9s1iGw8RJWkkvNDN2A8msIk1tnkIqh8JTYgPoUYMyZf1syD0IfHBJVboxHM3kvv0c5HMYE9jMagiS+p31l/erk3QnFJ5GRZgYQ33iN7p3JMeM1RN2LLUm2yUsIu05hNvPKigCy7ryyZG5lfN6d9kLrcygdky8pOFqDLo9F176wNFfWkOZ60K6C8fpqPfU6\n-----END CERTIFICATE-----";
function decodeJWT(token) {
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
const getAuth0UserId = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return "";
    }
    // Extract the token from the 'Bearer TOKEN' format
    const token = authHeader.split(' ')[1];
    return encodeURI(decodeJWT(token).payload.sub);
};
exports.getAuth0UserId = getAuth0UserId;
//given a jwt, verify it and return true if valid
const verifyJWT = (token) => {
    //remove "bearer" from token
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    /*     const decoded = decodeJWT(actualToken)
        if(decoded.payload.exp < Date.now() / 1000) {
            console.log("JWT expired")
            return false
        } */
    try {
        console.log("verifying JWT: " + actualToken);
        jsonwebtoken_1.default.verify(actualToken, auth0_key, { algorithms: ['RS256'] });
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.verifyJWT = verifyJWT;
//given a request, return the userId if the user is authenticated. main entry point
const authenticatedUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const auth0Sub = (0, exports.getAuth0UserId)(req);
    //veify JWT locally
    if (!(0, exports.verifyJWT)(req.headers.authorization || '')) {
        console.log("JWT not verified");
        return null;
    }
    console.log("JWT verified");
    //check if user exists in db
    const url = `https://${config_1.Config.AUTH0_DOMAIN}/api/v2/users/${decodeURI(auth0Sub)}`;
    const existing = yield user_schema_1.User.findOne({ userId: auth0Sub }).exec();
    try {
        if (!existing) {
            const response = yield axios_1.default.get(url, { headers: { authorization: req.headers.authorization } });
            if (response && response.status > 199 && response.status < 300 && response.data) {
                const auth0User = response.data;
                const user = new user_schema_1.User({
                    userId: auth0User.user_id,
                    email: auth0User.email,
                    legalName: auth0User.name,
                    bio: auth0User.nickname,
                    profilePic: auth0User.picture,
                    countryCode: '+1',
                    fundsBalance: 0
                });
                yield user.save();
                return user.userId;
            }
            else {
                console.log("recieved error from auth0 in authenticatedUserId");
                return null;
            }
        }
        else {
            console.log("user already exists in db: " + existing.userId);
            return existing.userId;
        }
    }
    catch (e) {
        console.log(`error provisioning user: ${e}`);
        return null;
    }
    //return null
});
exports.authenticatedUserId = authenticatedUserId;
