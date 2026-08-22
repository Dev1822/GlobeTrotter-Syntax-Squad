import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api/adminApi';
import LoadingState from '../../components/LoadingState';
import { Users, Plane, Map, Shield } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers()
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Admin fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingState message="Loading admin dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Shield className="w-8 h-8 text-[#163A3D]" />
        <h1 className="text-3xl font-serif font-bold text-[#202525]">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded shadow-sm border border-[#E5E2E1]">
          <div className="flex items-center space-x-3 text-[#54433A] mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold uppercase text-xs tracking-wider">Total Users</h3>
          </div>
          <p className="text-4xl font-serif font-bold text-[#202525]">{stats?.userCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border border-[#E5E2E1]">
          <div className="flex items-center space-x-3 text-[#54433A] mb-2">
            <Plane className="w-5 h-5" />
            <h3 className="font-semibold uppercase text-xs tracking-wider">Total Trips</h3>
          </div>
          <p className="text-4xl font-serif font-bold text-[#202525]">{stats?.tripCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow-sm border border-[#E5E2E1]">
          <div className="flex items-center space-x-3 text-[#54433A] mb-2">
            <Map className="w-5 h-5" />
            <h3 className="font-semibold uppercase text-xs tracking-wider">Destinations</h3>
          </div>
          <p className="text-4xl font-serif font-bold text-[#202525]">{stats?.destinationCount || 0}</p>
        </div>
      </div>

      <h2 className="text-2xl font-serif font-bold text-[#202525] mb-4">User Management</h2>
      <div className="bg-white rounded border border-[#E5E2E1] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F6F3F2] text-[#54433A] text-xs uppercase tracking-wider">
              <th className="p-4 border-b border-[#E5E2E1]">ID</th>
              <th className="p-4 border-b border-[#E5E2E1]">Name</th>
              <th className="p-4 border-b border-[#E5E2E1]">Email</th>
              <th className="p-4 border-b border-[#E5E2E1]">Joined</th>
              <th className="p-4 border-b border-[#E5E2E1]">Provider</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-[#E5E2E1] last:border-0 hover:bg-[#F6F3F2]/50">
                <td className="p-4 text-xs font-mono text-[#899596]">{user.id}</td>
                <td className="p-4 text-sm font-semibold text-[#202525]">{user.name}</td>
                <td className="p-4 text-sm text-[#54433A]">{user.email}</td>
                <td className="p-4 text-sm text-[#54433A]">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-xs text-[#899596] capitalize">{user.authProvider}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-[#899596] text-sm">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminDashboard;
