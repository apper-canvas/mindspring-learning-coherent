import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Services
import { getCourseById } from '../services/courseService';
import { enrollUserInCourse, isUserEnrolled } from '../services/userCourseService';
import CourseResources from '../components/CourseResources';

// Icons
const ArrowLeftIcon = getIcon('arrow-left');
const UserIcon = getIcon('user');
const ClockIcon = getIcon('clock');
const StarIcon = getIcon('star');
const UsersIcon = getIcon('users');
const PlayIcon = getIcon('play');
const BookOpenIcon = getIcon('book-open');
const CheckCircleIcon = getIcon('check-circle');
const DownloadIcon = getIcon('download');
const ShareIcon = getIcon('share');
const GlobeIcon = getIcon('globe');
const MessageCircleIcon = getIcon('message-circle');
const BriefcaseIcon = getIcon('briefcase');
const FileIcon = getIcon('file');
const FileTextIcon = getIcon('file-text');
const EditIcon = getIcon('edit');
const ChevronDownIcon = getIcon('chevron-down');

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState('section1');
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const foundCourse = await getCourseById(courseId);
        if (!foundCourse) {
          throw new Error('Course not found');
        }
        
        setCourse(foundCourse);
        
        // Check if user is enrolled
        if (isAuthenticated && user) {
          const enrolled = await isUserEnrolled(user.userId, courseId);
          setIsEnrolled(enrolled);
        }
        
        // Get related courses
        // This would normally be a separate API call with filters
        if (foundCourse.category) {
          // TODO: Get related courses based on category
          return;
        }
        
        // Initialize with empty array until we implement related courses
        setRelatedCourses([]);
      } catch (error) {
        setError('Failed to load course details');
        console.error('Error loading course details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/courses/${courseId}`);
      return;
    }
    
    if (isEnrolled) {
      // Already enrolled, navigate to dashboard or course content
      navigate('/dashboard');
      return;
    }
    
    setIsEnrolling(true);
    
    try {
      await enrollUserInCourse(user.userId, courseId);
      toast.success(`Successfully enrolled in ${course.title || course.Name}!`);
      setIsEnrolled(true);
      // Optionally navigate to dashboard or course content
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // TODO: Implement offline download logic using IndexedDB
    toast.info('This functionality is not yet implemented.');
    setIsDownloading(false);
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

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
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'All Levels';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon className="w-6 h-6 text-primary/60" />
          </div>
          <h2 className="text-xl font-semibold">Loading course details...</h2>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{error || 'Course not found'}</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">The course you're looking for doesn't exist or was removed.</p>
          <Link to="/courses" className="btn-primary">Browse All Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back navigation */}
      <div className="mb-6">
        <button onClick={() => navigate('/courses')} className="flex items-center text-surface-600 hover:text-primary transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span>Back to courses</span>
        </button>
      </div>

      {/* Course header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <div className="flex items-center mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)} mr-3`}>
                {getDifficultyLabel(course.difficulty)}
              </span>
              <span className="text-sm text-surface-600 dark:text-surface-400 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" /> {course.duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title || course.Name}</h1>
            <p className="text-lg text-surface-700 dark:text-surface-300 mb-4">{course.description}</p>
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-surface-500 ml-1">({Math.floor(course.enrollments * 0.12)} reviews)</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 text-surface-500 mr-1" />
                <span>{course.enrollments} students</span>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`} 
                  alt={course.instructor} 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-primary">{course.instructor}</p>
                </div>
              </div>
              {isAuthenticated && (
                <div className="mt-4">
                  <Link to={`/courses/edit/${courseId}`} className="btn-outline flex items-center w-fit">
                    <EditIcon className="w-4 h-4 mr-2" />
                    Edit Course
                  </Link>
                </div>
              )}
              
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="card sticky top-6">
              <img 
                src={course.imageUrl || `https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=500`} 
                alt={course.title} 
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-bold">Free</div>
                  <div className="text-surface-500 line-through">$49.99</div>
                </div>
                <div className="space-y-3 mb-6">
                  <button onClick={handleEnroll} disabled={isEnrolling} className="btn-primary w-full py-3">
                    {isEnrolling ? 'Enrolling...' : isEnrolled ? 'Go to Course' : 'Enroll Now'}
                  </button>
                  <button onClick={handleDownload} disabled={isDownloading} className="btn-outline w-full py-3 flex items-center justify-center">
                    {isDownloading ? 'Downloading...' : (
                      <>
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Download for Offline
                      </>
                    )}
                  </button>
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-400">
                  <p className="mb-2 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    Full lifetime access
                  </p>
                  <p className="mb-2 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    Access on mobile and desktop
                  </p>
                  <p className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                    Certificate of completion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Course Resources - In a real app, we would fetch resources for this course */}
      {false && (
        <div className="mb-12">
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
                Course Resources
              </h2>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Download these materials to enhance your learning experience. These resources are available offline once downloaded.
              </p>
              <CourseResources courseId={course.Id} resources={[]} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetail;