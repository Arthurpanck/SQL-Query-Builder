import { useState } from 'react';
import { Popover } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { FilterCondition } from '../../engine/types';
import { FilterEditor } from './FilterEditor';
import { fields, getOperatorsForType } from '../../config/fields';
import styles from './FilterSection.module.css';

interface Props {
  filters: FilterCondition[];
  onAdd: (condition: Omit<FilterCondition, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
}

function getPillLabel(filter: FilterCondition): string {
  const field = fields.find(f => f.id === filter.fieldId);
  if (!field) return '…';
  const ops = getOperatorsForType(field.type);
  const op = ops.find(o => o.value === filter.operator);
  const opLabel = op?.label ?? filter.operator;
  if (filter.operator === 'is_null') return `${field.label} est vide`;
  if (filter.operator === 'is_not_null') return `${field.label} n'est pas vide`;
  if (filter.operator === 'between') return `${field.label} entre ${filter.value} et ${filter.value2}`;
  return `${field.label} ${opLabel} ${filter.value ?? ''}`.trim();
}

function FilterPill({ filter, onUpdate, onRemove }: {
  filter: FilterCondition;
  onUpdate: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover opened={open} onClose={() => setOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
      <Popover.Target>
        <span className={styles.pill} onClick={() => setOpen(o => !o)}>
          {getPillLabel(filter)}
          <button className={styles.pillRemove} onClick={e => { e.stopPropagation(); onRemove(); }}>
            <IconX size={12} />
          </button>
        </span>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <FilterEditor
          initial={filter}
          onSave={updates => { onUpdate(updates); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

function AddFilterButton({ onAdd, hasFilters }: { onAdd: Props['onAdd']; hasFilters: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover opened={open} onClose={() => setOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
      <Popover.Target>
        {hasFilters ? (
          <button className={styles.addBtn} onClick={() => setOpen(o => !o)} title="Ajouter un filtre">
            <IconPlus size={14} />
          </button>
        ) : (
          <button className={styles.emptyBtn} onClick={() => setOpen(o => !o)}>
            Ajoutez des filtres pour affiner votre réponse
          </button>
        )}
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <FilterEditor
          onSave={condition => { onAdd(condition); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export function FilterSection({ filters, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Filtre</span>
      </div>
      <div className={styles.section}>
        {filters.map(f => (
          <FilterPill
            key={f.id}
            filter={f}
            onUpdate={updates => onUpdate(f.id, updates)}
            onRemove={() => onRemove(f.id)}
          />
        ))}
        <AddFilterButton onAdd={onAdd} hasFilters={filters.length > 0} />
      </div>
    </div>
  );
}
