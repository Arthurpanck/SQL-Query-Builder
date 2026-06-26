import { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import styles from './CustomSelect.module.css';

export interface SelectOption { value: string; label: string; }

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = 'Choisir…' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  const selected = options.find(o => o.value === value);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {selected
          ? <span className={styles.selected}>{selected.label}</span>
          : <span className={styles.placeholder}>{placeholder}</span>
        }
        <IconChevronDown size={14} className={`${styles.chevron} ${open ? styles.rotated : ''}`} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {opt.value === value && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
