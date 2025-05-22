/**
 * Badge service for managing user badges
 */

// Get all badges (for admin purposes)
export const getAllBadges = async () => {
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
        "badgeTypeId",
        "description",
        "icon",
        "level",
        "category",
        "points"
      ]
    };

    const response = await apperClient.fetchRecords("badge", params);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching all badges:", error);
    throw error;
  }
};

// Get a badge by ID
export const getBadgeById = async (badgeId) => {
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
        "badgeTypeId",
        "description",
        "icon",
        "level",
        "category",
        "points"
      ]
    };

    const response = await apperClient.getRecordById("badge", badgeId, params);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching badge with ID ${badgeId}:`, error);
    throw error;
  }
};

// Get badges earned by a user
export const getUserBadges = async (userId) => {
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
        "courseTitle",
        "earnedAt",
        "isNew",
        "userId",
        "badgeId",
        "courseId"
      ],
      where: [
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("user_badge", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching badges for user ${userId}:`, error);
    throw error;
  }
};

// Award a badge to a user
export const awardBadgeToUser = async (userId, badgeId, courseId = null, courseTitle = null) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get badge details for the Name field
    const badgeResponse = await getBadgeById(badgeId);
    const badgeName = badgeResponse?.Name || "User Badge";

    const params = {
      records: [{
        Name: badgeName,
        courseTitle: courseTitle,
        earnedAt: new Date().toISOString(),
        isNew: true,
        userId: userId,
        badgeId: badgeId,
        courseId: courseId
      }]
    };

    return await apperClient.createRecord("user_badge", params);
  } catch (error) {
    console.error(`Error awarding badge ${badgeId} to user ${userId}:`, error);
    throw error;
  }
};

// Update a user badge (mark as viewed, etc.)
export const updateBadge = async (userId, badgeId, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get the badge to ensure it exists and belongs to the user
    const params = {
      records: [{
        Id: badgeId,
        ...updates
      }]
    };

    const response = await apperClient.updateRecord("user_badge", params);
    
    if (response && response.success) {
      return {
        success: true,
        data: response.data
      };
    } else {
      return { success: false, message: "Failed to update badge" };
    }
  } catch (error) {
    console.error(`Error updating badge ${badgeId}:`, error);
    return { success: false, message: error.message || "An error occurred" };
  }
};