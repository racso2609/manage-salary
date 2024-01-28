import { createEntries } from '../utils/binance';
import { getMontshToUpdate } from '../utils/time';

const monthsToUpdate = getMontshToUpdate();
monthsToUpdate.forEach(({ startTimestamp, endTimestamp }) => {
    const url = 'sapi/v1/pay/transactions';
    const query = `timestamp=${Date.now()}&startTime=${startTimestamp}&endTime=${endTimestamp}`;

    createEntries(url, query).then();
});
