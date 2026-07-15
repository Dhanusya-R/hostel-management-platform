// frontend/src/Components/StudentPortal.jsx
import { useState, useEffect } from 'react';
import { Home, CreditCard, Building2, Clock, Send, LogOut, Eye } from 'lucide-react';

export function StudentPortal({ user, onLogout }) {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requests, setRequests] = useState([]);
  const [fees, setFees] = useState([]);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('token');

  // Fetch Buildings
  useEffect(() => {
    fetch('http://localhost:5000/api/buildings')
      .then(res => res.json())
      .then(data => setBuildings(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Fetch My Requests
  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/requests/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  const fetchFees = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/fees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFees(Array.isArray(data) ? data : []);
      setShowFeeModal(true);
    } catch {
      setMessage({ type: 'danger', text: 'Failed to load fee records' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async () => {
    if (!selectedRoom || !selectedBuilding) return;

    setLoading(true);
    try {
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
        setMessage({ type: 'success', text: '✅ Request sent successfully!' });
        setRequestMessage('');
        setSelectedRoom(null);
        setSelectedBuilding(null);

        const reqRes = await fetch('http://localhost:5000/api/requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newRequests = await reqRes.json();
        setRequests(Array.isArray(newRequests) ? newRequests : []);
      } else {
        setMessage({ type: 'danger', text: 'Failed to send request' });
      }
    } catch {
      setMessage({ type: 'danger', text: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand bg-white border-bottom px-4 py-3 shadow-sm">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold text-primary mb-0">CampusStay</h4>
            <span className="badge bg-primary-subtle text-primary">Student Portal</span>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
            <LogOut size={16} className="me-2" /> Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row g-4">
          {/* Profile Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-5">
                <div 
                  className="rounded-circle bg-primary-subtle text-primary mx-auto d-flex align-items-center justify-content-center mb-4"
                  style={{ width: '110px', height: '110px', fontSize: '2.5rem' }}
                >
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'KA'}
                </div>
                <h4 className="fw-bold">{user?.name || "Kanishka T"}</h4>
                <p className="text-muted mb-3">{user?.email || "kanishka@gmail.com"}</p>
                <span className="badge bg-success-subtle text-success px-4 py-2 fs-6">Active Resident</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-8">
            {/* Status Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <Home size={28} className="text-primary" />
                      <h5 className="mb-0 fw-bold">My Current Room</h5>
                    </div>
                    <h4 className="fw-bold text-muted">No room allocated yet.</h4>
                    <button className="btn btn-primary mt-3" onClick={() => setSelectedBuilding(buildings[0] || null)}>
                      Request a Room →
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <CreditCard size={28} className="text-success" />
                      <h5 className="mb-0 fw-bold">Fee Status</h5>
                    </div>
                    <h4 className="fw-bold text-success">No fee records found.</h4>
                    <button 
                      className="btn btn-outline-success mt-3 d-flex align-items-center gap-2" 
                      onClick={fetchFees}
                    >
                      <Eye size={18} /> View Fee Structure
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buildings */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <Building2 size={24} /> Hostel Buildings
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  {buildings.length > 0 ? buildings.map(b => (
                    <div className="col-md-6 col-lg-4" key={b.id}>
                      <div 
                        className="card h-100 shadow-sm" 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => setSelectedBuilding(b)}
                      >
                        <div className="card-body">
                          <h6 className="fw-bold">{b.name}</h6>
                          <small className="text-muted">Block {b.blockId} • {b.floors} Floors</small>
                        </div>
                      </div>
                    </div>
                  )) : <p className="text-center py-5 text-muted">Loading buildings...</p>}
                </div>
              </div>
            </div>

            {/* Room Request */}
            {selectedBuilding && (
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between">
                  <h5>Request Room in {selectedBuilding.name}</h5>
                  <button className="btn btn-sm btn-outline-secondary" 
                    onClick={() => { setSelectedBuilding(null); setSelectedRoom(null); }}>
                    Close
                  </button>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div className="col-md-3" key={i}>
                        <div 
                          className={`card text-center p-3 border ${selectedRoom?.id === i+1 ? 'border-success bg-success-subtle' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedRoom({ id: i+1, roomNumber: `${selectedBuilding.blockId}-${101+i}` })}
                        >
                          <h6>Room {selectedBuilding.blockId}-{101+i}</h6>
                          <small className="text-success">Available</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedRoom && (
                    <div className="mt-4 p-4 border-top">
                      <h6>Request for Room {selectedRoom.roomNumber}</h6>
                      <textarea 
                        className="form-control mb-3" 
                        rows="3"
                        placeholder="Message to Warden (optional)"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                      />
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={handleRequestSubmit}
                        disabled={loading}
                      >
                        <Send size={18} className="me-2" />
                        {loading ? 'Sending...' : 'Submit Request'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* My Requests */}
            {requests.length > 0 && (
              <div className="card shadow-sm mt-4">
                <div className="card-header">
                  <h5><Clock size={20} className="me-2" /> My Requests</h5>
                </div>
                <div className="card-body">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Building</th>
                        <th>Room</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(r => (
                        <tr key={r.id}>
                          <td>{r.Building?.name || '—'}</td>
                          <td>{r.Room?.roomNumber || '—'}</td>
                          <td>
                            <span className={`badge ${r.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fee Modal */}
      {showFeeModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Fee Structure</h5>
                <button className="btn btn-close" onClick={() => setShowFeeModal(false)}></button>
              </div>
              <div className="modal-body">
                {fees.length > 0 ? (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Semester</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map(fee => (
                        <tr key={fee.id}>
                          <td>{fee.semester}</td>
                          <td>₹{fee.amount}</td>
                          <td>
                            <span className={`badge ${fee.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-5 text-muted">No fee records available.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowFeeModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`alert alert-${message.type} position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow`}>
          {message.text}
        </div>
      )}
    </div>
  );
}