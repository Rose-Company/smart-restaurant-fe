import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ChefHat, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { authApi } from '../serivces/auth.api.ts';

interface LoginPageProps {
  onLogin?: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'manager',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.code === 200 && response.data) {
        // Store token (note: avoid localStorage in artifacts, use state management in production)
        // For production, pass token to parent component via onLogin
        if (onLogin) {
          onLogin(response.data);
        }
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.message || err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      {/* Left Half - Background Image */}
      <div className="hidden lg:flex" style={{ 
        width: '50%',
        position: 'relative',
        flexShrink: 0
      }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1764408182167-043042cb086e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcGxhdGluZyUyMGZvb2QlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2NjY3NDI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Chef plating food"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)' 
        }}></div>
        
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          paddingLeft: '64px', 
          paddingRight: '64px' 
        }}>
          <div style={{ maxWidth: '36rem' }}>
            <div style={{ marginBottom: '24px' }}>
              <ChefHat style={{ width: '48px', height: '48px', color: 'white', opacity: 0.8 }} />
            </div>
            <blockquote style={{ color: 'white' }}>
              <p style={{ 
                fontSize: '24px', 
                marginBottom: '24px', 
                lineHeight: '1.625',
                letterSpacing: '0.0703px'
              }}>
                "RestaurantOS has transformed how we manage our operations. From inventory to customer orders, everything is seamless and efficient."
              </p>
              <footer style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <div style={{ 
                  fontSize: '16px', 
                  lineHeight: '24px', 
                  letterSpacing: '-0.3125px',
                  marginBottom: '4px'
                }}>
                  — Michael Chen
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '20px', 
                  letterSpacing: '-0.1504px' 
                }}>
                  Executive Chef, The Golden Spoon
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Half - Login Form */}
      <div className="w-full lg:flex-1 px-4 py-6 lg:px-8 lg:py-12" style={{ 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        minWidth: 0
      }}>
        <div style={{ width: '100%', maxWidth: '448px' }}>
          {/* Logo */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '8px' 
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#00bc7d', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <ChefHat style={{ width: '28px', height: '28px', color: 'white' }} />
              </div>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 500,
                color: '#101828',
                lineHeight: '32px',
                letterSpacing: '0.0703px'
              }}>
                RestaurantOS
              </span>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 500,
              color: '#101828', 
              marginBottom: '8px',
              lineHeight: '30px',
              letterSpacing: '-0.4492px'
            }}>
              Admin Portal Login
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#4a5565',
              lineHeight: '24px',
              letterSpacing: '-0.3125px'
            }}>
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '24px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }} />
              <p style={{
                fontSize: '14px',
                color: '#991b1b',
                lineHeight: '20px',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Form Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Role Selection */}
            <div>
              <label htmlFor="role" style={{ 
                display: 'block', 
                fontSize: '16px',
                color: '#364153', 
                marginBottom: '8px',
                lineHeight: '24px',
                letterSpacing: '-0.3125px'
              }}>
                Login As
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '48px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  border: '1px solid #d1d5dc',
                  borderRadius: '10px',
                  outline: 'none',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#00bc7d';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5dc';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                fontSize: '16px',
                color: '#364153', 
                marginBottom: '8px',
                lineHeight: '24px',
                letterSpacing: '-0.3125px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@restaurant.com"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '48px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  border: '1px solid #d1d5dc',
                  borderRadius: '10px',
                  outline: 'none',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  cursor: isLoading ? 'not-allowed' : 'text',
                  opacity: isLoading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#00bc7d';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5dc';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '16px',
                color: '#364153', 
                marginBottom: '8px',
                lineHeight: '24px',
                letterSpacing: '-0.3125px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '16px',
                    paddingRight: '48px',
                    border: '1px solid #d1d5dc',
                    borderRadius: '10px',
                    outline: 'none',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    cursor: isLoading ? 'not-allowed' : 'text',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    if (!isLoading) {
                      e.target.style.borderColor = '#00bc7d';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5dc';
                    e.target.style.boxShadow = 'none';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    color: '#4a5565',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.color = '#101828';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4a5565';
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <Eye style={{ width: '20px', height: '20px' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}>
                <input
                  type="checkbox"
                  disabled={isLoading}
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    accentColor: '#00bc7d'
                  }}
                />
                <span style={{ 
                  fontSize: '16px', 
                  color: '#364153',
                  lineHeight: '24px',
                  letterSpacing: '-0.3125px'
                }}>
                  Remember me
                </span>
              </label>
              <button 
                type="button"
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#009966',
                  fontSize: '16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  lineHeight: '24px',
                  letterSpacing: '-0.3125px',
                  textDecoration: 'none',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: isLoading ? '#6ee7b7' : '#00bc7d',
                color: 'white',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 400,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#00a870';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#00bc7d';
              }}
            >
              {isLoading ? 'Signing in...' : 'Access Dashboard'}
            </button>

            {/* Security Note */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              paddingTop: '8px',
              color: '#4a5565'
            }}>
              <Lock style={{ width: '16px', height: '16px' }} />
              <span style={{ 
                fontSize: '14px', 
                lineHeight: '20px',
                letterSpacing: '-0.1504px'
              }}>
                Secured with 256-bit encryption
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid #e5e7eb', 
            textAlign: 'center' 
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#4a5565',
              lineHeight: '20px',
              letterSpacing: '-0.1504px',
              marginBottom: '4px'
            }}>
              Need help accessing your account?{' '}
              <button 
                type="button"
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#009966',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  lineHeight: '24px',
                  letterSpacing: '-0.3125px',
                  textDecoration: 'none',
                  padding: 0,
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}