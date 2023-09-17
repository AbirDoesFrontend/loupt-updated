"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
require("dotenv/config");
exports.Config = {
    PORT: parseInt(process.env['PORT'] || "24100"),
    MONGODB_URI: process.env['MONGODB_URI'] || "mongodb://localhost:27017/loupt-db",
    JWT_SECRET: process.env['JWT_SECRET'] || "loupt-jwt-secret",
    AUTH0_DOMAIN: process.env['AUTH0_DOMAIN'] || "dev-4qjh8kiabd6uqtn6.us.auth0.com",
    TRANSACTAPI_DEVKEY: process.env['TRANSACTAPI_DEVKEY'] || "none",
    TRANSACTAPI_CLIENTID: "jgmr0nOL3YD4Kp6",
    TRANSACTAPI_URI: "https://api-sandboxdash.norcapsecurities.com/tapiv3/index.php/v3",
};
