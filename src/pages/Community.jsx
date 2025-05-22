import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import CommunityPost from '../components/CommunityPost';
import { discussionPosts, trendingTopics } from '../utils/communityData';

// Icons
const SearchIcon = getIcon('search');
const PlusIcon = getIcon('plus');
const TrendingUpIcon = getIcon('trending-up');
const UsersIcon = getIcon('users');
const BellIcon = getIcon('bell');
const TagIcon = getIcon('tag');

const Community = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState(discussionPosts);

  // Filter tabs options
  const tabs = [
    { id: 'all', label: 'All Discussions' },
    { id: 'questions', label: 'Questions' },
    { id: 'study-groups', label: 'Study Groups' },
    { id: 'resources', label: 'Resources' },
    { id: 'project-help', label: 'Project Help' }
  ];

  // Filter posts based on active tab and search query
  const filteredPosts = posts.filter(post => {
    const matchesTab = activeTab === 'all' || post.category === activeTab;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Handle creating a new post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.warning('Please enter some content for your post.');
      return;
    }
    
    const newPost = {
      id: `post-${Date.now()}`,
      title: newPostContent.split('\n')[0] || 'New Discussion',
      content: newPostContent,
      created: new Date().toISOString(),
      category: activeTab === 'all' ? 'questions' : activeTab,
      author: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
        role: 'Student'
      },
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success('Your post was published successfully!');
  };

  // Handle post interactions
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

  // Handle adding a comment to a post
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
          
          {/* Create new post */}
          <div className="mb-8 bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-surface-200 dark:border-surface-700">
            <h2 className="font-medium text-lg mb-3 flex items-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Discussion
            </h2>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? Share your thoughts, questions, or insights..."
              className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              rows={4}
            />
            <div className="flex justify-end">
              <button 
                onClick={handleCreatePost}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Post
              </button>
            </div>
          </div>
          
          {/* Discussion threads */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
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
        
        {/* Right column - Community sidebar */}
        <div className="space-y-6">
          {/* Trending topics */}
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
      </div>
    </div>
  );
};

export default Community;