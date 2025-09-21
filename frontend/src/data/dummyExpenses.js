// Dummy expense data for development and testing
// This will be replaced with real API data when backend is ready

export const DUMMY_EXPENSES = [
  {
    id: 1,
    title: 'Grocery Shopping',
    amount: 85.50,
    category: 'Food & Dining',
    description: 'Weekly grocery shopping at Whole Foods',
    date: '2024-01-15',
    type: 'expense',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Gas Station',
    amount: 45.00,
    category: 'Transportation',
    description: 'Fuel for car',
    date: '2024-01-14',
    type: 'expense',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-14T08:15:00Z'
  },
  {
    id: 3,
    title: 'Movie Tickets',
    amount: 28.00,
    category: 'Entertainment',
    description: 'Cinema tickets for family',
    date: '2024-01-13',
    type: 'expense',
    createdAt: '2024-01-13T19:45:00Z',
    updatedAt: '2024-01-13T19:45:00Z'
  },
  {
    id: 4,
    title: 'Electricity Bill',
    amount: 120.75,
    category: 'Utilities',
    description: 'Monthly electricity bill',
    date: '2024-01-12',
    type: 'expense',
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-12T12:00:00Z'
  },
  {
    id: 5,
    title: 'Coffee Shop',
    amount: 12.50,
    category: 'Food & Dining',
    description: 'Morning coffee and pastry',
    date: '2024-01-11',
    type: 'expense',
    createdAt: '2024-01-11T07:30:00Z',
    updatedAt: '2024-01-11T07:30:00Z'
  },
  {
    id: 6,
    title: 'Online Course',
    amount: 99.99,
    category: 'Education',
    description: 'React development course on Udemy',
    date: '2024-01-10',
    type: 'expense',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 7,
    title: 'Restaurant Dinner',
    amount: 67.80,
    category: 'Food & Dining',
    description: 'Dinner at Italian restaurant',
    date: '2024-01-09',
    type: 'expense',
    createdAt: '2024-01-09T20:15:00Z',
    updatedAt: '2024-01-09T20:15:00Z'
  },
  {
    id: 8,
    title: 'Bus Pass',
    amount: 35.00,
    category: 'Transportation',
    description: 'Monthly public transport pass',
    date: '2024-01-08',
    type: 'expense',
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z'
  },
  {
    id: 9,
    title: 'Gym Membership',
    amount: 45.00,
    category: 'Healthcare',
    description: 'Monthly gym membership fee',
    date: '2024-01-07',
    type: 'expense',
    createdAt: '2024-01-07T11:30:00Z',
    updatedAt: '2024-01-07T11:30:00Z'
  },
  {
    id: 10,
    title: 'New Headphones',
    amount: 89.99,
    category: 'Shopping',
    description: 'Wireless headphones for work',
    date: '2024-01-06',
    type: 'expense',
    createdAt: '2024-01-06T16:45:00Z',
    updatedAt: '2024-01-06T16:45:00Z'
  },
  {
    id: 11,
    title: 'Salary',
    amount: 3500.00,
    category: 'Others',
    description: 'Monthly salary deposit',
    date: '2024-01-01',
    type: 'income',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 12,
    title: 'Freelance Payment',
    amount: 500.00,
    category: 'Others',
    description: 'Web development project payment',
    date: '2024-01-05',
    type: 'income',
    createdAt: '2024-01-05T13:20:00Z',
    updatedAt: '2024-01-05T13:20:00Z'
  }
];

export const EXPENSE_CATEGORIES = [
  { value: 'Food & Dining', label: 'Food & Dining', icon: '🍽️' },
  { value: 'Transportation', label: 'Transportation', icon: '🚗' },
  { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'Entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'Healthcare', label: 'Healthcare', icon: '⚕️' },
  { value: 'Education', label: 'Education', icon: '📚' },
  { value: 'Utilities', label: 'Utilities', icon: '💡' },
  { value: 'Travel', label: 'Travel', icon: '✈️' },
  { value: 'Others', label: 'Others', icon: '📦' }
];

export const EXPENSE_TYPES = [
  { value: 'expense', label: 'Expense', color: '#f44336' },
  { value: 'income', label: 'Income', color: '#4caf50' }
];

// Generate additional dummy data for testing
export const generateMoreDummyData = (count = 20) => {
  const additionalExpenses = [];
  const baseDate = new Date();

  for (let i = 0; i < count; i++) {
    const randomDays = Math.floor(Math.random() * 60); // Last 60 days
    const randomDate = new Date(baseDate);
    randomDate.setDate(randomDate.getDate() - randomDays);

    const randomCategory = EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
    const randomType = Math.random() > 0.8 ? 'income' : 'expense'; // 20% income, 80% expense

    const expense = {
      id: 100 + i,
      title: `${randomCategory.label} ${i + 1}`,
      amount: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      category: randomCategory.value,
      description: `Sample ${randomCategory.label.toLowerCase()} expense`,
      date: randomDate.toISOString().split('T')[0],
      type: randomType,
      createdAt: randomDate.toISOString(),
      updatedAt: randomDate.toISOString()
    };

    additionalExpenses.push(expense);
  }

  return additionalExpenses;
};

// Export combined dummy data
export const ALL_DUMMY_EXPENSES = [
  ...DUMMY_EXPENSES,
  ...generateMoreDummyData(15)
];
