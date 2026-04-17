import { useState, useRef, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { initAudio, playClick, playSuccess, playFail } from './utils/sound';

const MOCK_DB = [
  { originalIndex: 1, question: '在無人機製造中，為了減輕機身重量並維持高強度，最常使用下列哪種複合材料？', options: { A: '玻璃纖維', B: '碳纖維', C: '鋁合金', D: '鈦合金' }, answer: 'B' },
  { originalIndex: 2, question: '被視為無人機的「大腦」，負責處理感測器數據並控制飛行姿態的核心元件是？', options: { A: '電子調速器', B: '飛控系統 (Flight Controller)', C: '接收機', D: '圖傳模組' }, answer: 'B' },
  { originalIndex: 3, question: '下列哪一種感測器主要用來持續測量無人機機身的加速度與角速度？', options: { A: 'GPS', B: '氣壓計', C: 'IMU (慣性測量單元)', D: '光流感測器' }, answer: 'C' },
  { originalIndex: 4, question: '目前消費級或產業用無人機，因能量密度高、重量輕，最常使用的電池種類是？', options: { A: '鎳氫電池', B: '鉛酸電池', C: '鋰離子電池 (Li-ion)', D: '鋰聚合物電池 (Li-Po)' }, answer: 'D' },
  { originalIndex: 5, question: '在多旋翼無人機中，負責接收飛控訊號並調節馬達轉速的電子元件為何？', options: { A: 'ESC (電子調速器)', B: 'PDB (電源分線板)', C: 'BEC (降壓模組)', D: 'OSD (螢幕顯示模組)' }, answer: 'A' },
  { originalIndex: 6, question: '在評估無人機的螺旋槳(Propeller)特性時，通常最關心哪兩個關鍵幾何參數？', options: { A: '顏色與材質', B: '重量與厚度', C: '直徑與螺距 (Pitch)', D: '轉速與電壓' }, answer: 'C' },
  { originalIndex: 7, question: '在進行無人機軟體研發時，目前業界主流用來讓實體機與地面站進行數據通訊的輕量化協定是？', options: { A: 'HTTP', B: 'MAVLink', C: 'FTP', D: 'SSH' }, answer: 'B' },
  { originalIndex: 8, question: '挑選無人機無刷馬達時常見的規格參數「KV值」，所代表的意義為何？', options: { A: '馬達的最大耗電功率', B: '空載時每伏特電壓對應的每分鐘轉速(RPM)', C: '馬達能產生的最大推力', D: '馬達的工作溫度上限' }, answer: 'B' },
  { originalIndex: 9, question: '用於精準農業噴灑或高精度地形測繪的無人機，通常會搭載哪種技術以達到「公分級」定位？', options: { A: '藍牙 (Bluetooth)', B: 'Wi-Fi 6', C: 'RTK (即時動態定位)', D: '毫米波雷達' }, answer: 'C' },
  { originalIndex: 10, question: '無人機組裝完成並準備於戶外首次起飛前，為了確保機頭朝向與導航準確，通常必須進行什麼校正？', options: { A: '攝影鏡頭焦距校正', B: '電池內阻校正', C: '羅盤 (指南針) 校正', D: '馬達死區校正' }, answer: 'C' },
];


export default function App() {
  const [gameState, setGameState] = useState('LOGIN'); // LOGIN, PLAYING, RESULT, LOADING
  const [playerId, setPlayerId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  // 初始化時將背景音樂音量調低
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // 降低至 15% 音量
    }
  }, []);

  const toggleMute = () => {
    initAudio();
    if (audioRef.current) {
      if (isMuted) audioRef.current.play().catch(e => console.log(e));
      else audioRef.current.pause();
    }
    setIsMuted(!isMuted);
    playClick();
  };

  const scriptUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
  const questionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5');
  const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3');

  const startGame = async (id) => {
    initAudio();
    playClick();
    const isMock = !scriptUrl || scriptUrl.includes('請替換成您的_GAS_發佈URL');
    setPlayerId(id);
    setGameState('LOADING');
    
    if (isMock) {
      // 假想情境 Mock Data (隨機從 MOCK_DB 挑選或直接取前幾題)
      setTimeout(() => {
        // 洗牌並抽取指定題數
        const shuffled = [...MOCK_DB].sort(() => 0.5 - Math.random());
        const mockQuestions = shuffled.slice(0, questionCount);
        
        setQuestions(mockQuestions);
        setAnswers([]);
        setGameState('PLAYING');
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`${scriptUrl}?count=${questionCount}`);
      const json = await res.json();
      
      if (json.data) {
        setQuestions(json.data);
        setAnswers([]);
        setGameState('PLAYING');
      } else {
        alert('取得題目失敗: ' + (json.error || '不明錯誤'));
        setGameState('LOGIN');
      }
    } catch (err) {
      alert('連線失敗，請確認你的 GAS URL 是否正確');
      setGameState('LOGIN');
    }
  };

  const submitGame = async (currentAnswers) => {
    setGameState('LOADING');
    const isMock = !scriptUrl || scriptUrl.includes('請替換成您的_GAS_發佈URL');

    if (isMock) {
      setTimeout(() => {
        // Mock 結果計算：根據 MOCK_DB 的 answer 驗證正確性
        let correctCount = 0;
        const reviewDetails = currentAnswers.map(a => {
          const mq = MOCK_DB.find(q => q.originalIndex === a.originalIndex);
          const isCorrect = mq && mq.answer === a.userAns;
          if (isCorrect) correctCount++;
          
          return {
            originalIndex: a.originalIndex,
            userAns: a.userAns,
            standardAns: mq ? mq.answer : '',
            isCorrect
          };
        });
        
        // 滿分 100 分，按比例計算
        const mockScore = (correctCount / questionCount) * 100;
        
        const isPassed = correctCount >= passThreshold;
        if (isPassed) playSuccess(); else playFail();

        setResult({
          score: Math.round(mockScore),
          isPassed: isPassed,
          details: reviewDetails,
          questions: questions
        });
        setGameState('RESULT');
      }, 1000);
      return;
    }

    try {
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // 避免 CORS preflight 機制阻擋
        },
        body: JSON.stringify({
          playerId,
          answers: currentAnswers,
          passThreshold
        })
      });
      const json = await res.json();
      
      if (json.success) {
        if (json.isPassed) playSuccess(); else playFail();
        setResult({
          score: json.score,
          isPassed: json.isPassed,
          details: json.details,
          questions: questions
        });
        setGameState('RESULT');
      } else {
        alert('送出答案失敗: ' + json.error);
        setGameState('LOGIN');
      }
    } catch (err) {
      alert('送出連線失敗');
      setGameState('LOGIN');
    }
  };

  const resetGame = () => {
    playClick();
    setGameState('LOGIN');
    setPlayerId('');
    setQuestions([]);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="game-container">
      {/* 移除了電子背景音樂，如果未來想加入柔和的音樂，可以在 src 放入 mp3 網址 */}
      <audio ref={audioRef} src="" loop />
      <button 
        onClick={toggleMute} 
        style={{ position: 'fixed', top: 20, right: 20, background: 'rgba(255,255,255,0.9)', border: '1px solid #cbd5e1', borderRadius: '50%', width: 45, height: 45, cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 100 }}
        title="Toggle Music"
      >
        {isMuted ? '🔇' : '🎵'}
      </button>

      {gameState === 'LOGIN' && <LoginScreen onStart={startGame} />}
      {gameState === 'LOADING' && <div className="blinking-text">STAGE LOADING...</div>}
      {gameState === 'PLAYING' && (
        <QuizScreen 
          questions={questions} 
          onComplete={submitGame} 
        />
      )}
      {gameState === 'RESULT' && (
        <ResultScreen 
          result={result} 
          onRestart={resetGame} 
        />
      )}
    </div>
  );
}
