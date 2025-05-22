import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';
import { formatDistanceToNow } from 'date-fns';
import { createComment } from '../services/communityService';

// Icons
const HeartIcon = getIcon('heart');
const MessageSquareIcon = getIcon('message-square');
const ShareIcon = getIcon('share');
const ChevronDownIcon = getIcon('chevron-down');
const ChevronUpIcon = getIcon('chevron-up');
const BookmarkIcon = getIcon('bookmark');

const CommunityPost = ({ post, onAction, onAddComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.user);
  
  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'recently';
      
      // Check if timestamp is already a Date object
      if (timestamp instanceof Date) {
        return formatDistanceToNow(timestamp, { addSuffix: true });
      }
      
      // Otherwise, try to parse it as a string
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return 'recently';
    }
  };

  // Handle submitting a new comment
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) {
      return;
    }
    
    setIsSubmitting(true);
    
    const commentData = {
      postId: post.Id,
      content: commentText.trim(),
      userId: user?.userId
    };
    
    createComment(commentData)
      .then(() => {
        onAddComment(post.Id, commentText);
        setCommentText('');
        setShowCommentForm(false);
      })
      .catch(err => {
        console.error("Failed to submit comment:", err);
      })
      .finally(() => setIsSubmitting(false));
  };

  // Get category label and color
  const getCategoryDisplay = (category) => {
    if (!category) return { label: 'Discussion', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400' };
    
    const categories = {
      'questions': { label: 'Question', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
      'study-groups': { label: 'Study Group', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
      'resources': { label: 'Resource', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
      'project-help': { label: 'Project Help', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' }
    };
    
    return categories[category] || { label: 'Discussion', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400' };
  };
  
  const categoryDisplay = getCategoryDisplay(post?.category);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      <div className="p-5">
        {/* Post header with author info */}
        <div className="flex items-start mb-3">
          {/* Use avatar from post author if available, otherwise use a placeholder */}
          <img 
            src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'User')}&background=random`} 
            alt={post.author?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium">
                {post.authorName || post.author?.name || 'Anonymous User'}
              </h3>
              
              {/* Show role badge if available */}
              {post.author?.role && (
                <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full text-surface-600 dark:text-surface-400">
                  {post.author.role}
                </span>
              )}
              <span className="text-xs text-surface-500 dark:text-surface-400">
                {formatTimestamp(post.created)}
              </span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${categoryDisplay.color}`}>
              {categoryDisplay.label}
            </span>
          </div>
        </div>
        
        {/* Post title and content */}
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
        <div className="text-surface-700 dark:text-surface-300 mb-4 whitespace-pre-line">
          {isExpanded ? post.content : (post.content?.length > 200 ? `${post.content.substring(0, 200)}...` : post.content)}
        </div>
        
        {post.content.length > 200 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:underline text-sm flex items-center mb-4"
          >
            {isExpanded ? 'Show less' : 'Read more'} 
            {isExpanded ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />}
          </button>
        )}
        
        {/* Post actions */}
        <div className="flex items-center space-x-6 text-surface-600 dark:text-surface-400 border-t border-surface-200 dark:border-surface-700 pt-3">
          <button 
            onClick={() => isAuthenticated && onAction('like', post.Id)}
            className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            disabled={!isAuthenticated}
            title={isAuthenticated ? 'Like this post' : 'Sign in to like posts'}
          >
            <HeartIcon className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </button>
          
          <button 
            onClick={() => isAuthenticated && setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-1 hover:text-primary"
            disabled={!isAuthenticated}
            title={isAuthenticated ? 'Add a comment' : 'Sign in to comment'}
          >
            <MessageSquareIcon className="w-5 h-5" />
            <span>{post.comments?.length || 0}</span>
          </button>
          
          <button 
            onClick={() => isAuthenticated && onAction('share', post.Id)}
            className="flex items-center space-x-1 hover:text-primary"
            disabled={!isAuthenticated}
            title={isAuthenticated ? 'Share this post' : 'Sign in to share posts'}
          >
            <ShareIcon className="w-5 h-5" />
            <span>{post.shares}</span>
          </button>
          
          <button 
            onClick={() => isAuthenticated && onAction('bookmark', post.Id)}
            className={`flex items-center space-x-1 ${post.isBookmarked ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
            disabled={!isAuthenticated}
            title={isAuthenticated ? 'Bookmark this post' : 'Sign in to bookmark posts'}
          >
            <BookmarkIcon className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Comment form */}
      {showCommentForm && (
        <div className="px-5 pb-5 pt-2 border-t border-surface-200 dark:border-surface-700">
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
            <textarea 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              placeholder="Add a comment..." 
              className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowCommentForm(false)} 
                className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Posting...</span>
                  </>
                ) : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Comments section */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-5 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-850 rounded-b-xl">
          <h3 className="font-medium text-sm mb-3">Comments ({post.comments.length})</h3>
          <div className="space-y-4">
            {post.comments.map((comment, index) => (
              <div key={comment.Id || index} className="flex space-x-3">
                <img 
                  src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName || 'User')}&background=random`}
                  alt={comment.author?.name || comment.authorName || 'User'} 
                  className="w-8 h-8 rounded-full object-cover mt-1" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.authorName || comment.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-surface-500 dark:text-surface-400">
                      {formatTimestamp(comment.created)}
                    </span>
                  </div>
                  <p className="text-sm text-surface-700 dark:text-surface-300 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommunityPost;