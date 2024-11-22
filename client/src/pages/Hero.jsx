import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '../assets/image.webp';
import heroImage2 from '../assets/image2.webp';
import About from './About';
import Footer from '../components/Footer';
import customFetch from '../utils/customFetch';
import FeatureCard from '../components/FeatureCard';

export default function Hero() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await customFetch.get('/auth/check-auth');
        setUser(data.user);
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'teacher') return '/teacher-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Content Section */}
          <div className="text-center lg:text-left space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Schedule Your Success with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Teacher Connect
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Streamline your educational journey with our efficient appointment
              booking system. Connect with teachers, schedule consultations, and
              enhance your learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={getDashboardLink()} className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-300
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700
                  active:scale-[0.98]
                  text-white shadow-lg hover:shadow-xl
                  h-full
                  focus:ring-4 focus:ring-blue-500/20
                  disabled:opacity-70 disabled:cursor-not-allowed
                  text-base sm:text-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </Link>
              
              <Link to="/about" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-300
                  bg-white/90 hover:bg-white
                  border-2 border-gray-300 hover:border-gray-400
                  
                  text-gray-700 hover:text-gray-900
                  shadow-md hover:shadow-lg
                  focus:ring-4 focus:ring-gray-500/20
                  active:scale-[0.98]
                  disabled:opacity-70 disabled:cursor-not-allowed
                  text-base sm:text-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative max-w-lg mx-auto lg:max-w-none">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Teacher and Student"
                className="w-full h-auto rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300"
                style={{ maxHeight: "70vh", objectFit: "cover" }}
              />
              <img
                src={heroImage2}
                alt="Online Learning"
                className="absolute -bottom-8 -right-8 w-1/2 md:w-2/3 rounded-xl shadow-xl border-4 border-white transform hover:scale-105 transition-transform duration-300"
                style={{ maxHeight: "40vh", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/80 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              title="Easy Scheduling"
              description="Book appointments with teachers at your convenience"
              icon="🗓️"
            />
            <FeatureCard
              title="Real-time Updates"
              description="Get instant notifications about your appointments"
              icon="⚡"
            />
            <FeatureCard
              title="Secure Platform"
              description="Your data is protected with our secure system"
              icon="🔒"
            />
          </div>
        </div>
      </div>
      <About />
      <Footer />
    </div>
  );
}


