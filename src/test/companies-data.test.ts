import { describe, expect, it } from 'vitest';
import { indicadores, empresas, graficos, hasChart, defaultFilters, matchesFilters, metadata, comparacaoPadrao } from '@/data/empresas-cadeias';
import { findSuppliers, empresasExemplo, type Supplier } from '@/data/empresas-exemplo';
import { companyRows } from '@/components/companies/exports';
import { pt } from '@/i18n/pt';
import { en } from '@/i18n/en';

describe('Companies and supply chains', () => {
  it('publishes only supplied numbers and hides empty charts', () => {
    expect(indicadores.filter(d => d.valor !== null).map(d => d.valor)).toEqual([39796]);
    expect(empresas.find(d => d.slug === 'shopee')?.investimento).toBe(350000000);
    expect(graficos.filter(hasChart)).toEqual([]);
    expect(empresasExemplo).toEqual([]);
    expect(empresas.every(d => !d.logoAutorizado && !d.logo)).toBe(true);
  });
  it('uses the same investor question in both languages and keeps comparators', () => {
    expect(pt.panels.find(p => p.slug === '/empresas')?.q).toBe(pt.companies.question);
    expect(en.panels.find(p => p.slug === '/empresas')?.q).toBe(en.companies.question);
    expect(comparacaoPadrao).toEqual(['mg', 'br', 'betim', 'bh']);
  });
  it('never passes unsegmented totals off as filtered results', () => {
    expect(matchesFilters({}, defaultFilters)).toBe(true);
    expect(matchesFilters({}, { ...defaultFilters, setor: 'industria' })).toBe(false);
    expect(companyRows().some(r => r['valor'] === 39796)).toBe(true);
    expect(companyRows({ ...defaultFilters, setor: 'industria' }).some(r => r['valor'] === 39796)).toBe(false);
  });
  it('filters verified supplier records by text and all dimensions', () => {
    const row: Supplier = { id: 'test-only', razaoSocial: 'Registro de teste', nomeFantasia: 'Aço Teste', atividade: 'Máquinas', bairro: 'Industrial', regional: 'Sede', setor: 'industria', cnae: '28', porte: 'micro', territorio: 'CINCO', latitude: null, longitude: null, ...metadata('Fixture de teste') };
    expect(findSuppliers([row], defaultFilters, 'aco')).toHaveLength(1);
    expect(findSuppliers([row], { ...defaultFilters, porte: 'grande' }, '')).toHaveLength(0);
    expect(findSuppliers([row], defaultFilters, '', 'Industrial')).toHaveLength(1);
  });
});