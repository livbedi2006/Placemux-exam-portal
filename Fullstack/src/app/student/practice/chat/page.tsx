'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Loader2, Sparkles, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SAMPLE_RESPONSES: Record<string, string> = {
  default: "Great question! Let me break this down for you step by step. This is a core concept you'll encounter frequently in your studies.",
  'binary search': "**Binary Search** works by repeatedly halving the search space:\n\n1. Start with the full sorted array.\n2. Compare the target with the **middle element**.\n3. If equal → found! If target < middle → search left half. If target > middle → search right half.\n4. Repeat until found or range is empty.\n\n**Time Complexity:** O(log n) | **Space:** O(1) iterative\n\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n```",
  'neural network': "**Neural Networks** are inspired by biological neurons:\n\n🔹 **Input Layer** — receives raw data (pixels, text tokens, etc.)\n🔹 **Hidden Layers** — learn abstract patterns through weighted connections\n🔹 **Output Layer** — produces the final prediction\n\n**Key Formula:** output = activation(W·x + b)\n- W = weights, x = input, b = bias\n\nCommon activations: ReLU (hidden), Softmax (multi-class output)\n\nTraining uses **backpropagation** + **gradient descent** to minimize loss.",
  'sql': "**SQL (Structured Query Language)** is used to interact with relational databases.\n\n**Core commands:**\n```sql\n-- SELECT: retrieve data\nSELECT name, score FROM students WHERE score > 80;\n\n-- INSERT: add data\nINSERT INTO students (name, score) VALUES ('Alice', 95);\n\n-- UPDATE: modify data\nUPDATE students SET score = 90 WHERE name = 'Alice';\n\n-- DELETE: remove data\nDELETE FROM students WHERE score < 40;\n```\n\n**Joins:** INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN combine multiple tables.",
  'recursion': "**Recursion** is when a function calls itself with a smaller input.\n\n**Two essential parts:**\n1. **Base Case** — stops the recursion (e.g., n == 0)\n2. **Recursive Case** — breaks problem into smaller version\n\n```python\ndef factorial(n):\n    if n == 0: return 1        # Base case\n    return n * factorial(n-1)  # Recursive case\n```\n\nFactorial(4) → 4 × 3 × 2 × 1 = **24**\n\n⚠️ Always define a base case or you'll get a **Stack Overflow** error!",
};

const SUGGESTIONS = [
  'Explain Binary Search with an example',
  'How do Neural Networks work?',
  'Explain SQL JOIN types',
  'What is recursion and how does it work?',
  'Explain time complexity with examples',
  'What is the difference between RAM and ROM?',
];

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(SAMPLE_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }
  return SAMPLE_RESPONSES.default + `\n\nRegarding your question about **"${message}"**:\n\nThis topic involves several key concepts. In a fully-connected AI backend (with your FastAPI + LLM integration), this would return a comprehensive, personalized explanation based on your learning profile and curriculum.\n\n💡 **Pro Tip:** Try asking about specific concepts like "Binary Search", "Neural Networks", or "SQL" to see detailed AI explanations with code examples!`;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const lines = message.content.split('\n');
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-up`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-[var(--brand-500)]' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-[var(--brand-500)] text-white rounded-tr-sm' : 'bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-tl-sm'}`}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono" style={{ fontFamily: 'inherit' }}>
          {lines.map((line, i) => {
            if (line.startsWith('```')) return null;
            if (line.startsWith('**') && line.endsWith('**')) {
              return <strong key={i} className="block font-bold">{line.replace(/\*\*/g, '')}</strong>;
            }
            if (line.startsWith('🔹') || line.startsWith('⚠️') || line.startsWith('💡')) {
              return <p key={i} className="my-1">{line}</p>;
            }
            return <span key={i}>{line}{i < lines.length - 1 && '\n'}</span>;
          })}
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-[var(--text-tertiary)]'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your AI Doubt Solver powered by ExamAI Pro.\n\nAsk me anything about your subjects — I'll explain concepts, solve problems step-by-step, and provide code examples.\n\nTry one of the suggestions below to get started!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: new Date() }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    setMessages(prev => [...prev, { role: 'assistant', content: getAIResponse(msg), timestamp: new Date() }]);
    setLoading(false);
  };

  const clearChat = () => setMessages([{
    role: 'assistant',
    content: "Chat cleared! Ask me anything about your studies.",
    timestamp: new Date(),
  }]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
            <MessageCircle size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Doubt Solver</h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500">
              <span className="pulse-dot" style={{ width: 6, height: 6 }}></span>
              <span className="font-medium">AI Tutor Online</span>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="btn btn-secondary btn-sm">
          <RotateCcw size={14} /> Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto card p-4 flex flex-col gap-4 mb-4">
        {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
        {loading && (
          <div className="flex gap-3 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="card px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[var(--brand-500)]" />
              <span className="text-sm text-[var(--text-secondary)]">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}
              className="badge badge-blue cursor-pointer hover:bg-[var(--brand-500)]/20 transition-colors text-xs py-1.5 px-3">
              <Sparkles size={10} /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask any academic question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn btn-primary px-4">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
