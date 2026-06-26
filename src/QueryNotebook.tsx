import { useReducer } from 'react';
import { IconChartBar } from '@tabler/icons-react';
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

  function addFilter(condition: Omit<FilterCondition, 'id'>) {
    dispatch({ type: 'ADD_FILTER', filter: { ...condition, id: uid() } });
  }

  function updateFilter(id: string, updates: Partial<FilterCondition>) {
    dispatch({ type: 'UPDATE_FILTER', id, updates });
  }

  function removeFilter(id: string) {
    dispatch({ type: 'REMOVE_FILTER', id });
  }

  function addMetric(metric: Omit<Metric, 'id'>) {
    dispatch({ type: 'ADD_METRIC', metric: { ...metric, id: uid() } });
  }

  function removeMetric(id: string) {
    dispatch({ type: 'REMOVE_METRIC', id });
  }

  function addGroup(group: Omit<GroupBy, 'id'>) {
    dispatch({ type: 'ADD_GROUP', group: { ...group, id: uid() } });
  }

  function removeGroup(id: string) {
    dispatch({ type: 'REMOVE_GROUP', id });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 800 }}>
      <div className={styles.wrapper}>
        <div className={styles.sections}>
          <div className={styles.sectionRow}>
            <FilterSection
              filters={state.filters}
              onAdd={addFilter}
              onUpdate={updateFilter}
              onRemove={removeFilter}
            />
          </div>
          <div className={styles.sectionRow}>
            <SummarizeSection
              metrics={state.metrics}
              groups={state.groups}
              onAddMetric={addMetric}
              onRemoveMetric={removeMetric}
              onAddGroup={addGroup}
              onRemoveGroup={removeGroup}
            />
          </div>
        </div>
        <div className={styles.bottom}>
          <NotebookToolbar
            hasFilters={state.filters.length > 0}
            hasMetrics={state.metrics.length > 0}
          />
          <button className={styles.visualizeBtn}>
            <IconChartBar size={14} />
            Visualiser
          </button>
        </div>
      </div>

      <SQLPreview sql={sql} />
    </div>
  );
}
