import { useEffect, useMemo, useState } from 'react';
import { Login } from './Components/Auth/Login';
import { Signup } from './Components/Auth/Signup';
import { Dashboard } from './Components/Dashboard';
import { DashboardLayout } from './Components/Layout';
import { StudentPortal } from './Components/StudentPortal';
import { BuildingManagement, FloorRoomManagement, StudentManagement, RoomAllocation, FeeManagement, Reports } from './Components/Modules';

function App() {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });
  const [authMode, setAuthMode] = useState(() => {
    if (typeof window === 'undefined') return 'login';
    return window.location.hash.replace('#', '') === 'signup' ? 'signup' : 'login';
  });
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const syncMode = () => {
      const hash = window.location.hash.replace('#', '');
      setAuthMode(hash === 'signup' ? 'signup' : 'login');
    };

    syncMode();
    window.addEventListener('hashchange', syncMode);
    return () => window.removeEventListener('hashchange', syncMode);
  }, []);

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    if (authUser?.role === 'student') {
      window.location.hash = '';
    } else {
      window.location.hash = '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('dashboard');
    window.location.hash = 'login';
  };

  const content = useMemo(() => {
    if (!user) {
      return authMode === 'signup' ? (
        <Signup onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Login onAuthSuccess={handleAuthSuccess} />
      );
    }

    if (user.role === 'student') {
      return <StudentPortal user={user} onLogout={handleLogout} />;
    }

    const views = {
      dashboard: <Dashboard />,
      buildings: <BuildingManagement />,
      rooms: <FloorRoomManagement />,
      students: <StudentManagement />,
      allocation: <RoomAllocation />,
      fees: <FeeManagement />,
      reports: <Reports />,
    };

    return (
      <DashboardLayout currentView={currentView} setView={setCurrentView} user={user} onLogout={handleLogout}>
        {views[currentView] || views.dashboard}
      </DashboardLayout>
    );
  }, [authMode, currentView, user]);

  return content;
}

export default App;
