import * as express from 'express';
import { application as App } from '../../app';
import logger from '../../utils/logger';

export default class IntegrationHelpers {
    public static appInstance: express.Application;
    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        await App.init();
        this.appInstance = App.express;
        return this.appInstance;
    }
    public clearDatabase(): void {
        logger.info('clear the database');
    }
}
