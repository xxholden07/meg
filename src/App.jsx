import { useState } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import { useBooks } from './hooks/useBooks';
import './App.css';

function App() {
  const { books, totalItems, loading, error, hasMore, search, loadMore } = useBooks();
  const [selectedBook, setSelectedBook] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  async function handleSearch(query, type) {
    setHasSearched(true);
    search(query, type, 0);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="appTitle">📚 Buscador de Livros</h1>
        <p className="appSubtitle">Explore milhões de livros via Google Books</p>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>

      <main className="main">
        {error && (
          <div className="errorBanner" role="alert">
            <span>⚠️ {error}</span>
          </div>
        )}

        {!loading && hasSearched && books.length === 0 && !error && (
          <div className="emptyState" role="status">
            <p>😔 Nenhum livro encontrado. Tente outro termo ou tipo de busca.</p>
          </div>
        )}

        {hasSearched && totalItems > 0 && (
          <p className="resultCount">
            {totalItems.toLocaleString('pt-BR')} resultado{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
          </p>
        )}

        <BookList
          books={books}
          onSelect={setSelectedBook}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadingMore={loadingMore}
        />
      </main>

      <footer className="footer">
        <p>Dados fornecidos pela <a href="https://books.google.com" target="_blank" rel="noreferrer">Google Books API</a></p>
      </footer>

      {selectedBook && (
        <BookDetails book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}

export default App;
