import {
  IconFilter,
  IconSum,
  IconArrowsSort,
  IconRowInsertBottom,
  IconColumns,
  IconArrowsJoin,
} from '@tabler/icons-react';
import styles from './NotebookToolbar.module.css';

interface Props {
  hasFilters: boolean;
  hasMetrics: boolean;
}

const TOOLS = [
  { id: 'filter', label: 'Filtrer', Icon: IconFilter, activeClass: 'activeFilter' },
  { id: 'summarize', label: 'Résumer', Icon: IconSum, activeClass: 'activeSummarize' },
  { id: 'join', label: 'Jointure', Icon: IconArrowsJoin, activeClass: 'active' },
  { id: 'sort', label: 'Trier', Icon: IconArrowsSort, activeClass: 'active' },
  { id: 'limit', label: 'Limite', Icon: IconRowInsertBottom, activeClass: 'active' },
  { id: 'custom', label: 'Colonne personnalisée', Icon: IconColumns, activeClass: 'active' },
] as const;

export function NotebookToolbar({ hasFilters, hasMetrics }: Props) {
  function isActive(id: string) {
    if (id === 'filter') return hasFilters;
    if (id === 'summarize') return hasMetrics;
    return false;
  }

  function getClassName(id: string, activeClass: string) {
    if (!isActive(id)) return styles.toolBtn;
    return `${styles.toolBtn} ${styles[activeClass as keyof typeof styles]}`;
  }

  return (
    <div className={styles.toolbar}>
      {TOOLS.map((tool, i) => (
        <>
          {i === 2 && <div key={`divider-${i}`} className={styles.divider} />}
          <button
            key={tool.id}
            className={getClassName(tool.id, tool.activeClass)}
            title={tool.label}
          >
            <tool.Icon size={14} />
            {tool.label}
          </button>
        </>
      ))}
    </div>
  );
}
