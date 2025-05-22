import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getBadgeIcon, getBadgeLevelClass, getIcon } from '../utils/badgeUtils';
import { getAllBadges } from '../services/badgeService';
import Confetti from 'react-confetti';

const BadgeDisplay = ({
  displayMode = 'grid',  // 'grid', 'list', or 'single'
  badge = null,          // required for 'single' mode
  showDetails = false,   // whether to show badge details
  onBadgeClick = null,   // callback when a badge is clicked
  className = '',        // additional classes
  limit = 0              // limit number of badges (0 = no limit)
}) => {
  const allBadges = useSelector(state => state.badges.badges);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (displayMode !== 'single') {
      // For grid/list mode, get badges from Redux store
      let filteredBadges = [...allBadges];
      
      // Apply limit if needed
      if (limit > 0) {
        filteredBadges = filteredBadges.slice(0, limit);
      }
      
      const processedBadges = filteredBadges.map(badge => ({
        ...badge,
        dateEarned: badge.earnedAt || new Date().toISOString(),
        title: badge.Name,
        description: badge.description || "Achievement unlocked"
      }));
      
      setBadges(processedBadges);
      
      // Check for new badges to trigger confetti
      const newBadges = processedBadges.filter(b => b.isNew);
      if (newBadges.length > 0) {
        setShowConfetti(true);
        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else if (badge) {
      // For single mode, use the provided badge
      setBadges([{
        ...badge,
        dateEarned: badge.earnedAt || new Date().toISOString(),
        title: badge.Name,
        description: badge.description || "Achievement unlocked"
      }]);
    }
  }, [allBadges, displayMode, badge, limit]);

  const handleBadgeClick = (badge) => {
    if (onBadgeClick) onBadgeClick(badge);
    setSelectedBadge(badge.id === selectedBadge?.id ? null : badge);
  };

  // Helper to render a single badge
  const renderBadge = (badge, index) => {
    const BadgeIcon = getBadgeIcon(badge.icon);
    const levelClass = getBadgeLevelClass(badge.level);
    
    return (
      <motion.div
        key={badge.id || index}
        initial={badge.isNew ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`${displayMode === 'list' ? 'flex items-center p-3' : 'flex flex-col items-center p-4'} 
                   ${badge.isNew ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''} 
                   cursor-pointer rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-all`}
        onClick={() => handleBadgeClick(badge)}
      >
        {/* Badge Icon */}
        <div className={`${levelClass} w-12 h-12 rounded-full flex items-center justify-center text-white mb-2`}>
          <BadgeIcon className="w-6 h-6" />
        </div>
        
        {/* Badge Info */}
        <div className={displayMode === 'list' ? 'ml-3' : 'text-center'}>
          <h4 className="font-medium text-sm">{badge.name || badge.title}</h4>
          {(displayMode === 'list' || showDetails || selectedBadge?.id === badge.id) && (
            <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">{badge.description}</p>
          )}
          {badge.isNew && (
            <span className="inline-block mt-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
              New!
            </span>
          )}
          {(showDetails || selectedBadge?.id === badge.id) && (
            <div className="mt-2 text-xs text-surface-500 dark:text-surface-400">
              <p>{badge.points} points</p>
              <p>Earned: {new Date(badge.earnedAt || badge.dateEarned).toLocaleDateString()}</p>
              {badge.courseTitle && <p>Course: {badge.courseTitle}</p>}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      {displayMode === 'single' && badges.length > 0 ? (
        renderBadge(badges[0], 0)
      ) : (
        <div 
          className={displayMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' 
            : 'space-y-3'
          }
        >
          {badges.length > 0 ? (
            badges.map((badge, index) => renderBadge(badge, index))
          ) : (
            <div className="text-center col-span-full py-6 text-surface-500 dark:text-surface-400">
              No badges earned yet. Complete courses and quizzes to earn badges!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;