import { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import styles from './SQLPreview.module.css';

interface Props {
  sql: string;
}

const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'LIMIT', 'BETWEEN', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT'];

function highlightSQL(sql: string): string {
  let result = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Highlight keywords
  KEYWORDS.forEach(kw => {
    result = result.replace(
      new RegExp(`\\b${kw}\\b`, 'g'),
      `<span class="${styles.kw}">${kw}</span>`
    );
  });

  // Highlight string values
  result = result.replace(/'[^']*'/g, match => `<span class="${styles.val}">${match}</span>`);

  // Highlight numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, `<span class="${styles.val}">$1</span>`);

  // Highlight operators
  result = result.replace(/( [=!<>]+(?:=)? )/g, `<span class="${styles.op}">$1</span>`);

  return result;
}

export function SQLPreview({ sql }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>SQL généré</span>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <pre
        className={styles.code}
        dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }}
      />
    </div>
  );
}
