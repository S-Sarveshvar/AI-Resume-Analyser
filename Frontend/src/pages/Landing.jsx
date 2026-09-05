import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from "../components/common/Button"
import Navbar from '../components/layout/Navbar'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const valueCards = [
  { icon: <ScoreIcon />, title: 'ATS Resume Analysis', desc: 'Instant compatibility scores against any job description.' },
  { icon: <SkillIcon />, title: 'Skill Gap Detection', desc: 'Identify exactly what skills you need to land the role.' },
  { icon: <RoadmapIcon />, title: 'Personalized Roadmap', desc: 'Week-by-week learning path tailored to your target job.' },
]

const features = [
  {
    icon: <AtsIcon />,
    title: 'ATS Compatibility Score',
    desc: 'Get an instant score showing how well your resume passes applicant tracking systems. Know exactly where you stand before you apply.',
  },
  {
    icon: <SkillIcon />,
    title: 'Skill Gap Analysis',
    desc: 'See the skills you have, skills the job requires, and the gap between them with clear, actionable next steps.',
  },
  {
    icon: <SuggestIcon />,
    title: 'Resume Improvement Suggestions',
    desc: 'Receive specific, numbered suggestions to quantify achievements, improve descriptions, and strengthen weak areas.',
  },
  {
    icon: <InterviewIcon />,
    title: 'Interview Readiness Score',
    desc: 'Understand your interview preparedness level and get targeted advice to walk in confident and well-prepared.',
  },
]

const processSteps = [
  { step: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF resume into the analyzer.' },
  { step: '02', title: 'Add Job Description', desc: 'Paste the target job title and full job description.' },
  { step: '03', title: 'AI Analysis', desc: 'Our AI instantly compares your profile against the role.' },
  { step: '04', title: 'Improve & Get Ready', desc: 'Follow your personalized roadmap and suggestions.' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    title: 'Backend Engineer at Stripe',
    avatar: 'PS',
    quote: 'ResumeAI identified three skill gaps I never would have caught on my own. Two weeks later I had Docker and AWS on my resume and cleared the technical screen.',
    score: 'ATS: 91%',
  },
  {
    name: 'Marcus Chen',
    title: 'Full Stack Developer at Shopify',
    avatar: 'MC',
    quote: 'The roadmap was exactly what I needed. Week-by-week learning plan, project recommendations, everything. I went from rejected to offer in six weeks.',
    score: 'ATS: 88%',
  },
  {
    name: 'Sofia Reyes',
    title: 'Data Engineer at Databricks',
    avatar: 'SR',
    quote: 'I was applying to the same roles for months with no response. After one ResumeAI session, I rewrote three bullet points and got four callbacks in a week.',
    score: 'ATS: 85%',
  },
]

const footerGroups = [
  { heading: 'Product', links: [['Features', '#features'], ['How It Works', '#how-it-works'], ['Analysis', '#analysis']] },
  { heading: 'Account', links: [['Login', '/login'], ['Register', '/register']] },
  { heading: 'Company', links: [['About', '#'], ['Privacy', '#'], ['Terms', '#']] },
]

const AUTH_TOKEN_KEYS = ['token', 'jwtToken', 'authToken', 'accessToken', 'access_token', 'jwt']

function normalizeToken(token) {
  return token?.replace(/^Bearer\s+/i, '').trim()
}

function clearStoredTokens() {
  AUTH_TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })
}

function getStoredToken() {
  for (const key of AUTH_TOKEN_KEYS) {
    const token = normalizeToken(localStorage.getItem(key) || sessionStorage.getItem(key))

    if (token) {
      return token
    }
  }

  return ''
}

async function isLoggedIn() {
  const token = getStoredToken()

  if (!token) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analysis`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401 || response.status === 403) {
      clearStoredTokens()
      return false
    }

    return response.ok || response.status === 405
  } catch {
    return false
  }
}

const Landing = () => {
  const navigate = useNavigate()
  const [checkingAction, setCheckingAction] = useState('')

  const handleProtectedNavigation = async (fallbackPath, actionName) => {
    setCheckingAction(actionName)

    const authenticated = await isLoggedIn()
    navigate(authenticated ? '/dashboard' : fallbackPath)

    setCheckingAction('')
  }

  return (
    <>
    <Navbar/>
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-container landing-hero-grid">
          <div className="landing-hero-copy">
            <div className="landing-badge">
              <span className="landing-badge-dot" />
              AI-Powered Career Intelligence
            </div>
            <h1>Turn Your Resume Into Your Career Advantage</h1>
            <p>
              Analyze your resume against any job description, discover skill gaps,
              improve your ATS score, and get a personalized roadmap to become
              interview-ready.
            </p>
            <div className="landing-actions">
              <button
                type="button"
                className="landing-primary-btn"
                onClick={() => handleProtectedNavigation('/login', 'hero-analysis')}
                disabled={checkingAction === 'hero-analysis'}
              >
                {checkingAction === 'hero-analysis' ? 'Checking...' : 'Analyze My Resume'}
                <ArrowIcon />
              </button>
              <a href="#how-it-works" className="landing-secondary-link">
                See How It Works
              </a>
            </div>
          </div>
          {/* <HeroVisual /> */}
        </div>
      </section>

      <section className="landing-value-strip">
        <div className="landing-container landing-value-grid">
          {valueCards.map(({ icon, title, desc }) => (
            <article className="landing-value-item" key={title}>
              <div className="landing-icon-box">{icon}</div>
              <div>
                <h2>{title}</h2>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="features">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to get hired"
          text="A complete AI toolkit that transforms your resume into a job-landing machine."
        />
        <div className="landing-container landing-feature-grid">
          {features.map(({ icon, title, desc }) => (
            <article className="landing-feature-card" key={title}>
              <div className="landing-feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section-white" id="how-it-works">
        <SectionHeader eyebrow="Process" title="How It Works" text="Four steps from upload to offer-ready." />
        <div className="landing-container landing-process-grid">
          {processSteps.map(({ step, title, desc }, index) => (
            <article className="landing-process-step" key={step}>
              {index < processSteps.length && <span className="landing-process-line" />}
              <div className="landing-step-number">{step}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <SectionHeader eyebrow="Testimonials" title="Loved by job seekers" text="Real people. Real results." />
        <div className="landing-container landing-testimonial-grid">
          {testimonials.map(({ name, title, avatar, quote, score }) => (
            <article className="landing-testimonial-card" key={name}>
              <div className="landing-stars" aria-label="5 star rating">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>
              <p className="landing-quote">&quot;{quote}&quot;</p>
              <div className="landing-testimonial-author">
                <div className="landing-author-group">
                  <span className="landing-avatar">{avatar}</span>
                  <div>
                    <h3>{name}</h3>
                    <p>{title}</p>
                  </div>
                </div>
                <span className="landing-score-pill">{score}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-final-cta" id="analysis">
        <div className="landing-container landing-final-inner">
          <h2>Ready to improve your next application?</h2>
          <p>Join thousands of job seekers who landed their target role with ResumeAI.</p>
          <button
            type="button"
            className="landing-primary-btn"
            onClick={() => handleProtectedNavigation('/login', 'final-analysis')}
            disabled={checkingAction === 'final-analysis'}
          >
            {checkingAction === 'final-analysis' ? 'Checking...' : 'Start Your Analysis'}
            <ArrowIcon />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-grid">
          <div>
            <div className="landing-footer-logo">
              <span><LogoMark /></span>
              ResumeAI
            </div>
            <p>AI-powered resume analysis and career readiness for modern job seekers.</p>
            <div className="landing-social-links">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" aria-label={social}>
                  <SocialIcon />
                </a>
              ))}
            </div>
          </div>
          {footerGroups.map(({ heading, links }) => (
            <div className="landing-footer-group" key={heading}>
              <h3>{heading}</h3>
              {links.map(([label, href]) => (
                href.startsWith('#') ? (
                  <a key={label} href={href}>{label}</a>
                ) : (
                  <button
                    type="button"
                    key={label}
                    onClick={() => handleProtectedNavigation(href, label)}
                    disabled={checkingAction === label}
                  >
                    {label}
                  </button>
                )
              ))}
            </div>
          ))}
        </div>
        <div className="landing-container landing-footer-bottom">
          <p>Copyright 2026 ResumeAI, Inc. All rights reserved.</p>
          <p>Built to help you land your dream job.</p>
        </div>
      </footer>
    </main>
    </>
  )
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="landing-section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function LogoMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M2 2h11v2H2V2zm0 4h7v2H2V6zm0 4h9v2H2v-2z" fill="currentColor" />
      <circle cx="12" cy="11" r="2.5" fill="#93c5fd" />
    </svg>
  )
}

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function ScoreIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SkillIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" /><path d="M9 9v3M7.5 10.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}

function RoadmapIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function AtsIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M5 9l2.5 2.5L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SuggestIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2L10.8 6.5L16 7.3l-3.5 3.4.8 4.8L9 13.2l-4.3 2.3.8-4.8L2 7.3l5.2-.8L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
}

function InterviewIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}


function StarIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1l1.5 3.5L12 5.5l-2.5 2.5.7 3.5L7 9.8 4 11.5l.6-3.5L2 5.5l3.5-1L7 1z" fill="currentColor" /></svg>
}

function SocialIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><rect x="1.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.1" /></svg>
}

export default Landing





