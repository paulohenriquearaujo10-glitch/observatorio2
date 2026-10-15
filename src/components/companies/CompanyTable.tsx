import { useRef } from 'react';
import { Download, ImageDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Source } from '@/components/economy/ChartPanel';
import { downloadCsv, downloadPng, type ExportRow } from '@/components/economy/exports';
import { useI18n } from '@/i18n';
import type { Metadata } from '@/data/economia-territorio';
function formatCell(value: string | number | null | undefined, lang: string) { return typeof value === 'number' ? value.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US') : value; }
export function CompanyTable({ title, id, rows, columns }: { title: string; id: string; rows: Array<ExportRow & Metadata>; columns: Array<{ key: string; label: string }> }) {
 const { t, lang } = useI18n(); const ref = useRef<HTMLDivElement>(null); if (!rows.length) return null;
 return <div ref={ref} className="min-w-0"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold">{title}</h3><div className="flex flex-wrap gap-2" data-export-exclude="true"><Button variant="outline" size="sm" onClick={() => downloadCsv(rows, id)}><Download />{t.economy.csv}</Button><Button variant="ghost" size="sm" onClick={async () => { try { if (ref.current) await downloadPng(ref.current, id); } catch { toast.error(t.economy.exportError); } }}><ImageDown />{t.economy.png}</Button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-muted">{columns.map(col => <th key={col.key} className="p-3">{col.label}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={String(row['id'] ?? i)} className="border-b">{columns.map((col, j) => <td key={col.key} className="p-3">{formatCell(row[col.key], lang)}{j === 0 && <Source data={row} />}</td>)}</tr>)}</tbody></table></div></div>;
}
