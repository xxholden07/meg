# 📚 Buscador de Livros

Aplicação web em React que consome a **Google Books API** para buscar livros por título, autor ou termo geral. Desenvolvida com Vite e CSS Modules.

## ✨ Funcionalidades

| Épico | Funcionalidade |
|-------|---------------|
| Setup | Projeto Vite + React + ESLint |
| API Core | Busca por título, autor ou geral · Detalhes por ID · Paginação |
| UI | Barra de busca com tipo de busca · Cards de livros (capa, título, autor) |
| Estado | Loading (skeleton) · Mensagem de erro · "Nenhum resultado" |
| Avançado | Modal de detalhes (sinopse, editora, avaliação) · Botão "Carregar mais" |

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar chave de API (opcional, mas recomendado)
cp .env.example .env
# Edite .env e preencha VITE_GOOGLE_BOOKS_API_KEY

# 3. Iniciar em modo de desenvolvimento
npm run dev

# 4. Build de produção
npm run build
```

## 🔑 Chave de API

A aplicação funciona **sem chave** (limites da Google Books API se aplicam). Para maior cota, obtenha uma chave gratuita em [Google Cloud Console](https://console.cloud.google.com/), habilite a **Books API** e adicione ao arquivo `.env`:

```
VITE_GOOGLE_BOOKS_API_KEY=sua_chave_aqui
```

## 🗂️ Estrutura do Projeto

```
src/
├── assets/
│   └── book-placeholder.svg   # Imagem padrão para livros sem capa
├── components/
│   ├── SearchBar.jsx          # Input + seletor de tipo + botão
│   ├── BookCard.jsx           # Card individual (capa, título, autor)
│   ├── BookList.jsx           # Grade de cards + skeleton + "carregar mais"
│   └── BookDetails.jsx        # Modal com detalhes completos do livro
├── hooks/
│   └── useBooks.js            # Estado global de busca (loading, error, paginação)
├── services/
│   └── googleBooksApi.js      # Chamadas HTTP à Google Books API
├── App.jsx
└── main.jsx
```

## 🛠️ Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Executa o ESLint |

## 📦 Tecnologias

- [React 19](https://react.dev)
- [Vite 7](https://vitejs.dev)
- [Google Books API](https://developers.google.com/books)
- CSS Modules
- ESLint
