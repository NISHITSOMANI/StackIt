import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-secondary-50">
            <div className="flex flex-col lg:flex-row">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 lg:p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/question/:id" element={<QuestionDetail />} />
                    <Route path="/ask" element={<AskQuestion />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Routes>
                </main>
              </div>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 