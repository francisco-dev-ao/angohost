
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  message?: string;
  className?: string;
}

const CountdownTimer = ({ 
  initialMinutes = 15,
  message = "Não perca esta oferta!",
  className = ""
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: initialMinutes,
    seconds: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft.seconds > 0) {
        setTimeLeft({...timeLeft, seconds: timeLeft.seconds - 1});
      } else if (timeLeft.minutes > 0) {
        setTimeLeft({
          ...timeLeft,
          minutes: timeLeft.minutes - 1,
          seconds: 59
        });
      } else if (timeLeft.hours > 0) {
        setTimeLeft({
          hours: timeLeft.hours - 1,
          minutes: 59,
          seconds: 59
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className={`bg-primary text-white rounded-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="text-xl md:text-2xl font-bold">
          {timeLeft.hours > 0 && (
            <>{formatTime(timeLeft.hours)} : </>
          )}
          {formatTime(timeLeft.minutes)} : {formatTime(timeLeft.seconds)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
