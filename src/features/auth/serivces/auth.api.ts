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
}

// Auth API functions
export const authApi = {
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