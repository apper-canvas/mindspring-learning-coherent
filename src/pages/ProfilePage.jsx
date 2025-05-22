import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getCurrentUserProfile, updateBasicProfile, updateProfilePicture, updateInterests, getUserPreferences } from '../services/profileService';
import { fetchUserProfile } from '../store/userSlice';
import { getIcon } from '../utils/iconUtils';

const UserIcon = getIcon('user');
const MailIcon = getIcon('mail');
const AtSignIcon = getIcon('at-sign');
const BookIcon = getIcon('book');
const SaveIcon = getIcon('save');
const ImageIcon = getIcon('image');
const TagIcon = getIcon('tag');
const EditIcon = getIcon('edit-2');
const LoaderIcon = getIcon('loader');

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    avatar: '',
  });
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Default avatar if none exists
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces&auto=format&q=80';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setProfileData({
            fullName: profile.fullName || '',
            username: profile.username || '',
            email: profile.email || '',
            avatar: profile.avatar || defaultAvatar,
          });

          // Parse interests from preferences
          const preferences = getUserPreferences(profile);
          setInterests(preferences.interests || []);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!profileData.username) {
      newErrors.username = 'Username is required';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await updateBasicProfile(profileData);
      toast.success('Profile updated successfully');
      // Refresh user data in Redux store
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload the file to a storage service
    // For this example, we'll simulate it with a timeout
    setIsSaving(true);
    
    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a fake URL - in a real app this would be the uploaded file URL
      const fakeUploadedUrl = URL.createObjectURL(file);
      
      // Update profile with new avatar
      await updateProfilePicture(fakeUploadedUrl);
      
      setProfileData(prev => ({
        ...prev,
        avatar: fakeUploadedUrl
      }));
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsSaving(false);
    }
  };

  const addInterest = async () => {
    if (!newInterest.trim()) return;
    
    const updatedInterests = [...interests, newInterest.trim()];
    setIsSaving(true);
    
    try {
      await updateInterests(updatedInterests);
      setInterests(updatedInterests);
      setNewInterest('');
      toast.success('Interests updated successfully');
    } catch (error) {
      console.error('Error updating interests:', error);
      toast.error('Failed to update interests');
    } finally {
      setIsSaving(false);
    }
  };

  const removeInterest = async (index) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    setIsSaving(true);
    
    try {
      await updateInterests(updatedInterests);
      setInterests(updatedInterests);
      toast.success('Interest removed successfully');
    } catch (error) {
      console.error('Error removing interest:', error);
      toast.error('Failed to remove interest');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="mb-6 flex space-x-2 border-b border-surface-200 dark:border-surface-700">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'interests' ? 'text-primary border-b-2 border-primary' : 'text-surface-600 dark:text-surface-400'}`}
            onClick={() => setActiveTab('interests')}
          >
            Interests
          </button>
        </div>
        
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img 
                  src={profileData.avatar || defaultAvatar} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                    disabled={isSaving}
                  />
                  <EditIcon className="w-4 h-4" />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profileData.fullName || 'Your Name'}</h2>
                <p className="text-surface-600 dark:text-surface-400">{profileData.username ? `@${profileData.username}` : 'username'}</p>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="input-group">
                  <label htmlFor="fullName" className="input-label flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" /> Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="input"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && <p className="input-error">{errors.fullName}</p>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="username" className="input-label flex items-center">
                    <AtSignIcon className="w-4 h-4 mr-2" /> Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="input"
                    value={profileData.username}
                    onChange={handleInputChange}
                  />
                  {errors.username && <p className="input-error">{errors.username}</p>}
                </div>
                
                <div className="input-group md:col-span-2">
                  <label htmlFor="email" className="input-label flex items-center">
                    <MailIcon className="w-4 h-4 mr-2" /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="input-error">{errors.email}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit" 
                  className="btn-primary flex items-center" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>Saving <LoaderIcon className="ml-2 w-4 h-4 animate-spin" /></>
                  ) : (
                    <>Save Changes <SaveIcon className="ml-2 w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'interests' && (
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookIcon className="w-5 h-5 mr-2" /> Learning Interests
            </h2>
            
            <div className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="input flex-grow"
                  placeholder="Add a new interest (e.g., Programming, Spanish, Mathematics)"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  disabled={isSaving}
                />
                <button 
                  onClick={addInterest} 
                  className="btn-primary" 
                  disabled={!newInterest.trim() || isSaving}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {interests.length === 0 ? (
                <p className="text-surface-500 dark:text-surface-400 italic">
                  No interests added yet. Add some to personalize your learning experience.
                </p>
              ) : (
                interests.map((interest, index) => (
                  <div 
                    key={index} 
                    className="bg-surface-100 dark:bg-surface-700 rounded-full px-3 py-1 flex items-center"
                  >
                    <TagIcon className="w-3 h-3 mr-1 text-primary" />
                    <span className="text-sm">{interest}</span>
                    <button 
                      onClick={() => removeInterest(index)} 
                      className="ml-2 text-surface-500 hover:text-red-500"
                      disabled={isSaving}
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;