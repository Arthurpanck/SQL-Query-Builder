import * as XLSX from 'xlsx';
import { Field, FieldConfig } from '../engine/types';

function inferType(values: unknown[], header: string): Field['type'] {
  const h = header.toLowerCase();
  if (h.includes(' at') || h.includes('date') || h.includes('time')) return 'date';

  const sample = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 50);
  if (sample.length === 0) return 'string';

  if (sample.every(v => typeof v === 'boolean' || v === 0 || v === 1)) return 'boolean';

  const allNum = sample.every(v => typeof v === 'number' || (typeof v === 'string' && v !== '' && !isNaN(Number(v))));
  if (allNum) return 'number';

  const allValues = values.filter(v => v !== null && v !== undefined && v !== '');
  const distinct = new Set(allValues.map(v => String(v)));
  if (distinct.size <= 50 && allValues.length > distinct.size * 2) return 'select';

  return 'string';
}

export function parseXLSX(file: File): Promise<FieldConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = wb.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[sheetName], { header: 1 });

        if (rows.length < 2) {
          reject(new Error('Le fichier doit contenir une ligne de headers et au moins une ligne de données'));
          return;
        }

        const headers = (rows[0] as unknown[]).map(String);
        const dataRows = rows.slice(1) as unknown[][];

        const fields: Field[] = headers.map((header, colIdx) => {
          const values = dataRows.map(r => r[colIdx]);
          const type = inferType(values, header);
          const options = type === 'select'
            ? [...new Set(values.filter(v => v !== null && v !== undefined && v !== '').map(v => String(v)))].sort()
            : undefined;
          return { id: header, label: header, type, column: header, options };
        });

        const tableName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        resolve({ tableName, fields });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsBinaryString(file);
  });
}
