import { useRef, useState } from 'react';
import { IconUpload, IconTable } from '@tabler/icons-react';
import { parseXLSX } from '../../config/xlsxParser';
import { useConfig } from '../../config/ConfigContext';
import styles from './ConfigUpload.module.css';

export function ConfigUpload() {
  const { config, setConfig } = useConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'error' | 'ok'; msg: string } | null>(null);

  async function handleFile(file: File) {
    setStatus(null);
    try {
      const newConfig = await parseXLSX(file);
      setConfig(newConfig);
      setStatus({ type: 'ok', msg: `${newConfig.fields.length} colonnes chargées` });
    } catch (e) {
      setStatus({ type: 'error', msg: String(e) });
    }
  }

  return (
    <div className={styles.bar}>
      <IconTable size={14} color="#949599" />
      <span className={styles.tableLabel}>Table :</span>
      <span className={styles.tableName}>{config.tableName}</span>
      <span className={styles.tableLabel}>{config.fields.length} colonnes</span>

      {status && (
        <span className={status.type === 'ok' ? styles.success : styles.error}>
          {status.msg}
        </span>
      )}

      <button className={styles.uploadBtn} onClick={() => inputRef.current?.click()}>
        <IconUpload size={12} />
        Charger un fichier XLSX
      </button>
      <input
        ref={inputRef}
        className={styles.input}
        type="file"
        accept=".xlsx,.xls"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
