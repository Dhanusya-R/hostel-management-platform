// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Building2, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api';

export function Dashboard() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/buildings')
      .then(res => setBuildings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

  const totalBuildings = buildings.length;
  const totalRooms = buildings.reduce((acc, b) => acc + (b.Rooms?.length || 0), 0);
  const occupiedRooms = buildings.reduce((acc, b) => {
    return acc + (b.Rooms?.filter(r => r.status === 'occupied').length || 0);
  }, 0);
  const vacantRooms = totalRooms - occupiedRooms;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-primary-subtle text-primary rounded-3"><Building2 size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">Total Buildings</p>
                <h4 className="fw-bold mb-0 text-dark">{totalBuildings}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-success-subtle text-success rounded-3"><Users size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">Occupied Rooms</p>
                <h4 className="fw-bold mb-0 text-dark">{occupiedRooms} <span className="fs-6 text-muted fw-normal">/ {totalRooms}</span></h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-info-subtle text-info rounded-3"><CheckCircle size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">Vacant Rooms</p>
                <h4 className="fw-bold mb-0 text-dark">{vacantRooms}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-light-subtle p-3">
            <div className="card-body d-flex align-items-center gap-3 p-0">
              <div className="p-3 bg-warning-subtle text-warning rounded-3"><AlertTriangle size={24} /></div>
              <div>
                <p className="small text-muted mb-0 fw-medium">Occupancy Rate</p>
                <h4 className="fw-bold mb-0 text-dark">
                  {totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Building Breakdown Table */}
      <div className="card shadow-sm border-light-subtle overflow-hidden">
        <div className="card-header bg-body-tertiary border-bottom p-3">
          <h6 className="mb-1 fw-bold text-dark">Building Breakdown & Fee Structure</h6>
          <p className="text-muted small mb-0">Real-time room occupancy and costs</p>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-uppercase small text-muted">
              <tr>
                <th className="px-4 py-3 border-0">Building Name</th>
                <th className="px-4 py-3 border-0">Room Type</th>
                <th className="px-4 py-3 border-0" style={{ width: '200px' }}>Rooms Allocation</th>
                <th className="px-4 py-3 border-0">Vacancy Status</th>
                <th className="px-4 py-3 border-0 text-end">Fee / Semester</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => {
                const roomCount = building.Rooms ? building.Rooms.length : 0;
                const occupied = building.Rooms ? building.Rooms.filter(r => r.status === 'occupied').length : 0;
                const percentFull = roomCount > 0 ? Math.round((occupied / roomCount) * 100) : 0;

                return (
                  <tr key={building.id}>
                    <td className="px-4 py-3 fw-semibold text-dark">{building.name}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-light text-dark border px-2 py-1.5 fw-normal">Multiple Types</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex justify-content-between small text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                        <span>{occupied}/{roomCount} Rooms</span>
                        <span>{percentFull}%</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${percentFull > 85 ? 'bg-danger' : 'bg-primary'}`} 
                          role="progressbar" 
                          style={{ width: `${percentFull}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {roomCount - occupied === 0 ? (
                        <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-1.5">Full</span>
                      ) : (
                        <span className="badge rounded-pill bg-success-subtle text-success px-3 py-1.5">
                          {roomCount - occupied} Vacant
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end fw-bold text-secondary">
                      ₹45,000 {/* You can make this dynamic later */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}