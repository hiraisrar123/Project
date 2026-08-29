
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import Results from "./pages/Results";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Announcements from "./pages/Announcements";
import Attendance from "./pages/Attendance";
import Students from "./pages/Students";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
         path="/reset-password"
         element={<ResetPassword />}
         />

         <Route path="/profile" element={
         <ProtectedRoute>
         <Profile />
         </ProtectedRoute>}/>

          <Route path="/courses" element={
          <ProtectedRoute>
          <Courses />
          </ProtectedRoute> }/>

         <Route path="/results" element={
        <ProtectedRoute>
        <Results />
        </ProtectedRoute>}
/>

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>}/>

        <Route path="/announcements" element={
        <ProtectedRoute>
       <Announcements />
       </ProtectedRoute> }/>

       <Route path="/attendance" element={
        <ProtectedRoute>
        <Attendance />
        </ProtectedRoute>  }/>

       <Route path="/students" element={
       <AdminRoute>
        <Students />
       </AdminRoute> }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;