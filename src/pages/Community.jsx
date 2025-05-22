import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import { getIcon } from '../utils/iconUtils';
import CommunityPost from '../components/CommunityPost';
import { TypeInfo } from '../utils/typeUtils';
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
const TagIcon = getIcon('tag');
const TrendingUpIcon = getIcon('trending-up');
const SearchIcon = getIcon('search');
const XIcon = getIcon('x');
const BookmarkIcon = getIcon('bookmark');
const RefreshCwIcon = getIcon('refresh-cw');
const MessageCircleIcon = getIcon('message-circle');
const AlertCircleIcon = getIcon('alert-circle');
const ChevronDownIcon = getIcon('chevron-down');

// Categories for the new post form
const categories = [
  { id: 'questions', name: 'Question' },
  { id: 'study-groups', name: 'Study Group' },
  { id: 'resources', name: 'Resource' },
  { id: 'project-help', name: 'Project Help' }
];

// Initial state for community data
const initialState = {
  posts: [],
  trendingTopics: [],
  hasMore: true,
  offset: 0,
  limit: 10,
  loadingPosts: false,
  loadingMore: false,
  loadingTopics: false,
  refreshing: false,
  error: null,
  creatingPost: false
};

// Reducer for managing community state
function communityReducer(state, action) {
  switch (action.type) {
    case 'FETCH_POSTS_START':
      return { ...state, loadingPosts: true, error: null };
    case 'FETCH_POSTS_SUCCESS':
      return { 
        ...state, 
        posts: action.payload, 
        loadingPosts: false,
        offset: 0,
        hasMore: action.payload.length >= state.limit
      };
    case 'FETCH_POSTS_ERROR':
      return { ...state, loadingPosts: false, error: action.payload };
    case 'FETCH_MORE_START':
      return { ...state, loadingMore: true };
    case 'FETCH_MORE_SUCCESS':
      return { 
        ...state, 
        posts: [...state.posts, ...action.payload], 
        loadingMore: false,
        offset: state.offset + state.limit,
        hasMore: action.payload.length >= state.limit
      };
    case 'FETCH_MORE_ERROR':
      return { ...state, loadingMore: false, error: action.payload };
    case 'FETCH_TOPICS_START':
      return { ...state, loadingTopics: true };
    case 'FETCH_TOPICS_SUCCESS':
      return { ...state, trendingTopics: action.payload, loadingTopics: false };
    case 'FETCH_TOPICS_ERROR':
      return { ...state, loadingTopics: false };
    case 'REFRESH_START':
      return { ...state, refreshing: true, error: null };
    case 'REFRESH_END':
      return { ...state, refreshing: false };
    case 'CREATE_POST_START':
      return { ...state, creatingPost: true };
    case 'CREATE_POST_SUCCESS':
      return { ...state, creatingPost: false };
    case 'CREATE_POST_ERROR':
      return { ...state, creatingPost: false };
    case 'UPDATE_POST':
      const updatedPosts = [...state.posts];
      const postIndex = updatedPosts.findIndex(p => p.Id === action.payload.Id);
      if (postIndex !== -1) {
        updatedPosts[postIndex] = { ...updatedPosts[postIndex], ...action.payload };
      }
      return { ...state, posts: updatedPosts };
    case 'ADD_COMMENT_TO_POST':
      const postsWithNewComment = [...state.posts];
      const targetPostIndex = postsWithNewComment.findIndex(p => p.Id === action.payload.postId);
      if (targetPostIndex !== -1) {
        const targetPost = postsWithNewComment[targetPostIndex];
        postsWithNewComment[targetPostIndex] = {
          ...targetPost,
          comments: [...(targetPost.comments || []), action.payload.comment]
        };
      }
      return { ...state, posts: postsWithNewComment };
    default:
      return state;
  }
}

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.user);
  
  // Use reducer for complex state management
  const [state, dispatch] = useReducer(communityReducer, initialState);
  
  // UI State
  const [activeCategory, setActiveCategory] = useState(() => {
    // Extract category from URL if present
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({ 
    title: '', 
    content: '', 
    category: 'questions' 
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Filter tabs with dynamic counts
  const tabs = [
    { id: 'all', label: 'All Discussions' },
    { id: 'questions', label: 'Questions' },
    { id: 'study-groups', label: 'Study Groups' },
    { id: 'resources', label: 'Resources' },
    { id: 'project-help', label: 'Project Help' }
  ];
  
  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts with category and search filters
  useEffect(() => {
    const fetchFilteredPosts = async () => {
      dispatch({ type: 'FETCH_POSTS_START' });
      
      try {
        const filters = {};
        const paging = { 
          limit: state.limit,
          offset: 0 // Reset offset when filters change
        };
        
        // Apply filters
        if (activeCategory !== 'all') {
          filters.category = activeCategory;
        }
        if (debouncedSearch) {
          filters.searchTerm = debouncedSearch;
        }
        
        const fetchedPosts = await getPosts(filters, paging);
        if (!fetchedPosts || fetchedPosts.length === 0) {
          dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: [] });
          return;
        }
        
        // For each post, fetch comments and user information
        const postsWithDetails = await Promise.all(
          fetchedPosts.map(async (post) => {
            // Fetch comments for this post
            let comments = [];
            try {
              if (post.Id) {
                comments = await getCommentsByPostId(post.Id, { limit: 3 }); // Limit initial comments
                
                // Add author name to comments for display purposes
                comments = comments.map(comment => ({
                  ...comment,
                  authorName: comment.userId ? `User ${comment.userId?.substring(0, 4)}` : 'Anonymous',
                  author: {
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.substring(0, 4) || 'User')}&background=random`
                  }
                }));
              }
            } catch (err) {
              console.error(`Error fetching comments for post ${post.Id}:`, err);
               // Continue with empty comments rather than failing entire post
               comments = [];
            }
            
            // Enhanced post object with display-friendly properties
            return {
              ...post,
              comments: comments || [],
              isLiked: false,
              isBookmarked: false,
              authorName: post.userId ? `User ${post.userId?.substring(0, 4)}` : 'Anonymous',
              author: {
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userId?.substring(0, 4) || 'User')}&background=random`
              }
            };
          })
        );
        
        dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: postsWithDetails });
        
        // Update URL with category filter for shareable links
        if (activeCategory !== 'all') {
          const searchParams = new URLSearchParams(location.search);
          searchParams.set('category', activeCategory);
          navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        } else {
          navigate(location.pathname, { replace: true });
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        dispatch({ type: 'FETCH_POSTS_ERROR', payload: "Failed to load discussions" });
        toast.error("Could not load discussions");
      }
    };
    
    fetchFilteredPosts();
  }, [activeCategory, debouncedSearch, navigate, location.pathname, state.limit]);
  
  // Load more posts function
  const loadMorePosts = async () => {
    if (state.loadingMore || !state.hasMore) return;
    
    dispatch({ type: 'FETCH_MORE_START' });
    
    try {
      const filters = {};
      const paging = { 
        limit: state.limit,
        offset: state.offset + state.limit
      };
      
      // Apply filters
      if (activeCategory !== 'all') {
        filters.category = activeCategory;
      }
      if (debouncedSearch) {
        filters.searchTerm = debouncedSearch;
      }
      
      const fetchedPosts = await getPosts(filters, paging);
      if (!fetchedPosts || fetchedPosts.length === 0) {
        dispatch({ type: 'FETCH_MORE_SUCCESS', payload: [] });
        return;
      }
      
      // Process posts with comments
      const postsWithDetails = await Promise.all(
        fetchedPosts.map(async (post) => {
          let comments = [];
          try {
            if (post.Id) {
              comments = await getCommentsByPostId(post.Id, { limit: 3 });
              comments = comments.map(comment => ({
                ...comment,
                authorName: comment.userId ? `User ${comment.userId?.substring(0, 4)}` : 'Anonymous',
                author: {
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.substring(0, 4) || 'User')}&background=random`
                }
              }));
            }
          } catch (err) {
            console.error(`Error fetching comments for post ${post.Id}:`, err);
            comments = [];
          }
          
          return {
            ...post,
            comments: comments || [],
            isLiked: false,
            isBookmarked: false,
            authorName: post.userId ? `User ${post.userId?.substring(0, 4)}` : 'Anonymous',
            author: {
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userId?.substring(0, 4) || 'User')}&background=random`
            }
          };
        })
      );
      
      dispatch({ type: 'FETCH_MORE_SUCCESS', payload: postsWithDetails });
    } catch (err) {
      console.error("Error loading more posts:", err);
      dispatch({ type: 'FETCH_MORE_ERROR', payload: "Failed to load more discussions" });
      toast.error("Could not load more discussions");
    }
  };
  
  // Fetch trending topics
  useEffect(() => {
    const fetchTrendingTopics = async () => {
      dispatch({ type: 'FETCH_TOPICS_START' });
      try {
        const topics = await getTrendingTopics();
        dispatch({ type: 'FETCH_TOPICS_SUCCESS', payload: topics });
      } catch (err) {
        console.error("Error fetching trending topics:", err);
        dispatch({ type: 'FETCH_TOPICS_ERROR' });
        // Non-critical error, don't show toast
      }
    };
    
    fetchTrendingTopics();
  }, []);
  
  // Create post with validation
  const handleCreatePost = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to create a post");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // Validate post data
    if (!newPostData.title.trim()) {
      toast.error("Please add a title to your post");
      return;
    }
    
    if (!newPostData.content.trim()) {
      toast.error("Please add content to your post");
      return;
    }
    
    dispatch({ type: 'CREATE_POST_START' });
    
    try {
      // Prepare post data
      const postData = {
        title: newPostData.title,
        content: newPostData.content,
        category: newPostData.category,
        userId: user?.userId || 'anonymous'
      };
      
      const result = await createPost(postData);
      toast.success("Post created successfully!");
      setIsCreateModalOpen(false);
      
      // Reset form and refresh posts
      setNewPostData({ title: '', content: '', category: 'questions' });
      
      dispatch({ type: 'CREATE_POST_SUCCESS' });
      
      // Add the new post to the top of the list without refetching everything
      if (result?.results?.[0]?.data) {
        const newPost = {
          ...result.results[0].data,
          comments: [],
          isLiked: false,
          isBookmarked: false,
          authorName: user?.userId ? `User ${user.userId.substring(0, 4)}` : 'Anonymous',
          author: {
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.userId?.substring(0, 4) || 'User')}&background=random`
          }
        };
        
        dispatch({ 
          type: 'FETCH_POSTS_SUCCESS', 
          payload: [newPost, ...state.posts]
        });
      } else {
        // Fallback to full refresh if we don't get proper response
        await handleRefresh();
      }
    } catch (err) {
      console.error("Error creating post:", err);
      dispatch({ type: 'CREATE_POST_ERROR' });
      toast.error("Failed to create post");
    }
  }, [isAuthenticated, navigate, newPostData, user, activeCategory, state.posts]);

  // Optimistic post actions with rollback on error
  const handlePostAction = useCallback(async (action, postId) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to perform this action");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    try {
      const postIndex = state.posts.findIndex(p => p.Id === postId);
      if (postIndex === -1) return;
      
      const post = state.posts[postIndex];
      let updatedPost = { ...post };
      let originalPost = { ...post }; // Keep original for rollback
      
      switch (action) {
        case 'like':
          const isLiked = !post.isLiked;
          const newLikes = isLiked ? (post.likes || 0) + 1 : (post.likes || 0) - 1;
          
          // Optimistic update
          updatedPost = { ...post, isLiked, likes: newLikes };
          dispatch({ type: 'UPDATE_POST', payload: updatedPost });
          
          // Update post likes in database
          try {
            await updatePostLikes(postId, newLikes);
          } catch (error) {
            // Rollback on error
            dispatch({ type: 'UPDATE_POST', payload: originalPost });
            throw error;
          }
          
          // Track user interaction
          if (isLiked) {
            await createPostInteraction({ 
              postId, 
              userId: user?.userId || 'anonymous', 
              interactionType: 'like' 
            });
          }
          
          toast.success(isLiked ? 'Post liked!' : 'Post unliked');
          break;
          
        case 'share':
          const newShares = (post.shares || 0) + 1;
          
          // Optimistic update
          updatedPost = { ...post, shares: newShares };
          dispatch({ type: 'UPDATE_POST', payload: updatedPost });
          
          // Database update
          await updatePostShares(postId, newShares);
          
          // Track share interaction
          await createPostInteraction({ 
            postId, 
            userId: user?.userId || 'anonymous', 
            interactionType: 'share' 
          });
          
          toast.success('Post shared!');
          break;

        case 'bookmark':
          const isBookmarked = !post.isBookmarked;
          
          // Optimistic update
          updatedPost = { ...post, isBookmarked };
          dispatch({ type: 'UPDATE_POST', payload: updatedPost });
          
          // Track bookmark interaction
          await createPostInteraction({ 
            postId, 
            userId: user?.userId || 'anonymous', 
            interactionType: 'bookmark' 
          });
          
          toast.success(isBookmarked ? 'Post bookmarked!' : 'Bookmark removed');
          break;
        
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error handling post action (${action}):`, error);
      toast.error(`Could not ${action} the post`);
    }
  }, [isAuthenticated, navigate, state.posts, user]);
  
  // Add comment with optimistic update
  const handleAddComment = useCallback(async (postId, commentContent) => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to comment");
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    
    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      // Create optimistic comment for immediate UI update
      const optimisticComment = {
        Id: `temp-${Date.now()}`, // Temporary ID
        content: commentContent,
        created: new Date().toISOString(),
        authorName: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'You',
        userId: user?.userId || 'anonymous',
        likes: 0,
        author: {
          avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'You')}&background=random`
        }
      };
      
      // Update UI immediately
      dispatch({
        type: 'ADD_COMMENT_TO_POST',
        payload: { postId, comment: optimisticComment }
      });
      
      // Create comment in database
      const commentData = {
        postId,
        content: commentContent,
        userId: user?.userId || 'anonymous'
      };
      
      const result = await createComment(commentData);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  }, [isAuthenticated, navigate, user]);
  
  // Refresh posts data
  const handleRefresh = useCallback(async () => {
    dispatch({ type: 'REFRESH_START' });
    
    try {
      const filters = {};
      const paging = { 
        limit: state.limit,
        offset: 0
      };
      
      if (activeCategory !== 'all') {
        filters.category = activeCategory;
      }
      if (debouncedSearch) {
        filters.searchTerm = debouncedSearch;
      }
      
      const refreshedPosts = await getPosts(filters, paging);
      
      // Process posts with comments and placeholder user data
      const postsWithDetails = await Promise.all(
        refreshedPosts.map(async (post) => {
          let comments = [];
          try {
            if (post.Id) {
              comments = await getCommentsByPostId(post.Id, { limit: 3 });
              comments = comments.map(comment => ({
                ...comment,
                authorName: comment.userId ? `User ${comment.userId?.substring(0, 4)}` : 'Anonymous',
                author: {
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.substring(0, 4) || 'User')}&background=random`
                }
              }));
            }
          } catch (err) {
            console.error(`Error fetching comments for post ${post.Id}:`, err);
            comments = [];
          }
          
          return {
            ...post,
            comments: comments || [],
            isLiked: false,
            isBookmarked: false,
            authorName: post.userId ? `User ${post.userId?.substring(0, 4)}` : 'Anonymous',
            author: {
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userId?.substring(0, 4) || 'User')}&background=random`
            }
          };
        })
      );
      
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: postsWithDetails });
      toast.success('Discussions refreshed');
    } catch (error) {
      console.error("Error refreshing posts:", error);
      dispatch({ type: 'FETCH_POSTS_ERROR', payload: "Failed to reload discussions" });
      toast.error("Could not refresh discussions");
    }
    
    dispatch({ type: 'REFRESH_END' });
  }, [activeCategory, debouncedSearch, state.limit]);
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Discussions */}
          <div className="lg:col-span-8 space-y-6">
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
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Search discussions"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
                        aria-label="Clear search"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={handleRefresh}
                    className="ml-2 p-3 rounded-lg text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    title="Refresh discussions"
                    aria-label="Refresh discussions"
                    disabled={state.refreshing}
                  >
                    <RefreshCwIcon className={`w-5 h-5 ${state.refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 pb-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === tab.id 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                    aria-label={`Filter by ${tab.label}`}
                    aria-pressed={activeCategory === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
            
            {/* Error state */}
            {state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-center">
                <AlertCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{state.error}</p>
                  <p className="text-sm mt-1">Please try again or check your connection.</p>
                </div>
                <button 
                  className="px-3 py-1 bg-white dark:bg-surface-700 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 ml-3 text-sm" 
                  onClick={handleRefresh}
                  aria-label="Retry loading discussions"
                >
                  Retry
                </button>
              </div>
            )}
            
            {/* Discussion threads */}
            {state.loadingPosts ? (
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
                {state.posts.length > 0 ? (
                  <>
                    {state.posts.map(post => (
                      <CommunityPost 
                        key={post.Id}
                        post={post}
                        onAction={(action) => handlePostAction(action, post.Id)}
                        onAddComment={(content) => handleAddComment(post.Id, content)}
                      />
                    ))}
                    
                    {/* Load more button */}
                    {state.hasMore && (
                      <div className="text-center pt-2 pb-4">
                        <button 
                          onClick={loadMorePosts}
                          className="px-6 py-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-lg text-primary transition-colors inline-flex items-center gap-2"
                          disabled={state.loadingMore}
                          aria-label="Load more discussions"
                        >
                          {state.loadingMore ? (
                            <>
                              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                              <span>Loading more...</span>
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="w-4 h-4" />
                              <span>Load more discussions</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                    <MessageCircleIcon className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
                    <p className="text-surface-500 dark:text-surface-400 mb-4">No discussions match your criteria</p>
                    <button 
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-lg text-primary transition-colors"
                      aria-label="Show all discussions"
                    >
                      Show all discussions
                    </button>
                  </div>
                )}
              </div>          
            )}
          </div>
          
          {/* Middle column - Create Post & Related */}
          <div className="lg:col-span-4 space-y-6">
            {/* Create new post card */}
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
                aria-label="Start a new discussion"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Start a new discussion...</span>
              </button>
            </div>
            
            {/* Trending topics */}  
            <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm border border-surface-200 dark:border-surface-700">
              <h2 className="font-medium text-lg mb-4 flex items-center">
                <TrendingUpIcon className="w-5 h-5 mr-2 text-primary" />
                Trending Topics
              </h2>
              
              {state.loadingTopics ? (
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
                  {state.trendingTopics.length > 0 ? state.trendingTopics.map(topic => (
                    <div key={topic.Id} className="flex items-start">
                      <TagIcon className="w-4 h-4 mt-1 mr-2 text-primary" />
                      <div>
                        <h3 className="font-medium hover:text-primary cursor-pointer transition-colors">{topic.title}</h3>
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
                    <div className="text-2xl font-bold text-primary">{state.posts.length}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Active Discussions</div>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {state.posts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Comments</div>
                  </div>
                </div>
              </div>
              
              {/* Resource links */}
              <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                <h3 className="font-medium mb-3">Community Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center transition-colors">
                      <BookmarkIcon className="w-4 h-4 mr-2" />
                      Community Rules
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center transition-colors">
                      <BookmarkIcon className="w-4 h-4 mr-2" />
                      How to Get Help
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center transition-colors">
                      <BookmarkIcon className="w-4 h-4 mr-2" />
                      Formatting Tips
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-xl w-full max-w-lg p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                disabled={state.creatingPost}
                aria-label="Close dialog"
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
                  disabled={state.creatingPost}
                  maxLength={100}
                  aria-label="Post title"
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
                  disabled={state.creatingPost}
                  maxLength={2000}
                  aria-label="Post content"
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
                  disabled={state.creatingPost}
                  aria-label="Post category"
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
                disabled={state.creatingPost}
                aria-label="Cancel creating post"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePost}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2"
                disabled={state.creatingPost || !newPostData.title.trim() || !newPostData.content.trim()}
                aria-label="Post discussion"
              >
                {state.creatingPost ? (
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
  </>
  );
};

export default Community;