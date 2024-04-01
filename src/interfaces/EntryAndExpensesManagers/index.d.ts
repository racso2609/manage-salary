export enum INTEGRATIONS {
    BINANCE = 'binance',
}

export type BinanceRegister = {
    binanceId: string;
    unitPrice: string;
    fiat: string;
    total: string;
    asset: string;
    seller: string;
    date: Date;
    orderType: string;
};
