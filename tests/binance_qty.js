const axios = require('axios');
const fs = require('fs');

// доларові суми
const usdAmounts = [1000, 100000, 500000, 1000000, 2000000, 5000000];

// які активи хочемо? — додаєш у цей масив символи Binance
const symbols = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'PEPEUSDT', 'WBTCUSDT'];

async function fetchPrice(symbol) {
  const { data } = await axios.get('https://api.binance.com/api/v3/ticker/price', {
    params: { symbol },
  });
  return parseFloat(data.price);        // поточна spot-ціна
}

async function main() {
  const results = {};

  for (const symbol of symbols) {
    const price = await fetchPrice(symbol);
    results[symbol] = { priceUSD: price, qty: {} };

    console.log(`\n▶ ${symbol}: ${price} USDT`);

    for (const usd of usdAmounts) {
      const qty = usd / price;
      results[symbol].qty[`$${usd}`] = qty;
      console.log(`  $${usd.toLocaleString()}  →  ${qty}`);
    }
  }

  fs.writeFileSync('binance_qty.json', JSON.stringify(results, null, 2));
  console.log('\n✅  Дані збережено у  binance_qty.json');
}

main().catch(console.error);
