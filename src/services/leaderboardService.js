/**
 * Leaderboard service for managing leaderboard entries
 */

// Get leaderboard entries for a course
export const getLeaderboardEntries = async (courseId, period = 'weekly') => {
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
        "period",
        "rank",
        "completionPercentage",
        "quizScore",
        "lessonCount",
        "badgesEarned",
        "points",
        "lastActive",
        "userId",
        "courseId"
      ],
      where: [
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        },
        {
          fieldName: "period",
          operator: "ExactMatch",
          values: [period]
        }
      ],
      orderBy: [
        {
          fieldName: "rank",
          SortType: "ASC"
        }
      ]
    };

    const response = await apperClient.fetchRecords("leaderboard_entry", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching leaderboard for course ${courseId}:`, error);
    throw error;
  }
};

// Update or create leaderboard entry for a user
export const updateLeaderboardEntry = async (userId, courseId, entryData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First check if entry already exists
    const params = {
      fields: ["Id"],
      where: [
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        },
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        },
        {
          fieldName: "period",
          operator: "ExactMatch",
          values: [entryData.period]
        }
      ]
    };

    const response = await apperClient.fetchRecords("leaderboard_entry", params);
    
    if (response?.data?.length > 0) {
      // Update existing entry
      const entryId = response.data[0].Id;
      const updateParams = {
        records: [{
          Id: entryId,
          ...entryData,
          lastActive: new Date().toISOString()
        }]
      };
      return await apperClient.updateRecord("leaderboard_entry", updateParams);
    } else {
      // Create new entry
      const createParams = {
        records: [{
          Name: `${courseId}-${userId}-${entryData.period}`,
          ...entryData,
          userId: userId,
          courseId: courseId,
          lastActive: new Date().toISOString()
        }]
      };
      return await apperClient.createRecord("leaderboard_entry", createParams);
    }
  } catch (error) {
    console.error(`Error updating leaderboard for user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};