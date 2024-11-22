import React from 'react'

const FeatureCard = ({ title, description, icon }) => {
    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 
          hover:shadow-xl transition-all duration-300 
          transform hover:-translate-y-1
          border border-gray-100">
          <div className="text-4xl mb-4">{icon}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
          
          {/* Optional: Add a subtle hover effect button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full px-4 py-2 rounded-lg font-medium
              bg-gray-50 hover:bg-gray-100
              text-gray-700 
              transition-all duration-300
              text-sm" onClick={() => navigate('/about')}>
              Learn More
            </button>
          </div>
        </div>
      );
}

export default FeatureCard
