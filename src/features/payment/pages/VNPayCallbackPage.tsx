import React, { useEffect } from 'react';
import { serveApi } from '../../waiter/services/serve.api';

export const VNPayCallbackPage: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get all query parameters from URL
        const searchParams = new URLSearchParams(window.location.search);
        const queryParams: Record<string, string> = {};
        let paymentId = '';
        
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
          // Extract payment ID from vnp_OrderInfo (format: PAY-YYYYMMDD-XX)
          if (key === 'vnp_OrderInfo') {
            paymentId = value;
          }
        });

        console.log('🔗 VNPay Callback Query Params:', queryParams);

        // Check response code - 00 means success
        const responseCode = queryParams.vnp_ResponseCode;
        if (responseCode !== '00') {
          console.error('❌ Payment failed. Response code:', responseCode);
          // Redirect to waiter with error
          window.location.href = `/admin/waiter?payment_error=true`;
          return;
        }

        // Add 30s delay for testing network call
        console.log('⏳ Waiting 30 seconds for testing...');
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Call backend API to mark payment as successful
        const token = localStorage.getItem('admin_auth_token') || '';
        console.log('📞 Calling VNPay callback API...');
        const result = await serveApi.handleVNPayCallback(queryParams, token);

        console.log('✅ VNPay callback result:', result);

        if (result && result.success) {
          // Redirect to waiter page with success flag
          window.location.href = `/admin/waiter?payment_success=true&payment_id=${paymentId}`;
        } else {
          console.error('❌ Callback API failed:', result?.message);
          // Redirect to waiter with error
          window.location.href = `/admin/waiter?payment_error=true`;
        }
      } catch (error) {
        console.error('❌ Error handling VNPay callback:', error);
        window.location.href = `/admin/waiter?payment_error=true`;
      }
    };

    handleCallback();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a3a2e, #1e2939)',
        zIndex: 9999
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '40px'
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid #00a63e',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}
        />
        <h2
          style={{
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          Processing Payment...
        </h2>
      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};
