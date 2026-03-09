const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';

/**
 * Monta a query string para busca na Google Books API.
 * @param {string} query - Texto de busca
 * @param {'title'|'author'|'general'} type - Tipo de busca
 * @returns {string} Query formatada
 */
function buildQuery(query, type) {
  const trimmed = query.trim();
  if (type === 'title') return `intitle:${trimmed}`;
  if (type === 'author') return `inauthor:${trimmed}`;
  return trimmed;
}

/**
 * Busca livros na Google Books API.
 * @param {string} query - Termo de busca
 * @param {'title'|'author'|'general'} type - Tipo de busca
 * @param {number} startIndex - Índice inicial para paginação (padrão 0)
 * @param {number} maxResults - Máximo de resultados por página (padrão 12)
 * @param {AbortSignal} signal - Sinal para cancelamento da requisição
 * @returns {Promise<{books: Array, totalItems: number}>}
 */
export async function searchBooks(query, type = 'general', startIndex = 0, maxResults = 12, signal) {
  if (!query || !query.trim()) {
    throw new Error('Por favor, insira um termo de busca.');
  }

  const params = new URLSearchParams({
    q: buildQuery(query, type),
    startIndex: startIndex.toString(),
    maxResults: maxResults.toString(),
    langRestrict: 'pt',
  });

  if (API_KEY) {
    params.set('key', API_KEY);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`, { signal });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return { books: [], totalItems: 0 };
  }

  const books = data.items.map(normalizeBook);
  return { books, totalItems: data.totalItems || 0 };
}

/**
 * Busca um livro específico pelo ID de volume da Google Books.
 * @param {string} id - ID do volume
 * @returns {Promise<Object>} Objeto do livro normalizado
 */
export async function getBookById(id) {
  const params = new URLSearchParams();
  if (API_KEY) params.set('key', API_KEY);

  const url = `${BASE_URL}/${id}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Livro não encontrado: ${response.status}`);
  }

  const data = await response.json();
  return normalizeBook(data);
}

/**
 * Normaliza um volume da API do Google Books para um formato consistente.
 * @param {Object} item - Item bruto da API
 * @returns {Object} Livro normalizado
 */
function normalizeBook(item) {
  const info = item.volumeInfo || {};
  return {
    id: item.id,
    title: info.title || 'Título desconhecido',
    authors: info.authors || [],
    publisher: info.publisher || '',
    publishedDate: info.publishedDate || '',
    description: info.description || '',
    pageCount: info.pageCount || null,
    categories: info.categories || [],
    averageRating: info.averageRating || null,
    ratingsCount: info.ratingsCount || null,
    language: info.language || '',
    thumbnail:
      info.imageLinks?.thumbnail?.replace('http://', 'https://') ||
      info.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
      null,
    previewLink: info.previewLink || '',
    infoLink: info.infoLink || '',
  };
}
