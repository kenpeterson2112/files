/**
 * EdTech Skills Assessment Data
 * Contains skill categories, levels, recommendations, and activities
 */

const SKILL_LEVELS = [
    {
        id: 1,
        name: "Exploring",
        icon: "🌱",
        description: "Just starting"
    },
    {
        id: 2,
        name: "Developing",
        icon: "📈",
        description: "Building skills"
    },
    {
        id: 3,
        name: "Applying",
        icon: "⚡",
        description: "Using regularly"
    },
    {
        id: 4,
        name: "Leading",
        icon: "🌟",
        description: "Can teach others"
    }
];

const SKILL_CATEGORIES = [
    {
        id: "lms",
        icon: "📚",
        title: "Learning Management Systems",
        description: "How comfortable are you using platforms like Google Classroom, Canvas, Schoology, or Moodle to organize courses, share materials, and track student progress?",
        skills: [
            {
                id: "lms-organize",
                name: "Course Organization",
                example: "e.g., Creating modules, uploading resources, organizing units"
            },
            {
                id: "lms-assignments",
                name: "Assignment Management",
                example: "e.g., Creating assignments, setting due dates, managing submissions"
            },
            {
                id: "lms-gradebook",
                name: "Gradebook & Analytics",
                example: "e.g., Recording grades, tracking progress, generating reports"
            }
        ]
    },
    {
        id: "multimedia",
        icon: "🎬",
        title: "Video & Multimedia Creation",
        description: "How skilled are you at creating and using video content, screencasts, and multimedia resources for teaching?",
        skills: [
            {
                id: "video-record",
                name: "Recording & Screencasting",
                example: "e.g., Loom, Screencastify, OBS, or device recording"
            },
            {
                id: "video-edit",
                name: "Basic Video Editing",
                example: "e.g., Trimming, adding text, combining clips"
            },
            {
                id: "video-interactive",
                name: "Interactive Video",
                example: "e.g., Edpuzzle, PlayPosit, adding questions to videos"
            }
        ]
    },
    {
        id: "engagement",
        icon: "🎯",
        title: "Student Engagement Tools",
        description: "How proficient are you with digital tools that increase student participation and make learning more interactive?",
        skills: [
            {
                id: "engage-poll",
                name: "Polling & Quick Checks",
                example: "e.g., Mentimeter, Poll Everywhere, Slido"
            },
            {
                id: "engage-game",
                name: "Gamification Tools",
                example: "e.g., Kahoot, Quizizz, Gimkit, Blooket"
            },
            {
                id: "engage-collab",
                name: "Collaboration Platforms",
                example: "e.g., Padlet, Jamboard, Miro, shared docs"
            }
        ]
    },
    {
        id: "assessment",
        icon: "📊",
        title: "Assessment & Feedback",
        description: "How comfortable are you using digital tools to assess student learning and provide meaningful feedback?",
        skills: [
            {
                id: "assess-create",
                name: "Creating Digital Assessments",
                example: "e.g., Google Forms, Microsoft Forms, Formative"
            },
            {
                id: "assess-feedback",
                name: "Digital Feedback Tools",
                example: "e.g., Audio/video feedback, rubrics, comment banks"
            },
            {
                id: "assess-data",
                name: "Data-Driven Decisions",
                example: "e.g., Analyzing results, identifying gaps, adjusting instruction"
            }
        ]
    },
    {
        id: "accessibility",
        icon: "♿",
        title: "Digital Accessibility",
        description: "How familiar are you with making digital content accessible to all learners, including those with disabilities?",
        skills: [
            {
                id: "access-design",
                name: "Universal Design Principles",
                example: "e.g., Clear fonts, color contrast, multiple formats"
            },
            {
                id: "access-tools",
                name: "Assistive Technology Awareness",
                example: "e.g., Screen readers, text-to-speech, captions"
            },
            {
                id: "access-content",
                name: "Creating Accessible Content",
                example: "e.g., Alt text, heading structure, accessible PDFs"
            }
        ]
    },
    {
        id: "ai",
        icon: "🤖",
        title: "AI & Emerging Technologies",
        description: "How prepared are you to understand, evaluate, and thoughtfully integrate AI and emerging technologies in education?",
        skills: [
            {
                id: "ai-literacy",
                name: "AI Literacy & Understanding",
                example: "e.g., How AI works, capabilities and limitations"
            },
            {
                id: "ai-tools",
                name: "AI-Powered Teaching Tools",
                example: "e.g., ChatGPT, AI tutors, automated feedback tools"
            },
            {
                id: "ai-ethics",
                name: "Digital Ethics & Critical Thinking",
                example: "e.g., Teaching responsible AI use, detecting AI content"
            }
        ]
    }
];

const RECOMMENDATIONS = {
    lms: {
        1: {
            title: "LMS Basics Bootcamp",
            description: "Start with your school's official LMS tutorials. Focus on uploading one resource and creating one assignment this week.",
            tag: "Quick Win",
            tryIt: {
                title: "Upload & Share Challenge",
                description: "Upload one PDF or link to your LMS and share it with your class. Just one!",
                difficulty: "5 minutes",
                icon: "📤"
            }
        },
        2: {
            title: "Level Up Your LMS",
            description: "Explore the announcement and calendar features. Try scheduling content to release automatically.",
            tag: "Build Consistency",
            tryIt: {
                title: "Schedule Ahead",
                description: "Schedule one assignment or announcement to post automatically next week.",
                difficulty: "10 minutes",
                icon: "📅"
            }
        },
        3: {
            title: "Analytics Deep Dive",
            description: "Use your LMS analytics to identify students who might need support. Set up a weekly check-in routine.",
            tag: "Data-Informed",
            tryIt: {
                title: "Student Progress Check",
                description: "Review completion rates for your last unit and reach out to 2 students who may need help.",
                difficulty: "15 minutes",
                icon: "📈"
            }
        },
        4: {
            title: "Become a Mentor",
            description: "Share your expertise! Consider leading a brief PD session or creating a tip sheet for colleagues.",
            tag: "Leadership",
            tryIt: {
                title: "Share Your Top 3",
                description: "Write down your 3 best LMS tips and share them with a colleague who's still learning.",
                difficulty: "10 minutes",
                icon: "🎁"
            }
        }
    },
    multimedia: {
        1: {
            title: "Start with Screencasting",
            description: "Install Loom or Screencastify (free versions available) and record a 2-minute welcome video for students.",
            tag: "First Steps",
            tryIt: {
                title: "60-Second Screencast",
                description: "Record yourself explaining one concept from your next lesson. Keep it under 60 seconds!",
                difficulty: "5 minutes",
                icon: "🎥"
            }
        },
        2: {
            title: "Polish Your Videos",
            description: "Learn to trim the beginning and end of videos to remove awkward starts and stops.",
            tag: "Refine Skills",
            tryIt: {
                title: "Edit & Trim",
                description: "Take an existing video and trim it down. Most tools have simple trim features built in.",
                difficulty: "10 minutes",
                icon: "✂️"
            }
        },
        3: {
            title: "Make Videos Interactive",
            description: "Try Edpuzzle to add comprehension questions to any video—yours or from YouTube.",
            tag: "Engagement Boost",
            tryIt: {
                title: "Add 3 Questions",
                description: "Take a short YouTube video and add 3 comprehension questions using Edpuzzle.",
                difficulty: "15 minutes",
                icon: "❓"
            }
        },
        4: {
            title: "Build a Video Library",
            description: "Organize your best videos into a resource library and share with your department.",
            tag: "Scale Impact",
            tryIt: {
                title: "Curate & Share",
                description: "Create a shared folder with your top 5 instructional videos for colleagues to use.",
                difficulty: "20 minutes",
                icon: "📁"
            }
        }
    },
    engagement: {
        1: {
            title: "One Tool, One Week",
            description: "Pick ONE engagement tool (Kahoot is great for beginners) and commit to using it once this week.",
            tag: "Start Simple",
            tryIt: {
                title: "5-Question Kahoot",
                description: "Create a 5-question Kahoot review game for your next unit. Templates make it easy!",
                difficulty: "15 minutes",
                icon: "🎮"
            }
        },
        2: {
            title: "Expand Your Toolkit",
            description: "Try a new engagement tool that serves a different purpose (e.g., if you use Kahoot, try Padlet for collaboration).",
            tag: "Diversify",
            tryIt: {
                title: "Collaborative Board",
                description: "Create a Padlet and have students contribute one idea or question about a topic.",
                difficulty: "10 minutes",
                icon: "📌"
            }
        },
        3: {
            title: "Routine Integration",
            description: "Build engagement tools into your weekly routines—entry tickets, exit tickets, or collaborative note-taking.",
            tag: "Systematize",
            tryIt: {
                title: "Weekly Ritual",
                description: "Establish one recurring use of an engagement tool (e.g., 'Feedback Friday' with Mentimeter).",
                difficulty: "Planning time",
                icon: "🔄"
            }
        },
        4: {
            title: "Innovation Showcase",
            description: "Model creative uses of engagement tools for peers and help them adapt activities for their contexts.",
            tag: "Inspire Others",
            tryIt: {
                title: "Demo Lesson",
                description: "Invite a colleague to observe a lesson where you use engagement tools effectively.",
                difficulty: "One class period",
                icon: "👀"
            }
        }
    },
    assessment: {
        1: {
            title: "Digital Quiz Basics",
            description: "Create your first Google Form quiz with automatic grading. Start with 5-10 multiple choice questions.",
            tag: "Automate Basics",
            tryIt: {
                title: "Self-Grading Quiz",
                description: "Create a 5-question Google Form with answer key. Watch the magic of auto-grading!",
                difficulty: "15 minutes",
                icon: "✅"
            }
        },
        2: {
            title: "Feedback Efficiency",
            description: "Set up comment banks or audio feedback to give richer feedback in less time.",
            tag: "Work Smarter",
            tryIt: {
                title: "Audio Feedback",
                description: "Try giving audio feedback on 3 student assignments instead of written comments.",
                difficulty: "15 minutes",
                icon: "🎙️"
            }
        },
        3: {
            title: "Formative Assessment Flow",
            description: "Use real-time formative assessment tools to adjust instruction on the fly.",
            tag: "Responsive Teaching",
            tryIt: {
                title: "Live Check-In",
                description: "Use a quick digital poll mid-lesson to gauge understanding and adjust your teaching.",
                difficulty: "5 minutes in class",
                icon: "📡"
            }
        },
        4: {
            title: "Assessment Innovation",
            description: "Explore alternative assessment methods: portfolios, peer assessment tools, or competency-based tracking.",
            tag: "Transform Practice",
            tryIt: {
                title: "Student Choice",
                description: "Offer students 2-3 different ways to demonstrate learning on your next assessment.",
                difficulty: "Planning time",
                icon: "🎯"
            }
        }
    },
    accessibility: {
        1: {
            title: "Accessibility Awareness",
            description: "Learn the basics: why accessibility matters and the most common barriers students face.",
            tag: "Foundation",
            tryIt: {
                title: "Empathy Exercise",
                description: "Try navigating your own materials with your eyes closed using a screen reader.",
                difficulty: "10 minutes",
                icon: "👁️"
            }
        },
        2: {
            title: "Quick Accessibility Wins",
            description: "Focus on high-impact basics: heading structure, alt text for images, and sufficient color contrast.",
            tag: "High Impact",
            tryIt: {
                title: "Alt Text Addition",
                description: "Add descriptive alt text to 5 images in your most-used presentation or document.",
                difficulty: "10 minutes",
                icon: "🖼️"
            }
        },
        3: {
            title: "Proactive Accessibility",
            description: "Run accessibility checkers on your materials and make accessibility part of your creation process.",
            tag: "Build Habits",
            tryIt: {
                title: "Accessibility Audit",
                description: "Use the built-in accessibility checker in PowerPoint or Google Docs on one presentation.",
                difficulty: "15 minutes",
                icon: "🔍"
            }
        },
        4: {
            title: "Accessibility Advocate",
            description: "Help establish accessibility standards in your school and support colleagues in implementation.",
            tag: "Champion Change",
            tryIt: {
                title: "Share the Why",
                description: "Share one accessibility tip at your next team meeting with a real student impact story.",
                difficulty: "5 minutes",
                icon: "📢"
            }
        }
    },
    ai: {
        1: {
            title: "AI Fundamentals",
            description: "Spend 30 minutes exploring what AI can and cannot do. Try asking ChatGPT to help plan a lesson.",
            tag: "Get Curious",
            tryIt: {
                title: "AI Conversation",
                description: "Ask an AI tool to explain a concept you teach. Evaluate its response for accuracy.",
                difficulty: "10 minutes",
                icon: "💬"
            }
        },
        2: {
            title: "AI as Teaching Assistant",
            description: "Use AI to help with time-consuming tasks: generating quiz questions, creating rubrics, or differentiating texts.",
            tag: "Save Time",
            tryIt: {
                title: "AI-Assisted Prep",
                description: "Use AI to generate 5 discussion questions for your next lesson. Edit as needed.",
                difficulty: "10 minutes",
                icon: "🤝"
            }
        },
        3: {
            title: "Teaching AI Literacy",
            description: "Help students understand how to use AI responsibly and think critically about AI-generated content.",
            tag: "Empower Students",
            tryIt: {
                title: "AI Critique Lesson",
                description: "Have students fact-check an AI response and discuss what they find.",
                difficulty: "One activity",
                icon: "🧐"
            }
        },
        4: {
            title: "AI Policy & Practice Leader",
            description: "Help shape responsible AI use policies and model thoughtful integration for colleagues.",
            tag: "Shape the Future",
            tryIt: {
                title: "Best Practices Guide",
                description: "Draft 3-5 guidelines for responsible AI use in your classroom or department.",
                difficulty: "30 minutes",
                icon: "📋"
            }
        }
    }
};

// Level names for display
const LEVEL_NAMES = {
    1: "Exploring",
    2: "Developing",
    3: "Applying",
    4: "Leading"
};
