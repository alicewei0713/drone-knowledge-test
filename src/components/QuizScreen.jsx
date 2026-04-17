import { useState, useMemo, useEffect } from 'react';
import { playClick, playTick, playTimeout } from '../utils/sound';

export default function QuizScreen({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQ = questions[currentIndex];

  // 每當題目切換時，重設為 15 秒
  useEffect(() => {
    setTimeLeft(15);
  }, [currentIndex]);

  // 處理倒數計時
  useEffect(() => {
    if (!currentQ) return;
    
    if (timeLeft <= 0) {
      playTimeout();
      handleSelect('TIMEOUT');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        // 在剩下最後幾秒時發出警告聲
        if (prev <= 4 && prev > 0) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, currentQ]);

  const bossSeed = useMemo(() => {
    if (!currentQ) return 'boss';
    return `boss_${currentQ.originalIndex}`;
  }, [currentQ]);

  const handleSelect = (optionKey) => {
    if (optionKey !== 'TIMEOUT') playClick();

    const newAnswers = [
      ...answers,
      { originalIndex: currentQ.originalIndex, userAns: optionKey }
    ];
    
    if (currentIndex + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  if (!currentQ) return null;

  const progressPercent = (timeLeft / 15) * 100;
  const progressColor = timeLeft <= 3 ? 'var(--color-danger)' : 'var(--color-primary)';

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cyber)', color: 'var(--color-primary)', fontWeight: 'bold' }}>
        STAGE {currentIndex + 1} / {questions.length}
      </h2>
      
      <div className="cyber-box" style={{ overflow: 'hidden' }}>
        {/* 進度條 */}
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progressPercent}%`, 
            background: progressColor, 
            transition: 'width 1s linear, background-color 0.3s' 
          }} />
        </div>

        <div key={currentIndex} className="slide-in-right">
          <img 
            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${bossSeed}&size=150&backgroundColor=f8fafc`} 
            alt="AI Assistant" 
            className="boss-image"
          />
          
          <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
            {currentQ.question}
          </h3>

          <div>
            {['A', 'B', 'C', 'D'].map(key => (
              currentQ.options[key] && (
                <button 
                  key={key} 
                  className="cyber-btn option-btn"
                  onClick={() => handleSelect(key)}
                >
                  <b style={{ fontFamily: 'var(--font-cyber)', marginRight: '10px' }}>{key}.</b> 
                  {currentQ.options[key]}
                </button>
              )
            ))}
          </div>

          {currentIndex > 0 && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                className="cyber-btn" 
                onClick={() => {
                  playClick();
                  setAnswers(answers.slice(0, -1));
                  setCurrentIndex(currentIndex - 1);
                }}
                style={{ fontSize: '0.9rem', padding: '10px 20px', borderColor: '#aaa', color: '#aaa' }}
              >
                ⬅ 上一題 (Back)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
