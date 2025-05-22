import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { formatDashboardDate } from '../../utils/dashboardUtils';

// Icons
const PlayIcon = getIcon('play');
const ClockIcon = getIcon('clock');
const CheckCircleIcon = getIcon('check-circle');
const ArrowRightIcon = getIcon('arrow-right');
const BarChartIcon = getIcon('bar-chart-2');

const CourseProgress = ({ courses, loading }) => {
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-6 text-surface-900 dark:text-white">Your Courses</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Your Courses</h2>
        <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
          <p className="text-surface-600 dark:text-surface-400 mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-primary inline-flex items-center">
            Browse Courses <ArrowRightIcon className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Your Courses</h2>
        <Link to="/courses" className="text-primary hover:text-primary-dark text-sm font-medium flex items-center">
          Browse All Courses <ArrowRightIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-6">
        {courses.map((course) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden"
          >
            <div className="flex items-center p-4 bg-surface-50 dark:bg-surface-700 border-b border-surface-200 dark:border-surface-600">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-12 h-12 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h3 className="font-medium text-surface-900 dark:text-white">{course.title}</h3>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  <span className="inline-flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    Last accessed: {formatDashboardDate(course.lastAccessed)}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
              <button className="btn-primary-outline text-sm py-1.5 px-3 flex items-center" title="Continue learning">
                <PlayIcon className="w-4 h-4 mr-1.5" /> 
                <span className="hidden sm:inline">Resume</span>
              </button>
              <Link to={`/dashboard?tab=progress&course=${course.id}`} className="btn-ghost text-sm py-1.5 px-3 flex items-center" title="View detailed progress">
                <BarChartIcon className="w-4 h-4 mr-1.5 sm:mr-0" /> <span className="hidden sm:inline">Progress</span>
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Progress: {course.progress}%
                </span>
                {course.progress === 100 && (
                  <span className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Completed
                  </span>
                )}
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${course.progress}%` }}>
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;