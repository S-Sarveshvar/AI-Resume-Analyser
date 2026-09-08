# AI Resume Analyser & Career Readiness Platform

An AI-powered web platform designed to analyze resumes against target job descriptions, calculate ATS (Applicant Tracking System) compatibility scores, identify critical skill gaps, and provide personalized career roadmaps to prepare job seekers for interviews.

---

## 🛠 Tech Stack

### **Frontend**
- **Core**: React 18 (Vite)
- **Routing**: React Router DOM (`v6`)
- **Styling**: Vanilla CSS3 using custom CSS variables (Design System with Tokens)
- **HTTP Client**: Native `fetch` API with Bearer token authentication
- **Icons & UI**: Custom SVG Icons & Responsive Layout System

### **Backend**
- **Core**: Java 17, Spring Boot 3
- **Security**: Spring Security 6 (Stateless JWT Authentication via `jjwt`)
- **AI Integration**: Google Gemini API (AI Analysis & Skill Gap Detection)
- **File Processing**: Apache Tika / PDFBox (Resume Parsing)
- **Database / ORM**: JPA / Hibernate (PostgreSQL / MySQL)
- **Validation**: Jakarta Validation API (`@Valid`, `@NotNull`)
- **API Documentation**: OpenAPI 3 / Swagger UI

---

## 📂 Detailed Folder Structure

```text
AI Resume Analyser/
├── Backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/sarvesh/ResumeAnalyser/
│       │   │   ├── ResumeAnalyserApplication.java
│       │   │   ├── analysis/
│       │   │   │   ├── controller/
│       │   │   │   │   ├── AnalysisController.java
│       │   │   │   │   └── GeminiControllerTest.java
│       │   │   │   ├── dto/
│       │   │   │   │   ├── AnalysisRequest.java
│       │   │   │   │   └── AnalysisResponse.java
│       │   │   │   ├── entity/
│       │   │   │   │   └── Analysis.java
│       │   │   │   ├── repository/
│       │   │   │   │   └── AnalysisRepository.java
│       │   │   │   └── service/
│       │   │   │       ├── AnalysisService.java
│       │   │   │       └── GeminiService.java
│       │   │   ├── auth/
│       │   │   │   ├── controller/
│       │   │   │   │   └── AuthController.java
│       │   │   │   ├── dto/
│       │   │   │   │   ├── AuthResponse.java
│       │   │   │   │   ├── LoginRequest.java
│       │   │   │   │   └── RegisterRequest.java
│       │   │   │   ├── entity/
│       │   │   │   │   └── User.java
│       │   │   │   ├── repository/
│       │   │   │   │   └── UserRepository.java
│       │   │   │   └── service/
│       │   │   │       └── AuthService.java
│       │   │   ├── config/
│       │   │   │   └── AppConfig.java
│       │   │   ├── exception/
│       │   │   │   └── GlobalExceptionHandler.java
│       │   │   ├── jobdescription/
│       │   │   │   ├── controller/
│       │   │   │   │   └── JobDescriptionController.java
│       │   │   │   ├── entity/
│       │   │   │   │   └── JobDescription.java
│       │   │   │   └── repository/
│       │   │   │       └── JobDescriptionRepository.java
│       │   │   ├── resume/
│       │   │   │   ├── controller/
│       │   │   │   │   └── ResumeController.java
│       │   │   │   ├── entity/
│       │   │   │   │   └── Resume.java
│       │   │   │   └── repository/
│       │   │   │       └── ResumeRepository.java
│       │   │   └── security/
│       │   │       ├── JwtAuthenticationFilter.java
│       │   │       ├── JwtService.java
│       │   │       └── SecurityConfig.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
└── Frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
        │   ├── common/
        │   │   ├── Button.jsx
        │   │   └── Card.jsx
        │   └── layout/
        │       └── Navbar.jsx
        └── pages/
            ├── AnalysisResult.jsx
            ├── Dashboard.jsx
            ├── Landing.jsx
            ├── Login.jsx
            └── Register.jsx
 Complete API Reference
1. Authentication APIs (/api/auth)
HTTP Method	Endpoint	Description	Request Body	Access
POST	/api/auth/register	Registers a new user	RegisterRequest (name, email, password)	Public
POST	/api/auth/login	Authenticates user & returns JWT token	LoginRequest (email, password)	Public
2. Resume Management APIs (/api/resumes)
HTTP Method	Endpoint	Description	Request Body / Params	Access
POST	/api/resumes/upload	Uploads PDF/Docx resume file	Multipart File (file)	Authenticated
3. Job Description APIs (/api/job-descriptions)
HTTP Method	Endpoint	Description	Request Body	Access
POST	/api/job-descriptions	Stores job description details	JobDescription (title, description)	Authenticated
4. AI Analysis APIs (/api/analysis)
HTTP Method	Endpoint	Description	Consumes	Access
POST	/api/analysis	Performs AI resume analysis against job description	multipart/form-data (file, jobTitle, jobDescription)	Authenticated
🔐 Security & Authentication Architecture
Stateless JWT Authorization:

On successful login (POST /api/auth/login), the backend returns a signed JWT token in AuthResponse.
The token is saved in localStorage under token.
For protected routes, JwtAuthenticationFilter intercepts requests and verifies the Authorization: Bearer <token> header.
Frontend Session Check & Protected Navigation:

Landing.jsx inspects local JWT token existence and expiration (exp) via isTokenExpired().
Protected actions (like clicking "Analyze My Resume" or "Start Your Analysis") automatically route logged-in users directly to /dashboard or fallback to /login.
Navbar.jsx dynamically updates navigation buttons (Dashboard / Logout vs Login / Get Started) based on active token state.
🚦 Getting Started
Prerequisites
Java 17+ & Maven
Node.js (v18+) & npm
PostgreSQL or MySQL running database instance
