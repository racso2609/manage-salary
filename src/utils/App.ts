import Environment from './environment';
import mongoose from 'mongoose';

export default class App {
    express: any;
    constructor(app: any) {
        this.express = app;
    }
    async init() {
        const { CONNECTION, PORT } = new Environment(process.env.NODE_ENV);
        await mongoose.connect(CONNECTION, {});
        console.log('Database Connected');
        this.express.listen(PORT, () =>
            console.log(`Server is listening on ${PORT}`)
        );
    }
}
