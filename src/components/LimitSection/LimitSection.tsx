import { IconX } from '@tabler/icons-react';
import { NumberInput } from '@mantine/core';
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
        <div className={styles.inputWrap}>
          <NumberInput
            value={limit ?? ''}
            onChange={v => onChange(v === '' || v === undefined ? null : Number(v))}
            min={1}
            max={1000000}
            placeholder="Ex: 1000"
            size="sm"
            style={{ width: 140 }}
          />
          <span className={styles.hint}>lignes maximum</span>
        </div>
      </div>
    </div>
  );
}
