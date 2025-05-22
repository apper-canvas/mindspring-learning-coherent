/**
 * Resource service for managing course resources
 */

// Get all resources for a course
export const getResourcesByCourseId = async (courseId) => {
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
        "type",
        "size",
        "url",
        "downloadedAt",
        "isDownloaded",
        "courseId"
      ],
      where: [
        {
          fieldName: "courseId",
          operator: "ExactMatch",
          values: [courseId]
        }
      ]
    };

    const response = await apperClient.fetchRecords("resource", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching resources for course ${courseId}:`, error);
    throw error;
  }
};

// Create a new resource
export const createResource = async (resourceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: resourceData.title,
        title: resourceData.title,
        type: resourceData.type,
        size: resourceData.size,
        url: resourceData.url,
        isDownloaded: false,
        courseId: resourceData.courseId
      }]
    };

    const response = await apperClient.createRecord("resource", params);
    return response;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};

// Mark resource as downloaded
export const markResourceAsDownloaded = async (resourceId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: resourceId,
        isDownloaded: true,
        downloadedAt: new Date().toISOString()
      }]
    };

    const response = await apperClient.updateRecord("resource", params);
    return response;
  } catch (error) {
    console.error(`Error marking resource ${resourceId} as downloaded:`, error);
    throw error;
  }
};

// Get a resource by ID
export const getResourceById = async (resourceId) => {
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
        "type",
        "size",
        "url",
        "downloadedAt",
        "isDownloaded",
        "courseId"
      ]
    };

    const response = await apperClient.getRecordById("resource", resourceId, params);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching resource with ID ${resourceId}:`, error);
    throw error;
  }
};