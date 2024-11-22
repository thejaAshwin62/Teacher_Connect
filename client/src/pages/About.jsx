import React, { useState, useEffect } from 'react';
import { CalendarDays, UserCheck, Clock, CheckCircle, GraduationCap, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import FeatureCard from '../components/FeatureCard';
import StatCard from '../components/StatCard';

export default function About() {
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
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About Our Appointment System
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Streamlining student-teacher interactions through efficient appointment scheduling and management.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<UserCheck className="w-12 h-12 text-blue-500" />}
            title="User Requests"
            description="Students can easily send appointment requests to their teachers"
            color="blue"
          />
          <FeatureCard
            icon={<CalendarDays className="w-12 h-12 text-purple-500" />}
            title="Teacher Schedules"
            description="Teachers create and manage their available time slots"
            color="purple"
          />
          <FeatureCard
            icon={<Clock className="w-12 h-12 text-green-500" />}
            title="Booking System"
            description="Users can book specific time slots from teacher schedules"
            color="green"
          />
          <FeatureCard
            icon={<CheckCircle className="w-12 h-12 text-indigo-500" />}
            title="Confirmation"
            description="Teachers review and approve appointment requests"
            color="indigo"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<Users className="w-8 h-8 text-blue-500" />}
              value="500+"
              label="Active Users"
            />
            <StatCard
              icon={<GraduationCap className="w-8 h-8 text-purple-500" />}
              value="50+"
              label="Expert Teachers"
            />
            <StatCard
              icon={<MessageSquare className="w-8 h-8 text-green-500" />}
              value="1000+"
              label="Appointments"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
            Join our platform to simplify your appointment scheduling process and enhance student-teacher communication.
          </p>
          {!user ? (
            <Link to="/login">
              <button className="px-6 py-3 rounded-xl font-medium transition-all duration-300
                bg-white hover:bg-gray-100 active:scale-[0.98]
                text-gray-700 hover:text-gray-900
                shadow-md hover:shadow-lg
                focus:ring-4 focus:ring-gray-500/20
                disabled:opacity-70 disabled:cursor-not-allowed
                text-base sm:text-lg">
                Get Started
              </button>
            </Link>
          ) : (
            <Link to={
              user.role === 'admin' 
                ? '/admin-dashboard' 
                : user.role === 'teacher'
                  ? '/teacher-dashboard'
                  : '/search-teacher'
            }>
              <button className="px-6 py-3 rounded-xl font-medium transition-all duration-300
                bg-white hover:bg-gray-100 active:scale-[0.98]
                text-gray-700 hover:text-gray-900
                shadow-md hover:shadow-lg
                focus:ring-4 focus:ring-gray-500/20
                disabled:opacity-70 disabled:cursor-not-allowed
                text-base sm:text-lg">
                {user.role === 'admin' 
                  ? 'Manage Teachers' 
                  : user.role === 'teacher'
                    ? 'Go to Dashboard'
                    : 'View Teachers'}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}



