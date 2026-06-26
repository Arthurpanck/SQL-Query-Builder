import { FilterOperator, FieldType } from '../engine/types';

interface OperatorOption { value: FilterOperator; label: string; }

export function getOperatorsForType(type: FieldType): OperatorOption[] {
  const base: OperatorOption[] = [
    { value: 'equals', label: 'est' },
    { value: 'not_equals', label: "n'est pas" },
    { value: 'is_null', label: 'est vide' },
    { value: 'is_not_null', label: "n'est pas vide" },
  ];

  if (type === 'number') {
    return [
      ...base,
      { value: 'greater', label: 'supérieur à' },
      { value: 'greater_or_equal', label: 'supérieur ou égal à' },
      { value: 'less', label: 'inférieur à' },
      { value: 'less_or_equal', label: 'inférieur ou égal à' },
      { value: 'between', label: 'entre' },
    ];
  }
  if (type === 'date') {
    return [
      ...base,
      { value: 'greater', label: 'après le' },
      { value: 'less', label: 'avant le' },
      { value: 'between', label: 'entre' },
    ];
  }
  if (type === 'string') {
    return [
      ...base,
      { value: 'contains', label: 'contient' },
      { value: 'not_contains', label: 'ne contient pas' },
      { value: 'starts_with', label: 'commence par' },
      { value: 'ends_with', label: 'se termine par' },
    ];
  }
  if (type === 'select') {
    return [
      { value: 'equals', label: 'est' },
      { value: 'not_equals', label: "n'est pas" },
      { value: 'contains', label: 'contient' },
      { value: 'is_null', label: 'est vide' },
      { value: 'is_not_null', label: "n'est pas vide" },
    ];
  }
  if (type === 'boolean') {
    return [
      { value: 'equals', label: 'est' },
      { value: 'not_equals', label: "n'est pas" },
    ];
  }
  return base;
}

export const AGGREGATION_OPTIONS = [
  { value: 'count' as const, label: 'Nombre de lignes', fieldRequired: false },
  { value: 'count_distinct' as const, label: 'Valeurs distinctes de', fieldRequired: true },
  { value: 'sum' as const, label: 'Somme de', fieldRequired: true },
  { value: 'avg' as const, label: 'Moyenne de', fieldRequired: true },
  { value: 'min' as const, label: 'Minimum de', fieldRequired: true },
  { value: 'max' as const, label: 'Maximum de', fieldRequired: true },
];
