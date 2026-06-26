import { QueryState, FilterCondition, Metric, FilterOperator } from './types';
import { fields } from '../config/fields';

const OPERATOR_SQL: Record<FilterOperator, string> = {
  equals: '=',
  not_equals: '!=',
  contains: 'LIKE',
  not_contains: 'NOT LIKE',
  starts_with: 'LIKE',
  ends_with: 'LIKE',
  greater: '>',
  greater_or_equal: '>=',
  less: '<',
  less_or_equal: '<=',
  is_null: 'IS NULL',
  is_not_null: 'IS NOT NULL',
  between: 'BETWEEN',
};

function getField(fieldId: string) {
  return fields.find(f => f.id === fieldId);
}

function escapeStr(v: string) {
  return v.replace(/'/g, "''");
}

function serializeValue(value: string | number | null, type: string): string {
  if (value === null || value === '') return 'NULL';
  if (type === 'string') return `'${escapeStr(String(value))}'`;
  return String(value);
}

function serializeFilter(f: FilterCondition): string {
  const field = getField(f.fieldId);
  if (!field) return '';
  const col = field.label;

  if (f.operator === 'is_null') return `${col} IS NULL`;
  if (f.operator === 'is_not_null') return `${col} IS NOT NULL`;
  if (f.operator === 'between') {
    const v1 = serializeValue(f.value, field.type);
    const v2 = serializeValue(f.value2 ?? null, field.type);
    return `${col} BETWEEN ${v1} AND ${v2}`;
  }
  if (f.operator === 'contains') return `${col} LIKE '%${f.value}%'`;
  if (f.operator === 'not_contains') return `${col} NOT LIKE '%${f.value}%'`;
  if (f.operator === 'starts_with') return `${col} LIKE '${f.value}%'`;
  if (f.operator === 'ends_with') return `${col} LIKE '%${f.value}'`;

  const val = serializeValue(f.value, field.type);
  return `${col} ${OPERATOR_SQL[f.operator]} ${val}`;
}

function serializeMetric(m: Metric): string {
  if (m.aggregation === 'count' && !m.fieldId) return 'COUNT(*)';
  if (m.aggregation === 'count_distinct' && m.fieldId) {
    const f = getField(m.fieldId);
    return `COUNT(DISTINCT ${f?.label ?? m.fieldId})`;
  }
  const f = getField(m.fieldId!);
  return `${m.aggregation.toUpperCase()}(${f?.label ?? m.fieldId})`;
}

export function toSQL(state: QueryState, tableName = 'orders'): string {
  const { filters, metrics, groups } = state;

  const selectParts: string[] = [];
  if (groups.length > 0) {
    groups.forEach(g => {
      const f = getField(g.fieldId);
      if (f) selectParts.push(f.label);
    });
  }
  if (metrics.length > 0) {
    metrics.forEach(m => selectParts.push(serializeMetric(m)));
  }
  if (selectParts.length === 0) selectParts.push('*');

  const lines: string[] = [
    `SELECT ${selectParts.join(', ')}`,
    `FROM ${tableName}`,
  ];

  if (filters.length > 0) {
    const conditions = filters.map(serializeFilter).filter(Boolean);
    if (conditions.length === 1) {
      lines.push(`WHERE ${conditions[0]}`);
    } else {
      lines.push(`WHERE ${conditions[0]}`);
      conditions.slice(1).forEach(c => lines.push(`  AND ${c}`));
    }
  }

  if (groups.length > 0) {
    const groupCols = groups.map(g => getField(g.fieldId)?.label ?? g.fieldId);
    lines.push(`GROUP BY ${groupCols.join(', ')}`);
  }

  return lines.join('\n');
}
