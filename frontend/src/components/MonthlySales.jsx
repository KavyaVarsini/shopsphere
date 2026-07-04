import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../styles/monthlySales.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MonthlySales = ({ data }) => {
  const labels = data.map(d => d.month);
  const values = data.map(d => d.totalSales);

  // Royal color palette
  const royalColors = {
    gold: '#D4AF37',
    lightGold: '#FFD700',
    darkGold: '#B8860B',
    bgDark: '#1a1a1a',
    bgDarker: '#151515'
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales Revenue (₹)",
        data: values,
        backgroundColor: values.map((val, index) => 
          index === labels.length - 1 
            ? `rgba(212, 175, 55, 0.9)` // Highlight current/latest month
            : `rgba(212, 175, 55, 0.7)`
        ),
        borderColor: values.map((val, index) => 
          index === labels.length - 1 
            ? `rgba(255, 215, 0, 1)` // Highlight current/latest month
            : `rgba(184, 134, 11, 1)`
        ),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(255, 215, 0, 0.9)',
        hoverBorderColor: '#FFD700',
        hoverBorderWidth: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we have custom one
        position: "top",
        labels: {
          color: "#D4AF37",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
      tooltip: {
        backgroundColor: "rgba(26, 26, 26, 0.95)",
        titleColor: "#FFD700",
        bodyColor: "#e0e0e0",
        borderColor: "rgba(212, 175, 55, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 8,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context) => {
            return `₹ ${context.parsed.y.toLocaleString()}`;
          },
          title: (context) => {
            return `Month: ${context[0].label}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false
        },
        ticks: {
          color: "#a8a8a8",
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false
        },
        ticks: {
          color: "#a8a8a8",
          font: {
            size: 11,
            weight: '500'
          },
          callback: function(value) {
            return "₹ " + value.toLocaleString();
          },
          padding: 10
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      bar: {
        borderSkipped: false,
      }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'easeOutCubic'
      }
    }
    
  };

  return (
    <div className="monthly-sales-container">
      <div className="chart-legend">
        <div className="legend-color"></div>
        <span className="legend-text">Monthly Sales Revenue</span>
      </div>
      <div className="chart-wrapper">
        <Bar 
          data={chartData} 
          options={chartOptions}
          style={{
            background: 'transparent',
            borderRadius: '8px'
          }}
        />
      </div>
    </div>
  );
};

export default MonthlySales;