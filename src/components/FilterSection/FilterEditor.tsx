import { useState, useEffect } from 'react';
import { Select, TextInput, NumberInput, Button, Stack, Group, Text } from '@mantine/core';
import { FilterCondition, FilterOperator, Field } from '../../engine/types';
import { getOperatorsForType } from '../../config/operators';
import { useConfig } from '../../config/ConfigContext';

interface Props {
  initial?: FilterCondition;
  onSave: (condition: Omit<FilterCondition, 'id'>) => void;
  onCancel: () => void;
}

const NEEDS_VALUE: FilterOperator[] = [
  'equals','not_equals','contains','not_contains','starts_with','ends_with',
  'greater','greater_or_equal','less','less_or_equal',
];

function ValueInput({ field, value, onChange }: { field: Field; value: string | number | null; onChange: (v: string | number | null) => void }) {
  if (field.type === 'select' && field.options) {
    return (
      <Select
        label="Valeur"
        placeholder="Choisir…"
        data={field.options}
        value={value !== null ? String(value) : null}
        onChange={v => onChange(v)}
        searchable
        size="sm"
      />
    );
  }
  if (field.type === 'boolean') {
    return (
      <Select
        label="Valeur"
        data={[{ value: 'true', label: 'Vrai' }, { value: 'false', label: 'Faux' }]}
        value={value !== null ? String(value) : null}
        onChange={v => onChange(v)}
        size="sm"
      />
    );
  }
  if (field.type === 'number') {
    return (
      <NumberInput
        label="Valeur"
        value={value as number ?? ''}
        onChange={v => onChange(v === '' ? null : v)}
        size="sm"
      />
    );
  }
  if (field.type === 'date') {
    return (
      <TextInput
        label="Valeur"
        placeholder="YYYY-MM-DD"
        value={value !== null ? String(value) : ''}
        onChange={e => onChange(e.currentTarget.value || null)}
        size="sm"
      />
    );
  }
  return (
    <TextInput
      label="Valeur"
      value={value !== null ? String(value) : ''}
      onChange={e => onChange(e.currentTarget.value || null)}
      size="sm"
    />
  );
}

export function FilterEditor({ initial, onSave, onCancel }: Props) {
  const { config } = useConfig();
  const fields = config.fields;

  const [fieldId, setFieldId] = useState<string | null>(initial?.fieldId ?? null);
  const [operator, setOperator] = useState<FilterOperator | null>(initial?.operator ?? null);
  const [value, setValue] = useState<string | number | null>(initial?.value ?? null);
  const [value2, setValue2] = useState<string | number | null>(initial?.value2 ?? null);

  const selectedField = fields.find(f => f.id === fieldId);
  const operators = selectedField ? getOperatorsForType(selectedField.type) : [];

  useEffect(() => {
    if (selectedField && operator) {
      const valid = getOperatorsForType(selectedField.type).map(o => o.value);
      if (!valid.includes(operator)) { setOperator(null); setValue(null); }
    }
  }, [fieldId, selectedField, operator]);

  const needsValue = operator && NEEDS_VALUE.includes(operator);
  const isBetween = operator === 'between';

  const canSave = !!(fieldId && operator && (
    (!needsValue && !isBetween) ||
    (needsValue && !isBetween && value !== null && value !== '') ||
    (isBetween && value !== null && value !== '' && value2 !== null && value2 !== '')
  ));

  return (
    <Stack gap="sm" p="md" style={{ minWidth: 290 }}>
      <Select
        label="Colonne"
        placeholder="Choisir une colonne…"
        data={fields.map(f => ({ value: f.id, label: f.label }))}
        value={fieldId}
        onChange={v => { setFieldId(v); setOperator(null); setValue(null); setValue2(null); }}
        searchable
        size="sm"
      />

      {selectedField && (
        <Select
          label="Condition"
          placeholder="Choisir…"
          data={operators.map(o => ({ value: o.value, label: o.label }))}
          value={operator}
          onChange={v => setOperator(v as FilterOperator)}
          size="sm"
        />
      )}

      {needsValue && !isBetween && (
        <ValueInput field={selectedField!} value={value} onChange={setValue} />
      )}

      {isBetween && selectedField && (
        <>
          <Text size="xs" c="dimmed">Entre</Text>
          <Group gap="xs" grow>
            <ValueInput field={selectedField} value={value} onChange={setValue} />
            <ValueInput field={selectedField} value={value2} onChange={setValue2} />
          </Group>
        </>
      )}

      <Group gap="xs" justify="flex-end" mt="xs">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>Annuler</Button>
        <Button size="xs" disabled={!canSave} onClick={() => onSave({ fieldId: fieldId!, operator: operator!, value, value2 })}
          style={{ background: '#7172ad' }}>
          {initial ? 'Modifier' : 'Ajouter'}
        </Button>
      </Group>
    </Stack>
  );
}
