import type { Metadata } from './economia-territorio';
import type { Slice, Filters } from './empresas-cadeias';
import { matchesFilters } from './empresas-cadeias';
export type Supplier = Metadata & Slice & { id: string; razaoSocial: string; nomeFantasia: string; atividade: string; bairro: string; regional: string; latitude: number | null; longitude: number | null };
// No verified public CNPJ records were provided. Do not turn anchor brand names into fabricated CNPJ records.
export const empresasExemplo: Supplier[] = [];
export function findSuppliers(rows: Supplier[], filters: Filters, query: string, bairro = 'all') {
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const text = normalize(query.trim());
  return rows.filter(row => matchesFilters(row, filters) && (bairro === 'all' || row.bairro === bairro || row.regional === bairro) && normalize(`${row.razaoSocial} ${row.nomeFantasia} ${row.atividade}`).includes(text));
}
