import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api';

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
    if (!window.confirm('Are you sure you want to delete this student?')) return;
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

      {showForm && (
        <div className="p-4 border-bottom bg-light">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label>Student ID</label>
                <input type="text" name="studentId" className="form-control" value={formData.studentId} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label>Full Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label>Department</label>
                <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {editingStudent ? 'Update Student' : 'Register Student'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

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