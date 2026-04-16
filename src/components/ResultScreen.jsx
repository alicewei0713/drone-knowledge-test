export default function ResultScreen({ result, onRestart }) {
  if (!result) return null;

  return (
    <div>
      <h1 className="cyber-title">STAGE CLEAR?</h1>
      <div className={`cyber-box ${result.isPassed ? 'success-effect' : 'fail-effect'}`}>
        <h2 className={result.isPassed ? "success-text" : "fail-text"}>
          {result.isPassed ? "MISSION ACCOMPLISHED!" : "GAME OVER"}
        </h2>
        
        <div className="score-text" style={{ color: result.isPassed ? 'var(--color-success)' : 'var(--color-danger)' }}>
          <p>SCORE: {result.score}</p>
        </div>

        {result.details && result.questions && (
          <div className="review-box" style={{ marginTop: '20px', textAlign: 'left', fontSize: '1.2rem', background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '5px', maxHeight: '300px', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '15px', color: '#ffcc00', textAlign: 'center' }}>📝 結算明細</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.details.map((detail, idx) => {
                const qObj = result.questions.find(q => q.originalIndex === detail.originalIndex);
                if (!qObj) return null;
                return (
                  <li key={idx} style={{ marginBottom: '15px', borderBottom: '2px dashed #555', paddingBottom: '10px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Q{idx + 1}:</strong> {qObj.question}
                    </div>
                    <div style={{ color: detail.isCorrect ? '#4ade80' : '#f87171' }}>
                      您的作答: {detail.userAns} ({qObj.options[detail.userAns]}) {detail.isCorrect ? '✔️' : '❌'}
                    </div>
                    {!detail.isCorrect && (
                      <div style={{ color: '#aaa', fontSize: '0.9em', marginTop: '5px' }}>
                        正確解答: {detail.standardAns} ({qObj.options[detail.standardAns]})
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        <button className="cyber-btn" onClick={onRestart} style={{ marginTop: '20px' }}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
