import { useState, useEffect } from 'react';
import "./pomodoro.css"

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 perc másodpercben
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert('A fókuszidő lejárt, tarts egy kis szünetet!');
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Idő formázása MM:SS alakban
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = (e) => {
    e.stopPropagation(); // Fontos: Ne nyissa ki / csukja be a kártyát kattintáskor
    setIsRunning(!isRunning);
  };

  const resetTimer = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="pomodoro-box">
      <span className="pomodoro-icon"> 🌿</span>
      <span className="timer-display">{formatTime(timeLeft)}</span>
      <button className="btn-mini" onClick={toggleTimer}>
        {isRunning ? 'SZÜNET' : 'START'}
      </button>
      <button className="btn-mini" onClick={resetTimer}>
        LENULLÁZÁS
      </button>
    </div>
  );
}

export default PomodoroTimer;