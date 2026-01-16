import React from 'react';
import { LayoutDashboard, Utensils, QrCode, Users, Settings, BarChart3, FileText, Menu, ChefHat } from 'lucide-react';
import { useTranslation } from "react-i18next";
export type SidebarPageKey = 'dashboard' | 'tables' | 'menu' | 'kitchen' | 'qr-codes' | 'customers' | 'analytics' | 'reports' | 'settings';

interface SidebarProps {
  currentPage: SidebarPageKey;
  onNavigate: (page: SidebarPageKey) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t } = useTranslation("common");
  const menuItems: { icon: React.ComponentType<{ className?: string }>; label: string; key: SidebarPageKey }[] = [
    { icon: LayoutDashboard, label: t("sidebar.dashboard"), key: 'dashboard' },
    { icon: Utensils, label: t("sidebar.tables"), key: 'tables' },
    { icon: Menu, label: t("sidebar.menu"), key: 'menu' },
    { icon: ChefHat, label: t("sidebar.kitchen"), key: 'kitchen' },
    { icon: QrCode, label: t("sidebar.qr"), key: 'qr-codes' },
    { icon: Users, label: t("sidebar.customers"), key: 'customers' },
    { icon: BarChart3, label: t("sidebar.analytics"), key: 'analytics' },
    { icon: FileText, label: t("sidebar.reports"), key: 'reports' },
    { icon: Settings, label: t("sidebar.settings"), key: 'settings' },
  ];

  return (
    <div className="w-64 bg-[#2c3e50] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white">{t("system.appName")}</h2>
            <p className="text-sm text-white/60">{t("system.adminPanel")}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.key === currentPage
                    ? 'bg-[#27ae60] text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-[#27ae60] rounded-full flex items-center justify-center">
            <span>JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">John Doe</p>
            <p className="text-xs text-white/60">{t("role.administrator")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
