import { useState, useRef, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { Menu, X, Moon, Sun, ChevronDown, Sparkles, Home, BookOpen, Compass, Award, MessageSquare, LogOut, Settings, User, Users as UsersIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';

const MenuIcon = getIcon('menu');
const XIcon = getIcon('x');
const SunIcon = getIcon('sun');
const MoonIcon = getIcon('moon');
const BookOpenIcon = getIcon('book-open');
const ChevronDownIcon = getIcon('chevron-down');
const AwardIcon = getIcon('award');
const WifiOffIcon = getIcon('wifi-off');
const UserIcon = getIcon('user');
const LogOutIcon = getIcon('log-out');
const SettingsIcon = getIcon('settings');

const Header = ({ darkMode, toggleDarkMode, isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const userState = useSelector((state) => state.user);
  const isOnline = true; // Default to true, replace with actual online status if available
  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  // Menu animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-surface-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/logo.svg" 
            alt="MindSpring Logo" 
            className="h-8 w-auto" 
          />
          <span className="font-bold text-xl text-surface-900 dark:text-white">MindSpring</span>
          </Link>


        {/* Mobile menu button */}
        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon className="w-6 h-6 text-surface-900 dark:text-white" />
        </button>

        {/* Navigation */}
        <nav className="hidden lg:flex space-x-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/courses" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            Courses
          </NavLink>
          <NavLink 
            to="/explore" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            Explore
          </NavLink>
          <NavLink 
            to="/community" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            Community
          </NavLink>
        </nav>

        {/* User actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/badges" 
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                Badges
              </NavLink>

              <div className="relative group">
                <button className="flex items-center space-x-2 py-2 px-3 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {userState?.user?.firstName?.charAt(0) || userState?.user?.emailAddress?.charAt(0) || 'U'}
                  </div>
                  <span className="text-surface-800 dark:text-surface-200">
                    {userState?.user?.firstName || userState?.user?.emailAddress?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDownIcon className="w-4 h-4 text-surface-500" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 translate-y-0 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 origin-top-right">
                  <div className="py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center">
                      <BookOpenIcon className="w-4 h-4 mr-2" />
                      My Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <span className="flex items-center">
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Log Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white px-3 py-2 transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-surface-600" />}
          </button>

          {!isOnline && (
            <div className="text-yellow-600 dark:text-yellow-400 flex items-center text-sm">
              <WifiOffIcon className="w-4 h-4 mr-1" /> Offline
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 bg-white dark:bg-surface-800 shadow-lg z-30 lg:hidden"
            >
              <div className="container mx-auto px-4 py-3">
                <nav className="flex flex-col space-y-1">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                    end
                  >
                    Home
                  </NavLink>
                  <NavLink 
                    to="/courses" 
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Courses
                  </NavLink>
                  <NavLink 
                    to="/explore" 
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Explore
                  </NavLink>
                  <NavLink 
                    to="/community" 
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Community
                  </NavLink>
                  {isAuthenticated ? (
                    <>
                      <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </NavLink>
                      <NavLink 
                        to="/badges" 
                        className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Badges
                      </NavLink>
                        <NavLink 
                          to="/profile" 
                          className={({ isActive }) => `mobile-nav-link ${isActive ? 'text-primary' : ''}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile Settings
                        </NavLink>
                      <button 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="mobile-nav-link text-left text-red-600 dark:text-red-400"
                      >
                        <span className="flex items-center">
                          <LogOutIcon className="w-4 h-4 mr-2" />
                          Log Out
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink 
                        to="/login" 
                        className="mobile-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log In
                      </NavLink>
                      <NavLink 
                        to="/signup" 
                        className="mobile-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                  <div className="pt-2 pb-1 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-600 dark:text-surface-400">Dark Mode</span>
                      <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      >
                        {darkMode ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-surface-600" />}
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </header>
  );
};

export default Header;