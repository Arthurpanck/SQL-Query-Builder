import { useState } from 'react';
import { Popover, Text } from '@mantine/core';
import { IconPlus, IconX, IconChevronRight } from '@tabler/icons-react';
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

function FilterPill({
  filter,
  onUpdate,
  onRemove,
}: {
  filter: FilterCondition;
  onUpdate: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      opened={open}
      onClose={() => setOpen(false)}
      position="bottom-start"
      withArrow
      shadow="md"
      trapFocus
    >
      <Popover.Target>
        <span className={styles.pill} onClick={() => setOpen(o => !o)}>
          {getPillLabel(filter)}
          <button
            className={styles.pillRemove}
            onClick={e => { e.stopPropagation(); onRemove(); }}
            aria-label="Supprimer le filtre"
          >
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

function AddFilterButton({ onAdd }: { onAdd: Props['onAdd'] }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      opened={open}
      onClose={() => setOpen(false)}
      position="bottom-start"
      withArrow
      shadow="md"
      trapFocus
    >
      <Popover.Target>
        <button className={styles.addBtn} onClick={() => setOpen(o => !o)}>
          <IconPlus size={13} />
          Ajouter un filtre
        </button>
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
    <div className={styles.section}>
      <div className={styles.content}>
        <Text className={styles.label}>Filtrer</Text>
        <div className={styles.pills}>
          {filters.map(f => (
            <FilterPill
              key={f.id}
              filter={f}
              onUpdate={updates => onUpdate(f.id, updates)}
              onRemove={() => onRemove(f.id)}
            />
          ))}
          <AddFilterButton onAdd={onAdd} />
        </div>
      </div>
      <button className={styles.previewBtn} title="Aperçu des données">
        <IconChevronRight size={14} />
      </button>
    </div>
  );
}
