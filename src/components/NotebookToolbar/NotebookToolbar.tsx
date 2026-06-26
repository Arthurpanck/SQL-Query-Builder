import {
  IconFilter,
  IconSum,
  IconArrowsSort,
  IconRowInsertBottom,
  IconArrowsJoin,
  IconChartBar,
} from '@tabler/icons-react';
import styles from './NotebookToolbar.module.css';

interface Props {
  hasFilters: boolean;
  hasMetrics: boolean;
}

export function NotebookToolbar({ hasFilters: _hasFilters, hasMetrics: _hasMetrics }: Props) {
  const tools = [
    { id: 'filter',    label: 'Filtre',             Icon: IconFilter,        colorClass: styles.filter },
    { id: 'summarize', label: 'Résumer',             Icon: IconSum,           colorClass: styles.summarize },
    { id: 'join',      label: 'Joindre des données', Icon: IconArrowsJoin,    colorClass: styles.join },
    { id: 'sort',      label: 'Trier',               Icon: IconArrowsSort,    colorClass: styles.inactive },
    { id: 'limit',     label: 'Limite de lignes',    Icon: IconRowInsertBottom, colorClass: styles.inactive },
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.cards}>
        {tools.map(tool => (
          <button key={tool.id} className={`${styles.card} ${tool.colorClass}`}>
            <tool.Icon size={20} stroke={1.8} />
            {tool.label}
          </button>
        ))}
      </div>
      <button className={styles.visualizeBtn}>
        <IconChartBar size={16} />
        Visualiser
      </button>
    </div>
  );
}
