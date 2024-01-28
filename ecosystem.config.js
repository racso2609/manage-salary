module.exports = {
    apps: [
        {
            name: 'manageSalaryCron',
            script: './dist/binance/index.js',
            cron_restart: '0 */12 * * *',
            instances: 1,
        },
    ],
};
