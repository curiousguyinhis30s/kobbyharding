import { useState, useEffect } from 'react'
import {
  Users, UserPlus, Search, Edit2, Trash2, Shield, ShieldOff,
  Check, X, Mail, Phone, MapPin, Calendar, Package, Heart,
  Download, Upload, RefreshCw, Eye, EyeOff, Lock, MoreVertical,
  ChevronDown, ChevronUp, AlertTriangle, UserCheck, UserX
} from 'lucide-react'
import { useUserStore, type StoredUser } from '../../stores/useUserStore'

const UserManagement = () => {
  const {
    users,
    getUserStats,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    promoteToAdmin,
    demoteFromAdmin,
    resetPassword,
    exportUsers,
    importUsers
  } = useUserStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedUser, setSelectedUser] = useState<StoredUser | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    phone: ''
  })

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'admin' | 'user'
  })

  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Stats
  const stats = getUserStats()

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // Handle create user
  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      showMessage('error', 'Please fill in all required fields')
      return
    }

    // Hash password before creating user
    const { hashPassword } = await import('../../utils/crypto')
    const passwordHash = await hashPassword(createForm.password)

    const newUser = createUser({
      name: createForm.name,
      email: createForm.email,
      passwordHash,
      role: createForm.role,
      phone: createForm.phone || undefined
    })

    if (newUser) {
      showMessage('success', 'User created successfully')
      setIsCreateModalOpen(false)
      setCreateForm({ name: '', email: '', password: '', role: 'user', phone: '' })
    } else {
      showMessage('error', 'Email already exists')
    }
  }

  // Handle edit user
  const handleEditUser = () => {
    if (!selectedUser) return

    const success = updateUser(selectedUser.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone || undefined,
      role: editForm.role
    })

    if (success) {
      showMessage('success', 'User updated successfully')
      setIsEditModalOpen(false)
      setSelectedUser(null)
    } else {
      showMessage('error', 'Failed to update user')
    }
  }

  // Handle delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return

    const success = deleteUser(selectedUser.id)

    if (success) {
      showMessage('success', 'User deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    } else {
      showMessage('error', 'Cannot delete this user. They may be the last admin.')
    }
  }

  // Handle reset password
  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return

    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters')
      return
    }

    const success = await resetPassword(selectedUser.id, newPassword)

    if (success) {
      showMessage('success', 'Password reset successfully')
      setIsResetPasswordModalOpen(false)
      setSelectedUser(null)
      setNewPassword('')
    } else {
      showMessage('error', 'Failed to reset password')
    }
  }

  // Handle export
  const handleExport = () => {
    const data = exportUsers()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kobys-users-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('success', 'Users exported successfully')
  }

  // Handle import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const result = await importUsers(event.target?.result as string)
      if (result.success) {
        showMessage('success', `Imported ${result.imported} users`)
      } else {
        showMessage('error', result.errors.join(', '))
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  // Open edit modal
  const openEditModal = (user: StoredUser) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    })
    setIsEditModalOpen(true)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '300',
              letterSpacing: '0.05em',
              margin: '0 0 8px 0',
              color: '#000'
            }}>
              User Management
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#666',
              margin: 0
            }}>
              Manage user accounts, permissions, and access control
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <UserPlus size={16} />
              Add User
            </button>

            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              Export
            </button>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              <Upload size={16} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            padding: '12px 20px',
            background: message.type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '13px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} color="#0ea5e9" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '500' }}>{stats.totalUsers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Users</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={20} color="#22c55e" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '500' }}>{stats.activeUsers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Active Users</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#fefce8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={20} color="#eab308" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '500' }}>{stats.adminUsers}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Admin Users</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#fdf4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={20} color="#d946ef" />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '500' }}>{stats.recentSignups}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>New (30 days)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            flex: '1',
            minWidth: '200px'
          }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '13px',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div style={{ fontSize: '13px', color: '#666' }}>
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Users List */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
            padding: '12px 20px',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '11px',
            fontWeight: '500',
            color: '#6b7280',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            <div>User</div>
            <div>Role</div>
            <div>Status</div>
            <div>Joined</div>
            <div style={{ textAlign: 'center' }}>Actions</div>
          </div>

          {/* User Rows */}
          {filteredUsers.map((user) => (
            <div key={user.id}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: user.role === 'admin' ? '#fef3c7' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: user.role === 'admin' ? '#d97706' : '#6b7280'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: user.role === 'admin' ? '#fef3c7' : '#f3f4f6',
                    color: user.role === 'admin' ? '#d97706' : '#6b7280'
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: user.isActive ? '#dcfce7' : '#fee2e2',
                    color: user.isActive ? '#16a34a' : '#dc2626'
                  }}>
                    {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                {/* Joined */}
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  {formatDate(user.joinDate)}
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEditModal(user)}
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit User"
                  >
                    <Edit2 size={14} color="#6b7280" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setIsDeleteModalOpen(true)
                    }}
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete User"
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedUser === user.id && (
                <div style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px'
                  }}>
                    {/* Contact Info */}
                    <div>
                      <h4 style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        color: '#6b7280',
                        marginBottom: '12px'
                      }}>
                        CONTACT INFO
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <Mail size={14} color="#9ca3af" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                            <Phone size={14} color="#9ca3af" />
                            {user.phone}
                          </div>
                        )}
                        {user.address && (
                          <div style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '13px' }}>
                            <MapPin size={14} color="#9ca3af" style={{ marginTop: '2px' }} />
                            <span>
                              {user.address.street}, {user.address.city}<br />
                              {user.address.postalCode}, {user.address.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Activity */}
                    <div>
                      <h4 style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        color: '#6b7280',
                        marginBottom: '12px'
                      }}>
                        ACTIVITY
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <Package size={14} color="#9ca3af" />
                          {user.orders.length} orders (${user.orders.reduce((sum, o) => sum + o.total, 0)} total)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <Heart size={14} color="#9ca3af" />
                          {user.favorites.length} favorites
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <Calendar size={14} color="#9ca3af" />
                          {user.tryOnRequests.length} try-on requests
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        color: '#6b7280',
                        marginBottom: '12px'
                      }}>
                        QUICK ACTIONS
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setIsResetPasswordModalOpen(true)
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            justifyContent: 'flex-start'
                          }}
                        >
                          <Lock size={14} />
                          Reset Password
                        </button>

                        <button
                          onClick={() => {
                            toggleUserStatus(user.id)
                            showMessage('success', `User ${user.isActive ? 'deactivated' : 'activated'}`)
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            justifyContent: 'flex-start'
                          }}
                        >
                          {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          {user.isActive ? 'Deactivate Account' : 'Activate Account'}
                        </button>

                        {user.role === 'user' ? (
                          <button
                            onClick={() => {
                              promoteToAdmin(user.id)
                              showMessage('success', 'User promoted to admin')
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              background: '#fef3c7',
                              border: '1px solid #fcd34d',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              justifyContent: 'flex-start',
                              color: '#92400e'
                            }}
                          >
                            <Shield size={14} />
                            Promote to Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const success = demoteFromAdmin(user.id)
                              if (success) {
                                showMessage('success', 'Admin demoted to user')
                              } else {
                                showMessage('error', 'Cannot demote the last admin')
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              background: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              justifyContent: 'flex-start'
                            }}
                          >
                            <ShieldOff size={14} />
                            Remove Admin Role
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div>
                      <h4 style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        color: '#6b7280',
                        marginBottom: '12px'
                      }}>
                        TIMESTAMPS
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
                        <div>Joined: {formatDate(user.joinDate)}</div>
                        <div>Last Login: {formatDate(user.lastLogin)}</div>
                        <div>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>No users found</p>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {isCreateModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '450px',
              padding: '24px',
              margin: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <UserPlus size={20} />
                Create New User
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Role
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'admin' | 'user' })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    setCreateForm({ name: '', email: '', password: '', role: 'user', phone: '' })
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  style={{
                    padding: '10px 20px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && selectedUser && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '450px',
              padding: '24px',
              margin: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Edit2 size={20} />
                Edit User
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'admin' | 'user' })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSelectedUser(null)
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditUser}
                  style={{
                    padding: '10px 20px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedUser && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              padding: '24px',
              margin: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <AlertTriangle size={28} color="#dc2626" />
              </div>

              <h2 style={{
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Delete User?
              </h2>

              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '24px'
              }}>
                Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedUser(null)
                  }}
                  style={{
                    padding: '10px 24px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  style={{
                    padding: '10px 24px',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Modal */}
        {isResetPasswordModalOpen && selectedUser && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '400px',
              padding: '24px',
              margin: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Lock size={20} />
                Reset Password
              </h2>

              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '20px'
              }}>
                Set a new password for <strong>{selectedUser.name}</strong>
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setIsResetPasswordModalOpen(false)
                    setSelectedUser(null)
                    setNewPassword('')
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  style={{
                    padding: '10px 20px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
