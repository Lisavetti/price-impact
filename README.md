# 📊 price-impact

> Script for automated calculation of **Price Impact** for crypto pairs (BTC, ETH, DOGE, PEPE) on the [1inch](https://1inch.io/) platform using [Playwright](https://playwright.dev/).

## 🧩 Overview

This repository contains a JavaScript script designed to simulate token swaps on 1inch and compute the **Price Impact** for large-volume trades. It supports bidirectional calculations for the following pairs:

- BTC/USDT
- ETH/USDT
- DOGE/USDT
- PEPE/USDT

The script performs the following actions:

- Launches a headless browser using Playwright;
- Navigates to the 1inch interface for each token pair;
- Simulates swap transactions for USD-equivalent sizes ranging from **$1,000 to $5,000,000**;
- Captures the quoted output amounts from the UI;
- Computes **Price Impact** as the percentage deviation from the base price ($1,000);
- Saves results into structured JSON files for further analysis.

> This tool was developed as part of a master's thesis focused on modeling liquidation thresholds and risk parameters in DeFi lending protocols.

## ⚙️ Installation

```bash
git clone https://github.com/Lisavetti/price-impact.git
cd price-impact
npm install
```

## 🚀 Usage

```bash
node price-impact-all.js
```

📁 Project Structure
 - price-impact-all.js – core script for calculating price impact;
 - binance_qty.json – input file with token quantities for various USD sizes;
 - results_token.json – output files with quoted prices and calculated impacts.
