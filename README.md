# Valentine App

Uma carta de amor digital personalizada com o visual icônico do Spotify. Construída com React, Vite, Tailwind CSS e Framer Motion. Totalmente estática, pronta para ser hospedada gratuitamente e enviada para aquela pessoa especial!

**DESTAQUE:** Inclui um **Estúdio Creator (No-Code)** embutido, permitindo que você personalize tudo visualmente, sem tocar em uma única linha de código!

![Spotify Theme](https://img.shields.io/badge/Tema-Spotify-%231DB954)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

---

## Recursos Principais

- **Estúdio Creator Visual:** Interface intuitiva para adicionar músicas, fotos, datas e mensagens romanticas sem precisar programar.
- **Compressão Automática de Imagens:** As fotos enviadas pelo navegador são otimizadas e comprimidas automaticamente (sem perda perceptível de qualidade), prevenindo erros de armazenamento e garantindo carregamento ultra-rápido.
- **Playlist Personalizada:** Suporte a múltiplas músicas (Spotify ou YouTube) com reprodução em loop automático e botão de "Próxima Faixa".
- **Cronômetro de Amor:** Uma tela especial que mostra em tempo real há quantos dias, horas, minutos e segundos vocês estão juntos.
- **Fotos em Destaque:** Escolha uma foto específica para aparecer em destaque ao lado de cada mensagem, enquanto as outras flutuam suavemente no fundo.
- **Tipografia Responsiva:** Textos que se adaptam perfeitamente a qualquer tamanho de tela, com preservação de quebras de linha e parágrafos na mensagem final.
- **100% em Português (BR):** Toda a interface foi cuidadosamente traduzida e adaptada para soar natural e romântica.

---

## Guia Rápido: Como Criar e Publicar (Sem Código)

Você não precisa instalar nada no seu computador se usar o método de publicação via Netlify Drop. Siga estes passos simples:

### Passo 1: Abra o Estúdio Creator
Se o projeto já estiver hospedado online, basta acessar o link e clicar no link discreto *"✨ Crie seu próprio app de Valentine"* no rodapé da tela inicial. 
*(Se estiver rodando localmente: `npm run dev` e acesse `http://localhost:5173/?mode=creator`)*

### Passo 2: Personalize Visualmente
Preencha os campos no Estúdio Creator:
1. **Tela de Capa:** Defina o título e subtítulo principais.
2. **Sua Playlist:** Cole os links do Spotify ou YouTube (você pode adicionar até 5 músicas).
3. **Tempo de Namoro:** Selecione a data em que vocês começaram a namorar.
4. **Galeria de Fotos:** Faça o upload de até 10 fotos. *(O sistema comprimirá automaticamente as imagens para garantir que tudo funcione perfeitamente!)*
5. **Mensagens de Amor:** Escreva suas mensagens. Use o menu "Foto em Destaque" para escolher qual imagem aparece ao lado de cada texto.

### Passo 3: Salve e Visualize
Clique em **"Salvar e Visualizar"**. Uma nova aba abrirá mostrando exatamente como seu presente ficará. Teste a navegação, a música e o cronômetro!

### Passo 4: Publique e Envie o Link 
1. No Estúdio Creator, clique no botão branco **"Baixar ZIP Pronto para Publicar"**.
2. Acesse o site [app.netlify.com/drop](https://app.netlify.com/drop) (é gratuito e não exige conta para links temporários).
3. **Arraste e solte** o arquivo ZIP baixado na área indicada.
4. Em alguns segundos, a Netlify gerará um link `https://...netlify.app`. 
5. Copie esse link e envie para o seu Valentine! 💌

---

## Guia para Desenvolvedores (Modo Manual)

Se você preferir hospedar via GitHub, Vercel ou Heroku e editar os arquivos diretamente:

1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone <url-do-repositorio>
   cd valentines-app
   npm install
   ```

2. **Edite as configurações manualmente:**
   Abra o arquivo `src/content.config.js` e substitua os dados de exemplo pelos seus (links de músicas, caminhos das fotos em `/public/assets/` e suas mensagens).

3. **Rode localmente para testar:**
   ```bash
   npm run dev
   ```

4. **Gere a versão de produção:**
   ```bash
   npm run build
   ```
   Os arquivos otimizados estarão na pasta `dist/`, prontos para serem enviados para qualquer serviço de hospedagem estática.

---

## Estrutura do Projeto

```text
valentines-app/
├── public/
│   └── assets/          # (Opcional) Coloque suas fotos aqui se não usar o upload do Creator
├── src/
│   ├── components/
│   │   ├── CreatorStudio.jsx    # Interface visual de personalização
│   │   ├── FinaleScreen.jsx     # Tela da mensagem final com tipografia fluida
│   │   ├── FloatingPhotos.jsx   # Animação de fotos flutuantes no fundo
│   │   ├── IntroScreen.jsx      # Tela de capa com botão de início
│   │   ├── MessageScreen.jsx    # Telas de mensagens com foto em destaque
│   │   ├── MusicPlayer.jsx      # Gerenciador de iframe do Spotify/YouTube com loop
│   │   ├── NowPlayingBar.jsx    # Barra inferior com controles de música e volume
│   │   └── TimerScreen.jsx      # Cronômetro ao vivo do tempo de relacionamento
│   ├── hooks/
│   │   └── useContent.js        # Hook inteligente que sincroniza dados entre abas
│   ├── content.config.js        # Arquivo de configuração padrão (JSON)
│   ├── App.jsx                  # Orquestrador principal da navegação
│   └── index.css                # Estilos Tailwind e customizações do tema Spotify
├── index.html
├── package.json
└── README.md
```

---

## Dicas de Personalização

- **Fotos:** Para melhor resultado no upload visual, prefira imagens já otimizadas (abaixo de 2MB cada), embora o sistema comprima automaticamente.
- **Música:** Links de playlist do Spotify também funcionam perfeitamente e dão uma experiência ainda mais completa.
- **Mensagem Final:** Use `Enter` para criar parágrafos na mensagem final. O sistema preserva as quebras de linha para uma leitura poética e organizada.

---

## Licença

MIT — Sinta-se livre para usar, modificar e espalhar o amor!
