import * as dotenv from 'dotenv';
// import path = require('path');

// Parsing the env file.
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
    NODE_ENV: string;
    HOST: string;
    SECRET_KEY: string;
    LOGGER: string;
    PORT?: number;
    MONGO_URI: string;
    MONGO_URI_TEST: string;
    EMAIL_FROM: string;
    EMAIL_PWD: string;
    EMAIL_SERVICE: string;
    DEFAULT_USER_PHOTO: string;
    CLOUD_NAME: string;
    CLOUD_KEY: string;
    CLOUD_SECRET: string;
    BINANCE_API_KEY: string;
    BINANCE_SECRET_KEY: string;
    BINANCE_HOST: string;
}

const NOT_REQUIRED_FIELD = ['PORT'];

// Loading process.env as ENV interface

const getConfig = (): Partial<ENV> => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        HOST: process.env.HOST,
        SECRET_KEY: process.env.SECRET_KEY,
        LOGGER: process.env.LOGGER,
        PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
        MONGO_URI: process.env.MONGO_URI,
        MONGO_URI_TEST: process.env.MONGO_URI_TEST,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_PWD: process.env.EMAIL_PWD,
        EMAIL_SERVICE: process.env.EMAIL_SERVICE,
        DEFAULT_USER_PHOTO: process.env.DEFAULT_USER_PHOTO,
        CLOUD_NAME: process.env.CLOUD_NAME,
        CLOUD_KEY: process.env.CLOUD_KEY,
        CLOUD_SECRET: process.env.CLOUD_SECRET,
        // BINANCE_API_KEY: process.env.BINANCE_API_KEY,
        // BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,
        // BINANCE_HOST: process.env.BINANCE_HOST,
    };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: Partial<ENV>): ENV => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined && !NOT_REQUIRED_FIELD.includes(key)) {
            throw new Error(`Missing key ${key} in env`);
        }
    }

    return config as ENV;
};

const config = getConfig();

const env = getSanitzedConfig(config);
export const isDev = env.NODE_ENV === 'dev';

export default env;
