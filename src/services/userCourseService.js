/**
 * User Course service for managing course enrollments and progress
 */

// Get all courses enrolled by a user
export const getUserCourses = async (userId) => {
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
      ]
    };

    const response = await apperClient.fetchRecords("user_course", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching courses for user ${userId}:`, error);
    throw error;
  }
};

// Check if a user is enrolled in a course
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
    return response?.data?.length > 0;
  } catch (error) {
    console.error(`Error checking enrollment for user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};

// Enroll a user in a course
export const enrollUserInCourse = async (userId, courseId) => {
  try {
    // First check if already enrolled
    const isEnrolled = await isUserEnrolled(userId, courseId);
    if (isEnrolled) {
      return { success: true, message: "User already enrolled in this course" };
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get course name for the enrollment record name
    const courseResponse = await apperClient.getRecordById("course", courseId, { fields: ["Name"] });
    const courseName = courseResponse?.data?.Name || "Course Enrollment";

    const params = {
      records: [{
        Name: `${courseName} Enrollment`,
        progress: 0,
        lastAccessed: new Date().toISOString(),
        isDownloaded: false,
        enrolledDate: new Date().toISOString(),
        userId: userId,
        courseId: courseId
      }]
    };

    const response = await apperClient.createRecord("user_course", params);
    
    // Also update the course enrollments count
    await updateCourseEnrollments(courseId, 1);
    
    return response;
  } catch (error) {
    console.error(`Error enrolling user ${userId} in course ${courseId}:`, error);
    throw error;
  }
};

// Update course progress for a user
export const updateUserCourseProgress = async (userId, courseId, progress) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First get the user_course record
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
    if (!response?.data?.length) {
      throw new Error("User is not enrolled in this course");
    }

    const userCourseId = response.data[0].Id;

    // Update the progress
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

// Helper function to update course enrollments count
async function updateCourseEnrollments(courseId, increment = 1) {
  try {
    // To be implemented - would get the course, update enrollments count, and save it
    console.log(`Incrementing course ${courseId} enrollments by ${increment}`);
  } catch (error) {
    console.error(`Error updating enrollments for course ${courseId}:`, error);
  }
}