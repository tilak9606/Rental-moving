import React, { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService.js'
import { propertyService } from '../../services/propertyService.js'
import { Users, Home, Eye, Clock, AlertCircle, CheckCircle, XCircle, UserCheck, UserX } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [pendingProperties, setPendingProperties] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingProperties(),
        adminService.getAllUsers()
      ])
      setStats(statsRes.data)
      setPendingProperties(pendingRes.data)
      setUsers(usersRes.data)
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewProperty = async (propertyId, action) => {
    try {
      await adminService.reviewProperty(propertyId, action)
      toast.success(`Property ${action}d`)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to review')
    }
  }

  const handleToggleUser = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId)
      toast.success('User status updated')
      fetchData()
    } catch {
      toast.error('Failed to update user')
    }
  }

  if (loading) return <LoadingSpinner />

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Properties', value: stats?.totalProperties || 0, icon: Home, color: 'bg-rose-50 text-rose-600' },
    { label: 'Published', value: stats?.publishedProperties || 0, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Review', value: stats?.pendingProperties || 0, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Visits', value: stats?.totalVisits || 0, icon: Eye, color: 'bg-purple-50 text-purple-600' },
    { label: 'Open Tickets', value: stats?.openTickets || 0, icon: AlertCircle, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {['overview', 'pending', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'pending' ? 'Pending Properties' : tab}
          </button>
        ))}
      </div>

      {/* Pending Properties */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingProperties.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending properties</p>
            </div>
          ) : (
            pendingProperties.map((property) => (
              <div key={property._id} className="card flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <p className="text-gray-500 text-sm">{property.address}, {property.city}</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Landlord:</span> {property.landlord?.name} ({property.landlord?.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {property.landlord?.phone}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleReviewProperty(property._id, 'approve')}
                      className="btn-primary text-sm bg-emerald-500 hover:bg-emerald-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewProperty(property._id, 'reject')}
                      className="btn-danger text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge capitalize">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${user.isActive ? 'badge-green' : 'badge-gray'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleUser(user._id)}
                      className={`text-sm ${user.isActive ? 'text-red-600 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                    >
                      {user.isActive ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New property listed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Visit request received</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setActiveTab('pending')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-sm">Review Pending Properties</span>
                </div>
                <span className="badge badge-amber">{stats?.pendingProperties || 0}</span>
              </button>
              <button onClick={() => setActiveTab('users')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-sm">Manage Users</span>
                </div>
                <span className="badge badge-blue">{stats?.totalUsers || 0}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard