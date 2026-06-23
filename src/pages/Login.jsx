import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login gagal. Periksa email dan password.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">
          <img src="/logo-studymate.png" alt="Logo StudyMate" className="auth-logo-image" />
          <span>LOGIN</span>
        </div>
        {error ? <div className="alert error">{error}</div> : null}
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input name="email" type="email" placeholder="Masukkan email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Masukkan password" value={form.password} onChange={handleChange} required />
          </label>
          <button className="primary-button full" disabled={loading}>{loading ? 'Memproses...' : 'Login'}</button>
        </form>
        <p className="auth-footnote">Belum punya akun? <Link to="/register">Registrasi disini</Link></p>
      </section>
    </main>
  );
}

export default Login;
