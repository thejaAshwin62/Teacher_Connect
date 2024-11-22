import React from 'react'

const StatCard = ({ icon, value, label }) => {
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

export default StatCard
