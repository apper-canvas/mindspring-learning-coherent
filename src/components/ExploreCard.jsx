import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const ChevronRightIcon = getIcon('chevron-right');

const ExploreCard = ({ category }) => {
  const { id, title, description, icon, color, count, path } = category;
  
  const Icon = getIcon(icon);
  
  // Helper function to get the appropriate color classes
  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: {
        border: 'border-t-primary hover:border-t-primary-dark',
        bg: 'bg-primary/10 text-primary'
      },
      secondary: {
        border: 'border-t-secondary hover:border-t-secondary-dark',
        bg: 'bg-secondary/10 text-secondary'
      },
      accent: {
        border: 'border-t-accent hover:border-t-accent-dark',
  const navigate = useNavigate();
        bg: 'bg-accent/10 text-accent'
      }
    };
    
    return colorMap[colorName] || colorMap.primary;
  };

  const handleCardClick = () => {
    navigate(path);
  };

  const colorClasses = getColorClasses(color);
  
  // Card animations
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      y: -5, 
        cursor-pointer
        hover:shadow-lg transition-shadow duration-300
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { duration: 0.2 }
      onClick={handleCardClick}
  };

  // Icon animations
  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.3, type: 'spring' }
    }
  };

  return (
    <motion.div
      className="h-full"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
    >
      <Link to={path || `/category/${id}`} className="block h-full">
        <div className={`card h-full p-6 flex flex-col border-t-4 ${colorClasses.border} transition-colors`}>
          <div className="flex items-center mb-4">
            <motion.div 
              className={`w-10 h-10 rounded-full ${colorClasses.bg} flex items-center justify-center mr-3`}
              variants={iconVariants} 
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          
          <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 flex-grow">{description}</p>
          
          <div className="mt-auto flex justify-between items-center text-sm text-surface-500 dark:text-surface-400">
            <span>{count} items</span>
            <span className="flex items-center"><ChevronRightIcon className="w-4 h-4 ml-1" /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ExploreCard;