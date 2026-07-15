// src/components/Modules.jsx
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, IndianRupee, Download, FileText } from 'lucide-react';
import api from '../api';

export function BuildingManagement() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    blockId: '',
    floors: '',
    wardenName: ''
  });

  // Fetch Buildings
  useEffect(() => {
    api.get('/buildings')
      .then(res => setBuildings(res.data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update Building
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBuilding) {
        await api.put(`/buildings/${editingBuilding.id}`, formData);
      } else {
        await api.post('/buildings', formData);
      }

      // Refresh list
      const res = await api.get('/buildings');
      setBuildings(res.data);

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save building');
    }
  };

  const handleEdit = (building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      blockId: building.blockId,
      floors: building.floors,
      wardenName: building.wardenName || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this building?')) return;
    try {
      await api.delete(`/buildings/${id}`);
      setBuildings(buildings.filter(b => b.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete building');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', blockId: '', floors: '', wardenName: '' });
    setEditingBuilding(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="card shadow-sm border-light-subtle">
      <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center border-bottom">
        <div>
          <h5 className="mb-0 fw-bold text-dark">Building Management</h5>
          <small className="text-muted">Register and monitor college hostel blocks</small>
        </div>
        <button 
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          <Plus size={16} /> Add New Building
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-4 border-bottom bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Building Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Block ID</label>
                <input type="text" name="blockId" className="form-control" value={formData.blockId} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Floors</label>
                <input type="number" name="floors" className="form-control" value={formData.floors} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Warden Name</label>
                <input type="text" name="wardenName" className="form-control" value={formData.wardenName} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {editingBuilding ? 'Update Building' : 'Add Building'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Buildings Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Block ID</th>
              <th className="px-4 py-3">Building Name</th>
              <th className="px-4 py-3">Floors</th>
              <th className="px-4 py-3">Warden Name</th>
              <th className="px-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map(b => (
              <tr key={b.id}>
                <td className="px-4 py-3 fw-bold">{b.blockId}</td>
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3">{b.floors}</td>
                <td className="px-4 py-3">{b.wardenName}</td>
                <td className="px-4 py-3 text-end">
                  <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleEdit(b)}>
                    <Edit size={16} />
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(b.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FloorRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    capacity: '',
    buildingId: ''
  });

  useEffect(() => {
    api.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, formData);
      } else {
        await api.post('/rooms', formData);
      }
      const res = await api.get('/rooms');
      setRooms(res.data);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      buildingId: room.buildingId
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete room');
    }
  };

  const resetForm = () => {
    setFormData({ roomNumber: '', type: '', capacity: '', buildingId: '' });
    setEditingRoom(null);
    setShowForm(false);
  };

  return (
    <div className="card shadow-sm border-light-subtle">
      <div className="card-header bg-white p-3 d-flex justify-content-between">
        <h5>Floor & Room Management</h5>
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={16} /> Add Room
        </button>
      </div>

      {showForm && (
        <div className="p-4 border-bottom bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label>Room Number</label>
                <input type="text" name="roomNumber" className="form-control" value={formData.roomNumber} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Type</label>
                <input type="text" name="type" className="form-control" value={formData.type} onChange={handleChange} placeholder="Triple/Double/Single" required />
              </div>
              <div className="col-md-6">
                <label>Capacity</label>
                <input type="number" name="capacity" className="form-control" value={formData.capacity} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label>Building ID</label>
                <input type="number" name="buildingId" className="form-control" value={formData.buildingId} onChange={handleChange} required />
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-success me-2">
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id}>
                <td>{r.roomNumber}</td>
                <td>{r.type}</td>
                <td>{r.capacity}</td>
                <td>{r.status}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(r)}><Edit size={16} /></button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    department: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch Students
  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, formData);
      } else {
        await api.post('/students', formData);
      }

      const res = await api.get('/students');
      setStudents(res.data);
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      department: student.department || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete student');
    }
  };

  const resetForm = () => {
    setFormData({ studentId: '', name: '', department: '' });
    setEditingStudent(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4 text-center">Loading students...</div>;

  return (
    <div className="card shadow-sm border-light-subtle">
      <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center border-bottom">
        <div>
          <h5 className="mb-0 fw-bold text-dark">Student Management</h5>
          <small className="text-muted">Manage active hostellers and registration forms</small>
        </div>
        <button 
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          <Plus size={16} /> Register Student
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-4 border-bottom bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label>Student ID</label>
                <input 
                  type="text" 
                  name="studentId" 
                  className="form-control" 
                  value={formData.studentId} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="col-md-4">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="col-md-4">
                <label>Department</label>
                <input 
                  type="text" 
                  name="department" 
                  className="form-control" 
                  value={formData.department} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {editingStudent ? 'Update Student' : 'Register Student'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 fw-semibold text-secondary">{student.studentId}</td>
                <td className="px-4 py-3 fw-bold text-dark">{student.name}</td>
                <td className="px-4 py-3 text-muted">{student.department}</td>
                <td className="px-4 py-3">
                  {student.Room ? student.Room.roomNumber : 'Not Allocated'}
                </td>
                <td className="px-4 py-3 text-end">
                  <button 
                    className="btn btn-outline-secondary btn-sm me-2" 
                    onClick={() => handleEdit(student)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={() => handleDelete(student.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RoomAllocation() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/rooms')
    ]).then(([studentsRes, roomsRes]) => {
      setStudents(studentsRes.data);
      setRooms(roomsRes.data.filter(r => r.status === 'available'));
      setLoading(false);
    }).catch(err => console.error(err));
  }, []);

  const handleAllocate = async () => {
    if (!selectedStudent || !selectedRoom) {
      alert('Please select both student and room');
      return;
    }

    try {
      await api.post('/allocations', {
        studentId: selectedStudent,
        roomId: selectedRoom
      });

      alert('Room allocated successfully!');
      // Refresh lists
      const [studentsRes, roomsRes] = await Promise.all([
        api.get('/students'),
        api.get('/rooms')
      ]);
      setStudents(studentsRes.data);
      setRooms(roomsRes.data.filter(r => r.status === 'available'));
      setSelectedStudent('');
      setSelectedRoom('');
    } catch (error) {
      console.error(error);
      alert('Allocation failed');
    }
  };

  if (loading) return <p>Loading allocation data...</p>;

  return (
    <div className="card shadow-sm border-light-subtle mx-auto" style={{ maxWidth: '650px' }}>
      <div className="card-header bg-white p-3 border-bottom">
        <h5 className="mb-0 fw-bold text-dark">New Room Allocation</h5>
        <small className="text-muted">Assign vacant rooms to students</small>
      </div>

      <div className="card-body p-4">
        <div className="mb-3">
          <label className="form-label">Select Student</label>
          <select 
            className="form-select" 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Select Student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.studentId} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Select Available Room</label>
          <select 
            className="form-select" 
            value={selectedRoom} 
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="">-- Select Room --</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} ({r.type}) - Capacity: {r.capacity}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="btn btn-primary w-100 py-3 fw-medium" 
          onClick={handleAllocate}
        >
          Allocate Room
        </button>
      </div>
    </div>
  );
}

export function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    semester: '',
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('token');

  const fetchFees = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/fees/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch fees:', error);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []); // Empty array - runs only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFee 
        ? `http://localhost:5000/api/fees/${editingFee.id}`
        : 'http://localhost:5000/api/fees';
      
      const method = editingFee ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ 
          type: 'success', 
          text: editingFee ? 'Fee updated successfully!' : 'Fee added successfully!' 
        });
        setShowForm(false);
        setEditingFee(null);
        setFormData({ studentId: '', amount: '', semester: '', status: 'pending' });
        fetchFees();
      } else {
        setMessage({ type: 'danger', text: 'Failed to save fee' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Server error occurred' });
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      studentId: fee.studentId,
      amount: fee.amount,
      semester: fee.semester,
      status: fee.status
    });
    setShowForm(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/fees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Status updated successfully!' });
        fetchFees();
      } else {
        setMessage({ type: 'danger', text: 'Failed to update status' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Server error' });
    }
  };

  const filteredFees = fees.filter(fee =>
    (fee.Student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fee.semester || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card shadow-sm border-light-subtle">
      <div className="card-header bg-white p-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 fw-bold">Fee Collection Registry</h5>
          <small className="text-muted">Track semester billings and payments</small>
        </div>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            style={{ width: '280px' }}
            placeholder="Search student or semester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="btn btn-primary d-flex align-items-center gap-1" 
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Collect Offline Fee
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} mx-3 mt-3`}>{message.text}</div>
      )}

      {showForm && (
        <div className="card-body border-bottom bg-light p-4">
          <h6 className="mb-3">{editingFee ? 'Edit Fee Record' : 'New Fee Entry'}</h6>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Student ID</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.studentId} 
                onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Amount (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Semester</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.semester} 
                onChange={(e) => setFormData({...formData, semester: e.target.value})} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select 
                className="form-select" 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="col-12 mt-2">
              <button type="submit" className="btn btn-success me-2">
                {editingFee ? 'Update Fee' : 'Add Fee'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingFee(null);
                  setFormData({ studentId: '', amount: '', semester: '', status: 'pending' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Student</th>
              <th>Amount</th>
              <th>Semester</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length > 0 ? filteredFees.map(fee => (
              <tr key={fee.id}>
                <td className="fw-medium">{fee.Student?.name || fee.studentId}</td>
                <td className="fw-bold">₹{fee.amount}</td>
                <td>{fee.semester}</td>
                <td>
                  <select 
                    className={`form-select form-select-sm w-32 ${fee.status === 'paid' ? 'text-success' : 'text-warning'}`}
                    value={fee.status}
                    onChange={(e) => handleStatusChange(fee.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(fee)}>
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  No fee records found. Add a new fee above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Reports() {
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    totalStudents: 0,
    pendingFees: 0,
    buildings: [],
    students: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsRes, roomsRes, studentsRes, feesRes] = await Promise.all([
          api.get('/buildings'),
          api.get('/rooms'),
          api.get('/students'),
          api.get('/fees')
        ]);

        setStats({
          totalBuildings: buildingsRes.data.length,
          totalRooms: roomsRes.data.length,
          occupiedRooms: roomsRes.data.filter(r => r.status === 'occupied').length,
          totalStudents: studentsRes.data.length,
          pendingFees: feesRes.data.filter(f => f.status === 'pending').length,
          buildings: buildingsRes.data,
          students: studentsRes.data
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("CampusStay - Hostel Management Report", 20, 20);

    doc.setFontSize(14);
    doc.text("Summary", 20, 40);
    doc.setFontSize(12);
    doc.text(`Total Buildings: ${stats.totalBuildings}`, 20, 50);
    doc.text(`Total Rooms: ${stats.totalRooms}`, 20, 60);
    doc.text(`Occupied Rooms: ${stats.occupiedRooms}`, 20, 70);
    doc.text(`Occupancy Rate: ${stats.totalRooms ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%`, 20, 80);
    doc.text(`Total Students: ${stats.totalStudents}`, 20, 90);
    doc.text(`Pending Fees: ${stats.pendingFees}`, 20, 100);

    // Buildings List
    doc.setFontSize(14);
    doc.text("Buildings List", 20, 120);
    doc.setFontSize(11);
    stats.buildings.forEach((b, i) => {
      doc.text(`${b.blockId} - ${b.name} (${b.floors} floors)`, 20, 130 + i * 10);
    });

    doc.save("CampusStay_Hostel_Report.pdf");
  };

  const exportCSV = () => {
    let csv = "Block ID,Building Name,Floors,Warden Name\n";
    stats.buildings.forEach(b => {
      csv += `${b.blockId},${b.name},${b.floors},${b.wardenName || 'N/A'}\n`;
    });

    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.download = "CampusStay_Buildings_Report.csv";
    link.click();
  };

  if (loading) return <div className="p-4 text-center">Generating Reports...</div>;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm border-light-subtle p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0">Occupancy Insights</h6>
              <FileText className="text-primary" size={22} />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Buildings</span>
                <strong>{stats.totalBuildings}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Rooms</span>
                <strong>{stats.totalRooms}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Occupied Rooms</span>
                <strong>{stats.occupiedRooms}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Occupancy Rate</span>
                <strong>{stats.totalRooms ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%</strong>
              </div>
            </div>

            <button 
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 w-100"
              onClick={downloadPDF}
            >
              <Download size={14} /> Download PDF Summary
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-light-subtle p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0">Financial Revenue</h6>
              <FileText className="text-success" size={22} />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Students</span>
                <strong>{stats.totalStudents}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Pending Fees</span>
                <strong className="text-danger">{stats.pendingFees}</strong>
              </div>
            </div>

            <button 
              className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 w-100"
              onClick={exportCSV}
            >
              <Download size={14} /> Export CSV Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}