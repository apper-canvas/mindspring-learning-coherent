import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils'; 
import { formatDashboardDate } from '../../utils/dashboardUtils';

// Icons
const AwardIcon = getIcon('award');
const TrophyIcon = getIcon('trophy');
const ArrowRightIcon = getIcon('arrow-right');
const FileTextIcon = getIcon('file-text');
const ExternalLinkIcon = getIcon('external-link');
const DownloadIcon = getIcon('download');

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

  // Sort achievements by date (newest first)
  const sortedAchievements = [...achievements].sort((a, b) => 
    new Date(b.dateEarned) - new Date(a.dateEarned)
  );

  // Count certifications
  const certificationCount = achievements.filter(a => a.type === "certification").length;
  
  // Display the first 3 achievements or all if showAll is true
  const displayedAchievements = showAll ? sortedAchievements : sortedAchievements.slice(0, 3);
  
  // Helper function to determine badge class based on category
  const getBadgeClass = (category) => {
    switch(category) {
      case 'certification': return 'badge-certification';
      case 'certificate': return 'badge-certificate';
      case 'specialization': return 'badge-specialization';
      case 'course': return 'badge-intermediate';
      case 'streak': return 'badge-advanced';
      default: return 'badge-beginner';
    }
  };

  // Function to handle certificate viewing
  const viewCertificate = (certificate) => {
    window.open(certificate.certificateURL, '_blank');
  };

  return (
    <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Achievements & Certifications</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <TrophyIcon className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium">{achievements.length - certificationCount} achievements</span>
          </div>
          <div className="flex items-center">
            <FileTextIcon className="w-5 h-5 text-badge-certificate mr-2" />
            <span className="text-sm font-medium">{certificationCount} certifications</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        {displayedAchievements.map((item, index) => {
          const ItemIcon = getIcon(item.icon);
          const isCertification = item.type === "certification";
          const badgeClass = getBadgeClass(item.category);
          
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 ${isCertification ? 'bg-surface-50/70 dark:bg-surface-700/70 border border-surface-200 dark:border-surface-600' : 'bg-surface-50 dark:bg-surface-700'} rounded-lg`}
            >
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className={`w-12 h-12 rounded-full ${isCertification ? 'bg-badge-certificate/10 dark:bg-badge-certificate/20' : 'bg-primary/10 dark:bg-primary/20'} flex items-center justify-center mr-4`}>
                    <ItemIcon className={`w-6 h-6 ${isCertification ? 'text-badge-certificate' : 'text-primary'}`} />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-surface-800 dark:text-surface-200 truncate mr-2">
                      {item.title}
                    </h3>
                    <span className={`${badgeClass} text-xs px-2 py-0.5 rounded-full`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {formatDashboardDate(item.dateEarned)}
                      </span>
                    </div>
                    
                    {isCertification && (
                      <div className="flex space-x-2">
                        {item.issuer && (
                          <span className="text-xs text-surface-600 dark:text-surface-400">
                            Issued by: {item.issuer}
                          </span>
                        )}
                        
                        {item.certificateURL && (
                          <button 
                            onClick={() => viewCertificate(item)}
                            className="flex items-center text-xs text-primary hover:text-primary-dark"
                          >
                            <ExternalLinkIcon className="w-3.5 h-3.5 mr-1" />
                            View Certificate
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isCertification && item.credentialID && (
                    <div className="mt-2">
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        Credential ID: {item.credentialID}
                      </span>
                    </div>
                  )}
                </div>
              </div>  
            </motion.div>
          );
        })}
      </div>
      
      {sortedAchievements.length > 3 && (
        <button 
          onClick={() => setShowAll(!showAll)} 
          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center mx-auto transition-all"
        >
          {showAll ? 'Show Less' : `View All (${sortedAchievements.length})`}
          <ArrowRightIcon className={`ml-1 w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default AchievementSection;