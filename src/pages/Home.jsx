import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import DownloadManager from '../components/DownloadManager';


// Icons
const SearchIcon = getIcon('search');
const CodeIcon = getIcon('code');
const GlobeIcon = getIcon('globe');
const CalculatorIcon = getIcon('calculator');
const BookOpenIcon = getIcon('book-open');
const BrainIcon = getIcon('brain');
const GraduationCapIcon = getIcon('graduation-cap');
const MicIcon = getIcon('mic');
const PaintBrushIcon = getIcon('paint-brush');
const WifiOffIcon = getIcon('wifi-off');
const ArrowRightIcon = getIcon('arrow-right');

// Course categories
const categories = [
  { id: 'programming', name: 'Programming', icon: 'code', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { id: 'languages', name: 'Languages', icon: 'globe', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { id: 'math', name: 'Mathematics', icon: 'calculator', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { id: 'science', name: 'Science', icon: 'flask', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  { id: 'literature', name: 'Literature', icon: 'book-open', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
  { id: 'psychology', name: 'Psychology', icon: 'brain', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { id: 'education', name: 'Education', icon: 'graduation-cap', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  { id: 'music', name: 'Music', icon: 'mic', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  { id: 'design', name: 'Design', icon: 'paint-brush', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
];

const Home = () => {
  const isOnline = useSelector(state => state.offline.isOnline);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('programming');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`);
      // In a real app, this would navigate to search results
    } else {
      toast.warning('Please enter a search term');
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Get the proper icon for a category
  const getCategoryIcon = (iconName) => {
    const Icon = getIcon(iconName);
    return Icon;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 dark:from-primary/10 dark:to-secondary/10 rounded-3xl"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-surface-800 p-8 rounded-3xl shadow-soft overflow-hidden">
          <div className="flex flex-col justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-surface-900 dark:text-white"
            >
              Unleash Your Learning Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">MindSpring</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-surface-600 dark:text-surface-300"
            >
              Interactive courses, expert instructors, and a supportive community to help you master new skills at your own pace.
            </motion.p>
            
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch}
              className="mt-8 flex w-full max-w-md"
            >
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses, topics, or skills..."
                  className="w-full pl-10 pr-4 py-3 rounded-l-lg border-y border-l border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 rounded-r-lg transition-colors flex items-center justify-center"
              >
                Search
              </button>
            </motion.form>
          </div>
          
          <div className="hidden md:flex items-center justify-center">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              alt="Students learning together"
              className="rounded-xl shadow-lg max-h-80 object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Category Selection */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-surface-900 dark:text-white">Explore By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {categories.map((category) => {
            const CategoryIcon = getCategoryIcon(category.icon);
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-4 rounded-xl transition-all flex flex-col items-center justify-center ${
                  selectedCategory === category.id 
                    ? `${category.color} shadow-md scale-105` 
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700'
                }`}
              >
                <CategoryIcon className={`w-6 h-6 mb-2 ${
                  selectedCategory === category.id ? '' : 'text-surface-600 dark:text-surface-400'
                }`} />
                <span className={`text-sm font-medium ${
                  selectedCategory === category.id ? '' : 'text-surface-700 dark:text-surface-300'
                }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      
      {/* Main Feature Course Content */}
      {!isOnline && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg flex items-center">
          <WifiOffIcon className="w-5 h-5 mr-2" /> 
          <div>
            <p className="font-medium">You are currently offline</p>
            <p className="text-sm">You can access your downloaded courses below. Your progress will be saved and synced when you reconnect.</p>
          </div>
        </div>
      )}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Featured Course</h2>
          <button className="flex items-center text-primary hover:text-primary-dark transition-colors text-sm font-medium">
            View all courses
            <ArrowRightIcon className="ml-1 w-4 h-4" />
          </button>
        </div>
        
        <MainFeature />
      </section>
      
      {/* Community Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700 p-6">
            <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Join Our Learning Community</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Connect with fellow learners, ask questions, share insights, and collaborate on projects. Our community forums are a great place to enhance your learning experience.
            </p>
            <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg mb-6">
              <div className="flex items-start mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-surface-800 dark:text-surface-200">Sarah Johnson</h4>
                    <span className="ml-2 text-xs text-surface-500 dark:text-surface-400">2 hours ago</span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                    Has anyone completed the advanced JavaScript course? I'm stuck on the async/await module.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-surface-800 dark:text-surface-200">David Chen</h4>
                    <span className="ml-2 text-xs text-surface-500 dark:text-surface-400">1 hour ago</span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                    I did! The key is understanding the execution context. Let me share some resources...
                  </p>
                </div>
              </div>
            </div>
            <button className="btn-primary w-full">Join Discussion</button>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700 p-6">
            <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Learning Statistics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-surface-600 dark:text-surface-400">Available Courses</div>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-secondary">50k+</div>
                <div className="text-sm text-surface-600 dark:text-surface-400">Active Students</div>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-accent">200+</div>
                <div className="text-sm text-surface-600 dark:text-surface-400">Expert Instructors</div>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-500">98%</div>
                <div className="text-sm text-surface-600 dark:text-surface-400">Satisfaction Rate</div>
              </div>
            </div>
            <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg flex items-center">
              <GraduationCapIcon className="w-10 h-10 text-primary mr-4" />
              <div>
                <h4 className="font-medium text-surface-800 dark:text-surface-200">Become an Instructor</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                  Share your knowledge and earn by creating your own courses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;