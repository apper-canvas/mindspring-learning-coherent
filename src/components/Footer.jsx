import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const FacebookIcon = getIcon('facebook');
const TwitterIcon = getIcon('twitter');
const InstagramIcon = getIcon('instagram');
const YoutubeIcon = getIcon('youtube');
const MailIcon = getIcon('mail');

const Footer = () => {
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
            <p className="mt-4 text-surface-600 dark:text-surface-400">
              Empowering learners with interactive courses, expert guidance, and a supportive community.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-surface-500 hover:text-primary transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-surface-500 hover:text-primary transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-surface-500 hover:text-primary transition-colors">
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
                <Link to="/courses" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/popular" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Popular Courses
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Instructors
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-base font-semibold mb-4 text-surface-900 dark:text-white">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Community Forums
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">
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
            <p className="text-surface-600 dark:text-surface-400 mt-4">
              Subscribe to our newsletter for updates
            </p>
            <div className="mt-2 flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary" 
              />
              <button 
                className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark transition-colors"
              >
                Subscribe
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
      </div>
    </footer>
  );
};

export default Footer;