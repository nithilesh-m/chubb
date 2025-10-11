import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Prediction from './components/Prediction'
import Part from './components/Part'
import './App.css'

function Logout() {
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    navigate('/signin')
  }, [navigate])
  return null
}

function App() {
  const isAuthenticated = (localStorage.getItem('isAuthenticated') === 'true') && !!localStorage.getItem('token')

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/prediction" /> : <SignIn />} 
          />
          <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/prediction" /> : <SignIn />} 
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/prediction" /> : <SignUp />} 
          />
          <Route 
            path="/prediction" 
            element={isAuthenticated ? <Prediction /> : <Navigate to="/" />} 
          />
          <Route 
            path="/part" 
            element={isAuthenticated ? <Part /> : <Navigate to="/" />} 
          />
          <Route
            path="/logout"
            element={<Logout />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
