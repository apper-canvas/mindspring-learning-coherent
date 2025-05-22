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

    const params = {
      records: [{
        Name: moduleData.title,
        title: moduleData.title,
        description: moduleData.description,
        duration: moduleData.duration,
        videoUrl: moduleData.videoUrl,
        orderIndex: moduleData.orderIndex,
        isDownloadable: moduleData.isDownloadable,
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

// Update a module
export const updateModule = async (moduleId, moduleData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: moduleId,
        Name: moduleData.title,
        title: moduleData.title,
        description: moduleData.description,
        duration: moduleData.duration,
        videoUrl: moduleData.videoUrl,
        orderIndex: moduleData.orderIndex,
        isDownloadable: moduleData.isDownloadable,
        courseId: moduleData.courseId
      }]
    };

    const response = await apperClient.updateRecord("course_module", params);
    return response;
  } catch (error) {
    console.error(`Error updating module with ID ${moduleId}:`, error);
    throw error;
  }
};