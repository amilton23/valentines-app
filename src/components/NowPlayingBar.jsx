import { Play, Pause, Volume2, Volume1, VolumeX, SkipForward } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useState, useEffect } from 'react';

export default function NowPlayingBar({ isPlaying, onTogglePlay, volume, onVolumeChange, currentSongIndex, totalSongs, songs, onNextSong }) {
  const content = useContent();
  const [isMuted, setIsMuted] = useState(volume === 0);
  const currentSong = songs[currentSongIndex] || "";

  useEffect(() => {
    setIsMuted(volume === 0);
  }, [volume]);

  const getSongTitle = () => {
    if (!currentSong) return "Nossa música";
    if (currentSong.includes('spotify.com')) return "Nossa playlist";
    return "Nosso mix";
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    onVolumeChange(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(70);
      setIsMuted(false);
    } else {
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const isSpotify = currentSong.includes('spotify.com');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-dark border-t border-spotify-lightDark px-4 py-3 flex items-center justify-between z-50">
      {/* Track Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-spotify-lightDark rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
          {content && content.photos && content.photos[0] ? (
            <img 
              src={content.photos[0]} 
              alt="Cover" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hidden w-full h-full items-center justify-center bg-spotify-green text-black font-bold text-xs">
            ♪
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate hover:underline cursor-pointer">
            {getSongTitle()}
          </p>
          <p className="text-xs text-spotify-textSubdued truncate hover:underline cursor-pointer">
            {totalSongs > 1 ? `Faixa ${currentSongIndex + 1} de ${totalSongs}` : "Nossa música especial"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-1 justify-center">
        {totalSongs > 1 && (
          <button 
            onClick={onNextSong}
            className="text-spotify-textSubdued hover:text-white transition-colors p-1"
            title="Próxima Faixa"
          >
            <SkipForward size={20} />
          </button>
        )}
        <button 
          onClick={onTogglePlay}
          className="w-9 h-9 bg-spotify-text rounded-full flex items-center justify-center hover:scale-105 transition-transform text-spotify-black"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-end gap-2 flex-1 text-spotify-textSubdued">
        <button 
          onClick={toggleMute} 
          className="hover:text-white transition-colors p-1"
          title={isSpotify ? "O volume do Spotify é controlado pelo seu dispositivo" : "Alternar Mudo"}
        >
          <VolumeIcon size={18} />
        </button>
        
        <div 
          className="w-20 sm:w-24 h-1.5 bg-spotify-lightDark rounded-full cursor-pointer group relative hidden sm:block"
          onClick={handleVolumeClick}
          title={isSpotify ? "O volume do Spotify é controlado pelo seu dispositivo" : "Ajuste de volume"}
        >
          <div 
            className="h-full bg-spotify-text rounded-full group-hover:bg-spotify-green transition-colors relative"
            style={{ width: `${isMuted ? 0 : volume}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
