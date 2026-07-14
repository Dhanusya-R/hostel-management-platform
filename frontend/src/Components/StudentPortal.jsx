// src/components/StudentPortal.jsx
import { useState, useEffect } from 'react';
import { LogOut, Home, CreditCard, Building2, RefreshCw } from 'lucide-react';
import api from '../api';

export function StudentPortal({ user, onLogout }) {
  const [myRoom, setMyRoom] = useState(null);
  const [fees, setFees] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showChangeForm, setShowChangeForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.get(`/students/${user.id}`)
        .then(res => setMyRoom(res.data.Room))
        .catch(err => console.error(err));

      api.get('/fees')
        .then(res => setFees(res.data.filter(f => f.studentId === user.id)))
        .catch(err => console.error(err));

      api.get('/buildings')
        .then(res => setBuildings(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    if (selectedBuilding) {
      api.get(`/buildings/${selectedBuilding}`)
        .then(res => {
          const available = res.data.Rooms ? res.data.Rooms.filter(r => r.status === 'available') : [];
          setAvailableRooms(available);
        })
        .catch(err => console.error(err));
    }
  }, [selectedBuilding]);

  const requestRoomChange = async () => {
    if (!selectedBuilding || !selectedRoom) {
      alert("Please select building and room");
      return;
    }
    try {
      await api.post('/allocations', {
        studentId: user.id,
        roomId: selectedRoom
      });
      alert("Room change request sent to warden!");
      setSelectedBuilding('');
      setSelectedRoom('');
      setShowChangeForm(false);
    } catch (error) {
      console.error(error);
      alert("Request failed");
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand bg-white border-bottom px-4 py-3 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h5 className="fw-bold text-primary mb-0">CampusStay <span className="badge bg-secondary-subtle text-secondary">Student Portal</span></h5>
          <button onClick={onLogout} className="btn btn-outline-danger btn-sm">
            <LogOut size={16} className="me-1" /> Logout
          </button>
        </div>
      </nav>

      <main className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm p-4 text-center">
              <div className="rounded-circle bg-primary-subtle text-primary mx-auto d-flex align-items-center justify-content-center fw-bold mb-3" style={{ width: '80px', height: '80px', fontSize: '1.8rem' }}>
                {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
              </div>
              <h5 className="fw-bold">{user?.name}</h5>
              <p className="text-muted small">{user?.email}</p>
              <span className="badge bg-success-subtle text-success px-3 py-2">Active Resident</span>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Home className="text-primary" size={24} />
                <h6 className="fw-bold mb-0">My Current Room</h6>
              </div>
              {myRoom ? (
                <div>
                  <h5>Room {myRoom.roomNumber}</h5>
                  <p>Type: {myRoom.type}</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setShowChangeForm(true)}>
                    <RefreshCw size={16} className="me-1" /> Request Room Change
                  </button>
                </div>
              ) : (
                <p className="text-muted">No room allocated yet.</p>
              )}
            </div>

            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <CreditCard className="text-success" size={24} />
                <h6 className="fw-bold mb-0">Fee Status</h6>
              </div>
              {fees.length > 0 ? fees.map(f => (
                <div key={f.id} className="d-flex justify-content-between py-2 border-bottom">
                  <span>Semester {f.semester}</span>
                  <span className={`badge ${f.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                    {f.status.toUpperCase()} - ₹{f.amount}
                  </span>
                </div>
              )) : <p className="text-muted">No fee records found.</p>}
            </div>

            {showChangeForm && (
              <div className="card shadow-sm p-4 mb-4 border-primary">
                <h6 className="fw-bold mb-3">Request Room Change</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Select Building</label>
                    <select className="form-select" value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)}>
                      <option value="">Choose Building</option>
                      {buildings.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label>Select Room</label>
                    <select className="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                      <option value="">Choose Room</option>
                      {availableRooms.map(r => (
                        <option key={r.id} value={r.id}>Room {r.roomNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1" onClick={requestRoomChange}>Submit Request</button>
                  <button className="btn btn-secondary" onClick={() => setShowChangeForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="card shadow-sm p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Building2 className="text-info" size={24} />
                <h6 className="fw-bold mb-0">Hostel Buildings</h6>
              </div>
              <div className="row g-3">
                {buildings.map(b => (
                  <div key={b.id} className="col-md-6">
                    <div className="card border h-100">
                      <div className="card-body">
                        <h6 className="fw-bold">{b.name}</h6>
                        <p className="small text-muted">Block {b.blockId} • {b.floors} Floors</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}