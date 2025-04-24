import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Header from '../components/Header';

// Registreer de benodigde Chart.js componenten
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DateFilter = '7d' | '30d' | '90d' | '365d' | 'custom';
type LocationType = 'all' | 'winkel' | 'timmerman';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    happy: 0,
    sad: 0,
    responsesByQuestion: {}
  });
  const [dateFilter, setDateFilter] = useState<DateFilter>('30d');
  const [locationType, setLocationType] = useState<LocationType>('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  const getDateRange = (filter: DateFilter) => {
    const now = new Date();
    switch (filter) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7));
      case '30d':
        return new Date(now.setDate(now.getDate() - 30));
      case '90d':
        return new Date(now.setDate(now.getDate() - 90));
      case '365d':
        return new Date(now.setDate(now.getDate() - 365));
      case 'custom':
        return new Date(customDateRange.start);
      default:
        return new Date(now.setDate(now.getDate() - 30));
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      let query = supabase
        .from('feedback_responses')
        .select(`
          *,
          feedback_questions(question_text)
        `);

      // Datum filter
      const startDate = getDateRange(dateFilter);
      query = query.gte('created_at', startDate.toISOString());
      
      if (dateFilter === 'custom' && customDateRange.end) {
        query = query.lte('created_at', new Date(customDateRange.end).toISOString());
      }

      // Locatie filter
      if (locationType !== 'all') {
        query = query.eq('response_type', locationType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error:', error);
        return;
      }

      // Verwerk de data
      const total = data.length;
      const happy = data.filter(r => r.is_happy).length;
      const sad = total - happy;

      // Groepeer responses per vraag
      const responsesByQuestion = data.reduce((acc: any, response) => {
        const questionText = response.feedback_questions.question_text;
        if (!acc[questionText]) {
          acc[questionText] = { happy: 0, sad: 0 };
        }
        if (response.is_happy) {
          acc[questionText].happy++;
        } else {
          acc[questionText].sad++;
        }
        return acc;
      }, {});

      setStats({
        total,
        happy,
        sad,
        responsesByQuestion
      });
    };

    fetchStats();
  }, [dateFilter, customDateRange, locationType]);

  // Chart data
  const chartData = {
    labels: Object.keys(stats.responsesByQuestion),
    datasets: [
      {
        label: 'Happy',
        data: Object.values(stats.responsesByQuestion).map((q: any) => q.happy),
        backgroundColor: 'rgba(34, 197, 94, 0.5)', // green-500 met opacity
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Sad',
        data: Object.values(stats.responsesByQuestion).map((q: any) => q.sad),
        backgroundColor: 'rgba(239, 68, 68, 0.5)', // red-500 met opacity
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              {['all', 'winkel', 'timmerman'].map((type) => (
                <button
                  key={type}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm
                    ${locationType === type 
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  onClick={() => setLocationType(type as LocationType)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-6 flex space-x-4">
          <select
            className="border rounded p-2"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="7d">Laatste 7 dagen</option>
            <option value="30d">Laatste 30 dagen</option>
            <option value="90d">Laatste kwartaal</option>
            <option value="365d">Laatste jaar</option>
            <option value="custom">Aangepast</option>
          </select>

          {dateFilter === 'custom' && (
            <div className="flex space-x-2">
              <input
                type="date"
                className="border rounded p-2"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <input
                type="date"
                className="border rounded p-2"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Responses */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-gray-700">Totaal</h2>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>

          {/* Happy Responses */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-green-700">Blij</h2>
            <p className="text-4xl font-bold text-green-600">
              {stats.happy} 
              <span className="text-xl">
                ({stats.total ? Math.round((stats.happy / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>

          {/* Sad Responses */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-red-700">Niet blij</h2>
            <p className="text-4xl font-bold text-red-600">
              {stats.sad}
              <span className="text-xl">
                ({stats.total ? Math.round((stats.sad / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Staafdiagram */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Responses by Question</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Bestaande responses lijst */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Detailed Responses</h2>
            <div className="space-y-4">
              {Object.entries(stats.responsesByQuestion).map(([question, counts]: [string, any]) => (
                <div key={question} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{question}</h3>
                  <div className="flex gap-4">
                    <span className="text-green-600">😊 {counts.happy}</span>
                    <span className="text-red-600">☹️ {counts.sad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;