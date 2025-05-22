import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getUserEnrolledCourses } from '../services/userCourseService';
import { getUserProfile } from '../services/userService';

// Dashboard Components
import CourseProgress from '../components/dashboard/CourseProgress';
import UpcomingLessons from '../components/dashboard/UpcomingLessons';
import AchievementSection from '../components/dashboard/AchievementSection';
import CourseProgressTracker from '../components/dashboard/CourseProgressTracker';
import LearningStreak from '../components/dashboard/LearningStreak';

// Icons
const BookIcon = getIcon('book');
const CalendarIcon = getIcon('calendar');
const AwardIcon = getIcon('award');
const ActivityIcon = getIcon('activity');
const BarChartIcon = getIcon('bar-chart-2');
const RefreshIcon = getIcon('refresh-cw');

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const oldState = useSelector(state => state.dashboard);
  const {
    enrolledCourses, 
    streakData, 
    achievements,
    currentStreak,
    longestStreak, 
    totalLearningTime,
    loading,
    error
  } = oldState;
  
  const { user, isAuthenticated } = useSelector(state => state.user);
  const [userEnrolledCourses, setUserEnrolledCourses] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  const isLoading = loadingCourses || loadingProfile || loading;
  
  // Parse URL parameters to get active tab
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get('tab');
  const courseFromUrl = params.get('course');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'courses');
  const [selectedCourseId, setSelectedCourseId] = useState(courseFromUrl || null);

  // Fetch user's enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!isAuthenticated || !user?.userId) return;
      
      setLoadingCourses(true);
      try {
        const enrolledCourses = await getUserEnrolledCourses(user.userId);
        setUserEnrolledCourses(enrolledCourses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setDashboardError("Failed to load your enrolled courses");
        toast.error("Could not load your enrolled courses");
      } finally {
        setLoadingCourses(false);
      }
    };
    
    fetchEnrolledCourses();
  }, [isAuthenticated, user]);
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      setLoadingProfile(true);
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Could not load your profile data");
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated]);

  // Get user's first name for greeting
  const userName = userProfile?.fullName?.split(' ')[0] || 
                   user?.firstName || 
                   "Student";

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Update URL when tab changes
  const setActiveTabWithNavigation = (tab, courseId = null) => {
    setActiveTab(tab);
    
    // Refresh data
    setLoadingCourses(true);
    setLoadingProfile(true);
    
    // Re-fetch data
    getUserEnrolledCourses(user.userId).then(setUserEnrolledCourses).finally(() => setLoadingCourses(false));
    getUserProfile().then(setUserProfile).finally(() => setLoadingProfile(false));
  };
  
  const refreshDashboard = () => {
    toast.info('Refreshing dashboard data...');
    dispatch(fetchDashboardData());
  };
  
  // Show error state if data loading failed
  if (dashboardError || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-center">
          <h2 className="text-xl font-bold mb-2 text-red-800 dark:text-red-400">Failed to load dashboard</h2>
          <p className="text-red-700 dark:text-red-300 mb-4">{dashboardError || error}</p>
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
          disabled={isLoading}
          className="btn-ghost flex items-center text-sm py-1.5"
        >
          <RefreshIcon className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
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
          { id: 'progress', label: 'Progress Tracker', icon: BarChartIcon },
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabWithNavigation(tab.id)}
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
          <CourseProgress courses={userEnrolledCourses} loading={loadingCourses} />
        </div>
        
        <div className={activeTab === 'upcoming' ? 'block' : 'hidden lg:block'}>
          <UpcomingLessons courses={userEnrolledCourses} loading={loadingCourses} />
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
        
        <div className={activeTab === 'progress' ? 'block' : 'hidden lg:block'}>
          <CourseProgressTracker 
            courses={userEnrolledCourses} 
            selectedCourseId={selectedCourseId}
            loading={loadingCourses} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;