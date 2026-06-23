import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Search,
  MailQuestion,
  MessageCircle,
  User,
  LogOut
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/partners', label: 'Cari Partner', icon: Search },
  { to: '/requests', label: 'Permintaan', icon: MailQuestion },
  { to: '/messages', label: 'Pesan', icon: MessageCircle },
  { to: '/profile', label: 'Profil', icon: User }
];

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo-white.png" alt="Logo StudyMate" className="sidebar-logo" />
      </div>

      <nav className="side-nav">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <Icon className="nav-icon-svg" size={26} strokeWidth={2.6} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="logout-button" onClick={logout}>
        <LogOut size={26} strokeWidth={2.6} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;