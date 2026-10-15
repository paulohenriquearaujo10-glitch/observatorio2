import { indicadores, empresas, graficos, atividades, baseTerritorial, matrizFilial, complexidade, cadeias, type Filters, matchesFilters } from '@/data/empresas-cadeias';
import { empresasExemplo } from '@/data/empresas-exemplo';
import { downloadCsv, type ExportRow } from '@/components/economy/exports';
export { downloadCsv };
export function companyRows(filters?: Filters): ExportRow[] {
 const include = (row: Parameters<typeof matchesFilters>[0]) => !filters || matchesFilters(row, filters);
 return [
 ...indicadores.filter(d => d.valor !== null && include(d)).map(({ contexto, ...d }) => ({ ...d })),
 ...graficos.filter(include).flatMap(g => g.serie.flatMap(p => Object.entries(p.valores).filter(([,v]) => v !== null).map(([serie, valor]) => ({ indicador: g.id, serie, periodo: p.periodo, valor, unidade: g.unidade, fonte: g.fonte, dataReferencia: g.dataReferencia, periodicidade: g.periodicidade, atualizadoEm: g.atualizadoEm })))),
 ...empresas.filter(include).map(({ grupo, logo, logoAutorizado, empregados, motivo, citacao, historia, ...d }) => ({ ...d, setorNome: grupo.pt })),
 ...atividades.filter(d => d.valor !== null && include(d)).map(({ nome, ...d }) => ({ ...d, nome: nome.pt })),
 ...baseTerritorial.filter(include).map(d => ({ ...d })),
 ...matrizFilial.filter(d => d.valor !== null && include(d)).map(({ nome, ...d }) => ({ ...d, nome: nome.pt })),
 ...(complexidade.valor === null ? [] : [{ indicador: 'complexidade', valor: complexidade.valor, unidade: complexidade.unidade, fonte: complexidade.fonte, dataReferencia: complexidade.dataReferencia, periodicidade: complexidade.periodicidade, atualizadoEm: complexidade.atualizadoEm }]),
 ...cadeias.flatMap(c => c.elos.map(({ nome, comprasExternas, ...d }) => ({ ...d, cadeia: c.id, nome: nome.pt, comprasExternas: comprasExternas?.pt ?? '' }))),
 ...empresasExemplo.filter(include).map(d => ({ ...d })),
 ];
}
export async function downloadCompaniesXlsx(filters?: Filters) {
 const XLSX = await import('xlsx'); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(companyRows(filters)), 'Empresas e Cadeias'); XLSX.writeFile(workbook, 'empresas-cadeias.xlsx');
}
