// components/Admin/StatusDistributionChart.jsx
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusDistributionChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:8000/api";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // fixed mapping of colors by status
  const statusColors = {
    PENDING: {
      bg: "rgba(54, 162, 235, 0.6)",   // blue
      border: "rgb(54, 162, 235)",
    },
    UNDER_REVIEW: {
      bg: "rgba(255, 206, 86, 0.6)",   // yellow
      border: "rgb(255, 206, 86)",
    },
    ACCEPTED: {
      bg: "rgba(75, 192, 192, 0.6)",   // teal
      border: "rgb(75, 192, 192)",
    },
    REJECTED: {
      bg: "rgba(255, 99, 132, 0.6)",   // red
      border: "rgb(255, 99, 132)",
    },
  };

  useEffect(() => {
    fetchStatusDistribution();
  }, []);

  const fetchStatusDistribution = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/admin/status-distribution`, {
        headers,
        withCredentials: true,
      });

      if (response.data) {
        const { labels, counts } = response.data;

        setChartData({
          labels,
          datasets: [
            {
              label: "Submissions",
              data: counts,
              backgroundColor: labels.map(
                (label) => statusColors[label]?.bg || "rgba(153, 102, 255, 0.6)" // fallback purple
              ),
              borderColor: labels.map(
                (label) => statusColors[label]?.border || "rgb(153, 102, 255)"
              ),
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error fetching status distribution:", err);
      setError(err.response?.data?.error || "Failed to load status distribution");
    } finally {
      setLoading(false);
    }
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: "70%", // thinner ring
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (loading) {
    return <div className="h-48 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="h-48 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-60 h-60">
        {chartData && <Doughnut data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default StatusDistributionChart;
