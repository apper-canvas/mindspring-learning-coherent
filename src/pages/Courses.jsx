import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { getCourses, deleteCourse } from '../services/courseService.js';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { coursesData } from '../utils/coursesData';
import CourseCard from '../components/CourseCard';

// Icons
const XIcon = getIcon('x');
const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');
const SlidersIcon = getIcon('sliders');
const PlusIcon = getIcon('plus');
const BookOpenIcon = getIcon('book-open');
const AlertIcon = getIcon('alert-triangle');

import { getCourses, deleteCourse } from '../services/courseService';
import { AuthContext } from '../App';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const categoryParam = searchParams.get('category');
  
  // Get authentication status from context
  const { isAuthenticated } = useContext(AuthContext);

  const categories = [
    { id: 'all', name: 'All Categories' },
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
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  const clearCategoryFilter = () => {
    setSearchParams({});
  };

  useEffect(() => {
    // Load courses from the API
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = {};
        
        // If category is specified in URL, add it to filters
        if (categoryParam) {
          filters.category = categoryParam;
        }
        
        const coursesData = await getCourses(filters);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        setError('Failed to load courses. Please try again later.');
        toast.error('Failed to load courses. Please try again later.');
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [categoryParam]);


  useEffect(() => {
    // Apply filters whenever filter criteria changes
    let result = [...courses];

    // Filter by category
    if (selectedCategory !== 'all') {
        
      result = result.filter(course => course.category === selectedCategory);
    }
    
    // Filter by category param from URL if present
    if (categoryParam) {
      result = result.filter(course => {
        if (course.categories) {
          return course.categories.includes(categoryParam);
        }
        return course.category === categoryParam;
      });
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(course => course.difficulty === selectedDifficulty);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(term) || 
          course.description.toLowerCase().includes(term) ||
          course.instructor.toLowerCase().includes(term)
      );
    }

    setFilteredCourses(result);
  }, [courses, selectedCategory, selectedDifficulty, searchTerm, categoryParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied via the useEffect
    if (searchTerm.trim() !== '') {
      toast.info(`Showing results for "${searchTerm}"`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchTerm('');
    toast.info('Filters cleared');
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    setDeleting(true);
    try {
      await deleteCourse(courseToDelete.Id);
      
      // Update local state to remove the deleted course
      setCourses(prevCourses => prevCourses.filter(c => c.Id !== courseToDelete.Id));
      setFilteredCourses(prevCourses => prevCourses.filter(c => c.Id !== courseToDelete.Id));
      
      toast.success(`"${courseToDelete.title}" has been deleted successfully`);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete the course. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
  };

  // Animation control for modal
  const modalControls = useAnimation();
  useEffect(() => {
    showDeleteConfirm ? modalControls.start({ opacity: 1 }) : modalControls.start({ opacity: 0 });
  }, [showDeleteConfirm, modalControls]);

  return (
    // Check for error state first and show error message if needed
    error ? (
      <div className="container mx-auto px-4 py-8 text-center">Error: {error}</div>
    ) : (
    <div className="container mx-auto px-4 py-8">
      {/* Courses Header */}
      <section className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Explore Courses</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Discover a wide range of courses to help you achieve your learning goals
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <Link 
                to="/courses/create" 
                className="btn-primary flex items-center"
                aria-label="Create new course"
              >
                <PlusIcon className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">
                  Create Course
                </span>
                <span className="inline md:hidden">
                  Add
                </span>
              </Link>
            )}
            <form onSubmit={handleSearch} className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary"
              />
            </form>
            <button 
              onClick={toggleFilters}
              className="btn-ghost p-2 rounded-lg flex items-center"
              aria-label="Toggle filters"
            >
              <FilterIcon className="w-5 h-5" />
              <span className="ml-2 hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {categoryParam && (
          <div className="mt-3 flex items-center">
            <span className="text-surface-600 dark:text-surface-400">Filtered by category: </span>
            <span className="ml-2 px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center">
              {categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).replace('-', ' ')}
              <button onClick={clearCategoryFilter} className="ml-2" aria-label="Clear filter">
                <XIcon className="w-4 h-4" />
              </button>
            </span>
          </div>
        )}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-4 mb-6 shadow-sm border border-surface-200 dark:border-surface-700"
          >
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex items-center">
                <SlidersIcon className="w-5 h-5 mr-2 text-primary" />
                <h3 className="font-medium">Filter Courses</h3>
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Category
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Difficulty
                </label>
                <select 
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="input"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Courses Grid */}
      <section>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CourseCard key={course.Id} course={course} onDeleteClick={handleDeleteClick} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <BookOpenIcon className="w-12 h-12 mx-auto text-surface-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">Try adjusting your filters or search term</p>
            <button 
              onClick={clearFilters} 
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={modalControls}
            className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
              <AlertIcon className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold">Delete Course</h3>
            </div>
            
            <p className="mb-6 text-surface-700 dark:text-surface-300">
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="btn-ghost order-2 sm:order-1"
              >
                Cancel
              </button>
              
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="btn-danger flex items-center justify-center order-1 sm:order-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete Course
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    )
  );
};

export default Courses;