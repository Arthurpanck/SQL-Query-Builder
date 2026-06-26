import { Field, FilterOperator } from '../engine/types';

export const fields: Field[] = [
  { id: 'id', label: 'ID', type: 'number' },
  { id: 'created_at', label: 'Created At', type: 'date' },
  { id: 'subtotal', label: 'Subtotal', type: 'number' },
  { id: 'total', label: 'Total', type: 'number' },
  { id: 'quantity', label: 'Quantity', type: 'number' },
  { id: 'discount', label: 'Discount', type: 'number' },
  { id: 'tax', label: 'Tax', type: 'number' },
  { id: 'product_category', label: 'Product → Category', type: 'string' },
  { id: 'product_name', label: 'Product → Name', type: 'string' },
  { id: 'product_price', label: 'Product → Price', type: 'number' },
  { id: 'product_rating', label: 'Product → Rating', type: 'number' },
  { id: 'user_name', label: 'User → Name', type: 'string' },
  { id: 'user_email', label: 'User → Email', type: 'string' },
  { id: 'user_city', label: 'User → City', type: 'string' },
  { id: 'user_state', label: 'User → State', type: 'string' },
  { id: 'status', label: 'Status', type: 'string' },
];

interface OperatorOption {
  value: FilterOperator;
  label: string;
}

export function getOperatorsForType(type: string): OperatorOption[] {
  const base: OperatorOption[] = [
    { value: 'equals', label: 'égal à' },
    { value: 'not_equals', label: 'différent de' },
    { value: 'is_null', label: 'est vide' },
    { value: 'is_not_null', label: "n'est pas vide" },
  ];

  if (type === 'number' || type === 'date') {
    return [
      ...base,
      { value: 'greater', label: 'supérieur à' },
      { value: 'greater_or_equal', label: 'supérieur ou égal à' },
      { value: 'less', label: 'inférieur à' },
      { value: 'less_or_equal', label: 'inférieur ou égal à' },
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

  return base;
}

export const AGGREGATION_OPTIONS = [
  { value: 'count', label: 'Nombre de lignes', fieldRequired: false },
  { value: 'count_distinct', label: 'Valeurs distinctes', fieldRequired: true },
  { value: 'sum', label: 'Somme de', fieldRequired: true },
  { value: 'avg', label: 'Moyenne de', fieldRequired: true },
  { value: 'min', label: 'Minimum de', fieldRequired: true },
  { value: 'max', label: 'Maximum de', fieldRequired: true },
] as const;
