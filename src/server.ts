import { application } from './app';

application
    .init()
    .then()
    .catch((err) => {
        console.log('Error', err);
        process.exit(1);
    });

export { application };
