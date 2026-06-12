import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Upload, Plus, Trash2, Download, Eye, Music, SkipForward } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function CreatorStudio() {
  const defaultConfig = {
    coverTitle: "Feito Para Você",
    coverSubtitle: "Uma Playlist de Valentine",
    startDate: "",
    songs: ["https://open.spotify.com/track/5odlY52u43F5BjByhxg7wg"],
    photos: [],
    messages: [
      { text: "Do momento em que te conheci, meu mundo ficou mais brilhante.", photoIndex: null },
      { text: "Cada dia com você parece minha música favorita em repeat.", photoIndex: null },
      { text: "Você é a razão pela qual eu sorrio para o celular igual bobo(a).", photoIndex: null },
      { text: "Não consigo imaginar minha vida sem as suas risadas.", photoIndex: null },
      { text: "Feliz Dia dos Namorados, meu amor. Você é o meu sempre. ❤️", photoIndex: null }
    ]
  };

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('valentineConfig');
      if (!saved) return defaultConfig;
      
      const parsed = JSON.parse(saved);
      
      // Migration: Convert old string messages to new object format
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0 && typeof parsed.messages[0] === 'string') {
        parsed.messages = parsed.messages.map(m => ({ text: m, photoIndex: null }));
      }
      
      // Ensure all messages have the correct object structure
      if (Array.isArray(parsed.messages)) {
        parsed.messages = parsed.messages.map(m => ({
          text: typeof m === 'string' ? m : (m.text || ""),
          photoIndex: m && m.photoIndex !== undefined ? m.photoIndex : null
        }));
      }

      // Migration: Convert old single songUrl to songs array
      if (parsed.songUrl && !Array.isArray(parsed.songs)) {
        parsed.songs = [parsed.songUrl];
        delete parsed.songUrl;
      }

      // Ensure songs is an array
      if (!Array.isArray(parsed.songs) || parsed.songs.length === 0) {
        parsed.songs = ["https://open.spotify.com/track/5odlY52u43F5BjByhxg7wg"];
      }

      return parsed;
    } catch (e) {
      console.error("Falha ao carregar configuração, resetando para o padrão", e);
      localStorage.removeItem('valentineConfig');
      return defaultConfig;
    }
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  // Automatic image compression function using HTML5 Canvas
  const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if image is too large
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with quality setting
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsCompressing(true);

    try {
      const compressedImages = await Promise.all(
        files.map(file => compressImage(file, 1200, 0.75))
      );

      setConfig(prev => ({
        ...prev,
        photos: [...prev.photos, ...compressedImages].slice(0, 10) // Max 10 photos
      }));
    } catch (error) {
      console.error("Erro ao comprimir imagem:", error);
      alert("Ocorreu um erro ao processar as imagens. Tente novamente.");
    } finally {
      setIsCompressing(false);
      // Reset file input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const removePhoto = (index) => {
    setConfig(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Validate song URL format (Spotify or YouTube)
  const isValidSongUrl = (url) => {
    if (!url) return false;
    const spotifyRegex = /open\.spotify\.com\/(track|playlist|album)\/[a-zA-Z0-9]+/;
    const youtubeRegex = /(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[a-zA-Z0-9_-]+/;
    return spotifyRegex.test(url) || youtubeRegex.test(url);
  };

  const addSong = () => {
    setConfig(prev => ({ ...prev, songs: [...prev.songs, ""] }));
  };

  const updateSong = (index, value) => {
    const newSongs = [...config.songs];
    newSongs[index] = value;
    setConfig(prev => ({ ...prev, songs: newSongs }));
  };

  const removeSong = (index) => {
    if (config.songs.length > 1) {
      setConfig(prev => ({ ...prev, songs: prev.songs.filter((_, i) => i !== index) }));
    }
  };

  const updateMessageText = (index, value) => {
    const newMessages = [...config.messages];
    newMessages[index] = { ...newMessages[index], text: value };
    setConfig(prev => ({ ...prev, messages: newMessages }));
  };

  const updateMessagePhoto = (index, photoIndexStr) => {
    const newMessages = [...config.messages];
    const photoIndex = photoIndexStr === "" ? null : parseInt(photoIndexStr, 10);
    newMessages[index] = { ...newMessages[index], photoIndex };
    setConfig(prev => ({ ...prev, messages: newMessages }));
  };

  const addMessage = () => {
    if (config.messages.length < 10) {
      setConfig(prev => ({ ...prev, messages: [...prev.messages, { text: "Nova mensagem...", photoIndex: null }] }));
    }
  };

  const removeMessage = (index) => {
    if (config.messages.length > 1) {
      setConfig(prev => ({ ...prev, messages: prev.messages.filter((_, i) => i !== index) }));
    }
  };

  const saveAndPreview = () => {
    try {
      console.log("💾 [CreatorStudio] Salvando configuração:", config);
      localStorage.setItem('valentineConfig', JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('valentine-sync'));
      const previewWindow = window.open('/', '_blank');
      if (!previewWindow) {
        alert("⚠️ Pop-up bloqueado! Permita pop-ups neste site para ver a visualização.");
      } else {
        alert("✅ Salvo com sucesso!\n\nVerifique a nova aba de visualização.\n💡 Dica: Se não atualizar instantaneamente, basta clicar em qualquer lugar da aba de visualização para forçar a atualização.");
      }
    } catch (e) {
      console.error("❌ [CreatorStudio] Falha ao salvar:", e);
      // Check specifically for localStorage quota exceeded error
      if (e.name === 'QuotaExceededError' || e.code === 22 || (e.message && e.message.toLowerCase().includes('quota'))) {
        alert("❌ Limite de armazenamento do navegador atingido!\n\nAs fotos em formato Base64 são muito grandes para o armazenamento local do navegador.\n\n💡 Soluções:\n1. Use MENOS fotos ou escolha imagens MENORES (comprima-as antes de enviar).\n2. OU: Coloque as fotos manualmente na pasta 'public/assets/' do projeto e use os caminhos (ex: '/assets/foto1.jpg') no arquivo content.config.js em vez de fazer o upload pelo Estúdio.");
      } else {
        alert("❌ Falha ao salvar. Seu navegador pode estar bloqueando o armazenamento local (ex: modo de navegação anônima restrito) ou ocorreu um erro inesperado.");
      }
    }
  };

  const resetToDefault = () => {
    if (window.confirm("Tem certeza que deseja restaurar todos os campos para o modelo padrão?")) {
      localStorage.removeItem('valentineConfig');
      window.location.reload();
    }
  };

  const generateAndDownload = async () => {
    const zip = new JSZip();
    const configContent = `export const content = ${JSON.stringify(config, null, 2)};`;
    zip.file("src/content.config.js", configContent);
    const readme = `# Seu App de Valentine está Pronto! 🎵\n\n1. Acesse https://app.netlify.com/drop\n2. Arraste e solte a pasta 'valentines-app' inteira aqui.\n3. A Netlify instantaneamente gerará um link ao vivo e compartilhável!\n\nDica: Suas fotos já estão incorporadas como Base64, então nenhum gerenciamento extra de arquivos é necessário.`;
    zip.file("COMO_PUBLICAR.txt", readme);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "valentines-app-config.zip");
    alert("ZIP baixado! Verifique o arquivo COMO_PUBLICAR.txt dentro dele para as instruções de hospedagem de 10 segundos.");
  };

  return (
    <div className="min-h-screen bg-spotify-black text-spotify-text p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-spotify-green/20 text-spotify-green mb-4">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-5xl font-poppins font-bold mb-2">Estúdio Creator Valentine</h1>
          <p className="text-spotify-textSubdued mb-4">Crie sua homenagem personalizada visualmente. Sem necessidade de código.</p>
          <button onClick={resetToDefault} className="text-xs text-spotify-textSubdued/60 hover:text-red-400 underline transition-colors">
            🔄 Restaurar campos para o padrão
          </button>
        </motion.div>

        <motion.div className="bg-spotify-dark rounded-2xl p-6 md:p-8 space-y-8 border border-spotify-lightDark" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          
          {/* 1. Cover Details */}
          <section>
            <h2 className="text-xl font-poppins font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-spotify-green text-black flex items-center justify-center text-sm font-bold">1</span>
              Tela de Capa
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-spotify-textSubdued mb-1">Título da Capa</label>
                <input type="text" value={config.coverTitle} onChange={(e) => setConfig({...config, coverTitle: e.target.value})} className="w-full bg-spotify-lightDark border border-transparent focus:border-spotify-green rounded-lg px-4 py-2.5 text-white outline-none transition-colors" placeholder="ex: Feito Para Você" />
              </div>
              <div>
                <label className="block text-sm font-medium text-spotify-textSubdued mb-1">Subtítulo da Capa</label>
                <input type="text" value={config.coverSubtitle} onChange={(e) => setConfig({...config, coverSubtitle: e.target.value})} className="w-full bg-spotify-lightDark border border-transparent focus:border-spotify-green rounded-lg px-4 py-2.5 text-white outline-none transition-colors" placeholder="ex: Uma Playlist de Valentine" />
              </div>
            </div>
          </section>

          {/* 2. Playlist */}
          <section>
            <h2 className="text-xl font-poppins font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-spotify-green text-black flex items-center justify-center text-sm font-bold">2</span>
              Sua Playlist <span className="text-xs font-normal text-spotify-textSubdued ml-2">(As músicas irão repetir automaticamente)</span>
            </h2>
            <div className="space-y-3">
              {config.songs.map((song, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="relative flex-1">
                    <Music className="absolute left-3 top-3 text-spotify-textSubdued" size={18} />
                    <input 
                      type="text" 
                      value={song}
                      onChange={(e) => updateSong(idx, e.target.value)}
                      className={`w-full bg-spotify-lightDark border rounded-lg pl-10 pr-10 py-2.5 text-white outline-none transition-colors ${
                        song && !isValidSongUrl(song) ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-spotify-green'
                      }`}
                      placeholder="https://open.spotify.com/track/... ou URL do YouTube"
                    />
                    {song && (
                      <div className="absolute right-3 top-3" title={isValidSongUrl(song) ? "Formato de link válido" : "Formato de link inválido. Use links do Spotify ou YouTube."}>
                        {isValidSongUrl(song) ? (
                          <span className="text-green-500 text-lg">✅</span>
                        ) : (
                          <span className="text-red-500 text-lg">⚠️</span>
                        )}
                      </div>
                    )}
                  </div>
                  {config.songs.length > 1 && (
                    <button onClick={() => removeSong(idx)} className="mt-2 text-spotify-textSubdued hover:text-red-400 transition-colors p-1"><Trash2 size={18} /></button>
                  )}
                </div>
              ))}
              {config.songs.length < 5 && (
                <button onClick={addSong} className="flex items-center gap-2 text-sm text-spotify-green hover:text-spotify-greenHover font-medium transition-colors">
                  <Plus size={16} /> Adicionar outra música
                </button>
              )}
            </div>
            <p className="text-xs text-spotify-textSubdued mt-3 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg">
              ⚠️ <strong>Nota:</strong> Algumas músicas podem não reproduzir devido a restrições de incorporação impostas pelo artista ou gravadora no Spotify/YouTube. Se uma música não tocar, tente substituí-la por outra.
            </p>
          </section>

          {/* 3. Time Together */}
          <section>
            <h2 className="text-xl font-poppins font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-spotify-green text-black flex items-center justify-center text-sm font-bold">3</span>
              Tempo de Namoro
            </h2>
            <div>
              <label className="block text-sm font-medium text-spotify-textSubdued mb-1">O Dia em que Começamos a Namorar</label>
              <input type="date" value={config.startDate} onChange={(e) => setConfig({...config, startDate: e.target.value})} className="w-full bg-spotify-lightDark border border-transparent focus:border-spotify-green rounded-lg px-4 py-2.5 text-white outline-none transition-colors" />
              <p className="text-xs text-spotify-textSubdued mt-1">Isso mostrará um cronômetro em tempo real da sua jornada juntos.</p>
            </div>
          </section>

          {/* 4. Photos */}
          <section>
            <h2 className="text-xl font-poppins font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-spotify-green text-black flex items-center justify-center text-sm font-bold">4</span>
              Galeria de Fotos (Máx. 10)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {config.photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={photo} alt={`Prévia ${idx}`} className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                </div>
              ))}
              {config.photos.length < 10 && (
                <button 
                  onClick={() => !isCompressing && fileInputRef.current?.click()} 
                  disabled={isCompressing}
                  className="aspect-square rounded-lg border-2 border-dashed border-spotify-lightDark hover:border-spotify-green flex flex-col items-center justify-center text-spotify-textSubdued hover:text-spotify-green transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompressing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Comprimindo...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} />
                      <span className="text-xs font-medium">Adicionar Foto</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" multiple className="hidden" />
            <p className="text-xs text-spotify-textSubdued">
              As fotos são comprimidas automaticamente para garantir desempenho perfeito e evitar erros de salvamento. 🚀
            </p>
          </section>

          {/* 5. Messages */}
          <section>
            <h2 className="text-xl font-poppins font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-spotify-green text-black flex items-center justify-center text-sm font-bold">5</span>
              Mensagens de Amor
            </h2>
            <div className="space-y-4">
              {config.messages.map((msg, idx) => (
                <div key={idx} className="bg-spotify-lightDark/50 rounded-xl p-4 border border-transparent focus-within:border-spotify-green/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-spotify-green uppercase tracking-wider">
                      {idx === config.messages.length - 1 ? 'Mensagem do Grande Final' : `Mensagem ${idx + 1}`}
                    </span>
                    {config.messages.length > 1 && (
                      <button onClick={() => removeMessage(idx)} className="text-spotify-textSubdued hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    )}
                  </div>
                  
                  <textarea
                    value={msg.text}
                    onChange={(e) => updateMessageText(idx, e.target.value)}
                    rows={3}
                    className="w-full bg-spotify-dark border border-transparent focus:border-spotify-green rounded-lg px-4 py-2.5 text-white outline-none transition-colors resize-none mb-3 whitespace-pre-wrap"
                    placeholder="Digite sua mensagem aqui... (Quebras de linha são preservadas!)"
                  />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-spotify-textSubdued whitespace-nowrap">Foto em Destaque:</span>
                    <select 
                      value={msg.photoIndex === null ? "" : msg.photoIndex}
                      onChange={(e) => updateMessagePhoto(idx, e.target.value)}
                      className="bg-spotify-dark border border-spotify-lightDark rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-spotify-green transition-colors"
                    >
                      <option value="">Nenhuma (Apenas texto)</option>
                      {config.photos.map((_, pIdx) => (
                        <option key={pIdx} value={pIdx}>Foto {pIdx + 1}</option>
                      ))}
                    </select>
                    {msg.photoIndex !== null && (
                      <span className="text-xs text-spotify-green">✨ Será exibida em destaque ao lado deste texto</span>
                    )}
                  </div>
                </div>
              ))}
              {config.messages.length < 10 && (
                <button onClick={addMessage} className="flex items-center gap-2 text-sm text-spotify-green hover:text-spotify-greenHover font-medium transition-colors">
                  <Plus size={16} /> Adicionar outra mensagem
                </button>
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-spotify-lightDark">
            <button onClick={saveAndPreview} className="flex-1 flex items-center justify-center gap-2 bg-spotify-green text-black font-bold py-3.5 rounded-full hover:bg-spotify-greenHover transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Eye size={18} /> Salvar e Visualizar
            </button>
            <button onClick={generateAndDownload} className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Download size={18} /> Baixar ZIP Pronto para Publicar
            </button>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <a href="/" className="text-spotify-textSubdued hover:text-white text-sm underline transition-colors">← Voltar para Visualização</a>
        </div>
      </div>
    </div>
  );
}
