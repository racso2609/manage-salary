import mongoose from 'mongoose';
import env from './env';

const { NODE_ENV, MONGO_URI_TEST, MONGO_URI } = env;
const isTest = NODE_ENV === 'test';
const connectionString = isTest ? MONGO_URI_TEST : MONGO_URI;

const databaseConnection = async () => {
    mongoose.set('strictQuery', false);
    const dbConnection = await mongoose.connect(connectionString);

    console.log('Database Connected');

    return dbConnection;
};

export default databaseConnection;
