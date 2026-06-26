import { IconChevronDown, IconChevronRight, IconLayoutGrid, IconList } from '@tabler/icons-react';
import { useConfig } from '../../config/ConfigContext';
import styles from './DataSection.module.css';

export function DataSection() {
  const { config } = useConfig();

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Données</span>
      </div>
      <div className={styles.sectionOuter}>
        <div className={styles.section}>
          <button className={styles.tablePill}>
            <span className={styles.pillIcon}>
              <IconLayoutGrid size={14} />
            </span>
            {config.tableName}
            <span className={styles.pillChevron}>
              <IconChevronDown size={14} />
            </span>
          </button>
        </div>
        <button className={styles.arrowBtn} title="Voir les données">
          <IconChevronRight size={16} />
        </button>
      </div>
      <div className={styles.iconButtons}>
        <button className={styles.iconBtn} title="Basculer la vue">
          <IconList size={16} />
        </button>
        <button className={styles.iconBtn} title="Vue grille">
          <IconLayoutGrid size={16} />
        </button>
      </div>
    </div>
  );
}
