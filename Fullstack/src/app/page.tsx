'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain, Shield, BarChart2, Trophy, Zap, Users, BookOpen, Target, Star,
  ChevronDown, ArrowRight, Sparkles, Play,
  GraduationCap, Award, Sun, Moon, Check
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useTheme } from '@/components/providers/ThemeProvider';
import styles from './landing.module.css';

const features = [
  {
    icon: Brain,
    title: 'AI Study Assistant',
    desc: 'Get instant answers, personalized explanations, and AI-generated study materials tailored to your learning style.',
    color: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
  },
  {
    icon: Shield,
    title: 'AI Proctoring',
    desc: 'Advanced real-time proctoring with face detection, eye tracking, and behavior analysis ensuring exam integrity.',
    color: 'linear-gradient(135deg, #2563eb, #3b82f6)',
  },
  {
    icon: Target,
    title: 'Adaptive Questions',
    desc: 'Smart recommendation engine that adapts question difficulty based on your performance and learning curve.',
    color: 'linear-gradient(135deg, #059669, #10b981)',
  },
  {
    icon: BarChart2,
    title: 'Deep Analytics',
    desc: 'Comprehensive dashboards with subject-wise, topic-wise, and time-based performance analytics and insights.',
    color: 'linear-gradient(135deg, #0891b2, #06b6d4)',
  },
  {
    icon: Trophy,
    title: 'Gamification',
    desc: 'Stay motivated with XP points, badges, leaderboards, streaks, and daily challenges that make learning fun.',
    color: 'linear-gradient(135deg, #d97706, #f59e0b)',
  },
  {
    icon: Zap,
    title: 'Instant Evaluation',
    desc: 'Auto-grading with AI for subjective answers, instant feedback, and detailed mistake analysis after every exam.',
    color: 'linear-gradient(135deg, #dc2626, #ef4444)',
  },
  {
    icon: BookOpen,
    title: 'Smart Learning Paths',
    desc: 'AI-curated personalized learning paths based on your goals, weak areas, and preferred study schedule.',
    color: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  },
  {
    icon: Users,
    title: 'Multi-Role Platform',
    desc: 'Separate powerful dashboards for Students, Faculty, Admin, and Super Admin with granular controls.',
    color: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  },
  {
    icon: GraduationCap,
    title: 'Certificates & Badges',
    desc: 'Auto-generated digital certificates on exam completion, shareable on LinkedIn and academic portfolios.',
    color: 'linear-gradient(135deg, #059669, #2563eb)',
  },
];

const testimonials = [
  {
    text: 'ExamAI Pro completely transformed how I prepare for exams. The AI study assistant helped me identify weak areas I never knew I had. My scores improved by 35% in just 2 months!',
    name: 'Priya Sharma',
    role: 'CS Student, IIT Delhi',
    color: '#7c3aed',
    rating: 5,
  },
  {
    text: 'As a faculty member, I can now create exams in minutes instead of hours. The AI proctoring system is incredibly accurate and the analytics help me understand student performance trends.',
    name: 'Dr. Rajesh Kumar',
    role: 'Professor, Delhi University',
    color: '#2563eb',
    rating: 5,
  },
  {
    text: 'The gamification features are genius! Students are actually competing with each other to study more. Attendance and engagement went up 60% since we implemented ExamAI Pro.',
    name: 'Sarah Johnson',
    role: 'Academic Director, MIT',
    color: '#059669',
    rating: 5,
  },
];

const pricing = [
  {
    name: 'Student',
    price: '₹0',
    period: 'Free forever',
    featured: false,
    features: ['5 Exams/month', 'Basic AI Assistant', 'Performance Dashboard', 'Study Streak Tracker', 'Badges & XP System', 'Community Access'],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '₹499',
    period: 'per month',
    featured: true,
    features: ['Unlimited Exams', 'Advanced AI Assistant', 'AI Proctoring', 'Full Analytics Suite', 'Custom Learning Paths', 'Priority Support', 'AI-Generated Notes', 'Certificate Downloads'],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Institution',
    price: '₹9,999',
    period: 'per month',
    featured: false,
    features: ['Unlimited Students', 'Faculty Management', 'Custom Branding', 'SSO Integration', 'API Access', 'Dedicated Support', 'Advanced Proctoring', 'LMS Integration'],
    cta: 'Contact Sales',
  },
];

const faqs = [
  { q: 'How does the AI Proctoring work?', a: 'Our AI proctoring uses computer vision to monitor students via webcam, detecting face presence, multiple faces, unusual eye movements, and off-screen activity in real time without any human intervention.' },
  { q: 'Is ExamAI Pro suitable for all academic levels?', a: 'Yes! ExamAI Pro supports K-12, undergraduate, postgraduate, and professional certification exams. The adaptive difficulty engine adjusts to any level.' },
  { q: 'How is the AI Study Assistant different from ChatGPT?', a: 'Our AI assistant is specialized for exam preparation—it gives hints instead of direct answers, tracks your mistakes, generates targeted quizzes, and builds upon your exam history for personalized guidance.' },
  { q: 'Can we integrate ExamAI Pro with our existing LMS?', a: 'Absolutely. We support integrations with Moodle, Canvas, Blackboard, and any LMS via our REST API and LTI 1.3 standard.' },
  { q: 'Is student data secure and GDPR compliant?', a: 'Yes. All data is encrypted at rest and in transit. We are GDPR, FERPA, and ISO 27001 compliant. Student data is never sold or shared with third parties.' },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <div className={styles.navLogoIcon}>E</div>
            <span className={styles.navLogoText}>ExamAI Pro</span>
          </Link>
          <div className={styles.navLinks}>
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
              <button
                key={item}
                className={styles.navLink}
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              >
                {item}
              </button>
            ))}
          </div>
          <div className={styles.navActions}>
            <button className={`btn btn-ghost btn-sm ${styles.navLink}`} onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link href="/auth/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className="container">
          <div className={styles.heroContent}>
            <div>
              <div className={styles.heroEyebrow}>
                <div className={styles.heroDot} />
                Powered by Gemini AI & Advanced ML
              </div>
              <h1 className={styles.heroTitle}>
                The Future of <br />
                <span className={styles.heroGradWord}>Smart Examinations</span>
                <br /> is Here
              </h1>
              <p className={styles.heroDesc}>
                ExamAI Pro combines AI-powered personalized learning, adaptive question recommendation,
                real-time proctoring, and gamified engagement in one premium platform.
              </p>
              <div className={styles.heroCTA}>
                <Link href="/auth/register" className="btn btn-primary btn-lg">
                  <Sparkles size={18} /> Start for Free
                </Link>
                <Link href="/student" className="btn btn-secondary btn-lg">
                  <Play size={16} /> View Demo
                </Link>
              </div>
              <div className={styles.heroStats}>
                {[
                  { num: 50000, suffix: '+', label: 'Students' },
                  { num: 98, suffix: '%', label: 'Satisfaction' },
                  { num: 500, suffix: '+', label: 'Institutions' },
                  { num: 2000000, suffix: '+', label: 'Questions' },
                ].map(s => (
                  <div key={s.label} className={styles.heroStat}>
                    <span className={styles.heroStatNum}><AnimatedCounter end={s.num} suffix={s.suffix} /></span>
                    <span className={styles.heroStatLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className={styles.heroVisual}>
              <div className={styles.heroCardGlow} />
              <div className={styles.heroCard}>
                <div className={styles.heroMockHeader}>
                  <div className={styles.heroMockDots}>
                    <div className={styles.heroMockDot} style={{ background: '#ef4444' }} />
                    <div className={styles.heroMockDot} style={{ background: '#f59e0b' }} />
                    <div className={styles.heroMockDot} style={{ background: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>Student Dashboard</span>
                </div>
                <div className={styles.heroMockStats}>
                  {[{ val: '92%', lbl: 'Avg Score', color: '#10b981' }, { val: '#3', lbl: 'Rank', color: '#f59e0b' }, { val: '🔥 30', lbl: 'Day Streak', color: '#ef4444' }].map(s => (
                    <div key={s.lbl} className={styles.heroMockStat}>
                      <div className={styles.heroMockVal} style={{ color: s.color }}>{s.val}</div>
                      <div className={styles.heroMockLbl}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.heroMockBar}>
                  {[{ label: 'Data Structures', pct: 85, color: '#2563eb' }, { label: 'Algorithms', pct: 72, color: '#7c3aed' }, { label: 'Networks', pct: 91, color: '#10b981' }, { label: 'OS', pct: 63, color: '#f59e0b' }].map(b => (
                    <div key={b.label} className={styles.heroMockBarItem}>
                      <span className={styles.heroMockBarLabel}>{b.label}</span>
                      <div className={styles.heroMockBarTrack}>
                        <div className={styles.heroMockBarFill} style={{ width: `${b.pct}%`, background: b.color }} />
                      </div>
                      <span className={styles.heroMockBarVal}>{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badges */}
              <div className={`${styles.floatingBadge} ${styles.floatingBadge1}`}>
                <Trophy size={14} style={{ color: '#f59e0b' }} /> AI Score: 94%
              </div>
              <div className={`${styles.floatingBadge} ${styles.floatingBadge2}`}>
                <Shield size={14} style={{ color: '#10b981' }} /> Exam Proctored
              </div>
              <div className={`${styles.floatingBadge} ${styles.floatingBadge3}`}>
                <Zap size={14} style={{ color: '#8b5cf6' }} /> +500 XP Earned!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-py" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className={styles.sectionLabel}><Sparkles size={12} /> Features</div>
            <h2 className={styles.sectionHeading}>Everything You Need to<br /><span className="gradient-text">Excel in Examinations</span></h2>
            <p className={styles.sectionSubheading}>A complete AI-powered ecosystem built for students, educators, and institutions to deliver world-class examination experiences.</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIconWrap} style={{ background: f.color }}>
                    <Icon size={20} />
                  </div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-py">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className={styles.sectionLabel}><Star size={12} /> Testimonials</div>
            <h2 className={styles.sectionHeading}>Loved by <span className="gradient-text">50,000+ Students</span><br />& 500+ Institutions</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map(t => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.starsRow}>
                  {Array.from({length: t.rating}).map((_, i) => <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                </div>
                <div className={styles.testimonialQuote}>&ldquo;</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: t.color }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-py" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className={styles.sectionLabel}><Award size={12} /> Pricing</div>
            <h2 className={styles.sectionHeading}>Simple, Transparent<br /><span className="gradient-text">Pricing for Everyone</span></h2>
            <p className={styles.sectionSubheading}>Start free and scale as you grow. No hidden fees, no credit card required.</p>
          </div>
          <div className={styles.pricingGrid}>
            {pricing.map(plan => (
              <div key={plan.name} className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}>
                {plan.featured && <div className={styles.featuredBadge}>Most Popular</div>}
                <div className={styles.pricingName} style={{ color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>{plan.name}</div>
                <div className={styles.pricingPrice} style={{ color: plan.featured ? 'white' : 'var(--text-primary)' }}>{plan.price}</div>
                <div className={styles.pricingPeriod} style={{ color: plan.featured ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}>{plan.period}</div>
                <div className={styles.pricingFeatures}>
                  {plan.features.map(feat => (
                    <div key={feat} className={styles.pricingFeature} style={{ color: plan.featured ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)' }}>
                      <Check className={styles.checkIcon} style={{ color: plan.featured ? '#86efac' : 'var(--accent-emerald)' }} />
                      {feat}
                    </div>
                  ))}
                </div>
                <Link
                  href="/auth/register"
                  className={plan.featured ? 'btn btn-lg w-full' : 'btn btn-secondary btn-lg w-full'}
                  style={plan.featured ? { background: 'white', color: '#1d4ed8', width: '100%', fontWeight: 700 } : { width: '100%' }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-py">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className={styles.sectionLabel}>FAQ</div>
            <h2 className={styles.sectionHeading}>Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  {faq.q}
                  <ChevronDown className={`${styles.faqChevron} ${openFaq === idx ? styles.faqChevronOpen : ''}`} />
                </button>
                {openFaq === idx && <div className={styles.faqAnswer}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="container">
        <div className={styles.ctaSection}>
          <div className={styles.ctaBg} />
          <h2 className={styles.ctaTitle}>Ready to Transform<br />Your Exam Experience?</h2>
          <p className={styles.ctaDesc}>Join 50,000+ students and 500+ institutions already using ExamAI Pro to achieve better results.</p>
          <div className={styles.ctaActions}>
            <Link href="/auth/register" className="btn btn-lg" style={{ background: 'white', color: '#1d4ed8', fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
              <Sparkles size={18} /> Start Free Today
            </Link>
            <Link href="/student" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Play size={16} /> View Live Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.navLogo}>
                <div className={styles.navLogoIcon}>E</div>
                <span className={styles.navLogoText}>ExamAI Pro</span>
              </Link>
              <p className={styles.footerDesc}>The most advanced AI-powered examination platform for students, educators, and institutions worldwide.</p>
              <div className={styles.footerSocials}>
                {['Li', 'Tw', 'Gh', 'Yt'].map(s => (
                  <div key={s} className={styles.footerSocialBtn}>{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Changelog', 'Status'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR', 'Security'] },
            ].map(col => (
              <div key={col.title} className={styles.footerCol}>
                <div className={styles.footerColTitle}>{col.title}</div>
                <div className={styles.footerLinks}>
                  {col.links.map(l => <a key={l} className={styles.footerLink}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>© 2026 ExamAI Pro. All rights reserved. Built with ❤️ for Education.</span>
            <span className={styles.footerCopy}>Made in India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </>
  );
}
