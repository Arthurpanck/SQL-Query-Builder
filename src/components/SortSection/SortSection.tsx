import { useState, useRef, useEffect, useCallback } from 'react';
import { IconX, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { SortItem, SortDirection } from '../../engine/types';
import { useConfig } from '../../config/ConfigContext';
import { CustomSelect } from '../ui/CustomSelect';
import styles from './SortSection.module.css';

interface Props {
  sorts: SortItem[];
  onAdd: (s: Omit<SortItem, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<SortItem>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);
  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);
  return { open, setOpen, ref };
}

const DIR_OPTIONS = [
  { value: 'ASC', label: 'Croissant (A → Z)' },
  { value: 'DESC', label: 'Décroissant (Z → A)' },
];

function SortEditor({ onSave, onCancel, existing }: {
  onSave: (s: Omit<SortItem, 'id'>) => void;
  onCancel: () => void;
  existing: string[];
}) {
  const { config } = useConfig();
  const [fieldId, setFieldId] = useState('');
  const [direction, setDirection] = useState('ASC');
  const available = config.fields.filter(f => !existing.includes(f.id));

  return (
    <div className={styles.editorInner}>
      <div>
        <div className={styles.editorLabel}>Colonne</div>
        <CustomSelect
          options={available.map(f => ({ value: f.id, label: f.label }))}
          value={fieldId}
          onChange={setFieldId}
          placeholder="Choisir une colonne…"
        />
      </div>
      <div>
        <div className={styles.editorLabel}>Ordre</div>
        <CustomSelect
          options={DIR_OPTIONS}
          value={direction}
          onChange={setDirection}
          placeholder="Choisir un ordre…"
        />
      </div>
      <div className={styles.editorActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuler</button>
        <button className={styles.saveBtn} disabled={!fieldId}
          onClick={() => fieldId && onSave({ fieldId, direction: direction as SortDirection })}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

export function SortSection({ sorts, onAdd, onUpdate, onRemove, onClear }: Props) {
  const { config } = useConfig();
  const dropdown = useDropdown();

  function toggleDir(sort: SortItem) {
    onUpdate(sort.id, { direction: sort.direction === 'ASC' ? 'DESC' : 'ASC' });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Trier</span>
        <button className={styles.closeBtn} onClick={onClear} title="Supprimer le tri"><IconX size={14} /></button>
      </div>
      <div className={styles.section}>
        {sorts.map(s => {
          const field = config.fields.find(f => f.id === s.fieldId);
          return (
            <span key={s.id} className={styles.pill}>
              {s.direction === 'ASC' ? <IconArrowUp size={13} /> : <IconArrowDown size={13} />}
              {field?.label ?? s.fieldId}
              <button className={styles.dirBtn} onClick={() => toggleDir(s)}>{s.direction}</button>
              <button className={styles.pillRemove} onClick={() => onRemove(s.id)}><IconX size={12} /></button>
            </span>
          );
        })}
        <div className={styles.dropdownAnchor} ref={dropdown.ref}>
          <button className={styles.addIconBtn} onClick={() => dropdown.setOpen(o => !o)} title="Ajouter un tri">+</button>
          {dropdown.open && (
            <div className={styles.dropdown}>
              <SortEditor
                onSave={s => { onAdd(s); dropdown.setOpen(false); }}
                onCancel={() => dropdown.setOpen(false)}
                existing={sorts.map(s => s.fieldId)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
