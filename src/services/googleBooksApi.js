const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';

/**
 * Build query string for Google Books API search.
 * @param {string} query - Raw search text
 * @param {'title'|'author'|'general'} type - Search type
 * @returns {string} Formatted query string
 */
function buildQuery(query, type) {
  const trimmed = query.trim();
  if (type === 'title') return `intitle:${trimmed}`;
  if (type === 'author') return `inauthor:${trimmed}`;
  return trimmed;
}

/**
 * Search for books using the Google Books API.
 * @param {string} query - Search term
 * @param {'title'|'author'|'general'} type - Search type
 * @param {number} startIndex - Pagination start index (default 0)
 * @param {number} maxResults - Max results per page (default 12)
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
 * Fetch a single book by its Google Books volume ID.
 * @param {string} id - Volume ID
 * @returns {Promise<Object>} Normalized book object
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
 * Normalize a raw Google Books API volume into a consistent shape.
 * @param {Object} item - Raw API volume item
 * @returns {Object} Normalized book
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
