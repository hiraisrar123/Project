import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route  path="/student-dashboard" element={
        <ProtectedRoute>
        <StudentDashboard />
        </ProtectedRoute> }/>
        <Route path="/admin-dashboard"element={<AdminDashboard />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;