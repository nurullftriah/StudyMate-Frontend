import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  name: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  university: '',
  studyProgram: '',
  interests: '',
  skillLevel: 'Pemula',
  bio: ''
};

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
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

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Registrasi gagal. Periksa kembali data anda.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page register-bg">
      <section className="auth-card wide">
        <div className="auth-logo compact-logo">
          <img src="/logo-studymate.png" alt="Logo StudyMate" className="auth-logo-image small" />
          <strong>REGISTRASI AKUN</strong>
        </div>
        {error ? <div className="alert error">{error}</div> : null}
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Nama Lengkap
            <input name="name" placeholder="Masukkan nama lengkap" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="Masukkan email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Username
            <input name="username" placeholder="Masukkan username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Masukkan password" value={form.password} onChange={handleChange} required minLength="6" />
          </label>
          <label>
            Konfirmasi Password
            <input name="confirmPassword" type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={handleChange} required minLength="6" />
          </label>
          <label>
            Universitas
            <input name="university" placeholder="Masukkan universitas" value={form.university} onChange={handleChange} />
          </label>
          <label>
            Program Studi
            <input name="studyProgram" placeholder="Masukkan program studi" value={form.studyProgram} onChange={handleChange} />
          </label>
          <label>
            Level Belajar
            <select name="skillLevel" value={form.skillLevel} onChange={handleChange}>
              <option>Pemula</option>
              <option>Menengah</option>
              <option>Mahir</option>
            </select>
          </label>
          <label className="full-field">
            Minat Belajar
            <input name="interests" placeholder="Contoh: React, UI Design, Database" value={form.interests} onChange={handleChange} />
          </label>
          <label className="full-field">
            Bio Singkat
            <textarea name="bio" placeholder="Ceritakan tujuan belajar anda" value={form.bio} onChange={handleChange} rows="3" />
          </label>
          <button className="primary-button full full-field" disabled={loading}>{loading ? 'Mendaftarkan...' : 'Daftar'}</button>
        </form>
        <p className="auth-footnote">Sudah punya akun? <Link to="/login">Login disini</Link></p>
      </section>
    </main>
  );
}

export default Register;
