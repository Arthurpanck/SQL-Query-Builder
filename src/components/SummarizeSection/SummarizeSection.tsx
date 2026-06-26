import { useState } from 'react';
import { Popover, Select, Stack, Button, Group } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Metric, GroupBy, AggregationType } from '../../engine/types';
import { AGGREGATION_OPTIONS } from '../../config/operators';
import { useConfig } from '../../config/ConfigContext';
import styles from './SummarizeSection.module.css';

interface Props {
  metrics: Metric[];
  groups: GroupBy[];
  onAddMetric: (m: Omit<Metric, 'id'>) => void;
  onRemoveMetric: (id: string) => void;
  onAddGroup: (g: Omit<GroupBy, 'id'>) => void;
  onRemoveGroup: (id: string) => void;
  onClear: () => void;
}

function getMetricLabel(m: Metric, fields: ReturnType<typeof useConfig>['config']['fields']): string {
  const agg = AGGREGATION_OPTIONS.find(a => a.value === m.aggregation);
  if (!m.fieldId) return agg?.label ?? m.aggregation;
  const field = fields.find(f => f.id === m.fieldId);
  return `${agg?.label ?? m.aggregation} ${field?.label ?? m.fieldId}`;
}

function MetricEditor({ onSave, onCancel }: { onSave: (m: Omit<Metric, 'id'>) => void; onCancel: () => void }) {
  const { config } = useConfig();
  const [aggregation, setAggregation] = useState<AggregationType | null>(null);
  const [fieldId, setFieldId] = useState<string | null>(null);
  const aggOpt = AGGREGATION_OPTIONS.find(a => a.value === aggregation);
  const needsField = aggOpt?.fieldRequired ?? false;
  const numFields = config.fields.filter(f => f.type === 'number');
  const canSave = aggregation && (!needsField || fieldId);

  return (
    <Stack gap="sm" p="md" style={{ minWidth: 260 }}>
      <Select label="Fonction" placeholder="Choisir une fonction…"
        data={AGGREGATION_OPTIONS.map(a => ({ value: a.value, label: a.label }))}
        value={aggregation} onChange={v => { setAggregation(v as AggregationType); setFieldId(null); }} size="sm" />
      {needsField && (
        <Select label="Colonne" placeholder="Choisir une colonne…"
          data={numFields.map(f => ({ value: f.id, label: f.label }))}
          value={fieldId} onChange={setFieldId} searchable size="sm" />
      )}
      <Group gap="xs" justify="flex-end" mt="xs">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>Annuler</Button>
        <Button size="xs" disabled={!canSave} onClick={() => canSave && onSave({ aggregation: aggregation!, fieldId })} color="green">Ajouter</Button>
      </Group>
    </Stack>
  );
}

function GroupEditor({ onSave, onCancel, existing }: { onSave: (g: Omit<GroupBy, 'id'>) => void; onCancel: () => void; existing: string[] }) {
  const { config } = useConfig();
  const [fieldId, setFieldId] = useState<string | null>(null);
  const available = config.fields.filter(f => !existing.includes(f.id));

  return (
    <Stack gap="sm" p="md" style={{ minWidth: 240 }}>
      <Select label="Regrouper par" placeholder="Choisir une colonne…"
        data={available.map(f => ({ value: f.id, label: f.label }))}
        value={fieldId} onChange={setFieldId} searchable size="sm" />
      <Group gap="xs" justify="flex-end">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>Annuler</Button>
        <Button size="xs" disabled={!fieldId} onClick={() => fieldId && onSave({ fieldId })} color="green">Ajouter</Button>
      </Group>
    </Stack>
  );
}

export function SummarizeSection({ metrics, groups, onAddMetric, onRemoveMetric, onAddGroup, onRemoveGroup, onClear }: Props) {
  const { config } = useConfig();
  const [metricOpen, setMetricOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Résumer</span>
        <button className={styles.closeBtn} onClick={onClear} title="Supprimer le résumé"><IconX size={14} /></button>
      </div>
      <div className={styles.section}>
        <div className={styles.metricsBlock}>
          {metrics.map(m => (
            <span key={m.id} className={styles.metricPill}>
              {getMetricLabel(m, config.fields)}
              <button className={styles.pillRemove} onClick={() => onRemoveMetric(m.id)}><IconX size={12} /></button>
            </span>
          ))}
          <Popover opened={metricOpen} onClose={() => setMetricOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
            <Popover.Target>
              {metrics.length > 0 ? (
                <button className={styles.addBtn} onClick={() => setMetricOpen(o => !o)} title="Ajouter"><IconPlus size={14} /></button>
              ) : (
                <button className={styles.emptyMetricBtn} onClick={() => setMetricOpen(o => !o)}>Choisissez une fonction</button>
              )}
            </Popover.Target>
            <Popover.Dropdown p={0}>
              <MetricEditor onSave={m => { onAddMetric(m); setMetricOpen(false); }} onCancel={() => setMetricOpen(false)} />
            </Popover.Dropdown>
          </Popover>
        </div>

        <div className={styles.parLabel}>par</div>

        <div className={styles.groupsBlock}>
          {groups.map(g => {
            const field = config.fields.find(f => f.id === g.fieldId);
            return (
              <span key={g.id} className={styles.groupPill}>
                {field?.label ?? g.fieldId}
                <button className={styles.pillRemove} onClick={() => onRemoveGroup(g.id)}><IconX size={12} /></button>
              </span>
            );
          })}
          <Popover opened={groupOpen} onClose={() => setGroupOpen(false)} position="bottom-start" withArrow shadow="md" trapFocus>
            <Popover.Target>
              {groups.length > 0 ? (
                <button className={styles.addBtn} onClick={() => setGroupOpen(o => !o)} title="Ajouter"><IconPlus size={14} /></button>
              ) : (
                <button className={styles.emptyGroupBtn} onClick={() => setGroupOpen(o => !o)}>Choisissez une colonne pour regrouper par</button>
              )}
            </Popover.Target>
            <Popover.Dropdown p={0}>
              <GroupEditor onSave={g => { onAddGroup(g); setGroupOpen(false); }} onCancel={() => setGroupOpen(false)} existing={groups.map(g => g.fieldId)} />
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </div>
  );
}
