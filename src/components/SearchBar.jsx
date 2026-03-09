import { useState } from 'react';
import styles from './SearchBar.module.css';

const SEARCH_TYPES = [
  { value: 'general', label: 'Geral' },
  { value: 'title', label: 'Título' },
  { value: 'author', label: 'Autor' },
];

/**
 * Componente SearchBar com input de busca, seletor de tipo e botão de envio.
 *
 * @param {Object}   props
 * @param {Function} props.onSearch - Callback(query, tipo) chamado ao submeter
 * @param {boolean}  props.loading  - Desabilita o botão durante o carregamento
 */
export default function SearchBar({ onSearch, loading = false }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('general');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), type);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar livros…"
          aria-label="Buscar livros"
          disabled={loading}
        />
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Tipo de busca"
          disabled={loading}
        >
          {SEARCH_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button className={styles.button} type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </div>
    </form>
  );
}
