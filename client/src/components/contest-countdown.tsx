'use client';

import { useEffect, useState } from 'react';

interface Props {
  endTime: Date;
}

const ContestCountdown = ({ endTime }: Props) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(endTime).getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime('Ended');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return <>{remainingTime}</>;
};

export default ContestCountdown;
