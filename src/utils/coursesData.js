export const coursesData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming with hands-on exercises and real-world examples. Perfect for beginners who want to start their web development journey.",
    instructor: "Alex Johnson",
    category: "programming",
    difficulty: "beginner",
    duration: "12 hours",
    enrollments: 5642,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0,
    resources: [
      {
        id: "js-fundamentals-notes-1",
        title: "JavaScript Basics",
        type: "pdf",
        size: 2.4
      },
      {
        id: "js-fundamentals-slides-1",
        title: "Introduction to JavaScript",
        type: "slides",
        size: 3.1
      }
    ]
  },
  {
    id: 2,
    title: "Advanced React & Redux",
    description: "Take your React skills to the next level with advanced patterns, state management with Redux, and performance optimization techniques.",
    instructor: "Sarah Williams",
    category: "programming",
    difficulty: "advanced",
    duration: "18 hours",
    enrollments: 3211,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0,
    resources: [
      {
        id: "react-redux-notes-1",
        title: "Redux State Management",
        type: "pdf",
        size: 4.7
      },
      {
        id: "react-redux-slides-1",
        title: "Advanced React Patterns",
        type: "slides",
        size: 5.2
      },
      {
        id: "react-redux-worksheet-1",
        title: "State Management Exercise",
        type: "worksheet",
        size: 1.3
      }
    ]
  },
  {
    id: 3,
    title: "Python for Data Science",
    description: "Master Python programming for data analysis, visualization, and machine learning. Includes NumPy, Pandas, Matplotlib, and scikit-learn.",
    instructor: "Michael Chen",
    category: "programming",
    difficulty: "intermediate",
    duration: "20 hours",
    enrollments: 7823,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0,
    resources: [
      {
        id: "python-ds-notes-1",
        title: "NumPy and Pandas Foundations",
        type: "pdf",
        size: 6.2
      },
      {
        id: "python-ds-worksheet-1",
        title: "Data Analysis Practice Dataset",
        type: "worksheet",
        size: 3.8
      }
    ]
  },
  {
    id: 4,
    title: "Conversational Spanish",
    description: "Learn practical Spanish phrases and grammar for everyday conversations. Focus on real-world communication skills for travel and business.",
    instructor: "Elena Rodriguez",
    category: "languages",
    difficulty: "beginner",
    duration: "15 hours",
    enrollments: 4231,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1596523351117-3be2293a2e41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 5,
    title: "Calculus I: Limits and Derivatives",
    description: "A comprehensive introduction to differential calculus, covering limits, continuity, and derivatives with applications to real-world problems.",
    instructor: "Dr. Robert Thompson",
    category: "math",
    difficulty: "intermediate",
    duration: "16 hours",
    enrollments: 3542,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 6,
    title: "Modern Physics: Quantum Mechanics",
    description: "Explore the fascinating world of quantum mechanics, including wave-particle duality, the uncertainty principle, and quantum entanglement.",
    instructor: "Dr. Emily Chang",
    category: "science",
    difficulty: "advanced",
    duration: "22 hours",
    enrollments: 2187,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 7,
    title: "Creative Writing Workshop",
    description: "Develop your storytelling skills through guided exercises, peer feedback, and analysis of literary techniques from published works.",
    instructor: "James Morrison",
    category: "literature",
    difficulty: "intermediate",
    duration: "10 hours",
    enrollments: 3128,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 8,
    title: "Cognitive Behavioral Therapy Basics",
    description: "Learn the fundamental principles and techniques of Cognitive Behavioral Therapy (CBT) and how to apply them for personal growth and well-being.",
    instructor: "Dr. Sophia Martinez",
    category: "psychology",
    difficulty: "beginner",
    duration: "8 hours",
    enrollments: 5932,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 9,
    title: "Effective Teaching Strategies",
    description: "Explore research-based teaching methods to increase student engagement, improve learning outcomes, and create an inclusive classroom environment.",
    instructor: "Dr. William Baker",
    category: "education",
    difficulty: "intermediate",
    duration: "14 hours",
    enrollments: 4127,
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 10,
    title: "Piano for Beginners",
    description: "Start your musical journey with this comprehensive piano course. Learn music theory, proper technique, and play popular songs from day one.",
    instructor: "Michelle Lee",
    category: "music",
    difficulty: "beginner",
    duration: "16 hours",
    enrollments: 6421,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 11,
    title: "UI/UX Design Principles",
    description: "Master the fundamentals of user interface and user experience design. Learn design thinking, wireframing, prototyping, and usability testing.",
    instructor: "David Wilson",
    category: "design",
    difficulty: "intermediate",
    duration: "18 hours",
    enrollments: 5128,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  },
  {
    id: 12,
    title: "Node.js Backend Development",
    description: "Build scalable and secure server-side applications with Node.js. Includes Express.js, MongoDB integration, authentication, and API development.",
    instructor: "Thomas Jackson",
    category: "programming",
    difficulty: "advanced",
    duration: "20 hours",
    enrollments: 3687,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    progress: 0
  }
];