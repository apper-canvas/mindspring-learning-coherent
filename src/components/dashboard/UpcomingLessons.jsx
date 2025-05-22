import { getIcon } from '../../utils/iconUtils';
import { motion } from 'framer-motion';
import { formatDashboardDate, getTimeRemaining } from '../../utils/dashboardUtils';

// Icons
const CalendarIcon = getIcon('calendar');
const ClockIcon = getIcon('clock');
const ArrowRightIcon = getIcon('arrow-right');
const CheckIcon = getIcon('check');

const UpcomingLessons = ({ courses, loading }) => {
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Upcoming Lessons</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Extract next lessons from enrolled courses and sort by date
  const upcomingLessons = courses
    .filter(course => course.nextLesson)
    .map(course => ({
      courseId: course.id,
      courseTitle: course.title,
      courseImage: course.imageUrl,
      ...course.nextLesson
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcomingLessons.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Upcoming Lessons</h2>
        <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
          <p className="text-surface-600 dark:text-surface-400">
            You don't have any upcoming lessons scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
      <h2 className="text-xl font-bold mb-6 text-surface-900 dark:text-white">Upcoming Lessons</h2>
      
      <div className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-8 before:w-0.5 before:bg-primary/30">
        {upcomingLessons.map((lesson, index) => (
          <motion.div 
            key={`${lesson.courseId}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="mb-6 relative"
          >
            <div className="absolute left-[-14px] top-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <CalendarIcon className="w-3 h-3 text-white" />
            </div>
            
            <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
              <div className="flex items-start">
                <img 
                  src={lesson.courseImage} 
                  alt={lesson.courseTitle} 
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
                <div className="flex-grow">
                  <h3 className="font-medium text-surface-800 dark:text-surface-200">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                    {lesson.courseTitle}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-surface-500 dark:text-surface-400">
                    <span className="flex items-center mr-3">
                      <CalendarIcon className="w-3 h-3 mr-1" /> {formatDashboardDate(lesson.date)}
                    </span>
                    <span className="flex items-center mr-3">
                      <ClockIcon className="w-3 h-3 mr-1" /> {lesson.durationMinutes} min
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
                  {getTimeRemaining(lesson.date)}
                </span>
              </div>
              
              <div className="mt-3 flex justify-between">
                <button className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
                  Start Lesson <ArrowRightIcon className="ml-1 w-3 h-3" />
                </button>
                <button className="text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 flex items-center">
                  <CheckIcon className="mr-1 w-3 h-3" /> Mark as Complete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingLessons;