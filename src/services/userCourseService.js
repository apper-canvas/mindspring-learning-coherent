/**
 * Service for managing user course enrollments and progress
 */

// Check if user is enrolled in a course
export const isUserEnrolled = async (userId, courseId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

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
        }
      ]
    };

    const response = await apperClient.fetchRecords("user_course", params);
    return response?.data && response.data.length > 0;
  } catch (error) {
    console.error(`Error checking enrollment for user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};

// Enroll user in a course
export const enrollUserInCourse = async (userId, courseId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Check if already enrolled
    const alreadyEnrolled = await isUserEnrolled(userId, courseId);
    if (alreadyEnrolled) {
      return { success: true, message: "User already enrolled in this course" };
    }

    const params = {
      records: [{
        Name: `${userId}-${courseId}`,
        userId: userId,
        courseId: courseId,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        isDownloaded: false,
        enrolledDate: new Date().toISOString()
      }]
    };

    const response = await apperClient.createRecord("user_course", params);
    return response;
  } catch (error) {
    console.error(`Error enrolling user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};

// Get user's enrolled courses
export const getUserEnrolledCourses = async (userId) => {
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
        "progress",
        "lastAccessed",
        "isDownloaded",
        "enrolledDate",
        "userId",
        "courseId"
      ],
      where: [
        {
          fieldName: "userId",
          operator: "ExactMatch",
          values: [userId]
        }
      ],
      orderBy: [
        {
          fieldName: "lastAccessed",
          SortType: "DESC"
        }
      ]
    };

    const response = await apperClient.fetchRecords("user_course", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching enrolled courses for user ${userId}:`, error);
    throw error;
  }
};

// Update user's course progress
export const updateCourseProgress = async (userId, courseId, progress) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First get the user_course record to update
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
        }
      ]
    };

    const fetchResponse = await apperClient.fetchRecords("user_course", params);
    if (!fetchResponse?.data || fetchResponse.data.length === 0) {
      throw new Error("User is not enrolled in this course");
    }

    const userCourseId = fetchResponse.data[0].Id;
    const updateParams = {
      records: [{
        Id: userCourseId,
        progress: progress,
        lastAccessed: new Date().toISOString()
      }]
    };

    return await apperClient.updateRecord("user_course", updateParams);
  } catch (error) {
    console.error(`Error updating progress for user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};