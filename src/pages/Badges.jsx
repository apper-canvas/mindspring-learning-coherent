import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import BadgeDisplay from '../components/BadgeDisplay';
import { BADGE_CATEGORIES, BADGE_LEVELS } from '../utils/badgeUtils';
import { getUserBadges } from '../services/badgeService';

const Badges = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const [userBadges, setUserBadges] = useState([]);
  const { badges, isLoading } = useSelector(state => state.badges);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [badgeStats, setBadgeStats] = useState({
    total: 0,
    byCategory: {},
    byLevel: {},
    points: 0
  });

  // Fetch user's badges from API
  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!isAuthenticated || !user?.userId) {
        return;
      }
      
      try {
        const badges = await getUserBadges(user.userId);
        
        // Process badges to add additional information
        // In a real app, this would include looking up badge details
        const processedBadges = badges.map(badge => ({
          ...badge,
          icon: badge.icon || "award",
          level: badge.level || "bronze",
          category: badge.category || "achievement"
        }));
        
        setUserBadges(processedBadges);
      } catch (error) {
        console.error("Error fetching user badges:", error);
        toast.error("Failed to load your badges");
      }
    };
    
    fetchUserBadges();
  }, [isAuthenticated, user]);

  // Calculate stats and apply filters when badges change
  useEffect(() => {
    // Apply filters
    const allBadges = [...badges, ...userBadges];
    let filtered = [...allBadges];
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(badge => badge.category === filterCategory);
    }
    
    if (filterLevel !== 'all') {
      filtered = filtered.filter(badge => badge.level === filterLevel);
    }
    
    setFilteredBadges(filtered);
    
    // Calculate stats
    const stats = {
      total: allBadges.length,
      byCategory: {},
      byLevel: {},
      points: allBadges.reduce((sum, badge) => sum + (badge.points || 0), 0)
    };
    
    // Count by category
    Object.values(BADGE_CATEGORIES).forEach(category => {
      stats.byCategory[category] = badges.filter(badge => badge.category === category).length;
    });
    
    // Count by level
    Object.values(BADGE_LEVELS).forEach(level => {
      stats.byLevel[level] = badges.filter(badge => badge.level === level).length;
    });
    
    setBadgeStats(stats);
  }, [badges, userBadges, filterCategory, filterLevel]);

  // Group badges by category for display
  const getBadgesByCategory = () => {
    const grouped = {};
    
    Object.values(BADGE_CATEGORIES).forEach(category => {
      grouped[category] = filteredBadges.filter(badge => badge.category === category);
    });
    
    return grouped;
  };

  const badgesByCategory = getBadgesByCategory();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8 px-4"
    >
      <h1 className="text-3xl font-bold mb-6">Your Badges</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <h3 className="text-lg font-semibold">Total Badges</h3>
          <p className="text-3xl font-bold text-primary">{badgeStats.total}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-semibold">Points Earned</h3>
          <p className="text-3xl font-bold text-primary">{badgeStats.points}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-semibold">Next Badge</h3>
          <p className="text-sm">Complete a course to earn more badges!</p>
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-semibold">Highest Level</h3>
          <p className="text-3xl font-bold text-primary">
            {badgeStats.byLevel[BADGE_LEVELS.PLATINUM] > 0 
              ? 'Platinum' 
              : badgeStats.byLevel[BADGE_LEVELS.GOLD] > 0 
                ? 'Gold' 
                : badgeStats.byLevel[BADGE_LEVELS.SILVER] > 0 
                  ? 'Silver' 
                  : 'Bronze'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium mb-1">Category</label>
          <select 
            id="category-filter"
            className="input"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(BADGE_CATEGORIES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level-filter" className="block text-sm font-medium mb-1">Level</label>
          <select 
            id="level-filter"
            className="input"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            {Object.entries(BADGE_LEVELS).map(([key, value]) => (
              <option key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading your badges...</div>
      ) : (
        Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
          categoryBadges.length > 0 && (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 capitalize">{category} Badges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryBadges.map(badge => <BadgeDisplay key={badge.id} badge={badge} showDetails={true} className="mb-4" />)}
              </div>
            </div>
          )
        ))
      )}
      
      {filteredBadges.length === 0 && !isLoading && (
        <div className="text-center py-10 bg-surface-100 dark:bg-surface-800 rounded-lg">
          {badges.length === 0 ? (
            <>
              <h3 className="text-xl font-semibold mb-2">No badges yet</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Complete courses, quizzes, and engage with the community to earn badges!
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">No badges match your filters</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Try changing your filter criteria to see more badges.
              </p>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Badges;