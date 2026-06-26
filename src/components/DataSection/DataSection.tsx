import { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronDown, IconChevronRight, IconLayoutGrid, IconArrowsJoin } from '@tabler/icons-react';
import { useConfig } from '../../config/ConfigContext';
import styles from './DataSection.module.css';

interface Props {
  onColumnClick?: (fieldId: string) => void;
}

function getFieldTypeIcon(type: string): string {
  switch (type) {
    case 'number': return '#';
    case 'date': return '📅';
    case 'boolean': return '✓';
    case 'select': return '☰';
    default: return 'T';
  }
}

export function DataSection({ onColumnClick }: Props) {
  const { config } = useConfig();
  const [pillOpen, setPillOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (pillRef.current && !pillRef.current.contains(e.target as Node)) setPillOpen(false);
  }, []);

  useEffect(() => {
    if (pillOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pillOpen, handleClickOutside]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Données</span>
      </div>
      <div className={styles.sectionOuter}>
        <div className={styles.section}>
          <div className={styles.dropdownAnchor} ref={pillRef}>
            {/* Pill: table icon + name + divider + chevron */}
            <div className={styles.tablePill}>
              <span className={styles.pillLeft} onClick={() => setPillOpen(o => !o)}>
                <IconLayoutGrid size={14} />
                <span className={styles.pillName}>{config.tableName}</span>
              </span>
              <span className={styles.pillDivider} />
              <button className={styles.pillChevronBtn} onClick={() => setPillOpen(o => !o)} title="Voir les colonnes">
                <IconChevronDown size={14} />
              </button>
            </div>

            {pillOpen && (
              <div className={styles.pillDropdown}>
                <div className={styles.pillDropdownHeader}>
                  <IconLayoutGrid size={13} color="#509ee3" />
                  <span>{config.tableName}</span>
                  <span className={styles.colCount}>{config.fields.length} colonnes</span>
                </div>
                <div className={styles.pillDropdownDivider} />
                <div className={styles.columnList}>
                  {config.fields.map(f => (
                    <button
                      key={f.id}
                      className={styles.columnItem}
                      onClick={() => { onColumnClick?.(f.id); setPillOpen(false); }}
                      title="Filtrer par cette colonne"
                    >
                      <span className={styles.colTypeIcon}>{getFieldTypeIcon(f.type)}</span>
                      <span className={styles.colLabel}>{f.label}</span>
                      <span className={styles.colHint}>Filtrer →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <button className={styles.arrowBtn} title="Voir les données">
          <IconChevronRight size={16} />
        </button>
      </div>

      {/* Joindre les données — inactive */}
      <div className={styles.joinRow}>
        <button className={styles.joinBtn} disabled title="Non disponible dans cette version">
          <IconArrowsJoin size={14} />
          Joindre des données
        </button>
      </div>
    </div>
  );
}
