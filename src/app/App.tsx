import React, { useState, useEffect } from 'react';
import { Sidebar, type SidebarPageKey } from '../components/layout/Sidebar';
import { TablesPage } from '../features/tables/pages/TablesPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { MenuPage } from '../features/menu/pages/MenuPage';
import { KitchenDisplayPage } from '../features/kitchen/pages/KitchenDisplayPage';
import { WaiterTaskFeedPage } from '../features/waiter/pages/WaiterTaskFeedPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { CustomerApp } from '../features/customer/App';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage on initial load
    return localStorage.getItem('admin_auth_token') ? true : false;
  });
  const [currentPage, setCurrentPage] = useState<SidebarPageKey>(() => {
    // Restore currentPage from localStorage on initial load
    const savedPage = localStorage.getItem('admin_current_page') as SidebarPageKey;
    return savedPage || 'tables';
  });
  const [isCustomerRoute, setIsCustomerRoute] = useState(false);

  // Check if current route is customer route
  useEffect(() => {
    const path = window.location.pathname;
    const isCustomer = path.startsWith('/customer') || path.startsWith('/menu');
    setIsCustomerRoute(isCustomer);
  }, []);

  // Handle login - store token and set authenticated
  const handleLogin = (token: string) => {
    localStorage.setItem('admin_auth_token', token);
    setIsAuthenticated(true);
  };

  // Handle logout - clear token and reset state
  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_current_page');
    setIsAuthenticated(false);
    setCurrentPage('tables');
  };

  // Save currentPage to localStorage whenever it changes
  const handlePageChange = (page: SidebarPageKey) => {
    localStorage.setItem('admin_current_page', page);
    setCurrentPage(page);
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
      case 'customers':
        // Navigate to customer menu for testing
        window.location.href = '/customer/menu';
        return null;
      // Các trang khác (qr-codes, analytics, reports, settings)
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
