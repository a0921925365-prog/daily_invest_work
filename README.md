# 自動化資訊追蹤中心

這是一個基於 **React + Vite** 的完全免費 Serverless 架構，搭配 **GitHub Actions** 定時去作爬蟲，並且透過 **LINE Notify** 自動推播。

## 功能

1. **自動資訊彙整**：使用 Node.js (`axios`, `cheerio`) 定期由 GitHub Actions 抓取資訊（目前以 Yahoo 財經首頁新聞作為「投資功課」範例）。
2. **自動推播**：比對新舊資料，如果有新內容，透過設定好的 Telegram Bot 發送到你的手機。
3. **前端 Dashboard**：靜態生成的 React 網頁，讀取自動爬蟲存放好的 `data.json` 呈現紀錄。

## 如何開始使用

### 1. 本地開發與測試

你可以直接在本地執行這套專案看看爬蟲邏輯與開發 React 畫面。

```bash
# 安裝相依套件
npm install

# 測試爬蟲腳本（會將資料存入 public/data.json）
npm run fetch

# 啟動 React 開發伺服器
npm run dev
```

如果你想在本地測試 Line Notify：
1. 先在專案根目錄建立一個 `.env` 檔案。
2. 填入你的 Token：`LINE_NOTIFY_TOKEN=你的Token字串`
3. 再次執行 `npm run fetch`。

### 2. 部署到自動化環境 (GitHub)

1. **上傳程式碼到 GitHub**。
2. 到 GitHub 該專案的 **Settings** -> **Secrets and variables** -> **Actions**。
3. 點擊 **New repository secret**，分別新增這兩個密碼：
   - `TELEGRAM_BOT_TOKEN`：(機器人 Token，向 BotFather 申請)
   - `TELEGRAM_CHAT_ID`：(你的對話 ID)
4. 到專案的 **Settings** -> **Pages** -> **Build and deployment**。
5. 把 **Source** 設為 **GitHub Actions**（重要！因為我們自帶了 deploy 腳本）。
6. 到 **Actions** 頁籤，你可以手動觸發 `Daily Tracker & Notifier` 工作流，或是等待每天定時執行。

## 自定義追蹤內容

目前的爬蟲腳本寫在 `scripts/fetcher.js` 內。如果未來有想追蹤的新目標（例如：漫畫更新、PTT 某板、特定 YouTuber 等），只要：

1. 在 `fetcher.js` 寫對應的抓取邏輯 (axios 拿資料，cheerio 分析 DOM)。
2. 將結果存進 `public/data.json` 對應的屬性中。
3. 寫一個判斷新舊版本的邏輯去呼叫 `sendLineNotify`。

一切就緒。
