import { describe, it, expect } from 'vitest';
import { indicadores, sourced, hasChart, graficos, metadata, defaultFilters, matchesFilters, filteredChart, inPeriod, instituicoes, type LaborChart } from '@/data/trabalho-qualificacao';
import { laborRows } from '@/components/labor/exports';
import { findCourses, cursosExemplo, type Course } from '@/data/cursos-exemplo';
import { pt } from '@/i18n/pt';
import { en } from '@/i18n/en';
describe('Labor data publication', () => {
  it('hides the unconfirmed employment figure and all missing statistics', () => {
    expect(indicadores.find(r => r.id === 'empregos')?.valor).toBe(183100);
    expect(indicadores.filter(r => sourced(r) && r.valor !== null)).toEqual([]);
    expect(graficos.filter(hasChart)).toEqual([]);
    expect(laborRows()).toEqual([]);
    expect(instituicoes.every(s => !s.logoAutorizado && !s.logo && s.formandos === null && s.unidades === null)).toBe(true);
  });
  it('keeps the home and menu investor question in sync', () => {
    expect(pt.panels.find(p => p.slug === '/trabalho')?.q).toBe(pt.labor.question);
    expect(en.panels.find(p => p.slug === '/trabalho')?.q).toBe(en.labor.question);
  });
  it('filters only matching dimensions and inclusive periods', () => {
    expect(matchesFilters({}, { ...defaultFilters, setor: 'industria' })).toBe(false);
    expect(matchesFilters({ cbo: 'soldador' }, { ...defaultFilters, cbo: 'soldador' })).toBe(true);
    expect(inPeriod('2025', { ...defaultFilters, inicio: '2025-06', fim: '2025-08' })).toBe(true);
    expect(inPeriod('2024-12', { ...defaultFilters, inicio: '2025-01' })).toBe(false);
    const chart: LaborChart = { id: 'fixture', section: 'movimento', tipo: 'line', titulo: { pt: 'Teste', en: 'Test' }, metrica: { pt: 'Teste', en: 'Test' }, chaves: [{ id: 'contagem', nome: { pt: 'Contagem', en: 'Contagem' } }], serie: [{ periodo: '2025-01', setor: 'industria', valores: { contagem: 2 } }, { periodo: '2025-02', setor: 'servicos', valores: { contagem: 3 } }], ...metadata('Fonte de teste', 'empregos', '2025-02', 'monthly') };
    expect(filteredChart(chart, { ...defaultFilters, setor: 'industria' }).serie).toHaveLength(1);
    expect(hasChart({ ...chart, fonte: '' })).toBe(false);
    expect(hasChart(chart)).toBe(true);
  });
  it('searches only sourced courses without fabricating places', () => {
    expect(cursosExemplo).toEqual([]);
    const course: Course = { id: 'fixture', instituicao: 'Instituição de teste', curso: { pt: 'Automação', en: 'Automation' }, area: { pt: 'Indústria', en: 'Industry' }, modalidade: 'tecnico', vagas: null, duracao: { pt: '2 anos', en: '2 years' }, url: 'https://example.org', ...metadata('Fixture', '', '2025') };
    expect(findCourses([course], 'automacao')).toHaveLength(1);
    expect(findCourses([{ ...course, fonte: '' }], '')).toHaveLength(0);
  });
});