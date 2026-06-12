import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FloatingPhotos({ photos, count = 6, excludeIndex = null, sharper = false }) {
  const [photoStyles, setPhotoStyles] = useState([]);

  useEffect(() => {
    // Filter out the featured photo so it doesn't duplicate awkwardly in the background
    const availablePhotos = excludeIndex !== null && photos[excludeIndex] 
      ? photos.filter((_, idx) => idx !== excludeIndex)
      : photos;

    const maxPhotos = Math.min(count, availablePhotos.length);
    const styles = [];
    
    // Grid-like random placement to prevent overlap (max ~20% edge overlap)
    // We divide the screen into rough zones to ensure spacing
    const cols = 3;
    const rows = Math.ceil(maxPhotos / cols);
    
    for (let i = 0; i < maxPhotos; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      // Base position for the zone (in percentages)
      const baseTop = (row / rows) * 80 + 10; // 10% to 90%
      const baseLeft = (col / cols) * 80 + 10; // 10% to 90%
      
      // Add randomness within the zone (max +/- 10% to prevent crossing zone boundaries too much)
      const top = Math.min(85, Math.max(5, baseTop + (Math.random() * 20 - 10)));
      const left = Math.min(85, Math.max(5, baseLeft + (Math.random() * 20 - 10)));
      
      const size = 160 + Math.random() * 200; // 160px to 360px
      const duration = 15 + Math.random() * 15; // 15s to 30s
      const delay = Math.random() * 10;
      const rotation = -15 + Math.random() * 30; // -15deg to 15deg
      const src = availablePhotos[i % availablePhotos.length];

      styles.push({ top, left, duration, delay, size, rotation, src });
    }
    
    setPhotoStyles(styles);
  }, [photos, count, excludeIndex]);

  // Adjust opacity and blur based on the 'sharper' prop
  const opacityRange = sharper ? [0.35, 0.5, 0.35] : [0.15, 0.25, 0.15];
  const blurClass = sharper ? "" : "blur-[1px]";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {photoStyles.map((style, index) => (
        <motion.div
          key={`${style.src}-${style.top}-${style.left}`}
          className={`absolute rounded-lg overflow-hidden shadow-2xl ${blurClass}`}
          style={{
            width: style.size,
            height: style.size,
            top: `${style.top}%`,
            left: `${style.left}%`,
            rotate: style.rotation,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: opacityRange,
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [style.rotation, style.rotation + 5, style.rotation - 5, style.rotation]
          }}
          transition={{
            duration: style.duration,
            delay: style.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src={style.src} 
            alt="Floating memory" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
