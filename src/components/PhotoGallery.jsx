import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function PhotoGallery({ onNext }) {
  const content = useContent();
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl md:text-4xl font-poppins font-bold mb-2 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Liked Songs
      </motion.h2>
      <motion.p 
        className="text-spotify-textSubdued mb-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {content.photos.length} memories
      </motion.p>

      {/* Photo Grid - Spotify style */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {content.photos.map((photo, index) => (
          <motion.div
            key={index}
            className="group relative aspect-square bg-spotify-dark rounded-lg overflow-hidden cursor-pointer transition-all hover:bg-spotify-lightDark"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <img 
              src={photo} 
              alt={`Memory ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-spotify-green/20', 'to-spotify-dark');
                e.target.parentNode.innerHTML += `<Heart class="text-spotify-green w-8 h-8" fill="currentColor" />`;
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </motion.div>
        ))}
      </motion.div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        className="mt-12 px-8 py-3 bg-spotify-green text-black font-bold rounded-full hover:bg-spotify-greenHover transition-all hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Next
      </motion.button>
    </motion.div>
  );
}
