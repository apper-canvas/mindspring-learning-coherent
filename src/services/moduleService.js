/**
 * Module service for managing course modules
 */

// Get all modules for a course
export const getModulesByCourseId = async (courseId) => {
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
        "description",
        "duration",
        "videoUrl",
        "orderIndex",
        "isDownloadable",
        "courseId"
      ],
      where: [
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        }
      ],
      orderBy: [
        {
          fieldName: "orderIndex",
          SortType: "ASC"
        }
      ]
    };

    const response = await apperClient.fetchRecords("course_module", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching modules for course ${courseId}:`, error);
    throw error;
  }
};

// Get a single module by ID
export const getModuleById = async (moduleId) => {
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
        "description",
        "duration",
        "videoUrl",
        "orderIndex",
        "isDownloadable",
        "courseId"
      ]
    };

    const response = await apperClient.getRecordById("course_module", moduleId, params);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching module with ID ${moduleId}:`, error);
    throw error;
  }
};

// Create a new module
export const createModule = async (moduleData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Name: moduleData.title,
        title: moduleData.title,
        description: moduleData.description,
        duration: moduleData.duration,
        videoUrl: moduleData.videoUrl,
        orderIndex: moduleData.orderIndex,
        isDownloadable: moduleData.isDownloadable || false,
        courseId: moduleData.courseId
      }]
    };

    const response = await apperClient.createRecord("course_module", params);
    return response;
  } catch (error) {
    console.error("Error creating module:", error);
    throw error;
  }
};

// Update module progress
export const updateModuleProgress = async (moduleId, isCompleted) => {
  try {
    // In a real implementation, we would update the module_progress table
    // For this example, we're just updating the module_progress in localStorage
    const key = `module_progress_${moduleId}`;
    localStorage.setItem(key, JSON.stringify({
      moduleId,
      completed: isCompleted,
      lastUpdated: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error(`Error updating progress for module ${moduleId}:`, error);
    throw error;
  }
};