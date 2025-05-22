import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { createCourse } from '../services/courseService';

// Icons
const BookOpenIcon = getIcon('book-open');
const SaveIcon = getIcon('save');
const ArrowLeftIcon = getIcon('arrow-left');

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'programming',
    difficulty: 'beginner',
    duration: '',
    imageUrl: '',
    Tags: ''
  });
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!courseData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!courseData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!courseData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    
    if (!courseData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // Process tags from comma-separated string to array
      const processedData = {
        ...courseData,
        enrollments: 0,
        rating: 0,
        Tags: courseData.Tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };
      
      const response = await createCourse(processedData);
      
      if (response && response.success) {
        toast.success('Course created successfully!');
        navigate('/courses');
      } else {
        toast.error('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('An error occurred while creating the course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/courses')}
          className="btn-ghost mr-4"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="ml-2">Back to Courses</span>
        </button>
        <h1 className="text-3xl font-bold flex items-center">
          <BookOpenIcon className="w-8 h-8 mr-3 text-primary" />
          Create New Course
        </h1>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="input-group md:col-span-2">
              <label htmlFor="title" className="input-label">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., Introduction to JavaScript"
              />
              {errors.title && <p className="input-error">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="input-group md:col-span-2">
              <label htmlFor="description" className="input-label">Description *</label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                className={`input h-32 resize-y ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Provide a detailed description of the course"
              />
              {errors.description && <p className="input-error">{errors.description}</p>}
            </div>

            {/* Instructor */}
            <div className="input-group">
              <label htmlFor="instructor" className="input-label">Instructor *</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={courseData.instructor}
                onChange={handleChange}
                className={`input ${errors.instructor ? 'border-red-500' : ''}`}
                placeholder="Instructor's name"
              />
              {errors.instructor && <p className="input-error">{errors.instructor}</p>}
            </div>

            {/* Duration */}
            <div className="input-group">
              <label htmlFor="duration" className="input-label">Duration *</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={courseData.duration}
                onChange={handleChange}
                className={`input ${errors.duration ? 'border-red-500' : ''}`}
                placeholder="e.g., 8 weeks, 24 hours"
              />
              {errors.duration && <p className="input-error">{errors.duration}</p>}
            </div>

            {/* Category */}
            <div className="input-group">
              <label htmlFor="category" className="input-label">Category</label>
              <select
                id="category"
                name="category"
                value={courseData.category}
                onChange={handleChange}
                className="input"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="input-group">
              <label htmlFor="difficulty" className="input-label">Difficulty Level</label>
              <select
                id="difficulty"
                name="difficulty"
                value={courseData.difficulty}
                onChange={handleChange}
                className="input"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="input-group">
              <label htmlFor="imageUrl" className="input-label">Image URL</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={courseData.imageUrl}
                onChange={handleChange}
                className="input"
                placeholder="URL to course image"
              />
            </div>

            {/* Tags */}
            <div className="input-group">
              <label htmlFor="Tags" className="input-label">Tags (comma-separated)</label>
              <input
                type="text"
                id="Tags"
                name="Tags"
                value={courseData.Tags}
                onChange={handleChange}
                className="input"
                placeholder="e.g., web, coding, beginner"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <SaveIcon className="w-5 h-5 mr-2" />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;