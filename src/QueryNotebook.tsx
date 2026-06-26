import { useReducer, useState } from 'react';
import { queryReducer, initialState } from './engine/reducer';
import { FilterCondition, Metric, GroupBy, SortItem } from './engine/types';
import { toSQL } from './engine/sql';
import { useConfig } from './config/ConfigContext';
import { DataSection } from './components/DataSection/DataSection';
import { FilterSection } from './components/FilterSection/FilterSection';
import { SummarizeSection } from './components/SummarizeSection/SummarizeSection';
import { SortSection } from './components/SortSection/SortSection';
import { LimitSection } from './components/LimitSection/LimitSection';
import { NotebookToolbar } from './components/NotebookToolbar/NotebookToolbar';
import { SQLPreview } from './components/SQLPreview/SQLPreview';
import { ConfigUpload } from './components/ConfigUpload/ConfigUpload';
import styles from './QueryNotebook.module.css';

let _id = 1;
const uid = () => String(_id++);

export function QueryNotebook() {
  const { config } = useConfig();
  const [state, dispatch] = useReducer(queryReducer, initialState);

  // Section visibility
  const [showFilter, setShowFilter] = useState(true);
  const [showSummarize, setShowSummarize] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [showLimit, setShowLimit] = useState(false);

  const sql = toSQL(state, config.fields, config.tableName);

  // Filter
  const addFilter = (c: Omit<FilterCondition, 'id'>) => dispatch({ type: 'ADD_FILTER', filter: { ...c, id: uid() } });
  const updateFilter = (id: string, u: Partial<FilterCondition>) => dispatch({ type: 'UPDATE_FILTER', id, updates: u });
  const removeFilter = (id: string) => dispatch({ type: 'REMOVE_FILTER', id });
  const hideFilter = () => {
    state.filters.forEach(f => dispatch({ type: 'REMOVE_FILTER', id: f.id }));
    setShowFilter(false);
  };

  // Summarize
  const addMetric = (m: Omit<Metric, 'id'>) => dispatch({ type: 'ADD_METRIC', metric: { ...m, id: uid() } });
  const removeMetric = (id: string) => dispatch({ type: 'REMOVE_METRIC', id });
  const addGroup = (g: Omit<GroupBy, 'id'>) => dispatch({ type: 'ADD_GROUP', group: { ...g, id: uid() } });
  const removeGroup = (id: string) => dispatch({ type: 'REMOVE_GROUP', id });
  const hideSummarize = () => {
    state.metrics.forEach(m => dispatch({ type: 'REMOVE_METRIC', id: m.id }));
    state.groups.forEach(g => dispatch({ type: 'REMOVE_GROUP', id: g.id }));
    setShowSummarize(false);
  };

  // Sort
  const addSort = (s: Omit<SortItem, 'id'>) => dispatch({ type: 'ADD_SORT', sort: { ...s, id: uid() } });
  const updateSort = (id: string, u: Partial<SortItem>) => dispatch({ type: 'UPDATE_SORT', id, updates: u });
  const removeSort = (id: string) => dispatch({ type: 'REMOVE_SORT', id });
  const hideSort = () => { state.sorts.forEach(s => dispatch({ type: 'REMOVE_SORT', id: s.id })); setShowSort(false); };

  // Limit
  const setLimit = (limit: number | null) => dispatch({ type: 'SET_LIMIT', limit });
  const hideLimit = () => { dispatch({ type: 'SET_LIMIT', limit: null }); setShowLimit(false); };

  // Prefill filter from DataSection column click
  const [prefilledFieldId, setPrefilledFieldId] = useState<string | null>(null);
  const handleColumnClick = (fieldId: string) => {
    setShowFilter(true);
    setPrefilledFieldId(fieldId);
  };

  return (
    <div className={styles.notebook}>
      <ConfigUpload />
      <div className={styles.sections}>
        <DataSection onColumnClick={handleColumnClick} />

        {showFilter && (
          <FilterSection
            filters={state.filters}
            prefilledFieldId={prefilledFieldId}
            onPrefilledConsumed={() => setPrefilledFieldId(null)}
            onAdd={addFilter}
            onUpdate={updateFilter}
            onRemove={removeFilter}
            onHide={hideFilter}
          />
        )}

        {showSummarize && (
          <SummarizeSection
            metrics={state.metrics}
            groups={state.groups}
            onAddMetric={addMetric}
            onRemoveMetric={removeMetric}
            onAddGroup={addGroup}
            onRemoveGroup={removeGroup}
            onHide={hideSummarize}
          />
        )}

        {(showSort || state.sorts.length > 0) && (
          <SortSection sorts={state.sorts} onAdd={addSort} onUpdate={updateSort} onRemove={removeSort} onClear={hideSort} />
        )}

        {(showLimit || state.limit !== null) && (
          <LimitSection limit={state.limit} onChange={setLimit} onClear={hideLimit} />
        )}
      </div>

      <NotebookToolbar
        showFilter={showFilter}
        showSummarize={showSummarize}
        showSort={showSort || state.sorts.length > 0}
        showLimit={showLimit || state.limit !== null}
        onToggleFilter={() => setShowFilter(v => !v)}
        onToggleSummarize={() => setShowSummarize(v => !v)}
        onToggleSort={() => setShowSort(v => !v)}
        onToggleLimit={() => setShowLimit(v => !v)}
      />

      <SQLPreview sql={sql} />
    </div>
  );
}
