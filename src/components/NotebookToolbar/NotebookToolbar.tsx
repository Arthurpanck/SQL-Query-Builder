import { IconFilter, IconSum, IconArrowsSort, IconRowInsertBottom, IconArrowsJoin, IconChartBar } from '@tabler/icons-react';
import styles from './NotebookToolbar.module.css';

interface Props {
  hasFilters: boolean;
  hasMetrics: boolean;
  hasSorts: boolean;
  hasLimit: boolean;
  showSort: boolean;
  showLimit: boolean;
  onToggleSort: () => void;
  onToggleLimit: () => void;
}

export function NotebookToolbar({ hasSorts, hasLimit, showSort, showLimit, onToggleSort, onToggleLimit }: Props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.cards}>
        <button className={`${styles.card} ${styles.filter}`}>
          <IconFilter size={20} stroke={1.8} />Filtre
        </button>
        <button className={`${styles.card} ${styles.summarize}`}>
          <IconSum size={20} stroke={1.8} />Résumer
        </button>
        <button className={`${styles.card} ${styles.join}`}>
          <IconArrowsJoin size={20} stroke={1.8} />Joindre des données
        </button>
        <button
          className={`${styles.card} ${showSort || hasSorts ? styles.inactive : styles.inactive}`}
          onClick={onToggleSort}
          style={showSort || hasSorts ? { background: '#f0f1f4', color: '#4c525e' } : undefined}
        >
          <IconArrowsSort size={20} stroke={1.8} />Trier
        </button>
        <button
          className={`${styles.card} ${styles.inactive}`}
          onClick={onToggleLimit}
          style={showLimit || hasLimit ? { background: '#f0f1f4', color: '#4c525e' } : undefined}
        >
          <IconRowInsertBottom size={20} stroke={1.8} />Limite de lignes
        </button>
      </div>
      <button className={styles.visualizeBtn}>
        <IconChartBar size={16} />Visualiser
      </button>
    </div>
  );
}
