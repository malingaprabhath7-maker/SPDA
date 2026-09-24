import React, { useEffect, useState } from 'react';
import { User, AtSign, Lock, Eye, EyeOff, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { authRequest, getToken, saveSession, DASHBOARD_PAGE, HOME_PAGE } from './session';
import Bubbles from './Bubbles.jsx';

const EMPTY = { full_name: '', username: '', password: '', confirm: '' };

function Field({ icon: Icon, label, type = 'text', value, onChange, autoComplete, right, id }) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/15">
        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className="w-full py-2.5 text-sm text-slate-800 outline-none bg-transparent"
        />
        {right}
      </span>
    </label>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState(window.location.hash === '#register' ? 'register' : 'login');
  const [form, setForm] = useState(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Already logged in? Go straight to the dashboard.
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    authRequest('me', { token }).then(res => {
      if (res.ok) window.location.replace(DASHBOARD_PAGE);
    });
  }, []);

  const set = key => value => setForm(prev => ({ ...prev, [key]: value }));

  const switchMode = next => {
    setMode(next);
    setError('');
    setForm(EMPTY);
    window.history.replaceState(null, '', next === 'register' ? '#register' : window.location.pathname);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirm) return setError('The two passwords do not match.');
    }

    setBusy(true);
    const body = mode === 'register'
      ? { full_name: form.full_name, username: form.username, password: form.password }
      : { username: form.username, password: form.password };
    const res = await authRequest(mode === 'register' ? 'register' : 'login', body);
    setBusy(false);

    if (!res.ok) {
      setError(res.data.message || 'Something went wrong. Please try again.');
      return;
    }
    saveSession(res.data.token, res.data.user);
    window.location.href = DASHBOARD_PAGE;
  };

  const eyeButton = (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className="text-slate-400 hover:text-slate-600"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  const isRegister = mode === 'register';

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#070F22] via-[#0B1D3A] to-[#1E3A8A] flex flex-col items-center justify-center px-4 py-10">
      <Bubbles />
      <a href={HOME_PAGE} className="fixed top-5 left-5 z-10 flex items-center gap-1.5 text-sm text-slate-300 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </a>

      <img src="/spda-logo.png" alt="SPDA" className="relative z-10 w-60 max-w-[80vw] mb-4 drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]" />

      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7">
        <h1 className="text-xl font-bold text-[#0B1D3A]">
          {isRegister ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-slate-500 mt-1 mb-5">
          {isRegister ? 'Register to use the SPDA Admin Portal' : 'Log in to the SPDA Admin Portal'}
        </p>

        <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1 mb-5 text-sm font-semibold">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 rounded-lg ${!isRegister ? 'bg-white text-[#0B1D3A] shadow' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`py-2 rounded-lg ${isRegister ? 'bg-white text-[#0B1D3A] shadow' : 'text-slate-500'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <Field id="full_name" icon={User} label="Full name" value={form.full_name} onChange={set('full_name')} autoComplete="name" />
          )}
          <Field id="username" icon={AtSign} label="Username" value={form.username} onChange={set('username')} autoComplete="username" />
          <Field
            id="password"
            icon={Lock}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            right={eyeButton}
          />
          {isRegister && (
            <Field
              id="confirm"
              icon={Lock}
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              value={form.confirm}
              onChange={set('confirm')}
              autoComplete="new-password"
            />
          )}

          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-60 text-white text-sm font-semibold"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-5">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => switchMode(isRegister ? 'login' : 'register')}
            className="font-semibold text-[#1E3A8A] hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
