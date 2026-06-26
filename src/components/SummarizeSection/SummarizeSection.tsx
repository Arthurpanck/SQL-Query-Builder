import { useState } from 'react';
import { Popover, Select, Stack, Button, Group, Text } from '@mantine/core';
import { IconPlus, IconX, IconChevronRight } from '@tabler/icons-react';
import { Metric, GroupBy, AggregationType } from '../../engine/types';
import { fields, AGGREGATION_OPTIONS } from '../../config/fields';
import styles from './SummarizeSection.module.css';

interface Props {
  metrics: Metric[];
  groups: GroupBy[];
  onAddMetric: (metric: Omit<Metric, 'id'>) => void;
  onRemoveMetric: (id: string) => void;
  onAddGroup: (group: Omit<GroupBy, 'id'>) => void;
  onRemoveGroup: (id: string) => void;
}

function getMetricLabel(m: Metric): string {
  const agg = AGGREGATION_OPTIONS.find(a => a.value === m.aggregation);
  if (!m.fieldId) return agg?.label ?? m.aggregation;
  const field = fields.find(f => f.id === m.fieldId);
  return `${agg?.label ?? m.aggregation} de ${field?.label ?? m.fieldId}`;
}

function MetricEditor({
  onSave,
  onCancel,
}: {
  onSave: (m: Omit<Metric, 'id'>) => void;
  onCancel: () => void;
}) {
  const [aggregation, setAggregation] = useState<AggregationType | null>(null);
  const [fieldId, setFieldId] = useState<string | null>(null);

  const aggOption = AGGREGATION_OPTIONS.find(a => a.value === aggregation);
  const needsField = aggOption?.fieldRequired ?? false;
  const numericFields = fields.filter(f => f.type === 'number');

  const canSave = aggregation && (!needsField || fieldId);

  return (
    <Stack gap="sm" p="md" style={{ minWidth: 260 }}>
      <Select
        label="Agrégation"
        placeholder="Choisir une fonction…"
        data={AGGREGATION_OPTIONS.map(a => ({ value: a.value, label: a.label }))}
        value={aggregation}
        onChange={v => { setAggregation(v as AggregationType); setFieldId(null); }}
        size="sm"
      />
      {needsField && (
        <Select
          label="Champ"
          placeholder="Choisir un champ…"
          data={numericFields.map(f => ({ value: f.id, label: f.label }))}
          value={fieldId}
          onChange={setFieldId}
          searchable
          size="sm"
        />
      )}
      <Group gap="xs" justify="flex-end" mt="xs">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>Annuler</Button>
        <Button
          size="xs"
          disabled={!canSave}
          onClick={() => canSave && onSave({ aggregation: aggregation!, fieldId })}
          color="green"
        >
          Ajouter
        </Button>
      </Group>
    </Stack>
  );
}

function AddMetricButton({ onAdd }: { onAdd: Props['onAddMetric'] }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover opened={open} onClose={() => setOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
      <Popover.Target>
        <button className={styles.addMetricBtn} onClick={() => setOpen(o => !o)}>
          <IconPlus size={13} />
          Ajouter une métrique
        </button>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <MetricEditor
          onSave={m => { onAdd(m); setOpen(false); }}
          onCancel={() => setOpen(false)}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

function AddGroupButton({ onAdd, existing }: { onAdd: Props['onAddGroup']; existing: string[] }) {
  const [open, setOpen] = useState(false);
  const [fieldId, setFieldId] = useState<string | null>(null);
  const available = fields.filter(f => !existing.includes(f.id));

  return (
    <Popover opened={open} onClose={() => setOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
      <Popover.Target>
        <button className={styles.addGroupBtn} onClick={() => setOpen(o => !o)}>
          <IconPlus size={13} />
          Ajouter un regroupement
        </button>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Stack gap="sm" p="md" style={{ minWidth: 240 }}>
          <Select
            label="Regrouper par"
            placeholder="Choisir un champ…"
            data={available.map(f => ({ value: f.id, label: f.label }))}
            value={fieldId}
            onChange={setFieldId}
            searchable
            size="sm"
          />
          <Group gap="xs" justify="flex-end">
            <Button variant="subtle" size="xs" color="gray" onClick={() => setOpen(false)}>Annuler</Button>
            <Button
              size="xs"
              disabled={!fieldId}
              onClick={() => { if (fieldId) { onAdd({ fieldId }); setOpen(false); setFieldId(null); } }}
              color="blue"
            >
              Ajouter
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export function SummarizeSection({ metrics, groups, onAddMetric, onRemoveMetric, onAddGroup, onRemoveGroup }: Props) {
  const hasMetrics = metrics.length > 0;
  const hasGroups = groups.length > 0;

  return (
    <div className={styles.section}>
      <div className={styles.content}>
        <Text className={styles.label}>Résumer</Text>
        <div className={styles.row}>
          {metrics.map(m => (
            <span key={m.id} className={styles.metricPill}>
              {getMetricLabel(m)}
              <button
                className={styles.pillRemove}
                onClick={() => onRemoveMetric(m.id)}
                aria-label="Supprimer la métrique"
              >
                <IconX size={12} />
              </button>
            </span>
          ))}
          <AddMetricButton onAdd={onAddMetric} />

          {(hasMetrics || hasGroups) && (
            <Text className={styles.byLabel}>par</Text>
          )}

          {groups.map(g => {
            const field = fields.find(f => f.id === g.fieldId);
            return (
              <span key={g.id} className={styles.groupPill}>
                {field?.label ?? g.fieldId}
                <button
                  className={styles.pillRemove}
                  onClick={() => onRemoveGroup(g.id)}
                  aria-label="Supprimer le regroupement"
                >
                  <IconX size={12} />
                </button>
              </span>
            );
          })}

          <AddGroupButton onAdd={onAddGroup} existing={groups.map(g => g.fieldId)} />
        </div>
      </div>
      <button className={styles.previewBtn} title="Aperçu des données">
        <IconChevronRight size={14} />
      </button>
    </div>
  );
}
