# 🛸 Drone Knowledge Test (無人機 AI 智能評測系統)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)

這是一個以**現代科技風 (Tech Fashion)** 打造的無人機知識測驗介面。系統前端基於 React 框架開發，而後端則巧妙利用 Google Apps Script (GAS)，將輕便易用的 Google 試算表 (Google Sheets) 直接轉換為**雲端題庫資料庫**。

透過此系統，任何人都能透過簡單的雲端試算表設定，彈指間建立一套自動計分、自動存檔的精緻線上測驗。

👉 **[⚡ Live Demo 線上體驗請點此](https://alicewei0713.github.io/drone-knowledge-test/)**

---

## 🌟 系統亮點特色

本系統跳脫傳統枯燥問卷，致力於打造**流暢且具回饋感的遊戲化測驗體驗**。

*   **💻 現代化毛玻璃介面 (Glassmorphism)**
    *   以極淺灰科技網格為底，主畫板採用半透明水晶質感設計。
    *   流暢清爽的藍紫色漸層主視覺，減輕答題視覺疲勞。
*   **⏳ 刺激的倒數計時挑戰 (Countdown Timer)**
    *   每題獨自配有 15 秒倒數進度條，超時將會自動送出並視為「失敗」。
    *   時效倒數至最後 3 秒時，計時器會由科技藍轉為警戒紅，提升沉浸感。
*   **🔙 智能返回與高亮對比 (Smart Go-Back)**
    *   允許受測者在不慎按錯時，點擊「上一題」退回。
    *   退回後，系統將會**亮藍色框保留並標示**受測者先前選擇的項目，減少再次選錯的風險。
*   **🤖 動態 AI 頭像 (Dynamic Avatars)**
    *   答題過程將即時串接 DiceBear API 隨機生成 `bottts-neutral` (精緻 AI 機器人助手)，讓題目不再單調。
*   **📡 零維護成本的資料庫 (Zero-Cost Database)**
    *   所有的題庫刪改、成績紀錄都存在你的私人 Google 試算表中，打開試算表就像打開隨身碟一樣簡單。

---

## 🚀 從頭開始：系統完整安裝與佈署指南

若是您第一次接手這個專案，請按以下三大階段循序漸進，即可順利擁有自己的專屬測試網站。

### 階段一：建立雲端資料庫 (利用 Google Sheets)

我們將建立兩個 Excel 頁籤，一個當「考題庫」，一個當「成績單」。

1. 前往 Google 雲端硬碟，新增一份 **Google 試算表 (Google Sheets)**。
2. 建立兩個工作表，分別命名為：**`題庫`** 與 **`成績紀錄`**。
3. 格式設定：
   *   進入 **`題庫`** 工作表，在第一列 (A1 起) 依序填上：
       `originalIndex` | `question` | `optionA` | `optionB` | `optionC` | `optionD` | `answer`
   *   進入 **`成績紀錄`** 工作表，在第一列 (A1 起) 依序填上：
       `測試時間` | `ID` | `闖關次數` | `完成通關` | `分數` | `合格` | `正確答題` | `答題細節`
4. 點擊試算表上方面板的 **擴充功能 (Extensions) > Apps Script**。
5. 將專案中的檔案 **`gas_backend.js`** 內的程式碼「全部複製」，並「貼上覆蓋」到開啟的 Apps Script 網頁編輯器中。
6. 點擊儲存 (Ctrl+S)。然後點選右上角藍色按鈕 **「部署 (Deploy)」 > 「新增部署作業」**。
7. 左上角齒輪請設定為 **網頁應用程式 (Web app)**。
8. 授權設定：
   *   執行身分：`我`
   *   誰可以存取：`所有人 (Anyone)`
9. 授權完畢後，系統會給你一長串網址：**「網頁應用程式網址」**，請將它複製下來備用。

---

### 階段二：本地端環境設定 (Local Setup)

讓系統能與剛剛的雲端資料庫牽上線。

1. **安裝環境**：確認電腦已安裝 [Node.js](https://nodejs.org/en/) (建議 v18+ 版)。
2. **安裝框架**：在專案資料夾底下，打開終端機 (Terminal) 執行指令下載依賴包：
   ```bash
   npm install
   ```
3. **注入資料庫**：打開專案內的 `.env` 檔案，尋找 `VITE_GOOGLE_APP_SCRIPT_URL`，並將等號後面的網址替換為你在**階段一第 9 步**取得的超連結。
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的那一長串代碼/exec
   VITE_PASS_THRESHOLD=6
   VITE_QUESTION_COUNT=10
   ```
4. **本機試玩**：終端機執行 `npm run dev`，並點擊終端機產生的 `localhost` 網址，即可看見開發中的畫面。

---

### 階段三：正式發佈為全球公開網頁 (GitHub Pages 佈署)

將專案從開發模式變成每個人都能玩的官方網站。

1. 在 [GitHub 新增一個空的 Repository](https://github.com/new)（請不要勾選新增 README 或 gitignore）。
2. 在專案的終端機依序輸入（請自行替換第三行的專案連結）：
   ```bash
   git init
   git add .
   git commit -m "Initialize project"
   git branch -M main
   git remote add origin https://github.com/你的帳號/你的專案名稱.git
   git push -u origin main
   ```
3. 接著，輸入專案內建的一鍵打包上架指令：
   ```bash
   npm run deploy
   ```
4. 待看到 `Published` 字樣，稍等約 1 分鐘後，前往 GitHub 該專案首頁右上方的 **Settings > Pages** 標籤，即可看見一條連結顯示 "Your site is live at xxx"，這就是你的遊戲網址了！

---

## 🛠 長期營運：各種情境的修改與維護教學

當測試網頁上線後，隨著需求改變，請參考下方對應情境進行更新維護。

| 情境需求 | 修改複雜度 | 處理流程 | 是否需要使用終端機重新佈署？ |
| :--- | :--- | :--- | :--- |
| **純粹想換考題 / 新增題目** | ⭐ 非常簡單 | 直接打開 Google 試算表，任意編輯「題庫」工作表內容即可。前端重整網頁立刻生效。 | **❌ 完全不用** |
| **想改變遊戲難度 (出題數、及格門檻)** | ⭐⭐ 中等 | 打開電腦上的 `.env`。修改 `VITE_QUESTION_COUNT` (出幾題) 或 `VITE_PASS_THRESHOLD` (答對幾題及格) 後存檔。 | **✅ 需要** (見下方指令) |
| **想更改標題字詞 / 修改 CSS 視覺** | ⭐⭐⭐ 稍高 | 於 `src/` 目錄下的 `.jsx` (例如 LoginScreen) 或是 `index.css` 直接動手修改。 | **✅ 需要** (見下方指令) |

> [!TIP]
> **需要重新佈署 (Deploy) 時的操作教學**
> 當你修改了 `.env`, `.jsx` 或 `.css` 時，代表網頁的「實體檔案結構」改變了，請務必先將檔案存檔，接著在終端機中執行：
> ```bash
> git add .
> git commit -m "更新遊戲規則或畫面"
> git push
> npm run deploy
> ```
> 跑完後，只要按 `F5` 或 `Ctrl+F5` (清除快取重整視窗)，玩家就能看到最新版本。
