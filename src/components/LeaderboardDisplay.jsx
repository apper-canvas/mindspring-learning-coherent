import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  fetchLeaderboard, 
  refreshLeaderboard, 
  setActivePeriod,
  selectCurrentLeaderboard,
  selectLeaderboardLoading
} from '../store/leaderboardSlice';
import { LEADERBOARD_PERIODS, getCurrentUserPosition, formatNumber } from '../utils/leaderboardUtils';
import { getIcon } from '../utils/iconUtils';

// Icons
const RefreshIcon = getIcon('refresh-cw');
const TrophyIcon = getIcon('trophy');
const ChevronUpIcon = getIcon('chevron-up');
const ChevronDownIcon = getIcon('chevron-down');
const UsersIcon = getIcon('users');
const UserIcon = getIcon('user');
const BadgeIcon = getIcon('award');
const CheckIcon = getIcon('check');
const ClockIcon = getIcon('clock');

const LeaderboardDisplay = ({ courseId = 1, courseTitle = "JavaScript Fundamentals" }) => {
  const dispatch = useDispatch();
  const leaderboard = useSelector(selectCurrentLeaderboard);
  const isLoading = useSelector(selectLeaderboardLoading);
  const [selectedPeriod, setSelectedPeriod] = useState(LEADERBOARD_PERIODS.WEEKLY);
  const [displayCount, setDisplayCount] = useState(10);

  // Load leaderboard data
  useEffect(() => {
    dispatch(fetchLeaderboard({ courseId, period: selectedPeriod }));
  }, [dispatch, courseId, selectedPeriod]);

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    dispatch(setActivePeriod(period));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(refreshLeaderboard({ courseId, period: selectedPeriod }));
  };

  // Show more entries
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  // Calculate current user's position
  const userPosition = leaderboard ? getCurrentUserPosition(leaderboard) : null;

  // Get time period label
  const getPeriodLabel = (period) => {
    switch(period) {
      case LEADERBOARD_PERIODS.WEEKLY: return 'This Week';
      case LEADERBOARD_PERIODS.MONTHLY: return 'This Month';
      case LEADERBOARD_PERIODS.ALL_TIME: return 'All Time';
      default: return 'This Week';
    }
  };

  // Display entries with animation
  const renderEntries = () => {
    if (!leaderboard || !leaderboard.entries) return null;
    
    const entriesToShow = leaderboard.entries.slice(0, displayCount);
    
    return (
      <AnimatePresence>
        {entriesToShow.map((entry, index) => (
          <motion.tr 
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={entry.isCurrentUser ? 'user-row' : ''}
          >
            <td className={`font-bold ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}>
              {entry.rank}
            </td>
            <td>
              <div className="flex items-center">
                <img 
                  src={entry.avatar} 
                  alt={entry.name}
                  className="w-8 h-8 rounded-full mr-3 object-cover border border-surface-200 dark:border-surface-600"
                />
                <div>
                  <div className="font-medium text-surface-800 dark:text-surface-200">
                    {entry.name} {entry.isCurrentUser && <span className="text-xs text-green-500">(You)</span>}
                  </div>
                  <div className="text-xs text-surface-500">Last active: {entry.lastActive}</div>
                </div>
              </div>
            </td>
            <td className="text-center">{entry.completionPercentage}%</td>
            <td className="text-center">{entry.quizScore}</td>
            <td className="text-center">{entry.badgesEarned}</td>
            <td className="text-center font-bold">{formatNumber(entry.points)}</td>
          </motion.tr>
        ))}
      </AnimatePresence>
    );
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-leaderboard-gold" />
            {courseTitle} Leaderboard
          </h3>
          <button 
            onClick={handleRefresh} 
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            disabled={isLoading}
            title="Refresh leaderboard"
          >
            <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : 'text-surface-500 dark:text-surface-400'}`} />
          </button>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-4">
          {Object.values(LEADERBOARD_PERIODS).map(period => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedPeriod === period 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>

        {/* User position summary */}
        {userPosition && (
          <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium">Your Position:</span>
              </div>
              <div className="text-2xl font-bold text-primary">#{userPosition.rank}</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="bg-white dark:bg-surface-800 rounded p-2">
                <div className="text-xs text-surface-500 dark:text-surface-400">Top</div>
                <div className="font-medium">{userPosition.percentile}%</div>
              </div>
              <div className="bg-white dark:bg-surface-800 rounded p-2">
                <div className="text-xs text-surface-500 dark:text-surface-400">Total Users</div>
                <div className="font-medium">{userPosition.totalUsers}</div>
              </div>
            </div>
          </div>
        )}

        {/* Date range */}
        {leaderboard && leaderboard.dateRange && (
          <div className="text-sm text-surface-500 dark:text-surface-400 flex items-center mb-2">
            <ClockIcon className="w-4 h-4 mr-1" />
            {leaderboard.dateRange.start} - {leaderboard.dateRange.end}
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        {isLoading && !leaderboard ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-surface-500 dark:text-surface-400">Loading leaderboard...</p>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-700">
                <th width="60">Rank</th>
                <th>Student</th>
                <th className="text-center" width="100">Progress</th>
                <th className="text-center" width="80">Quiz</th>
                <th className="text-center" width="80">Badges</th>
                <th className="text-center" width="80">Points</th>
              </tr>
            </thead>
            <tbody>{renderEntries()}</tbody>
          </table>
        )}
      </div>
      
      {/* Show more button */}
      {leaderboard && displayCount < leaderboard.entries.length && (
        <div className="p-3 text-center border-t border-surface-200 dark:border-surface-700">
          <button onClick={handleShowMore} className="text-primary hover:text-primary-dark text-sm font-medium">Show More</button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardDisplay;