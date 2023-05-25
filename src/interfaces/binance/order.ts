enum OrderType {
    P2P = 'P2P',
    C2C = 'C2C',
}
export interface Order {
    orderId: string;
    orderType: OrderType;
    seller: string;
    unitPrice: string;
    fiat: string;
    total: string;
    asset: string;
    date: string;
    note: string;
}
