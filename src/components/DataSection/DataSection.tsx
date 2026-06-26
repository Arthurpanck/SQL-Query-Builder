import { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronDown, IconChevronRight, IconLayoutGrid, IconArrowsJoin } from '@tabler/icons-react';
import { Checkbox } from '@mantine/core';
import { useConfig } from '../../config/ConfigContext';
import styles from './DataSection.module.css';

interface Props {
  selectedColumns: string[];
  onColumnToggle: (fieldId: string) => void;
  onSelectAll: () => void;
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

export function DataSection({ selectedColumns, onColumnToggle, onSelectAll }: Props) {
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

  const allSelected = selectedColumns.length === config.fields.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Données</span>
      </div>
      <div className={styles.sectionOuter}>
        <div className={styles.section}>
          <div className={styles.dropdownAnchor} ref={pillRef}>
            <div className={styles.tablePill}>
              <span className={styles.pillLeft} onClick={() => setPillOpen(o => !o)}>
                <IconLayoutGrid size={14} />
                <span className={styles.pillName}>{config.tableName}</span>
              </span>
              <span className={styles.pillDivider} />
              <button className={styles.pillChevronBtn} onClick={() => setPillOpen(o => !o)} title="Choisir des colonnes">
                <IconChevronDown size={14} />
              </button>
            </div>

            {pillOpen && (
              <div className={styles.pillDropdown}>
                <div className={styles.pillDropdownHeader}>
                  Choisir des colonnes
                </div>
                <div className={styles.pillDropdownDivider} />
                <div className={styles.columnList}>
                  {/* Select all */}
                  <div className={styles.columnItem} onClick={onSelectAll}>
                    <Checkbox
                      checked={allSelected}
                      onChange={onSelectAll}
                      color="blue"
                      size="sm"
                      onClick={e => e.stopPropagation()}
                    />
                    <span className={styles.colLabel} style={{ fontWeight: 700 }}>Tout sélectionner</span>
                  </div>
                  <div className={styles.pillDropdownDivider} />
                  {config.fields.map(f => (
                    <div key={f.id} className={styles.columnItem} onClick={() => onColumnToggle(f.id)}>
                      <Checkbox
                        checked={selectedColumns.includes(f.id)}
                        onChange={() => onColumnToggle(f.id)}
                        color="blue"
                        size="sm"
                        onClick={e => e.stopPropagation()}
                      />
                      <span className={styles.colTypeIcon}>{getFieldTypeIcon(f.type)}</span>
                      <span className={styles.colLabel}>{f.label}</span>
                    </div>
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

      <div className={styles.joinRow}>
        <button className={styles.joinBtn} disabled title="Non disponible dans cette version">
          <IconArrowsJoin size={14} />
          Joindre des données
        </button>
      </div>
    </div>
  );
}
