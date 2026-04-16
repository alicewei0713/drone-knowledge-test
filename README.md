# Drone Knowledge Test 🚁

一個使用 React 與 Vite 打造的像素風格問答闖關遊戲。透過 Google Apps Script 整合 Google Sheets 作為輕量化雲端後台，能自動讀取題庫與記錄玩家成績。

## 🔗 Live Demo (線上體驗)
👉 **[點擊這裡開始挑戰吧！](https://alicewei0713.github.io/drone-knowledge-test/)**

---

## 🌟 特色功能

- 👾 **復古像素風格 UI**：賽博龐克風格介面、過關/失敗專屬視覺特效，搭配 DiceBear 自動產生的像素關主頭像。
- 📝 **Google Sheets 雲端題庫**：不需懂程式碼！只需修改雲端試算表，網頁上的題目就會自動同步更新。
- ⚙️ **無伺服器後端 (Serverless)**：利用 Google Apps Script (GAS) 充當後端，免去複雜環境開發，可以快速寫入玩家作答紀錄。
- 🕹️ **自動適應機制**：前後端完全解耦，可透過在地環境變數隨時改變抽題數量以及及格門檻。

---

## 📊 如何修改題庫與選項？ (完全不需改程式碼！)

因為專案順利串接 Google Sheets 後端，如果要**新增、刪除、修改題目與答案**：
1. 打開你設定好的 **Google Sheet (雲端試算表)**。
2. 找到名為 **「題庫」** 的工作表，直接增刪改欄位。
3. 玩家只要重新整理網頁再開始玩，就會立刻抓取到最新的題目！

> **備註:** 如果你想查看玩家的分數，請到雲端試算表的 **「成績紀錄」** 工作表查看明細。

---

## ⚙️ 系統設定切換

如果你想調整「每次遊戲的總題數」或「及格門檻」，請修改專案資料夾中的 `.env` 檔案：

```env
VITE_GOOGLE_APP_SCRIPT_URL=你的_GAS_發佈網址
VITE_PASS_THRESHOLD=6
VITE_QUESTION_COUNT=10
```
- `VITE_QUESTION_COUNT`：每次從題庫中隨機抽取的題數（預設 10 題）。
- `VITE_PASS_THRESHOLD`：玩家過關需要答對的最少題數（預設 6 題）。

> ⚠️ **修改設定後：** 只要動到了 `.env` 內的參數或任何介面程式碼，必須重新打包發佈 (`npm run deploy`) 才會在線上網站生效。

---

## 🚀 重新發佈至 GitHub Pages

在本地電腦修改完程式碼或 `.env` 設定後，使用終端機依序執行：
```bash
# 1. 紀錄變更並上傳至 GitHub
git add .
git commit -m "update game settings"
git push

# 2. 打包發佈靜態網頁至 GitHub Pages 
npm run deploy
```

---

## 💻 本地端開發測試 (Local Development)

### 1. 安裝套件
請確保環境已安裝 Node.js (建議 v18+)，在終端機執行：
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```
啟動後會顯示您的本機網址（如 `http://localhost:5173/`），請在瀏覽器中開啟即可以進行除錯。

---

## 📝 備註：Google Apps Script (GAS) 後端建置規範
本專案的根目錄保留了一份 `gas_backend.js`（後端邏輯備用檔）。如果你打算未來要轉換到另一個全新的雲端試算表，或是把專案拷貝給其他人用，可參考此檔案流程重新建立 API：
1. 建立試算表，內含「題庫」與「成績紀錄」兩頁。
2. 擴充功能 > Apps Script > 貼上 `gas_backend.js`。
3. 部署為「網頁應用程式」，並設定為「所有人 (Anyone)」皆可存取。
4. 將配發的網址貼回 `.env` 中的 `VITE_GOOGLE_APP_SCRIPT_URL=` 後方即可完成串聯。
