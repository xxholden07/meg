import { useState, useCallback, useRef } from 'react';
import { searchBooks } from '../services/googleBooksApi';

const MAX_RESULTS = 12;

/**
 * Custom hook that encapsulates all book-search state and logic.
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastQuery, setLastQuery] = useState('');
  const [lastType, setLastType] = useState('general');

  // Abort controller ref to cancel in-flight requests
  const abortRef = useRef(null);

  const search = useCallback(async (query, type = 'general', page = 0) => {
    // Cancel any previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    if (page === 0) {
      setBooks([]);
      setTotalItems(0);
    }

    setLastQuery(query);
    setLastType(type);
    setCurrentPage(page);

    try {
      const startIndex = page * MAX_RESULTS;
      const result = await searchBooks(query, type, startIndex, MAX_RESULTS, abortRef.current.signal);
      setBooks((prev) => (page === 0 ? result.books : [...prev, ...result.books]));
      setTotalItems(result.totalItems);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    search(lastQuery, lastType, nextPage);
  }, [currentPage, lastQuery, lastType, search]);

  const reset = useCallback(() => {
    setBooks([]);
    setTotalItems(0);
    setError(null);
    setCurrentPage(0);
    setLastQuery('');
    setLastType('general');
  }, []);

  const hasMore = books.length < totalItems;

  return {
    books,
    totalItems,
    loading,
    error,
    currentPage,
    hasMore,
    search,
    loadMore,
    reset,
  };
}
