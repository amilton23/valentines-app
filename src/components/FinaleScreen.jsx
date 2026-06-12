import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import FloatingPhotos from './FloatingPhotos';

export default function FinaleScreen({ message, onBack }) {
  const content = useContent();
  // Fallback in case an object is accidentally passed instead of a string
  const finalText = typeof message === 'object' ? message?.text : message;
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 pb-32 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating Background Photos (up to 10, sharper for finale) */}
      <FloatingPhotos photos={content.photos} count={10} sharper={true} />
      
      {/* Subtle Dark Overlay for readability */}
      <div className="absolute inset-0 bg-spotify-black/70 z-0 pointer-events-none"></div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 max-w-4xl text-center w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="mb-8 flex justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Heart size={64} className="text-spotify-green" fill="currentColor" />
        </motion.div>

        {/* Responsive, scroll-safe message text with preserved line breaks */}
        <motion.div 
          className="max-h-[60vh] overflow-y-auto custom-scrollbar px-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-bold leading-tight lyric-text whitespace-pre-wrap">
            {finalText}
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-spotify-green to-transparent" />
        </motion.div>

        <motion.p
          className="mt-8 text-spotify-textSubdued font-inter text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Com todo o meu amor, Amiltinho
        </motion.p>

        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="mt-10 flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all hover:scale-105 group mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para as Mensagens
        </motion.button>
      </motion.div>

      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-spotify-green/20"
            initial={{ y: "100vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 1, 0] }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            <Heart size={24 + Math.random() * 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
