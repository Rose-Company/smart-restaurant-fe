import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, ChefHat, Shield, Edit, Trash2 } from 'lucide-react';
import { Staff, StaffRole, StaffStatus, UpdateStaffData } from '../types/staff.types';
import { CreateStaffModal } from '../components/CreateStaffModal';
import { EditStaffModal } from '../components/EditStaffModal';

type TabKey = 'all' | 'admin' | 'waiter' | 'kitchen';

// Mock data
const MOCK_STAFF: Staff[] = [
  {
    id: 1,
    name: 'Nguyen Van A',
    email: 'nguyenvana@restaurant.com',
    phone: '+84 123 456 789',
    role: 'admin',
    status: 'active',
    created_at: '2026-01-18T10:00:00Z',
    last_login: '2026-01-20T08:00:00Z'
  },
  {
    id: 2,
    name: 'Tran Thi B',
    email: 'tranthib@restaurant.com',
    phone: '+84 123 456 790',
    role: 'waiter',
    status: 'active',
    created_at: '2026-01-18T10:30:00Z',
    last_login: '2026-01-20T07:55:00Z'
  },
  {
    id: 3,
    name: 'Le Van C',
    email: 'levanc@restaurant.com',
    phone: '+84 123 456 791',
    role: 'kitchen',
    status: 'active',
    created_at: '2026-01-18T11:00:00Z',
    last_login: '2026-01-20T07:50:00Z'
  },
  {
    id: 4,
    name: 'Pham Thi D',
    email: 'phamthid@restaurant.com',
    phone: '+84 123 456 792',
    role: 'waiter',
    status: 'inactive',
    created_at: '2026-01-15T09:00:00Z',
    last_login: '2026-01-18T10:00:00Z'
  },
  {
    id: 5,
    name: 'Hoang Van E',
    email: 'hoangvane@restaurant.com',
    phone: '+84 123 456 793',
    role: 'kitchen',
    status: 'active',
    created_at: '2026-01-19T14:00:00Z',
    last_login: '2026-01-20T07:00:00Z'
  },
  {
    id: 6,
    name: 'Nguyen Thi F',
    email: 'nguyenthif@restaurant.com',
    phone: '+84 123 456 794',
    role: 'waiter',
    status: 'active',
    created_at: '2026-01-20T08:00:00Z',
    last_login: '2026-01-20T08:05:00Z'
  }
];

export function StaffPage() {
  const [allStaff, setAllStaff] = useState<Staff[]>(MOCK_STAFF);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);

  useEffect(() => {
    loadStaff();
  }, [activeTab, searchQuery, allStaff]);

  const loadStaff = () => {
    let filtered = [...allStaff];

    // Filter by role
    if (activeTab !== 'all') {
      filtered = filtered.filter(s => s.role === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.email.toLowerCase().includes(query)
      );
    }

    setStaff(filtered);
  };

  const handleToggleStatus = (id: number, currentStatus: StaffStatus) => {
    const newStatus: StaffStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setAllStaff(prev => prev.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ));
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    setAllStaff(prev => prev.filter(s => s.id !== id));
  };

  const handleCreate = (data: any) => {
    const newStaff: Staff = {
      id: Math.max(...allStaff.map(s => s.id), 0) + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: undefined
    };
    
    setAllStaff(prev => [...prev, newStaff]);
  };

  const handleEdit = (id: number, data: UpdateStaffData) => {
    setAllStaff(prev => prev.map(s => 
      s.id === id ? { ...s, ...data } : s
    ));
  };

  const getRoleBadge = (role: StaffRole) => {
    const config = {
      admin: { label: 'Admin', bg: '#f3e8ff', color: '#7c3aed', icon: Shield },
      waiter: { label: 'Waiter', bg: '#fed7aa', color: '#ea580c', icon: Users },
      kitchen: { label: 'Kitchen', bg: '#bfdbfe', color: '#2563eb', icon: ChefHat }
    };
    const { label, bg, color, icon: Icon } = config[role];
    
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '16px',
        background: bg,
        color: color,
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <Icon size={16} />
        {label}
      </div>
    );
  };

  const getStaffCounts = () => {
    const all = allStaff.length;
    const admins = allStaff.filter(s => s.role === 'admin').length;
    const waiters = allStaff.filter(s => s.role === 'waiter').length;
    const kitchen = allStaff.filter(s => s.role === 'kitchen').length;
    return { all, admins, waiters, kitchen };
  };

  const counts = getStaffCounts();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = () => {
    return '#2c3e50'; // Default green color for all avatars
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    
    const now = new Date();
    const loginDate = new Date(lastLogin);
    const diffMs = now.getTime() - loginDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffMins / 1440)} day${Math.floor(diffMins / 1440) > 1 ? 's' : ''} ago`;
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#f9fafb',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        background: '#2c3e50',
        padding: '32px 40px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 8px 0'
            }}>
              Staff & Users
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}>
              Manage your restaurant team members and access control
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#00bc7d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00a36b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00bc7d';
            }}
          >
            <Plus size={20} />
            Add New Staff
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#ffffff',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00bc7d';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '0'
      }}>
        {/* Tabs */}
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 40px',
          display: 'flex',
          gap: '24px'
        }}>
          {[
            { key: 'all' as TabKey, label: 'All Roles', count: counts.all },
            { key: 'admin' as TabKey, label: 'Admins', count: counts.admins },
            { key: 'waiter' as TabKey, label: 'Waiters', count: counts.waiters },
            { key: 'kitchen' as TabKey, label: 'Kitchen Staff', count: counts.kitchen }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: `3px solid ${activeTab === tab.key ? '#00bc7d' : 'transparent'}`,
                color: activeTab === tab.key ? '#00bc7d' : '#6b7280',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab.label}
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                background: activeTab === tab.key ? '#00bc7d' : '#e5e7eb',
                color: activeTab === tab.key ? '#ffffff' : '#6b7280',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: '#ffffff',
          margin: '24px 40px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb'
                }}>User Info</th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb'
                }}>Role</th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb'
                }}>Status</th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb'
                }}>Last Login</th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  borderBottom: '1px solid #e5e7eb'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '16px'
                  }}>
                    Loading staff members...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '16px'
                  }}>
                    No staff members found
                  </td>
                </tr>
              ) : staff.map((member) => (
                <tr key={member.id} style={{
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: getAvatarColor(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {member.name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {getRoleBadge(member.role)}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <label style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={member.status === 'active'}
                        onChange={() => handleToggleStatus(member.id, member.status)}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: '48px',
                        height: '28px',
                        borderRadius: '14px',
                        background: member.status === 'active' ? '#00bc7d' : '#d1d5db',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          position: 'absolute',
                          top: '3px',
                          left: member.status === 'active' ? '23px' : '3px',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }} />
                      </div>
                      <span style={{
                        marginLeft: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: member.status === 'active' ? '#00bc7d' : '#6b7280'
                      }}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {formatLastLogin(member.last_login)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => setEditStaff(member)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: 'transparent',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#00bc7d';
                          e.currentTarget.style.color = '#00bc7d';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: 'transparent',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          color: '#dc2626',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                          e.currentTarget.style.borderColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = '#fecaca';
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Staff Modal */}
      <CreateStaffModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={!!editStaff}
        staff={editStaff}
        onClose={() => setEditStaff(null)}
        onSubmit={handleEdit}
      />
    </div>
  );
}
