import { useState, useRef, useEffect, useCallback } from 'react';
import { IconX, IconChevronRight, IconSearch, IconChevronLeft } from '@tabler/icons-react';
import { FilterCondition, FilterOperator, FieldType } from '../../engine/types';
import { getOperatorsForType } from '../../config/operators';
import { useConfig } from '../../config/ConfigContext';
import styles from './FilterSection.module.css';

interface Props {
  filters: FilterCondition[];
  prefilledFieldId?: string | null;
  onPrefilledConsumed?: () => void;
  onAdd: (condition: Omit<FilterCondition, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
  onHide: () => void;
}

function getFieldTypeIcon(type: FieldType): string {
  switch (type) {
    case 'number': return '#';
    case 'date': return '📅';
    case 'boolean': return '✓';
    case 'select': return '☰';
    default: return 'T';
  }
}

function getPillLabel(filter: FilterCondition, fields: ReturnType<typeof useConfig>['config']['fields']): string {
  const field = fields.find(f => f.id === filter.fieldId);
  if (!field) return '…';
  const ops = getOperatorsForType(field.type);
  const opLabel = ops.find(o => o.value === filter.operator)?.label ?? filter.operator;
  if (filter.operator === 'is_null') return `${field.label} est vide`;
  if (filter.operator === 'is_not_null') return `${field.label} n'est pas vide`;
  if (filter.operator === 'between') return `${field.label} entre ${filter.value} et ${filter.value2}`;
  return `${field.label} ${opLabel} ${filter.value ?? ''}`.trim();
}

interface FilterPickerProps {
  onSave: (condition: Omit<FilterCondition, 'id'>) => void;
  initial?: FilterCondition;
  initialFieldId?: string | null;
}

function FilterPicker({ onSave, initial, initialFieldId }: FilterPickerProps) {
  const { config } = useConfig();
  const startField = initial?.fieldId ?? initialFieldId ?? null;
  const [step, setStep] = useState<'field' | 'value'>(startField ? 'value' : 'field');
  const [search, setSearch] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(startField);
  const [operator, setOperator] = useState<FilterOperator>(initial?.operator ?? 'equals');
  const [value, setValue] = useState<string>(initial?.value !== null && initial?.value !== undefined ? String(initial.value) : '');
  const [value2, setValue2] = useState<string>(initial?.value2 !== null && initial?.value2 !== undefined ? String(initial.value2) : '');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initial?.value !== null && initial?.value !== undefined ? [String(initial.value)] : []
  );

  const selectedField = config.fields.find(f => f.id === selectedFieldId);
  const operators = selectedField ? getOperatorsForType(selectedField.type) : [];
  const filteredFields = config.fields.filter(f => f.label.toLowerCase().includes(search.toLowerCase()));

  // When initialFieldId changes (prefilled from DataSection), reset to value step
  useEffect(() => {
    if (initialFieldId && !initial) {
      const field = config.fields.find(f => f.id === initialFieldId);
      if (field) {
        const ops = getOperatorsForType(field.type);
        setOperator(ops[0]?.value ?? 'equals');
        setValue(''); setValue2(''); setSelectedOptions([]);
        setSelectedFieldId(initialFieldId);
        setStep('value');
      }
    }
  }, [initialFieldId, initial, config.fields]);

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    const field = config.fields.find(f => f.id === fieldId);
    if (field) {
      const ops = getOperatorsForType(field.type);
      setOperator(ops[0]?.value ?? 'equals');
      setValue(''); setValue2(''); setSelectedOptions([]);
    }
    setStep('value');
  };

  const toggleOption = (opt: string) => {
    setSelectedOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const needsValue = !['is_null', 'is_not_null'].includes(operator);
  const isBetween = operator === 'between';
  const isSelectType = selectedField?.type === 'select' || selectedField?.type === 'boolean';

  let canSave = false;
  if (selectedField) {
    if (!needsValue) canSave = true;
    else if (isSelectType) canSave = selectedOptions.length > 0;
    else if (isBetween) canSave = value.trim() !== '' && value2.trim() !== '';
    else canSave = value.trim() !== '';
  }

  const handleSave = () => {
    if (!selectedFieldId || !canSave) return;
    let finalValue: string | number | null = null;
    let finalValue2: string | number | null = null;
    if (needsValue) {
      if (isSelectType) { finalValue = selectedOptions[0] ?? null; }
      else if (selectedField?.type === 'number') {
        finalValue = value !== '' ? parseFloat(value) : null;
        if (isBetween) finalValue2 = value2 !== '' ? parseFloat(value2) : null;
      } else {
        finalValue = value || null;
        if (isBetween) finalValue2 = value2 || null;
      }
    }
    onSave({ fieldId: selectedFieldId, operator, value: finalValue, value2: finalValue2 });
  };

  if (step === 'field') {
    return (
      <div className={styles.fieldListPanel}>
        <div className={styles.searchBox}>
          <IconSearch size={14} color="#999" />
          <input
            className={styles.searchInput}
            placeholder="Rechercher une colonne…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.fieldList}>
          {filteredFields.map(f => (
            <button key={f.id} className={styles.fieldItem} onClick={() => handleFieldSelect(f.id)}>
              <span className={styles.fieldTypeIcon}>{getFieldTypeIcon(f.type)}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const boolOptions = [{ value: 'true', label: 'Vrai' }, { value: 'false', label: 'Faux' }];
  const listOptions = selectedField?.type === 'boolean'
    ? boolOptions
    : (selectedField?.options ?? []).map(o => ({ value: o, label: o }));

  return (
    <div className={styles.valuePanel}>
      <div className={styles.valuePanelHeader}>
        <button className={styles.backBtn} onClick={() => setStep('field')}>
          <IconChevronLeft size={16} />
        </button>
        <span className={styles.valuePanelFieldName}>{selectedField?.label}</span>
        <span className={styles.headerSep}>|</span>
        <select
          className={styles.operatorSelect}
          value={operator}
          onChange={e => setOperator(e.target.value as FilterOperator)}
        >
          {operators.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
        <IconChevronRight size={14} color="#7172ad" />
      </div>

      <div className={styles.valueBody}>
        {needsValue && isSelectType && (
          <div className={styles.checkboxList}>
            {listOptions.map(opt => (
              <label key={opt.value} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
        {needsValue && !isSelectType && !isBetween && (
          <input
            className={styles.textValueInput}
            type={selectedField?.type === 'number' ? 'number' : selectedField?.type === 'date' ? 'date' : 'text'}
            placeholder={selectedField?.type === 'date' ? 'YYYY-MM-DD' : 'Entrez une valeur…'}
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
          />
        )}
        {needsValue && !isSelectType && isBetween && (
          <div className={styles.betweenWrap}>
            <input
              className={styles.textValueInput}
              type={selectedField?.type === 'number' ? 'number' : 'text'}
              placeholder="Valeur min"
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
            />
            <input
              className={styles.textValueInput}
              type={selectedField?.type === 'number' ? 'number' : 'text'}
              placeholder="Valeur max"
              value={value2}
              onChange={e => setValue2(e.target.value)}
            />
          </div>
        )}
        {!needsValue && (
          <div className={styles.noValueHint}>Aucune valeur requise</div>
        )}
      </div>

      <button
        className={canSave ? styles.addFilterBtnActive : styles.addFilterBtnDisabled}
        onClick={handleSave}
        disabled={!canSave}
      >
        {initial ? 'Modifier le filtre' : 'Ajouter un filtre'}
      </button>
    </div>
  );
}

function FilterPill({ filter, onUpdate, onRemove }: {
  filter: FilterCondition;
  onUpdate: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { config } = useConfig();
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);
  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div className={styles.dropdownAnchor} ref={ref}>
      <span className={styles.pill} onClick={() => setOpen(o => !o)}>
        {getPillLabel(filter, config.fields)}
        <button className={styles.pillRemove} onClick={e => { e.stopPropagation(); onRemove(); }}>
          <IconX size={12} />
        </button>
      </span>
      {open && (
        <div className={styles.dropdown}>
          <FilterPicker initial={filter} onSave={u => { onUpdate(u); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

export function FilterSection({ filters, prefilledFieldId, onPrefilledConsumed, onAdd, onUpdate, onRemove, onHide }: Props) {
  const [open, setOpen] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  // Auto-open picker when prefilled field arrives
  useEffect(() => {
    if (prefilledFieldId) { setOpen(true); }
  }, [prefilledFieldId]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (addRef.current && !addRef.current.contains(e.target as Node)) {
      setOpen(false);
      onPrefilledConsumed?.();
    }
  }, [onPrefilledConsumed]);

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Filtre</span>
        <button className={styles.closeBtn} onClick={onHide} title="Masquer les filtres">
          <IconX size={14} />
        </button>
      </div>
      <div className={styles.sectionOuter}>
        <div className={styles.section}>
          {filters.map(f => (
            <FilterPill key={f.id} filter={f} onUpdate={u => onUpdate(f.id, u)} onRemove={() => onRemove(f.id)} />
          ))}
          <div className={styles.dropdownAnchor} ref={addRef}>
            {filters.length > 0 ? (
              <button className={styles.addBtn} onClick={() => setOpen(o => !o)} title="Ajouter un filtre">+</button>
            ) : (
              <button className={styles.emptyBtn} onClick={() => setOpen(o => !o)}>
                Ajoutez des filtres pour affiner votre réponse
              </button>
            )}
            {open && (
              <div className={styles.dropdown}>
                <FilterPicker
                  initialFieldId={prefilledFieldId}
                  onSave={c => { onAdd(c); setOpen(false); onPrefilledConsumed?.(); }}
                />
              </div>
            )}
          </div>
        </div>
        {filters.length > 0 && (
          <button className={styles.arrowBtn} title="Voir les résultats">
            <IconChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
