import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { getIcon } from '../../utils/iconUtils';
import { getStreakStatus, formatLearningTime } from '../../utils/dashboardUtils';

// Icons
const FlameIcon = getIcon('flame');
const CalendarIcon = getIcon('calendar');
const ClockIcon = getIcon('clock');
const TrophyIcon = getIcon('trophy');

const LearningStreak = ({ streakData, currentStreak, longestStreak, totalLearningTime, loading }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [chartTheme, setChartTheme] = useState('light');

  // Set chart theme based on dark mode
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setChartTheme(isDarkMode ? 'dark' : 'light');
  }, []);

  // Configure chart data when streakData changes
  useEffect(() => {
    if (streakData && streakData.length > 0) {
      // Extract dates and minutes for chart
      const dates = streakData.map(day => day.date);
      const minutes = streakData.map(day => day.minutes);
      
      setChartSeries([{
        name: 'Learning Minutes',
        data: minutes
      }]);
      
      setChartOptions({
        chart: {
          type: 'bar',
          height: 200,
          toolbar: {
            show: false
          },
          fontFamily: 'inherit',
          foreColor: chartTheme === 'dark' ? '#CBD5E1' : '#475569',
          background: 'transparent'
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 4,
            columnWidth: '60%',
          }
        },
        colors: minutes.map(m => m > 0 ? '#6366F1' : '#E2E8F0'),
        dataLabels: {
          enabled: false
        },
        grid: {
          show: false
        },
        xaxis: {
          categories: dates.map(date => date.substring(5)), // Format as MM-DD
          labels: {
            show: false,
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `${value} minutes`
          },
          x: {
            formatter: (value) => {
              const date = new Date(streakData[value - 1].date);
              return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            }
          }
        },
        theme: {
          mode: chartTheme
        }
      });
    }
  }, [streakData, chartTheme]);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Learning Streak</h2>
        <div className="animate-pulse">
          <div className="h-40 bg-surface-200 dark:bg-surface-700 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-surface-200 dark:bg-surface-700 rounded"></div>
            <div className="h-20 bg-surface-200 dark:bg-surface-700 rounded"></div>
            <div className="h-20 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
      <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Learning Streak</h2>
      
      <div className="mb-6">
        <div className="text-sm text-surface-600 dark:text-surface-400 mb-2">
          Last 30 days activity
        </div>
        
        {chartSeries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={200}
            />
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <FlameIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-surface-900 dark:text-white">{currentStreak}</div>
          <div className="text-xs text-surface-600 dark:text-surface-400">Current Streak</div>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-surface-900 dark:text-white">{longestStreak}</div>
          <div className="text-xs text-surface-600 dark:text-surface-400">Longest Streak</div>
        </div>
        
        <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-surface-900 dark:text-white">{Math.floor(totalLearningTime / 60)}</div>
          <div className="text-xs text-surface-600 dark:text-surface-400">Total Hours</div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg text-center">
        <p className="text-sm text-surface-800 dark:text-surface-200">
          {getStreakStatus(currentStreak, longestStreak)}
        </p>
      </div>
      
      <div className="mt-4 text-xs text-center text-surface-500 dark:text-surface-400">
        Total learning time: {formatLearningTime(totalLearningTime)}
      </div>
    </div>
  );
};

export default LearningStreak;