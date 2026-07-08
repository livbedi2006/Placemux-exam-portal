'use client';
import { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Tag, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Filter, 
  ChevronRight,
  User,
  ArrowLeft,
  Send
} from 'lucide-react';
import { mockDiscussionThreads, DiscussionThread } from '@/lib/db-mock';

export default function DiscussionPage() {
  const [threads, setThreads] = useState<DiscussionThread[]>(mockDiscussionThreads);
  const [category, setCategory] = useState<'all' | 'general' | 'doubt' | 'tips' | 'subject'>('all');
  const [search, setSearch] = useState('');
  
  // Selected Thread Detail View
  const [activeThread, setActiveThread] = useState<DiscussionThread | null>(null);
  const [newReply, setNewReply] = useState('');
  
  // Hardcoded thread replies for simulation
  const threadReplies: Record<string, { author: string; role: string; text: string; date: string; likes: number }[]> = {
    't1': [
      { author: 'Faculty: Dr. Amit Roy', role: 'Professor', text: 'Excellent doubt. Remember, in AVL Trees, a double rotation (LR or RL) is simply two consecutive single rotations. A left rotation is performed on the child, followed by a right rotation on the parent.', date: '1 hour ago', likes: 14 },
      { author: 'Neha Gupta', role: 'Student', text: 'Oh! That makes sense! The visual representation in the course materials was a bit confusing but this explains it simply.', date: '35 mins ago', likes: 3 }
    ],
    't3': [
      { author: 'Priya Patel', role: 'Student', text: 'For Kruskal\'s, sort all edges first and then pick the smallest edges that don\'t form a cycle. For Prim\'s, start from a single vertex and expand to adjacent nodes with minimum weights.', date: '3 hours ago', likes: 8 },
      { author: 'Aditya Rao', role: 'Student', text: 'You should use Disjoint Set Union (DSU) to efficiently check for cycles in Kruskal\'s algorithm.', date: '2 hours ago', likes: 11 }
    ],
    't6': [
      { author: 'Faculty: Prof. Sarah Sen', role: 'Professor', text: 'Dijkstra does not work with negative weight edges because it greedily assumes that the shortest path to a node is finalized once it is visited. A negative edge found later could provide a shorter path, breaking this assumption.', date: '2 days ago', likes: 25 }
    ]
  };

  const activeReplies = activeThread ? (threadReplies[activeThread.id] || []) : [];

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !activeThread) return;
    
    // Simulate adding reply
    alert('Your reply has been submitted successfully.');
    setNewReply('');
  };

  const handleCreateThread = () => {
    alert('Create thread panel coming soon! Utilize this workspace to collaborate.');
  };

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = category === 'all' || thread.category === category;
    const matchesSearch = 
      thread.title.toLowerCase().includes(search.toLowerCase()) ||
      thread.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '3rem' }}>
      {!activeThread ? (
        <>
          {/* Main Forum View */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--brand-600), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Collaborative Discussion Forum
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                Ask questions, post conceptual tips, and solve syllabus doubts with peers and faculty advisors.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleCreateThread}>
              <Plus size={16} /> New Thread
            </button>
          </div>

          {/* Filters and Search */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {(['all', 'general', 'doubt', 'tips', 'subject'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm ${category === tab ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCategory(tab)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="input-group" style={{ maxWidth: '320px', width: '100%' }}>
              <Search className="input-icon" size={16} />
              <input
                type="text"
                className="input"
                placeholder="Search threads or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Thread List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredThreads.map((thread) => (
              <div 
                key={thread.id} 
                className="card" 
                onClick={() => setActiveThread(thread)}
                style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{thread.category}</span>
                    {thread.solved && (
                      <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>
                        <CheckCircle2 size={10} /> Solved
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {thread.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {thread.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>#{tag}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Posted by <b>{thread.author}</b> • {thread.lastActivity}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', minWidth: '45px' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, display: 'block' }}>{thread.replies}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Replies</span>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '45px' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block' }}>{thread.views}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Views</span>
                  </div>
                  <ChevronRight size={20} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Thread View */
        <div className="card" style={{ padding: '2rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveThread(null)} style={{ marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Back to Forum
          </button>

          {/* Original Post */}
          <div style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>{activeThread.category.toUpperCase()}</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{activeThread.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeThread.tags.map((tag, i) => (
                  <span key={i} className="badge badge-gray" style={{ fontSize: '0.75rem' }}>#{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', fontWeight: 700, justifyContent: 'center' }}>
                {activeThread.author.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{activeThread.author}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Posted {activeThread.lastActivity}</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Hey everyone, I'm working through the test prep and came across this syllabus topic. I'm finding the core decomposition steps a bit tricky. Could anyone offer a quick summary or structural guidelines? Much appreciated!
            </p>
          </div>

          {/* Replies Section */}
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Replies ({activeReplies.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {activeReplies.map((reply, i) => (
              <div key={i} style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', borderLeft: reply.role === 'Professor' ? '4px solid var(--accent-purple)' : '1px solid var(--border-default)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{reply.author}</span>
                    <span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{reply.role}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{reply.date}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {reply.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  <ThumbsUp size={12} />
                  <span>{reply.likes} Likes</span>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleAddReply}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Post a Reply</label>
            <textarea 
              className="input" 
              rows={4} 
              placeholder="Provide a constructive reply, explanation steps or resources..." 
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              style={{ resize: 'vertical', marginBottom: '1rem' }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">
                <Send size={14} /> Submit Reply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
