import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getIcon } from '../utils/iconUtils';

// Services
import { enrollUserInCourse } from '../services/userCourseService';

// Icons
const TrashIcon = getIcon('trash');
const UserIcon = getIcon('user');
const ClockIcon = getIcon('clock');
const BookOpenIcon = getIcon('book-open');
const StarIcon = getIcon('star');
const DownloadIcon = getIcon('download');
const UsersIcon = getIcon('users');
const FileIcon = getIcon('file');

const CourseCard = ({ course, onDeleteClick }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
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
      const response = await enrollUserInCourse(user.userId, course.Id);
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
      // Dispatch to offline slice
      dispatch({
        type: 'offline/downloadCourse',
        payload: course
      });
      
      toast.success(`${course.title || course.Name} is now being downloaded for offline use`);
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
        
        {/* Delete button if onDeleteClick is provided */}
        {onDeleteClick && isAuthenticated && (
          <div className="absolute top-2 right-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick(course);
              }}
              className="bg-surface-800/60 rounded-full p-1.5 text-white hover:bg-surface-900 transition-colors"
              aria-label="Delete course"
            ><TrashIcon className="w-4 h-4" /></button>
          </div>
        )}
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