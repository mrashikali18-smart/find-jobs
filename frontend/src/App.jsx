import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Briefcase, Building2, Clock, FileText, Mail, MapPin, MessageSquare, Pencil, Phone, Plus, Search, Send, SlidersHorizontal, Trash2, Upload, Users, Wallet, X } from 'lucide-react';
import { applicationApi, companyApi, connectionApi, jobApi, messageApi, postApi, publicProfileApi, searchApi, userApi } from './api/services';
import { getResumeUrl } from './api/client';
import ConnectButton from './components/ConnectButton';
import Footer from './components/Footer';
import JobCard from './components/JobCard';
import JobCardSkeleton from './components/JobCardSkeleton';
import LoopRing from './components/LoopRing';
import Navbar from './components/Navbar';
import Pagination from './components/Pagination';
import PasswordField from './components/PasswordField';
import PostCard from './components/PostCard';
import PostComposer from './components/PostComposer';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';
import { useAuth } from './context/AuthContext';

const STAGES = [
  { label: 'Search', detail: 'Filter thousands of open roles by skill, location, and category.' },
  { label: 'Apply', detail: 'Submit your resume and a tailored note in a couple of clicks.' },
  { label: 'Track', detail: 'Watch every application move through the loop in real time.' },
  { label: 'Hire', detail: 'Recruiters review, shortlist, and close the loop with an offer.' },
];

function Home() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    jobApi
      .list({ limit: 6, sort: '-createdAt' })
      .then(({ data }) => setFeatured(data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-800">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-amber-400/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rounded-full border border-amber-400/30"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
            Search &middot; Apply &middot; Track &middot; Hire
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-paper sm:text-5xl">
            Close the loop between talent and opportunity.
          </h1>
          <p className="mt-5 max-w-xl text-base text-paper/70 sm:text-lg">
            Find Jobs 🔎 is where job seekers find roles that fit and recruiters find people who fit
            back — one connected loop from search to hire.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl bg-paper p-3 shadow-card sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 px-2">
              <Search size={18} className="text-ink-700/50" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill, or company"
                className="w-full border-none bg-transparent py-2 text-sm text-ink900 outline-none placeholder:text-ink-700/40"
              />
            </div>
            <div className="hidden h-8 w-px bg-ink-700/10 sm:block" />
            <div className="flex flex-1 items-center gap-2 px-2">
              <MapPin size={18} className="text-ink-700/50" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location or 'remote'"
                className="w-full border-none bg-transparent py-2 text-sm text-ink900 outline-none placeholder:text-ink-700/40"
              />
            </div>
            <button type="submit" className="btn-accent shrink-0">
              Search jobs <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 flex gap-6 text-sm text-paper/60">
            <Link to="/register" className="underline decoration-amber-400/50 underline-offset-4 hover:text-paper">
              I&apos;m hiring — post a job
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-paper/10 pt-6">
            <div>
              <p className="font-display text-2xl font-semibold text-paper">25+</p>
              <p className="text-xs uppercase tracking-wide text-paper/50">Open roles</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-paper">10+</p>
              <p className="text-xs uppercase tracking-wide text-paper/50">Companies hiring</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-paper">Pan-India</p>
              <p className="text-xs uppercase tracking-wide text-paper/50">& remote roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* The loop */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink-800">How the loop works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="relative rounded-2xl border border-ink-700/10 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 font-mono text-xs text-paper">
                  {i + 1}
                </span>
                {i < STAGES.length - 1 && (
                  <span className="hidden h-px flex-1 bg-ink-700/15 sm:block" />
                )}
              </div>
              <h3 className="font-display text-lg font-medium text-ink-800">{stage.label}</h3>
              <p className="mt-1.5 text-sm text-ink-700/60">{stage.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-800">Recently posted</h2>
          <Link to="/jobs" className="text-sm font-medium text-ink-700 hover:underline">
            View all jobs &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-ink-700/60">No jobs posted yet — check back soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead'];

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const filters = {
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    salaryMin: searchParams.get('salaryMin') || '',
    salaryMax: searchParams.get('salaryMax') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: Number(searchParams.get('page')) || 1,
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await jobApi.list({ ...filters, limit: 9 });
      setJobs(data.jobs);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    jobApi.categories().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ keyword, location });
  };

  const activeChips = [
    filters.keyword && { key: 'keyword', label: `"${filters.keyword}"` },
    filters.location && { key: 'location', label: filters.location },
    filters.category && { key: 'category', label: filters.category },
    filters.jobType && { key: 'jobType', label: filters.jobType },
    filters.experienceLevel && { key: 'experienceLevel', label: `${filters.experienceLevel} level` },
    filters.salaryMin && { key: 'salaryMin', label: `Min ₹${Number(filters.salaryMin).toLocaleString('en-IN')}` },
    filters.salaryMax && { key: 'salaryMax', label: `Max ₹${Number(filters.salaryMax).toLocaleString('en-IN')}` },
  ].filter(Boolean);

  const clearAllFilters = () => {
    setKeyword('');
    setLocation('');
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">Find your next role</h1>
      <p className="mt-1 text-sm text-ink-700/60">
        {meta.total} open {meta.total === 1 ? 'position' : 'positions'} right now
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-700/15 bg-white px-3">
          <Search size={16} className="text-ink-700/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Title, skill, or company"
            className="w-full border-none bg-transparent py-2.5 text-sm outline-none placeholder:text-ink-700/40"
          />
        </div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="input-field sm:max-w-[220px]"
        />
        <button type="submit" className="btn-primary shrink-0">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="btn-outline shrink-0 sm:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </form>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => {
                if (chip.key === 'keyword') setKeyword('');
                if (chip.key === 'location') setLocation('');
                updateParams({ [chip.key]: '' });
              }}
              className="badge flex items-center gap-1 bg-ink-50 text-ink-700 hover:bg-ink-100"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-medium text-ink-700/50 hover:text-ink-700 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className={`${showFilters ? 'block' : 'hidden'} space-y-6 lg:block`}>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-800">Category</h3>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => updateParams({ category: e.target.value })}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-800">Job type</h3>
            <div className="flex flex-col gap-2">
              {JOB_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm capitalize text-ink-700/80">
                  <input
                    type="radio"
                    name="jobType"
                    checked={filters.jobType === type}
                    onChange={() => updateParams({ jobType: type })}
                  />
                  {type}
                </label>
              ))}
              <button
                type="button"
                onClick={() => updateParams({ jobType: '' })}
                className="w-fit text-xs text-ink-700/50 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-800">Experience</h3>
            <div className="flex flex-col gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm capitalize text-ink-700/80">
                  <input
                    type="radio"
                    name="experienceLevel"
                    checked={filters.experienceLevel === level}
                    onChange={() => updateParams({ experienceLevel: level })}
                  />
                  {level}
                </label>
              ))}
              <button
                type="button"
                onClick={() => updateParams({ experienceLevel: '' })}
                className="w-fit text-xs text-ink-700/50 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-800">Salary range (USD)</h3>
            <div className="flex items-center gap-2">
              <input
                key={`min-${filters.salaryMin}`}
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Min"
                defaultValue={filters.salaryMin}
                onBlur={(e) => updateParams({ salaryMin: e.target.value })}
                className="input-field !py-2 text-sm"
              />
              <span className="text-ink-700/40">–</span>
              <input
                key={`max-${filters.salaryMax}`}
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Max"
                defaultValue={filters.salaryMax}
                onBlur={(e) => updateParams({ salaryMax: e.target.value })}
                className="input-field !py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-800">Sort by</h3>
            <select
              className="input-field"
              value={filters.sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="-salaryMax">Salary: high to low</option>
              <option value="salaryMin">Salary: low to high</option>
            </select>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-700/20 py-16 text-center">
              <p className="text-ink-700/60">No jobs match those filters yet.</p>
              {activeChips.length > 0 && (
                <button type="button" onClick={clearAllFilters} className="btn-outline mt-4">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <Pagination page={meta.page} pages={meta.pages} onChange={(p) => updateParams({ page: p })} />
        </div>
      </div>
    </div>
  );
}

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return null;
  const symbol = currency === 'INR' ? '₹' : `${currency} `;
  const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);
  if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`;
  return `${symbol}${fmt(min || max)}+`;
};

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    jobApi
      .getById(id)
      .then(({ data }) => setJob(data.job))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (user.role !== 'jobseeker') {
      toast.error('Only job seeker accounts can apply');
      return;
    }
    if (!user.resumeUrl) {
      toast.error('Upload a resume in your profile before applying');
      navigate('/profile');
      return;
    }

    setApplying(true);
    try {
      await applicationApi.apply(id, { coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-ink-700/70">This job posting could not be found.</p>
        <Link to="/jobs" className="mt-4 inline-block text-ink-800 hover:underline">
          &larr; Back to all jobs
        </Link>
      </div>
    );
  }

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to="/jobs" className="text-sm text-ink-700/60 hover:underline">
        &larr; Back to all jobs
      </Link>

      <div className="card mt-4 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-50 font-display text-2xl text-ink-700">
              {job.company?.name?.[0]?.toUpperCase() || 'H'}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink-800 sm:text-3xl">
                {job.title}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-700/70">
                <Building2 size={14} /> {job.company?.name || 'Confidential company'}
              </p>
            </div>
          </div>

          {applied ? (
            <span className="badge h-fit bg-emerald-50 px-4 py-2 text-emerald-700">
              Application submitted
            </span>
          ) : (
            <button
              onClick={() => setShowApplyForm(true)}
              className="btn-accent shrink-0"
              disabled={job.status !== 'open'}
            >
              {job.status === 'open' ? 'Apply now' : 'Applications closed'}
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-ink-700/10 py-4 text-sm text-ink-700/70">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} /> {job.location} {job.isRemote && '(Remote friendly)'}
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <Briefcase size={15} /> {job.jobType} &middot; {job.experienceLevel} level
          </span>
          {salary && (
            <span className="flex items-center gap-1.5 font-mono">
              <Wallet size={15} /> {salary}
            </span>
          )}
          {job.applicationDeadline && (
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span key={s} className="badge bg-amber-400/15 text-amber-600">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink-800">About this role</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700/80">
            {job.description}
          </p>
        </div>

        {job.requirements?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-ink-800">Requirements</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-700/80">
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {job.responsibilities?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold text-ink-800">Responsibilities</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-700/80">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {(job.company?.hrContact?.name || job.company?.hrContact?.phone || job.company?.hrContact?.email) && (
          <div className="mt-8 rounded-xl border border-ink-700/10 bg-ink-50 p-5">
            <h2 className="font-display text-lg font-semibold text-ink-800">HR contact</h2>
            <p className="mt-1 text-xs text-ink-700/60">Reach out directly with any questions about this role.</p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-ink-700/80">
              {job.company.hrContact.name && <span>{job.company.hrContact.name}</span>}
              {job.company.hrContact.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={14} /> {job.company.hrContact.phone}
                </span>
              )}
              {job.company.hrContact.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {job.company.hrContact.email}
                </span>
              )}
            </div>
          </div>
        )}

        {showApplyForm && !applied && (
          <form onSubmit={handleApply} className="mt-8 rounded-xl bg-ink-50 p-5">
            <h3 className="font-display text-base font-semibold text-ink-800">
              Apply to {job.title}
            </h3>
            <p className="mt-1 text-xs text-ink-700/60">
              Your saved resume will be attached automatically. Add a short note for the recruiter (optional).
            </p>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Why you're a great fit for this role…"
              className="input-field mt-3"
            />
            <div className="mt-3 flex gap-2">
              <button type="submit" disabled={applying} className="btn-primary">
                {applying ? 'Submitting…' : 'Submit application'}
              </button>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-4 py-12 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-3xl shadow-card sm:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-8 text-white sm:flex">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <img src="/logo.svg" alt="Find Jobs logo" className="h-8 w-8" />
            Find Jobs 🔎
          </Link>
          <div>
            <h2 className="font-display text-2xl font-semibold leading-snug">
              Pick up right where your search left off.
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Track applications, message recruiters, and get matched to roles that fit.
            </p>
          </div>
          <p className="text-xs text-white/60">Search &middot; Apply &middot; Track &middot; Hire</p>
        </div>

        <div className="bg-white p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold text-ink-800">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-700/60">Log in to continue your loop.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field focus:border-rose-500 focus:ring-rose-500/20"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={!!errors.email}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-800">
                Password
              </label>
              <PasswordField
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                ariaInvalid={!!errors.password}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-700/60">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-rose-600 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-6 rounded-xl bg-ink-50 p-4 text-xs text-ink-700/70">
            <p className="font-medium text-ink-800">Demo accounts (after running the seed script)</p>
            <p className="mt-1 font-mono">recruiter@demo.com / password123</p>
            <p className="font-mono">jobseeker@demo.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker',
    companyName: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.role === 'recruiter' && !form.companyName.trim())
      e.companyName = 'Company name is required for recruiters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-4xl items-center px-4 py-12 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-3xl shadow-card sm:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-8 text-white sm:flex">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <img src="/logo.svg" alt="Find Jobs logo" className="h-8 w-8" />
            Find Jobs 🔎
          </Link>
          <div>
            <h2 className="font-display text-2xl font-semibold leading-snug">
              Join the loop between talent and opportunity.
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Whether you're hiring or job hunting, your next connection starts here.
            </p>
          </div>
          <p className="text-xs text-white/60">Search &middot; Apply &middot; Track &middot; Hire</p>
        </div>

        <div className="bg-white p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold text-ink-800">Join Find Jobs 🔎</h1>
          <p className="mt-2 text-sm text-ink-700/60">Create an account to get started.</p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-ink-50 p-1">
            {['jobseeker', 'recruiter'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`rounded-full py-2 text-sm font-medium capitalize transition-colors ${
                  form.role === role ? 'bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white' : 'text-ink-700/70'
                }`}
              >
                {role === 'jobseeker' ? "I'm job seeking" : "I'm hiring"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-800">
                Full name
              </label>
              <input
                id="name"
                className="input-field focus:border-rose-500 focus:ring-rose-500/20"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {form.role === 'recruiter' && (
              <div>
                <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-ink-800">
                  Company name
                </label>
                <input
                  id="companyName"
                  className="input-field focus:border-rose-500 focus:ring-rose-500/20"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
                {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input-field focus:border-rose-500 focus:ring-rose-500/20"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-800">
                Password
              </label>
              <PasswordField
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                ariaInvalid={!!errors.password}
                autoComplete="new-password"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              {!errors.password && (
                <p className="mt-1 text-xs text-ink-700/45">At least 8 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-700/60">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-rose-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .dashboard()
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const isRecruiter = user.role === 'recruiter';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">
        Welcome back, {user.name.split(' ')[0]}
      </h1>
      <p className="mt-1 text-sm text-ink-700/60">
        {isRecruiter ? "Here's how your postings are performing." : "Here's where your applications stand."}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {isRecruiter ? (
          <>
            <StatCard label="Jobs posted" value={data.stats.totalJobsPosted} />
            <StatCard label="Open postings" value={data.stats.openJobs} />
            <StatCard label="Total applicants" value={data.stats.totalApplicants} />
          </>
        ) : (
          <>
            <StatCard label="Applications sent" value={data.stats.totalApplied} />
            <StatCard label="Shortlisted" value={data.stats.shortlisted || 0} />
            <StatCard label="Offers" value={data.stats.hired || 0} />
          </>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-800">Recent activity</h2>
        <Link
          to={isRecruiter ? '/recruiter/jobs' : '/applications'}
          className="text-sm font-medium text-ink-700 hover:underline"
        >
          {isRecruiter ? 'Manage postings' : 'View all applications'} &rarr;
        </Link>
      </div>

      <div className="mt-4 card divide-y divide-ink-700/10">
        {data.recentActivity.length === 0 ? (
          <p className="p-6 text-sm text-ink-700/60">
            {isRecruiter
              ? 'No applicants yet — post a job to start receiving applications.'
              : 'You haven\'t applied to any jobs yet.'}
          </p>
        ) : (
          data.recentActivity.map((item) => (
            <div key={item._id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink-800">
                  {isRecruiter ? item.applicant?.name : item.job?.title}
                </p>
                <p className="text-xs text-ink-700/60">
                  {isRecruiter
                    ? `Applied for ${item.job?.title}`
                    : item.job?.company?.name}{' '}
                  &middot; {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </div>
              <LoopRing status={item.status} size="sm" />
            </div>
          ))
        )}
      </div>

      {isRecruiter && (
        <Link to="/recruiter/jobs/new" className="btn-accent mt-8 inline-flex">
          Post a new job
        </Link>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-ink-700/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink-800">{value}</p>
    </div>
  );
}

function Profile() {
  const { user, updateUserLocal } = useAuth();
  const fileInputRef = useRef(null);
  const linkedinInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    headline: '',
    bio: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    hrContactName: '',
    hrContactPhone: '',
    hrContactEmail: '',
    remoteFriendly: false,
    hiringVolume: 'low',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importingLinkedIn, setImportingLinkedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        headline: user.headline || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
        companyWebsite: user.companyWebsite || '',
        companyDescription: user.companyDescription || '',
      }));
      setSkills(user.skills || []);

      // HR contact + hiring preferences live on the Company document, not
      // the User, so pull them in separately once we know this is a recruiter.
      if (user.role === 'recruiter') {
        companyApi
          .mine()
          .then(({ data }) => {
            const c = data.company;
            if (!c) return;
            setForm((f) => ({
              ...f,
              hrContactName: c.hrContact?.name || '',
              hrContactPhone: c.hrContact?.phone || '',
              hrContactEmail: c.hrContact?.email || '',
              remoteFriendly: c.preferences?.remoteFriendly || false,
              hiringVolume: c.preferences?.hiringVolume || 'low',
            }));
          })
          .catch(() => {});
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const isRecruiter = user.role === 'recruiter';

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userApi.updateProfile({ ...form, skills });
      updateUserLocal(data.user);

      if (isRecruiter && form.companyName) {
        const companyPayload = {
          name: form.companyName,
          website: form.companyWebsite,
          description: form.companyDescription,
          hrContact: {
            name: form.hrContactName,
            phone: form.hrContactPhone,
            email: form.hrContactEmail,
          },
          preferences: {
            remoteFriendly: form.remoteFriendly,
            hiringVolume: form.hiringVolume,
          },
        };
        try {
          const existing = await companyApi.mine();
          if (existing.data.company) {
            await companyApi.update(existing.data.company._id, companyPayload);
          } else {
            await companyApi.create(companyPayload);
          }
        } catch (companyErr) {
          toast.error(companyErr.response?.data?.message || 'Profile saved, but company details failed to sync');
        }
      }

      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const { data } = await userApi.uploadResume(formData);
      updateUserLocal(data.user);
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // LinkedIn does not grant open API access to read a member's profile, so
  // there is no "sign in with LinkedIn and pull your data" button we can
  // legitimately offer. Instead we accept the file LinkedIn itself gives you
  // from Settings -> Data privacy -> Get a copy of your data (JSON or the
  // Profile.csv from the CSV export), parse it client-side, and let you
  // review before anything is saved.
  const handleLinkedInFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportingLinkedIn(true);
    try {
      const text = await file.text();
      let parsed;

      if (file.name.toLowerCase().endsWith('.json')) {
        const raw = JSON.parse(text);
        // Accept either LinkedIn's raw export shape or a pre-normalized shape
        parsed = {
          headline: raw.headline || raw.Headline || '',
          summary: raw.summary || raw.Summary || '',
          location: raw.location || raw.Location || '',
          skills: raw.skills || (raw.Skills ? raw.Skills.map((s) => s.Name || s) : []),
          positions: raw.positions || raw.Positions || [],
          education: raw.education || raw.Education || [],
        };
      } else {
        // Minimal CSV fallback: expects LinkedIn's Profile.csv header row
        const [headerLine, ...rows] = text.trim().split('\n');
        const headers = headerLine.split(',').map((h) => h.trim().replace(/"/g, ''));
        const first = rows[0]?.split(',').map((c) => c.trim().replace(/"/g, '')) || [];
        const row = Object.fromEntries(headers.map((h, i) => [h, first[i] || '']));
        parsed = {
          headline: row['Headline'] || '',
          summary: row['Summary'] || '',
          location: row['Geo Location'] || row['Location'] || '',
          skills: [],
          positions: [],
          education: [],
        };
      }

      const { data } = await userApi.importLinkedIn({
        profile: parsed,
        sourceFile: file.name,
      });
      updateUserLocal(data.user);
      setForm((f) => ({
        ...f,
        headline: data.user.headline || f.headline,
        bio: data.user.bio || f.bio,
        location: data.user.location || f.location,
      }));
      setSkills(data.user.skills || []);
      toast.success('Imported from your LinkedIn export');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not read that file — export it again from LinkedIn's Data privacy settings"
      );
    } finally {
      setImportingLinkedIn(false);
      e.target.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">Your profile</h1>
      <p className="mt-1 text-sm text-ink-700/60">
        {isRecruiter ? 'Manage your recruiter and company details.' : 'Keep your details and resume up to date.'}
      </p>

      <form onSubmit={handleSave} className="card mt-8 flex flex-col gap-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Full name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Phone</label>
            <input
              className="input-field"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">Location</label>
          <input
            className="input-field"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="City, Country"
          />
        </div>

        {!isRecruiter && (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Headline</label>
              <input
                className="input-field"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Frontend Developer with 3 years of React experience"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">About you</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Skills</label>
              <div className="flex gap-2">
                <input
                  className="input-field"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill and press Enter"
                />
                <button type="button" onClick={addSkill} className="btn-outline shrink-0">
                  <Plus size={16} />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="badge flex items-center gap-1 bg-amber-400/15 text-amber-600">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Resume</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-outline"
                  disabled={uploading}
                >
                  <Upload size={16} /> {uploading ? 'Uploading…' : 'Upload resume'}
                </button>
                {user.resumeUrl && (
                  <a
                    href={getResumeUrl(user.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink-700 underline"
                  >
                    View current resume
                  </a>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="mt-1 text-xs text-ink-700/50">PDF or Word document, up to 5MB.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Import from LinkedIn</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => linkedinInputRef.current?.click()}
                  className="btn-outline"
                  disabled={importingLinkedIn}
                >
                  <Upload size={16} /> {importingLinkedIn ? 'Importing…' : 'Upload LinkedIn export'}
                </button>
                <input
                  ref={linkedinInputRef}
                  type="file"
                  accept=".json,.csv"
                  className="hidden"
                  onChange={handleLinkedInFile}
                />
              </div>
              <p className="mt-1 text-xs text-ink-700/50">
                From LinkedIn: Settings &amp; Privacy &rarr; Data privacy &rarr; Get a copy of your data. We read the
                file locally in your browser — nothing is sent to LinkedIn, and we never ask for your LinkedIn
                password.
              </p>
            </div>
          </>
        )}

        {isRecruiter && (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Company name</label>
              <input
                className="input-field"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">Company website</label>
              <input
                className="input-field"
                value={form.companyWebsite}
                onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800">About the company</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.companyDescription}
                onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
              />
            </div>

            <div className="rounded-2xl border border-ink-700/10 bg-white p-4">
              <p className="mb-3 text-sm font-medium text-ink-800">HR contact</p>
              <p className="mb-3 text-xs text-ink-700/50">
                Shown to applicants so they know who to reach about their application.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">Contact name</label>
                  <input
                    className="input-field"
                    value={form.hrContactName}
                    onChange={(e) => setForm({ ...form, hrContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">Contact phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={form.hrContactPhone}
                    onChange={(e) => setForm({ ...form, hrContactPhone: e.target.value })}
                    placeholder="+1 555 123 4567"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">Contact email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.hrContactEmail}
                    onChange={(e) => setForm({ ...form, hrContactEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-ink-700/10 bg-white p-4">
              <p className="mb-3 text-sm font-medium text-ink-800">Hiring preferences</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm text-ink-800">
                  <input
                    type="checkbox"
                    checked={form.remoteFriendly}
                    onChange={(e) => setForm({ ...form, remoteFriendly: e.target.checked })}
                  />
                  Open to remote candidates
                </label>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">Hiring volume</label>
                  <select
                    className="input-field"
                    value={form.hiringVolume}
                    onChange={(e) => setForm({ ...form, hiringVolume: e.target.value })}
                  >
                    <option value="low">Low — a few roles a year</option>
                    <option value="medium">Medium — hiring regularly</option>
                    <option value="high">High — hiring at scale</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        <button type="submit" disabled={saving} className="btn-primary mt-2 w-fit">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    applicationApi
      .mine()
      .then(({ data }) => setApplications(data.applications))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await applicationApi.withdraw(id);
      toast.success('Application withdrawn');
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not withdraw application');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">Your applications</h1>
      <p className="mt-1 text-sm text-ink-700/60">Track every role as it moves through the loop.</p>

      {applications.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-700/20 py-16 text-center">
          <p className="text-ink-700/60">You haven&apos;t applied to any jobs yet.</p>
          <Link to="/jobs" className="btn-primary mt-4 inline-flex">
            Browse open jobs
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {applications.map((app) => (
            <div key={app._id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link to={`/jobs/${app.job?._id}`} className="font-display text-base font-semibold text-ink-800 hover:underline">
                  {app.job?.title || 'Job no longer available'}
                </Link>
                <p className="text-sm text-ink-700/60">
                  {app.job?.company?.name} &middot; {app.job?.location}
                </p>
                <p className="mt-1 text-xs text-ink-700/50">
                  Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LoopRing status={app.status} />
                {app.status === 'applied' && (
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    jobApi
      .mine()
      .then(({ data }) => setJobs(data.jobs))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting? This also removes its applications.')) return;
    try {
      await jobApi.remove(id);
      toast.success('Job deleted');
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete job');
    }
  };

  const toggleStatus = async (job) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const { data } = await jobApi.update(job._id, { status: nextStatus });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? data.job : j)));
      toast.success(`Job marked as ${nextStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update job');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink-800">Your postings</h1>
        <Link to="/recruiter/jobs/new" className="btn-accent">
          <Plus size={16} /> Post a job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-700/20 py-16 text-center">
          <p className="text-ink-700/60">You haven&apos;t posted any jobs yet.</p>
          <Link to="/recruiter/jobs/new" className="btn-primary mt-4 inline-flex">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job._id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-ink-800">{job.title}</h3>
                  <button
                    onClick={() => toggleStatus(job)}
                    className={`badge capitalize ${
                      job.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-50 text-ink-700/60'
                    }`}
                  >
                    {job.status}
                  </button>
                </div>
                <p className="text-sm text-ink-700/60">
                  {job.location} &middot; {job.applicantCount} applicant{job.applicantCount === 1 ? '' : 's'} &middot;{' '}
                  {job.viewCount} views
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn-outline !py-2">
                  <Users size={15} /> Applicants
                </Link>
                <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn-outline !px-3 !py-2">
                  <Pencil size={15} />
                </Link>
                <button onClick={() => handleDelete(job._id)} className="btn-outline !px-3 !py-2 text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyForm = {
  title: '',
  category: '',
  jobType: 'full-time',
  experienceLevel: 'entry',
  location: '',
  isRemote: false,
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  description: '',
  requirements: '',
  responsibilities: '',
  skills: '',
  vacancies: 1,
  applicationDeadline: '',
};

function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    jobApi
      .getById(id)
      .then(({ data }) => {
        const j = data.job;
        setForm({
          title: j.title || '',
          category: j.category || '',
          jobType: j.jobType || 'full-time',
          experienceLevel: j.experienceLevel || 'entry',
          location: j.location || '',
          isRemote: j.isRemote || false,
          salaryMin: j.salaryMin || '',
          salaryMax: j.salaryMax || '',
          currency: j.currency || 'USD',
          description: j.description || '',
          requirements: (j.requirements || []).join('\n'),
          responsibilities: (j.responsibilities || []).join('\n'),
          skills: (j.skills || []).join(', '),
          vacancies: j.vacancies || 1,
          applicationDeadline: j.applicationDeadline
            ? new Date(j.applicationDeadline).toISOString().split('T')[0]
            : '',
        });
      })
      .catch(() => toast.error('Could not load job'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      vacancies: Number(form.vacancies) || 1,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
      applicationDeadline: form.applicationDeadline || undefined,
    };

    try {
      if (isEdit) {
        await jobApi.update(id, payload);
        toast.success('Job updated');
      } else {
        await jobApi.create(payload);
        toast.success('Job posted');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save job');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">
        {isEdit ? 'Edit job posting' : 'Post a new job'}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-8 flex flex-col gap-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">Job title</label>
          <input
            required
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Category</label>
            <input
              required
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Engineering, Design, Sales"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Location</label>
            <input
              required
              className="input-field"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Job type</label>
            <select
              className="input-field"
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            >
              {['full-time', 'part-time', 'contract', 'internship', 'remote'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Experience level</label>
            <select
              className="input-field"
              value={form.experienceLevel}
              onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            >
              {['entry', 'mid', 'senior', 'lead'].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-ink-700/80">
              <input
                type="checkbox"
                checked={form.isRemote}
                onChange={(e) => setForm({ ...form, isRemote: e.target.checked })}
              />
              Remote friendly
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Salary min</label>
            <input
              type="number"
              className="input-field"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Salary max</label>
            <input
              type="number"
              className="input-field"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Currency</label>
            <input
              className="input-field"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">Required skills</label>
          <input
            className="input-field"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="Comma separated, e.g. React, Node.js, MongoDB"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">Description</label>
          <textarea
            required
            rows={5}
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">
            Responsibilities <span className="text-ink-700/40">(one per line)</span>
          </label>
          <textarea
            rows={4}
            className="input-field"
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">
            Requirements <span className="text-ink-700/40">(one per line)</span>
          </label>
          <textarea
            rows={4}
            className="input-field"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Vacancies</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.vacancies}
              onChange={(e) => setForm({ ...form, vacancies: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">Application deadline</label>
            <input
              type="date"
              className="input-field"
              value={form.applicationDeadline}
              onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-fit">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish job'}
        </button>
      </form>
    </div>
  );
}

const STATUS_OPTIONS = ['applied', 'reviewed', 'shortlisted', 'rejected', 'hired'];

function Applicants() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([jobApi.getById(jobId), applicationApi.forJob(jobId)])
      .then(([jobRes, appsRes]) => {
        setJob(jobRes.data.job);
        setApplications(appsRes.data.applications);
      })
      .catch(() => toast.error('Could not load applicants'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    try {
      const { data } = await applicationApi.updateStatus(appId, { status });
      setApplications((prev) => prev.map((a) => (a._id === appId ? data.application : a)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/recruiter/jobs" className="text-sm text-ink-700/60 hover:underline">
        &larr; Back to your postings
      </Link>

      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-800">
        Applicants for {job?.title}
      </h1>
      <p className="mt-1 text-sm text-ink-700/60">
        {applications.length} applicant{applications.length === 1 ? '' : 's'}
      </p>

      {applications.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink-700/20 py-16 text-center">
          <p className="text-ink-700/60">No one has applied yet.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {applications.map((app) => (
            <div key={app._id} className="card p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-800">
                    {app.applicant?.name}
                  </h3>
                  <p className="text-sm text-ink-700/60">
                    {app.applicant?.email} {app.applicant?.location && `· ${app.applicant.location}`}
                  </p>
                  <p className="mt-1 text-xs text-ink-700/50">
                    Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                  </p>
                </div>

                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="input-field w-fit capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {app.applicant?.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {app.applicant.skills.map((s) => (
                    <span key={s} className="badge bg-ink-50 text-ink-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {app.coverLetter && (
                <p className="mt-3 whitespace-pre-line rounded-lg bg-ink-50 p-3 text-sm text-ink-700/80">
                  {app.coverLetter}
                </p>
              )}

              {app.resumeUrl && (
                <a
                  href={getResumeUrl(app.resumeUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-800 hover:underline"
                >
                  <FileText size={15} /> View resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi
      .feed()
      .then(({ data }) => setPosts(data.posts))
      .finally(() => setLoading(false));
  }, []);

  const handlePosted = (post) => setPosts((prev) => [post, ...prev]);
  const handleDeleted = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">Your feed</h1>
      <p className="mt-1 text-sm text-ink-700/60">Updates from you and your connections.</p>

      <div className="mt-6">
        <PostComposer onPosted={handlePosted} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-700/20 py-16 text-center">
          <p className="text-ink-700/60">
            Nothing here yet — connect with people or post an update to get started.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}

function PublicProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([publicProfileApi.get(id), postApi.byUser(id)])
      .then(([profileRes, postsRes]) => {
        setProfile(profileRes.data.user);
        setPosts(postsRes.data.posts);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleMessage = async () => {
    const { data } = await messageApi.start(id);
    navigate(`/messages/${data.conversation._id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-ink-700/60">This profile could not be found.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser._id === profile._id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-ink-700 to-ink-800" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-ink-50 font-display text-3xl text-ink-700">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            {!isOwnProfile && (
              <div className="flex gap-2 pb-1">
                <button onClick={handleMessage} className="btn-outline">
                  <MessageSquare size={16} /> Message
                </button>
                <ConnectButton userId={profile._id} />
              </div>
            )}
            {isOwnProfile && (
              <Link to="/profile" className="btn-outline pb-1">
                Edit profile
              </Link>
            )}
          </div>

          <h1 className="mt-3 font-display text-2xl font-semibold text-ink-800">{profile.name}</h1>
          <p className="text-sm text-ink-700/70">
            {profile.headline || (profile.role === 'recruiter' ? `Recruiter at ${profile.companyName || 'a company'}` : '')}
          </p>
          {profile.location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-ink-700/60">
              <MapPin size={14} /> {profile.location}
            </p>
          )}
          <p className="mt-2 text-sm text-ink-700/60">
            {profile.connectionCount || 0} connection{profile.connectionCount === 1 ? '' : 's'}
          </p>

          {profile.bio && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-700/80">{profile.bio}</p>
          )}

          {profile.skills?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span key={s} className="badge bg-amber-400/15 text-amber-600">
                  {s}
                </span>
              ))}
            </div>
          )}

          {profile.experience?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-ink-800">Experience</h2>
              <div className="mt-2 space-y-3">
                {profile.experience.map((exp, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-ink-800">{exp.title}</p>
                    <p className="text-xs text-ink-700/60">{exp.company}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.education?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-ink-800">Education</h2>
              <div className="mt-2 space-y-3">
                {profile.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-ink-800">{edu.institution}</p>
                    <p className="text-xs text-ink-700/60">
                      {edu.degree} {edu.fieldOfStudy && `· ${edu.fieldOfStudy}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink-800">Posts</h2>
        <div className="mt-4 flex flex-col gap-4">
          {posts.length === 0 ? (
            <p className="text-sm text-ink-700/60">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

function Connections() {
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sentTo, setSentTo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('connections');

  const load = () => {
    setLoading(true);
    Promise.all([connectionApi.mine(), connectionApi.pending(), userApi.suggestions()])
      .then(([connRes, pendRes, sugRes]) => {
        setConnections(connRes.data.connections);
        setPending(pendRes.data.requests);
        setSuggestions(sugRes.data.users || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleConnect = async (id) => {
    try {
      await connectionApi.send(id);
      setSentTo((s) => [...s, id]);
      toast.success('Connection request sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send request');
    }
  };

  const handleRespond = async (id, status) => {
    try {
      await connectionApi.respond(id, { status });
      toast.success(status === 'accepted' ? 'Connection accepted' : 'Request declined');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not respond to request');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">Your network</h1>

      <div className="mt-6 flex gap-2 rounded-full bg-ink-50 p-1 w-fit">
        <button
          onClick={() => setTab('connections')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === 'connections' ? 'bg-ink-700 text-paper' : 'text-ink-700/70'
          }`}
        >
          Connections ({connections.length})
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === 'pending' ? 'bg-ink-700 text-paper' : 'text-ink-700/70'
          }`}
        >
          Requests ({pending.length})
        </button>
      </div>

      {tab === 'connections' && (
        <div className="mt-6 flex flex-col gap-3">
          {connections.length === 0 ? (
            <p className="text-sm text-ink-700/60">No connections yet — send a request below to get started.</p>
          ) : (
            connections.map((c) => (
              <Link key={c._id} to={`/profile/${c._id}`} className="card flex items-center gap-3 p-4 hover:-translate-y-0.5 transition-transform">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 font-display text-ink-700">
                  {c.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-800">{c.name}</p>
                  <p className="text-xs text-ink-700/60">{c.headline || c.location}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink-800">People you may know</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {suggestions.map((s) => (
              <div key={s._id} className="card flex items-center justify-between gap-3 p-4">
                <Link to={`/profile/${s._id}`} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 font-display text-ink-700">
                    {s.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{s.name}</p>
                    <p className="text-xs text-ink-700/60">{s.headline || s.location || s.role}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleConnect(s._id)}
                  disabled={sentTo.includes(s._id)}
                  className="btn-outline !py-1.5 shrink-0"
                >
                  {sentTo.includes(s._id) ? 'Sent' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pending' && (
        <div className="mt-6 flex flex-col gap-3">
          {pending.length === 0 ? (
            <p className="text-sm text-ink-700/60">No pending requests.</p>
          ) : (
            pending.map((req) => (
              <div key={req._id} className="card flex items-center justify-between gap-3 p-4">
                <Link to={`/profile/${req.requester._id}`} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 font-display text-ink-700">
                    {req.requester.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{req.requester.name}</p>
                    <p className="text-xs text-ink-700/60">{req.requester.headline}</p>
                  </div>
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(req._id, 'accepted')} className="btn-accent !py-1.5">
                    Accept
                  </button>
                  <button onClick={() => handleRespond(req._id, 'rejected')} className="btn-outline !py-1.5">
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const loadConversations = () => {
    messageApi
      .conversations()
      .then(({ data }) => setConversations(data.conversations))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    setLoadingMessages(true);
    messageApi
      .messages(conversationId)
      .then(({ data }) => setMessages(data.messages))
      .finally(() => setLoadingMessages(false));

    // Poll for new messages while a conversation is open
    const interval = setInterval(() => {
      messageApi.messages(conversationId).then(({ data }) => setMessages(data.messages));
    }, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const messageText = text;
    setText('');
    try {
      const { data } = await messageApi.send(conversationId, { text: messageText });
      setMessages((prev) => [...prev, data.message]);
      loadConversations();
    } catch {
      setText(messageText);
    }
  };

  const activeConversation = conversations.find((c) => c._id === conversationId);
  const otherParticipant = (conv) => conv.participants.find((p) => p._id !== user._id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink-800">Messages</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Conversation list */}
        <div className="card h-fit divide-y divide-ink-700/10 lg:max-h-[70vh] lg:overflow-y-auto">
          {loadingList ? (
            <div className="flex justify-center p-6">
              <Spinner />
            </div>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-sm text-ink-700/60">No conversations yet.</p>
          ) : (
            conversations.map((conv) => {
              const other = otherParticipant(conv);
              return (
                <button
                  key={conv._id}
                  onClick={() => navigate(`/messages/${conv._id}`)}
                  className={`flex w-full items-center gap-3 p-4 text-left hover:bg-ink-50 ${
                    conv._id === conversationId ? 'bg-ink-50' : ''
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-50 font-display text-sm text-ink-700">
                    {other?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-800">{other?.name}</p>
                    <p className="truncate text-xs text-ink-700/60">{conv.lastMessage || 'Start the conversation'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Chat window */}
        <div className="card flex h-[70vh] flex-col">
          {!conversationId ? (
            <div className="flex flex-1 items-center justify-center text-sm text-ink-700/60">
              Select a conversation to start chatting.
            </div>
          ) : loadingMessages ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="border-b border-ink-700/10 p-4">
                <p className="text-sm font-semibold text-ink-800">
                  {activeConversation && otherParticipant(activeConversation)?.name}
                </p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => {
                  const isMine = m.sender?._id === user._id;
                  return (
                    <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs rounded-2xl px-3.5 py-2 text-sm sm:max-w-sm ${
                          isMine ? 'bg-ink-700 text-paper' : 'bg-ink-50 text-ink-800'
                        }`}
                      >
                        <p>{m.text}</p>
                        <p className={`mt-1 text-[10px] ${isMine ? 'text-paper/60' : 'text-ink-700/40'}`}>
                          {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} className="flex gap-2 border-t border-ink-700/10 p-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message…"
                  className="input-field"
                />
                <button type="submit" className="btn-primary shrink-0 !px-3">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchApi
      .global(q)
      .then(({ data }) => setResults(data.results))
      .finally(() => setLoading(false));
  }, [q]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const people = results?.people || [];
  const jobs = results?.jobs || [];
  const companies = results?.companies || [];
  const isEmpty = people.length === 0 && jobs.length === 0 && companies.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink-800">
        Results for &ldquo;{q}&rdquo;
      </h1>

      {isEmpty ? (
        <p className="mt-8 text-sm text-ink-700/60">No matches found. Try a different search.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {people.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-ink-800">People</h2>
              <div className="mt-3 flex flex-col gap-3">
                {people.map((p) => (
                  <Link key={p._id} to={`/profile/${p._id}`} className="card flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-50 font-display text-ink-700">
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-800">{p.name}</p>
                      <p className="text-xs text-ink-700/60">{p.headline || p.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {jobs.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-ink-800">Jobs</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            </section>
          )}

          {companies.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-ink-800">Companies</h2>
              <div className="mt-3 flex flex-col gap-3">
                {companies.map((c) => (
                  <div key={c._id} className="card flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 font-display text-ink-700">
                      {c.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-800">{c.name}</p>
                      <p className="text-xs text-ink-700/60">{c.industry || c.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-amber-500">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-800">Page not found</h1>
      <p className="mt-2 text-sm text-ink-700/60">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute role="jobseeker">
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <PublicProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:conversationId"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute role="recruiter">
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/edit"
            element={
              <ProtectedRoute role="recruiter">
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute role="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
