import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer({ songs, currentSongIndex, isPlaying, volume }) {
  const iframeRef = useRef(null);
  const [isSpotify, setIsSpotify] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  // Este efeito só roda quando a música muda (currentSongIndex ou songs)
  // A mudança de volume NÃO dispara este efeito, evitando reinícios.
  useEffect(() => {
    const url = songs[currentSongIndex];
    if (!url || typeof url !== 'string') return;

    if (url.includes('spotify.com')) {
      setIsSpotify(true);
      const match = url.match(/track\/([a-zA-Z0-9]+)/) || url.match(/playlist\/([a-zA-Z0-9]+)/) || url.match(/episode\/([a-zA-Z0-9]+)/);
      if (match) {
        let type = 'track';
        if (url.includes('playlist')) type = 'playlist';
        if (url.includes('episode')) type = 'episode';
        
        setEmbedUrl(`https://open.spotify.com/embed/${type}/${match[1]}?utm_source=generator&theme=0&autoplay=1&repeat=1`);
      }
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setIsSpotify(false);
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else {
        try {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v') || '';
        } catch (e) {
          console.error("URL do YouTube inválida", e);
        }
      }
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&loop=1&playlist=${videoId}`);
      }
    }
  }, [songs, currentSongIndex]);

  // Controle de play/pause e volume APENAS para YouTube
  useEffect(() => {
    if (!isSpotify && iframeRef.current && embedUrl) {
      const timer = setTimeout(() => {
        if (!iframeRef.current) return;
        
        const action = isPlaying ? 'playVideo' : 'pauseVideo';
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: action }),
          '*'
        );
        
        if (volume === 0) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'mute' }),
            '*'
          );
        } else {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'unMute' }),
            '*'
          );
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.floor(volume)] }),
            '*'
          );
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, volume, isSpotify, embedUrl]);

  if (isSpotify) {
    return (
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="100%"
        height="80"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="hidden"
        title="Spotify Player"
      />
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      width="100%"
      height="80"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="hidden"
      title="YouTube Player"
    />
  );
}
