// src/components/Layout.jsx
import { 
  LayoutDashboard, Building2, Layers, Users, 
  UserPlus, CreditCard, BarChart3, Menu, Bell, ClipboardList
} from 'lucide-react';

export function Sidebar({ currentView, setView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buildings', label: 'Building Management', icon: Building2 },
    { id: 'rooms', label: 'Floor & Room', icon: Layers },
    { id: 'students', label: 'Student Management', icon: Users },
    { id: 'allocation', label: 'Room Allocation', icon: UserPlus },
    { id: 'requests', label: 'Room Requests', icon: ClipboardList },
    { id: 'fees', label: 'Fee Management', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="bg-dark text-white d-none d-md-flex flex-column position-fixed start-0 top-0 bottom-0" style={{ width: '260px', zIndex: 1030 }}>
      <div className="p-4 border-bottom border-secondary">
        <h5 className="fw-bold text-primary mb-0 tracking-wide">CampusStay</h5>
        <small className="text-muted">Hostel Management Portal</small>
      </div>
      
      <div className="nav flex-column nav-pills p-3 flex-grow-1 operational-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`nav-link text-start d-flex align-items-center gap-3 my-1 py-2 px-3 border-0 transition-all ${
                isActive ? 'active bg-primary text-white' : 'text-secondary bg-transparent'
              }`}
              style={{ borderRadius: '8px' }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="p-3 text-center border-top border-secondary text-muted" style={{ fontSize: '0.75rem' }}>
        v1.0.0 © 2026
      </div>
    </div>
  );
}

export function Navbar({ user, onLogout }) {
  const isStudent = user?.role === 'student';
  const displayName = user?.name || 'Admin User';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="navbar navbar-expand bg-white border-bottom position-fixed top-0 end-0 px-4" style={{ left: '260px', height: '64px', zIndex: 1020 }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <button className="btn d-md-none p-0 border-0 me-2">
            <Menu size={24} />
          </button>
          <span className="navbar-brand mb-0 h1 fs-6 text-secondary fw-semibold">Welcome Back, {user?.role === 'student' ? 'Student' : 'Admin'}</span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <button className="btn p-1 position-relative text-muted border-0">
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>
          {!isStudent && (
            <>
              <div className="vr text-muted my-2 mx-1"></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px' }}>
                  {initials}
                </div>
                <span className="small fw-medium text-dark d-none d-sm-inline-block">{displayName}</span>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function DashboardLayout({ children, currentView, setView, user, onLogout }) {
  return (
    <div className="min-vh-100 bg-light">
      <Sidebar currentView={currentView} setView={setView} />
      <div style={{ paddingLeft: '260px' }} className="d-flex flex-column min-vh-100">
        <Navbar user={user} onLogout={onLogout} />
        <main className="container-fluid p-4" style={{ marginTop: '64px', maxWidth: '1300px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
