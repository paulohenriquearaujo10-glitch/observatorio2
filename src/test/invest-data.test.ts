import { describe, expect, it } from 'vitest';
import { mapaNumeros, kpis } from '@/data/perfil';
import { defaultFilters, filterOpportunities, findCaso, incentivoPublished, kpiPublished, kpisInvestir, type Incentivo } from '@/data/investir';
import { lotesExemplo } from '@/data/imoveis-exemplo';
import { investirPt } from '@/i18n/investir';
import { pt } from '@/i18n/pt';

describe('Investir data', () => {
  it('reuses the home-page investment and lots figures', () => {
    expect(kpisInvestir.find(k => k.id === 'investimento')?.valor).toBe(kpis.find(k => k.id === 'investimento')?.dado.valor);
    expect(kpisInvestir.find(k => k.id === 'lotes')?.valor).toBe(31);
    expect(lotesExemplo).toHaveLength(Number(mapaNumeros.find(m => m.id === 'lotes')?.dado.valor));
  });
  it('hides cards without values', () => {
    expect(kpisInvestir.filter(kpiPublished).map(k => k.id)).toEqual(['investimento', 'lotes']);
  });
  it('filters by type and size range', () => {
    expect(filterOpportunities({ ...defaultFilters, tipo: 'terrenoPrivado' })).toHaveLength(0);
    expect(filterOpportunities({ ...defaultFilters, area: 'ate1000' }).every(o => o.area < 1000)).toBe(true);
    expect(filterOpportunities({ ...defaultFilters, territorio: 'CINCO' }).every(o => o.polo === 'CINCO')).toBe(true);
  });
  it('requires name, legal basis and agency for incentives', () => {
    const base = { id: 'x', nivel: 'municipal', nome: 'Programa', baseLegal: 'Lei 1', baseLegalUrl: '', orgao: 'SUPGEST', contato: '', beneficio: null, publico: null, setores: [], investimentoMinimo: null, empregosMinimos: null, fonte: 'Lei', dataReferencia: '2026', atualizadoEm: '15/10/2026' } as Incentivo;
    expect(incentivoPublished(base)).toBe(true);
    expect(incentivoPublished({ ...base, baseLegal: '' })).toBe(false);
  });
  it('shares the investor question with the menu', () => {
    expect(pt.panels.find(p => p.slug === '/investir')?.q).toBe(investirPt.question);
    expect(investirPt.question).toBe('O que está disponível agora, e com que incentivo?');
  });
  it('reuses the Shopee case with R$ 350 million', () => {
    expect(findCaso('shopee')?.investimento).toBe(350000000);
  });
});
