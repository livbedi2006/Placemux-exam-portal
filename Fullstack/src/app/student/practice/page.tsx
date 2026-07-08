'use client';

import Link from 'next/link';
import {
  Brain, Zap, BookOpen, MessageCircle,
  FlipHorizontal, Target, RefreshCw, Star,
  Clock, TrendingUp, Award, ChevronRight
} from 'lucide-react';

const AI_FEATURES = [
  {
    href: '/student/practice/quiz',
    icon: Zap,
    title: 'AI Quiz Generator',
    desc: 'Instantly generate a personalized quiz based on your weak topics and preferred difficulty.',
    color: 'from-amber-500 to-orange-500',
    badge: 'HOT',
    badgeColor: 'badge-amber',
  },
  {
    href: '/student/practice/chat',
    icon: MessageCircle,
    title: 'AI Doubt Solver',
    desc: 'Ask any academic question and get instant, step-by-step explanations from your AI tutor.',
    color: 'from-blue-500 to-cyan-500',
    badge: 'LIVE',
    badgeColor: 'badge-blue',
  },
  {
    href: '/student/practice/flashcards',
    icon: FlipHorizontal,
    title: 'AI Flashcard Generator',
    desc: 'Turn any topic into a set of smart revision flashcards using AI-generated Q&A pairs.',
    color: 'from-purple-500 to-pink-500',
    badge: 'NEW',
    badgeColor: 'badge-purple',
  },
  {
    href: '/student/practice/adaptive',
    icon: Target,
    title: 'Adaptive Practice Session',
    desc: 'A smart practice session that adjusts question difficulty in real-time based on your performance.',
    color: 'from-emerald-500 to-teal-500',
    badge: 'AI',
    badgeColor: 'badge-green',
  },
  {
    href: '/student/practice/daily',
    icon: RefreshCw,
    title: 'Daily AI Practice Set',
    desc: 'A fresh set of AI-curated questions every day, tailored to your learning progress.',
    color: 'from-rose-500 to-pink-500',
    badge: 'DAILY',
    badgeColor: 'badge-red',
  },
  {
    href: '/student/practice/revision',
    icon: BookOpen,
    title: 'Smart Revision',
    desc: 'Revisit questions you got wrong, bookmarked, or flagged for review — with AI-generated hints.',
    color: 'from-indigo-500 to-blue-500',
    badge: 'SMART',
    badgeColor: 'badge-blue',
  },
];

const QUICK_STATS = [
  { label: 'Questions Practiced', value: '248', icon: Target, color: 'text-blue-500' },
  { label: 'Current Streak', value: '7 days', icon: Star, color: 'text-amber-500' },
  { label: 'Avg. Score', value: '78%', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Time Practiced', value: '14h 30m', icon: Clock, color: 'text-purple-500' },
  { label: 'AI Sessions', value: '32', icon: Brain, color: 'text-pink-500' },
  { label: 'Badges Earned', value: '9', icon: Award, color: 'text-orange-500' },
];

export default function PracticePage() {
  return (
    <div className="flex flex-col gap-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="text-purple-500" size={28} />
          AI Practice Center
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Six AI-powered modes to sharpen your skills, fix weak areas, and track growth.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {QUICK_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-[var(--text-secondary)] text-xs font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="text-base font-bold mb-4">Choose Your Practice Mode</h2>
        <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {AI_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link
                key={i}
                href={feature.href}
                className="card p-5 flex flex-col gap-4 group hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <span className={`badge ${feature.badgeColor}`}>{feature.badge}</span>
                </div>
                <div>
                  <div className="font-bold text-base mb-1">{feature.title}</div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--brand-500)] mt-auto">
                  Start Now <ChevronRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
