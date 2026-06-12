import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function TimerScreen({ onNext }) {
  const content = useContent();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Format the start date nicely for display (e.g., "February 14, 2023")
  const formattedStartDate = content.startDate 
    ? new Date(content.startDate + 'T00:00:00').toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';

  useEffect(() => {
    if (!content.startDate) return;

    const calculateTime = () => {
      // Append T00:00:00 to prevent timezone offset from making the date look a day off
      const start = new Date(content.startDate + 'T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = now - start;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [content.startDate]);

  if (!content.startDate) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center p-8 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 bg-spotify-green text-black font-bold rounded-full hover:bg-spotify-greenHover transition-all hover:scale-105 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to Our Story
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    );
  }

  // Static TimeBlock to prevent constant visual refresh/flicker of days/hours/minutes
  // Only the text content updates, no layout animations on every tick
  const TimeBlock = ({ value, label, isSeconds = false }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      <div 
        className={`font-poppins font-bold mb-2 ${isSeconds ? 'text-4xl sm:text-6xl text-spotify-green' : 'text-4xl sm:text-6xl text-white'}`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs sm:text-sm text-spotify-textSubdued uppercase tracking-widest">
        {label}
      </div>
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-8 pb-24 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-spotify-green/5 to-transparent pointer-events-none" />

      <motion.div 
        className="text-center relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Heart size={48} className="text-spotify-green" fill="currentColor" />
        </motion.div>

        <h2 className="text-xl sm:text-2xl font-poppins font-semibold mb-1 text-spotify-textSubdued">
          Estamos juntos há
        </h2>
        {formattedStartDate && (
          <p className="text-sm text-spotify-green/80 mb-8 font-medium">
            Desde {formattedStartDate}
          </p>
        )}
        
        <div className="flex justify-center flex-wrap my-8">
          <TimeBlock value={timeLeft.days} label="Dias" />
          <span className="text-3xl sm:text-5xl font-bold text-spotify-textSubdued/30 self-center hidden sm:block">:</span>
          <TimeBlock value={timeLeft.hours} label="Horas" />
          <span className="text-3xl sm:text-5xl font-bold text-spotify-textSubdued/30 self-center hidden sm:block">:</span>
          <TimeBlock value={timeLeft.minutes} label="Minutos" />
          <span className="text-3xl sm:text-5xl font-bold text-spotify-textSubdued/30 self-center hidden sm:block">:</span>
          <TimeBlock value={timeLeft.seconds} label="Segundos" isSeconds={true} />
        </div>

        <p className="text-sm text-spotify-textSubdued/60 mb-10 italic">
          ...e contando para sempre.
        </p>

        <motion.button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 bg-spotify-green text-black font-bold rounded-full hover:bg-spotify-greenHover transition-all hover:scale-105 group mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Continuar para Nossa História
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
