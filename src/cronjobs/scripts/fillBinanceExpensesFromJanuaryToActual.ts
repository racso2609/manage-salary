import { createExpense } from '@cronjobs/utils/binance';
import { getMontshToUpdate } from '@cronjobs/utils/time';

(async () => {
    const monthsToUpdate = getMontshToUpdate();
    monthsToUpdate.forEach(({ startTimestamp, endTimestamp }) => {
        const url = 'sapi/v1/c2c/orderMatch/listUserOrderHistory';
        const query = `timestamp=${Date.now()}&tradeType=SELL&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`;

        createExpense(url, query).then();
    });
})();
