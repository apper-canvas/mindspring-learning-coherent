import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getIcon } from '../utils/iconUtils';

// Services
const TrashIcon = getIcon('trash');
import { enrollUserInCourse } from '../services/userCourseService';
const CourseCard = ({ course, onDeleteClick }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
// Icons
const UserIcon = getIcon('user');
const ClockIcon = getIcon('clock');
const BookOpenIcon = getIcon('book-open');
        return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200';
const StarIcon = getIcon('star');
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200';
const DownloadIcon = getIcon('download');
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200';
const CourseCard = ({ course }) => {
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/60 dark:text-gray-200';
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.user);
  const isOnline = useSelector(state => state.offline.isOnline);
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
              
              {isAuthenticated && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteClick(course);
                  }}
                  className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                  aria-label="Delete course"
                ><TrashIcon className="w-4 h-4" /></button>
              )}
        return 'All Levels';
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${course.Id}`);
      return;
    }
    
    setIsEnrolling(true);
    
    try {
      await enrollUserInCourse(user.userId, course.Id);
      toast.success(`Successfully enrolled in ${course.title}!`);
      navigate(`/courses/${course.Id}`);
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);
    
    try {
      // TODO: Implement offline download logic using IndexedDB
      toast.success(`${course.title} is now available offline`);
    } catch (error) {
      toast.error('Failed to download course for offline use.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Link to={`/courses/${course.Id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="card overflow-hidden flex flex-col h-full"
      >
        <div className="relative">
          <img 
            src={course.imageUrl || `https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=500`} 
            alt={course.title || course.Name} 
            className="w-full h-48 object-cover"
          />
          {/* Removed resources badge as it's not directly available in the API response */}
          {false && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
              <FileIcon className="w-3 h-3 mr-1" /> resources
            </span>
          )}
          {course.resources?.length > 0 && (
            <span className="absolute -bottom-7 right-0 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <FileIcon className="w-3 h-3 mr-1" /> {course.resources.length} resources
            </span>
          )}
        </div>
        
        {/* Course Content */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title || course.Name}</h3>

          <div className="flex items-center mb-3 text-sm text-surface-600 dark:text-surface-400">
            <UserIcon className="w-4 h-4 mr-1" />
            <span>{course.instructor}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-4 line-clamp-3">{course.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-sm">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{course.rating}</span>
              <span className="mx-2 text-surface-400">•</span>
              <UsersIcon className="w-4 h-4 text-surface-500 mr-1" />
              <span className="text-sm">{course.enrollments} students</span>
            </div>
          </div>
        </div>
        
        {/* Course Actions */}
        <div className="px-5 pb-5 pt-2 border-t border-surface-200 dark:border-surface-700 flex justify-between">
          <button 
            onClick={handleEnroll} 
            disabled={isEnrolling} 
            className="btn-primary text-sm py-1.5">
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
          <button onClick={handleDownload} disabled={isDownloading || !isOnline} className="btn-ghost text-sm py-1.5">
            {isDownloading ? (
              <span className="flex items-center">Downloading...</span>
            ) : (
              <span className="flex items-center"><DownloadIcon className="w-4 h-4 mr-1" /> Offline</span>
            )}
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;