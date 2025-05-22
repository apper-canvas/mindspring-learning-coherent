import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import { getIcon } from '../utils/iconUtils';
import CommunityPost from '../components/CommunityPost';
import { 
  getPosts, 
  createPost, 
  getCommentsByPostId, 
  getTrendingTopics,
  updatePostLikes,
  updatePostShares,
  createPostInteraction,
  createComment
} from '../services/communityService';

// Icons
const UsersIcon = getIcon('users');
const PlusIcon = getIcon('plus');
const BellIcon = getIcon('bell');
const TagIcon = getIcon('tag');
const TrendingUpIcon = getIcon('trending-up');
const SearchIcon = getIcon('search');
const XIcon = getIcon('x');
const FilterIcon = getIcon('filter');
const BookmarkIcon = getIcon('bookmark');
const RefreshCwIcon = getIcon('refresh-cw');
const MessageCircleIcon = getIcon('message-circle');

// Categories for the new post form
const categories = [
  { id: 'questions', name: 'Question' },
  { id: 'study-groups', name: 'Study Group' },
  { id: 'resources', name: 'Resource' },
  { id: 'project-help', name: 'Project Help' }
];

const Community = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.user);
  
  // State for posts and UI
  const [posts, setPosts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({ title: '', content: '', category: 'questions' });

  // Loading and error states  
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [error, setError] = useState(null);

  // Filter tabs options
  const tabs = [
    { id: 'all', label: 'All Discussions' },
    { id: 'questions', label: 'Questions' },
    { id: 'study-groups', label: 'Study Groups' },
    { id: 'resources', label: 'Resources' },
    { id: 'project-help', label: 'Project Help' }
  ];

  // Fetch posts based on active category and search query
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setError(null);
      
      try {
        const filters = {};
        
        // Add category filter if not 'all'
        if (activeCategory !== 'all') {
          filters.category = activeCategory;
        }
        
        // Add search term if provided
        if (searchQuery) {
          filters.searchTerm = searchQuery;
        }

        const fetchedPosts = await getPosts(filters);
        if (!fetchedPosts || fetchedPosts.length === 0) {
          setPosts([]);
          setLoadingPosts(false);
          return;
        }

        // For each post, fetch comments and user information
        const postsWithDetails = await Promise.all(
          fetchedPosts.map(async (post) => {
            // Fetch comments for this post
            let comments = [];
            try {
              if (post.Id) {
                comments = await getCommentsByPostId(post.Id);
                
                // Add author name to comments for display purposes
                comments = comments.map(comment => ({
                  ...comment,
                  authorName: `User ${comment.userId?.substring(0, 4)}`
                }));
              }
            } catch (err) {
              console.error(`Error fetching comments for post ${post.Id}:`, err);
            }
            
            // Create display-friendly post object
            return {
              ...post,
              comments: comments || [],
              isLiked: false, // We'd fetch this from user_post_interaction in a full implementation
              isBookmarked: false, // Same here
              authorName: `User ${post.userId?.substring(0, 4)}`
            };
          })
        );
        
        setPosts(postsWithDetails);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load discussions");
        toast.error("Could not load discussions");
      } finally {
        setLoadingPosts(false);
      }
    };
    
    fetchPosts();
  }, [activeCategory, searchQuery]);
  
  // Fetch trending topics
  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setLoadingTopics(true);
      try {
        const topics = await getTrendingTopics();
        setTrendingTopics(topics);
      } catch (err) {
        console.error("Error fetching trending topics:", err);
        // Fallback to empty array - non-critical error
        setTrendingTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };
    
    fetchTrendingTopics();
  }, []);
  
  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to create a post");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    if (!newPostData.title.trim() || !newPostData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setCreatingPost(true);
    try {
      // Prepare post data
      const postData = {
        title: newPostData.title,
        content: newPostData.content,
        category: newPostData.category,
        userId: user?.userId
      };
      
      await createPost(postData);
      toast.success("Post created successfully!");
      setIsCreateModalOpen(false);
      
      // Reset form and refresh posts
      setNewPostData({ title: '', content: '', category: 'questions' });
      
      // Refresh posts
      const refreshedPosts = await getPosts({ category: activeCategory !== 'all' ? activeCategory : undefined });
      setPosts(refreshedPosts);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    }
  };

  // Handle post actions (like, share, bookmark)
  const handlePostAction = async (postId, action) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to perform this action");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    try {
      const postIndex = posts.findIndex(p => p.Id === postId);
      if (postIndex === -1) return;
      
      const post = posts[postIndex];
      let updatedPost = { ...post };
      
      switch (action) {
        case 'like':
          const isLiked = !post.isLiked;
          const newLikes = isLiked ? (post.likes || 0) + 1 : (post.likes || 0) - 1;
          
          // Update post likes in database
          await updatePostLikes(postId, newLikes);
          
          // Track user interaction
          if (isLiked) {
            await createPostInteraction({ 
              postId, 
              userId: user?.userId, 
              interactionType: 'like' 
            });
          }
          
          updatedPost = { ...post, isLiked, likes: newLikes };
          toast.success(isLiked ? 'Post liked!' : 'Post unliked');
          break;
          
        case 'share':
          const newShares = (post.shares || 0) + 1;
          await updatePostShares(postId, newShares);
          
          // Track share interaction
          await createPostInteraction({ 
            postId, 
            userId: user?.userId, 
            interactionType: 'share' 
          });
          
          updatedPost = { ...post, shares: newShares };
          toast.success('Post shared!');
          break;
      }
      
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      setPosts(updatedPosts);
      
    } catch (error) {
      console.error(`Error handling post action (${action}):`, error);
      toast.error(`Could not ${action} the post`);
    }
  };
  // Handle adding a comment to a post
  const handleAddComment = async (postId, commentContent) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to comment");
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    
    if (!commentContent.trim()) return;
    
    try {
      // Create comment in database
      const commentData = {
        postId,
        content: commentContent,
        userId: user?.userId
      };
      
      await createComment(commentData);
      
      // Update UI with new comment
      const postIndex = posts.findIndex(p => p.Id === postId);
      if (postIndex >= 0) {
        const updatedPosts = [...posts];
        const post = updatedPosts[postIndex];
        
        // Add new comment to post
        const newComment = {
          Id: `temp-${Date.now()}`, // Temporary ID until we refresh
          content: commentContent,
          created: new Date().toISOString(),
          authorName: user?.fullName || `${user?.firstName} ${user?.lastName}` || 'You',
          userId: user?.userId,
          likes: 0
        };
        
        updatedPosts[postIndex] = {
          ...post,
          comments: [...(post.comments || []), newComment]
        };
        
        setPosts(updatedPosts);
        toast.success('Comment added');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };
  
  // Refresh posts data
  const handleRefresh = async () => {
    setLoadingPosts(true);
    setError(null);
    
    try {
      const filters = {};
      if (activeCategory !== 'all') {
        filters.category = activeCategory;
      }
      if (searchQuery) {
        filters.searchTerm = searchQuery;
      }
      
      const refreshedPosts = await getPosts(filters);
      
      // Process posts with comments and placeholder user data
      const postsWithDetails = await Promise.all(
        refreshedPosts.map(async (post) => {
          let comments = [];
          try {
            if (post.Id) {
              comments = await getCommentsByPostId(post.Id);
              comments = comments.map(comment => ({
                ...comment,
                authorName: `User ${comment.userId?.substring(0, 4)}`
              }));
            }
          } catch (err) {
            console.error(`Error fetching comments for post ${post.Id}:`, err);
          }
          
          return {
            ...post,
            comments: comments || [],
            isLiked: false,
            isBookmarked: false,
            authorName: `User ${post.userId?.substring(0, 4)}`
          };
        })
      );
      
      setPosts(postsWithDetails);
    } catch (error) {
      console.error("Error refreshing posts:", error);
      setError("Failed to reload discussions");
      toast.error("Could not refresh discussions");
    } finally {
      setLoadingPosts(false);
    }
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Discussions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and filters */}
            <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm border border-surface-200 dark:border-surface-700">
              <div className="relative mb-4">
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={handleRefresh}
                    className="ml-2 p-3 rounded-lg text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700"
                    title="Refresh discussions"
                  >
                    <RefreshCwIcon className={`w-5 h-5 ${loadingPosts ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === tab.id 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          {/* Create new post */}
          <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm border border-surface-200 dark:border-surface-700">
            <h2 className="font-medium text-lg mb-4 flex items-center">
              <MessageCircleIcon className="w-5 h-5 mr-2 text-primary" />
              Create New Discussion
            </h2>
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  setIsCreateModalOpen(true);
                } else {
                  toast.info("Please sign in to create a discussion");
                  navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                }
              }} 
              className="w-full py-3 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg text-surface-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Start a new discussion...</span>
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
              <p>{error}</p>
              <button 
                className="text-primary mt-2 hover:underline" 
                onClick={handleRefresh}
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Discussion threads */}
          {loadingPosts ? (
            // Loading skeleton
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm border border-surface-200 dark:border-surface-700 animate-pulse">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 bg-surface-200 dark:bg-surface-700 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
                    <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
                    <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map(post => (
                  <CommunityPost 
                    key={post.Id}
                    post={post}
                    onAction={(action) => handlePostAction(post.Id, action)}
                    onAddComment={(content) => handleAddComment(post.Id, content)}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                  <p className="text-surface-500 dark:text-surface-400 mb-4">No discussions match your criteria</p>
                  <button 
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-lg text-primary transition-colors"
                  >
                    Show all discussions
                  </button>
                </div>
              )}
            </div>          
          </div>
          {/* Right column - Trending topics */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm border border-surface-200 dark:border-surface-700">
          <h2 className="font-medium text-lg mb-4 flex items-center">
            <TrendingUpIcon className="w-5 h-5 mr-2 text-primary" />
            Trending Topics
          </h2>
          
          {loadingTopics ? (
            // Loading skeleton for trending topics
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-start">
                  <div className="w-4 h-4 bg-surface-200 dark:bg-surface-700 rounded mr-2 mt-1"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {trendingTopics.length > 0 ? trendingTopics.map(topic => (
                <div key={topic.Id} className="flex items-start">
                  <TagIcon className="w-4 h-4 mt-1 mr-2 text-accent" />
                  <div>
                    <h3 className="font-medium hover:text-primary cursor-pointer">{topic.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{topic.postCount} posts this week</p>
                  </div>
                </div>
              )) : (
                <p className="text-surface-500 dark:text-surface-400 text-center py-4">No trending topics available</p>
              )}
            </div>
          )}
          
          {/* User stats section */}
          <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
            <h2 className="font-medium text-lg mb-4 flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-primary" />
              Community Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{posts.length}</div>
                <div className="text-sm text-surface-500 dark:text-surface-400">Active Discussions</div>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                </div>
                <div className="text-sm text-surface-500 dark:text-surface-400">Comments</div>
              </div>
            </div>
          </div>
          
          {/* Resource links */}
          <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
            <h3 className="font-medium mb-3">Community Guidelines</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Community Rules
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  How to Get Help
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <BookmarkIcon className="w-4 h-4 mr-2" />
                  Formatting Tips
                </a>
              </li>
            </ul>
          </div>
        </div>
        </div>
      
      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl w-full max-w-lg p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                disabled={creatingPost}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Add a title for your post"
                  value={newPostData.title}
                  onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                  disabled={creatingPost}
                  maxLength={100}
                />
                <div className="text-xs text-right mt-1 text-surface-500">
                  {newPostData.title.length}/100
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea 
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[150px]" 
                  placeholder="Share your thoughts, questions, or insights..."
                  value={newPostData.content}
                  onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                  disabled={creatingPost}
                  maxLength={2000}
                ></textarea>
                <div className="text-xs text-right mt-1 text-surface-500">
                  {newPostData.content.length}/2000
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newPostData.category}
                  onChange={(e) => setNewPostData({...newPostData, category: e.target.value})}
                  disabled={creatingPost}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-2">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                disabled={creatingPost}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePost}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={creatingPost || !newPostData.title.trim() || !newPostData.content.trim()}
              >
                {creatingPost ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating...</span>
                  </>
                ) : 'Post Discussion'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
  </>
  );
};

export default Community;