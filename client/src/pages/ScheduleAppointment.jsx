import React, { useState, useEffect } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ScheduleAppointment() {
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState("schedule");
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalStats, setTotalStats] = useState({
    totalAppointments: 0,
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0
  });

  // Fetch appointments and stats
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await customFetch.get("/teacher/appointments");
        if (data && data.appointments) {
          setAppointments(data.appointments);
          
          // Calculate totals
          const total = data.appointments.length;
          const pending = data.appointments.filter(app => app.status === 'pending');
          const approved = data.appointments.filter(app => app.status === 'approved');
          const rejected = data.appointments.filter(app => app.status === 'rejected');

          setTotalStats({
            totalAppointments: total,
            totalPending: pending.length,
            totalApproved: approved.length,
            totalRejected: rejected.length
          });

          setPendingRequests(pending);
          setPendingCount(pending.length);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // Only show error if it's not an auth error
        if (error?.response?.status !== 401) {
          toast.error("Failed to fetch appointments");
        }
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    // Only fetch if user is authenticated
    const checkAuthAndFetch = async () => {
      try {
        const { data } = await customFetch.get("/auth/check-auth");
        if (data.user && data.user.role === 'teacher') {
          fetchAppointments();
        }
      } catch (error) {
        setIsLoadingAppointments(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  // Fetch availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await customFetch.get("/teacher/availability");
        if (data.availability && data.availability.length > 0) {
          setAvailabilities(data.availability);
        }
      } catch (error) {
        // Only show error if it's not an auth error
        if (error?.response?.status !== 401) {
          toast.error("Failed to fetch availability");
        }
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    // Only fetch if user is authenticated
    const checkAuthAndFetch = async () => {
      try {
        const { data } = await customFetch.get("/auth/check-auth");
        if (data.user && data.user.role === 'teacher') {
          fetchAvailability();
        }
      } catch (error) {
        setIsLoadingAvailability(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await customFetch.get("/auth/check-auth");
        if (data.user.role !== "teacher") {
          toast.error("Only teachers can access this page");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Please login first");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (index, field, value) => {
    const newAvailabilities = availabilities.map((slot, i) => {
      if (i === index) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    setAvailabilities(newAvailabilities);
  };

  const addAvailabilitySlot = () => {
    setAvailabilities([
      ...availabilities,
      { day: "", startTime: "", endTime: "" },
    ]);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await customFetch.post("/teacher/availability", {
        availability: availabilities,
      });
      toast.success("Availability updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const { data } = await customFetch.patch(`/teacher/appointments/${appointmentId}`, {
        status: action
      });

      if (data.success) {
        // Update appointments list
        setAppointments(prev => 
          prev.map(app => 
            app._id === appointmentId ? { ...app, status: action } : app
          )
        );

        // Update pending requests
        const newPendingRequests = appointments.filter(app => 
          app._id !== appointmentId && app.status === 'pending'
        );
        setPendingRequests(newPendingRequests);
        setPendingCount(newPendingRequests.length);

        // Update stats
        setTotalStats(prev => ({
          ...prev,
          totalPending: prev.totalPending - 1,
          [action === 'approved' ? 'totalApproved' : 'totalRejected']: prev[action === 'approved' ? 'totalApproved' : 'totalRejected'] + 1
        }));

        toast.success(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update appointment');
    }
  };

  // Add loading state to the form
  if (isLoadingAvailability) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Header Section with Stats */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Schedule Management
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {/* Total Appointments Card */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-4xl font-bold text-blue-600">
                {totalStats.totalAppointments}
              </div>
              <div className="text-sm text-gray-600">Total Appointments</div>
            </div>

            {/* Pending Requests Card */}
            <div className="bg-yellow-50 rounded-lg shadow-md p-4">
              <div className="text-4xl font-bold text-yellow-600">
                {totalStats.totalPending}
              </div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>

            {/* Approved Card */}
            <div className="bg-green-50 rounded-lg shadow-md p-4">
              <div className="text-4xl font-bold text-green-600">
                {totalStats.totalApproved}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>

            {/* Rejected Card */}
            <div className="bg-red-50 rounded-lg shadow-md p-4">
              <div className="text-4xl font-bold text-red-600">
                {totalStats.totalRejected}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>

          {/* Pending Requests Badge */}
          {pendingCount > 0 && (
            <div className="mt-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold bg-yellow-100 text-yellow-800">
                {pendingCount} New Request{pendingCount !== 1 ? 's' : ''} Pending
              </span>
            </div>
          )}
        </div>

        {/* View Toggle with Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setSelectedView("schedule")}
              className={`px-4 sm:px-6 py-2 rounded-md transition-all duration-200 text-sm sm:text-base ${
                selectedView === "schedule"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Set Schedule
            </button>
            <button
              onClick={() => setSelectedView("appointments")}
              className={`relative px-4 sm:px-6 py-2 rounded-md transition-all duration-200 text-sm sm:text-base ${
                selectedView === "appointments"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              View Appointments
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pending Requests Section - Only show if there are pending requests */}
        {selectedView === "appointments" && pendingRequests.length > 0 && (
          <div className="mb-8 bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">
              Pending Requests ({pendingCount})
            </h3>
            <div className="space-y-4">
              {pendingRequests.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.studentName}</h4>
                      <p className="text-sm text-gray-600">{appointment.subject}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.date} {appointment.startTime} - {appointment.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAppointmentAction(appointment._id, "approved")}
                        className="btn btn-sm btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAppointmentAction(appointment._id, "rejected")}
                        className="btn btn-sm btn-error"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            {selectedView === "schedule" ? (
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                  Set Your Availability
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {availabilities.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 sm:p-4 rounded-lg"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <select
                          value={slot.day}
                          onChange={(e) =>
                            handleInputChange(index, "day", e.target.value)
                          }
                          className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          required
                        >
                          <option value="">Select Day</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                        </select>
                        <div className="flex flex-1 gap-2 items-center">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            required
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeAvailabilitySlot(index)}
                            className="text-red-500 hover:text-red-700 self-center"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={addAvailabilitySlot}
                      className="flex-1 px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200 text-sm sm:text-base"
                    >
                      + Add Time Slot
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 text-sm sm:text-base"
                    >
                      {isLoading ? "Saving..." : "Save Schedule"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">
                  Upcoming Appointments
                </h2>
                {isLoadingAppointments ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No appointments found
                  </p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="font-medium">
                              {appointment.studentName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.subject}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full self-start ${
                              appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : appointment.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {appointment.date} {appointment.time}
                        </div>
                        {appointment.status === "pending" && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() =>
                                handleAppointmentAction(
                                  appointment._id,
                                  "approved"
                                )
                              }
                              className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAppointmentAction(
                                  appointment._id,
                                  "rejected"
                                )
                              }
                              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="w-full lg:w-80 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-24">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Today's Appointments</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {appointments.filter(app => app.date === new Date().toISOString().split('T')[0]).length}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-yellow-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {totalStats.totalPending}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Approved</span>
                    <span className="text-2xl font-bold text-green-600">
                      {totalStats.totalApproved}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {totalStats.totalAppointments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
