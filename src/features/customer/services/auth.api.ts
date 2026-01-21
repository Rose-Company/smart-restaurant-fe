import { fetcher } from "../../../lib/fetcher";
// Types
export interface SignupRequest {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: "end_user" | "admin";
    verify_token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data?: T;
    error_code?: string;
    error_detail?: string;
    internal?: string;
}

// Auth API functions
export const authCustomerApi = {
    requestOTP: async (email: string): Promise<ApiResponse> => {
        return fetcher<ApiResponse>("/auth/request-signup-otp", {
            method: "POST",
            body: JSON.stringify({ email })
        })
    },

    verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
        const res = await fetcher<ApiResponse>("/auth/validate-signup-otp", {
            method: "POST",
            body: JSON.stringify({ email, otp })
        });
        if (res.code !== 200) {
            throw new Error(res.message || 'OTP không hợp lệ');
        }
        return res;
    },

    signup: async (data: SignupRequest): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>("/user/signup", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
    login: async (data: LoginRequest): Promise<ApiResponse<string>> => {
        return fetcher<ApiResponse<string>>("/user/login", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    loginWithGoogle: async (idToken: string): Promise<ApiResponse<string>> => {
        return fetcher<ApiResponse<string>>("/user/login", {
            method: "POST",
            body: JSON.stringify({ 
                id_token: idToken,
                role: "end_user",
            }),
        });
    },

    // Account management
    updateProfile: async (data: { name?: string; phone?: string }): Promise<ApiResponse> => {
        return fetcher<ApiResponse>("/user/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    requestPasswordResetOTP: async (email: string): Promise<ApiResponse> => {
        return fetcher<ApiResponse>("/auth/request-password-reset-otp", {
            method: "POST",
            body: JSON.stringify({ email })
        });
    },

    verifyPasswordResetOTP: async (email: string, otp: string): Promise<ApiResponse> => {
        const res = await fetcher<ApiResponse>("/auth/validate-password-reset-otp", {
            method: "POST",
            body: JSON.stringify({ email, otp })
        });
        if (res.code !== 200) {
            throw new Error(res.message || 'OTP không hợp lệ');
        }
        return res;
    },

    resetPassword: async (email: string, newPassword: string, resetToken: string): Promise<ApiResponse> => {
        return fetcher<ApiResponse>("/user/reset-password", {
            method: "POST",
            body: JSON.stringify({ 
                email, 
                new_password: newPassword,
                reset_token: resetToken 
            })
        });
    },

    getMe: async (): Promise<ApiResponse<any>> => {
        try {
            const token = localStorage.getItem('customer_token');
            
            if (!token) {
                console.warn('No customer token found');
                return { code: 401, message: 'No token found' };
            }

            console.log('Fetching customer info from /api/me');
            
            const res = await fetch('/api/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 401) {
                console.error('Token expired (401 Unauthorized)');
                localStorage.removeItem('customer_token');
                window.location.href = '/';
                return { code: 401, message: 'Token expired' };
            }

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to fetch user info');
            }

            const data = await res.json();
            console.log('Customer info:', data);
            return data;
        } catch (error) {
            console.error('Error fetching customer info:', error);
            throw error;
        }
    },
};