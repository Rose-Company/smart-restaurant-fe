# Technical Architecture: 10-Second Polling Implementation

## Overview
This document explains the technical architecture of the polling system for the waiter dashboard.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    WaiterTaskFeedPage Component                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           usePollingTables Hook (10s interval)            │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ const fetchTables = useCallback(async () => {        │ │ │
│  │  │   const token = localStorage.getItem('token')        │ │ │
│  │  │   const data = await serveApi.getTablesList(...)     │ │ │
│  │  │   setTasks(transform(data.items))                    │ │ │
│  │  │ })                                                    │ │ │
│  │  │                                                        │ │ │
│  │  │ useEffect(() => {                                     │ │ │
│  │  │   fetchTables()                                       │ │ │
│  │  │   const interval = setInterval(fetchTables, 10000)    │ │ │
│  │  │   return () => clearInterval(interval)                │ │ │
│  │  │ }, [])                                                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  Returns: { refetch, startPolling, stopPolling }          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│                    API: /api/staff/tables                        │
│                              ↓                                   │
│         ┌────────────────────────────────────────┐              │
│         │    Transform & Filter Tables           │              │
│         │                                        │              │
│         │  Filter by activeFilter:               │              │
│         │  - kitchen: exclude help/payment       │              │
│         │  - requests: only help_needed=true     │              │
│         │  - payment: only is_ready_to_bill=true │              │
│         │  - all: show all occupied tables       │              │
│         └────────────────────────────────────────┘              │
│                              ↓                                   │
│         ┌────────────────────────────────────────┐              │
│         │  Update State: setTasks(transformed)   │              │
│         └────────────────────────────────────────┘              │
│                              ↓                                   │
│         ┌────────────────────────────────────────┐              │
│         │      Render Task Cards (UI Update)     │              │
│         └────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Initial Load (Time = 0s)
```
Component Mount → usePollingTables hook initializes
                → fetchTables() called immediately
                → API request sent to /api/staff/tables
                → Response received and transformed
                → UI renders task cards
```

### Subsequent Polls (Every 10 seconds)
```
10s  → interval triggers → fetchTables() → API call → Update UI
20s  → interval triggers → fetchTables() → API call → Update UI
30s  → interval triggers → fetchTables() → API call → Update UI
...
```

### Component Unmount
```
Component will unmount → useEffect cleanup runs
                      → clearInterval() executed
                      → Polling stops
                      → Memory leak prevented
```

## Hook Implementation Details

### usePollingTables Hook

**Key Features:**
- Uses `useCallback` to memoize fetch function
- Uses `useRef` for interval storage (persists across renders)
- Uses `useRef` for `isMountedRef` to prevent state updates after unmount
- Uses `useEffect` for setup/cleanup

**Lifecycle:**
```typescript
1. useEffect runs on mount
   ↓
2. fetchTables() called immediately (initial fetch)
   ↓
3. setInterval(fetchTables, 10000) created
   ↓
4. On each interval trigger:
   - Check if component is mounted (isMountedRef.current)
   - Fetch tables from API
   - Update state only if mounted
   ↓
5. useEffect cleanup on unmount:
   - Set isMountedRef.current = false
   - clearInterval() called
   - No more state updates possible
```

### Error Handling Flow

```
API Request
    ↓
Success? ───YES──→ Parse JSON
                    ↓
                    Check: json.code === 200?
                    ↓
                    YES → onSuccess(data)
                    ↓
                    NO → onError(Error)

    ↓
    NO
    ↓
Error (network, timeout, etc.)
    ↓
response.status === 401?
    ↓
    YES → handleUnauthorized() → Redirect to login
    ↓
    NO → onError(Error)
    ↓
    Fallback to mock data in component
```

## Parameter Flow for Filters

```
WaiterTaskFeedPage
  ↓
activeFilter state changes
  ↓
getPollingParams() called
  ↓
Returns appropriate params:
  - 'kitchen' → { status: 'occupied' }
  - 'requests' → { status: 'occupied', is_help_needed: true }
  - 'payment' → { status: 'occupied', is_ready_to_bill: true }
  - 'all' → { status: 'occupied' }
  ↓
params passed to usePollingTables
  ↓
useCallback dependency updated
  ↓
fetchTables updated with new params
  ↓
Next API call uses new filter parameters
```

## Memory Management

### Cleanup Process
```
Component Unmount Detected
    ↓
useEffect cleanup function runs:
  1. isMountedRef.current = false
  2. clearInterval(intervalRef.current)
  3. intervalRef.current = null
    ↓
Next fetchTables() call:
  - Checks isMountedRef.current (false)
  - Does NOT call setState
  - Returns early
    ↓
Result: No memory leak, no stale closures
```

### Why This Matters
- Without cleanup: interval continues running in background
- Without mounted check: setState warnings, memory leaks
- Without refs: state might be stale or lost

## Performance Considerations

### Polling Frequency
- **Current**: 10 seconds (10,000ms)
- **Rationale**: Balance between real-time updates and server load
- **Adjustable**: Pass `intervalMs` prop if needed

### API Load
- Per waiter dashboard: 1 request / 10 seconds
- With 10 waiters: 1 request / second
- With 100 waiters: 10 requests / second

### Bandwidth Usage
- Response size: ~2-5 KB per request
- 1 waiter: ~0.5-1.2 KB/minute
- 10 waiters: ~5-12 KB/minute

### Optimization Tips
- Debounce rapid filter changes
- Cancel pending requests when filter changes
- Use React Query for client-side caching (future enhancement)

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Uses standard APIs:
  - `setInterval()` / `clearInterval()`
  - `useEffect()` / `useCallback()` / `useRef()`
  - `localStorage`
  - `fetch()` API
- ⚠️ IE11 not supported (requires polyfills)

## Debugging Tips

### Check if polling is active:
```javascript
// In browser console
setInterval(() => console.log(new Date().toLocaleTimeString()), 1000)
// Open Network tab, should see API calls every 10 seconds
```

### Debug polling hook:
```typescript
// Add to usePollingTables hook
console.log(`[Poll ${new Date().toLocaleTimeString()}] Fetching tables...`)
```

### Check mounted state:
```typescript
// In useEffect cleanup
console.log('Component unmounted, polling stopped')
```

## Future Enhancements

1. **Add exponential backoff**: Retry failed requests with increasing delay
2. **Add request debouncing**: Prevent rapid consecutive requests on filter change
3. **Add polling pause/resume UI**: Let user control polling manually
4. **Add polling interval selector**: Configure polling frequency (5s, 10s, 30s, etc.)
5. **Add last update indicator**: Show when data was last fetched
6. **Add request cancellation**: Cancel pending requests when component unmounts
7. **Integrate with React Query**: Better cache management and dev tools
8. **Add WebSocket support**: Replace polling with real-time updates

## Testing Strategy

### Unit Tests (usePollingTables hook)
```typescript
test('should fetch tables on mount', () => {})
test('should fetch tables every 10 seconds', () => {})
test('should cleanup interval on unmount', () => {})
test('should handle API errors gracefully', () => {})
test('should update params when dependencies change', () => {})
```

### Integration Tests (WaiterTaskFeedPage)
```typescript
test('should start polling on mount', () => {})
test('should apply filter to polling', () => {})
test('should transform tables to tasks', () => {})
test('should update task list every 10 seconds', () => {})
test('should fallback to mock data on error', () => {})
```

### E2E Tests
```
1. Open waiter dashboard
2. Verify API calls in Network tab every 10 seconds
3. Switch tabs (Kitchen, Requests, Payment)
4. Verify polling continues with new filter
5. Close dashboard
6. Verify no API calls after unmount
```

---
**Last Updated**: January 2026
**Status**: Production Ready
