import { createExpense } from '@cronjobs/utils/binance';

const url = 'sapi/v1/c2c/orderMatch/listUserOrderHistory';
const query = `timestamp=${Date.now()}&tradeType=SELL`;
createExpense(url, query).then();
