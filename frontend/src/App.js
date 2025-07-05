import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import ViewProducts from './pages/ViewProducts';
import MainMenuLayout from './components/MainMenuLayout';
import Checkout from './pages/Checkout';
import Feedback from './pages/Feedback';
import TrackOrders from './pages/TrackOrders';
import Reports from './pages/Reports';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Routes wrapped in sidebar layout */}
      <Route element={<MainMenuLayout />}>
        <Route path="/products" element={<ViewProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/track" element={<TrackOrders />} />
        <Route path="/reports" element={<Reports />} />
        {/* Add more pages here like Checkout, Feedback, etc. */}
      </Route>
    </Routes>
  </Router>
);

export default App;
