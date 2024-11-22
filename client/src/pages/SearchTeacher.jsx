import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export default function SearchTeacher() {
  const navigate = useNavigate();
  const location = useLocation();
  const isBookingRoute = location.pathname.includes('/book-appointment/');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await customFetch.get('/auth/check-auth');
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  console.log(user?.role);
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch teachers when search query or department changes
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQuery) params.append("query", debouncedQuery);
        if (selectedDepartment) params.append("department", selectedDepartment);

        const { data } = await customFetch.get(
          `/auth/search/teachers?${params}`
        );
        setTeachers(data.teachersByDepartment);
        setDepartments(data.departments);
      } catch (error) {
        toast.error("Failed to fetch teachers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [debouncedQuery, selectedDepartment]);

  const handleTeacherClick = (teacher) => {
    if (!teacher.id) {
      toast.error("Invalid teacher selection");
      return;
    }

    navigate(`/search-teacher/book-appointment/${teacher.id}`, {
      state: {
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        teacherDepartment: teacher.department,
        teacherAvailability: teacher.availability,
        teacherProfilePic: teacher.profilePic
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20 pb-12">
      {isBookingRoute ? (
        <Outlet />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {user?.role==='admin'?'View Teachers':'Find Your Teacher'}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {user?.role==='admin'?"Search for teachers by name or filter by department":"  Search for teachers by name or filter by department to book yourappointment"}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teachers by name..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200
                    text-sm sm:text-base"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Department Filter */}
              <div className="flex-1">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                    text-sm sm:text-base
                    appearance-none bg-white"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : Object.keys(teachers).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">No teachers found</p>
              </div>
            ) : (
              Object.entries(teachers).map(([department, departmentTeachers]) => (
                <div
                  key={department}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <h3 className="bg-gray-50 px-4 sm:px-6 py-3 text-lg font-semibold text-gray-800 border-b">
                    {department.charAt(0).toUpperCase() +
                      department.slice(1).replace("-", " ")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                    {departmentTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        onClick={() => {user?.role==='admin'?'' : handleTeacherClick(teacher)}}
                        className="flex flex-col border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white"
                      >
                        {/* Teacher Header */}
                        <div className="flex items-center space-x-4">
                          <div className="relative flex-shrink-0">
                            {teacher.profilePic ? (
                              <img
                                src={teacher.profilePic}
                                alt={teacher.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-2xl font-semibold text-white">
                                  {teacher.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-medium text-gray-900 truncate">
                              {teacher.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {teacher.email}
                            </p>
                          </div>
                        </div>

                        {/* Availability Section */}
                        <div className="mt-4 flex-1">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Available Times:
                          </h5>
                          <div className="space-y-2">
                            {teacher.availability.map((slot, index) => (
                              <div
                                key={index}
                                className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-md p-3"
                              >
                                <span className="inline-flex items-center justify-center w-20 font-medium">
                                  {slot.day}
                                </span>
                                <div className="flex-1 ml-3 px-3 py-1 bg-blue-50 rounded-md">
                                  <span className="font-medium text-blue-700">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Book Button */}
                       {user?.role==='admin'? "" :
                        <div className="mt-4 pt-4 border-t">
                        <button className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 
                          bg-gradient-to-r from-green-500 to-green-600 
                          hover:from-green-600 hover:to-green-700
                          text-white shadow-md hover:shadow-lg 
                          active:transform active:scale-95
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                          disabled:opacity-50 disabled:cursor-not-allowed
                          text-sm sm:text-base">
                          Book Appointment
                        </button>
                      </div>
                       }
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
