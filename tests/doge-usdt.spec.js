import { test, expect } from '@playwright/test';
import fs from 'fs';

const binance   = JSON.parse(fs.readFileSync('binance_qty.json', 'utf8'));
const usdBuckets = ['$1000', '$100000', '$500000', '$1000000', '$2000000', '$5000000'];
const dogeQty   = usdBuckets.map(u => (+binance['DOGEUSDT'].qty[u]).toFixed(8)); 

test('scrap DOGE/USDT and calculate Price Impact', async ({ page }) => {
  const pair = {};
  const results = {};

  await page.goto('https://app.1inch.io/#/56/simple/swap/56:DOGE/56:USDT');
  const input = page.locator('input[automation-id="tui-primitive-textfield__native-input"]');

  for (const amount of dogeQty) {
    await input.first().fill('');
    await input.first().fill(amount);
    const rate = page.locator('span[automation-id="tui-accordion__item-title"]');
    await expect(rate).not.toContainText('0 0 USDTFree', { timeout: 10000 });

    await page.waitForTimeout(1000); 

    const rawText = await rate.textContent();
    const clean = rawText?.replace(/Free.*/, '').trim();

    const numbers = clean?.match(/([\d.,]+)/g);
    const price = numbers?.length ? parseFloat(numbers[numbers.length - 1].replace(/,/g, '').replace(/\s/g, '')) : null;

    if (price) {
      pair[amount] = price;
      console.log(`Курс для ${amount} DOGE: ${price}`);
    }
  }


  const baseQty   = dogeQty[0];       
  const basePrice = pair[baseQty];

  results["DOGE/USDT"] = { prices: pair, impacts: {} };
  console.log('\nРезультати Price Impact:\n');

  for (const [amount, price] of Object.entries(pair)) {
    if (amount === baseQty) continue;
    const impact = Math.abs((price - basePrice) / basePrice);
    results["DOGE/USDT"].impacts[amount] = impact.toFixed(5);
    console.log(`• ${amount} DOGE → PI: ${impact.toFixed(5)}`);
  }
  fs.writeFileSync('results_doge-usdt.json', JSON.stringify(results, null, 2));
});

test('scrap USDT/DOGE and calculate Price Impact', async ({ page }) => {
  const testAmounts =  ['1000', '100000', '500000', '1000000', '2000000', '5000000'];
  const pair = {};
  const results = {};

  await page.goto('https://app.1inch.io/#/56/simple/swap/56:USDT/56:DOGE');
  const input = page.locator('input[automation-id="tui-primitive-textfield__native-input"]');

  for (const amount of testAmounts) {
    await input.first().fill('');
    await input.first().fill(amount);
    const rate = page.locator('span[automation-id="tui-accordion__item-title"]');
    await expect(rate).not.toContainText('0 0 DOGEFree', { timeout: 10000 });

    await page.waitForTimeout(1000);

    const rawText = await rate.textContent();
    const clean = rawText?.replace(/Free.*/, '').trim();

    const numbers = clean?.match(/([\d.,]+)/g);
    const price = numbers?.length ? parseFloat(numbers[numbers.length - 1].replace(/,/g, '').replace(/\s/g, '')) : null;

    if (price) {
      pair[amount] = price;
      console.log(`Курс для ${amount} USDT: ${price}`);
    }
  }

  const basePrice = pair["1000"];
  results["USDT/DOGE"] = { prices: pair, impacts: {} };
  console.log('\nРезультати Price Impact:\n');

  for (const [amount, price] of Object.entries(pair)) {
    if (amount === "1000") continue;
    const impact = Math.abs((price - basePrice) / basePrice);
    results["USDT/DOGE"].impacts[amount] = impact.toFixed(5);
    console.log(`• ${amount} USDT → PI: ${impact.toFixed(5)}`);
  }
  fs.writeFileSync('result_usdt-doge.json', JSON.stringify(results, null, 2));
});

