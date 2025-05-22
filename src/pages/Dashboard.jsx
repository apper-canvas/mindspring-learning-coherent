import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { fetchDashboardData } from '../store/dashboardSlice';

// Dashboard Components
import CourseProgress from '../components/dashboard/CourseProgress';
import UpcomingLessons from '../components/dashboard/UpcomingLessons';
import AchievementSection from '../components/dashboard/AchievementSection';
import LearningStreak from '../components/dashboard/LearningStreak';

// Icons
const BookIcon = getIcon('book');
const CalendarIcon = getIcon('calendar');
const AwardIcon = getIcon('award');
const ActivityIcon = getIcon('activity');
const RefreshIcon = getIcon('refresh-cw');

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    enrolledCourses, 
    streakData, 
    achievements,
    currentStreak,
    longestStreak, 
    totalLearningTime,
    loading,
    error
  } = useSelector(state => state.dashboard);
  
  const [activeTab, setActiveTab] = useState('courses');
  
  // Fetch dashboard data when component mounts
  useEffect(() => {
    dispatch(fetchDashboardData())
      .unwrap()
      .catch(error => {
        toast.error('Failed to load dashboard data');
      });
  }, [dispatch]);
  
  // Get user's first name for greeting (would come from auth in a real app)
  const userName = "User";
  
  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const refreshDashboard = () => {
    toast.info('Refreshing dashboard data...');
    dispatch(fetchDashboardData());
  };
  
  // Show error state if data loading failed
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-center">
          <h2 className="text-xl font-bold mb-2 text-red-800 dark:text-red-400">Failed to load dashboard</h2>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <button onClick={refreshDashboard} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Here's an overview of your learning journey
          </p>
        </motion.div>
        
        <button 
          onClick={refreshDashboard} 
          disabled={loading}
          className="btn-ghost flex items-center text-sm py-1.5"
        >
          <RefreshIcon className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-surface-100 dark:bg-surface-700/50 p-1 rounded-lg w-fit">
        {[
          { id: 'courses', label: 'My Courses', icon: BookIcon },
          { id: 'upcoming', label: 'Upcoming', icon: CalendarIcon },
          { id: 'achievements', label: 'Achievements', icon: AwardIcon },
          { id: 'streak', label: 'Learning Streak', icon: ActivityIcon },
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-surface-800 text-primary shadow-sm' 
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              <TabIcon className="w-4 h-4 mr-1.5" /> {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content - Changes based on active tab */}
        <div className={activeTab === 'courses' ? 'block' : 'hidden lg:block'}>
          <CourseProgress courses={enrolledCourses} loading={loading} />
        </div>
        
        <div className={activeTab === 'upcoming' ? 'block' : 'hidden lg:block'}>
          <UpcomingLessons courses={enrolledCourses} loading={loading} />
        </div>
        
        <div className={activeTab === 'achievements' ? 'block' : 'hidden lg:block'}>
          <AchievementSection achievements={achievements} loading={loading} />
        </div>
        
        <div className={activeTab === 'streak' ? 'block' : 'hidden lg:block'}>
          <LearningStreak 
            streakData={streakData} 
            currentStreak={currentStreak} 
            longestStreak={longestStreak}
            totalLearningTime={totalLearningTime}
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;