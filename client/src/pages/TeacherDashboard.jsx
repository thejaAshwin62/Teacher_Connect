import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, CheckCircle, X, Clock3, Users, UserPlus, PenSquare, ChevronRight, Menu, Save, Edit, Camera } from 'lucide-react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import Chat from '../components/Chat';
import Avatar from '../components/Avatar';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    profilePic: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await customFetch.get('/auth/check-auth');
        const userData = userResponse.data.user;
        setUser(userData);
        setEditedUser({
          name: userData.name,
          email: userData.email,
          profilePic: userData.profilePic
        });

        // Fetch appointments
        const appointmentsResponse = await customFetch.get('/appointments/teacher/appointments');
        setAppointments(appointmentsResponse.data.appointments);
      } catch (error) {
        toast.error('Failed to fetch data');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const { data } = await customFetch.patch(`/appointments/teacher/appointments/${appointmentId}`, {
        status
      });
      
      setAppointments(appointments.map(appointment => 
        appointment._id === appointmentId ? { ...appointment, status } : appointment
      ));
      
      toast.success(`Appointment ${status}`);
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editedUser.name);
      formData.append('email', editedUser.email);
      if (editedUser.profilePic instanceof File) {
        formData.append('profilePic', editedUser.profilePic);
      }

      const { data } = await customFetch.patch('/teacher/update-profile', formData);

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="relative">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center border-4 border-white/30 shadow-lg">
                      <span className="text-3xl sm:text-4xl font-bold text-white uppercase">
                        {user?.name?.[0] || '?'}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Camera className="h-8 w-8 text-white" />
                    </label>
                  )}
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl space-y-6">
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="inline-block px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm font-medium mb-2 ml-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                            className="input input-bordered pl-10 bg-white/10 text-white placeholder-white/50 w-full rounded-lg"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      
                      <div className="form-control">
                        <label className="inline-block px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm font-medium mb-2 ml-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                            className="input input-bordered pl-10 bg-white/10 text-white placeholder-white/50 w-full rounded-lg"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button 
                        type="submit" 
                        className="btn w-full sm:flex-1 normal-case bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Save size={18} />
                          <span className="text-sm font-medium">Save Changes</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser({
                            name: user.name,
                            email: user.email,
                            profilePic: user.profilePic
                          });
                        }}
                        className="btn w-full sm:flex-1 normal-case bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <X size={18} />
                          <span className="text-sm font-medium">Cancel</span>
                        </div>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      {user?.name}
                    </h2>
                    <p className="text-lg sm:text-xl text-white/80 flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="h-5 w-5" />
                      {user?.email}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost btn-sm border-2 border-white/20 text-white gap-2 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-center gap-2 text-white">
                      <Edit size={18} />
                      Edit Profile
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Your Appointments</h2>
              <span className="badge badge-primary">{appointments.length} Total</span>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedAppointment?._id === appointment._id
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                            <span className="text-lg font-bold text-white uppercase">
                              {appointment.studentName?.[0] || 'S'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{appointment.studentName}</h4>
                          <p className="text-sm text-gray-500">{appointment.studentEmail}</p>
                        </div>
                      </div>
                      <span className={`badge ${
                        appointment.status === "pending"
                          ? "badge-warning"
                          : appointment.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>
                    </div>

                    {appointment.message && (
                      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{appointment.message}</p>
                      </div>
                    )}

                    {appointment.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(appointment._id, "approved");
                          }}
                          className="btn w-full sm:w-auto normal-case bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Approve</span>
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(appointment._id, "rejected");
                          }}
                          className="btn w-full sm:w-auto normal-case bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <X size={16} />
                            <span className="text-sm font-medium">Reject</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {appointments.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No appointments yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="h-[calc(100vh-300px)]">
            {selectedAppointment ? (
              <Chat
                appointmentId={selectedAppointment._id}
                teacherId={user?.id}
                studentId={selectedAppointment.studentId}
                currentUser={user}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center h-full flex items-center justify-center">
                <div>
                  <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Select an appointment to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
