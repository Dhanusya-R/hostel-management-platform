import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Home, BedDouble, CreditCard, ClipboardList,
  LogOut, Building2, Menu, Bell, CheckCircle, AlertTriangle,
  IndianRupee, Send, Download, X
} from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../api';

function StudentSidebar({ currentView, setView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'myroom', label: 'My Room', icon: Home },
    { id: 'browse', label: 'Browse Rooms', icon: BedDouble },
    { id: 'fees', label: 'Fee Structure', icon: CreditCard },
    { id: 'requests', label: 'My Requests', icon: ClipboardList },
  ];

  return (
    <div className="bg-dark text-white d-none d-md-flex flex-column position-fixed start-0 top-0 bottom-0" style={{ width: '260px', zIndex: 1030 }}>
      <div className="p-4 border-bottom border-secondary">
        <h5 className="fw-bold text-primary mb-0">CampusStay</h5>
        <small className="text-muted">Student Portal</small>
      </div>

      <div className="nav flex-column nav-pills p-3 flex-grow-1">
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

function StudentNavbar({ user, onLogout }) {
  const displayName = user?.name || 'Student';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <nav className="navbar navbar-expand bg-white border-bottom position-fixed top-0 end-0 px-4" style={{ left: '260px', height: '64px', zIndex: 1020 }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <button className="btn d-md-none p-0 border-0 me-2">
            <Menu size={24} />
          </button>
          <span className="mb-0 h1 fs-6 text-secondary fw-semibold">Student Portal</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button className="btn p-1 position-relative text-muted border-0">
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>
          <div className="vr text-muted my-2 mx-1"></div>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px' }}>
              {initials}
            </div>
            <span className="small fw-medium text-dark d-none d-sm-inline-block">{displayName}</span>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
            <LogOut size={14} className="me-1" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function StudentDashboard({ studentProfile }) {
  const [stats, setStats] = useState({ totalBuildings: 0, totalRooms: 0, availableRooms: 0, myRequests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [buildingsRes, roomsRes, requestsRes] = await Promise.all([
          fetch('http://localhost:5000/api/buildings', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/rooms', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/requests/my', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const buildings = await buildingsRes.json();
        const rooms = await roomsRes.json();
        const requests = await requestsRes.json();

        setStats({
          totalBuildings: Array.isArray(buildings) ? buildings.length : 0,
          totalRooms: Array.isArray(rooms) ? rooms.length : 0,
          availableRooms: Array.isArray(rooms) ? rooms.filter(r => r.status === 'available').length : 0,
          myRequests: Array.isArray(requests) ? requests.length : 0
        });
      } catch (e) { void e; } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

  const hasRoom = studentProfile?.Room != null;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-primary-subtle text-primary rounded-3"><Home size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">My Room</p>
                <h5 className="fw-bold mb-0 text-dark">{hasRoom ? studentProfile.Room.roomNumber : 'Not Allocated'}</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-success-subtle text-success rounded-3"><Building2 size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">Buildings</p>
                <h4 className="fw-bold mb-0 text-dark">{stats.totalBuildings}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-info-subtle text-info rounded-3"><CheckCircle size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">Available Rooms</p>
                <h4 className="fw-bold mb-0 text-dark">{stats.availableRooms}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-warning-subtle text-warning rounded-3"><ClipboardList size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">My Requests</p>
                <h4 className="fw-bold mb-0 text-dark">{stats.myRequests}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hasRoom && (
        <div className="card shadow-sm border-light-subtle">
          <div className="card-body text-center p-5">
            <BedDouble size={48} className="text-muted mb-3" />
            <h5 className="fw-bold text-dark">No Room Allocated Yet</h5>
            <p className="text-muted mb-3">Browse available rooms and submit a booking request to get started.</p>
          </div>
        </div>
      )}

      {hasRoom && (
        <div className="card shadow-sm border-light-subtle">
          <div className="card-header bg-white py-3">
            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <Home size={20} className="text-primary" /> Current Room Details
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3"><strong>Room Number:</strong><br />{studentProfile.Room.roomNumber}</div>
              <div className="col-md-3"><strong>Type:</strong><br />{studentProfile.Room.type}</div>
              <div className="col-md-3"><strong>Building:</strong><br />{studentProfile.Room.Building?.name || '—'}</div>
              <div className="col-md-3"><strong>Block:</strong><br />{studentProfile.Room.Building?.blockId || '—'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MyRoom({ studentProfile }) {
  const hasRoom = studentProfile?.Room != null;

  if (!hasRoom) {
    return (
      <div className="card shadow-sm border-light-subtle mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body text-center p-5">
          <BedDouble size={64} className="text-muted mb-3" />
          <h4 className="fw-bold text-dark">No Room Allocated</h4>
          <p className="text-muted">You haven't been allocated a room yet. Browse available rooms to submit a request.</p>
        </div>
      </div>
    );
  }

  const room = studentProfile.Room;
  const building = room.Building;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card shadow-sm border-light-subtle">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <Home size={22} className="text-primary" /> My Room Details
          </h5>
        </div>
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 bg-light rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <BedDouble size={24} />
                  </div>
                  <div>
                    <small className="text-muted">Room Number</small>
                    <h4 className="fw-bold mb-0">{room.roomNumber}</h4>
                  </div>
                </div>
                <div className="row g-3 mt-2">
                  <div className="col-6">
                    <small className="text-muted d-block">Type</small>
                    <span className="badge bg-primary-subtle text-primary px-3 py-2">{room.type}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Capacity</small>
                    <span className="fw-bold">{room.capacity} beds</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Status</small>
                    <span className={`badge px-3 py-2 ${room.status === 'available' ? 'bg-success' : room.status === 'occupied' ? 'bg-warning' : 'bg-secondary'}`}>
                      {room.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-light rounded-3 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <small className="text-muted">Building</small>
                    <h4 className="fw-bold mb-0">{building?.name || '—'}</h4>
                  </div>
                </div>
                <div className="row g-3 mt-2">
                  <div className="col-6">
                    <small className="text-muted d-block">Block ID</small>
                    <span className="fw-bold">{building?.blockId || '—'}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Floors</small>
                    <span className="fw-bold">{building?.floors || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowseRooms({ onSubmitRequest }) {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    api.get('/buildings')
      .then(res => setBuildings(Array.isArray(res.data) ? res.data : []))
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, []);

  const handleBuildingSelect = async (building) => {
    setSelectedBuilding(building);
    setSelectedRoom(null);
    setRoomsLoading(true);
    try {
      const res = await api.get(`/rooms/building/${building.id}`);
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (e) { void e; setRooms([]); } finally {
      setRoomsLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedRoom || !selectedBuilding) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          buildingId: selectedBuilding.id,
          message: requestMessage || `Request for Room ${selectedRoom.roomNumber}`
        })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Room request submitted successfully!' });
        setSelectedRoom(null);
        setRequestMessage('');
        const res2 = await api.get(`/rooms/building/${selectedBuilding.id}`);
        setRooms(Array.isArray(res2.data) ? res2.data : []);
        if (onSubmitRequest) onSubmitRequest();
      } else {
        setMessage({ type: 'danger', text: 'Failed to submit request' });
      }
    } catch (e) { void e; setMessage({ type: 'danger', text: 'Server error. Please try again.' }); } finally {
      setSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (filterType === 'all') return true;
    return r.status === filterType;
  });

  if (loading) return <div className="p-4 text-center">Loading buildings...</div>;

  return (
    <div className="d-flex flex-column gap-4">
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="card shadow-sm border-light-subtle">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <Building2 size={22} className="text-primary" /> Select a Building
          </h5>
          <small className="text-muted">Choose a hostel building to view available rooms</small>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {buildings.length > 0 ? buildings.map(b => (
              <div className="col-md-4 col-lg-3" key={b.id}>
                <div
                  className={`card h-100 shadow-sm ${selectedBuilding?.id === b.id ? 'border-primary border-2' : ''}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => handleBuildingSelect(b)}
                >
                  <div className="card-body text-center p-4">
                    <Building2 size={32} className={`mb-2 ${selectedBuilding?.id === b.id ? 'text-primary' : 'text-muted'}`} />
                    <h6 className="fw-bold mb-1">{b.name}</h6>
                    <small className="text-muted">Block {b.blockId} &bull; {b.floors} Floors</small>
                    {b.Rooms && (
                      <div className="mt-2">
                        <span className="badge bg-success-subtle text-success">
                          {b.Rooms.filter(r => r.status === 'available').length} Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center py-5 text-muted">No buildings found.</p>
            )}
          </div>
        </div>
      </div>

      {selectedBuilding && (
        <div className="card shadow-sm border-light-subtle">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">Rooms in {selectedBuilding.name}</h5>
              <small className="text-muted">Block {selectedBuilding.blockId} &bull; {rooms.length} rooms total</small>
            </div>
            <div className="d-flex gap-2">
              {['all', 'available', 'occupied', 'maintenance'].map(type => (
                <button
                  key={type}
                  className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body">
            {roomsLoading ? (
              <div className="text-center py-5">Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-5 text-muted">No rooms match the selected filter.</div>
            ) : (
              <div className="row g-3">
                {filteredRooms.map(room => (
                  <div className="col-md-4 col-lg-3 col-xl-2" key={room.id}>
                    <div
                      className={`card text-center p-3 border-2 ${
                        selectedRoom?.id === room.id
                          ? 'border-success bg-success-subtle'
                          : room.status === 'available'
                            ? 'border-success-subtle'
                            : room.status === 'occupied'
                              ? 'border-danger-subtle'
                              : 'border-warning-subtle'
                      }`}
                      style={{
                        cursor: room.status === 'available' ? 'pointer' : 'not-allowed',
                        opacity: room.status === 'available' ? 1 : 0.7,
                        transition: 'all 0.2s'
                      }}
                      onClick={() => room.status === 'available' && setSelectedRoom(room)}
                    >
                      <BedDouble
                        size={24}
                        className={`mx-auto mb-2 ${
                          room.status === 'available' ? 'text-success' : room.status === 'occupied' ? 'text-danger' : 'text-warning'
                        }`}
                      />
                      <h6 className="fw-bold mb-1">{room.roomNumber}</h6>
                      <small className="text-muted d-block">{room.type} &bull; {room.capacity} beds</small>
                      <span className={`badge mt-2 ${
                        room.status === 'available' ? 'bg-success-subtle text-success'
                          : room.status === 'occupied' ? 'bg-danger-subtle text-danger'
                            : 'bg-warning-subtle text-warning'
                      }`}>
                        {room.status}
                      </span>
                      {room.Students && room.Students.length > 0 && room.status === 'occupied' && (
                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                          {room.Students.map(s => s.name).join(', ')}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedRoom && (
        <div className="card shadow-sm border-success border-2">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="fw-bold mb-1">Room {selectedRoom.roomNumber}</h5>
                <small className="text-muted">
                  {selectedRoom.type} &bull; {selectedRoom.capacity} beds &bull; {selectedBuilding.name}
                </small>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedRoom(null)}>
                <X size={16} />
              </button>
            </div>
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Message to Warden (optional)"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <button
              className="btn btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
              onClick={handleSubmitRequest}
              disabled={submitting}
            >
              <Send size={18} />
              {submitting ? 'Submitting...' : 'Submit Room Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeeStructure() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/fees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setFees(Array.isArray(data) ? data : []);
      } catch (e) { void e; } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const totalAmount = fees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const paidAmount = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  const downloadReceipt = (fee) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('CampusStay - Fee Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Semester: ${fee.semester}`, 20, 40);
    doc.text(`Amount: Rs.${fee.amount}`, 20, 50);
    doc.text(`Status: ${fee.status}`, 20, 60);
    doc.text(`Date: ${new Date(fee.createdAt).toLocaleDateString()}`, 20, 70);
    doc.save(`CampusStay_Receipt_${fee.semester}.pdf`);
  };

  if (loading) return <div className="p-4 text-center">Loading fee records...</div>;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-light-subtle p-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-primary-subtle text-primary rounded-3"><IndianRupee size={24} /></div>
              <div>
                <small className="text-muted">Total Fees</small>
                <h4 className="fw-bold mb-0">Rs.{totalAmount.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-light-subtle p-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-success-subtle text-success rounded-3"><CheckCircle size={24} /></div>
              <div>
                <small className="text-muted">Paid</small>
                <h4 className="fw-bold mb-0 text-success">Rs.{paidAmount.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-light-subtle p-4 h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-warning-subtle text-warning rounded-3"><AlertTriangle size={24} /></div>
              <div>
                <small className="text-muted">Pending</small>
                <h4 className="fw-bold mb-0 text-warning">Rs.{pendingAmount.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-light-subtle">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
            <CreditCard size={22} className="text-primary" /> Fee Records
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-end">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {fees.length > 0 ? fees.map(fee => (
                <tr key={fee.id}>
                  <td className="px-4 py-3 fw-semibold">{fee.semester}</td>
                  <td className="px-4 py-3 fw-bold">Rs.{fee.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`badge px-3 py-2 ${fee.status === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {fee.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(fee.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-end">
                    {fee.status === 'paid' && (
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={() => downloadReceipt(fee)}>
                        <Download size={14} /> Receipt
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No fee records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (e) { void e; } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading requests...</div>;

  return (
    <div className="card shadow-sm border-light-subtle">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <ClipboardList size={22} className="text-primary" /> My Room Requests
        </h5>
        <small className="text-muted">Track the status of your room allocation requests</small>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="px-4 py-3">Building</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map(r => (
              <tr key={r.id}>
                <td className="px-4 py-3 fw-semibold">{r.Building?.name || '—'}</td>
                <td className="px-4 py-3">{r.Room?.roomNumber || '—'}</td>
                <td className="px-4 py-3 text-muted">{r.message || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`badge px-3 py-2 ${
                    r.status === 'approved' ? 'bg-success-subtle text-success'
                      : r.status === 'rejected' ? 'bg-danger-subtle text-danger'
                        : 'bg-warning-subtle text-warning'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">No requests yet. Browse rooms to submit a request.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StudentPortal({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [studentProfile, setStudentProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/me');
      setStudentProfile(res.data);
    } catch (e) { void e; } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get('/students/me');
        if (!cancelled) setStudentProfile(res.data);
      } catch (e) { void e; } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const view = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard studentProfile={studentProfile} />;
      case 'myroom':
        return <MyRoom studentProfile={studentProfile} />;
      case 'browse':
        return <BrowseRooms onSubmitRequest={fetchProfile} />;
      case 'fees':
        return <FeeStructure />;
      case 'requests':
        return <MyRequests />;
      default:
        return <StudentDashboard studentProfile={studentProfile} />;
    }
  }, [currentView, studentProfile]);

  return (
    <div className="min-vh-100 bg-light">
      <StudentSidebar currentView={currentView} setView={setCurrentView} />
      <div style={{ paddingLeft: '260px' }} className="d-flex flex-column min-vh-100">
        <StudentNavbar user={user} onLogout={onLogout} setView={setCurrentView} />
        <main className="container-fluid p-4" style={{ marginTop: '64px', maxWidth: '1300px' }}>
          {loadingProfile ? (
            <div className="text-center py-5">Loading...</div>
          ) : !studentProfile ? (
            <div className="card shadow-sm border-light-subtle mx-auto mt-5" style={{ maxWidth: '500px' }}>
              <div className="card-body text-center p-5">
                <Building2 size={48} className="text-warning mb-3" />
                <h4 className="fw-bold text-dark">Profile Not Found</h4>
                <p className="text-muted">Your student profile hasn't been created yet. Please contact the hostel admin to register you in the system.</p>
                <button className="btn btn-outline-danger mt-2" onClick={onLogout}>Logout</button>
              </div>
            </div>
          ) : (
            view
          )}
        </main>
      </div>
    </div>
  );
}
