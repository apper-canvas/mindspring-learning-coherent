import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getCourseById, updateCourse } from '../services/courseService';

// Icons
const ArrowLeftIcon = getIcon('arrow-left');
const ImageIcon = getIcon('image');
const SaveIcon = getIcon('save');
const AlertTriangleIcon = getIcon('alert-triangle');
const BookOpenIcon = getIcon('book-open');

const EditCourse = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.user);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    difficulty: 'beginner',
    duration: '',
    instructor: '',
    Tags: ''
  });
  
  // Load existing course data on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const course = await getCourseById(courseId);
        if (!course) {
          throw new Error('Course not found');
        }
        
        // Set form data with existing course values
        setCourseData({
          title: course.title || course.Name || '',
          description: course.description || '',
          imageUrl: course.imageUrl || '',
          category: course.category || '',
          difficulty: course.difficulty || 'beginner',
          duration: course.duration || '',
          instructor: course.instructor || user?.fullName || user?.emailAddress || '',
          Tags: course.Tags || ''
        });
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Failed to load course details. Please try again.');
        toast.error('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate(`/login?redirect=/courses/edit/${courseId}`);
    }
  }, [isAuthenticated, loading, navigate, courseId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!courseData.title || !courseData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Call the update course service
      const response = await updateCourse(courseId, courseData);
      
      if (response.success) {
        toast.success('Course updated successfully!');
        navigate(`/courses/${courseId}`);
      } else {
        throw new Error(response.message || 'Failed to update course');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
      toast.error('Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
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
  
  if (error && !courseData.title) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{error}</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">Unable to load course details for editing.</p>
          <button onClick={() => navigate('/courses')} className="btn-primary">
            Return to Courses
          </button>
        </div>
      </div>
    );
  }
  
  const categories = [
    { id: 'programming', name: 'Programming' },
    { id: 'languages', name: 'Languages' },
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'literature', name: 'Literature' },
    { id: 'psychology', name: 'Psychology' },
    { id: 'education', name: 'Education' },
    { id: 'music', name: 'Music' },
    { id: 'design', name: 'Design' },
  ];
  
  const difficulties = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back navigation */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(`/courses/${courseId}`)} 
          className="flex items-center text-surface-600 hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span>Back to course details</span>
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
              <p className="flex items-center">
                <AlertTriangleIcon className="w-5 h-5 mr-2" />
                {error}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Course Title */}
            <div className="input-group">
              <label htmlFor="title" className="input-label">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter course title"
                required
              />
            </div>
            
            {/* Course Description */}
            <div className="input-group">
              <label htmlFor="description" className="input-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                className="input min-h-[120px]"
                placeholder="Enter course description"
                required
              />
            </div>
            
            {/* Course Image URL */}
            <div className="input-group">
              <label htmlFor="imageUrl" className="input-label">
                Cover Image URL
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={courseData.imageUrl}
                  onChange={handleInputChange}
                  className="input flex-grow"
                  placeholder="Enter image URL or upload"
                />
              </div>
              
              {courseData.imageUrl && (
                <div className="mt-3 border border-surface-200 dark:border-surface-700 rounded-lg p-2">
                  <img 
                    src={courseData.imageUrl} 
                    alt="Course preview" 
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=500';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label htmlFor="category" className="input-label">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="difficulty" className="input-label">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={courseData.difficulty}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Course Duration and Instructor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label htmlFor="duration" className="input-label">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={courseData.duration}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., 6 weeks, 3 hours"
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="instructor" className="input-label">
                  Instructor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={courseData.instructor}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Instructor name"
                  required
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-2 border-t-2 border-white rounded-full" />
                    Updating...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;