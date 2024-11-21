import React from 'react';
import { CalendarDays, UserCheck, Clock, CheckCircle, GraduationCap, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
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
          <Link to="/login">
            <button className="btn btn-lg bg-white text-blue-600 hover:bg-blue-50 border-none">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="card bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="card-body items-center text-center p-6">
        <div className={`rounded-full p-4 bg-${color}-50 mb-4`}>
          {icon}
        </div>
        <h3 className="card-title text-xl mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="rounded-full p-3 bg-gray-50">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}