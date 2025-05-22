import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import ExploreCard from '../components/ExploreCard';
import { categories } from '../utils/categoriesData';

const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Get unique category types for filters
  const categoryTypes = ['all', ...new Set(categories.map(cat => cat.type))];
  
  // Filter categories based on search term and active filter
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || category.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Content</h1>
        <p className="text-surface-600 dark:text-surface-400">Discover new learning resources, tools, and communities</p>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex overflow-x-auto gap-2 py-1 scrollbar-hide">
          <div className="flex items-center mr-2">
            <FilterIcon className="w-5 h-5 text-surface-500 mr-1" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          {categoryTypes.map((type) => (
            <button
              key={type}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                activeFilter === type 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
              onClick={() => setActiveFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Categories grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => <ExploreCard key={category.id} category={category} />)
        ) : (
          <div className="col-span-full text-center py-12 text-surface-500">No categories match your search criteria.</div>
        )}
      </motion.div>
    </main>
  );
};

export default Explore;