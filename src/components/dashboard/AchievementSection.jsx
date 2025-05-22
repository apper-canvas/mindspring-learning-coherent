import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { formatDashboardDate } from '../../utils/dashboardUtils';

// Icons
const AwardIcon = getIcon('award');
const TrophyIcon = getIcon('trophy');
const ArrowRightIcon = getIcon('arrow-right');

const AchievementSection = ({ achievements, loading }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Achievements & Certifications</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex">
              <div className="w-12 h-12 bg-surface-200 dark:bg-surface-700 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">Achievements & Certifications</h2>
        <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
          <p className="text-surface-600 dark:text-surface-400">
            Complete courses and lessons to earn achievements and certifications.
          </p>
        </div>
      </div>
    );
  }

  // Display the first 3 achievements or all if showAll is true
  const displayedAchievements = showAll ? achievements : achievements.slice(0, 3);

  return (
    <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Achievements & Certifications</h2>
        <div className="flex items-center">
          <TrophyIcon className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-sm font-medium">{achievements.length} earned</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        {displayedAchievements.map((achievement, index) => {
          const AchievementIcon = getIcon(achievement.icon);
          
          return (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center p-3 bg-surface-50 dark:bg-surface-700 rounded-lg"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-4">
                <AchievementIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-surface-800 dark:text-surface-200">
                  {achievement.title}
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {achievement.description}
                </p>
              </div>
              <span className="text-xs text-surface-500 dark:text-surface-400">
                {formatDashboardDate(achievement.dateEarned)}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      {achievements.length > 3 && (
        <button 
          onClick={() => setShowAll(!showAll)} 
          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center mx-auto"
        >
          {showAll ? 'Show Less' : `View All (${achievements.length})`}
          <ArrowRightIcon className={`ml-1 w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default AchievementSection;