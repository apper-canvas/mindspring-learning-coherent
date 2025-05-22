import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import CourseCard from '../components/CourseCard';
import { useSelector, useDispatch } from 'react-redux';
import { getCourses } from '../services/courseService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'enrollments',
    direction: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const isOnline = useSelector(state => state.offline.isOnline);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [filters, sortConfig, isOnline]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Format sort configuration for API
      const orderBy = [
        {
          fieldName: sortConfig.key,
          SortType: sortConfig.direction === 'asc' ? 'ASC' : 'DESC'
        }
      ];

      // Get courses from API with filters and sorting
      const coursesData = await getCourses({
        ...filters,
        orderBy,
        searchTerm: searchTerm || undefined
      });

      if (!coursesData) {
        setCourses([]);
        return;
      }

      setCourses(coursesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Categories for filter dropdown
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'languages', label: 'Languages' },
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'literature', label: 'Literature' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'education', label: 'Education' },
    { value: 'music', label: 'Music' },
    { value: 'design', label: 'Design' }
  ];

  // Difficulty levels for filter dropdown
  const difficultyLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Explore Courses</h1>
        <Link 
          to="/courses/create"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Create Course
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="flex mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full p-3 pl-10 border rounded-lg dark:bg-surface-700 dark:border-surface-600 dark:text-surface-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-surface-400" size={20} />
          </div>
          <button
            type="submit"
            className="ml-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Search
          </button>
          <button
            type="button"
            className="ml-2 bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 px-4 py-2 rounded-lg flex items-center transition duration-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </form>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-lg dark:bg-surface-700 dark:border-surface-600 dark:text-surface-100"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-lg dark:bg-surface-700 dark:border-surface-600 dark:text-surface-100"
              >
                {difficultyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-t-primary border-surface-200"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center p-8 text-surface-600 dark:text-surface-400">No courses found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => <CourseCard key={course.Id} course={course} />)}
        </div>
      )}
    </motion.div>
  );
};

export default Courses;