const log = require('util').log;
const config = require('../config/config');
const { Settings } = require('everlife-token-sale-model');
const CoinMarketCap = require('coinmarketcap-api');

const client = new CoinMarketCap(config.coinMarketCap.coinMarketCapApiKey);
const rateTimeoutSeconds = 10 * 60; // Refresh at most every 10 minutes

let USDtoXLMRatePromise = null;
let rateTimeStamp = new Date();
let pollInterval = null;

/**
 *      /understand
 * Fetches the current rate of USD to XLM from coinmarketcap.com through their API. Since the API usage is limited
 * we only fetch a new value after a specified time has elapsed. Note: A cached value is only available long as subsequent
 * calls to this method are made within the same node.js process, not if the process is restarted.
 * @returns Promise<Number>
 */
function getXLMToUSDRate() {
    const timeElapsedSinceRateFetch = ((new Date()) - rateTimeStamp) / 1000;
    if (USDtoXLMRatePromise && timeElapsedSinceRateFetch <= rateTimeoutSeconds) {
        return USDtoXLMRatePromise;
    } else {
        USDtoXLMRatePromise =  client.getQuotes({symbol: 'USD,XLM'})
            .then(quotes => {
                if (quotes.status.error_code === 0) {
                    const xlm = quotes.data['XLM'];
                    const USDquote = xlm.quote['USD'];
                    let USDtoXLMRate = USDquote.price;
                    rateTimeStamp = new Date();
                    log(`[getXLMToUSDRate] Updated CoinMarketCap USD to XLM rate ${USDtoXLMRate}`);
                    return USDtoXLMRate;
                } else {
                    throw new Error(quotes.status.error_message);
                }
            });
        return USDtoXLMRatePromise;
    }
}

async function pollCoinMarketCap() {
    const rate = await getXLMToUSDRate();
    await Settings.setSetting('rateUSDtoXLM', rate);
}

function startPollingCoinMarketCap() {
    if (!pollInterval) {
        pollCoinMarketCap().then(() => {
            pollInterval = setInterval(pollCoinMarketCap, rateTimeoutSeconds * 1000);
        });
    }
}

module.exports = {
    startPollingCoinMarketCap,
    getXLMToUSDRate
};