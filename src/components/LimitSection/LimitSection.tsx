import { IconX } from '@tabler/icons-react';
import styles from './LimitSection.module.css';

interface Props {
  limit: number | null;
  onChange: (limit: number | null) => void;
  onClear: () => void;
}

export function LimitSection({ limit, onChange, onClear }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Limite de lignes</span>
        <button className={styles.closeBtn} onClick={onClear}><IconX size={14} /></button>
      </div>
      <div className={styles.section}>
        <input
          className={styles.limitInput}
          type="number"
          min={1}
          max={1000000}
          placeholder="Saisir une limite"
          value={limit ?? ''}
          onChange={e => {
            const v = e.target.value;
            onChange(v === '' ? null : Math.max(1, parseInt(v, 10) || 1));
          }}
        />
      </div>
    </div>
  );
}
