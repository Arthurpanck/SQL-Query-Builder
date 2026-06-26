import { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronDown, IconChevronRight, IconLayoutGrid, IconArrowsJoin } from '@tabler/icons-react';
import { useConfig } from '../../config/ConfigContext';
import styles from './DataSection.module.css';

export function DataSection() {
  const { config } = useConfig();
  const [pillOpen, setPillOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
      setPillOpen(false);
    }
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
            <button className={styles.tablePill} onClick={() => setPillOpen(o => !o)}>
              <span className={styles.pillIcon}><IconLayoutGrid size={14} /></span>
              {config.tableName}
              <span className={styles.pillDivider} />
              <span className={styles.pillChevron}><IconChevronDown size={14} /></span>
            </button>
            {pillOpen && (
              <div className={styles.pillDropdown}>
                <div className={styles.pillDropdownItem} style={{ fontWeight: 600, color: '#2e353b' }}>
                  <IconLayoutGrid size={14} color="#509ee3" />
                  {config.tableName}
                  <span style={{ marginLeft: 'auto', color: '#509ee3', fontSize: 11 }}>✓ Actif</span>
                </div>
                <div className={styles.pillDropdownDivider} />
                <div className={styles.pillDropdownHint}>
                  Pour changer de table, chargez un nouveau fichier XLSX via le bouton en haut de page.
                </div>
              </div>
            )}
          </div>
        </div>
        <button className={styles.arrowBtn} title="Voir les données">
          <IconChevronRight size={16} />
        </button>
      </div>

      {/* Joindre les données - inactive */}
      <div className={styles.joinRow}>
        <button className={styles.joinBtn} disabled title="Non disponible dans cette version">
          <IconArrowsJoin size={14} />
          Joindre des données
        </button>
      </div>
    </div>
  );
}
