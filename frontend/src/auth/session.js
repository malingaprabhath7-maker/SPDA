// Login session helpers shared by the login page and the dashboard.

// Same backend address as App.jsx (set VITE_API_URL in frontend/.env.local to change it)
export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const LOGIN_PAGE = '/login.html';
export const DASHBOARD_PAGE = '/dashboard.html';
export const HOME_PAGE = '/';

const TOKEN_KEY = 'spda-token';
const USER_KEY = 'spda-user';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function getSavedUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
}

export function saveSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch { /* storage blocked: the login only lasts for this page */ }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch { /* ignore */ }
}

// POST JSON to auth/<name>.php and return { ok, status, data }
export async function authRequest(name, body) {
  try {
    const response = await fetch(`${API_URL}/auth/${name}.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = null; }
    if (!data) {
      // PHP sent an error page instead of JSON: show the first part of it
      const detail = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
      data = {
        success: false,
        message: `Server error (${response.status}). ${detail || 'Check that PHP and the database are running.'}`,
      };
    }
    return { ok: response.ok && data.success !== false, status: response.status, data };
  } catch {
    return {
      ok: false,
      status: 0,
      data: { success: false, message: `Cannot reach the server (${API_URL}). Is PHP running?` },
    };
  }
}

export async function logout() {
  const token = getToken();
  if (token) await authRequest('logout', { token });
  clearSession();
  window.location.href = LOGIN_PAGE;
}
