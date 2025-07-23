import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import MainMenuLayout from './components/MainMenuLayout';
import ViewProducts from './pages/ViewProducts';
import Checkout from './pages/Checkout';
import Feedback from './pages/Feedback';
import TrackOrders from './pages/TrackOrders';
import Reports from './pages/Reports';
import UserSettings from './pages/UserSettings';
import UserRoute from './components/UserRoute';

// HR, Guest, Google login
import HRDashboard from './pages/HRDashboard';
import GuestDashboard from './pages/GuestDashboard';
import GoogleLoginSuccess from './pages/GoogleLoginSuccess';

// NEW: Manager/Executive/Finance dashboard
import ManagerDashboard from './pages/ManagerDashboard';

const App = () => (
  <Router>
    <Routes>
      {/* Login and admin */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/google-login-success" element={<GoogleLoginSuccess />} />

      {/* Guest Dashboard */}
      <Route path="/guest/*" element={<GuestDashboard />}>
        <Route path="products" element={<ViewProducts />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="track" element={<TrackOrders />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="settings" element={<UserSettings />} />
        <Route index element={<ViewProducts />} />
      </Route>

      {/* HR Dashboard */}
      <Route path="/hr/dashboard" element={<HRDashboard />} />

      {/* Manager/Executive/Finance: custom dashboard/layout */}
      <Route element={<ManagerDashboard />}>
        <Route path="/reports" element={<UserRoute><Reports /></UserRoute>} />
        <Route path="/products" element={<UserRoute><ViewProducts /></UserRoute>} />
        <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
        <Route path="/track" element={<UserRoute><TrackOrders /></UserRoute>} />
        <Route path="/feedback" element={<UserRoute><Feedback /></UserRoute>} />
        <Route path="/settings" element={<UserRoute><UserSettings /></UserRoute>} />
      </Route>

      {/* Regular Employee (not admin/hr/manager/executive/finance/guest): uses MainMenuLayout */}
      <Route element={<MainMenuLayout />}>
        <Route path="/products" element={<UserRoute><ViewProducts /></UserRoute>} />
        <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
        <Route path="/track" element={<UserRoute><TrackOrders /></UserRoute>} />
        <Route path="/feedback" element={<UserRoute><Feedback /></UserRoute>} />
        <Route path="/settings" element={<UserRoute><UserSettings /></UserRoute>} />
      </Route>
    </Routes>
  </Router>
);

export default App;