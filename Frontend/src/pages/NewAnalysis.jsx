import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { API_BASE_URL } from '../config/api'

export default function NewAnalysis({ navigate: navigateProp, addToast }) {
  const routerNavigate = useNavigate()
  const navigate = navigateProp || routerNavigate

  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) setFile(f)
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const canSubmit = !!file && jobTitle.trim() && jobDesc.trim()

  const handleAnalyze = async () => {
    if (!canSubmit) return

    if (typeof addToast === 'function') {
      addToast('info', 'Starting AI analysis…')
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('title', jobTitle)
      formData.append('description', jobDesc)

      const response = await fetch(`${API_BASE_URL}/api/analysis`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      let data = null
      try {
        data = await response.json()
      } catch {
        // fallback
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Analysis failed. Please try again.')
      }

      if (typeof addToast === 'function') {
        addToast('success', 'Analysis complete!')
      }

      const analysisState = {
        result: data,
        jobTitle,
        jobDesc,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
      sessionStorage.setItem('latestAnalysis', JSON.stringify(analysisState))
      routerNavigate('/analysis', { state: analysisState })
    } catch (error) {
      console.error('Analysis error:', error)
      const errorMsg = error.message || 'Unable to perform analysis.'
      if (typeof addToast === 'function') {
        addToast('error', errorMsg)
      } else {
        alert(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`

  return (
    <div className="new-analysis-page">
      {/* Navbar */}
      <nav className="new-analysis-nav">
        <div className="new-analysis-nav-container">
          <Link to="/" className="new-analysis-brand">
            <span className="new-analysis-brand-icon">
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                <path d="M2 2h11v2H2V2zm0 4h7v2H2V6zm0 4h9v2H2v-2z" fill="white"/>
              </svg>
            </span>
            ResumeAI
          </Link>
          <button onClick={() => navigate('/analysis')} className="btn-nav-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Analysis Results
          </button>
        </div>
      </nav>

      <div className="new-analysis-main-container">
        <div className="new-analysis-header">
          <h1>Analyze Your Resume</h1>
          <p>Compare your resume with a target job and discover exactly how to improve your chances.</p>
        </div>

        <div className="new-analysis-form-stack">
          {/* Upload */}
          <div className="new-analysis-card">
            <h2>Resume</h2>
            <p className="card-subtext">Upload your most recent resume for the best results.</p>

            {!file ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`dropzone ${dragging ? 'dragging' : ''}`}
              >
                <div className="dropzone-icon">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 14v3a2 2 0 002 2h10a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 3v11M7 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="dropzone-text-group">
                  <p className="dropzone-title">Drop your resume here</p>
                  <p className="dropzone-subtitle">or <span className="browse-link">browse files</span></p>
                </div>
                <p className="dropzone-hint">PDF up to 50 MB</p>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden-file-input" onChange={handleFile} />
              </div>
            ) : (
              <div className="file-preview-card">
                <div className="file-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2.5" y="1.5" width="13" height="15" rx="2" stroke="#2563EB" strokeWidth="1.3"/>
                    <path d="M5 5.5h8M5 8.5h8M5 11.5h5" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatBytes(file.size)}</div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="btn-remove-file"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="new-analysis-card">
            <h2>Job Information</h2>
            <p className="card-subtext">The more detail you provide, the more accurate your analysis will be.</p>

            <div className="input-field-group">
              <div className="field-block">
                <label>Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Java Backend Developer"
                />
              </div>

              <div className="field-block">
                <div className="label-with-count">
                  <label>Job Description</label>
                  <span className="char-count">{jobDesc.length} characters</span>
                </div>
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the full job description here. Include required skills, responsibilities, and qualifications..."
                  rows={8}
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-action-block">
            <button
              onClick={handleAnalyze}
              disabled={!canSubmit || loading}
              className="btn-analyze-submit"
            >
              {loading ? (
                <>
                  <span className="new-analysis-spinner" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l2 4.5L15 7.3l-3.5 3.4.8 4.8L8 13.2l-4.3 2.3.8-4.8L1 7.3l5-.8L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  Analyze Resume
                </>
              )}
            </button>
            {!canSubmit && (
              <p className="cta-hint">
                {!file ? 'Upload a resume to continue.' : !jobTitle.trim() ? 'Enter a job title to continue.' : 'Paste a job description to continue.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
