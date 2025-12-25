import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ChefHat } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface LoginPageProps {
  onLogin?: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'manager',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login:', formData);
    
    // For now, just call onLogin to show the dashboard
    // In production, this should validate credentials first
    if (onLogin) {
      onLogin();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', width: '100%' }}>
      {/* Left Half - Background Image with Overlay */}
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
        
        {/* Dark Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)' 
        }}></div>
        
        {/* Testimonial Quote */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00bc7d';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
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
                required
                style={{
                  width: '100%',
                  height: '48px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  border: '1px solid #d1d5dc',
                  borderRadius: '10px',
                  outline: 'none',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00bc7d';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5dc';
                  e.target.style.boxShadow = 'none';
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
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '16px',
                    paddingRight: '48px',
                    border: '1px solid #d1d5dc',
                    borderRadius: '10px',
                    outline: 'none',
                    fontSize: '16px',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00bc7d';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 188, 125, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5dc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#4a5565',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#101828';
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
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    cursor: 'pointer',
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
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#009966',
                  fontSize: '16px',
                  cursor: 'pointer',
                  lineHeight: '24px',
                  letterSpacing: '-0.3125px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
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
              type="submit"
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#00bc7d',
                color: 'white',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 400,
                cursor: 'pointer',
                boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00a870';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00bc7d';
              }}
            >
              Access Dashboard
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
          </form>

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
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#009966',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  lineHeight: '24px',
                  letterSpacing: '-0.3125px',
                  textDecoration: 'none',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
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
