import React, { useState, useEffect } from 'react';
import { Sidebar, type SidebarPageKey } from '../components/layout/Sidebar';
import { TablesPage } from '../features/tables/pages/TablesPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { MenuPage } from '../features/menu/pages/MenuPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { CustomerApp } from '../features/customer/App';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<SidebarPageKey>('tables');
  const [isCustomerRoute, setIsCustomerRoute] = useState(false);

  // Check if current route is customer route
  useEffect(() => {
    const path = window.location.pathname;
    const isCustomer = path.startsWith('/customer') || path.startsWith('/menu');
    setIsCustomerRoute(isCustomer);
  }, []);

  // Render customer app if on customer route
  if (isCustomerRoute) {
    return <CustomerApp />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tables':
        return <TablesPage />;
      case 'menu':
        return <MenuPage />;
      // Các trang khác (qr-codes, customers, analytics, reports, settings)
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">{renderPage()}</div>
    </div>
  );
}
