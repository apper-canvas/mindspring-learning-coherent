import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { saveCourseProgress } from '../utils/indexedDBUtils';
import { getIcon } from '../utils/iconUtils';
import DownloadManager from './DownloadManager';
import BadgeDisplay from './BadgeDisplay';
import LeaderboardDisplay from './LeaderboardDisplay';
import { checkAndAwardBadge, fetchBadges } from '../store/badgeSlice';

// Icons
const PlayIcon = getIcon('play');
const PauseIcon = getIcon('pause');
const CheckCircleIcon = getIcon('check-circle');
const BarChart2Icon = getIcon('bar-chart-2');
const TrophyIcon = getIcon('trophy');
const ListChecksIcon = getIcon('list-checks');
const DownloadIcon = getIcon('download');
const WifiOffIcon = getIcon('wifi-off');
const ArrowRightIcon = getIcon('arrow-right');
const AwardIcon = getIcon('award');
const UsersIcon = getIcon('users');

// Sample course data
const courseLessons = [
  {
    id: 1,
    title: 'Introduction to JavaScript',
    description: 'Learn the basics of JavaScript programming language',
    duration: '15 minutes',
    videoUrl: '#',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Variables and Data Types',
    description: 'Understanding variables, constants, and data types in JavaScript',
    duration: '22 minutes',
    videoUrl: '#',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Control Flow: Conditionals',
    description: 'Working with if-else statements and switch cases',
    duration: '18 minutes',
    videoUrl: '#',
    isCompleted: false,
  },
  {
    id: 4,
    title: 'Loops and Iterations',
    description: 'Mastering for loops, while loops, and array iterations',
    duration: '20 minutes',
    videoUrl: '#',
    isCompleted: false,
  },
];

const quizQuestions = [
  {
    id: 1,
    question: 'Which of the following is a JavaScript data type?',
    options: ['Protocol', 'Boolean', 'Division', 'Element'],
    correctAnswer: 'Boolean',
  },
  {
    id: 2,
    question: 'Which operator is used for strict equality comparison in JavaScript?',
    options: ['==', '===', '=', '!='],
    correctAnswer: '===',
  },
  {
    id: 3,
    question: 'What does the following code return: typeof []',
    options: ['array', 'object', 'undefined', 'list'],
    correctAnswer: 'object',
  },
];

const MainFeature = () => {
  const dispatch = useDispatch();
  const isOnline = useSelector(state => state.offline.isOnline);
  const badges = useSelector(state => state.badges.badges);
  const [activeTab, setActiveTab] = useState('lessons');
  const [lessons, setLessons] = useState(courseLessons.map(lesson => ({ ...lesson, isDownloaded: false })));
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [offlineMode, setOfflineMode] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResults, setQuizResults] = useState({
    score: 0,
    correctAnswers: 0,
    completed: false,
  });

  // Create a course object for DownloadManager
  const courseData = {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming",
    instructor: "Alex Johnson",
    modules: courseLessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl
    })),
  };

  // Check network status and use appropriate data source
  useEffect(() => {
    setOfflineMode(!isOnline);
    
    // Load badges on component mount
    dispatch(fetchBadges());
    
    // Award first steps badge if this is the user's first visit
    const userState = {
      lessonProgress: 1, // Just starting
      completedLessons: 0,
      courseProgress: 0,
      quizScore: 0,
      quizTotal: 0,
      completedLessonsOffline: 0
    };
    dispatch(checkAndAwardBadge({ badgeType: 'FIRST_STEP', userState, courseId: 1, courseTitle: 'JavaScript Fundamentals' }));
  }, [isOnline]);

  // Calculate overall course progress
  const overallProgress = Math.round((lessons.filter(lesson => lesson.isCompleted).length / lessons.length) * 100);
  
  // Simulate video playback with progress bar
  useEffect(() => {
    let progressInterval;

    if (isPlaying && lessonProgress < 100) {
      progressInterval = setInterval(() => {
        setLessonProgress(prev => {
          const newProgress = prev + 1;
          // When lesson completes
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            // Mark lesson as completed
            completeLessonHandler(currentLessonId);
            return 100;
          }
          return newProgress;
        });
      }, 300); // Faster for demo purposes
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPlaying, lessonProgress, currentLessonId]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Handle lesson selection
  const selectLessonHandler = (lessonId) => {
    setCurrentLessonId(lessonId);
    setLessonProgress(0);
    setIsPlaying(false);
  };

  // Mark lesson as completed and award badges
  const completeLessonHandler = useCallback((lessonId) => {
    setLessons(prev =>
      prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, isCompleted: true } 
          : lesson
      )
    );
    
    // Save progress to IndexedDB for offline access
    const progress = {
      id: `course-1-lesson-${lessonId}`,
      courseId: 1,
      lessonId: lessonId,
      completed: true
    };
    saveCourseProgress(progress);
    toast.success(`Lesson completed! Great job!`);
    
    // Check for badges - first lesson completed
    const completedCount = lessons.filter(lesson => lesson.isCompleted).length + 1; // +1 for the one just completed
    const userState = {
      lessonProgress: 100,
      completedLessons: completedCount,
      courseProgress: Math.round((completedCount / lessons.length) * 100),
      completedLessonsOffline: offlineMode ? 1 : 0
    };
    
    // Award appropriate badges
    dispatch(checkAndAwardBadge({ badgeType: 'FIRST_LESSON', userState, courseId: 1, courseTitle: 'JavaScript Fundamentals' }));
    
    // Check for course progress badges
    if (userState.courseProgress >= 50) {
      dispatch(checkAndAwardBadge({ badgeType: 'HALFWAY', userState, courseId: 1, courseTitle: 'JavaScript Fundamentals' }));
    }
    
    if (userState.courseProgress === 100) {
      dispatch(checkAndAwardBadge({ badgeType: 'COURSE_COMPLETE', userState, courseId: 1, courseTitle: 'JavaScript Fundamentals' }));
    }
  }, [lessons, offlineMode, dispatch]);

  // Start quiz
  const startQuizHandler = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizResults({
      score: 0,
      correctAnswers: 0,
      completed: false,
    });
  };

  // Handle answer selection
  const selectAnswerHandler = (answer) => {
    setSelectedAnswer(answer);
  };

  // Handle next question
  const nextQuestionHandler = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before proceeding");
      return;
    }

    // Check if answer is correct
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Update results
    if (isCorrect) {
      setQuizResults(prev => ({
        ...prev,
        score: prev.score + 1,
        correctAnswers: prev.correctAnswers + 1,
      }));
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      setQuizResults(prev => ({
        ...prev,
        completed: true,
      }));
      toast.success("Quiz completed! Check your results.");
      
      // Check for quiz master badge
      const userState = {
        quizScore: isCorrect ? quizResults.score + 1 : quizResults.score,
        quizTotal: quizQuestions.length
      };
      
      // Award perfect quiz badge if all answers were correct
      if (userState.quizScore === userState.quizTotal) {
        dispatch(checkAndAwardBadge({ badgeType: 'QUIZ_MASTER', userState, courseId: 1, courseTitle: 'JavaScript Fundamentals' }));
      }
      
    }
  };

  // Reset quiz
  const resetQuizHandler = () => {
    setQuizStarted(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
  };

  // Find current lesson details
  const currentLesson = lessons.find(lesson => lesson.id === currentLessonId) || lessons[0];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700 transition-all duration-200">
      {/* Course Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
          alt="JavaScript Programming" 
          className="w-full h-48 object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
          <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-md">JavaScript Fundamentals</h2>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="Instructor" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <span className="ml-2 text-white text-sm">Alex Johnson</span>
            </div>
            <div className="ml-6 flex items-center">
              <div className="w-full bg-white/30 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
              </div>
              <span className="ml-2 text-white text-sm">{overallProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700">
        <button 
          onClick={() => setActiveTab('lessons')} 
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'lessons' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
          }`}
        >
          <ListChecksIcon className="w-4 h-4 mr-2" />
          Lessons
        </button>
        <button 
          onClick={() => setActiveTab('downloads')} 
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'downloads' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
          }`}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Downloads
        </button>
        
        <button 
          onClick={() => setActiveTab('quiz')} 
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'quiz' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
          }`}
        >
          <BarChart2Icon className="w-4 h-4 mr-2" />
          Quiz
        </button>
        <button 
          onClick={() => setActiveTab('leaderboard')} 
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'leaderboard' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
          }`}
        >
          <UsersIcon className="w-4 h-4 mr-2" />
          Leaderboard
        </button>
        
        <button 
          onClick={() => setActiveTab('progress')} 
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'progress' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
          }`}
        >
          <TrophyIcon className="w-4 h-4 mr-2" />
          Progress
        </button>
        <button 
          onClick={() => setActiveTab('badges')} 
          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'badges' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary'
          }`}
        >
          Badges
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Offline Mode Indicator */}
        {offlineMode && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg flex items-center">
            <WifiOffIcon className="w-5 h-5 mr-2" /> You are in offline mode. Your progress will be saved locally and synced when you reconnect.
          </div>
        )}
      
        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lesson List */}
            <div className="md:col-span-1 space-y-3">
              <h3 className="text-lg font-medium mb-4 text-surface-800 dark:text-surface-200">Course Modules</h3>
              
              {lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => selectLessonHandler(lesson.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-center transition-all ${
                    currentLessonId === lesson.id
                      ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary'
                      : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                  aria-label={`Select lesson: ${lesson.title}`}
                  title={lesson.title}
                  disabled={offlineMode && !lesson.isDownloaded}
                >
                  <div className="mr-3">
                    {lesson.isCompleted ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : currentLessonId === lesson.id ? (
                      <PlayIcon className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-surface-400 dark:border-surface-500"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-surface-800 dark:text-surface-200">{lesson.title}</h4>
                    <p className="text-xs text-surface-600 dark:text-surface-400">{lesson.duration}</p>
                    {lesson.isDownloaded && (
                      <span className="text-xs text-green-600 dark:text-green-400">Available offline</span>
                    )}
                  </div>
                </button>
              ))}
              
              {/* Download All Lessons */}
              <div className="mt-4">
                <DownloadManager course={courseData} size="md" />
              </div>
            </div>

            {/* Video Player */}
            <div className="md:col-span-2 flex flex-col">
              <div className="relative bg-surface-900 rounded-lg overflow-hidden h-52 md:h-64 lg:h-80">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Placeholder image */}
                  <img 
                    src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt={currentLesson.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                  
                  {/* Play/Pause button */}
                  <button 
                    onClick={togglePlayPause}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-8 h-8" />
                    ) : (
                      <PlayIcon className="w-8 h-8" />
                    )}
                  </button>
                </div>
                
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-700">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${lessonProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Lesson details */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200">{currentLesson.title}</h3>
                <p className="mt-2 text-surface-600 dark:text-surface-400">{currentLesson.description}</p>
                
                {/* Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={togglePlayPause}
                      className="btn-primary"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    
                    {/* Individual lesson download button */}
                    <div className="ml-2">
                      <DownloadManager 
                        course={courseData} 
                        moduleId={currentLessonId} 
                        size="sm" 
                      />
                    </div>
                    
                    {currentLesson.isCompleted && (
                      <span className="flex items-center text-green-500 text-sm">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    {lessonProgress > 0 ? `${lessonProgress}% complete` : currentLesson.duration}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Manage Offline Content</h3>
              
              <div className="mb-6">
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  Download courses and modules to access them when you're offline. Your progress will be synchronized when you reconnect.
                </p>
                
                {/* Download full course */}
                <div className="bg-white dark:bg-surface-800 p-4 rounded-lg mb-4 border border-surface-200 dark:border-surface-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Full Course</h4>
                    <DownloadManager course={courseData} size="md" />
                  </div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Download the entire course with all lessons and resources</p>
                </div>
                
                {/* Individual modules download */}
                <h4 className="font-medium mb-3 mt-6">Individual Modules</h4>
                <div className="space-y-3">
                  {courseData.modules.map(module => (
                    <div 
                      key={module.id}
                      className="bg-white dark:bg-surface-800 p-4 rounded-lg border border-surface-200 dark:border-surface-700"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-sm">{module.title}</h5>
                          <p className="text-xs text-surface-500 dark:text-surface-400">{module.duration}</p>
                        </div>
                        <DownloadManager 
                          course={courseData}
                          moduleId={module.id}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Storage management */}
              <div className="bg-surface-100 dark:bg-surface-600 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Storage Usage</h4>
                <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <p className="text-sm mt-2 text-surface-600 dark:text-surface-300">87.5 MB used of 250 MB allocated for offline content</p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {!quizStarted ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6"
                >
                  <BarChart2Icon className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">JavaScript Knowledge Check</h3>
                <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-6">
                  Test your understanding of JavaScript fundamentals with this quick quiz. You'll need to answer {quizQuestions.length} questions correctly to pass.
                </p>
                <button 
                  onClick={startQuizHandler}
                  className="btn-primary"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              quizResults.completed ? (
                // Quiz Results
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6 text-center max-w-xl mx-auto"
                >
                  <div className="w-20 h-20 mx-auto bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    <TrophyIcon className="w-10 h-10 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-200 mb-2">Quiz Completed!</h3>
                  
                  <div className="text-4xl font-bold text-primary my-4">
                    {quizResults.score} / {quizQuestions.length}
                  </div>
                  
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    {quizResults.score === quizQuestions.length 
                      ? "Perfect score! You've mastered JavaScript fundamentals." 
                      : quizResults.score >= quizQuestions.length / 2 
                        ? "Good job! You're getting the hang of JavaScript fundamentals." 
                        : "Keep practicing! JavaScript takes time to master."}
                  </p>
                  
                  <button 
                    onClick={resetQuizHandler}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                // Quiz Questions
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </h3>
                    <div className="text-sm text-surface-600 dark:text-surface-400">
                      {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% Complete
                    </div>
                  </div>
                  
                  <div className="w-full bg-surface-200 dark:bg-surface-600 h-1.5 rounded-full mb-8">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xl font-medium text-surface-800 dark:text-surface-200 mb-4">
                      {quizQuestions[currentQuestionIndex].question}
                    </h4>
                    
                    <div className="space-y-3 mt-6">
                      {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => selectAnswerHandler(option)}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === option
                              ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                              : 'border-surface-200 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-600'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              selectedAnswer === option 
                                ? 'border-primary bg-primary/10' 
                                : 'border-surface-400 dark:border-surface-500'
                            }`}>
                              {selectedAnswer === option && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <span className="ml-3">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={nextQuestionHandler}
                      className="btn-primary flex items-center"
                      disabled={selectedAnswer === null}
                    >
                      {currentQuestionIndex === quizQuestions.length - 1 ? 'Submit' : 'Next'}
                      <ArrowRightIcon className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <LeaderboardDisplay courseId={1} courseTitle="JavaScript Fundamentals" />
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200">Course Progress</h3>
                <span className="text-primary font-medium">{overallProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-200 dark:bg-surface-700 rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                ></motion.div>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">
                {overallProgress === 0 
                  ? "Start your learning journey!" 
                  : overallProgress < 50 
                    ? "Keep going, you're making progress!" 
                    : overallProgress < 100 
                      ? "More than halfway there!" 
                      : "Course completed! Great job!"}
              </p>
            </div>

            {/* Lesson Completion */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-surface-800 dark:text-surface-200">Lesson Completion</h3>
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center">
                    <div className="mr-3">
                      {lesson.isCompleted ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-surface-300 dark:border-surface-600"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-surface-800 dark:text-surface-200">{lesson.title}</h4>
                      <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${lesson.isCompleted ? 'bg-green-500' : 'bg-surface-300 dark:bg-surface-600'}`}
                          style={{ width: lesson.isCompleted ? '100%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-sm">
                      {lesson.isCompleted ? 'Completed' : 'Not started'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Cards */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-surface-800 dark:text-surface-200">Your Badges</h3>
            <BadgeDisplay 
              displayMode="grid" 
              limit={6}
              className="mb-4"
            />
          </div>
            <div>
              <h3 className="text-lg font-medium mb-4 text-surface-800 dark:text-surface-200">Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className={`border rounded-xl p-4 text-center transition-all ${
                  overallProgress > 0 
                    ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' 
                    : 'border-surface-200 dark:border-surface-700 opacity-50'
                }`}>
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    overallProgress > 0 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                  }`}>
                    <PlayIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium">First Steps</h4>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">Started your learning journey</p>
                </div>
                
                <div className={`border rounded-xl p-4 text-center transition-all ${
                  overallProgress >= 50 
                    ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' 
                    : 'border-surface-200 dark:border-surface-700 opacity-50'
                }`}>
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    overallProgress >= 50 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                  }`}>
                    <BarChart2Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium">Halfway There</h4>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">Completed 50% of the course</p>
                </div>
                
                <div className={`border rounded-xl p-4 text-center transition-all ${
                  overallProgress === 100 
                    ? 'border-primary/50 bg-primary/5 dark:bg-primary/10' 
                    : 'border-surface-200 dark:border-surface-700 opacity-50'
                }`}>
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    overallProgress === 100 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                  }`}>
                    <TrophyIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium">Course Mastery</h4>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">Completed the entire course</p>
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
          <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Your Badges</h3>
              <div className="text-sm text-surface-600 dark:text-surface-400">
                Total badges: {badges.length}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-4">Recently Earned</h4>
              <BadgeDisplay 
                displayMode="grid"
                limit={4}
                className="mb-6"
              />
            </div>
            
            <div className="border-t border-surface-200 dark:border-surface-700 pt-6">
              <h4 className="font-medium mb-4">All Badges</h4>
              <BadgeDisplay 
                displayMode="grid"
                showDetails={true}
              />
              
              {badges.length === 0 && (
                <p className="text-center py-8 text-surface-500 dark:text-surface-400">
                  Complete lessons and quizzes to earn badges and track your progress!
                </p>
              )}
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;