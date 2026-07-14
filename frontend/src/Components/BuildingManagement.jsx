import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api';

export function BuildingManagement() {
  const [buildings, setBuildings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    blockId: '',
    floors: '',
    wardenName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/buildings')
      .then(res => setBuildings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBuilding) {
        await api.put(`/buildings/${editingBuilding.id}`, formData);
      } else {
        await api.post('/buildings', formData);
      }
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

  if (loading) return <div className="p-4 text-center">Loading buildings...</div>;

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
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

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