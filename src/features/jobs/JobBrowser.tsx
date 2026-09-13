import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { categories, type Partner } from '../../data/catalog';
import { DebouncedSearch } from './DebouncedSearch';
import { JobResults } from './JobResults';
import { countries, filterJobs, type Job } from './model';

export function JobBrowser({
  jobs,
  partners,
}: {
  jobs: readonly Job[];
  partners: readonly Partner[];
}) {
  const [params, setParams] = useSearchParams();
  const [resetVersion, setResetVersion] = useState(0);
  const query = params.get('q') ?? '';
  const category = categories.some((item) => item.id === params.get('category'))
    ? (params.get('category') ?? '')
    : '';
  const country = Object.hasOwn(countries, params.get('country') ?? '')
    ? (params.get('country') ?? '')
    : '';

  const updateFilter = useCallback(
    (name: string, value: string) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set(name, value);
          else next.delete(name);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );
  const onQueryChange = useCallback(
    (value: string) => updateFilter('q', value),
    [updateFilter],
  );
  const filteredJobs = useMemo(
    () => filterJobs(jobs, { query, category, country }),
    [jobs, query, category, country],
  );

  return (
    <section aria-labelledby="jobs-title" className="min-w-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 id="jobs-title" className="text-2xl font-bold tracking-tight">
          Відкриті вакансії
        </h2>
        <span className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-muted">
          Усього: {jobs.length}
        </span>
      </div>
      <div
        role="search"
        aria-label="Фільтри вакансій"
        className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <DebouncedSearch
            key={resetVersion}
            value={query}
            onChange={onQueryChange}
          />
        </div>
        <div>
          <label
            htmlFor="vacancy-category"
            className="mb-2 block text-xs font-bold"
          >
            Категорія
          </label>
          <select
            id="vacancy-category"
            value={category}
            onChange={(event) => updateFilter('category', event.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-white px-3 text-sm"
          >
            <option value="">Усі категорії</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="vacancy-country"
            className="mb-2 block text-xs font-bold"
          >
            Країна
          </label>
          <select
            id="vacancy-country"
            value={country}
            onChange={(event) => updateFilter('country', event.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-white px-3 text-sm"
          >
            <option value="">Уся Європа</option>
            {Object.entries(countries).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 py-3">
        <p role="status" aria-live="polite" className="text-xs text-muted">
          Знайдено вакансій:{' '}
          <span className="font-bold text-ink">{filteredJobs.length}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setParams({}, { replace: true });
            setResetVersion((value) => value + 1);
          }}
          className="min-h-10 rounded-lg px-2 text-xs font-semibold text-brand hover:bg-brand-light"
        >
          Скинути фільтри
        </button>
      </div>
      <JobResults jobs={filteredJobs} partners={partners} />
    </section>
  );
}
