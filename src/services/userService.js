/**
 * User service for managing user data and authentication
 */

// Get current authenticated user
export const getCurrentUser = () => {
  try {
    const { ApperUI } = window.ApperSDK;
    return ApperUI.getCurrentUser();
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
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
        "username",
        "fullName",
        "email",
        "avatar",
        "streak",
        "totalLearningTime",
        "lastActive",
        "preferences"
      ]
    };

    const response = await apperClient.getRecordById("User3", userId, params);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.userId) {
      throw new Error("No authenticated user found");
    }

    return await getUserById(currentUser.userId);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Fetch all users with pagination, sorting, and search
export const fetchUsers = async ({
  searchTerm = '',
  sortField = 'lastActive',
  sortDirection = 'desc',
  page = 1,
  pageSize = 10
}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Calculate offset based on page number and page size
    const offset = (page - 1) * pageSize;

    // Build query parameters
    const params = {
      fields: [
        "Id",
        "Name",
        "username",
        "fullName",
        "email",
        "avatar",
        "streak",
        "totalLearningTime",
        "lastActive"
      ],
      orderBy: [
        {
          fieldName: sortField,
          SortType: sortDirection.toUpperCase()
        }
      ],
      pagingInfo: {
        limit: pageSize,
        offset: offset
      }
    };

    // Add search filter if a search term is provided
    if (searchTerm) {
      params.where = [
        { fieldName: "fullName", operator: "Contains", values: [searchTerm] },
        { fieldName: "username", operator: "Contains", values: [searchTerm] },
        { fieldName: "email", operator: "Contains", values: [searchTerm] }
      ];
    }

    const response = await apperClient.fetchRecords("User3", params);
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Id: userData.Id,
        Name: userData.fullName || userData.Name,
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        avatar: userData.avatar
      }]
    };

    const response = await apperClient.updateRecord("User3", params);
    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get current user to ensure we have all data
    const currentUser = await getUserById(userId);
    if (!currentUser) {
      throw new Error("User not found");
    }

    // Parse current preferences or initialize empty object
    let currentPreferences = {};
    if (currentUser.preferences) {
      try {
        currentPreferences = typeof currentUser.preferences === 'string' 
          ? JSON.parse(currentUser.preferences) 
          : currentUser.preferences;
      } catch (e) {
        console.error("Error parsing preferences:", e);
      }
    }

    // Merge with new preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };

    // Update with merged preferences
    const params = {
      records: [{
        Id: userId,
        preferences: JSON.stringify(updatedPreferences)
      }]
    };

    const response = await apperClient.updateRecord("User3", params);
    return response;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

// Password reset request
export const requestPasswordReset = async (email) => {
  // This would normally call a backend API endpoint to trigger a password reset email
  // For now, we'll just return a mock successful response
  return Promise.resolve({ success: true });
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  // This would normally call a backend API endpoint to verify the token and set a new password
  // For now, we'll just return a mock successful response
  return Promise.resolve({ success: true });
};