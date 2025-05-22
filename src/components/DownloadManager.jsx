import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { downloadCourse, downloadModule, downloadResource } from '../store/offlineSlice';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';
import { estimateCourseSize } from '../utils/offlineUtils';

const DownloadIcon = getIcon('download');
const CheckIcon = getIcon('check');
const XIcon = getIcon('x');
const WifiOffIcon = getIcon('wifi-off');
const FileIcon = getIcon('file');

const DownloadManager = ({ course, moduleId = null, resource = null, size = 'md' }) => {
  const dispatch = useDispatch();
  const isOnline = useSelector(state => state.offline.isOnline);
  const downloads = useSelector(state => state.offline.downloads);
  const moduleDownloads = useSelector(state => state.offline.moduleDownloads);
  
  // Get download state
  const downloadState = moduleId 
    ? moduleDownloads[course?.id]?.[moduleId]
    : downloads[course?.id];
    
  // Get resource download state if resource is provided
  const resourceDownloads = useSelector(state => state.offline.resourceDownloads);
  const resourceDownloadState = resource 
    ? resourceDownloads[course?.id]?.[resource?.id]
    : null;
  const isDownloading = downloadState?.status === 'downloading';
  const isDownloaded = downloadState?.status === 'completed';
  const progress = downloadState?.progress || 0;
  
  // Estimated file size
  const fileSize = estimateCourseSize(course);
  
  // Resource specific values
  const isResourceDownloading = resourceDownloadState?.status === 'downloading';
  const isResourceDownloaded = resourceDownloadState?.status === 'completed';
  const resourceProgress = resourceDownloadState?.progress || 0;
  
  const handleDownload = () => {
    if (!isOnline) {
      toast.error('You need to be online to download content for offline use');
      return;
    }
    
    if (resource) {
      dispatch(downloadResource({ 
        courseId: course.id, 
        resource: resource 
      }));
      toast.info(`Downloading "${resource.title}" for offline use`);
    }
    else if (moduleId) {
      const module = course.modules?.find(m => m.id === moduleId);
      if (module) {
        dispatch(downloadModule({ courseId: course.id, module }));
        toast.info(`Downloading "${module.title}" for offline use`);
      }
    } 
    else {
      dispatch(downloadCourse(course));
      toast.info(`Downloading "${course.title}" for offline use`);
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  // Handle resource-specific download button
  if (resource) {
    return (
      <button
        onClick={handleDownload}
        disabled={!isOnline || isResourceDownloading || isResourceDownloaded}
        className={`inline-flex items-center ${sizeClasses[size]} rounded-lg
                  ${isResourceDownloaded 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'border border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/10'}
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      >
        {isResourceDownloaded ? <CheckIcon className={`${iconSizes[size]} mr-1`} /> : 
         isResourceDownloading ? `${resourceProgress}%` : 
         <DownloadIcon className={`${iconSizes[size]} mr-1`} />}
        {isResourceDownloaded ? 'Downloaded' : isResourceDownloading ? 'Downloading...' : `Download (${resource.size} MB)`}
      </button>
    );
  }
  
  return (
    <div className="relative">
      {isDownloaded ? (
        <span className={`inline-flex items-center ${sizeClasses[size]} bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg`}>
          <CheckIcon className={`${iconSizes[size]} mr-1`} /> Available Offline
        </span>
      ) : isDownloading ? (
        <div className="inline-flex flex-col">
          <div className="inline-flex items-center justify-between w-full">
            <span className={`${sizeClasses[size]} text-primary dark:text-primary-light`}>Downloading...</span>
            <span className="text-xs text-surface-500">{progress}%</span>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 mt-1">
            <motion.div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          disabled={!isOnline}
          className={`inline-flex items-center ${sizeClasses[size]} rounded-lg border border-primary/30 
                    bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/10
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {isOnline ? (
            <>
              <DownloadIcon className={`${iconSizes[size]} mr-1`} /> 
              Download {moduleId ? 'Module' : 'Course'} ({fileSize} MB)
            </>
          ) : (
            <>
              <WifiOffIcon className={`${iconSizes[size]} mr-1`} /> 
              Offline (Connect to download)
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default DownloadManager;