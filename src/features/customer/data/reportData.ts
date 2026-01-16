export interface Report {
  id: string;
  orderNumber: string;
  issueTypes: string[];
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  hasNewReply?: boolean;
  imageUrl?: string;
}

export const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    orderNumber: 'ORD-2026-004',
    issueTypes: ['Missing Item'],
    description: 'I ordered 2 cokes but only got 1 in my delivery bag...',
    status: 'Pending',
    date: 'Jan 15',
    hasNewReply: false
  },
  {
    id: '2',
    orderNumber: 'ORD-2026-003',
    issueTypes: ['Food Quality'],
    description: 'The burger was cold when it arrived. Not satisfied with the temperature...',
    status: 'Resolved',
    date: 'Jan 12',
    hasNewReply: true
  },
  {
    id: '3',
    orderNumber: 'ORD-2026-001',
    issueTypes: ['Wrong Item'],
    description: 'Ordered chicken salad but received caesar salad instead...',
    status: 'In Progress',
    date: 'Jan 08',
    hasNewReply: false
  }
];
