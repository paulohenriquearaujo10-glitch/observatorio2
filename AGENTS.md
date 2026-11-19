<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Economy and Territory data, metadata, comparison options and source links in `src/data/economia-territorio.ts`; components must never fabricate missing statistics.
- Economy display transforms use chart metadata for unit divisors, fixed index baselines and sector-total denominators; exports retain raw units and auxiliary totals so visual filtering cannot alter calculations.
- Keep dashboard translations in the i18n files and use the existing language provider, so the shared shell and dashboard switch together.
- Load Leaflet dynamically after hydration; example GeoJSON lives in `src/data/geo/` and must be labeled illustrative to avoid misrepresenting official geography.
- Use reusable data-driven dashboard charts and browser-only CSV/XLSX/PNG exports, so empty datasets stay hidden without server dependencies.
- Keep Companies and Supply Chains statistics, cases, chain objects and source metadata in `src/data/empresas-cadeias.ts`, with verified public supplier records in `src/data/empresas-exemplo.ts`; this separates official statistics from searchable corporate records.
- Companies filters apply only to records with matching dimensions; label unsegmented municipal totals and hide unavailable breakdowns to prevent misleading filtered results.
- Company cases open in accessible dialogs, and company maps are lazy-loaded after hydration only when territorial data exists; this avoids empty geographic and case views.
- Keep labor statistics, occupation configuration, institutions and source metadata in `src/data/trabalho-qualificacao.ts` and sourced course offerings in `src/data/cursos-exemplo.ts`; publication requires source and dates to avoid unverified figures.
- Labor filters apply only to matching dimensions and periods; exports use the same filtered records, while unsegmented totals are explicitly labeled to prevent false comparisons.
- Tailored-training requests are browser-only simulations without persistence or network submission; this preserves the brief's temporary non-delivery behavior.
- Keep infrastructure statistics, tariffs, tax rates, projects and layer metadata in `src/data/infraestrutura.ts`; reuse canonical Economy distances and Labor stock wages instead of copying figures, so repeated numbers remain consistent.
- Infrastructure filters publish matching dimensions only; calculators and exports consume the same sourced tariff/tax records and omit unavailable cost components, preventing fabricated estimates.
- Infrastructure maps are hydration-only lazy imports with illustrative example layers separated from official data; source-gated sections and simulator actions remain hidden when records are unavailable.
- Keep Investir statistics, incentives, projects, theses and cases in `src/data/investir.ts` and illustrative property records in `src/data/imoveis-exemplo.ts`; KPIs and cases reuse home/Companies fields so each number has one value.
- Incentives publish only with name, legal basis, agency and source dates; Investir filters drive the opportunity count, list and map together.
- Keep Innovation partners, KPIs, labs, calls and green cases in `src/data/inovacao.ts`; partner cards publish only name, official site and source dates until details are confirmed, preventing invented offers or distances.
- Keep Small Business guide content and bilingual copy in `src/data/pequenos-negocios.ts`, re-exporting copy through i18n; source-gate numeric/course/cluster records and reuse Economy distances to prevent inconsistent or fabricated guidance.
