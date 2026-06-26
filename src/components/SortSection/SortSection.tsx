import { useState } from 'react';
import { Popover, Select, Stack, Button, Group } from '@mantine/core';
import { IconPlus, IconX, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { SortItem, SortDirection } from '../../engine/types';
import { useConfig } from '../../config/ConfigContext';
import styles from './SortSection.module.css';

interface Props {
  sorts: SortItem[];
  onAdd: (s: Omit<SortItem, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<SortItem>) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function SortEditor({ onSave, onCancel, existing }: {
  onSave: (s: Omit<SortItem, 'id'>) => void;
  onCancel: () => void;
  existing: string[];
}) {
  const { config } = useConfig();
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [direction, setDirection] = useState<SortDirection>('ASC');
  const available = config.fields.filter(f => !existing.includes(f.id));

  return (
    <Stack gap="sm" p="md" style={{ minWidth: 240 }}>
      <Select label="Colonne" placeholder="Choisir…"
        data={available.map(f => ({ value: f.id, label: f.label }))}
        value={fieldId} onChange={setFieldId} searchable size="sm" />
      <Select label="Ordre"
        data={[{ value: 'ASC', label: 'Croissant (A → Z)' }, { value: 'DESC', label: 'Décroissant (Z → A)' }]}
        value={direction} onChange={v => setDirection(v as SortDirection)} size="sm" />
      <Group gap="xs" justify="flex-end">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>Annuler</Button>
        <Button size="xs" disabled={!fieldId} onClick={() => fieldId && onSave({ fieldId, direction })}>Ajouter</Button>
      </Group>
    </Stack>
  );
}

export function SortSection({ sorts, onAdd, onUpdate, onRemove, onClear }: Props) {
  const { config } = useConfig();
  const [open, setOpen] = useState(false);

  function toggleDir(sort: SortItem) {
    onUpdate(sort.id, { direction: sort.direction === 'ASC' ? 'DESC' : 'ASC' });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Trier</span>
        <button className={styles.closeBtn} onClick={onClear}><IconX size={14} /></button>
      </div>
      <div className={styles.section}>
        {sorts.map(s => {
          const field = config.fields.find(f => f.id === s.fieldId);
          return (
            <span key={s.id} className={styles.pill}>
              {s.direction === 'ASC' ? <IconArrowUp size={13} /> : <IconArrowDown size={13} />}
              {field?.label ?? s.fieldId}
              <button className={styles.dirBtn} onClick={() => toggleDir(s)}>
                {s.direction}
              </button>
              <button className={styles.pillRemove} onClick={() => onRemove(s.id)}><IconX size={12} /></button>
            </span>
          );
        })}
        <Popover opened={open} onClose={() => setOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
          <Popover.Target>
            {sorts.length > 0 ? (
              <button className={styles.addBtn} onClick={() => setOpen(o => !o)} title="Ajouter un tri">
                <IconPlus size={14} />
              </button>
            ) : (
              <button className={styles.emptyBtn} onClick={() => setOpen(o => !o)}>
                Choisissez une colonne pour trier
              </button>
            )}
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <SortEditor
              onSave={s => { onAdd(s); setOpen(false); }}
              onCancel={() => setOpen(false)}
              existing={sorts.map(s => s.fieldId)}
            />
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  );
}
