import React, { useEffect, useState } from 'react';
import { CustomerMenuPage } from './pages/CustomerMenuPage';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { CustomerRegisterPage } from './pages/auth/CustomerRegisterPage';
import { OTPVerificationPage } from './pages/auth/OTPVerificationPage';
import { AuthProvider, useAuth } from './context/AuthContext';

type AuthView = 'login' | 'register' | 'otp' | 'menu';

function CustomerAppContent() {
  const [currentView, setCurrentView] = useState<AuthView>('menu');
  const [otpEmail, setOtpEmail] = useState('');
  const [tableToken, setTableToken] = useState<string | undefined>();
  const [tableNumber, setTableNumber] = useState<string | undefined>();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    // Get token and table number from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || undefined;
    const table = urlParams.get('table') || undefined;
    
    setTableToken(token);
    setTableNumber(table);

    // If already authenticated, show menu directly
    if (isAuthenticated) {
      setCurrentView('menu');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (user: any) => {
    login(user, '');
    setCurrentView('menu');
  };

  const handleRegisterSuccess = (email: string) => {
    setOtpEmail(email);
    setCurrentView('otp');
  };

  const handleOTPVerifySuccess = () => {
    // After OTP verification, redirect to login
    setCurrentView('login');
  };

  switch (currentView) {
    case 'login':
      return (
        <CustomerLoginPage
          onRegisterClick={() => setCurrentView('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    
    case 'register':
      return (
        <CustomerRegisterPage
          onBack={() => setCurrentView('login')}
          onLoginClick={() => setCurrentView('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    
    case 'otp':
      return (
        <OTPVerificationPage
          email={otpEmail}
          onBack={() => setCurrentView('register')}
          onVerifySuccess={handleOTPVerifySuccess}
        />
      );
    
    case 'menu':
      return (
        <CustomerMenuPage 
          tableToken={tableToken} 
          tableNumber={tableNumber}
          onLoginClick={() => setCurrentView('login')}
        />
      );
    
    default:
      return (
        <CustomerLoginPage
          onRegisterClick={() => setCurrentView('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
  }
}

export function CustomerApp() {
  return (
    <AuthProvider>
      <CustomerAppContent />
    </AuthProvider>
  );
}

