export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'select';

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  column?: string;
  options?: string[];
}

export interface FieldConfig {
  tableName: string;
  fields: Field[];
}

export type FilterOperator =
  | 'equals' | 'not_equals'
  | 'contains' | 'not_contains' | 'starts_with' | 'ends_with'
  | 'greater' | 'greater_or_equal' | 'less' | 'less_or_equal'
  | 'is_null' | 'is_not_null' | 'between';

export type AggregationType = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'count_distinct';

export type SortDirection = 'ASC' | 'DESC';

export interface FilterCondition {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: string | number | null;
  value2?: string | number | null;
}

export interface Metric {
  id: string;
  aggregation: AggregationType;
  fieldId: string | null;
}

export interface GroupBy {
  id: string;
  fieldId: string;
}

export interface SortItem {
  id: string;
  fieldId: string;
  direction: SortDirection;
}

export interface QueryState {
  filters: FilterCondition[];
  metrics: Metric[];
  groups: GroupBy[];
  sorts: SortItem[];
  limit: number | null;
}

export type QueryAction =
  | { type: 'ADD_FILTER'; filter: FilterCondition }
  | { type: 'UPDATE_FILTER'; id: string; updates: Partial<FilterCondition> }
  | { type: 'REMOVE_FILTER'; id: string }
  | { type: 'ADD_METRIC'; metric: Metric }
  | { type: 'REMOVE_METRIC'; id: string }
  | { type: 'ADD_GROUP'; group: GroupBy }
  | { type: 'REMOVE_GROUP'; id: string }
  | { type: 'ADD_SORT'; sort: SortItem }
  | { type: 'UPDATE_SORT'; id: string; updates: Partial<SortItem> }
  | { type: 'REMOVE_SORT'; id: string }
  | { type: 'SET_LIMIT'; limit: number | null };
