export interface Question {
  id: string;
  subject: string;
  topic: string;
  subtopic: string;
  type: 'MCQ' | 'MSQ' | 'TF' | 'FITB' | 'MATCH' | 'SHORT' | 'LONG' | 'CODING' | 'IMAGE' | 'CASE';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  timeLimit: number; // in seconds
  questionText: string;
  options?: string[]; // For MCQ, MSQ, MATCH
  correctAnswer: string | string[]; // Single string or array of strings (e.g. for MSQ, MATCH, FITB)
  explanation: string;
  tags: string[];
  bloomsLevel: 'Remembering' | 'Understanding' | 'Applying' | 'Analyzing' | 'Evaluating' | 'Creating';
  imageUrl?: string;
  matchPairs?: { left: string; right: string }[]; // For MATCH type
  codingTemplate?: string;
  codingTestCases?: { input: string; output: string; isHidden?: boolean }[];
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  negativeMarking: number; // penalty per wrong answer
  randomizeQuestions: boolean;
  sections: { name: string; questionIds: string[] }[];
}

export const mockQuestions: Question[] = [
  // Data Structures (CS301)
  {
    id: 'q1',
    subject: 'Data Structures',
    topic: 'Arrays & Lists',
    subtopic: 'Singly Linked Lists',
    type: 'MCQ',
    difficulty: 'Easy',
    marks: 2,
    timeLimit: 60,
    questionText: 'What is the time complexity to insert a new node at the beginning of a singly linked list containing N elements?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctAnswer: 'O(1)',
    explanation: 'Inserting a new node at the head of a singly linked list only requires updating pointers, which takes constant O(1) time.',
    tags: ['Linked List', 'Time Complexity', 'Basics'],
    bloomsLevel: 'Remembering'
  },
  {
    id: 'q2',
    subject: 'Data Structures',
    topic: 'Trees',
    subtopic: 'Binary Search Trees',
    type: 'MCQ',
    difficulty: 'Medium',
    marks: 4,
    timeLimit: 120,
    questionText: 'If we perform an in-order traversal on a Binary Search Tree (BST), in what order will the elements be visited?',
    options: ['Descending order', 'Ascending order', 'Random order', 'Breadth-first order'],
    correctAnswer: 'Ascending order',
    explanation: 'An in-order traversal of a BST visits the left subtree (smaller elements), the root node, and then the right subtree (larger elements). This guarantees elements are traversed in sorted, ascending order.',
    tags: ['BST', 'Tree Traversal', 'Sorting'],
    bloomsLevel: 'Understanding'
  },
  {
    id: 'q3',
    subject: 'Data Structures',
    topic: 'Stacks & Queues',
    subtopic: 'Queues',
    type: 'TF',
    difficulty: 'Easy',
    marks: 2,
    timeLimit: 45,
    questionText: 'A standard Queue operates on the Last-In-First-Out (LIFO) principle.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Queues operate on the First-In-First-Out (FIFO) principle, where the element inserted first is removed first. Stacks operate on the LIFO principle.',
    tags: ['Queue', 'Stack', 'FIFO'],
    bloomsLevel: 'Remembering'
  },
  {
    id: 'q4',
    subject: 'Data Structures',
    topic: 'Trees',
    subtopic: 'AVL Trees',
    type: 'MCQ',
    difficulty: 'Hard',
    marks: 5,
    timeLimit: 180,
    questionText: 'What is the maximum height difference allowed between the left and right subtrees of any node in an AVL tree?',
    options: ['0', '1', '2', 'log N'],
    correctAnswer: '1',
    explanation: 'AVL trees are strictly height-balanced. For any node, the balance factor (height(left) - height(right)) must be in the range [-1, 1], meaning the maximum height difference is 1.',
    tags: ['AVL Tree', 'Tree Balance', 'Self-Balancing'],
    bloomsLevel: 'Applying'
  },
  // Algorithms (CS301)
  {
    id: 'q5',
    subject: 'Algorithms',
    topic: 'Sorting',
    subtopic: 'Quick Sort',
    type: 'MSQ',
    difficulty: 'Medium',
    marks: 4,
    timeLimit: 120,
    questionText: 'Select all the statements that are TRUE regarding the Quick Sort algorithm:',
    options: [
      'It is an in-place sorting algorithm.',
      'Its worst-case time complexity is O(N^2).',
      'It is a stable sorting algorithm.',
      'It uses the divide-and-conquer strategy.'
    ],
    correctAnswer: ['It is an in-place sorting algorithm.', 'Its worst-case time complexity is O(N^2).', 'It uses the divide-and-conquer strategy.'],
    explanation: 'Quick Sort is an in-place, divide-and-conquer sorting algorithm. Its worst-case complexity occurs when the pivot is poorly chosen (e.g. sorted array), resulting in O(N^2). It is generally unstable because swaps can change relative order of identical elements.',
    tags: ['Quick Sort', 'Divide and Conquer', 'Stability'],
    bloomsLevel: 'Analyzing'
  },
  {
    id: 'q6',
    subject: 'Algorithms',
    topic: 'Dynamic Programming',
    subtopic: '0/1 Knapsack',
    type: 'CODING',
    difficulty: 'Hard',
    marks: 10,
    timeLimit: 600,
    questionText: 'Write a function `knapsack(weights: number[], values: number[], capacity: number): number` that returns the maximum value that can be obtained by taking a subset of items such that their total weight does not exceed the capacity.',
    codingTemplate: `function knapsack(weights, values, capacity) {
  // Write your code here
  return 0;
}`,
    codingTestCases: [
      { input: '([1, 2, 3], [6, 10, 12], 5)', output: '22', isHidden: false }, // Items 1 & 2 (weight 2+3=5, value 10+12=22)
      { input: '([1, 2, 4], [10, 20, 30], 3)', output: '30', isHidden: false }, // Items 0 & 1 (weight 1+2=3, value 10+20=30)
      { input: '([2, 3, 5], [30, 40, 60], 6)', output: '70', isHidden: true }  // Items 0 & 1 (weight 2+3=5, value 70)
    ],
    correctAnswer: 'DP Solution',
    explanation: 'The 0/1 Knapsack problem can be solved using dynamic programming by building a 2D array dp[i][w] representing the max value for first i items and weight limit w.',
    tags: ['Dynamic Programming', 'Knapsack', 'Optimization'],
    bloomsLevel: 'Creating'
  },
  // Databases (CS302)
  {
    id: 'q7',
    subject: 'Database Systems',
    topic: 'SQL',
    subtopic: 'Joins',
    type: 'MATCH',
    difficulty: 'Medium',
    marks: 4,
    timeLimit: 120,
    questionText: 'Match the SQL Join type with its correct behavior:',
    matchPairs: [
      { left: 'INNER JOIN', right: 'Returns matching rows from both tables' },
      { left: 'LEFT JOIN', right: 'Returns all rows from left table and matching rows from right' },
      { left: 'RIGHT JOIN', right: 'Returns all rows from right table and matching rows from left' },
      { left: 'FULL JOIN', right: 'Returns all rows when there is a match in either left or right' }
    ],
    correctAnswer: [
      'INNER JOIN: Returns matching rows from both tables',
      'LEFT JOIN: Returns all rows from left table and matching rows from right',
      'RIGHT JOIN: Returns all rows from right table and matching rows from left',
      'FULL JOIN: Returns all rows when there is a match in either left or right'
    ],
    explanation: 'SQL Joins link tables based on foreign keys. INNER join filters for match, LEFT/RIGHT preserve unmatched rows on their respective sides, while FULL outer preserves all records.',
    tags: ['SQL', 'Joins', 'Querying'],
    bloomsLevel: 'Applying'
  },
  {
    id: 'q8',
    subject: 'Database Systems',
    topic: 'Normalization',
    subtopic: 'Boyce-Codd Normal Form',
    type: 'SHORT',
    difficulty: 'Hard',
    marks: 6,
    timeLimit: 240,
    questionText: 'Briefly define the difference between 3rd Normal Form (3NF) and Boyce-Codd Normal Form (BCNF). What condition must every determinant satisfy in BCNF?',
    correctAnswer: 'determinant',
    explanation: 'A relation is in BCNF if and only if for every non-trivial functional dependency X -> Y, X is a superkey. In 3NF, Y can also be a prime attribute. Therefore, BCNF is stricter and eliminates all anomaly dependencies.',
    tags: ['Normalization', 'Database Design', 'BCNF'],
    bloomsLevel: 'Evaluating'
  }
];

export const mockExams: Exam[] = [
  {
    id: 'exam1',
    title: 'Data Structures Midterm Mock',
    subject: 'Data Structures',
    duration: 10, // 10 minutes for testing
    totalMarks: 13,
    negativeMarking: 0.5,
    randomizeQuestions: true,
    sections: [
      { name: 'Section A: Theory', questionIds: ['q1', 'q2', 'q3', 'q4'] },
      { name: 'Section B: Advanced SQL', questionIds: ['q7', 'q8'] }
    ]
  },
  {
    id: 'exam2',
    title: 'Algorithms Practice Quiz',
    subject: 'Algorithms',
    duration: 15,
    totalMarks: 14,
    negativeMarking: 0,
    randomizeQuestions: false,
    sections: [
      { name: 'Section A', questionIds: ['q5', 'q6'] }
    ]
  }
];

export interface ScheduledExam {
  id: string;
  title: string;
  subject: string;
  status: 'upcoming' | 'live' | 'completed' | 'missed';
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  totalQuestions: number;
  proctoringLevel: 'NONE' | 'STANDARD' | 'STRICT';
  score?: number;
  percentage?: number;
  rank?: number;
}

export const mockExamSchedule: ScheduledExam[] = [
  {
    id: 'sch1',
    title: 'Data Structures - Tree Structures & AVL',
    subject: 'Data Structures',
    status: 'live',
    startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
    duration: 60,
    totalMarks: 50,
    passingMarks: 20,
    totalQuestions: 15,
    proctoringLevel: 'STANDARD'
  },
  {
    id: 'sch2',
    title: 'Operating Systems Final Prep',
    subject: 'Operating Systems',
    status: 'upcoming',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    totalQuestions: 30,
    proctoringLevel: 'STRICT'
  },
  {
    id: 'sch3',
    title: 'Database Management Systems Quiz 2',
    subject: 'Database Systems',
    status: 'upcoming',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3.1 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    totalMarks: 25,
    passingMarks: 10,
    totalQuestions: 10,
    proctoringLevel: 'NONE'
  },
  {
    id: 'sch4',
    title: 'Algorithms Midterm Examination',
    subject: 'Algorithms',
    status: 'completed',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4.9 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    totalMarks: 75,
    passingMarks: 30,
    totalQuestions: 20,
    proctoringLevel: 'STRICT',
    score: 64,
    percentage: 85.3,
    rank: 4
  },
  {
    id: 'sch5',
    title: 'Computer Networks Quiz 1',
    subject: 'Computer Networks',
    status: 'completed',
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 9.9 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    totalMarks: 30,
    passingMarks: 12,
    totalQuestions: 15,
    proctoringLevel: 'STANDARD',
    score: 21,
    percentage: 70.0,
    rank: 18
  },
  {
    id: 'sch6',
    title: 'Artificial Intelligence & Machine Learning Midterm',
    subject: 'AI & Machine Learning',
    status: 'completed',
    startTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 14.8 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    totalQuestions: 40,
    proctoringLevel: 'STRICT',
    score: 92,
    percentage: 92.0,
    rank: 2
  },
  {
    id: 'sch7',
    title: 'Discrete Mathematics Surprise Test',
    subject: 'Discrete Mathematics',
    status: 'missed',
    startTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 19.9 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    totalMarks: 50,
    passingMarks: 20,
    totalQuestions: 15,
    proctoringLevel: 'NONE'
  },
  {
    id: 'sch8',
    title: 'Software Engineering Practice Assignment',
    subject: 'Software Engineering',
    status: 'completed',
    startTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24.9 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    totalMarks: 50,
    passingMarks: 20,
    totalQuestions: 15,
    proctoringLevel: 'NONE',
    score: 48,
    percentage: 96.0,
    rank: 1
  }
];

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  score: number;
  badges: number;
  trend: 'up' | 'down' | 'same';
  department: string;
}

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Aarav Sharma', avatar: 'AS', xp: 14520, score: 98.2, badges: 12, trend: 'same', department: 'Computer Science' },
  { rank: 2, name: 'Priya Patel', avatar: 'PP', xp: 13980, score: 96.5, badges: 11, trend: 'up', department: 'Computer Science' },
  { rank: 3, name: 'Aditya Rao', avatar: 'AR', xp: 13120, score: 94.1, badges: 10, trend: 'down', department: 'Information Technology' },
  { rank: 4, name: 'Sneha Reddy', avatar: 'SR', xp: 12900, score: 93.8, badges: 10, trend: 'up', department: 'Computer Science' },
  { rank: 5, name: 'Vikram Singh', avatar: 'VS', xp: 12750, score: 92.0, badges: 9, trend: 'down', department: 'Electronics' },
  { rank: 6, name: 'Neha Gupta', avatar: 'NG', xp: 12600, score: 91.2, badges: 9, trend: 'same', department: 'Computer Science' },
  { rank: 7, name: 'John Smith (You)', avatar: 'JS', xp: 12450, score: 90.5, badges: 8, trend: 'up', department: 'Computer Science' },
  { rank: 8, name: 'Rahul Verma', avatar: 'RV', xp: 11980, score: 89.2, badges: 8, trend: 'down', department: 'Information Technology' },
  { rank: 9, name: 'Ananya Nair', avatar: 'AN', xp: 11800, score: 88.7, badges: 7, trend: 'up', department: 'Computer Science' },
  { rank: 10, name: 'Rohan Deshmukh', avatar: 'RD', xp: 11650, score: 88.0, badges: 7, trend: 'same', department: 'Electrical' },
  { rank: 11, name: 'Meera Krishnan', avatar: 'MK', xp: 11400, score: 87.1, badges: 8, trend: 'down', department: 'Computer Science' },
  { rank: 12, name: 'Arjun Sen', avatar: 'AS', xp: 11200, score: 86.8, badges: 6, trend: 'up', department: 'Information Technology' },
  { rank: 13, name: 'Kirti Joshi', avatar: 'KJ', xp: 11050, score: 85.9, badges: 6, trend: 'same', department: 'Electronics' },
  { rank: 14, name: 'Kabir Mehta', avatar: 'KM', xp: 10900, score: 85.0, badges: 5, trend: 'down', department: 'Computer Science' },
  { rank: 15, name: 'Divya Das', avatar: 'DD', xp: 10750, score: 84.2, badges: 5, trend: 'up', department: 'Chemical' }
];

export interface AppNotification {
  id: string;
  type: 'exam' | 'result' | 'announcement' | 'system' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'exam',
    title: 'Live Exam Started!',
    description: 'Data Structures - Tree Structures & AVL exam is now active. Please join.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'n2',
    type: 'result',
    title: 'New Exam Result Published',
    description: 'You scored 85.3% (64/75) in Algorithms Midterm Examination.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'n3',
    type: 'achievement',
    title: 'New Badge Unlocked!',
    description: 'Congratulations! You unlocked the "Speed Demon" badge.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 'n4',
    type: 'announcement',
    title: 'Scheduled System Maintenance',
    description: 'ExamAI Pro will undergo database optimization tonight at 02:00 AM IST for 30 minutes.',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Device History Verification',
    description: 'New login detected from Chrome Browser on Windows PC at 172.56.24.89.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 'n6',
    type: 'exam',
    title: 'Exam Scheduled',
    description: 'Operating Systems Final Prep has been scheduled for tomorrow at 05:46 PM IST.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  subject: string;
}

export interface AchievementsProgress {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  badges: Badge[];
  certificates: Certificate[];
}

export const mockAchievements: AchievementsProgress = {
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 14,
  badges: [
    { id: 'b1', name: 'First Steps', description: 'Complete your first ever exam', icon: 'Zap', earned: true, earnedDate: '2026-05-10' },
    { id: 'b2', name: 'Speed Demon', description: 'Finish an exam in half of the total duration', icon: 'Flame', earned: true, earnedDate: '2026-07-06' },
    { id: 'b3', name: 'Perfect Score', description: 'Score exactly 100% on any practice quiz or exam', icon: 'Award', earned: true, earnedDate: '2026-06-15' },
    { id: 'b4', name: 'Study Streak', description: 'Maintain a study streak of 7 consecutive days', icon: 'TrendingUp', earned: true, earnedDate: '2026-06-25' },
    { id: 'b5', name: 'Night Owl', description: 'Complete a quiz or study material after midnight (12:00 AM)', icon: 'Clock', earned: true, earnedDate: '2026-07-02' },
    { id: 'b6', name: 'Question Master', description: 'Correctly answer over 500 practice questions', icon: 'CheckCircle', earned: true, earnedDate: '2026-07-04' },
    { id: 'b7', name: 'Top 10', description: 'Reach the top 10 rankings on the system leaderboard', icon: 'Trophy', earned: false },
    { id: 'b8', name: 'Subject Expert', description: 'Obtain an average score of 90% or above in any subject', icon: 'BookOpen', earned: false },
    { id: 'b9', name: 'Helper', description: 'Provide answers to 50 forum questions from other students', icon: 'MessageSquare', earned: false },
    { id: 'b10', name: 'AI Pioneer', description: 'Interact with the AI Tutor/Assistant more than 100 times', icon: 'Sparkles', earned: false }
  ],
  certificates: [
    { id: 'c1', title: 'Data Structures Advanced Mastery', issueDate: '2026-06-20', subject: 'Data Structures' },
    { id: 'c2', title: 'Introduction to Artificial Intelligence', issueDate: '2026-06-28', subject: 'AI & Machine Learning' },
    { id: 'c3', title: 'SQL & Database Design Foundations', issueDate: '2026-07-01', subject: 'Database Systems' }
  ]
};

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'exam' | 'study' | 'assignment' | 'live-class';
  date: string;
  time: string;
  duration: number;
  subject: string;
  color: string;
}

export const mockScheduleEvents: ScheduleEvent[] = [
  { id: 'e1', title: 'Data Structures - AVL Tree Exam', type: 'exam', date: new Date().toISOString().split('T')[0], time: '17:15', duration: 60, subject: 'Data Structures', color: '#3b82f6' },
  { id: 'e2', title: 'Group Study: Dynamic Programming', type: 'study', date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:00', duration: 90, subject: 'Algorithms', color: '#8b5cf6' },
  { id: 'e3', title: 'Operating Systems Final prep exam', type: 'exam', date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '17:46', duration: 120, subject: 'Operating Systems', color: '#3b82f6' },
  { id: 'e4', title: 'Submit Relational Algebra Assignment', type: 'assignment', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '23:59', duration: 10, subject: 'Database Systems', color: '#10b981' },
  { id: 'e5', title: 'Live Class: Machine Learning Fundamentals', type: 'live-class', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:00', duration: 120, subject: 'AI & Machine Learning', color: '#f59e0b' },
  { id: 'e6', title: 'Database Quiz 2', type: 'exam', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '15:00', duration: 30, subject: 'Database Systems', color: '#3b82f6' }
];

export interface DiscussionThread {
  id: string;
  title: string;
  author: string;
  category: 'general' | 'doubt' | 'tips' | 'subject';
  replies: number;
  views: number;
  lastActivity: string;
  tags: string[];
  solved: boolean;
}

export const mockDiscussionThreads: DiscussionThread[] = [
  { id: 't1', title: 'Help with AVL Tree Double Rotations', author: 'Sneha Reddy', category: 'doubt', replies: 8, views: 114, lastActivity: '2 mins ago', tags: ['AVL Trees', 'Rotations', 'Data Structures'], solved: true },
  { id: 't2', title: 'Quick Summary of BCNF Decomposition Steps', author: 'Sneha Reddy', category: 'tips', replies: 3, views: 56, lastActivity: '1 hour ago', tags: ['Database', 'BCNF', 'Normalization'], solved: false },
  { id: 't3', title: 'Fastest way to find minimum spanning tree manually?', author: 'Rohan Deshmukh', category: 'doubt', replies: 12, views: 189, lastActivity: '4 hours ago', tags: ['Kruskals', 'Prims', 'Algorithms'], solved: true },
  { id: 't4', title: 'Useful YouTube channels for Operating Systems concepts', author: 'Neha Gupta', category: 'tips', replies: 5, views: 90, lastActivity: '1 day ago', tags: ['OS', 'Schedules', 'Threads'], solved: false },
  { id: 't5', title: 'AI & ML End Semester Exam Dates Released', author: 'Faculty: Dr. Amit Roy', category: 'general', replies: 22, views: 405, lastActivity: '2 days ago', tags: ['Exams', 'AI & ML', 'Notice'], solved: false },
  { id: 't6', title: 'How does Dijkstra handle negative edges? (Visual proof)', author: 'Sneha Reddy', category: 'subject', replies: 15, views: 210, lastActivity: '3 days ago', tags: ['Dijkstra', 'Graphs', 'Algorithms'], solved: true }
];

export const mockAnalyticsData = {
  weeklyScores: [
    { week: 'Week 1', score: 65 },
    { week: 'Week 2', score: 72 },
    { week: 'Week 3', score: 68 },
    { week: 'Week 4', score: 75 },
    { week: 'Week 5', score: 81 },
    { week: 'Week 6', score: 79 },
    { week: 'Week 7', score: 84 },
    { week: 'Week 8', score: 90 }
  ],
  subjectAccuracy: [
    { subject: 'Data Structures', accuracy: 82 },
    { subject: 'Algorithms', accuracy: 78 },
    { subject: 'Database Systems', accuracy: 85 },
    { subject: 'OS', accuracy: 68 },
    { subject: 'Computer Networks', accuracy: 74 }
  ],
  topicPerformance: [
    { topic: 'Trees', correct: 18, total: 20 },
    { topic: 'Sorting', correct: 14, total: 20 },
    { topic: 'SQL', correct: 22, total: 25 },
    { topic: 'DP', correct: 8, total: 15 },
    { topic: 'Memory', correct: 11, total: 18 },
    { topic: 'TCP/IP', correct: 15, total: 20 },
    { topic: 'Search', correct: 16, total: 18 },
    { topic: 'Graphs', correct: 12, total: 15 }
  ],
  studyHeatmap: [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 5.0 },
    { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 6.5 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 8.0 },
    { day: 'Sun', hours: 5.5 }
  ],
  monthlyProgress: [
    { month: 'Feb', exams: 3, avgScore: 68 },
    { month: 'Mar', exams: 5, avgScore: 71 },
    { month: 'Apr', exams: 4, avgScore: 74 },
    { month: 'May', exams: 6, avgScore: 78 },
    { month: 'Jun', exams: 8, avgScore: 81 },
    { month: 'Jul', exams: 4, avgScore: 86 }
  ]
};

export const mockFacultyData = {
  examPerformance: [
    { exam: 'DS Midterm Mock', avgScore: 72, passRate: 85, students: 120 },
    { exam: 'Algo Quiz 1', avgScore: 68, passRate: 78, students: 115 },
    { exam: 'SQL Joins Practice', avgScore: 84, passRate: 92, students: 130 },
    { exam: 'OS Memory test', avgScore: 59, passRate: 64, students: 108 },
    { exam: 'Networks final', avgScore: 75, passRate: 88, students: 125 }
  ],
  questionDistribution: [
    { type: 'MCQ', count: 450 },
    { type: 'MSQ', count: 180 },
    { type: 'True/False', count: 120 },
    { type: 'Coding', count: 80 },
    { type: 'Short Answer', count: 220 },
    { type: 'Long Answer', count: 198 }
  ],
  recentResults: [
    { student: 'Aarav Sharma', exam: 'DS Midterm Mock', score: 98, status: 'passed', date: '2026-07-05' },
    { student: 'Sneha Reddy', exam: 'DS Midterm Mock', score: 92, status: 'passed', date: '2026-07-05' },
    { student: 'Neha Gupta', exam: 'DS Midterm Mock', score: 90, status: 'passed', date: '2026-07-05' },
    { student: 'John Smith', exam: 'DS Midterm Mock', score: 85, status: 'passed', date: '2026-07-05' },
    { student: 'Rohan Deshmukh', exam: 'DS Midterm Mock', score: 78, status: 'passed', date: '2026-07-05' },
    { student: 'Meera Krishnan', exam: 'Algo Quiz 1', score: 88, status: 'passed', date: '2026-07-04' },
    { student: 'Aditya Rao', exam: 'OS Memory test', score: 41, status: 'passed', date: '2026-07-03' },
    { student: 'Rahul Verma', exam: 'OS Memory test', score: 32, status: 'failed', date: '2026-07-03' }
  ]
};

export const mockAdminData = {
  systemMetrics: [
    { label: 'Active Sessions', value: 3250, unit: 'users', trend: 12 },
    { label: 'System CPU', value: 45, unit: '%', trend: -3 },
    { label: 'System Memory', value: 62, unit: '%', trend: 1 },
    { label: 'API Latency', value: 23, unit: 'ms', trend: -8 }
  ],
  userGrowth: [
    { month: 'Feb', students: 2800, faculty: 90 },
    { month: 'Mar', students: 2950, faculty: 92 },
    { month: 'Apr', students: 3100, faculty: 95 },
    { month: 'May', students: 3180, faculty: 96 },
    { month: 'Jun', students: 3220, faculty: 98 },
    { month: 'Jul', students: 3250, faculty: 102 }
  ],
  auditLog: [
    { id: 'a1', action: 'Exported Question Bank CSV', user: 'Dr. Amit Roy (Faculty)', timestamp: '2026-07-06 15:30:12', ip: '192.168.1.45' },
    { id: 'a2', action: 'Modified Exam Settings - DS Midterm', user: 'Dr. Amit Roy (Faculty)', timestamp: '2026-07-06 14:15:00', ip: '192.168.1.45' },
    { id: 'a3', action: 'Created New Course - Cloud Computing', user: 'Prof. Sarah Sen (Faculty)', timestamp: '2026-07-06 11:22:45', ip: '192.168.1.18' },
    { id: 'a4', action: 'Reset Student Password (#8492)', user: 'Admin Main', timestamp: '2026-07-06 09:05:32', ip: '10.0.0.5' },
    { id: 'a5', action: 'System Database Backup Successful', user: 'System Cron', timestamp: '2026-07-06 02:00:00', ip: 'localhost' },
    { id: 'a6', action: 'System Update v1.4.2 Deployed', user: 'Admin Main', timestamp: '2026-07-05 23:45:10', ip: '10.0.0.5' }
  ],
  violations: [
    { id: 'v1', student: 'Rahul Verma', exam: 'OS Memory test', type: 'Multiple Faces Detected', severity: 'high', timestamp: '2026-07-06 16:45:18' },
    { id: 'v2', student: 'Rohan Deshmukh', exam: 'DS Midterm Mock', type: 'Tab Switch Alert', severity: 'low', timestamp: '2026-07-05 14:32:05' },
    { id: 'v3', student: 'Aditya Rao', exam: 'OS Memory test', type: 'Looking Away from Screen', severity: 'medium', timestamp: '2026-07-03 17:50:22' },
    { id: 'v4', student: 'Vikram Singh', exam: 'Algo Quiz 1', type: 'Audio Conversation Detected', severity: 'high', timestamp: '2026-07-02 11:15:33' },
    { id: 'v5', student: 'Priya Patel', exam: 'DS Midterm Mock', type: 'Face Not Detected', severity: 'medium', timestamp: '2026-07-01 10:48:12' }
  ]
};

