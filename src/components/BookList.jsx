import BookCard from './BookCard';
import styles from './BookList.module.css';

/**
 * BookList renderiza uma grade responsiva de componentes BookCard.
 *
 * @param {Object}   props
 * @param {Array}    props.books       - Array de objetos de livros normalizados
 * @param {Function} props.onSelect    - Chamado com um livro quando o card é clicado
 * @param {boolean}  props.loading     - Mostra placeholders skeleton durante o carregamento da primeira página
 * @param {boolean}  props.hasMore     - Indica se há mais páginas disponíveis
 * @param {Function} props.onLoadMore  - Callback para carregar a próxima página
 * @param {boolean}  props.loadingMore - Verdadeiro enquanto carrega uma página adicional
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
