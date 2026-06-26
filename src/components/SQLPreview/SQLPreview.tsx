import { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import styles from './SQLPreview.module.css';

interface Props { sql: string; }

const KW = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'LIMIT',
            'BETWEEN', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL',
            'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'ASC', 'DESC'];

function highlight(sql: string): string {
  let r = sql.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  KW.forEach(k => {
    r = r.replace(new RegExp(`\\b${k}\\b`,'g'), `<span class="${styles.kw}">${k}</span>`);
  });
  r = r.replace(/"[^"]*"/g, m => `<span class="${styles.col}">${m}</span>`);
  r = r.replace(/'[^']*'/g, m => `<span class="${styles.str}">${m}</span>`);
  r = r.replace(/\b(\d+)\b/g, `<span class="${styles.num}">$1</span>`);
  return r;
}

export function SQLPreview({ sql }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = sql.split('\n');

  async function handleCopy() {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={styles.wrapper}>
      {/* Toggle button row */}
      <div className={styles.toggleRow}>
        <button
          className={styles.toggleBtn}
          onClick={() => setOpen(v => !v)}
          title={open ? 'Masquer le SQL' : 'Afficher le SQL'}
        >
          {/* >_ icon SVG exact from Metabase */}
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className={styles.sqlIcon}>
            <path d="M3.53 2.97a.75.75 0 0 0-1.06 1.06L5.44 7 2.47 9.97a.75.75 0 1 0 1.06 1.06l3.5-3.5a.75.75 0 0 0 0-1.06l-3.5-3.5zM7 12.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5H7z"/>
          </svg>
          {open ? 'Masquer le SQL' : 'Afficher le SQL'}
        </button>
      </div>

      {/* SQL panel */}
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>SQL pour cette question</span>
            <button className={styles.copyBtn} onClick={handleCopy} title="Copier">
              {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>

          {/* Code with line numbers */}
          <div className={styles.codeWrap}>
            <div className={styles.lineNumbers}>
              {lines.map((_, i) => (
                <div key={i} className={styles.lineNum}>{i + 1}</div>
              ))}
            </div>
            <pre
              className={styles.code}
              dangerouslySetInnerHTML={{ __html: highlight(sql) }}
            />
          </div>

          {/* Convertir link */}
          <div className={styles.convertRow}>
            <button className={styles.convertBtn} title="Bascule vers l'éditeur SQL natif">
              Convertir cette question en SQL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
