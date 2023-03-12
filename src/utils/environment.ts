export default class Environment {
    PORT: string;
    CONNECTION: string;
    constructor(NODE_ENV: string) {
        const { MONGO_URI_TEST, MONGO_URI, PORT } = process.env;
        this.CONNECTION = NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI;
        this.PORT = PORT || '3001';
    }
}
