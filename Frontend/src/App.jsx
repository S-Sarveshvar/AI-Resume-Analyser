import React from 'react'
import DashBoard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Landing from './pages/Landing'
import AnalysisResult from './pages/AnalysisResult'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import './App.css'
const App = () => {
  return (
    <>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<DashBoard/>}/>
            <Route path="/analysis/:id" element={<AnalysisResult/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App