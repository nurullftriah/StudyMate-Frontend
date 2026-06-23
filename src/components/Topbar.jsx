import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function Topbar() {
  const { user } = useAuth();
  const initial = user?.name?.[0]?.toUpperCase() || 'S';
  const [notificationCount, setNotificationCount] = useState(0);
  const [stats, setStats] = useState({
    requests: 0,
    activeChats: 0
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    api.get('/users/dashboard')
      .then((response) => {
        const dashboardStats = response.data.stats || {};
        const requests = dashboardStats.requests || 0;
        const activeChats = dashboardStats.activeChats || 0;

        setStats({ requests, activeChats });
        setNotificationCount(requests + activeChats);
      })
      .catch(() => {
        setStats({ requests: 0, activeChats: 0 });
        setNotificationCount(0);
      });
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-search">
        <span></span>
        <input
          type="text"
          placeholder="Cari partner atau topik..."
          aria-label="Cari partner atau topik"
        />
      </div>

      <div className="topbar-profile">
        <div className="notification-wrapper">
          <button
            className="notification-button"
            aria-label="Notifikasi"
            title="Notifikasi"
            onClick={() => setShowNotification(!showNotification)}
          >
            <Bell size={24} strokeWidth={2.6} />

            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotification && (
            <div className="notification-dropdown">
              <strong>Notifikasi</strong>

              {notificationCount > 0 ? (
                <>
                  <Link to="/requests" className="notification-item">
                    <span>Permintaan Partner</span>
                    <em>{stats.requests}</em>
                  </Link>

                  <Link to="/messages" className="notification-item">
                    <span>Chat Aktif</span>
                    <em>{stats.activeChats}</em>
                  </Link>
                </>
              ) : (
                <p className="notification-empty">
                  Belum ada notifikasi baru.
                </p>
              )}
            </div>
          )}
        </div>

        {/* AVATAR + NAMA BISA DIKLIK KE PROFILE */}
        <Link to="/profile" className="topbar-user-link">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user?.name}
              className="avatar-image small-avatar"
            />
          ) : (
            <div
              className="avatar small"
              style={{ backgroundColor: user?.avatarColor || '#426ca8' }}
            >
              {initial}
            </div>
          )}

          <div className="topbar-user-text">
            <strong>{user?.name}</strong>
            <span>{user?.studyProgram || 'Mahasiswa'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;