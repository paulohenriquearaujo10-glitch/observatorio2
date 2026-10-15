import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/components/companies/CompanyFilters';
import { CompanyTable } from '@/components/companies/CompanyTable';
import { cursosExemplo, findCourses } from '@/data/cursos-exemplo';
import { matchesFilters, inPeriod, type Filters } from '@/data/trabalho-qualificacao';
import { useI18n } from '@/i18n';
export function CourseDirectory({ filters }: { filters: Filters }) {
  const { t, lang } = useI18n(); const l = t.labor; const [query, setQuery] = useState(''); const [area, setArea] = useState('all');
  const base = cursosExemplo.filter(r => matchesFilters(r, filters) && inPeriod(r.dataReferencia, filters));
  if (!findCourses(base, '').length) return null;
  const rows = findCourses(base, query, area);
  return <div className="mt-8"><h3 className="mb-4 text-xl font-bold">{l.coursesTitle}</h3><div className="mb-5 grid max-w-3xl items-end gap-4 sm:grid-cols-2"><label className="text-xs font-semibold">{l.courseSearch}<Input value={query} onChange={e => setQuery(e.target.value)} className="mt-2" /></label><FilterSelect label={l.area} value={area} onChange={setArea} options={[{ id: 'all', name: t.companies.all }, ...[...new Set(cursosExemplo.map(r => r.area.pt))].map(id => ({ id, name: cursosExemplo.find(r => r.area.pt === id)?.area[lang] ?? id }))]} /></div>{rows.length ? <CompanyTable title={l.coursesTitle} id="cursos" rows={rows.map(({ curso, area: courseArea, duracao, ...r }) => ({ ...r, curso: curso[lang], area: courseArea[lang], duracao: duracao[lang], modalidade: l.modalities[r.modalidade] }))} columns={[{ key: 'instituicao', label: l.institution }, { key: 'curso', label: l.course }, { key: 'area', label: l.area }, { key: 'modalidade', label: l.modality }, { key: 'vagas', label: l.seats }, { key: 'duracao', label: l.duration }]} /> : <p role="status" className="text-sm text-muted-foreground">{l.noCourses}</p>}</div>;
}