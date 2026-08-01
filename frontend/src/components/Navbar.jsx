import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import toast from 'react-hot-toast';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-ink-800' : 'text-ink-700/60 hover:text-ink-800'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-semibold text-ink-800">
          <img src="/logo.svg" alt="Find Jobs logo" className="h-8 w-8" />
          <span className="hidden sm:inline">Find Jobs 🔎</span>
        </Link>

        {user && (
          <form onSubmit={handleSearch} className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-ink-700/15 bg-white px-3 lg:flex">
            <Search size={15} className="text-ink-700/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, jobs, companies"
              className="w-full border-none bg-transparent py-2 text-sm outline-none placeholder:text-ink-700/40"
            />
          </form>
        )}

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>
          {user && (
            <NavLink to="/feed" className={navLinkClass}>
              Feed
            </NavLink>
          )}
          {user && (
            <NavLink to="/connections" className={navLinkClass}>
              Network
            </NavLink>
          )}
          {user?.role === 'recruiter' && (
            <NavLink to="/recruiter/jobs" className={navLinkClass}>
              My postings
            </NavLink>
          )}
          {user?.role === 'jobseeker' && (
            <NavLink to="/applications" className={navLinkClass}>
              Applications
            </NavLink>
          )}
          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <NavLink to="/messages" className="rounded-full p-2 hover:bg-ink-50" aria-label="Messages">
                <MessageSquare size={19} className="text-ink-700" />
              </NavLink>
              <NotificationBell />
              <Link to="/profile" className="ml-1 text-sm font-medium text-ink-700/80 hover:text-ink-800">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-outline !py-2">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost !py-2">
                Log in
              </Link>
              <Link to="/register" className="btn-accent !py-2">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-700/10 bg-paper px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2 rounded-full border border-ink-700/15 bg-white px-3">
            <Search size={15} className="text-ink-700/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, jobs, companies"
              className="w-full border-none bg-transparent py-2 text-sm outline-none placeholder:text-ink-700/40"
            />
          </form>

          <div className="flex flex-col gap-4">
            <NavLink to="/jobs" className={navLinkClass} onClick={() => setOpen(false)}>
              Jobs
            </NavLink>
            {user && (
              <NavLink to="/feed" className={navLinkClass} onClick={() => setOpen(false)}>
                Feed
              </NavLink>
            )}
            {user && (
              <NavLink to="/connections" className={navLinkClass} onClick={() => setOpen(false)}>
                <span className="flex items-center gap-1.5">
                  <Users size={15} /> Network
                </span>
              </NavLink>
            )}
            {user && (
              <NavLink to="/messages" className={navLinkClass} onClick={() => setOpen(false)}>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={15} /> Messages
                </span>
              </NavLink>
            )}
            {user?.role === 'recruiter' && (
              <NavLink to="/recruiter/jobs" className={navLinkClass} onClick={() => setOpen(false)}>
                My postings
              </NavLink>
            )}
            {user?.role === 'jobseeker' && (
              <NavLink to="/applications" className={navLinkClass} onClick={() => setOpen(false)}>
                Applications
              </NavLink>
            )}
            {user && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
            )}
            <hr className="border-ink-700/10" />
            {user ? (
              <button onClick={handleLogout} className="btn-outline w-full">
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-ghost w-full" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-accent w-full" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
