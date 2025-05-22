/**
 * User service for handling authentication and user operations
 */

// Get user profile from the database
export const getUserProfile = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch user by ID if specified, otherwise get current user
    const params = {
      fields: [
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

    if (userId) {
      // Get a specific user by ID
      return await apperClient.getRecordById("User3", userId, params);
    } else {
      // Get current user's profile
      const where = [
        {
          fieldName: "Owner",
          operator: "ExactMatch",
          values: ["@currentUser"]
        }
      ];

      const response = await apperClient.fetchRecords("User3", {
        fields: params.fields,
        where
      });

      return response?.data?.[0] || null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Create or update user profile
export const updateUserProfile = async (userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const updateableFields = {
      Name: userData.Name,
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      avatar: userData.avatar,
      streak: userData.streak,
      totalLearningTime: userData.totalLearningTime,
      lastActive: userData.lastActive,
      preferences: userData.preferences
    };

    // Filter out undefined values
    Object.keys(updateableFields).forEach(key => 
      updateableFields[key] === undefined && delete updateableFields[key]
    );

    const params = {
      records: [updateableFields]
    };

    if (userData.Id) {
      // Update existing user
      params.records[0].Id = userData.Id;
      return await apperClient.updateRecord("User3", params);
    } else {
      // Create new user profile
      return await apperClient.createRecord("User3", params);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const { ApperUI } = window.ApperSDK;
    return await ApperUI.requestPasswordReset(email);
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    const { ApperUI } = window.ApperSDK;
    return await ApperUI.resetPassword(token, newPassword);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const user = await getUserProfile(userId);
    if (!user) throw new Error("User not found");
    
    let currentPreferences = {};
    try {
      currentPreferences = user.preferences ? JSON.parse(user.preferences) : {};
    } catch (e) {
      console.warn("Error parsing existing preferences, starting fresh");
    }
    
    const updatedPreferences = { ...currentPreferences, ...preferences };
    
    return await updateUserProfile({ Id: user.Id, preferences: JSON.stringify(updatedPreferences) });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

// Update user's last active timestamp and learning streak
export const updateUserActivity = async (userId, minutes = 5) => {
  try {
    const user = await getUserProfile(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      Id: user.Id,
      lastActive: new Date().toISOString(),
      totalLearningTime: (user.totalLearningTime || 0) + minutes
    };

    return await updateUserProfile(updatedUser);
  } catch (error) {
    console.error("Error updating user activity:", error);
    throw error;
  }
};

// Create new user record after signup if one doesn't exist
export const createUserAfterSignup = async (userData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Check if a user record already exists
    const where = [
      {
        fieldName: "Owner",
        operator: "ExactMatch",
        values: ["@currentUser"]
      }
    ];
    
    const existingUser = await apperClient.fetchRecords("User3", { 
      fields: ["Id"],
      where
    });
    
    if (existingUser?.data?.length > 0) {
      // User already exists, return their ID
      return existingUser.data[0].Id;
    }
    
    // Create new user record
    const newUserData = { ...userData, Name: userData.fullName || userData.email };
    return await updateUserProfile(newUserData);
  } catch (error) {
    console.error("Error creating user after signup:", error);
    throw error;
  }
};