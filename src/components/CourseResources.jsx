import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import DownloadManager from './DownloadManager';
import { getResourcesByCourseId } from '../services/resourceService';

// Resource type icons
const PdfIcon = getIcon('file-text');
const SlidesIcon = getIcon('layout');
const WorksheetIcon = getIcon('clipboard');
const VideoIcon = getIcon('video');
const FileIcon = getIcon('file');

const CourseResources = ({ courseId }) => {
  const isOnline = useSelector(state => state.offline.isOnline);
  const resourceDownloads = useSelector(state => state.offline.resourceDownloads);
  
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchResources = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const fetchedResources = await getResourcesByCourseId(courseId);
        setResources(fetchedResources);
      } catch (err) {
        console.error("Error loading course resources:", err);
        setError("Failed to load resources");
        toast.error("Could not load course resources");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [courseId]);
  
  // Get icon for resource type
  const getResourceIcon = (type) => {
    switch(type) {
      case 'pdf': return PdfIcon;
      case 'slides': return SlidesIcon;
      case 'worksheet': return WorksheetIcon;
      case 'video': return VideoIcon;
      default: return FileIcon;
    }
  };
  
  // Get resource type display name
  const getResourceTypeName = (type) => {
    switch(type) {
      case 'pdf': return 'PDF';
      case 'slides': return 'Slides';
      case 'worksheet': return 'Worksheet';
      case 'video': return 'Video';
      default: return 'File';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  
  if (!resources || resources.length === 0) {
    return <div className="text-center p-4 text-surface-500">No resources available for this course.</div>;
  }
  
  return (
    <div className="grid grid-cols-1 gap-3">
      {resources.map(resource => {
        const ResourceIcon = getResourceIcon(resource.type);
        
        return (
          <motion.div 
            key={resource.id}
            whileHover={{ x: 3 }}
            className="resource-item"
          >
            <div className="flex-shrink-0 bg-surface-100 dark:bg-surface-800 rounded-lg p-2 mr-4">
              <ResourceIcon className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-grow">
              <h4 className="font-medium mb-1">{resource.title}</h4>
              <div className="flex items-center">
                <span className={`resource-badge resource-badge-${resource.type}`}>{getResourceTypeName(resource.type)}</span>
                <span className="ml-3 text-xs text-surface-500">{resource.size} MB</span>
              </div>
            </div>
            
            <DownloadManager course={{ id: courseId }} resource={resource} size="sm" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CourseResources;