import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import { updateCourseProgress } from '../../store/dashboardSlice';

// Icons
const CheckIcon = getIcon('check');
const BookOpenIcon = getIcon('book-open');
const ClockIcon = getIcon('clock');
const ChevronDownIcon = getIcon('chevron-down');
const ChevronUpIcon = getIcon('chevron-up');
const AwardIcon = getIcon('award');
const BookmarkIcon = getIcon('bookmark');

const CourseProgressTracker = ({ courses, loading }) => {
  const dispatch = useDispatch();
  const [expandedCourses, setExpandedCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const isOffline = useSelector(state => !state.offline.isOnline);
  
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id);
    }
  }, [courses, selectedCourse]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleModuleCompletion = (courseId, moduleId, isComplete) => {
    dispatch(updateCourseProgress({ 
      courseId, 
      moduleId, 
      isComplete 
    }))
      .unwrap()
      .then(() => {
        toast.success(isComplete 
          ? 'Module marked as completed' 
          : 'Module marked as incomplete');
      })
      .catch(() => {
        toast.error('Failed to update progress');
      });
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-6 text-surface-900 dark:text-white">Course Progress Tracker</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
          <div className="h-40 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Course Progress Tracker</h2>
        <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg text-center">
          <BookOpenIcon className="w-12 h-12 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-600 dark:text-surface-400 mb-2">You haven't enrolled in any courses yet.</p>
          <p className="text-sm text-surface-500 dark:text-surface-500">Enroll in courses to track your progress here.</p>
        </div>
      </div>
    );
  }

  const currentCourse = courses.find(c => c.id === selectedCourse) || courses[0];
  
  return (
    <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Course Progress Tracker</h2>
        {isOffline && (
          <span className="text-amber-600 dark:text-amber-400 text-sm bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
            Offline Mode
          </span>
        )}
      </div>
      
      {/* Course Selection */}
      <div className="mb-6">
        <label htmlFor="course-select" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Select Course
        </label>
        <select 
          id="course-select"
          value={selectedCourse || ''}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="input w-full"
        >
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title} ({course.progress}% complete)
            </option>
          ))}
        </select>
      </div>
      
      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <img 
              src={currentCourse.imageUrl} 
              alt={currentCourse.title} 
              className="w-12 h-12 object-cover rounded-md mr-3"
            />
            <div>
              <h3 className="font-medium text-surface-900 dark:text-white">{currentCourse.title}</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">{currentCourse.instructor}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{currentCourse.progress}%</div>
            <div className="text-xs text-surface-500 dark:text-surface-400">Overall Completion</div>
          </div>
        </div>
        <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-3.5 mb-2">
          <div 
            className="bg-primary h-3.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${currentCourse.progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Module Progress */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {currentCourse.modules?.map((module, index) => (
          <motion.div 
            key={module.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden"
          >
            <div className="p-3 bg-surface-50 dark:bg-surface-700 flex items-center justify-between">
              <span className="font-medium">{module.title}</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={module.completed} onChange={(e) => handleModuleCompletion(currentCourse.id, module.id, e.target.checked)} className="checkbox" />
                <span className="ml-2 text-sm">{module.completed ? 'Completed' : 'Mark as Complete'}</span>
              </label>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgressTracker;