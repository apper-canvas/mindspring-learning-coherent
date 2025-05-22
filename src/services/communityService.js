/**
 * Community service for managing posts and comments
 */

// Get all posts with optional filtering
export const getPosts = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        "Id",
        "Name",
        "title",
        "content",
        "category",
        "created",
        "likes",
        "shares",
        "userId"
      ]
    };

    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      params.where = [];

      // Category filter
      if (filters.category && filters.category !== 'all') {
        params.where.push({
          fieldName: "category",
          operator: "ExactMatch",
          values: [filters.category]
        });
      }

      // Search term filter across multiple fields
      if (filters.searchTerm) {
        const searchParams = {
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "title",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "content",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            }
          ]
        };
        
        params.whereGroups = [searchParams];
      }

      // User filter
      if (filters.userId) {
        params.where.push({
          fieldName: "userId",
          operator: "ExactMatch",
          values: [filters.userId]
        });
      }
    }

    // Add sorting - newest first by default
    params.orderBy = [
      {
        fieldName: "created",
        SortType: "DESC"
      }
    ];

    const response = await apperClient.fetchRecords("post", params);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get a single post by ID
export const getPostById = async (postId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        "Id",
        "Name",
        "title",
        "content",
        "category",
        "created",
        "likes",
        "shares",
        "userId"
      ]
    };

    const response = await apperClient.getRecordById("post", postId, params);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: postData.title,
        title: postData.title,
        content: postData.content,
        category: postData.category,
        created: new Date().toISOString(),
        likes: 0,
        shares: 0,
        userId: postData.userId
      }]
    };

    const response = await apperClient.createRecord("post", params);
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Get comments for a specific post
export const getCommentsByPostId = async (postId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        "Id",
        "Name",
        "content",
        "created",
        "likes",
        "postId",
        "userId"
      ],
      where: [
        {
          fieldName: "postId",
          operator: "ExactMatch",
          values: [postId]
        }
      ],
      orderBy: [
        {
          fieldName: "created",
          SortType: "ASC"
        }
      ]
    };

    const response = await apperClient.fetchRecords("post_comment", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (commentData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: `Comment on ${commentData.postId}`,
        content: commentData.content,
        created: new Date().toISOString(),
        likes: 0,
        postId: commentData.postId,
        userId: commentData.userId
      }]
    };

    const response = await apperClient.createRecord("post_comment", params);
    return response;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Update post likes
export const updatePostLikes = async (postId, newLikeCount) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: postId,
        likes: newLikeCount
      }]
    };

    const response = await apperClient.updateRecord("post", params);
    return response;
  } catch (error) {
    console.error(`Error updating likes for post ${postId}:`, error);
    throw error;
  }
};

// Update post shares
export const updatePostShares = async (postId, newShareCount) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: postId,
        shares: newShareCount
      }]
    };

    const response = await apperClient.updateRecord("post", params);
    return response;
  } catch (error) {
    console.error(`Error updating shares for post ${postId}:`, error);
    throw error;
  }
};

// Track user's post interactions (likes, shares, bookmarks)
export const createPostInteraction = async (interactionData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: `${interactionData.interactionType}-${interactionData.postId}`,
        interactionType: interactionData.interactionType,
        created: new Date().toISOString(),
        userId: interactionData.userId,
        postId: interactionData.postId
      }]
    };

    const response = await apperClient.createRecord("user_post_interaction", params);
    return response;
  } catch (error) {
    console.error("Error creating post interaction:", error);
    throw error;
  }
};

// Get trending topics
export const getTrendingTopics = async (limit = 5) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        "Id",
        "Name",
        "title",
        "postCount",
        "lastUpdated"
      ],
      orderBy: [
        {
          fieldName: "postCount",
          SortType: "DESC"
        }
      ],
      pagingInfo: { limit }
    };

    const response = await apperClient.fetchRecords("trending_topic", params);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    throw error;
  }
};