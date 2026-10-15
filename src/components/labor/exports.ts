import { indicadores, graficos, salarios, rotatividade, alcance, baciaIndicadores, ocupacoesEmFalta, filteredChart, hasChart, matchesFilters, sourced, inPeriod, defaultFilters, type Filters } from '@/data/trabalho-qualificacao';
import { cursosExemplo } from '@/data/cursos-exemplo';
import { chartRows, type ExportRow } from '@/components/economy/exports';
export { downloadCsv, downloadPng } from '@/components/economy/exports';
export function laborRows(filters: Filters = defaultFilters, compare = ['mg', 'br', 'betim', 'bh']): ExportRow[] {
  const valid = (r: Parameters<typeof sourced>[0]) => sourced(r) && inPeriod(r.dataReferencia, filters);
  return [
    ...indicadores.filter(r => r.valor !== null && valid(r) && matchesFilters(r, filters)).map(({ contexto: _c, ...r }) => ({ ...r })),
    ...graficos.map(g => filteredChart(g, filters)).filter(hasChart).flatMap(g => chartRows({ ...g, section: 'mercado' }, g.serie, g.chaves.filter(k => !k.cidade || k.cidade === 'contagem' || compare.includes(k.cidade)).map(k => k.id))),
    ...[...salarios, ...rotatividade].filter(r => valid(r) && matchesFilters(r, filters)).flatMap(({ nome, valores, ...r }) => Object.entries(valores).filter(([cidade, v]) => v !== null && (cidade === 'contagem' || compare.includes(cidade))).map(([cidade, valor]) => ({ ...r, nome: nome.pt, cidade, valor }))),
    ...alcance.filter(r => r.valor !== null && valid(r) && matchesFilters(r, filters)).map(({ escolaridade: _e, ...r }) => ({ ...r })),
    ...baciaIndicadores.filter(r => r.valor !== null && valid(r) && matchesFilters(r, filters)).map(r => ({ ...r })),
    ...ocupacoesEmFalta.filter(r => valid(r) && matchesFilters(r, filters)).map(({ nome, ...r }) => ({ ...r, nome: nome.pt })),
    ...cursosExemplo.filter(r => valid(r) && matchesFilters(r, filters)).map(({ curso, area, duracao, ...r }) => ({ ...r, curso: curso.pt, area: area.pt, duracao: duracao.pt })),
  ];
}
export async function downloadLaborXlsx(rows: ExportRow[]) {
  const XLSX = await import('xlsx'); const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), 'Trabalho e Qualificacao'); XLSX.writeFile(book, 'trabalho-qualificacao.xlsx');
}