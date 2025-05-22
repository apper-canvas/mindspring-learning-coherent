import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';

const FacebookIcon = getIcon('facebook');
const TwitterIcon = getIcon('twitter');
const InstagramIcon = getIcon('instagram');
const YoutubeIcon = getIcon('youtube');
const MailIcon = getIcon('mail');
const GlobeIcon = getIcon('globe');
const ArrowRightIcon = getIcon('arrow-right');
const CheckIcon = getIcon('check');
const AlertCircleIcon = getIcon('alert-circle');
const SmartphoneIcon = getIcon('smartphone');
const AppleIcon = getIcon('apple');
const AndroidIcon = getIcon('android');

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindSpring
            </Link>
            <p className="mt-4 text-surface-600 dark:text-surface-400 text-sm">
              Empowering learners with interactive courses, expert guidance, and a supportive community.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="text-surface-500 hover:text-primary transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="text-surface-500 hover:text-primary transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-surface-500 hover:text-primary transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a> 
              <a href="#" className="text-surface-500 hover:text-primary transition-colors">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-base font-semibold mb-4 text-surface-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/popular" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Popular Courses
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Instructors
                </Link>
              </li>
              <li>
                <Link to="/badges" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Badges & Achievements
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-base font-semibold mb-4 text-surface-900 dark:text-white">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Community Forums
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  FAQs
                </Link> 
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-base font-semibold mb-4 text-surface-900 dark:text-white">Contact Us</h4>
            <p className="flex items-center text-surface-600 dark:text-surface-400 mb-2">
              <MailIcon className="w-5 h-5 mr-2 text-primary" />
              support@mindspring.edu
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <SmartphoneIcon className="w-5 h-5 text-primary" />
              <span className="text-sm text-surface-600 dark:text-surface-400">Download our app:</span>
            </div>
            <div className="mt-2 flex space-x-3">
              <a 
                href="#" 
                className="flex items-center space-x-1 text-xs text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors"
                aria-label="Download on App Store"
              >
                <AppleIcon className="w-4 h-4" />
                <span>App Store</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-1 text-xs text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors"
                aria-label="Download on Google Play"
              >
                <AndroidIcon className="w-4 h-4" />
                <span>Google Play</span>
              </a>
            </div>
            <p className="text-surface-600 dark:text-surface-400 text-sm mt-6">
              Subscribe to our newsletter for updates
            </p>
            <div className="mt-2 flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-full" 
                aria-label="Email for newsletter"
              />
              <button 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
                disabled={isLoading}
                onClick={() => {
                  if (!email || !email.includes('@')) {
                    toast.error('Please enter a valid email address');
                    return;
                  }
                  
                  setIsLoading(true);
                  
                  // Simulate API call
                  setTimeout(() => {
                    setIsLoading(false);
                    setEmail('');
                    toast.success('Successfully subscribed to newsletter!');
                  }, 1000);
                }}
                aria-label="Subscribe to newsletter"
              >
                {isLoading ? (
                  <span className="animate-pulse">Subscribing...</span>
                ) : (
                  <>
                    Subscribe
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div> 
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-surface-500 dark:text-surface-400 text-sm">
            &copy; {currentYear} MindSpring Education. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-sm text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-700 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/about" className="text-xs text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/careers" className="text-xs text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              Careers
            </Link>
            <Link to="/press" className="text-xs text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              Press
            </Link>
            <Link to="/partners" className="text-xs text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
              Partners
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="relative inline-block text-left">
              <button
                className="inline-flex items-center justify-center text-xs text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors"
                aria-label="Select language"
              >
                <GlobeIcon className="w-4 h-4 mr-1" />
                <span>English (US)</span>
              </button>
              
              {/* Language dropdown would be implemented here with proper states */}
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;