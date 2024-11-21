import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    setFormData({ ...formData, department: e.target.value });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData({ ...formData, availability: newAvailability });
  };

  const addAvailabilitySlot = () => {
    setFormData({
      ...formData,
      availability: [
        ...formData.availability,
        { day: "", startTime: "", endTime: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        // Login
        const { data } = await customFetch.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (data.success) {
          toast.success("Login successful!");
          
          // Redirect based on role
          if (data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else if (data.user.role === "teacher") {
            navigate("/teacher-dashboard");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        // Register
        const registerData = isTeacher 
          ? {
              name: formData.username,
              email: formData.email,
              password: formData.password,
              department: formData.department,
            }
          : {
              username: formData.username,
              email: formData.email,
              password: formData.password,
            };

        const endpoint = isTeacher ? "/auth/register/teacher" : "/auth/register";
        
        console.log('Sending registration data:', registerData); // Debug log

        const { data } = await customFetch.post(endpoint, registerData);

        if (data.success) {
          toast.success(data.message || "Registration successful!");
          setActiveTab("login");
          // Clear form
          setFormData({
            email: "",
            password: "",
            username: "",
            department: "",
          });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error?.response?.data?.message || 
        "Registration failed. Please check your input."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      </div>

      {/* Your existing login form content */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl mx-4">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              autoComplete="off" // Prevent browser autofill
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter your email"
                    autoComplete="new-email" // Prevent browser autofill
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter your password"
                    autoComplete="new-password" // Prevent browser autofill
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Login"}
              </button>
            </form>
          )}

          {/* Registration Form */}
          {activeTab === "register" && (
            <>
              {/* Note Alert */}
              <div className="alert alert-info bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important Note:</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      Please provide a valid email address. You will receive:
                      <ul className="list-disc list-inside mt-1 ml-2">
                       
                        <li>Appointment notifications</li>
                        <li>Important updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {isTeacher ? "Full Name" : "Username"}
                  </label>
                  <div className="relative">
                    <input
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={isTeacher ? "Enter your full name" : "Choose a username"}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      👤
                    </span>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      📧
                    </span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a password"
                      minLength="8"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔒
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* Department Field - Only for Teachers */}
                {isTeacher && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        <option value="computer-science">Computer Science</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                      </select>
                    </div>
                )}

                {/* Teacher/Student Toggle */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isTeacher}
                      onChange={(e) => setIsTeacher(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Register as a Teacher
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
