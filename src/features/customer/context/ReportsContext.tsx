import React, { createContext, useContext, useState, ReactNode } from 'react';
import { INITIAL_REPORTS, type Report } from '../data/reportData';

export type { Report };

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'date' | 'status'>) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  const addReport = (report: Omit<Report, 'id' | 'date' | 'status'>) => {
    const newReport: Report = {
      ...report,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'Pending',
      hasNewReply: false
    };
    setReports(prev => [newReport, ...prev]);
  };

  const updateReportStatus = (id: string, status: Report['status']) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, status } : report
      )
    );
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReportStatus }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
