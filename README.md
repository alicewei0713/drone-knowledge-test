# Drone Knowledge Test 🚁

一個使用 React 與 Vite 打造的像素風格問答闖關遊戲。透過 Google Apps Script 整合 Google Sheets 作為輕量化後端，負責讀取題庫與記錄玩家成績。

## 🌟 特色功能

- 👾 **復古像素風格 UI**：具有帶入感的設計以及利用 DiceBear 自動產生的像素關主頭像。
- 📝 **Google Sheets 後端**：免去建置複雜的資料庫，只需透過 Google Apps Script 將試算表作答資料與成績即時同步。
- ⚙️ **環境變數快速設定**：可自訂每次要抽取的題數以及過關門檻。
- 🕹️ **內建 Mock 模擬測試**：後端尚未準備好時也能直接體驗包含 10 題「無人機專業知識」題庫的完整遊戲流程。

---

## 🚀 快速開始

### 1. 安裝套件
請確保您的環境已經安裝 Node.js (建議 v18+)，接著在終端機執行：
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```
啟動後會顯示您的本機網址（預設為 `http://localhost:5173/`），請在瀏覽器中開啟以此測試遊戲。

---

## ⚙️ 環境變數與假想情境 (Mock Mode)

在專案根目錄下的 `.env` 檔案控制著遊戲系統的核心設定：
```env
VITE_GOOGLE_APP_SCRIPT_URL=請替換成您的_GAS_發佈URL
VITE_PASS_THRESHOLD=3
VITE_QUESTION_COUNT=5
```
- `VITE_PASS_THRESHOLD`：玩家過關所需的正確題數門檻。
- `VITE_QUESTION_COUNT`：每次遊戲從題庫抽取的總題數。

> **💡 發用前測試：Mock Mode (假想情境)**
> 如果您剛接手專案且尚未設定好後端，只要保持網址為 `請替換成您的_GAS_發佈URL`，遊戲將自動以 **內建的 10 題測試題庫** 啟動運作並給予真實的評分，方便您確認畫面與互動邏輯。

---

## 📊 建立後端：Google Sheets 準備指南

為了將遊戲切換為真實連線模式，請先在 Google 雲端硬碟建立一份 **Google 試算表**，並建立以下兩個工作表 (Tabs)。以下為您準備了可以直接全選、反白複製的欄位標題行，請依序貼到該工作表中的 **第一列 (A1起選)**！

### 工作表 1：「題庫」
這是存放所有考題的地方。請直接複製下方這一行，貼入試算表第一列：

| originalIndex | question | optionA | optionB | optionC | optionD | answer |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

*(題庫詳細資料可參見稍早提供的 10 題無人機基礎測驗，將其內容接續貼在第二列之下即可)*

### 工作表 2：「成績紀錄」
這是寫入玩家作答歷程的地方。請直接複製下方這一行，貼入試算表第一列：

| 測試時間 | ID | 闖關次數 | 完成通關 | 分數 | 合格 | 正確答題 | 答題細節 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |

*(新增了 `playCount` 欄位以紀錄該玩家累積的遊玩/通關次數)*

---

## 📝 建立 API：Google Apps Script 設定

試算表建置完成後，我們需要串接 API 供遊戲端呼叫。

### 1. 撰寫與部署 Apps Script
1. 在剛剛的試算表上方面板點擊 **擴充功能 (Extensions) > Apps Script**。
2. 開啟後將編輯器內容清空，並貼上專案資料夾內 **`gas_backend.js`** 檔案裡的完整程式碼。
3. 存檔後，點擊右上角 **「部署 (Deploy)」 > 「新增部署作業)」**。
4. 類型選擇 **網頁應用程式 (Web app)**。
5. **執行身分**選擇 `我 (您的帳號)`；**誰可以存取**選擇 `所有人 (Anyone)`。
6. 完成授權後，複製系統配發的 **網頁應用程式網址 (Web app URL)**。

> ⚠️ **重要提醒：如何更新程式碼**
> 如果您未來有修改 Apps Script 裡面的程式碼，在按 Ctrl+S 儲存後，務必要點擊「部署」>「管理部署作業」>「編輯(鉛筆圖示)」，並將「版本」切換為 **「新版本 (New version)」**，再按下部署，您的修改才會真正生效！

### 2. 貼回遊戲設定
回到 `.env` 檔案中，將該段網址貼到 `VITE_GOOGLE_APP_SCRIPT_URL=` 後方。存檔後重新啟動開發伺服器 (`npm run dev`)，前端就正式串接雲端了！

### 🔍 附錄：API 介面需求規範
如果需要編寫或修改 Apps Script，請務必實作以下介面接收：

#### A. 讀取題目 `doGet(e)`
- **接收參數**：`count`（URL Query 變數，代表前端要抽取的題數）
- **回傳格式 (JSON)**：
  ```json
  {
    "data": [
      {
        "originalIndex": 1,
        "question": "問題內容",
        "options": { "A": "選項1", "B": "選項2", "C": "選項3", "D": "選項4" }
      }
    ]
  }
  ```

#### B. 送出答案 `doPost(e)`
- **接收參數**：POST Body (純文字字串)，可解析出包含 `playerId` (玩家 ID)、`answers` (`{ originalIndex, userAns }` 的陣列)、`passThreshold` (過關門檻) 等資訊。
- **回傳格式 (JSON)**：
  ```json
  {
    "success": true,
    "score": 80,
    "isPassed": true,
    "details": [
      {
        "originalIndex": 1,
        "userAns": "A",
        "standardAns": "A",
        "isCorrect": true
      }
    ]
  }
  ```
- *💡 註解：安全起見，答案比對與計分邏輯皆應由伺服器端 (GAS) 負擔處理，完成後再將詳細紀錄（含人類易讀的字串格式）寫入「成績紀錄」工作表，並將 `details` 陣列結果回傳給前端渲染結算明細畫面。*
