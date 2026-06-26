import { useState, useRef, useEffect, useCallback } from 'react';
import { IconX, IconChevronRight } from '@tabler/icons-react';
import { Metric, GroupBy, AggregationType } from '../../engine/types';
import { AGGREGATION_OPTIONS } from '../../config/operators';
import { useConfig } from '../../config/ConfigContext';
import { CustomSelect } from '../ui/CustomSelect';
import styles from './SummarizeSection.module.css';

interface Props {
  metrics: Metric[];
  groups: GroupBy[];
  onAddMetric: (m: Omit<Metric, 'id'>) => void;
  onRemoveMetric: (id: string) => void;
  onAddGroup: (g: Omit<GroupBy, 'id'>) => void;
  onRemoveGroup: (id: string) => void;
  onHide: () => void;
}

function getMetricLabel(m: Metric, fields: ReturnType<typeof useConfig>['config']['fields']): string {
  const agg = AGGREGATION_OPTIONS.find(a => a.value === m.aggregation);
  if (!m.fieldId) return agg?.label ?? m.aggregation;
  const field = fields.find(f => f.id === m.fieldId);
  return `${agg?.label ?? m.aggregation} ${field?.label ?? m.fieldId}`;
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

function MetricEditor({ onSave, onCancel }: { onSave: (m: Omit<Metric, 'id'>) => void; onCancel: () => void }) {
  const { config } = useConfig();
  const [aggregation, setAggregation] = useState('');
  const [fieldId, setFieldId] = useState('');
  const aggOpt = AGGREGATION_OPTIONS.find(a => a.value === aggregation);
  const needsField = aggOpt?.fieldRequired ?? false;
  const numFields = config.fields.filter(f => f.type === 'number');
  const canSave = aggregation !== '' && (!needsField || fieldId !== '');

  return (
    <div className={styles.editorInner}>
      <div>
        <div className={styles.editorLabel}>Fonction</div>
        <CustomSelect
          options={AGGREGATION_OPTIONS.map(a => ({ value: a.value, label: a.label }))}
          value={aggregation}
          onChange={v => { setAggregation(v); setFieldId(''); }}
          placeholder="Choisir une fonction…"
        />
      </div>
      {needsField && (
        <div>
          <div className={styles.editorLabel}>Colonne</div>
          <CustomSelect
            options={numFields.map(f => ({ value: f.id, label: f.label }))}
            value={fieldId}
            onChange={setFieldId}
            placeholder="Choisir une colonne…"
          />
        </div>
      )}
      <div className={styles.editorActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuler</button>
        <button className={styles.saveBtn} disabled={!canSave}
          onClick={() => canSave && onSave({ aggregation: aggregation as AggregationType, fieldId: fieldId || null })}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

function GroupEditor({ onSave, onCancel, existing }: { onSave: (g: Omit<GroupBy, 'id'>) => void; onCancel: () => void; existing: string[] }) {
  const { config } = useConfig();
  const [fieldId, setFieldId] = useState('');
  const available = config.fields.filter(f => !existing.includes(f.id));

  return (
    <div className={styles.editorInner}>
      <div>
        <div className={styles.editorLabel}>Regrouper par</div>
        <CustomSelect
          options={available.map(f => ({ value: f.id, label: f.label }))}
          value={fieldId}
          onChange={setFieldId}
          placeholder="Choisir une colonne…"
        />
      </div>
      <div className={styles.editorActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Annuler</button>
        <button className={styles.saveBtn} disabled={!fieldId} onClick={() => fieldId && onSave({ fieldId })}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

export function SummarizeSection({ metrics, groups, onAddMetric, onRemoveMetric, onAddGroup, onRemoveGroup, onHide }: Props) {
  const { config } = useConfig();
  const metricDropdown = useDropdown();
  const groupDropdown = useDropdown();

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Résumer</span>
        <button className={styles.closeBtn} onClick={onHide} title="Masquer"><IconX size={14} /></button>
      </div>
      <div className={styles.sectionOuter}>
        <div className={styles.section}>
          {/* Left: metrics */}
          <div className={styles.metricsBlock}>
            {metrics.map(m => (
              <span key={m.id} className={styles.metricPill}>
                {getMetricLabel(m, config.fields)}
                <button className={styles.pillRemove} onClick={() => onRemoveMetric(m.id)}><IconX size={12} /></button>
              </span>
            ))}
            <div className={styles.dropdownAnchor} ref={metricDropdown.ref}>
              {metrics.length > 0
                ? <button className={styles.addBtn} onClick={() => metricDropdown.setOpen(o => !o)} title="Ajouter">+</button>
                : <button className={styles.emptyMetricBtn} onClick={() => metricDropdown.setOpen(o => !o)}>Choisissez une fonction</button>
              }
              {metricDropdown.open && (
                <div className={styles.dropdown}>
                  <MetricEditor onSave={m => { onAddMetric(m); metricDropdown.setOpen(false); }} onCancel={() => metricDropdown.setOpen(false)} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.parLabel}>par</div>

          {/* Right: groups */}
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
            <div className={styles.dropdownAnchor} ref={groupDropdown.ref}>
              {groups.length > 0
                ? <button className={styles.addBtn} onClick={() => groupDropdown.setOpen(o => !o)} title="Ajouter">+</button>
                : <button className={styles.emptyGroupBtn} onClick={() => groupDropdown.setOpen(o => !o)}>Choisissez une colonne pour regrouper par</button>
              }
              {groupDropdown.open && (
                <div className={styles.dropdown}>
                  <GroupEditor onSave={g => { onAddGroup(g); groupDropdown.setOpen(false); }} onCancel={() => groupDropdown.setOpen(false)} existing={groups.map(g => g.fieldId)} />
                </div>
              )}
            </div>
          </div>
        </div>
        {(metrics.length > 0 || groups.length > 0) && (
          <button className={styles.arrowBtn} title="Voir les résultats"><IconChevronRight size={16} /></button>
        )}
      </div>
    </div>
  );
}
