import React, { useState } from 'react';
import { Sidebar, type SidebarPageKey } from '../components/layout/Sidebar';
import { TablesPage } from '../features/tables/pages/TablesPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<SidebarPageKey>('tables');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tables':
        return <TablesPage />;
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
