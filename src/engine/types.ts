export type FieldType = 'string' | 'number' | 'date' | 'boolean';

export interface Field {
  id: string;
  label: string;
  type: FieldType;
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater'
  | 'greater_or_equal'
  | 'less'
  | 'less_or_equal'
  | 'is_null'
  | 'is_not_null'
  | 'between';

export type AggregationType = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'count_distinct';

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

export interface QueryState {
  filters: FilterCondition[];
  metrics: Metric[];
  groups: GroupBy[];
}

export type QueryAction =
  | { type: 'ADD_FILTER'; filter: FilterCondition }
  | { type: 'UPDATE_FILTER'; id: string; updates: Partial<FilterCondition> }
  | { type: 'REMOVE_FILTER'; id: string }
  | { type: 'ADD_METRIC'; metric: Metric }
  | { type: 'REMOVE_METRIC'; id: string }
  | { type: 'ADD_GROUP'; group: GroupBy }
  | { type: 'REMOVE_GROUP'; id: string };
