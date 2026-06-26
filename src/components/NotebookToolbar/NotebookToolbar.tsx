import { IconFilter, IconSum, IconArrowsSort } from '@tabler/icons-react';
import { IconList } from '../ui/IconList';
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
  const hasHidden = !showFilter || !showSummarize || !showSort || !showLimit;

  return (
    <div className={styles.toolbar}>
      {hasHidden && (
        <div className={styles.miniButtons}>
          {!showFilter && (
            <button className={`${styles.miniBtn} ${styles.filterBtn}`} onClick={onToggleFilter}>
              <IconFilter size={14} stroke={1.8} />Filtre
            </button>
          )}
          {!showSummarize && (
            <button className={`${styles.miniBtn} ${styles.summarizeBtn}`} onClick={onToggleSummarize}>
              <IconSum size={14} stroke={1.8} />Résumer
            </button>
          )}
          {!showSort && (
            <button className={`${styles.miniBtn} ${styles.neutralBtn}`} onClick={onToggleSort}>
              <IconArrowsSort size={14} stroke={1.8} />Trier
            </button>
          )}
          {!showLimit && (
            <button className={`${styles.miniBtn} ${styles.neutralBtn}`} onClick={onToggleLimit}>
              <IconList size={14} />Limite de lignes
            </button>
          )}
        </div>
      )}
      <button className={styles.visualizeBtn}>Visualiser</button>
    </div>
  );
}
