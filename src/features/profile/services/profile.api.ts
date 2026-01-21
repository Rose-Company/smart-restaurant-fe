export interface UserInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role_id: string;
  role_name: string;
}

export interface UserInfoResponse {
  code: number;
  data: UserInfo;
  message: string;
}

export const profileApi = {

  getMe: async (token?: string): Promise<UserInfo | null> => {
    try {
      const authToken = token || 
                        localStorage.getItem('customer_token') || 
                        localStorage.getItem('admin_auth_token') || '';

      if (!authToken) {
        console.warn('[profileApi.getMe] No token found');
        return null;
      }

      console.log('📤 Fetching user info from /api/me');

      const res = await fetch(`/api/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      // Check for 401 Unauthorized (token expired)
      if (res.status === 401) {
        console.error('❌ Token expired (401 Unauthorized)');
        // Clear tokens from localStorage
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('customer_token');
        // Redirect to login page
        window.location.href = '/';
        return null;
      }

      if (!res.ok) {
        console.error('❌ Failed to get user info:', res.status);
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        return null;
      }

      const response: UserInfoResponse = await res.json();
      console.log('✅ User info fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user info:', error);
      return null;
    }
  }
};
