import { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import styles from './SQLPreview.module.css';

interface Props { sql: string; }

const KW = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN',
            'GROUP BY', 'ORDER BY', 'LIMIT', 'BETWEEN', 'LIKE', 'NOT LIKE',
            'IS NULL', 'IS NOT NULL', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
            'DISTINCT', 'ASC', 'DESC', 'AS', 'CASE', 'WHEN', 'THEN', 'END'];

function highlight(sql: string): string {
  // Step 1: Replace keywords with unique non-HTML placeholders FIRST
  let r = sql;
  KW.forEach((k, ki) => {
    r = r.replace(new RegExp(`\\b${k}\\b`, 'g'), `\x00KW${ki}\x00`);
  });

  // Step 2: HTML-escape the text (now keywords are safe as tokens)
  r = r.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Step 3: Highlight quoted identifiers ("col") and string literals ('val')
  r = r.replace(/"[^"]*"/g, m => `<span class="${styles.col}">${m}</span>`);
  r = r.replace(/'[^']*'/g, m => `<span class="${styles.str}">${m}</span>`);

  // Step 4: Highlight numbers (standalone)
  r = r.replace(/\b(\d+(?:\.\d+)?)\b/g, `<span class="${styles.num}">$1</span>`);

  // Step 5: Restore keywords as styled spans (tokens can't be inside quotes)
  KW.forEach((k, ki) => {
    r = r.replace(new RegExp(`\x00KW${ki}\x00`, 'g'),
      `<span class="${styles.kw}">${k}</span>`);
  });

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
      {/* Toggle button */}
      <div className={styles.toggleRow}>
        <button
          className={styles.toggleBtn}
          onClick={() => setOpen(v => !v)}
          title={open ? 'Masquer le SQL' : 'Afficher le SQL'}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className={styles.sqlIcon}>
            <path d="M3.53 2.97a.75.75 0 0 0-1.06 1.06L5.44 7 2.47 9.97a.75.75 0 1 0 1.06 1.06l3.5-3.5a.75.75 0 0 0 0-1.06l-3.5-3.5zM7 12.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5H7z"/>
          </svg>
          {open ? 'Masquer le SQL' : 'Afficher le SQL'}
        </button>
      </div>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>SQL POUR CETTE QUESTION</span>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>

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

          <div className={styles.convertRow}>
            <button className={styles.convertBtn}>
              Convertir cette question en SQL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
