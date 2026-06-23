import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, MessageCircle } from 'lucide-react';
import api, { getErrorMessage } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import PartnerCard from '../components/PartnerCard.jsx';
import StatCard from '../components/StatCard.jsx';

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState({
    stats: {
      activePartners: 0,
      requests: 0,
      activeChats: 0
    },
    recommendations: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard')
      .then((response) => setDashboard(response.data))
      .catch((err) => setError(getErrorMessage(err, 'Dashboard gagal dimuat.')))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: 'Partner Aktif',
      value: dashboard.stats.activePartners,
      hint: 'Partner yang sudah diterima',
      icon: Users
    },
    {
      label: 'Permintaan',
      value: dashboard.stats.requests,
      hint: 'Masuk dan dikirim',
      icon: UserPlus
    },
    {
      label: 'Chat Aktif',
      value: dashboard.stats.activeChats,
      hint: 'Diskusi yang berjalan',
      icon: MessageCircle
    }
  ];

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Selamat Datang</span>
          <h2>Halo, {user?.name || 'StudyMate'}!</h2>
          <p>Kelola partner belajar, permintaan, dan diskusi dari satu dashboard.</p>
        </div>

        <Link to="/partners" className="primary-button">
          Cari Partner
        </Link>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {loading ? (
        <div className="card-skeleton">Memuat data dashboard...</div>
      ) : (
        <>
          <section className="stats-grid">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                hint={stat.hint}
                icon={stat.icon}
              />
            ))}
          </section>

          <section className="content-card">
            <div className="section-title">
              <div>
                <h3>Rekomendasi Partner</h3>
                <p>Calon partner berdasarkan minat belajar anda.</p>
              </div>

              <Link to="/partners" className="text-link">
                Lihat Semua
              </Link>
            </div>

            <div className="partner-grid">
              {dashboard.recommendations.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} compact />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;