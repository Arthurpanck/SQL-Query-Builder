import { IconArrowsSort, IconRowInsertBottom, IconChartBar } from '@tabler/icons-react';
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
      <div className={styles.miniButtons}>
        <button
          className={`${styles.miniBtn} ${(showSort || hasSorts) ? styles.miniBtnActive : ''}`}
          onClick={onToggleSort}
          title="Trier"
        >
          <IconArrowsSort size={16} stroke={1.8} />
        </button>
        <button
          className={`${styles.miniBtn} ${(showLimit || hasLimit) ? styles.miniBtnActive : ''}`}
          onClick={onToggleLimit}
          title="Limite de lignes"
        >
          <IconRowInsertBottom size={16} stroke={1.8} />
        </button>
      </div>
      <button className={styles.visualizeBtn}>
        <IconChartBar size={16} />
        Visualiser
      </button>
    </div>
  );
}
