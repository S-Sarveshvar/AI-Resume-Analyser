import React from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Landing from './pages/Landing'
import AnalysisResult from './pages/AnalysisResult'
import NewAnalysis from './pages/NewAnalysis'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css'
const App = () => {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/analysis/new" element={<NewAnalysis/>}/>
            <Route path="/analysis" element={<AnalysisResult/>}/>
            <Route path="/analysis/:id" element={<AnalysisResult/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App