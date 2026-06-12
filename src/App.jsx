import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useContent } from './hooks/useContent';
import IntroScreen from './components/IntroScreen';
import TimerScreen from './components/TimerScreen';
import MessageScreen from './components/MessageScreen';
import FinaleScreen from './components/FinaleScreen';
import NowPlayingBar from './components/NowPlayingBar';
import MusicPlayer from './components/MusicPlayer';
import CreatorStudio from './components/CreatorStudio';

export default function App() {
  const [isCreatorMode, setIsCreatorMode] = useState(window.location.search.includes('mode=creator'));
  const content = useContent();

  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'timer', 'message', 'finale'
  const [messageIndex, setMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Filtra links de música garantindo que sejam URLs válidas do Spotify ou YouTube
  const defaultSong = "https://open.spotify.com/track/5odlY52u43F5BjByhxg7wg";
  const rawSongs = content.songs && content.songs.length > 0 ? content.songs : [defaultSong];
  
  const songs = rawSongs.filter(song => 
    typeof song === 'string' && 
    song.trim().length > 10 && 
    (song.includes('spotify.com') || song.includes('youtube.com') || song.includes('youtu.be'))
  );

  // Fallback caso o filtro remova tudo
  const finalSongs = songs.length > 0 ? songs : [defaultSong];

  useEffect(() => {
    console.log("🎵 Playlist final carregada:", finalSongs.length, "faixa(s) válida(s)");
  }, [finalSongs]);

  if (isCreatorMode) {
    return <CreatorStudio />;
  }

  // Normalize messages to ensure they are objects with a 'text' property
  const normalizedMessages = content.messages.map(m => 
    typeof m === 'string' ? { text: m, photoIndex: null } : m
  );

  const regularMessages = normalizedMessages.slice(0, -1);
  const finaleMessageText = normalizedMessages[normalizedMessages.length - 1]?.text || "Happy Valentine's Day!";

  const handleStart = () => {
    setIsPlaying(true);
    setHasStarted(true);
    // Skip gallery, go straight to timer
    setTimeout(() => setCurrentStep('timer'), 1500);
  };

  const handleNext = () => {
    if (currentStep === 'timer') {
      setCurrentStep('message');
    } else if (currentStep === 'message') {
      if (messageIndex < regularMessages.length - 1) {
        setMessageIndex(prev => prev + 1);
      } else {
        setCurrentStep('finale');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'finale') {
      setCurrentStep('message');
      setMessageIndex(regularMessages.length - 1);
    } else if (currentStep === 'message') {
      if (messageIndex > 0) {
        setMessageIndex(prev => prev - 1);
      } else {
        setCurrentStep('timer');
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNextSong = () => {
    if (finalSongs.length > 1) {
      setCurrentSongIndex(prev => (prev + 1) % finalSongs.length);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black text-spotify-text font-inter relative overflow-x-hidden">
      {hasStarted && (
        <MusicPlayer 
          key={`player-${currentSongIndex}`}
          songs={finalSongs} 
          currentSongIndex={currentSongIndex} 
          isPlaying={isPlaying} 
          volume={volume} 
        />
      )}

      <main className={hasStarted ? "pb-20" : ""}>
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <IntroScreen key="intro" onStart={handleStart} />
          )}

          {currentStep === 'timer' && hasStarted && (
            <TimerScreen key="timer" onNext={handleNext} />
          )}

          {currentStep === 'message' && hasStarted && (
            <MessageScreen 
              key={`message-${messageIndex}`}
              index={messageIndex}
              onNext={handleNext}
              onBack={handleBack}
              totalMessages={regularMessages.length}
            />
          )}

          {currentStep === 'finale' && hasStarted && (
            <FinaleScreen 
              key="finale" 
              message={finaleMessageText} 
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </main>

      {hasStarted && (
        <NowPlayingBar 
          isPlaying={isPlaying} 
          onTogglePlay={togglePlay} 
          volume={volume} 
          onVolumeChange={setVolume}
          currentSongIndex={currentSongIndex}
          totalSongs={finalSongs.length}
          songs={finalSongs}
          onNextSong={handleNextSong}
        />
      )}
    </div>
  );
}
