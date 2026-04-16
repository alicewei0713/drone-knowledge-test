const SHEET_QUESTIONS = '題庫';
const SHEET_RECORDS = '成績紀錄';

// === 1. 處理前端要題目 (GET) ===
function doGet(e) {
  try {
    // 取得前端要求的題數，沒傳就預設 5 題
    const count = parseInt(e.parameter.count) || 5;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
    
    if (!sheet) throw new Error('找不到名為「題庫」的工作表');

    const data = sheet.getDataRange().getValues();
    let questions = [];
    
    // 將試算表資料整理成前端需要的格式 (略過第一列標題)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue; // 如果題號是空的就略過
      
      questions.push({
        originalIndex: row[0],
        question: row[1],
        options: {
          A: row[2],
          B: row[3],
          C: row[4],
          D: row[5]
        },
        answer: row[6] // 先暫時記錄標準答案
      });
    }

    // 把題目順序打亂 (洗牌) 並抽出前端要的數量
    questions = questions.sort(() => 0.5 - Math.random()).slice(0, count);

    // 【重要安全防護】不要把正確答案吐給前端以免被偷看
    const cleanQuestions = questions.map(q => {
      return {
        originalIndex: q.originalIndex,
        question: q.question,
        options: q.options
      };
    });

    // 回傳 JSON 給前端
    return ContentService.createTextOutput(JSON.stringify({ data: cleanQuestions }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// === 2. 處理前端繳交答案 (POST) ===
function doPost(e) {
  try {
    // 解析前端送過來的 JSON 字串
    const body = JSON.parse(e.postData.contents);
    const playerId = body.playerId || 'unknown';
    const answers = body.answers || []; 
    const passThreshold = parseInt(body.passThreshold) || 3;

    // 取得試算表中所有標準答案
    const sheetQuestions = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
    const qData = sheetQuestions.getDataRange().getValues();
    
    // 建立題解字典 (Key: 題號, Value: 正確選項)
    const answerDict = {};
    for (let i = 1; i < qData.length; i++) {
      const row = qData[i];
      if(row[0]) {
        const key = row[0].toString().trim();
        const val = row[6].toString().trim().toUpperCase();
        answerDict[key] = val; 
      }
    }

    // 計算玩家答對了幾題，並同時組裝易讀的作答明細
    let correctCount = 0;
    const detailsArray = [];
    const reviewDetails = []; // 給前端顯示用的明細

    answers.forEach(ans => {
      // 確保將前端傳來的 originalIndex 轉成乾淨的文字去比對
      const searchKey = ans.originalIndex.toString().trim();
      const standardAns = answerDict[searchKey] || "";
      const userAnsClean = ans.userAns.toString().trim().toUpperCase();
      
      const isCorrect = (standardAns === userAnsClean) && (standardAns !== "");
      
      if (isCorrect) {
        correctCount++;
      }
      
      // 組合格式例如： 第9題: 答A (正解A) ✔️
      const mark = isCorrect ? '✔️' : '❌';
      detailsArray.push(`第${ans.originalIndex}題: 答${ans.userAns} ${mark}`);
      
      reviewDetails.push({
        originalIndex: ans.originalIndex,
        userAns: ans.userAns,
        standardAns: standardAns,
        isCorrect: isCorrect
      });
    });

    // 計算百分比分數
    const totalQuestions = answers.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = correctCount >= passThreshold;

    const sheetRecords = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_RECORDS);
    if (!sheetRecords) throw new Error('找不到名為「成績紀錄」的工作表');
    
    const timestamp = new Date();
    // 使用 | 符號隔開所有的作答紀錄，讓試算表裡更容易閱讀
    const answersDetail = detailsArray.join(' | ');
    
    // 尋找相同 playerId 的既有紀錄
    const recordsData = sheetRecords.getDataRange().getValues();
    let targetRowIndex = -1;
    let playCount = 0;
    let clearCount = 0;

    // 玩家 ID 在 B 欄 (索引 1)，闖關次數在 C 欄 (索引 2)，完成通關在 D 欄 (索引 3)
    for (let i = 1; i < recordsData.length; i++) {
      if (recordsData[i][1] == playerId) {
        targetRowIndex = i + 1; // Google Sheets 行號是 1-based
        playCount = parseInt(recordsData[i][2]) || 0;
        clearCount = parseInt(recordsData[i][3]) || 0;
        break;
      }
    }

    playCount++; // 每次提交都算作一次闖關
    if (score === 100) {
      clearCount++; // 滿分 100 則完成通關次數 + 1
    }
    
    // 依序寫入: 測試時間 | ID | 闖關次數 | 完成通關 | 分數 | 合格 | 正確答題 | 答題細節
    const rowData = [timestamp, playerId, playCount, clearCount, score, isPassed, correctCount, answersDetail];

    if (targetRowIndex !== -1) {
      // 覆寫該玩家的資料列
      sheetRecords.getRange(targetRowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // 玩家第一次玩，新增一行
      sheetRecords.appendRow(rowData);
    }

    // 將計算好的結果回傳給前端顯示
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      score: score,
      isPassed: isPassed,
      details: reviewDetails
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
