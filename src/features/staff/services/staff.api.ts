import { Staff, StaffListResponse, CreateStaffData, UpdateStaffData, StaffRole, StaffStatus } from '../types/staff.types';

const API_BASE = 'http://localhost:8080/api';

export const staffApi = {
  /**
   * Get staff list with filters
   */
  async list(
    role?: StaffRole,
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    status?: StaffStatus
  ): Promise<StaffListResponse> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE}/admin/staff?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch staff list');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Get staff details by ID
   */
  async getById(id: number): Promise<Staff> {
    const response = await fetch(`${API_BASE}/admin/staff/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch staff details');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Create new staff account
   */
  async create(data: CreateStaffData): Promise<Staff> {
    const response = await fetch(`${API_BASE}/admin/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create staff account');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Update staff account
   */
  async update(id: number, data: UpdateStaffData): Promise<Staff> {
    const response = await fetch(`${API_BASE}/admin/staff/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update staff account');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Delete staff account
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/admin/staff/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete staff account');
    }
  },

  /**
   * Toggle staff status (active/inactive)
   */
  async toggleStatus(id: number, status: StaffStatus): Promise<Staff> {
    return this.update(id, { status });
  },
};
