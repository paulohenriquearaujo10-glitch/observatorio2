import { describe, expect, it } from 'vitest';
import { defaultFilters, editaisAbertos, kpiPublished, kpisInovacao, parceirosFiltrados, type Edital } from '@/data/inovacao';
import { pt } from '@/i18n/pt';
import { en } from '@/i18n/en';

describe('Inovação data', () => {
  it('hides KPI cards without value and source dates', () => { expect(kpisInovacao.filter(kpiPublished)).toHaveLength(0); });
  it('shares the investor question with the panels menu', () => {
    expect(pt.panels.find(p => p.slug === '/inovacao')?.q).toBe('Há parceiros para inovar e automatizar?');
    expect(en.panels.find(p => p.slug === '/inovacao')?.q).toBe(en.innovation.question);
  });
  it('area filter excludes partners without that area', () => { expect(parceirosFiltrados({ ...defaultFilters, area: 'automacao' })).toHaveLength(0); });
  it('"Em Contagem" excludes partners located in Belo Horizonte', () => { expect(parceirosFiltrados({ ...defaultFilters, local: 'contagem' }).some(p => p.cidade === 'Belo Horizonte')).toBe(false); });
  it('lists only open calls, nearest deadline first', () => {
    const m = { fonte: 'Finep', dataReferencia: '2026', atualizadoEm: '01/10/2026', financiador: 'Finep', link: 'x' };
    const l: Edital[] = [{ id: 'a', nome: 'A', prazo: '2026-12-01', ...m }, { id: 'b', nome: 'B', prazo: '2026-01-01', ...m }, { id: 'c', nome: 'C', prazo: '2026-11-01', ...m }];
    expect(editaisAbertos(new Date('2026-10-19'), l).map(e => e.id)).toEqual(['c', 'a']);
  });
});
