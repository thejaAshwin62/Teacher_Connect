import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import SearchTeacher from "./pages/SearchTeacher";
import BookAppointment from "./pages/BookAppointment";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/schedule-appointment"
            element={<ScheduleAppointment />}
          />
          <Route path="/search-teacher" element={<SearchTeacher />}>
            <Route
              path="book-appointment/:teacherId"
              element={<BookAppointment />}
            />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <ToastContainer position="top-center" />
      </div>
    </Router>
  );
};

export default App;
