import { QueryState, FilterCondition, Metric, FilterOperator, Field } from './types';

const OPERATOR_SQL: Record<FilterOperator, string> = {
  equals: '=', not_equals: '!=',
  contains: 'LIKE', not_contains: 'NOT LIKE',
  starts_with: 'LIKE', ends_with: 'LIKE',
  greater: '>', greater_or_equal: '>=',
  less: '<', less_or_equal: '<=',
  is_null: 'IS NULL', is_not_null: 'IS NOT NULL',
  between: 'BETWEEN',
};

function col(field: Field): string {
  return `"${field.column ?? field.label}"`;
}

function serializeValue(value: string | number | null, type: string): string {
  if (value === null || value === '') return 'NULL';
  if (type === 'number') return String(value);
  if (type === 'boolean') return String(value).toLowerCase() === 'true' ? 'TRUE' : 'FALSE';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function serializeFilter(f: FilterCondition, fields: Field[]): string {
  const field = fields.find(x => x.id === f.fieldId);
  if (!field) return '';
  const c = col(field);
  if (f.operator === 'is_null') return `${c} IS NULL`;
  if (f.operator === 'is_not_null') return `${c} IS NOT NULL`;
  if (f.operator === 'between') return `${c} BETWEEN ${serializeValue(f.value, field.type)} AND ${serializeValue(f.value2 ?? null, field.type)}`;
  if (f.operator === 'contains') return `${c} LIKE '%${f.value}%'`;
  if (f.operator === 'not_contains') return `${c} NOT LIKE '%${f.value}%'`;
  if (f.operator === 'starts_with') return `${c} LIKE '${f.value}%'`;
  if (f.operator === 'ends_with') return `${c} LIKE '%${f.value}'`;
  return `${c} ${OPERATOR_SQL[f.operator]} ${serializeValue(f.value, field.type)}`;
}

function serializeMetric(m: Metric, fields: Field[]): string {
  if (m.aggregation === 'count' && !m.fieldId) return 'COUNT(*)';
  const field = fields.find(x => x.id === m.fieldId);
  if (!field) return 'COUNT(*)';
  if (m.aggregation === 'count_distinct') return `COUNT(DISTINCT ${col(field)})`;
  return `${m.aggregation.toUpperCase()}(${col(field)})`;
}

export function toSQL(
  state: QueryState,
  fields: Field[],
  tableName = 'table',
  selectedColumns?: string[]
): string {
  const { filters, metrics, groups, sorts, limit } = state;

  const selectParts: string[] = [];

  if (metrics.length > 0 || groups.length > 0) {
    // Summarize mode: group by + metrics
    if (groups.length > 0) {
      groups.forEach(g => {
        const f = fields.find(x => x.id === g.fieldId);
        if (f) selectParts.push(col(f));
      });
    }
    if (metrics.length > 0) {
      metrics.forEach(m => selectParts.push(serializeMetric(m, fields)));
    }
  } else if (selectedColumns && selectedColumns.length < fields.length && selectedColumns.length > 0) {
    // Column picker: only selected columns
    selectedColumns.forEach(id => {
      const f = fields.find(x => x.id === id);
      if (f) selectParts.push(col(f));
    });
  } else {
    selectParts.push('*');
  }

  const lines: string[] = [
    `SELECT ${selectParts.join(', ')}`,
    `FROM "${tableName}"`,
  ];

  if (filters.length > 0) {
    const conds = filters.map(f => serializeFilter(f, fields)).filter(Boolean);
    if (conds.length === 1) {
      lines.push(`WHERE ${conds[0]}`);
    } else if (conds.length > 1) {
      lines.push(`WHERE ${conds[0]}`);
      conds.slice(1).forEach(c => lines.push(`  AND ${c}`));
    }
  }

  if (groups.length > 0) {
    const groupCols = groups.map(g => {
      const f = fields.find(x => x.id === g.fieldId);
      return f ? col(f) : g.fieldId;
    });
    lines.push(`GROUP BY ${groupCols.join(', ')}`);
  }

  if (sorts.length > 0) {
    const sortCols = sorts.map(s => {
      const f = fields.find(x => x.id === s.fieldId);
      return f ? `${col(f)} ${s.direction}` : '';
    }).filter(Boolean);
    if (sortCols.length > 0) lines.push(`ORDER BY ${sortCols.join(', ')}`);
  }

  if (limit !== null) lines.push(`LIMIT ${limit}`);

  return lines.join('\n');
}
