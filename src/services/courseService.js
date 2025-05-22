/**
 * Course service for managing courses
 */

// Get all courses with optional filtering
export const getCourses = async (filters = {}) => {
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
        "instructor",
        "category",
        "difficulty",
        "duration",
        "enrollments",
        "rating",
        "imageUrl",
        "Tags"
      ]
    };

    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      params.where = [];

      // Category filter
      if (filters.category && filters.category !== 'all') {
        params.where.push({
          fieldName: "category",
          operator: "ExactMatch",
          values: [filters.category]
        });
      }

      // Difficulty filter
      if (filters.difficulty && filters.difficulty !== 'all') {
        params.where.push({
          fieldName: "difficulty",
          operator: "ExactMatch",
          values: [filters.difficulty]
        });
      }

      // Search term filter across multiple fields
      if (filters.searchTerm) {
        const searchParams = {
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "title",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "description",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "instructor",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            }
          ]
        };
        
        params.whereGroups = [searchParams];
      }
    }

    // Add pagination if provided
    if (filters.limit) {
      params.pagingInfo = {
        limit: filters.limit,
        offset: filters.offset || 0
      };
    }

    // Add sorting if provided
    if (filters.orderBy) {
      params.orderBy = filters.orderBy;
    }

    const response = await apperClient.fetchRecords("course", params);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Get a single course by ID
export const getCourseById = async (courseId) => {
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
        "instructor",
        "category",
        "difficulty",
        "duration",
        "enrollments",
        "rating",
        "imageUrl",
        "Tags"
      ]
    };

    const response = await apperClient.getRecordById("course", courseId, params);
    return response?.data || null;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Name: courseData.title,
        title: courseData.title,
        description: courseData.description,
        instructor: courseData.instructor,
        category: courseData.category,
        difficulty: courseData.difficulty,
        duration: courseData.duration,
        enrollments: courseData.enrollments || 0,
        rating: courseData.rating || 0,
        imageUrl: courseData.imageUrl,
        Tags: courseData.Tags
      }]
    };

    const response = await apperClient.createRecord("course", params);
    return response;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};