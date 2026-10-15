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
- Keep dashboard translations in the i18n files and use the existing language provider, so the shared shell and dashboard switch together.
- Load Leaflet dynamically after hydration; example GeoJSON lives in `src/data/geo/` and must be labeled illustrative to avoid misrepresenting official geography.
- Use reusable data-driven dashboard charts and browser-only CSV/XLSX/PNG exports, so empty datasets stay hidden without server dependencies.
