import { IconFilter, IconSum, IconArrowsSort, IconRowInsertBottom, IconChartBar } from '@tabler/icons-react';
import styles from './NotebookToolbar.module.css';

interface Props {
  showFilter: boolean;
  showSummarize: boolean;
  showSort: boolean;
  showLimit: boolean;
  onToggleFilter: () => void;
  onToggleSummarize: () => void;
  onToggleSort: () => void;
  onToggleLimit: () => void;
}

export function NotebookToolbar({ showFilter, showSummarize, showSort, showLimit, onToggleFilter, onToggleSummarize, onToggleSort, onToggleLimit }: Props) {
  const hasHiddenSections = !showFilter || !showSummarize || !showSort || !showLimit;

  return (
    <div className={styles.toolbar}>
      {hasHiddenSections && (
        <div className={styles.miniButtons}>
          {!showFilter && (
            <button className={`${styles.miniBtn} ${styles.filterBtn}`} onClick={onToggleFilter} title="Afficher les filtres">
              <IconFilter size={15} stroke={1.8} />
              <span>Filtre</span>
            </button>
          )}
          {!showSummarize && (
            <button className={`${styles.miniBtn} ${styles.summarizeBtn}`} onClick={onToggleSummarize} title="Afficher le résumé">
              <IconSum size={15} stroke={1.8} />
              <span>Résumer</span>
            </button>
          )}
          {!showSort && (
            <button className={`${styles.miniBtn} ${styles.neutralBtn}`} onClick={onToggleSort} title="Trier">
              <IconArrowsSort size={15} stroke={1.8} />
              <span>Trier</span>
            </button>
          )}
          {!showLimit && (
            <button className={`${styles.miniBtn} ${styles.neutralBtn}`} onClick={onToggleLimit} title="Limite de lignes">
              <IconRowInsertBottom size={15} stroke={1.8} />
              <span>Limite de lignes</span>
            </button>
          )}
        </div>
      )}
      <button className={styles.visualizeBtn}>
        <IconChartBar size={16} />
        Visualiser
      </button>
    </div>
  );
}
