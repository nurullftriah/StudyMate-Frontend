import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="brand dark">
          <img src="/logo-studymate.png" alt="Logo StudyMate" className="brand-logo" />
        </div>
        <div className="landing-actions">
          <Link to="/login" className="text-link">Login</Link>
          <Link to="/register" className="primary-button">Daftar</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Platform partner belajar</span>
          <h1>Temukan Partner Belajar yang Tepat untuk Meningkatkan Prestasimu</h1>
          <p>
            Cari teman belajar berdasarkan topik, universitas, dan program studi. Kirim permintaan,
            terhubung, lalu mulai diskusi melalui fitur chat StudyMate.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="primary-button large">Mulai Sekarang</Link>
            <Link to="/login" className="secondary-button large">Sudah Punya Akun</Link>
          </div>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <div className="study-card card-one">
            <strong>User A</strong>
            <span>Pemrograman Web</span>
          </div>
          <div className="study-card card-two">
            <strong>User B</strong>
            <span>Desain UI/UX</span>
          </div>
          <div className="study-card card-three">
            <strong>Chat Diskusi</strong>
            <span>Jadwalkan belajar bersama</span>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <article>
          <strong>Mudah dan Cepat</strong>
          <span>Cari partner belajar tanpa proses rumit.</span>
        </article>
        <article>
          <strong>Berdasarkan Topik</strong>
          <span>Cocokkan minat belajar yang sama.</span>
        </article>
        <article>
          <strong>Chat dan Diskusi</strong>
          <span>Berinteraksi langsung dengan partner.</span>
        </article>
      </section>
    </div>
  );
}

export default Landing;
