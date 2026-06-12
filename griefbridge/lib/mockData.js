export const mockTasks = [
  { id: '1', title: 'Bank account closure — HDFC', category: 'Banking', status: 'pending_approval', description: 'Closure letter prepared. Needs your approval before sending.', updatedAt: '2025-01-16T10:00:00Z' },
  { id: '2', title: 'PAN card death intimation', category: 'Government', status: 'in_progress', description: 'Form 49A being completed. Estimated 2 hours.', updatedAt: '2025-01-16T09:30:00Z' },
  { id: '3', title: 'Life insurance claim — LIC', category: 'Insurance', status: 'needs_attention', description: 'Original policy certificate required.', updatedAt: '2025-01-15T14:00:00Z' },
  { id: '4', title: 'Aadhaar death registration', category: 'Government', status: 'in_progress', description: 'Death certificate being linked to Aadhaar records.', updatedAt: '2025-01-15T11:00:00Z' },
  { id: '5', title: 'Email account — Google', category: 'Digital', status: 'pending_approval', description: 'Account memorialization request drafted.', updatedAt: '2025-01-14T16:00:00Z' },
  { id: '6', title: 'Mutual fund redemption — HDFC AMC', category: 'Banking', status: 'pending', description: 'Awaiting bank closure confirmation before proceeding.', updatedAt: '2025-01-14T09:00:00Z' },
]

export const mockDocuments = [
  { id: '1', title: 'Bank closure letter — HDFC', institution: 'HDFC Bank', category: 'Banking', status: 'pending_approval', date: '2025-01-16' },
  { id: '2', title: 'LIC death claim form', institution: 'Life Insurance Corporation', category: 'Insurance', status: 'draft_ready', date: '2025-01-15' },
  { id: '3', title: 'Income tax intimation', institution: 'Income Tax Department', category: 'Government', status: 'approved', date: '2025-01-14' },
]

export const mockMemory = {
  name: 'Robert',
  years: '1951 – 2025',
  conversations: 47,
  voiceRecordings: 3,
  photos: 120,
  storiesPreserved: 28,
  featuredMemory: {
    label: 'A memory — December 2021',
    excerpt: 'He always said the secret to the dal was patience — "low heat, never rush it."',
    source: 'Voice memo',
  }
}

export const mockMessages = [
  { id: '1', role: 'user', content: "What was Dad's advice about setbacks in business?", timestamp: '10:14' },
  { id: '2', role: 'agent', content: 'Robert often said: "Every setback is a setup for something better — but only if you\'re honest about what went wrong." He first mentioned this when the printing shop nearly closed in 1987, and returned to it many times after.', source: 'Voice memo · March 2022', timestamp: '10:14' },
  { id: '3', role: 'user', content: "Did he write down his lasagna recipe anywhere?", timestamp: '10:16' },
  { id: '4', role: 'agent', content: 'He never wrote it formally, but he described it step by step in a voice recording from March 2022. He was very clear that the ragù should never be rushed — "low heat, always." I\'ve saved it as a recipe you can view.', source: 'Voice memo · March 2022', timestamp: '10:16' },
]

export const mockInstitutions = [
  { id: '1', name: 'HDFC Bank', department: 'Retail Banking', method: 'Portal', status: 'Pending' },
  { id: '2', name: 'SBI', department: 'Loan Division', method: 'Email', status: 'Sent' },
  { id: '3', name: 'Income Tax', department: 'e-Filing', method: 'Portal', status: 'Confirmed' },
  { id: '4', name: 'Airtel', department: 'Broadband', method: 'Portal', status: 'Failed' },
  { id: '5', name: 'LIC', department: 'Claims', method: 'Post', status: 'Pending' },
];
