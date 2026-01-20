import React, { useState, useEffect } from 'react';
import { Sidebar, type SidebarPageKey } from '../components/layout/Sidebar';
import { TablesPage } from '../features/tables/pages/TablesPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { MenuPage } from '../features/menu/pages/MenuPage';
import { KitchenDisplayPage } from '../features/kitchen/pages/KitchenDisplayPage';
import { WaiterTaskFeedPage } from '../features/waiter/pages/WaiterTaskFeedPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { StaffPage } from '../features/staff/pages/StaffPage';
import { MyProfilePage } from '../features/profile/pages/MyProfilePage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { CustomerApp } from '../features/customer/App';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('admin_auth_token') ? true : false;
  });
  const [currentPage, setCurrentPage] = useState<SidebarPageKey>(() => {
    // Get page from URL pathname
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Extract page from path (e.g., /admin/kitchen -> 'kitchen')
    const pageFromUrl = pathSegments[pathSegments.length - 1] as SidebarPageKey;
    
    // List of valid pages
    const validPages: SidebarPageKey[] = ['dashboard', 'tables', 'menu', 'kitchen', 'waiter', 'customers', 'staff', 'qr-codes', 'analytics', 'reports', 'settings', 'profile'];
    
    return validPages.includes(pageFromUrl) ? pageFromUrl : 'tables';
  });
  const [isCustomerRoute, setIsCustomerRoute] = useState(false);

  // Check if current route is customer route
  useEffect(() => {
    const path = window.location.pathname;
    const isCustomer = path.startsWith('/customer') || path.startsWith('/menu');
    setIsCustomerRoute(isCustomer);
  }, []);

  // Handle browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const pathSegments = path.split('/').filter(Boolean);
      const pageFromUrl = pathSegments[pathSegments.length - 1] as SidebarPageKey;
      const validPages: SidebarPageKey[] = ['dashboard', 'tables', 'menu', 'kitchen', 'waiter', 'customers', 'qr-codes', 'analytics', 'reports', 'settings', 'profile'];
      
      if (validPages.includes(pageFromUrl)) {
        setCurrentPage(pageFromUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle login - store token and set authenticated
  const handleLogin = (token: string) => {
    localStorage.setItem('admin_auth_token', token);
    setIsAuthenticated(true);
  };

  // Handle logout - clear token and reset state
  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    setIsAuthenticated(false);
    setCurrentPage('tables');
    window.history.pushState({}, '', '/admin/tables');
  };

  // Save currentPage to URL and state whenever it changes
  const handlePageChange = (page: SidebarPageKey) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/admin/${page}`);
  };

  // Render customer app if on customer route
  if (isCustomerRoute) {
    return <CustomerApp />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tables':
        return <TablesPage />;
      case 'menu':
        return <MenuPage />;
      case 'kitchen':
        return <KitchenDisplayPage onBack={() => handlePageChange('dashboard')} />;
      case 'waiter':
        return <WaiterTaskFeedPage />;
      case 'settings':
        return <SettingsPage onLogout={handleLogout} />;
      case 'staff':
        return <StaffPage />;
      case 'profile':
        return <MyProfilePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'customers':
        // Navigate to customer menu for testing
        window.location.href = '/customer/menu';
        return null;
      // Các trang khác (qr-codes, analytics, reports)
      // hiện tại chỉ là placeholder đơn giản.
        default:
        return (
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <h1 className="text-gray-900 mb-2">Coming soon</h1>
              <p className="text-gray-600">
                This page has not been implemented yet. Please select another section from the sidebar.
              </p>
            </div>
          </div>
        );
    }
  };

  // Check if current page should hide sidebar (like Kitchen Display System)
  const shouldHideSidebar = currentPage === 'kitchen' || currentPage === 'waiter';

  return (
    <div className="flex h-screen bg-gray-50">
      {!shouldHideSidebar && (
        <Sidebar currentPage={currentPage} onNavigate={handlePageChange} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">{renderPage()}</div>
    </div>
  );
}
