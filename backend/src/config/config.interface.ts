interface ConfigInterface { 
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    AUTH0_DOMAIN: string;
    TRANSACTAPI_DEVKEY: string;
    TRANSACTAPI_CLIENTID: string;
    TRANSACTAPI_URI: string;
}

export { ConfigInterface }