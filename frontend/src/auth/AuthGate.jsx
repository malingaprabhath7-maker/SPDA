import React, { createContext, useContext, useEffect, useState } from 'react';
import { authRequest, clearSession, getToken, LOGIN_PAGE, API_URL } from './session';

// Gives the logged-in user to any component: const { user } = useAuth();
const AuthContext = createContext({ user: null });
export const useAuth = () => useContext(AuthContext);

// Shows the dashboard only for logged-in users; everyone else goes to the login page.
export default function AuthGate({ children }) {
  const [state, setState] = useState({ status: 'checking', user: null });

  const check = async () => {
    const token = getToken();
    if (!token) {
      window.location.replace(LOGIN_PAGE);
      return;
    }
    setState({ status: 'checking', user: null });
    const res = await authRequest('me', { token });
    if (res.ok) {
      setState({ status: 'ok', user: res.data.user });
    } else if (res.status === 401) {
      clearSession();
      window.location.replace(LOGIN_PAGE);
    } else {
      setState({ status: 'error', user: null, message: res.data.message });
    }
  };

  useEffect(() => { check(); }, []);

  if (state.status === 'ok') {
    return <AuthContext.Provider value={{ user: state.user }}>{children}</AuthContext.Provider>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D3A] text-white p-6">
      {state.status === 'checking' ? (
        <p className="text-sm text-slate-300">Checking your login…</p>
      ) : (
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-lg font-semibold">Cannot reach the server</h1>
          <p className="text-sm text-slate-300">{state.message}</p>
          <p className="text-xs text-slate-400">API address: {API_URL}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={check} className="px-4 py-2 rounded-lg bg-white text-[#0B1D3A] text-sm font-semibold">
              Try again
            </button>
            <a href={LOGIN_PAGE} className="px-4 py-2 rounded-lg border border-white/30 text-sm font-semibold">
              Back to login
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
