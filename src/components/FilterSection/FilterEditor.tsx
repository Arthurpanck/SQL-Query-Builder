import { useState, useEffect } from 'react';
import { Select, TextInput, NumberInput, Button, Stack, Group, Text } from '@mantine/core';
import { FilterCondition, FilterOperator } from '../../engine/types';
import { fields, getOperatorsForType } from '../../config/fields';

interface Props {
  initial?: FilterCondition;
  onSave: (condition: Omit<FilterCondition, 'id'>) => void;
  onCancel: () => void;
}

const NEEDS_VALUE: FilterOperator[] = [
  'equals', 'not_equals', 'contains', 'not_contains',
  'starts_with', 'ends_with', 'greater', 'greater_or_equal',
  'less', 'less_or_equal',
];

export function FilterEditor({ initial, onSave, onCancel }: Props) {
  const [fieldId, setFieldId] = useState<string | null>(initial?.fieldId ?? null);
  const [operator, setOperator] = useState<FilterOperator | null>(initial?.operator ?? null);
  const [value, setValue] = useState<string | number | null>(initial?.value ?? null);
  const [value2, setValue2] = useState<string | number | null>(initial?.value2 ?? null);

  const selectedField = fields.find(f => f.id === fieldId);
  const operators = selectedField ? getOperatorsForType(selectedField.type) : [];

  useEffect(() => {
    if (selectedField && operator) {
      const validOps = getOperatorsForType(selectedField.type).map(o => o.value);
      if (!validOps.includes(operator)) {
        setOperator(null);
        setValue(null);
      }
    }
  }, [fieldId, selectedField, operator]);

  const needsValue = operator && NEEDS_VALUE.includes(operator);
  const isBetween = operator === 'between';
  const isNumber = selectedField?.type === 'number';

  const canSave = fieldId && operator && (
    !needsValue && !isBetween ||
    needsValue && value !== null && value !== '' ||
    isBetween && value !== null && value !== '' && value2 !== null && value2 !== ''
  );

  function handleSave() {
    if (!fieldId || !operator) return;
    onSave({ fieldId, operator, value, value2 });
  }

  return (
    <Stack gap="sm" p="md" style={{ minWidth: 280 }}>
      <Select
        label="Champ"
        placeholder="Choisir un champ…"
        data={fields.map(f => ({ value: f.id, label: f.label }))}
        value={fieldId}
        onChange={v => { setFieldId(v); setOperator(null); setValue(null); }}
        searchable
        size="sm"
      />

      {fieldId && (
        <Select
          label="Condition"
          placeholder="Choisir une condition…"
          data={operators.map(o => ({ value: o.value, label: o.label }))}
          value={operator}
          onChange={v => setOperator(v as FilterOperator)}
          size="sm"
        />
      )}

      {needsValue && !isBetween && (
        isNumber ? (
          <NumberInput
            label="Valeur"
            value={value as number ?? ''}
            onChange={v => setValue(v === '' ? null : v)}
            size="sm"
          />
        ) : (
          <TextInput
            label="Valeur"
            value={String(value ?? '')}
            onChange={e => setValue(e.currentTarget.value)}
            size="sm"
          />
        )
      )}

      {isBetween && (
        <>
          <Text size="xs" c="dimmed">Entre</Text>
          {isNumber ? (
            <Group gap="xs" grow>
              <NumberInput
                placeholder="Min"
                value={value as number ?? ''}
                onChange={v => setValue(v === '' ? null : v)}
                size="sm"
              />
              <NumberInput
                placeholder="Max"
                value={value2 as number ?? ''}
                onChange={v => setValue2(v === '' ? null : v)}
                size="sm"
              />
            </Group>
          ) : (
            <Group gap="xs" grow>
              <TextInput
                placeholder="Début"
                value={String(value ?? '')}
                onChange={e => setValue(e.currentTarget.value)}
                size="sm"
              />
              <TextInput
                placeholder="Fin"
                value={String(value2 ?? '')}
                onChange={e => setValue2(e.currentTarget.value)}
                size="sm"
              />
            </Group>
          )}
        </>
      )}

      <Group gap="xs" justify="flex-end" mt="xs">
        <Button variant="subtle" size="xs" color="gray" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          size="xs"
          disabled={!canSave}
          onClick={handleSave}
          style={{ background: '#7172ad' }}
        >
          {initial ? 'Modifier' : 'Ajouter'}
        </Button>
      </Group>
    </Stack>
  );
}
