import mongoose from 'mongoose';
require('dotenv').config();

const { NODE_ENV, MONGO_URI_TEST, MONGO_URI } = process.env;
const isTest = NODE_ENV === 'test';
const connectionString = isTest ? MONGO_URI_TEST : MONGO_URI;

const databaseConnection = async () => {
    mongoose.set('strictQuery', false);
    const dbConnection = await mongoose.connect(connectionString);

    console.log('Database Connected');

    return dbConnection;
};

export default databaseConnection;
