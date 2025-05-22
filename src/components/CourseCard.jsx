import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Icons
const UserIcon = getIcon('user');
const ClockIcon = getIcon('clock');
const BookOpenIcon = getIcon('book-open');
const UsersIcon = getIcon('users');
const StarIcon = getIcon('star');
const FileIcon = getIcon('file');
const DownloadIcon = getIcon('download');

const CourseCard = ({ course }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
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

  const handleEnroll = () => {
    setIsEnrolling(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`Successfully enrolled in ${course.title}!`);
      setIsEnrolling(false);
    }, 1000);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      toast.success(`${course.title} is now available offline`);
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <Link to={`/courses/${course.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="card overflow-hidden flex flex-col h-full"
      >
        {/* Course Image */}
        <div className="relative">
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
              {getDifficultyLabel(course.difficulty)}
            </span>
            {course.resources?.length > 0 && (
              <span className="absolute -bottom-7 right-0 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <FileIcon className="w-3 h-3 mr-1" /> {course.resources.length} resources
              </span>
            )}
          </div>
        </div>
        
        {/* Course Content */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
          
          <div className="flex items-center mb-3 text-sm text-surface-600 dark:text-surface-400">
            <UserIcon className="w-4 h-4 mr-1" />
            <span>{course.instructor}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-4 line-clamp-3">{course.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
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
            onClick={(e) => {e.preventDefault(); handleEnroll();}} 
            disabled={isEnrolling} 
            className="btn-primary text-sm py-1.5">
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
          <button onClick={(e) => {e.preventDefault(); handleDownload(e);}} disabled={isDownloading} className="btn-ghost text-sm py-1.5">
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