import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DATA_FILE = path.join(PUBLIC_DIR, 'data.json');

async function sendTelegramMessage(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('Skipping Telegram notification: Missing token or chat ID.');
    return;
  }
  
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    console.log('Telegram notification sent successfully.');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error.response?.data || error.message);
  }
}

async function fetchInvestmentNews() {
  console.log('Fetching investment news...');
  try {
    // 這裡我們以 Yahoo 財經 RSS 為例作為範例資料來源
    const { data } = await axios.get('https://tw.stock.yahoo.com/rss?category=tw-market');
    const $ = cheerio.load(data, { xmlMode: true });
    
    const items = [];
    $('item').slice(0, 5).each((i, el) => {
      items.push({
        title: $(el).find('title').text(),
        link: $(el).find('link').text(),
        pubDate: $(el).find('pubDate').text()
      });
    });
    
    return items;
  } catch (err) {
    console.error('Error fetching data:', err.message);
    return [];
  }
}

async function checkUpdates() {
  try {
    await fs.mkdir(PUBLIC_DIR, { recursive: true });
    
    // Read old data
    let oldData = { lastUpdate: null, news: [] };
    try {
      const oldDataStr = await fs.readFile(DATA_FILE, 'utf8');
      oldData = JSON.parse(oldDataStr);
    } catch (err) {
      console.log('No existing data file found, starting fresh.');
    }

    const newNews = await fetchInvestmentNews();
    if (newNews.length === 0) {
        console.log("No news fetched.");
        return;
    }
    
    const latestNewsTitle = newNews[0].title;
    const oldLatestTitle = oldData.news[0]?.title;
    
    const newData = {
      lastUpdate: new Date().toISOString(),
      news: newNews
    };

    // Save new data
    await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));

    // Check if we need to notify
    if (latestNewsTitle !== oldLatestTitle) {
      console.log('New updates found! Sending notification...');
      // Telegram 支援基本的 HTML 標籤
      const message = `🔔 <b>最新投資市場資訊</b>\n\n📌 ${newNews[0].title}\n🔗 <a href="${newNews[0].link}">觀看全文</a>`;
      await sendTelegramMessage(message);
    } else {
      console.log('No new updates compared to last run.');
    }
    
  } catch (error) {
    console.error('Fatal error during update check:', error);
    process.exit(1);
  }
}

checkUpdates();
