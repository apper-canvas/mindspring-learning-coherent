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

// Get a single resource by ID
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

// Create a new resource
export const createResource = async (resourceData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Name: resourceData.title,
        title: resourceData.title,
        type: resourceData.type,
        size: resourceData.size,
        url: resourceData.url,
        isDownloaded: resourceData.isDownloaded || false,
        courseId: resourceData.courseId
      }]
    };

    if (resourceData.downloadedAt) {
      params.records[0].downloadedAt = resourceData.downloadedAt;
    }

    const response = await apperClient.createRecord("resource", params);
    return response;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};