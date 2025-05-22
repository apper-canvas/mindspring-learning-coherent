/**
 * Profile service for managing user profile data
 */
import { getUserProfile, updateUserProfile, updateUserPreferences } from './userService';

// Get current user's profile data
export const getCurrentUserProfile = async () => {
  try {
    return await getUserProfile();
  } catch (error) {
    console.error("Error getting current user profile:", error);
    throw error;
  }
};

// Update user's basic profile information
export const updateBasicProfile = async (userData) => {
  try {
    const currentProfile = await getCurrentUserProfile();
    if (!currentProfile) throw new Error("User profile not found");

    const updatedData = {
      Id: currentProfile.Id,
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
    };

    return await updateUserProfile(updatedData);
  } catch (error) {
    console.error("Error updating basic profile:", error);
    throw error;
  }
};

// Update user's avatar
export const updateProfilePicture = async (avatarUrl) => {
  try {
    const currentProfile = await getCurrentUserProfile();
    if (!currentProfile) throw new Error("User profile not found");

    return await updateUserProfile({
      Id: currentProfile.Id,
      avatar: avatarUrl
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

// Update user's interests and preferences
export const updateInterests = async (interests) => {
  try {
    const currentProfile = await getCurrentUserProfile();
    if (!currentProfile) throw new Error("User profile not found");

    return await updateUserPreferences(currentProfile.Id, { interests });
  } catch (error) {
    console.error("Error updating interests:", error);
    throw error;
  }
};

// Parse user preferences
export const getUserPreferences = (user) => {
  if (!user || !user.preferences) return {};
  
  try {
    if (typeof user.preferences === 'string') {
      return JSON.parse(user.preferences);
    }
    return user.preferences;
  } catch (error) {
    console.error("Error parsing user preferences:", error);
    return {};
  }
};