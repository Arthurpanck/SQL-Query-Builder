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
  // A button disappears when its section is active (expanded)
  const sortActive = showSort || hasSorts;
  const limitActive = showLimit || hasLimit;

  return (
    <div className={styles.toolbar}>
      {/* Only show mini buttons for sections that are NOT currently expanded */}
      {(!sortActive || !limitActive) && (
        <div className={styles.miniButtons}>
          {!sortActive && (
            <button
              className={styles.miniBtn}
              onClick={onToggleSort}
              title="Trier"
            >
              <IconArrowsSort size={16} stroke={1.8} />
            </button>
          )}
          {!limitActive && (
            <button
              className={styles.miniBtn}
              onClick={onToggleLimit}
              title="Limite de lignes"
            >
              <IconRowInsertBottom size={16} stroke={1.8} />
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
