import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios'; // Add this import

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SubmissionTrendsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:8000/api";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSubmissionTrends();
  }, []);

  const fetchSubmissionTrends = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/submission-trends`, {
        headers,
        withCredentials: true
      });
      
      if (response.data) {
        const { labels, papersData, proposalsData } = response.data;
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Papers',
              data: papersData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.3,
            },
            {
              label: 'Proposals',
              data: proposalsData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.3,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching submission trends:", err);
      setError(err.response?.data?.error || "Failed to load submission trends");
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Submission Trends Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Submissions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time Period'
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="font-semibold mb-2">Error Loading Chart</p>
          <p>{error}</p>
          <button 
            onClick={fetchSubmissionTrends}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default SubmissionTrendsChart;