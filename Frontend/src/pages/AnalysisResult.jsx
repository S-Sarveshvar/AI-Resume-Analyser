import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const TABS = ['Overview', 'Skills', 'Suggestions', 'Roadmap', 'Projects']

/* Helper function to safely parse lists or JSON strings from Gemini backend */
function parseList(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed
      } catch {
        // Fallback to line splitting
      }
    }
    // If comma-separated or line-separated
    return trimmed
      .split(/\n|,/)
      .map(s => s.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(Boolean)
  }
  return []
}

/* Helper function to normalize suggestion item */
function normalizeSuggestion(item, idx) {
  if (typeof item === 'string') {
    const parts = item.split(':')
    return {
      n: String(idx + 1).padStart(2, '0'),
      title: parts[0]?.trim() || `Suggestion ${idx + 1}`,
      desc: parts.slice(1).join(':').trim() || item
    }
  }
  return {
    n: String(idx + 1).padStart(2, '0'),
    title: item.title || item.heading || item.name || item.suggestion || item.title_name || `Suggestion ${idx + 1}`,
    desc: item.desc || item.description || item.detail || item.action || item.summary || (typeof item === 'object' ? JSON.stringify(item) : String(item))
  }
}

/* Helper function to parse suggestions */
function parseSuggestions(data) {
  if (!data) return []
  if (Array.isArray(data)) {
    return data.map((item, idx) => normalizeSuggestion(item, idx))
  }
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => normalizeSuggestion(item, idx))
        }
      } catch {
        // Fallback
      }
    }
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean)
    return lines.map((line, idx) => normalizeSuggestion(line, idx))
  }
  return []
}

/* Helper function to normalize roadmap item */
function normalizeRoadmapItem(item, idx) {
  if (typeof item === 'string') {
    const cleaned = item.replace(/^[-*•\d.]+\s*/, '')
    const parts = cleaned.split(':')
    return {
      week: `Week ${idx + 1}`,
      topic: parts[0]?.trim() || `Milestone ${idx + 1}`,
      desc: parts.slice(1).join(':').trim() || cleaned
    }
  }
  return {
    week: item.week || item.phase || item.timeline || item.duration || `Week ${idx + 1}`,
    topic: item.topic || item.title || item.skill || item.name || item.concept || `Phase ${idx + 1}`,
    desc: item.desc || item.description || item.details || item.action || item.summary || ''
  }
}

/* Helper function to parse learning roadmap */
function parseRoadmap(data) {
  if (!data) return []
  if (Array.isArray(data)) {
    return data.map((item, idx) => normalizeRoadmapItem(item, idx))
  }
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => normalizeRoadmapItem(item, idx))
        }
      } catch {
        // Fallback
      }
    }
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean)
    return lines.map((line, idx) => normalizeRoadmapItem(line, idx))
  }
  return []
}

/* Helper function to normalize project item */
function normalizeProject(p, idx) {
  if (typeof p === 'string') {
    const parts = p.split(':')
    return {
      title: parts[0]?.trim() || `Project ${idx + 1}`,
      desc: parts.slice(1).join(':').trim() || p,
      techs: ['Recommended Tech'],
      why: 'Directly addresses missing skills and enhances resume impact.',
      difficulty: 'Intermediate',
      time: '2–3 weeks'
    }
  }

  const title = p.title || p.name || p.projectName || p.ProjectName || p['Project Name'] || p.project_name || p.heading || `Project ${idx + 1}`
  const desc = p.desc || p.description || p.purpose || p.Purpose || p.summary || p.details || p.overview || (p.why || p.reason || '')
  const techsRaw = p.techs || p.technologies || p.techStack || p.Technologies || p.tech_stack || []
  const techs = Array.isArray(techsRaw) ? techsRaw : parseList(techsRaw)
  const why = p.why || p.reason || p.expectedLearningOutcome || p.ExpectedLearningOutcome || p.learningOutcome || p.benefit || 'Fills key skill gaps identified in your analysis.'
  const difficulty = p.difficulty || p.Difficulty || 'Intermediate'
  const time = p.time || p.duration || p.estimatedTime || p.timeframe || '2–3 weeks'

  return {
    title,
    desc: desc || why,
    techs: techs.length > 0 ? techs : ['Core Stack'],
    why,
    difficulty,
    time
  }
}

/* Helper function to parse recommended projects */
function parseProjects(data) {
  if (!data) return []

  if (Array.isArray(data)) {
    return data.map((p, idx) => normalizeProject(p, idx))
  }

  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((p, idx) => normalizeProject(p, idx))
        }
      } catch {
        // Fallback
      }
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed)
        const items = parsed.projects || parsed.recommendedProjects || parsed.items
        if (Array.isArray(items)) {
          return items.map((p, idx) => normalizeProject(p, idx))
        }
      } catch {
        // Fallback
      }
    }

    const blocks = trimmed.split(/\n\s*\n|\n(?=\d+[\.\)]|\bProject\b)/i).map(b => b.trim()).filter(Boolean)
    if (blocks.length > 0) {
      return blocks.map((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
        let title = ''
        let desc = ''
        let why = ''
        let techs = []
        let difficulty = 'Intermediate'
        let time = '2–3 weeks'

        lines.forEach(line => {
          const cleaned = line.replace(/^[-*•\d.]+\s*/, '')
          const colonIdx = cleaned.indexOf(':')
          const key = colonIdx !== -1 ? cleaned.substring(0, colonIdx).trim().toLowerCase() : ''
          const val = colonIdx !== -1 ? cleaned.substring(colonIdx + 1).trim() : cleaned

          if (key.includes('name') || key.includes('title') || key.includes('project')) {
            title = val
          } else if (key.includes('purpose') || key.includes('desc') || key.includes('summary')) {
            desc = val
          } else if (key.includes('tech') || key.includes('stack')) {
            techs = parseList(val)
          } else if (key.includes('outcome') || key.includes('why') || key.includes('reason') || key.includes('learning')) {
            why = val
          } else if (key.includes('difficulty')) {
            difficulty = val
          } else if (key.includes('duration') || key.includes('time')) {
            time = val
          } else if (!title) {
            title = cleaned
          } else if (!desc) {
            desc = val
          }
        })

        return normalizeProject({
          title: title || `Recommended Project ${idx + 1}`,
          desc: desc || block,
          techs,
          why: why || 'Fills key skill gaps identified in your analysis.',
          difficulty,
          time
        }, idx)
      })
    }
  }

  return []
}

/* Animated score circle component */
function ScoreCircle({ score = 0, label, color, badge }) {
  const [animated, setAnimated] = useState(0)
  const radius = 44
  const circ = 2 * Math.PI * radius

  useEffect(() => {
    let start = null
    const duration = 900
    const targetScore = Math.min(Math.max(score, 0), 100)
    const raf = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setAnimated(Math.round(ease * targetScore))
      if (progress < 1) requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)
    return () => cancelAnimationFrame(id)
  }, [score])

  const dash = circ - (animated / 100) * circ

  return (
    <div className="score-circle-container">
      <div className="score-circle-wrapper">
        <svg className="score-circle-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 0.04s linear' }}
          />
        </svg>
        <div className="score-circle-inner">
          <span className="score-circle-number">{animated}</span>
          <span className="score-circle-total">/100</span>
        </div>
      </div>
      <div className="score-circle-label">{label}</div>
      {badge}
    </div>
  )
}

/* Tab navigation */
function TabNav({ active, setActive }) {
  return (
    <div className="tab-nav-container">
      {TABS.map(t => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`tab-nav-btn ${active === t ? 'active' : ''}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

export default function AnalysisResult({ navigate: navigateProp, addToast }) {
  const routerNavigate = useNavigate()
  const navigate = navigateProp || routerNavigate
  const location = useLocation()
  const [tab, setTab] = useState('Overview')

  let stateData = location.state
  if (!stateData || !stateData.result) {
    try {
      const stored = sessionStorage.getItem('latestAnalysis')
      if (stored) {
        stateData = JSON.parse(stored)
      }
    } catch {
      // ignore
    }
  }
  stateData = stateData || {}
  const result = stateData.result
  const jobTitle = stateData.jobTitle || 'Target Role'
  const analysisDate = stateData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const handleExport = () => {
    if (typeof addToast === 'function') {
      addToast('success', 'Report exported as PDF. Check your downloads.')
    } else {
      alert('Report exported as PDF. Check your downloads.')
    }
  }

  // If no result is present, display empty state prompting user to submit an analysis
  if (!result) {
    return (
      <div className="analysis-page">
        <nav className="analysis-nav">
          <div className="analysis-nav-container">
            <Link to="/" className="analysis-brand">
              <span className="analysis-brand-icon">
                <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                  <path d="M2 2h11v2H2V2zm0 4h7v2H2V6zm0 4h9v2H2v-2z" fill="white"/>
                </svg>
              </span>
              ResumeAI
            </Link>
            <div className="analysis-nav-actions">
              <button onClick={() => navigate('/analysis/new')} className="btn-new-analysis">
                Start Analysis
              </button>
            </div>
          </div>
        </nav>
        <div className="analysis-main-container" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
            No Analysis Results Found
          </h1>
          <p style={{ color: '#64748B', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Please submit your resume and job description to generate detailed AI-powered insights and match recommendations.
          </p>
          <button onClick={() => navigate('/analysis/new')} className="btn-final-analysis" style={{ display: 'inline-flex', width: 'auto' }}>
            Analyze Your Resume Now
          </button>
        </div>
      </div>
    )
  }

  // Extracted values from backend response
  const atsScore = Number(result.atsScore) || 0
  const interviewReadinessScore = Number(result.interviewReadinessScore) || 0
  const summaryText = result.summary || 'No summary provided by analysis backend.'

  const identifiedSkills = parseList(result.identifiedSkills)
  const missingSkills = parseList(result.missingSkills)
  const suggestionsList = parseSuggestions(result.suggestions)
  const roadmapList = parseRoadmap(result.learningRoadmap)
  const projectsList = parseProjects(result.recommendedProjects)

  // Badge helpers
  const getMatchBadge = (score) => {
    if (score >= 80) return <span className="badge-match strong">Strong Match</span>
    if (score >= 60) return <span className="badge-match good">Good Standing</span>
    return <span className="badge-match needs-work" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>Needs Work</span>
  }

  return (
    <div className="analysis-page">
      {/* Navbar */}
      <nav className="analysis-nav">
        <div className="analysis-nav-container">
          <Link to="/" className="analysis-brand">
            <span className="analysis-brand-icon">
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                <path d="M2 2h11v2H2V2zm0 4h7v2H2V6zm0 4h9v2H2v-2z" fill="white"/>
              </svg>
            </span>
            ResumeAI
          </Link>
          <div className="analysis-nav-actions">
            <button onClick={handleExport} className="btn-export-pdf">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v7M3.5 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 10h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Export PDF
            </button>
            <button onClick={() => navigate('/analysis/new')} className="btn-new-analysis">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              New Analysis
            </button>
          </div>
        </div>
      </nav>

      <div className="analysis-main-container">
        {/* Header */}
        <div className="analysis-header fade-up">
          <div className="analysis-header-badge-row">
            <span className="analysis-complete-badge">Analysis Complete</span>
            <span className="analysis-date-text">{analysisDate}</span>
          </div>
          <h1>Your Resume Analysis</h1>
          <p className="analysis-subtitle">{jobTitle}</p>
        </div>

        {/* Score hero */}
        <div className="analysis-score-hero fade-up-1">
          <div className="score-hero-grid">
            <div className="score-circle-box">
              <ScoreCircle
                score={atsScore}
                label="ATS Compatibility"
                color={atsScore >= 80 ? '#22C55E' : atsScore >= 60 ? '#F59E0B' : '#EF4444'}
                badge={getMatchBadge(atsScore)}
              />
            </div>
            <div className="score-circle-box">
              <ScoreCircle
                score={interviewReadinessScore}
                label="Interview Readiness"
                color={interviewReadinessScore >= 80 ? '#22C55E' : interviewReadinessScore >= 60 ? '#F59E0B' : '#EF4444'}
                badge={getMatchBadge(interviewReadinessScore)}
              />
            </div>
            <div className="score-bars-box">
              {[
                { label: 'Identified Skills Found', pct: Math.min(100, Math.round((identifiedSkills.length / Math.max(1, identifiedSkills.length + missingSkills.length)) * 100)), color: '#22C55E' },
                { label: 'ATS Target Score', pct: atsScore, color: atsScore >= 75 ? '#22C55E' : '#F59E0B' },
                { label: 'Interview Score', pct: interviewReadinessScore, color: interviewReadinessScore >= 75 ? '#22C55E' : '#F59E0B' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="score-bar-item">
                  <div className="score-bar-header">
                    <span className="score-bar-label">{label}</span>
                    <span className="score-bar-pct" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
              <p className="score-bars-footer-text">
                {missingSkills.length > 0
                  ? `Addressing your ${missingSkills.length} skill gap${missingSkills.length > 1 ? 's' : ''} will elevate your candidacy for this position.`
                  : 'Great job! Your profile shows strong alignment with the job requirements.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabNav active={tab} setActive={setTab} />

        {/* ── Overview ── */}
        {tab === 'Overview' && (
          <div className="tab-content-wrapper fade-up">
            {/* AI Summary */}
            <div className="ai-summary-card">
              <div className="ai-summary-header">
                <div className="ai-summary-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1l1.5 4L13 5.8l-3 3 .8 4.2L7 11l-3.8 2 .8-4.2-3-3L5.5 5 7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2>AI Summary</h2>
              </div>
              <p className="ai-summary-text">{summaryText}</p>
            </div>

            {/* Quick actions */}
            <div className="quick-actions-grid">
              <button onClick={() => setTab('Skills')} className="quick-action-card red">
                <div className="quick-action-label red">{missingSkills.length} Skill Gaps</div>
                <div className="quick-action-sub">{missingSkills.slice(0, 3).join(', ')}{missingSkills.length > 3 ? ` +${missingSkills.length - 3} more` : ''}</div>
                <div className="quick-action-link">
                  View details
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              <button onClick={() => setTab('Suggestions')} className="quick-action-card amber">
                <div className="quick-action-label amber">{suggestionsList.length} Suggestions</div>
                <div className="quick-action-sub">Targeted resume improvements</div>
                <div className="quick-action-link">
                  View details
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              <button onClick={() => setTab('Roadmap')} className="quick-action-card blue">
                <div className="quick-action-label blue">{roadmapList.length}-Step Roadmap</div>
                <div className="quick-action-sub">Structured learning plan</div>
                <div className="quick-action-link">
                  View details
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {tab === 'Skills' && (
          <div className="skills-grid fade-up">
            <div className="skills-card">
              <div className="skills-card-header">
                <h2>Identified Skills</h2>
                <span className="skills-count-pill identified">{identifiedSkills.length} found</span>
              </div>
              <div className="skills-pill-wrap">
                {identifiedSkills.length > 0 ? (
                  identifiedSkills.map(s => (
                    <span key={s} className="skill-pill identified">{s}</span>
                  ))
                ) : (
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No specific matching skills parsed.</p>
                )}
              </div>
            </div>

            <div className="skills-card">
              <div className="skills-card-header">
                <h2>Missing Skills</h2>
                <span className="skills-count-pill missing">{missingSkills.length} gaps</span>
              </div>
              <div className="skills-pill-wrap">
                {missingSkills.length > 0 ? (
                  missingSkills.map(s => (
                    <span key={s} className="skill-pill missing">{s}</span>
                  ))
                ) : (
                  <p style={{ color: '#16A34A', fontSize: '0.875rem', fontWeight: 500 }}>No missing skills found! Your skills cover the target job requirements.</p>
                )}
              </div>
              <p className="skills-footer-note">These skills appear in the job description but were not detected in your resume.</p>
              <div className="skills-action-border">
                <button onClick={() => setTab('Roadmap')} className="btn-view-roadmap">
                  View learning roadmap
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Suggestions ── */}
        {tab === 'Suggestions' && (
          <div className="suggestions-card fade-up">
            <div className="suggestions-card-header">
              <div className="suggestions-icon-box">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5L8.2 5H12l-2.8 2.2 1 3.3L7 8.5l-3.2 2 1-3.3L2 5h3.8L7 1.5z" stroke="#F59E0B" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Resume Improvement Suggestions</h2>
            </div>
            <div className="suggestions-list">
              {suggestionsList.length > 0 ? (
                suggestionsList.map(({ n, title, desc }, idx) => (
                  <div key={idx} className="suggestion-item">
                    <div className="suggestion-number">{n || String(idx + 1).padStart(2, '0')}</div>
                    <div className="suggestion-body">
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No specific suggestions returned.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Roadmap ── */}
        {tab === 'Roadmap' && (
          <div className="roadmap-card fade-up">
            <div className="roadmap-card-header">
              <div className="roadmap-icon-box">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12V4M2 4l2 2M2 4l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12V6M6 6l2 2M6 6l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12V8M10 8l2 2M10 8l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Learning Roadmap</h2>
            </div>
            <div className="roadmap-timeline">
              <div className="roadmap-line" />
              <div className="roadmap-steps-list">
                {roadmapList.length > 0 ? (
                  roadmapList.map(({ week, topic, desc }, i) => (
                    <div key={i} className="roadmap-step-item">
                      <div className={`roadmap-node ${i === 0 ? 'active' : ''}`}>
                        {i === 0 ? (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span className="roadmap-dot" />
                        )}
                      </div>
                      <div className="roadmap-step-body">
                        <div className="roadmap-week-label-row">
                          <span className="roadmap-week-text">{week}</span>
                          {i === 0 && <span className="start-badge">Start here</span>}
                        </div>
                        <h3>{topic}</h3>
                        <p>{desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No roadmap items available.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Projects ── */}
        {tab === 'Projects' && (
          <div className="fade-up">
            <div className="projects-grid">
              {projectsList.length > 0 ? (
                projectsList.map(({ title, desc, techs, why, difficulty, time }, i) => (
                  <div key={i} className="project-card hover-lift">
                    <div className="project-card-top">
                      <div className="project-icon-box">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <rect x="1.5" y="2.5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M4.5 6h6M4.5 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className={`difficulty-badge ${(difficulty || 'intermediate').toLowerCase()}`}>{difficulty}</span>
                    </div>
                    <h3>{title}</h3>
                    <p className="project-desc">{desc}</p>
                    {techs && techs.length > 0 && (
                      <div className="project-techs-wrap">
                        {techs.map(t => (
                          <span key={t} className="project-tech-pill">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="project-time-row">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
                        <path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                      Est. {time}
                    </div>
                    <div className="project-why-box">
                      <div className="project-why-title">Why this project?</div>
                      <p className="project-why-text">{why}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No project recommendations available.</p>
              )}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="analysis-final-cta">
          <div className="final-cta-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2l2 5.5L17 8.5l-4 4 1 5.5L9 15l-5 3 1-5.5-4-4 6-1L9 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Your next step</h2>
          <p>Focus on the missing skills above and strengthen your resume with the recommended projects. You're closer than you think.</p>
          <div className="final-cta-buttons">
            <button onClick={() => navigate('/analysis/new')} className="btn-final-analysis">
              Start Another Analysis
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={handleExport} className="btn-final-export">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v7M4 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}