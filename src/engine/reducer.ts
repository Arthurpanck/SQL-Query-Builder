import { QueryState, QueryAction } from './types';

export const initialState: QueryState = {
  filters: [],
  metrics: [],
  groups: [],
  sorts: [],
  limit: null,
};

export function queryReducer(state: QueryState, action: QueryAction): QueryState {
  switch (action.type) {
    case 'ADD_FILTER':
      return { ...state, filters: [...state.filters, action.filter] };
    case 'UPDATE_FILTER':
      return { ...state, filters: state.filters.map(f => f.id === action.id ? { ...f, ...action.updates } : f) };
    case 'REMOVE_FILTER':
      return { ...state, filters: state.filters.filter(f => f.id !== action.id) };
    case 'ADD_METRIC':
      return { ...state, metrics: [...state.metrics, action.metric] };
    case 'REMOVE_METRIC':
      return { ...state, metrics: state.metrics.filter(m => m.id !== action.id) };
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.group] };
    case 'REMOVE_GROUP':
      return { ...state, groups: state.groups.filter(g => g.id !== action.id) };
    case 'ADD_SORT':
      return { ...state, sorts: [...state.sorts, action.sort] };
    case 'UPDATE_SORT':
      return { ...state, sorts: state.sorts.map(s => s.id === action.id ? { ...s, ...action.updates } : s) };
    case 'REMOVE_SORT':
      return { ...state, sorts: state.sorts.filter(s => s.id !== action.id) };
    case 'SET_LIMIT':
      return { ...state, limit: action.limit };
    default:
      return state;
  }
}
