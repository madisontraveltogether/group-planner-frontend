import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Tasks from './pages/Tasks'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
};

export default App;
