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

// Get comments for a post
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