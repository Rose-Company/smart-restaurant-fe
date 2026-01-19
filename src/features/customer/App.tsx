import React, { useEffect, useState } from 'react';
import { CustomerMenuPage } from './pages/CustomerMenuPage';
import { CustomerLoginPage } from './pages/auth/CustomerLoginPage';
import { CustomerRegisterPage } from './pages/auth/CustomerRegisterPage';
import { OTPVerificationPage } from './pages/auth/OTPVerificationPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { ReportListPage } from './pages/ReportListPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportsProvider } from './context/ReportsContext';
import { CartProvider } from './context/CartContext';
import { SignupRequest } from './services/auth.api';

type AuthView = 'login' | 'register' | 'otp' | 'menu' | 'account' | 'orders' | 'reports';

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

    console.log('📋 [App.tsx] URL params extracted:', {
      token,
      table,
      searchParams: window.location.search
    });

    setTableToken(token);
    setTableNumber(table);
    
    console.log('📋 [App.tsx] State will be set:', { token, table });
    
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

  const handleRequestOTPSuccess = (data: SignupRequest) => {
    setOtpEmail(data.email);
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
          onRequestOTPSuccess={handleRequestOTPSuccess}
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
      console.log('📋 [App.tsx] Rendering CustomerMenuPage with:', { tableToken, tableNumber });
      return (
        <CustomerMenuPage
          tableToken={tableToken}
          tableNumber={tableNumber}
          onLoginClick={() => setCurrentView('login')}
          onAccountClick={() => setCurrentView('account')}
          onOrdersClick={() => setCurrentView('orders')}
          onReportsClick={() => setCurrentView('reports')}
        />
      );

    case 'account':
      return (
        <CustomerAccountPage
          onBack={() => setCurrentView('menu')}
        />
      );

    case 'orders':
      return (
        <OrderHistoryPage
          onBack={() => setCurrentView('menu')}
        />
      );

    case 'reports':
      return (
        <ReportListPage
          onBack={() => setCurrentView('menu')}
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
      <CartProvider>
        <ReportsProvider>
          <CustomerAppContent />
        </ReportsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

