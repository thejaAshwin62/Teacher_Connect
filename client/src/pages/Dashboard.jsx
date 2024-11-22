import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Mail, CheckCircle, Clock3, Camera, Edit, Save, X, User } from 'lucide-react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import Chat from '../components/Chat';
import Avatar from '../components/Avatar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    profilePic: null
  });

  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      try {
        // Fetch user data
        const userResponse = await customFetch.get('/auth/check-auth');
        setUser(userResponse.data.user);
        setEditedUser({
          username: userResponse.data.user.username,
          email: userResponse.data.user.email,
          profilePic: userResponse.data.user.profilePic
        });

        // Fetch appointments
        const appointmentsResponse = await customFetch.get('/appointments/my-appointments');
        setAppointments(appointmentsResponse.data.appointments);
      } catch (error) {
        toast.error('Failed to fetch user data');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndAppointments();
  }, [navigate]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', editedUser.username);
      formData.append('email', editedUser.email);
      if (editedUser.profilePic instanceof File) {
        formData.append('profilePic', editedUser.profilePic);
      }

      const { data } = await customFetch.patch('/users/update-profile', formData);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser(prev => ({ ...prev, profilePic: file }));
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
                      alt={user.username}
                      className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center border-4 border-white/30 shadow-lg">
                      <span className="text-3xl sm:text-4xl font-bold text-white uppercase">
                        {user?.username?.[0] || '?'}
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
                      <div className="form-control rounded-md">
                        <label className="text-white/80 text-sm font-medium mb-1.5 ml-1 ">
                          Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={editedUser.username}
                            onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                            className="input input-bordered  pl-10 bg-white/10 text-white placeholder-white/50 w-full rounded-lg"
                            placeholder="Enter your username"
                          />
                        </div>
                      </div>
                      
                      <div className="form-control">
                        <label className="text-white/80 text-sm font-medium mb-1.5 ml-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                            className="input input-bordered pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-lg w-full"
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
                            username: user.username,
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
                      {user?.username}
                    </h2>
                    <p className="text-lg sm:text-xl text-white/80 flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="h-5 w-5" />
                      {user?.email}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost btn-sm border-2 border-white/20 text-white gap-2 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-center gap-2">
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
        
      {user?.role ==="user" &&(
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointments Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Your Appointments</h2>
              <span className="badge badge-primary">{appointments?.length || 0} Total</span>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
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
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                              <span className="text-lg font-bold text-white uppercase">
                                {appointment.teacherName?.[0] || 'T'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {appointment.teacherName || 'Deleted Teacher'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {appointment.teacherEmail || 'No Email'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {appointment.teacherDepartment || 'Unknown Department'}
                            </p>
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
                    </div>
                  </div>
                ))
              ) : (
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
                teacherId={selectedAppointment.teacherId}
                studentId={user?.id}
                currentUser={user}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center h-full flex items-center justify-center">
                <div>
                  <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Select an appointment to start chatting with your teacher</p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      )}


      </div>
    </div>
  );
}
