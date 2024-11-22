import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Stats = () => {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await customFetch.get('/admin/stats');
        setStatsData(data.data);
      } catch (error) {
        toast.error('Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !statsData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const lineChartData = {
    labels: statsData.monthlyStats.map(stat => stat.month),
    datasets: [
      {
        label: 'Teachers',
        data: statsData.monthlyStats.map(stat => stat.teachers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Students',
        data: statsData.monthlyStats.map(stat => stat.students),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ['Active', 'Pending', 'Total'],
    datasets: [
      {
        label: 'Teachers',
        data: [
          statsData.statusStats.teachers.active,
          statsData.statusStats.teachers.pending,
          statsData.statusStats.teachers.total,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Students',
        data: [
          statsData.statusStats.students.active,
          statsData.statusStats.students.pending,
          statsData.statusStats.students.total,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-3xl font-bold text-white">Statistics Overview</h2>
        <p className="text-blue-100 mt-2">Monitor user growth and engagement</p>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-xl">
        {/* Stats Cards */}
        <div className="stats shadow w-full " >
          <div className="stat bg-blue-50 m-4 rounded-xl">
            <div className="stat-title text-blue-600 ml-4">Total Teachers</div>
            <div className="stat-value text-blue-600 ml-4">{statsData.statusStats.teachers.total}</div>
            <div className="stat-desc text-blue-500 ml-4">
              {statsData.statusStats.teachers.active} Active
            </div>
          </div>
          
          <div className="stat bg-green-50 m-4 rounded-xl">
            <div className="stat-title text-green-600 ml-4 ">Total Students</div>
            <div className="stat-value text-green-600 ml-4">{statsData.statusStats.students.total}</div>
            <div className="stat-desc text-green-500 ml-4">
              {statsData.statusStats.students.active} Active
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-gray-700">Monthly Growth</h3>
            <Line data={lineChartData} options={options} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-gray-700">User Status Distribution</h3>
            <Bar data={barChartData} options={options} />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="stats shadow w-full p-5">
          <div className="stat m-4">
            <div className="stat-figure text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Approval Rate</div>
            <div className="stat-value text-blue-500">
              {Math.round((statsData.statusStats.teachers.active / statsData.statusStats.teachers.total) * 100)}%
            </div>
            <div className="stat-desc">Teachers</div>
          </div>
          
          <div className="stat m-4">
            <div className="stat-figure text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Approval Rate</div>
            <div className="stat-value text-green-500">
              {Math.round((statsData.statusStats.students.active / statsData.statusStats.students.total) * 100)}%
            </div>
            <div className="stat-desc">Students</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
