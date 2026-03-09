import BookCard from './BookCard';
import styles from './BookList.module.css';

/**
 * BookList renders a responsive grid of BookCard components.
 *
 * @param {Object}   props
 * @param {Array}    props.books      - Array of normalized book objects
 * @param {Function} props.onSelect   - Called with a book when a card is clicked
 * @param {boolean}  props.loading    - Show skeleton placeholders while loading first page
 * @param {boolean}  props.hasMore    - Whether more pages are available
 * @param {Function} props.onLoadMore - Callback to load the next page
 * @param {boolean}  props.loadingMore- True while loading an additional page
 */
export default function BookList({ books, onSelect, loading, hasMore, onLoadMore, loadingMore }) {
  if (loading && books.length === 0) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Carregando livros">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (!loading && books.length === 0) {
    return null;
  }

  return (
    <section aria-label="Resultados da busca">
      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={onSelect} />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMoreWrapper}>
          <button
            className={styles.loadMoreBtn}
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Carregando…' : 'Carregar mais'}
          </button>
        </div>
      )}
    </section>
  );
}
