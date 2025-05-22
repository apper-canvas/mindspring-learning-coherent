// Sample data for the community page

export const discussionPosts = [
  {
    id: 'post-1',
    title: 'How to approach the dynamic programming exercises in Python course?',
    content: "I'm currently working through the advanced Python course and finding the dynamic programming exercises quite challenging. I understand the concepts theoretically, but struggle to apply them to solve problems. Does anyone have tips or resources that helped them master this topic? I've been reviewing the course materials but would appreciate some additional explanations or examples.",
    created: '2023-05-15T14:30:00Z',
    category: 'questions',
    author: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
      role: 'Student'
    },
    likes: 24,
    comments: [
      {
        id: 'comment-1',
        content: "I found that visualizing the problem using state diagrams helped me a lot. Try drawing out the state transitions before coding.",
        author: {
          id: 'user-2',
          name: 'Maya Patel',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
        },
        created: '2023-05-15T15:10:00Z',
        likes: 8
      },
      {
        id: 'comment-2',
        content: "Check out the algorithm visualization tools on the resources page. They really helped me understand how DP algorithms work step-by-step.",
        author: {
          id: 'user-3',
          name: 'James Wilson',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
        },
        created: '2023-05-15T16:45:00Z',
        likes: 5
      }
    ],
    shares: 3,
    isLiked: false
  },
  {
    id: 'post-2',
    title: 'Starting a study group for the Web Development Bootcamp',
    content: "Hi everyone! I'm planning to start a study group for the 12-week Web Development Bootcamp that begins next month. We'll meet virtually twice a week to work through assignments, share resources, and help each other with challenging concepts. Looking for 5-8 committed participants who want to learn together and hold each other accountable. We'll be focusing on the MERN stack (MongoDB, Express, React, Node.js). Comment below if you're interested or have questions!",
    created: '2023-05-14T09:15:00Z',
    category: 'study-groups',
    author: {
      id: 'user-4',
      name: 'Sophie Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
      role: 'Mentor'
    },
    likes: 42,
    comments: [
      {
        id: 'comment-3',
        content: "I'd love to join! I've been trying to learn React on my own but think a study group would help me stay motivated.",
        author: {
          id: 'user-5',
          name: 'David Kim',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
        },
        created: '2023-05-14T10:22:00Z',
        likes: 3
      },
      {
        id: 'comment-4',
        content: "Count me in! What timezone are you planning to meet in?",
        author: {
          id: 'user-6',
          name: 'Emma Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
        },
        created: '2023-05-14T11:05:00Z',
        likes: 2
      }
    ],
    shares: 15,
    isLiked: true
  },
  {
    id: 'post-3',
    title: 'Comprehensive list of machine learning resources for beginners',
    content: "After completing the Introduction to Machine Learning course, I compiled a list of free resources that I found helpful for deepening my understanding. These include YouTube channels, free eBooks, research papers, and open datasets for practice projects. I hope this helps others who are just starting their ML journey!\n\n1. StatQuest with Josh Starmer (YouTube) - Excellent explanations of statistical concepts\n2. 'Hands-On Machine Learning with Scikit-Learn & TensorFlow' - Good for practical applications\n3. Kaggle Learn - Interactive tutorials and notebooks\n4. Fast.ai - Practical deep learning for coders\n5. ML Crash Course by Google - Comprehensive and beginner-friendly",
    created: '2023-05-12T16:40:00Z',
    category: 'resources',
    author: {
      id: 'user-7',
      name: 'Daniel Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
      role: 'Advanced Student'
    },
    likes: 78,
    comments: [
      {
        id: 'comment-5',
        content: "This is amazing! Would you mind if I add this to my bookmarks and share with my study group?",
        author: {
          id: 'user-8',
          name: 'Olivia Williams',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
        },
        created: '2023-05-12T17:30:00Z',
        likes: 10
      }
    ],
    shares: 32,
    isLiked: false
  }
];

export const trendingTopics = [
  {
    id: 'topic-1',
    title: 'React Hooks Best Practices',
    postCount: 24
  },
  {
    id: 'topic-2',
    title: 'Python for Data Science',
    postCount: 18
  },
  {
    id: 'topic-3',
    title: 'JavaScript ES6+ Features',
    postCount: 15
  },
  {
    id: 'topic-4',
    title: 'AWS Certification Tips',
    postCount: 12
  },
  {
    id: 'topic-5',
    title: 'Mobile App Development',
    postCount: 10
  }
];