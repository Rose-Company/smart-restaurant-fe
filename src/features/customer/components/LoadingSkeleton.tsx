export function MenuLoadingSkeleton() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f0f0f0',
            animation: 'pulse 2s infinite',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 6,
              backgroundColor: '#e0e0e0',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 16,
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
                marginBottom: 8,
                width: '60%',
              }}
            />
            <div
              style={{
                height: 12,
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
                marginBottom: 8,
                width: '80%',
              }}
            />
            <div
              style={{
                height: 12,
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
                width: '40%',
              }}
            />
          </div>
          <div
            style={{
              width: 60,
              height: 40,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              flexShrink: 0,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
