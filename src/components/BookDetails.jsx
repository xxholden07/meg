import { useEffect, useRef } from 'react';
import styles from './BookDetails.module.css';
import placeholderImg from '../assets/book-placeholder.svg';

/**
 * Modal BookDetails exibindo informações completas de um livro selecionado.
 *
 * @param {Object}   props
 * @param {Object}   props.book    - Objeto do livro normalizado
 * @param {Function} props.onClose - Callback para fechar o modal
 */
export default function BookDetails({ book, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Abre o dialog nativo ao montar; foca no botão de fechar
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    closeBtnRef.current?.focus();

    function handleBackdropClick(e) {
      if (e.target === dialog) onClose();
    }

    dialog.addEventListener('click', handleBackdropClick);
    return () => dialog.removeEventListener('click', handleBackdropClick);
  }, [onClose]);

  // Fecha ao pressionar Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const authorText =
    book.authors.length > 0 ? book.authors.join(', ') : 'Autor desconhecido';

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-label={`Detalhes: ${book.title}`}>
      <div className={styles.inner}>
        <button
          ref={closeBtnRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.coverCol}>
            <img
              className={styles.cover}
              src={book.thumbnail || placeholderImg}
              alt={`Capa de ${book.title}`}
              onError={(e) => { e.currentTarget.src = placeholderImg; }}
            />
            {book.averageRating && (
              <p className={styles.rating}>
                ⭐ {book.averageRating.toFixed(1)}{' '}
                <span className={styles.ratingCount}>({book.ratingsCount} avaliações)</span>
              </p>
            )}
          </div>

          <div className={styles.infoCol}>
            <h2 className={styles.title}>{book.title}</h2>
            <p className={styles.author}>{authorText}</p>

            {book.publisher && (
              <p className={styles.meta}>
                <strong>Editora:</strong> {book.publisher}
                {book.publishedDate && ` (${book.publishedDate.slice(0, 4)})`}
              </p>
            )}
            {book.pageCount && (
              <p className={styles.meta}>
                <strong>Páginas:</strong> {book.pageCount}
              </p>
            )}
            {book.categories.length > 0 && (
              <p className={styles.meta}>
                <strong>Categorias:</strong> {book.categories.join(', ')}
              </p>
            )}

            {book.description && (
              <div className={styles.descriptionWrapper}>
                <h3 className={styles.descLabel}>Sinopse</h3>
                <p
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </div>
            )}

            <div className={styles.links}>
              {book.previewLink && (
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  Pré-visualização
                </a>
              )}
              {book.infoLink && (
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  Mais informações
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
