import React, { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, Send, User, Mail } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [availableTimeSlot, setAvailableTimeSlot] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    teacherId: location.state?.teacherId || "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    message: "",
  });

  useEffect(() => {
    // Only redirect if we don't have teacher data
    if (!location.state?.teacherId) {
      navigate("/search-teacher", { replace: true });
      return;
    }

    // Verify that URL param matches the state
    if (teacherId !== location.state.teacherId) {
      navigate("/search-teacher", { replace: true });
      return;
    }
  }, [teacherId, location.state, navigate]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    const selectedDayName = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });
    setSelectedDay(selectedDayName);

    // Find matching availability slot from passed teacher data
    const slot = location.state.teacherAvailability.find(
      (slot) => slot.day === selectedDayName
    );
    setAvailableTimeSlot(slot);

    setAppointmentData((prev) => ({
      ...prev,
      date,
      startTime: slot?.startTime || "",
      endTime: slot?.endTime || "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentData.teacherId) {
      toast.error("Teacher ID is missing. Please select a teacher.");
      return;
    }

    if (!availableTimeSlot) {
      toast.error("Please select a valid date with available time slots");
      return;
    }

    setIsLoading(true);
    try {
      // Format the data correctly
      const bookingData = {
        teacherId: appointmentData.teacherId,
        date: appointmentData.date,
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        purpose: appointmentData.purpose, // This will be used as subject
        message: appointmentData.message,
      };

      const response = await customFetch.post(
        "/appointments/book",
        bookingData
      );

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        navigate("/dashboard");
      } else {
        throw new Error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-0 sm:pt-3 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Teacher Profile Header */}
        <div className="bg-primary text-primary-content p-6 sm:p-8 lg:p-10 rounded-t-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="relative">
              <img
                src={location.state?.teacherProfilePic || "/default-avatar.png"}
                alt={location.state?.teacherName}
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-primary-content/20 shadow-xl"
              />
              <span className="absolute bottom-2 right-2 h-5 w-5 bg-success rounded-full border-2 border-primary"></span>
            </div>
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {location.state?.teacherName}
              </h2>
              <p className="text-lg sm:text-xl text-primary-content/80">
                {location.state?.teacherDepartment}
              </p>
              <p className="text-primary-content/60">
                {location.state?.teacherEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-base-200 p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-medium text-base-content/80 mb-4">
            Available Times:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {location.state?.teacherAvailability.map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-base-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Calendar className="h-5 w-5 text-primary hidden sm:block" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium">{slot.day}:</span>
                  <span className="text-sm sm:text-base">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 bg-white rounded-b-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Date Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base font-medium">Select Date</span>
              </label>
              <div className="relative mt-2">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                <input
                  type="date"
                  name="date"
                  value={appointmentData.date}
                  onChange={handleDateChange}
                  className="input input-bordered w-full pl-12 h-12"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base font-medium">Select Time</span>
              </label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                  <input
                    type="time"
                    name="startTime"
                    value={appointmentData.startTime}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-12 h-12"
                    required
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" size={20} />
                  <input
                    type="time"
                    name="endTime"
                    value={appointmentData.endTime}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-12 h-12"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Purpose Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-base font-medium">Purpose of Meeting</span>
            </label>
            <div className="relative mt-2">
              <BookOpen className="absolute left-4 top-4 text-base-content/50" size={20} />
              <input
                type="text"
                name="purpose"
                value={appointmentData.purpose}
                onChange={handleInputChange}
                placeholder="e.g., Project Discussion, Doubt Clearing"
                className="input input-bordered w-full pl-12 h-12"
                required
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-base font-medium">Additional Message</span>
            </label>
            <textarea
              name="message"
              value={appointmentData.message}
              onChange={handleInputChange}
              placeholder="Any specific points you'd like to discuss..."
              className="textarea textarea-bordered min-h-[120px] p-4 text-base"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full sm:w-auto sm:min-w-[200px] h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white border-none"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 justify-center">
                    <Send size={20} />
                    Book Appointment
                  </div>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
