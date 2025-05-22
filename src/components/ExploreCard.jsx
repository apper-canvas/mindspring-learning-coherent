import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const ChevronRightIcon = getIcon('chevron-right');

const ExploreCard = ({ category }) => {
  const { id, title, description, icon, color, count, path } = category;
  
  const Icon = getIcon(icon);
  
  // Card animations
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      y: -5, 
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { duration: 0.2 }
    }
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
        <div className={`card h-full p-6 flex flex-col border-t-4 ${color ? `border-t-${color}` : 'border-t-primary'} ${color ? `hover:border-t-${color}-dark` : 'hover:border-t-primary-dark'} transition-colors`}>
          <div className="flex items-center mb-4">
            <motion.div 
              className={`w-10 h-10 rounded-full bg-${color || 'primary'}/10 flex items-center justify-center text-${color || 'primary'} mr-3`}
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