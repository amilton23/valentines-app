import { useState, useEffect, useCallback } from 'react';
import { content as defaultContent } from '../content.config';

export function useContent() {
  // Initialize state
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('valentineConfig');
      if (saved) {
        console.log("🎵 [useContent] Loaded from localStorage:", JSON.parse(saved).coverTitle);
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("❌ [useContent] Failed to parse localStorage", e);
    }
    console.log("🎵 [useContent] Using default content");
    return defaultContent;
  });

  // Function to force a sync from localStorage
  const syncContent = useCallback(() => {
    try {
      const saved = localStorage.getItem('valentineConfig');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("🔄 [useContent] Synced fresh data:", parsed.coverTitle);
        setContent(parsed);
      }
    } catch (e) {
      console.error("❌ [useContent] Failed to sync", e);
    }
  }, []);

  useEffect(() => {
    // 1. Listen for changes from OTHER tabs (standard browser behavior)
    window.addEventListener('storage', syncContent);
    
    // 2. Listen for window focus (TRIGGERS when you click back to the preview tab!)
    window.addEventListener('focus', syncContent);
    
    // 3. Listen for our custom instant-sync event
    window.addEventListener('valentine-sync', syncContent);
    
    // 4. Force a sync on initial mount just to be absolutely sure
    syncContent();

    return () => {
      window.removeEventListener('storage', syncContent);
      window.removeEventListener('focus', syncContent);
      window.removeEventListener('valentine-sync', syncContent);
    };
  }, [syncContent]);

  return content;
}
