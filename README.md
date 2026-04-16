# Drone Knowledge Test 🚁

這是一個使用 React 與 Vite 打造的像素風格問答闖關遊戲。透過 Google Apps Script 順暢地將 Google 試算表變成輕量級「雲端資料庫」，能自動讀取題庫與即時寫入玩家的作答成績。

👉 **[Live Demo 線上體驗點這裡](https://alicewei0713.github.io/drone-knowledge-test/)**

---

## 📖 完整佈署與設定指南 (Step-by-Step Guide)

這裡為你整理了從頭開始將專案跑起來，到串接資料庫、並將它發佈到網路上的完整教學。

### 1️⃣ 第一步：本地端安裝與啟動 (Installation)

1. 請確認你的電腦已經安裝 [Node.js](https://nodejs.org/en/)（建議 v18 以上版本）。
2. 使用終端機 (Terminal) 進入本專案資料夾。
3. 安裝專案所需的核心套件：
   ```bash
   npm install
   ```
4. 啟動測試伺服器：
   ```bash
   npm run dev
   ```
   *啟動後在瀏覽器開啟 `http://localhost:5173/` 即可預覽遊戲畫面。*

---

### 2️⃣ 第二步：建立雲端資料庫 (Google Apps Script)

本專案**不需要**架設複雜伺服器，我們利用 Google 免費的服務來處理資料。

#### A. 準備試算表
1. 進入你的 Google 雲端硬碟，建立一個全新的 **Google 試算表**。
2. 建立兩個工作表，分別命名為：**「題庫」** 與 **「成績紀錄」**。
3. 在 **「題庫」** 工作表的第一列 (A1起)，貼上這行標題：
   `originalIndex` | `question` | `optionA` | `optionB` | `optionC` | `optionD` | `answer`
4. 在 **「成績紀錄」** 工作表的第一列 (A1起)，貼上這行標題：
   `測試時間` | `ID` | `闖關次數` | `完成通關` | `分數` | `合格` | `正確答題` | `答題細節`

*(設定好後，你可以先在題庫頁下面隨便塞幾題測試內容)*

#### B. 串接 Apps Script (GAS)
1. 在試算表上方面板點擊 **擴充功能 (Extensions) > Apps Script**。
2. 將編輯器內原本的程式碼全刪掉，並把本專案裡的 **`gas_backend.js`** 整份程式碼複製貼上去。
3. 存檔 (Ctrl+S)，點擊右上角 **「部署 (Deploy)」 > 「新增部署作業」**。
4. 設定檔左上角齒輪選擇 **網頁應用程式 (Web app)**。
5. **執行身分**請選 `我 (您的帳號)`；最下面的 **誰可以存取** 請務必選 `所有人 (Anyone)`。
6. 完成部署與權限授權後，複製系統配發的 **網頁應用程式網址 (Web app URL)**。

#### C. 將網址貼回專案
回到本專案，找到 `.env` 檔案，把剛才複製的網址貼在 `VITE_GOOGLE_APP_SCRIPT_URL=` 的後方。
```env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的專屬碼/exec
VITE_PASS_THRESHOLD=6
VITE_QUESTION_COUNT=10
```

---

### 3️⃣ 第三步：上架到 GitHub (佈署為公開網頁)

將專案變成任何人點擊網址就能玩的遊戲。

1. 在 [GitHub 建立一個空的公開 Repository](https://github.com/new)（**不要**勾選 Add a README）。
2. 在本地專案終端機執行以下指令（將你的網址替換進去）：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的帳號/你的專案.git
   git push -u origin main
   ```
3. 上傳成功後，輸入我們設定好的佈署指令：
   ```bash
   npm run deploy
   ```
4. 看到 `Published` 成功訊息後，等待 1~2 分鐘，前往 GitHub 的 **Settings > Pages** 就能看到專屬你的公開遊戲網址了！

---

## 🛠 第四步：後續維護與修改重點

當網站上線後，若要對遊戲進行修改，根據你「**想改的地方**」有不同的處理方式：

### 情況 A：我要修改「題目內容」或「新增題目庫」
這個最簡單，**你完全不需要修改任何程式碼，也不用重新上傳**！
1. 打開你的 **Google 試算表** 進入「題庫」那頁。
2. 直接刪改或新增題目列。
3. 玩家只要「重新整理網頁」開始新遊戲，就會自動抓到你修改好的最新題目。

### 情況 B：我要修改「每次抽幾題」或「及格門檻」
數字門檻的設定寫在本地的參數檔中，因此需要重新打包。
1. 在本地端電腦打開專案的 **`.env`** 檔案。
2. 更改裡面的這兩項數字：
   - `VITE_QUESTION_COUNT`：每次從大題庫中隨機抽出幾題？ (目前設為 `10`)
   - `VITE_PASS_THRESHOLD`：玩家需要答對幾題才算及格？ (目前設為 `6`)
3. 存檔後，打開終端機執行 `npm run deploy`。
4. 等待 1~2 分鐘，你的線上網頁就會自動套用新規則了！

### 情況 C：我要修改「UI 顏色」或「網頁文字」
若你更改了 `.jsx` (畫面) 或 `.css` (樣式) 檔案：
1. 確保程式碼存檔。
2. 終端機依序執行：
   ```bash
   # 上傳程式碼備份到 GitHub
   git add .
   git commit -m "更新畫面設計"
   git push

   # 重新打包發佈到公開網頁
   npm run deploy
   ```
