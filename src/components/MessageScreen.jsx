import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import FloatingPhotos from './FloatingPhotos';

export default function MessageScreen({ index, onNext, onBack, totalMessages }) {
  const content = useContent();
  const regularMessages = content.messages.slice(0, -1);
  const messageObj = regularMessages[index];
  
  const hasFeaturedPhoto = messageObj.photoIndex !== null && messageObj.photoIndex !== undefined && content.photos[messageObj.photoIndex];
  const featuredPhoto = hasFeaturedPhoto ? content.photos[messageObj.photoIndex] : null;

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 pb-24 relative overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Floating Background Photos (6 max, excluding featured) */}
      <FloatingPhotos photos={content.photos} count={6} excludeIndex={messageObj.photoIndex} />

      {/* Main Content Layout */}
      <motion.div 
        className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl w-full relative z-10 ${hasFeaturedPhoto ? '' : 'max-w-3xl'}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Featured Photo (if exists) */}
        {hasFeaturedPhoto && (
          <motion.div 
            className="w-full md:w-1/2 aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-spotify-lightDark bg-spotify-dark flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <img 
              src={featuredPhoto} 
              alt="Featured memory" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        )}

        {/* Message Text */}
        <motion.div 
          className={`text-center ${hasFeaturedPhoto ? 'md:w-1/2 md:text-left' : 'w-full'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold leading-relaxed tracking-wide whitespace-pre-wrap">
            {messageObj.text}
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 relative z-10">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-spotify-textSubdued font-semibold rounded-full hover:bg-white/10 hover:text-white transition-all hover:scale-105 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {index === 0 ? 'Voltar' : 'Voltar'}
        </motion.button>

        <motion.button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 bg-spotify-green text-black font-bold rounded-full hover:bg-spotify-greenHover transition-all hover:scale-105 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {index < totalMessages - 1 ? 'Continuar' : 'Ver Final'}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pb-20 z-10">
        {[...Array(totalMessages)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-spotify-green' : 'bg-spotify-lightDark'}`}
            initial={{ scale: 0 }}
            animate={{ scale: i === index ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
