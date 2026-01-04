// Customer Authentication API Service

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    verified: boolean;
  };
  token?: string;
  requiresOTP?: boolean;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

class CustomerAuthAPI {
  private baseURL = '/api/customer/auth';

  // Register new customer
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Mock API call - replace with actual API endpoint
      await this.delay(1500);
      
      // Simulate successful registration
      return {
        success: true,
        message: 'Registration successful. Please verify your email.',
        requiresOTP: true,
        user: {
          id: '123',
          email: data.email,
          name: data.name || '',
          phone: data.phone,
          verified: false
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  // Login customer
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Mock API call
      await this.delay(1000);
      
      return {
        success: true,
        message: 'Login successful',
        user: {
          id: '123',
          email: data.email,
          name: 'John Doe',
          verified: true
        },
        token: 'mock-jwt-token-123'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  }

  // Login with Google
  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      // Mock API call
      await this.delay(1000);
      
      return {
        success: true,
        message: 'Google login successful',
        user: {
          id: '456',
          email: 'user@gmail.com',
          name: 'Google User',
          verified: true
        },
        token: 'mock-jwt-token-google'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Google login failed'
      };
    }
  }

  // Send OTP to email
  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Mock API call
      await this.delay(1000);
      
      return {
        success: true,
        message: 'OTP sent to your email'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(data: OTPVerificationData): Promise<AuthResponse> {
    try {
      // Mock API call
      await this.delay(1000);
      
      // Simulate successful verification
      return {
        success: true,
        message: 'Email verified successfully',
        user: {
          id: '123',
          email: data.email,
          name: 'John Doe',
          verified: true
        },
        token: 'mock-jwt-token-verified'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }
  }

  // Helper delay function for mock API
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const customerAuthAPI = new CustomerAuthAPI();
