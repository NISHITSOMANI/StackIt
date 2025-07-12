import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
  return (
    <Router>
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
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 