import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>Halaman yang anda cari tidak ditemukan.</p>
      <Link to="/dashboard" className="primary-button">Kembali ke Dashboard</Link>
    </main>
  );
}

export default NotFound;
