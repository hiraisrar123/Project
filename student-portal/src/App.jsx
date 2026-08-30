import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import TicketCreate from "./pages/TicketCreate";
import MyTickets from "./pages/MyTickets";
import TicketDetails from "./pages/TicketDetails";

import AdminTickets from "./pages/AdminTickets";
import AdminTicketDetails from "./pages/AdminTicketDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login / Signup */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Customer Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin / Agent Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Customer - Create Ticket */}
        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute>
              <TicketCreate />
            </ProtectedRoute>
          }
        />

        {/* Customer - My Tickets */}
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        {/* Customer - Ticket Details */}
        <Route
          path="/ticket/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin / Agent - All Tickets */}
        <Route
          path="/admin-tickets"
          element={
            <AdminRoute>
              <AdminTickets />
            </AdminRoute>
          }
        />

        {/* Admin / Agent - Ticket Details */}
        <Route
          path="/admin-ticket/:id"
          element={
            <AdminRoute>
              <AdminTicketDetails />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;