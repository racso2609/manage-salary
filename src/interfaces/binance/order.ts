export interface BNOrder {
    orderNumber: number;
    tradeType: string;
    asset: string;
    fiat: string;
    fiatSymbol: string;
    amount: number;
    totalPrice: number;
    unitPrice: number;
    orderStatus: string;
    createTime: string;
    counterPartNickName: string;
}
