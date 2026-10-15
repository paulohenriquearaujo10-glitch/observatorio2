import { sourced, type Slice } from './trabalho-qualificacao';
import type { LocalText, Metadata } from './economia-territorio';
export type Course = Metadata & Slice & { id: string; instituicao: string; curso: LocalText; area: LocalText; modalidade: 'tecnico' | 'qualificacao' | 'aprendizagem'; vagas: number | null; duracao: LocalText; url: string };
// Populate only sourced offerings. No illustrative course is presented as an actual enrollment opportunity.
export const cursosExemplo: Course[] = [];
export function findCourses(rows: Course[], query: string, area = 'all') {
  const normalize = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return rows.filter(r => sourced(r) && (area === 'all' || r.area.pt === area) && normalize(`${r.instituicao} ${r.curso.pt} ${r.curso.en} ${r.area.pt} ${r.area.en}`).includes(normalize(query.trim())));
}