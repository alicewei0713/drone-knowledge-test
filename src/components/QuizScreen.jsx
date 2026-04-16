import { useState, useMemo } from 'react';

export default function QuizScreen({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQ = questions[currentIndex];

  // 使用 useMemo 為每個關卡隨機挑選關主圖片 (使用 originalIndex 做 seed，確保同題關主一樣)
  const bossSeed = useMemo(() => {
    if (!currentQ) return 'boss';
    return `boss_${currentQ.originalIndex}`;
  }, [currentQ]);

  const handleSelect = (optionKey) => {
    const newAnswers = [
      ...answers,
      { originalIndex: currentQ.originalIndex, userAns: optionKey }
    ];
    
    if (currentIndex + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers); // 完成所有填寫
    }
  };

  if (!currentQ) return null;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cyber)', color: 'var(--color-primary)' }}>
        STAGE {currentIndex + 1} / {questions.length}
      </h2>
      
      <div className="cyber-box">
        {/* 使用科技風 Bottts API 產生關主圖片 */}
        <img 
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${bossSeed}&size=150`} 
          alt="Boss" 
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
  );
}
