// scrape.js
import puppeteer from 'puppeteer';
import fs from 'fs';

const STOCK_NAME = 'xpeng';          // 股票名称或代码
const OUT_FILE = 'xpeng-ccass.html';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();

  // 1. 进入查询页
  await page.goto('https://www3.hkexnews.hk/sdw/search/searchsdw.aspx', { waitUntil: 'networkidle2' });

  // 2. 填入股票名称
  await page.waitForSelector('#txtStockName');
  await page.type('#txtStockName', STOCK_NAME, { delay: 50 });

  // 3. 点击查询按钮（使用正确的 ID）
  await page.waitForSelector('#btnSearch', { timeout: 15000 });
  await page.click('#btnSearch');

  // 4. 等待结果出现
  await page.waitForSelector('.ccass-search-result', { timeout: 15000 });

  // 5. 保存 HTML
  const html = await page.content();
  fs.writeFileSync(OUT_FILE, html, 'utf8');
  console.log(`✅ 已写入 ${OUT_FILE}`);

  await browser.close();
})();