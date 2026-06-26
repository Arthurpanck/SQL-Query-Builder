import { useReducer } from 'react';
import { queryReducer, initialState } from './engine/reducer';
import { FilterCondition, Metric, GroupBy } from './engine/types';
import { toSQL } from './engine/sql';
import { FilterSection } from './components/FilterSection/FilterSection';
import { SummarizeSection } from './components/SummarizeSection/SummarizeSection';
import { NotebookToolbar } from './components/NotebookToolbar/NotebookToolbar';
import { SQLPreview } from './components/SQLPreview/SQLPreview';
import styles from './QueryNotebook.module.css';

let nextId = 1;
function uid() { return String(nextId++); }

export function QueryNotebook() {
  const [state, dispatch] = useReducer(queryReducer, initialState);
  const sql = toSQL(state);

  function addFilter(c: Omit<FilterCondition, 'id'>) {
    dispatch({ type: 'ADD_FILTER', filter: { ...c, id: uid() } });
  }
  function updateFilter(id: string, updates: Partial<FilterCondition>) {
    dispatch({ type: 'UPDATE_FILTER', id, updates });
  }
  function removeFilter(id: string) { dispatch({ type: 'REMOVE_FILTER', id }); }
  function addMetric(m: Omit<Metric, 'id'>) {
    dispatch({ type: 'ADD_METRIC', metric: { ...m, id: uid() } });
  }
  function removeMetric(id: string) { dispatch({ type: 'REMOVE_METRIC', id }); }
  function addGroup(g: Omit<GroupBy, 'id'>) {
    dispatch({ type: 'ADD_GROUP', group: { ...g, id: uid() } });
  }
  function removeGroup(id: string) { dispatch({ type: 'REMOVE_GROUP', id }); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 860 }}>
      <div className={styles.wrapper}>
        <div className={styles.sections}>
          <FilterSection
            filters={state.filters}
            onAdd={addFilter}
            onUpdate={updateFilter}
            onRemove={removeFilter}
            onClear={() => state.filters.forEach(f => removeFilter(f.id))}
          />
          <SummarizeSection
            metrics={state.metrics}
            groups={state.groups}
            onAddMetric={addMetric}
            onRemoveMetric={removeMetric}
            onAddGroup={addGroup}
            onRemoveGroup={removeGroup}
            onClear={() => {
              state.metrics.forEach(m => removeMetric(m.id));
              state.groups.forEach(g => removeGroup(g.id));
            }}
          />
        </div>
        <NotebookToolbar
          hasFilters={state.filters.length > 0}
          hasMetrics={state.metrics.length > 0}
        />
      </div>
      <SQLPreview sql={sql} />
    </div>
  );
}
