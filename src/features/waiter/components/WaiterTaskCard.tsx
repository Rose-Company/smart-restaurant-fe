import React from 'react';
import { Clock, ChefHat, MessageCircle, Receipt } from 'lucide-react';
import { WaiterTask } from '../types/waiter.types';
import { formatPrice } from '../../../lib/utils';
interface WaiterTaskCardProps {
  task: WaiterTask & { isHelpNeeded?: boolean; isReadyToBill?: boolean };
  onComplete: (taskId: string, taskType: string) => void;
}

export const WaiterTaskCard: React.FC<WaiterTaskCardProps> = ({ task, onComplete }) => {
  const getTaskConfig = () => {
    // Determine color based on table status
    let baseColor = { icon: ChefHat, iconBg: 'rgba(0, 166, 62, 0.2)', borderColor: '#00c950', label: 'Kitchen Ready', buttonText: 'SERVE', buttonBg: '#00a63e', buttonShadow: '0px 4px 6px -1px rgba(0, 166, 62, 0.3), 0px 2px 4px -2px rgba(0, 166, 62, 0.3)' };

    // Override color based on status flags
    if (task.isReadyToBill) {
      // Red when ready to bill
      baseColor = {
        icon: Receipt,
        iconBg: 'rgba(231, 0, 11, 0.2)',
        borderColor: '#fb2c36',
        label: 'Ready to Bill',
        buttonText: 'BILL',
        buttonBg: '#e7000b',
        buttonShadow: '0px 4px 6px -1px rgba(231, 0, 11, 0.3), 0px 2px 4px -2px rgba(231, 0, 11, 0.3)'
      };
    } else if (task.isHelpNeeded) {
      // Orange when help needed
      baseColor = {
        icon: MessageCircle,
        iconBg: 'rgba(245, 73, 0, 0.2)',
        borderColor: '#ff6900',
        label: 'Help Needed',
        buttonText: 'ASSIST',
        buttonBg: '#f54900',
        buttonShadow: '0px 4px 6px -1px rgba(245, 73, 0, 0.3), 0px 2px 4px -2px rgba(245, 73, 0, 0.3)'
      };
    } else {
      // Green for normal kitchen ready
      baseColor = {
        icon: ChefHat,
        iconBg: 'rgba(0, 166, 62, 0.2)',
        borderColor: '#00c950',
        label: 'Kitchen Ready',
        buttonText: 'SERVE',
        buttonBg: '#00a63e',
        buttonShadow: '0px 4px 6px -1px rgba(0, 166, 62, 0.3), 0px 2px 4px -2px rgba(0, 166, 62, 0.3)'
      };
    }

    return baseColor;
  };

  const config = getTaskConfig();
  const Icon = config.icon;

  const getTimeAgo = () => {
    const now = Date.now();
    const diff = now - task.createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1m ago';
    return `${minutes}m ago`;
  };

  return (
    <div style={{
      background: '#101828',
      borderRadius: '14px',
      border: `1px solid ${config.borderColor}`,
      borderLeft: `4px solid ${config.borderColor}`,
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(30, 41, 57, 0.5)',
        borderBottom: '1px solid #364153',
        padding: '12px'
      }}>
        {/* Top Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: config.iconBg,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock style={{ width: '12px', height: '12px', color: '#99a1af' }} />
            <span style={{
              color: '#99a1af',
              fontSize: '12px',
              lineHeight: '16px'
            }}>
              {getTimeAgo()}
            </span>
          </div>
        </div>

        {/* Table Number */}
        <h3 style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: 'bold',
          lineHeight: '28px',
          margin: '0 0 8px 0',
          letterSpacing: '-0.4395px'
        }}>
          Table {task.tableNumber}
        </h3>

        {/* Task Type Label */}
        <p style={{
          color: '#99a1af',
          fontSize: '12px',
          lineHeight: '16px',
          margin: 0,
          textTransform: 'capitalize'
        }}>
          {config.label}
        </p>
      </div>

      {/* Content */}
      <div style={{
        padding: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Items List for Kitchen Ready */}
        {task.items && task.items.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1
          }}>
            {task.items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: '#00c950',
                  borderRadius: '50%'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '16px'
                }}>
                  {item.quantity}x {item.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Note for Customer Request */}
        {task.note && (
          <p style={{
            color: '#d1d5dc',
            fontSize: '14px',
            lineHeight: '20px',
            margin: 0,
            letterSpacing: '-0.1504px'
          }}>
            {task.note}
          </p>
        )}

        {/* Total Amount for Payment */}
        {task.totalAmount !== undefined && (
          <div style={{
            background: 'rgba(231, 0, 11, 0.1)',
            border: '1px solid rgba(231, 0, 11, 0.3)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            flex: 1
          }}>
            <p style={{
              color: '#99a1af',
              fontSize: '12px',
              lineHeight: '16px',
              margin: 0
            }}>
              Total
            </p>
            <p style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold',
              lineHeight: '32px',
              margin: 0,
              letterSpacing: '0.0703px'
            }}>
              {formatPrice(task.totalAmount)}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onComplete(task.id, task.type)}
          style={{
            background: config.buttonBg,
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 'bold',
            lineHeight: '20px',
            letterSpacing: '-0.1504px',
            padding: '12px',
            border: 'none',
            borderRadius: '10px',
            boxShadow: config.buttonShadow,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {config.buttonText}
        </button>
      </div>
    </div>
  );
};
