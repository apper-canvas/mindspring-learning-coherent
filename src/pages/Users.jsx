import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users as UsersIcon, ArrowUpDown, Clock, Trophy, UserCheck, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchUsers } from '../services/userService';
import { formatDistanceToNow } from 'date-fns';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('lastActive');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers({
          searchTerm,
          sortField,
          sortDirection,
          page: currentPage,
          pageSize
        });
        
        setUsers(response.data || []);
        setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
        setError(null);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users. Please try again later.');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [searchTerm, sortField, sortDirection, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already triggered by the useEffect when searchTerm changes
    setCurrentPage(1);
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 inline-block">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold flex items-center">
            <UsersIcon className="mr-2" size={24} />
            Learning Community
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Connect with other learners in our community
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pr-10"
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400">
            <Search size={18} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 p-4 rounded-lg my-4">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('fullName')} 
                      className="flex items-center font-medium text-surface-700 dark:text-surface-300"
                    >
                      <UserCheck size={16} className="mr-1" />
                      Name {getSortIcon('fullName')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('email')} 
                      className="flex items-center font-medium text-surface-700 dark:text-surface-300"
                    >
                      <Mail size={16} className="mr-1" />
                      Email {getSortIcon('email')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('streak')} 
                      className="flex items-center font-medium text-surface-700 dark:text-surface-300"
                    >
                      <Trophy size={16} className="mr-1" />
                      Streak {getSortIcon('streak')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('lastActive')} 
                      className="flex items-center font-medium text-surface-700 dark:text-surface-300"
                    >
                      <Clock size={16} className="mr-1" />
                      Last Active {getSortIcon('lastActive')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr 
                      key={user.Id} 
                      className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer"
                      onClick={() => handleViewProfile(user.Id)}
                    >
                      <td className="px-4 py-3 flex items-center">
                        <div className="w-8 h-8 mr-3 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullName || user.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-medium">{(user.fullName?.[0] || user.username?.[0] || '?').toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.fullName || user.username || 'Unknown User'}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">@{user.username || 'user'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{user.email || 'No email'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          {user.streak || 0} days
                        </span>
                      </td>
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-400">
                        {user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : 'Never'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-surface-500 dark:text-surface-400">
                      No users found. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-ghost disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-ghost disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Users;