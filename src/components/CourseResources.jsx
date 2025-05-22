import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import DownloadManager from './DownloadManager';

// Resource type icons
const PdfIcon = getIcon('file-text');
const SlidesIcon = getIcon('layout');
const WorksheetIcon = getIcon('clipboard');
const VideoIcon = getIcon('video');
const DownloadIcon = getIcon('download');
const FileIcon = getIcon('file');

const CourseResources = ({ courseId, resources }) => {
  const isOnline = useSelector(state => state.offline.isOnline);
  const resourceDownloads = useSelector(state => state.offline.resourceDownloads);
  
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
  
  return (
    <div className="grid grid-cols-1 gap-3">
      {resources.map((resource) => {
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