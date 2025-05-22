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