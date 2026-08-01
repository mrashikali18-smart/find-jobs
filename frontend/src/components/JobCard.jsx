import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Wallet } from 'lucide-react';

const formatSalary = (min, max, currency = 'USD') => {
  if (!min && !max) return null;
  const fmt = (n) => new Intl.NumberFormat('en-US').format(n);
  if (min && max) return `${currency} ${fmt(min)} – ${fmt(max)}`;
  return `${currency} ${fmt(min || max)}+`;
};

export default function JobCard({ job }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card group flex flex-col gap-4 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 font-display text-lg text-ink-700">
            {job.company?.name?.[0]?.toUpperCase() || 'H'}
          </div>
          <div>
            <h3 className="font-display text-base font-semibold leading-tight text-ink-800 group-hover:underline">
              {job.title}
            </h3>
            <p className="text-sm text-ink-700/60">{job.company?.name || 'Confidential'}</p>
          </div>
        </div>
        <span className="badge shrink-0 bg-ink-50 capitalize text-ink-700">{job.jobType}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-700/70">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1 capitalize">
          <Briefcase size={14} /> {job.experienceLevel} level
        </span>
        {salary && (
          <span className="flex items-center gap-1 font-mono">
            <Wallet size={14} /> {salary}
          </span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="badge bg-amber-400/15 text-amber-600">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="badge bg-ink-50 text-ink-700/60">+{job.skills.length - 4}</span>
          )}
        </div>
      )}
    </Link>
  );
}
