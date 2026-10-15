import { graficos, indicadores, linhasComparacao, alcance, distancias, polos, type ChartData, type Point } from "@/data/economia-territorio";

export type ExportRow = Record<string, string | number | null>;
export function csvText(rows: ExportRow[]): string {
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const cell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return "\uFEFF" + [columns.map(cell).join(";"), ...rows.map(row => columns.map(key => cell(row[key])).join(";"))].join("\r\n");
}
function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadCsv(rows: ExportRow[], filename: string) { save(new Blob([csvText(rows)], { type: "text/csv;charset=utf-8" }), filename + ".csv"); }
export function chartRows(chart: ChartData, points: Point[] = chart.serie, keys = chart.chaves.map(k => k.id)): ExportRow[] {
  return points.flatMap(point => keys.filter(key => point.valores[key] !== null && point.valores[key] !== undefined).map(key => ({ indicador: chart.id, periodo: point.periodo, recorte: point.recorte ?? "municipio", serie: key, valor: point.valores[key] ?? null, unidade: chart.unidade, fonte: chart.fonte, dataReferencia: chart.dataReferencia, periodicidade: chart.periodicidade, atualizadoEm: chart.atualizadoEm })));
}
export function allRows(): ExportRow[] {
  return [
    ...indicadores.filter(d => d.valor !== null).map(({ contexto, variacao, ...d }) => ({ ...d })),
    ...graficos.flatMap(g => chartRows(g)),
    ...linhasComparacao.flatMap(row => Object.entries(row.valores).filter(([,value]) => value !== null).map(([cidade, valor]) => ({ indicador: row.id, cidade, valor, unidade: row.unidade, fonte: row.fonte, dataReferencia: row.dataReferencia, periodicidade: row.periodicidade, atualizadoEm: row.atualizadoEm }))),
    ...alcance.filter(d => d.valor !== null).map(d => ({ ...d, indicador: "alcance" })),
    ...distancias.filter(d => d.valor !== null).map(({ acessos, ...d }) => ({ ...d, acessos: acessos.join(" · "), indicador: "distancia" })),
    ...polos.filter(d => d.valor !== null || d.empresas !== null).map(({ acessos, setores, ...d }) => ({ ...d, acessos: acessos.join(" · "), setores: setores?.pt ?? "", indicador: "polo" })),
  ];
}
export async function downloadXlsx() {
  const XLSX = await import("xlsx"); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(allRows()), "Economia e Territorio"); XLSX.writeFile(wb, "economia-territorio.xlsx");
}
export async function downloadPng(node: HTMLElement, name: string) {
  const { toBlob } = await import("html-to-image"); const blob = await toBlob(node, { pixelRatio: 2, filter: n => !(n instanceof HTMLElement && n.dataset["exportExclude"] === "true") }); if (blob) save(blob, name + ".png");
}