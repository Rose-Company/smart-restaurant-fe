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

};