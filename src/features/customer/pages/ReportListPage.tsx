import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReports, Report } from '../context/ReportsContext';

type FilterTab = 'All' | 'Pending' | 'In Progress' | 'Completed';

interface ReportListPageProps {
  onBack?: () => void;
}

export function ReportListPage({ onBack }: ReportListPageProps) {
  const { user } = useAuth();
  const { reports } = useReports();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          bg: '#fef3c6',
          text: '#bb4d00'
        };
      case 'In Progress':
        return {
          bg: '#dbeafe',
          text: '#1447e6'
        };
      case 'Resolved':
        return {
          bg: '#dcfce7',
          text: '#008236'
        };
      default:
        return {
          bg: '#f3f4f6',
          text: '#6b7280'
        };
    }
  };

  const filteredReports = reports.filter(report => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return report.status === 'Resolved';
    return report.status === activeTab;
  });

  const handleViewDetails = (report: Report) => {
    alert(`View details for ${report.orderNumber}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft style={{ width: '24px', height: '24px', color: '#1f2937' }} />
            </button>
          )}
          <h1 style={{
            fontSize: '16px',
            fontWeight: '400',
            color: '#101828',
            margin: 0,
            letterSpacing: '-0.31px'
          }}>
            My Reports
          </h1>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative'
        }}>
          {(['All', 'Pending', 'In Progress', 'Completed'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '400',
                color: activeTab === tab ? '#27ae60' : '#4a5565',
                letterSpacing: '-0.15px',
                position: 'relative',
                transition: 'color 0.2s',
                flex: 1,
                textAlign: 'center'
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#27ae60'
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div style={{ padding: '16px' }}>
        {filteredReports.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>No reports found</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>You haven't submitted any reports yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredReports.map((report) => {
              const statusColor = getStatusColor(report.status);
              return (
                <div
                  key={report.id}
                  onClick={() => handleViewDetails(report)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  {/* Header: Title, Date, Status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '400',
                        color: '#101828',
                        margin: '0 0 8px 0',
                        letterSpacing: '-0.31px'
                      }}>
                        {report.issueTypes.join(', ')}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#27ae60',
                        margin: 0,
                        letterSpacing: '-0.15px'
                      }}>
                        {report.orderNumber}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#6a7282',
                        letterSpacing: '-0.15px'
                      }}>
                        {report.date}
                      </span>
                      <div style={{
                        backgroundColor: statusColor.bg,
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: statusColor.text
                      }}>
                        {report.status}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#4a5565',
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.15px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {report.description}
                  </p>

                  {/* New Reply Indicator */}
                  {report.hasNewReply && (
                    <div style={{
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: '12px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <MessageCircle style={{
                        width: '16px',
                        height: '16px',
                        color: '#27ae60'
                      }} />
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#27ae60',
                        letterSpacing: '-0.15px'
                      }}>
                        1 New Reply
                      </span>
                    </div>
                  )}

                  {/* View Details Link */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#6a7282'
                    }}>
                      View Details
                    </span>
                    <ChevronRight style={{
                      width: '16px',
                      height: '16px',
                      color: '#6a7282'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
