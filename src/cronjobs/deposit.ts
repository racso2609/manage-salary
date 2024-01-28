import { createEntries } from '@cronjobs/utils/binance';

const url = 'sapi/v1/pay/transactions';
const query = `timestamp=${Date.now()}`;

createEntries(url, query).then();
