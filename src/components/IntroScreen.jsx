import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function IntroScreen({ onStart }) {
  const content = useContent();
  return (
    <motion.div 
      className="fixed inset-0 z-40 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={content.photos[0] || "/assets/photo1.jpg"} 
          alt="Background" 
          className="w-full h-full object-cover blur-2xl scale-110 opacity-60"
          onError={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #1DB954 0%, #121212 100%)';
          }}
        />
        <div className="absolute inset-0 bg-spotify-black/60"></div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center flex flex-col items-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div 
          className="mb-6 p-4 bg-spotify-green/20 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart size={48} className="text-spotify-green" fill="currentColor" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-4 tracking-tight">
          {content.coverTitle}
        </h1>
        <p className="text-spotify-textSubdued text-lg md:text-xl mb-10 font-light tracking-wide">
          {content.coverSubtitle}
        </p>

        <motion.button
          onClick={onStart}
          className="group relative px-8 py-4 bg-spotify-green text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-spotify-greenHover shadow-lg spotify-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Clique para começar
            <Heart size={20} fill="currentColor" className="group-hover:animate-pulse" />
          </span>
        </motion.button>


      </motion.div>

      {/* Creator Mode Link */}
      <motion.a 
        href="/?mode=creator"
        className="absolute bottom-6 text-xs text-spotify-textSubdued/40 hover:text-spotify-green transition-colors underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        ✨ Customize sua própria experiência
      </motion.a>
    </motion.div>
  );
}
