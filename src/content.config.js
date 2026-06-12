// content.config.js
// Edite este arquivo para personalizar sua mensagem de Valentine!
// Adicione suas fotos na pasta /public/assets/ e referencie-as aqui.

export const content = {
  coverTitle: "Feito Para Você",
  coverSubtitle: "Uma Playlist de Valentine",
  startDate: "", // ex: "2022-02-14"
  
  // Múltiplas músicas! Elas irão repetir automaticamente.
  songs: [
    "https://open.spotify.com/track/5odlY52u43F5BjByhxg7wg",
    // Adicione mais URLs do Spotify ou YouTube aqui
  ],
  
  // Fotos para exibir na galeria (coloque-as em /public/assets/)
  photos: [
    "/assets/photo1.jpg",
    "/assets/photo2.jpg",
    "/assets/photo3.jpg",
    "/assets/photo4.jpg",
  ],
  
  // Mensagens: Cada mensagem pode ter uma foto em destaque opcional (índice baseado em 0)
  messages: [
    { text: "Do momento em que te conheci, meu mundo ficou mais brilhante.", photoIndex: null },
    { text: "Cada dia com você parece minha música favorita em repeat.", photoIndex: 0 },
    { text: "Você é a razão pela qual eu sorrio para o celular igual bobo(a).", photoIndex: 1 },
    { text: "Não consigo imaginar minha vida sem as suas risadas.", photoIndex: 2 },
    { text: "Feliz Dia dos Namorados, meu amor.\n\nVocê é o meu sempre. ❤️", photoIndex: 3 } // Final
  ]
};
