import styles from './BookCard.module.css';
import placeholderImg from '../assets/book-placeholder.svg';

/**
 * BookCard displays a book's cover thumbnail, title and authors.
 *
 * @param {Object}   props
 * @param {Object}   props.book     - Normalized book object
 * @param {Function} props.onClick  - Called when the card is activated
 */
export default function BookCard({ book, onClick }) {
  const authorText =
    book.authors.length > 0 ? book.authors.join(', ') : 'Autor desconhecido';

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(book);
    }
  }

  return (
    <article
      className={styles.card}
      onClick={() => onClick(book)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${book.title}`}
    >
      <div className={styles.coverWrapper}>
        <img
          className={styles.cover}
          src={book.thumbnail || placeholderImg}
          alt={`Capa do livro ${book.title}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = placeholderImg;
          }}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{authorText}</p>
        {book.publishedDate && (
          <p className={styles.date}>{book.publishedDate.slice(0, 4)}</p>
        )}
      </div>
    </article>
  );
}
