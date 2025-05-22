import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';
import CommunityPost from '../components/CommunityPost';
import { getPosts, createPost, getCommentsByPostId } from '../services/communityService'; 
import { trendingTopics, categories } from '../utils/communityData';
import { useNavigate } from 'react-router-dom';

// Icons
const PlusIcon = getIcon('plus');
const TrendingUpIcon = getIcon('trending-up');
const UsersIcon = getIcon('users');
const BellIcon = getIcon('bell');
const TagIcon = getIcon('tag');
const SearchIcon = getIcon('search');
const XIcon = getIcon('x');

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({ title: '', content: '', category: 'questions' });
  const { user, isAuthenticated } = useSelector(state => state.user);
  
  // Filter tabs options
  const tabs = [
    { id: 'all', label: 'All Discussions' },
    { id: 'questions', label: 'Questions' },
    { id: 'study-groups', label: 'Study Groups' },
    { id: 'resources', label: 'Resources' },
    { id: 'project-help', label: 'Project Help' }
  ];

  // Filter posts based on active tab and search query
  const filteredPosts = () => {
    return posts.filter(post => {
    const matchesTab = activeTab === 'all' || post.category === activeTab;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  };

  // Load posts when component mounts or category changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters = {};
        
        // Add category filter if not 'all'
        if (activeTab !== 'all') {
          filters.category = activeTab;
        }
        
        // Add search term if provided
        if (searchQuery) {
          filters.searchTerm = searchQuery;
        }
        
        const fetchedPosts = await getPosts(filters);
        
        // Fetch comments for each post and add user information
        const postsWithDetails = await Promise.all(
          fetchedPosts.map(async (post) => {
            // Fetch comments for this post
            let comments = [];
            try {
              comments = await getCommentsByPostId(post.Id);
            } catch (err) {
              console.error(`Error fetching comments for post ${post.Id}:`, err);
            }
            
            // For this demo, we'll use placeholder data for user info
            // In a real app, we'd fetch user details from the API
            return {
              ...post,
              comments: comments || [],
              isLiked: false,
              author: {
                name: "User " + post.userId?.substring(0, 4),
                avatar: `https://ui-avatars.com/api/?name=User&background=random`,
                role: "Member"
              }
            };
          })
        );
        
        setPosts(postsWithDetails);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load community posts");
        toast.error("Could not load community posts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [activeTab, searchQuery]);
  
  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to create a post");
      navigate("/login?redirect=/community");
      return;
    }
    
    if (!newPostData.title || !newPostData.content) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const postData = {
        title: newPostData.title,
        content: newPostData.content,
        category: newPostData.category,
        userId: user.userId,
        likes: 0,
        shares: 0,
        created: new Date().toISOString()
      };
      
      await createPost(postData);
      toast.success("Post created successfully!");
      setIsCreateModalOpen(false);
      
      // Reset form and refresh posts
      setNewPostData({ title: '', content: '', category: 'questions' });
      
      // Refresh posts
      const refreshedPosts = await getPosts({ category: activeTab !== 'all' ? activeTab : undefined });
      setPosts(refreshedPosts);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    }
  };

  const handlePostAction = (postId, action) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          switch (action) {
            case 'like':
              const isLiked = !post.isLiked;
              const likesCount = isLiked ? post.likes + 1 : post.likes - 1;
              toast.success(isLiked ? 'Post liked!' : 'Post unliked');
              return { ...post, isLiked, likes: likesCount };
            case 'share':
              toast.info('Post shared!');
              return { ...post, shares: post.shares + 1 };
            default:
              return post;
          }
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId, commentContent) => {
    if (!commentContent.trim()) return;
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            content: commentContent,
            author: {
              id: 'current-user',
              name: 'You',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
            },
            created: new Date().toISOString(),
            likes: 0
          };
          toast.success('Comment added!');
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  };

  return (
    <> 
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-surface-600 dark:text-surface-400">Connect with fellow learners, share insights, and grow together</p>
      </div>
      
      {/* Main content layout - 2 columns on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Discussions */}
        <div className="lg:col-span-2">

          {/* Search and filters */}
          <div className="mb-6">
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Filter tabs */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === tab.id 
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
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
              <p>{error}</p>
              <button className="text-primary mt-2" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}
          
          {/* Create new post */}
          <div className="mb-8 bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-surface-200 dark:border-surface-700">
            <h2 className="font-medium text-lg mb-3 flex items-center">
              <PlusIcon className="w-5 h-5 mr-2 text-primary" />
              Create New Discussion
            </h2>
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="w-full py-2 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg text-surface-500 hover:text-primary hover:border-primary transition-colors"
            >
              Click to start a new discussion...
            </button>
          </div>
          
          {/* Discussion threads */}
          {!loading && !error && (
            <div className="space-y-6">
              {filteredPosts().length > 0 ? (
                filteredPosts().map(post => (
                  <CommunityPost 
                    key={post.id}
                    post={post}
                    onAction={(action) => handlePostAction(post.id, action)}
                    onAddComment={(content) => handleAddComment(post.id, content)}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl">
                  <p className="text-surface-500 dark:text-surface-400">No discussions match your criteria</p>
                  <button 
                    onClick={() => {
                      setActiveTab('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 text-primary hover:underline"
                  >
                    View all discussions
                  </button>
                </div>
              )}
            </div>          
          </div>

        {/* Right column - Trending topics */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm border border-surface-200 dark:border-surface-700">
          <h2 className="font-medium text-lg mb-4 flex items-center">
              <TrendingUpIcon className="w-5 h-5 mr-2 text-primary" />
              Trending Topics
            </h2>
            <div className="space-y-4">
              {trendingTopics.map(topic => (
                <div key={topic.id} className="flex items-start">
                  <TagIcon className="w-4 h-4 mt-1 mr-2 text-accent" />
                  <div>
                    <h3 className="font-medium hover:text-primary cursor-pointer">{topic.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{topic.postCount} posts this week</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-primary hover:underline">
              View All Topics
            </button>
        </div>
      </div>
        {/* Create Post Modal - Moved outside the grid layout */}
        {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-surface-800 rounded-xl w-full max-w-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Post</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-surface-500">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Add a title for your post"
                    value={newPostData.title}
                    onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea 
                    className="input w-full min-h-[100px]" 
                    placeholder="Share your thoughts..."
                    value={newPostData.content}
                    onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="input w-full"
                    value={newPostData.category}
                    onChange={(e) => setNewPostData({...newPostData, category: e.target.value})}
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
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
                >Post</button>
              </div>
            </motion.div>
          </div>
      )}
      </div> {/* End of container */}
    </> {/* End of fragment */}
  );
};

export default Community;