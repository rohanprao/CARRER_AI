// Course data and generation
const platforms = ['udemy', 'coursera', 'edx'];
const levels = ['beginner', 'intermediate', 'advanced'];
const prices = ['free', 'paid'];
const categories = [
    'Programming', 'Web Development', 'Data Science', 'Machine Learning',
    'Cloud Computing', 'Cybersecurity', 'Mobile Development', 'UI/UX Design',
    'DevOps', 'Blockchain', 'Game Development', 'Digital Marketing',
    'Artificial Intelligence', 'Big Data', 'Software Testing', 'Database Management'
];

// Real course images from actual platforms
const courseImages = {
    'Programming': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/computer-programming.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Web Development': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/web-development.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Data Science': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/1754098_e0df_3.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/data-science.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Machine Learning': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/machine-learning.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Cloud Computing': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/2796760_8a4e_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/cloud-computing.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Cybersecurity': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/2796760_8a4e_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/cybersecurity.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Mobile Development': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/951618_0839_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/mobile-development.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'UI/UX Design': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/ui-ux-design.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'DevOps': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/2796760_8a4e_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/devops.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Blockchain': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/951618_0839_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/blockchain.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Game Development': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/game-development.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Digital Marketing': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/1754098_e0df_3.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/digital-marketing.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Artificial Intelligence': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/artificial-intelligence.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Big Data': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/2796760_8a4e_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/big-data.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Software Testing': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/951618_0839_2.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/software-testing.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    },
    'Database Management': {
        'udemy': 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg',
        'coursera': 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/database-management.jpg',
        'edx': 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg'
    }
};

// Function to get course image
function getCourseImage(category, platform) {
    // Return a simple placeholder image with the category name
    return `https://placehold.co/480x270/4F46E5/FFFFFF/png?text=${encodeURIComponent(category)}`;
}

// Default image for fallback
const defaultImage = 'https://placehold.co/480x270/4F46E5/FFFFFF/png?text=Course+Image';

const courseTemplates = [
    {
        title: 'Complete {category} Bootcamp',
        description: 'Master {category} from scratch with hands-on projects',
        duration: '40 hours',
        lectures: '300',
        rating: '4.8',
        reviews: '15k',
        price_amount: '$29.99'
    },
    {
        title: '{category} Fundamentals',
        description: 'Learn the basics of {category} and build your first project',
        duration: '25 hours',
        lectures: '180',
        rating: '4.6',
        reviews: '8k',
        price_amount: '$19.99'
    },
    {
        title: 'Advanced {category} Masterclass',
        description: 'Take your {category} skills to the next level',
        duration: '50 hours',
        lectures: '350',
        rating: '4.9',
        reviews: '12k',
        price_amount: '$49.99'
    }
];

// Initial courses
const initialCourses = [
    {
        platform: 'udemy',
        title: 'Complete Python Bootcamp: Go from zero to hero in Python 3',
        description: 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!',
        price: 'paid',
        level: 'beginner',
        category: 'Programming',
        image: 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg',
        duration: '22 hours',
        lectures: '186',
        rating: '4.6',
        reviews: '500k',
        price_amount: '$84.99',
        url: 'https://www.udemy.com/course/complete-python-bootcamp/'
    },
    {
        platform: 'udemy',
        title: 'The Complete JavaScript Course 2024: From Zero to Expert!',
        description: 'The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory. Many courses in one!',
        price: 'paid',
        level: 'beginner',
        category: 'Web Development',
        image: 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg',
        duration: '69 hours',
        lectures: '450',
        rating: '4.7',
        reviews: '300k',
        price_amount: '$84.99',
        url: 'https://www.udemy.com/course/the-complete-javascript-course/'
    },
    {
        platform: 'coursera',
        title: 'Machine Learning Specialization',
        description: 'Build ML models with NumPy & scikit-learn, build & train supervised models, predict continuous & discrete values, and more.',
        price: 'paid',
        level: 'intermediate',
        category: 'Machine Learning',
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/machine-learning.jpg',
        duration: '50 hours',
        lectures: '280',
        rating: '4.9',
        reviews: '100k',
        price_amount: '$49.99',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction'
    },
    {
        platform: 'coursera',
        title: 'Google Data Analytics Professional Certificate',
        description: 'Prepare for a new career in the high-growth field of data analytics, no experience or degree required.',
        price: 'paid',
        level: 'beginner',
        category: 'Data Science',
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/data-science.jpg',
        duration: '180 hours',
        lectures: '320',
        rating: '4.8',
        reviews: '150k',
        price_amount: '$39.99',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics'
    },
    {
        platform: 'edx',
        title: 'CS50: Introduction to Computer Science',
        description: 'An introduction to the intellectual enterprises of computer science and the art of programming.',
        price: 'free',
        level: 'beginner',
        category: 'Programming',
        image: 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg',
        duration: '100 hours',
        lectures: '200',
        rating: '4.9',
        reviews: '200k',
        price_amount: 'Free',
        url: 'https://www.edx.org/course/cs50s-introduction-to-computer-science'
    },
    {
        platform: 'edx',
        title: 'MITx: Introduction to Computer Science and Programming Using Python',
        description: 'Learn the fundamentals of computer science and programming in Python.',
        price: 'free',
        level: 'beginner',
        category: 'Programming',
        image: 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg',
        duration: '150 hours',
        lectures: '250',
        rating: '4.8',
        reviews: '180k',
        price_amount: 'Free',
        url: 'https://www.edx.org/course/introduction-to-computer-science-and-programming-7'
    },
    {
        platform: 'udemy',
        title: 'AWS Certified Solutions Architect - Associate 2024',
        description: 'Pass the AWS Certified Solutions Architect Associate Certification SAA-C03. Complete Amazon Web Services Cloud training!',
        price: 'paid',
        level: 'intermediate',
        category: 'Cloud Computing',
        image: 'https://img-c.udemycdn.com/course/480x270/2796760_8a4e_2.jpg',
        duration: '27 hours',
        lectures: '200',
        rating: '4.7',
        reviews: '250k',
        price_amount: '$84.99',
        url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/'
    },
    {
        platform: 'coursera',
        title: 'IBM Cybersecurity Analyst Professional Certificate',
        description: 'Develop knowledge of cybersecurity analyst tools including data protection; endpoint protection; SIEM; and systems and network fundamentals.',
        price: 'paid',
        level: 'beginner',
        category: 'Cybersecurity',
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/cybersecurity.jpg',
        duration: '120 hours',
        lectures: '180',
        rating: '4.7',
        reviews: '80k',
        price_amount: '$39.99',
        url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst'
    },
    {
        platform: 'udemy',
        title: 'React Native - The Practical Guide 2024',
        description: 'Use React Native and your React knowledge to build native iOS and Android Apps - incl. Push Notifications, Redux, Hooks, Navigation',
        price: 'paid',
        level: 'intermediate',
        category: 'Mobile Development',
        image: 'https://img-c.udemycdn.com/course/480x270/951618_0839_2.jpg',
        duration: '37 hours',
        lectures: '300',
        rating: '4.8',
        reviews: '150k',
        price_amount: '$84.99',
        url: 'https://www.udemy.com/course/react-native-the-practical-guide/'
    },
    {
        platform: 'coursera',
        title: 'UI/UX Design Specialization',
        description: 'Design high-impact user experiences. Research, design, and prototype effective, visually-driven websites and apps.',
        price: 'paid',
        level: 'beginner',
        category: 'UI/UX Design',
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/ui-ux-design.jpg',
        duration: '140 hours',
        lectures: '220',
        rating: '4.8',
        reviews: '90k',
        price_amount: '$49.99',
        url: 'https://www.coursera.org/specializations/ui-ux-design'
    },
    {
        platform: 'edx',
        title: 'DevOps Engineering Professional Certificate',
        description: 'Learn the skills needed to become a DevOps engineer, including Linux, Git, Docker, Kubernetes, and more.',
        price: 'paid',
        level: 'intermediate',
        category: 'DevOps',
        image: 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg',
        duration: '160 hours',
        lectures: '280',
        rating: '4.7',
        reviews: '70k',
        price_amount: '$199.99',
        url: 'https://www.edx.org/professional-certificate/devops-engineering'
    },
    {
        platform: 'udemy',
        title: 'Blockchain A-Z™: Learn How To Build Your First Blockchain',
        description: 'Harness the power of the most disruptive technology since the internet through real life examples! Master Blockchain Now',
        price: 'paid',
        level: 'intermediate',
        category: 'Blockchain',
        image: 'https://img-c.udemycdn.com/course/480x270/951618_0839_2.jpg',
        duration: '14.5 hours',
        lectures: '120',
        rating: '4.6',
        reviews: '100k',
        price_amount: '$84.99',
        url: 'https://www.udemy.com/course/build-your-blockchain-az/'
    },
    {
        platform: 'coursera',
        title: 'Game Design and Development Specialization',
        description: 'Create games using Unity and C#. Learn game design principles and how to develop games for multiple platforms.',
        price: 'paid',
        level: 'beginner',
        category: 'Game Development',
        image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072121239e3eff/game-development.jpg',
        duration: '180 hours',
        lectures: '300',
        rating: '4.8',
        reviews: '60k',
        price_amount: '$49.99',
        url: 'https://www.coursera.org/specializations/game-design-and-development'
    },
    {
        platform: 'udemy',
        title: 'Digital Marketing Masterclass - 23 Courses in 1',
        description: 'Learn everything about digital marketing - SEO, Social Media, Content Marketing, Email Marketing, and more!',
        price: 'paid',
        level: 'beginner',
        category: 'Digital Marketing',
        image: 'https://img-c.udemycdn.com/course/480x270/1754098_e0df_3.jpg',
        duration: '44 hours',
        lectures: '350',
        rating: '4.6',
        reviews: '200k',
        price_amount: '$84.99',
        url: 'https://www.udemy.com/course/digital-marketing-masterclass/'
    },
    {
        platform: 'edx',
        title: 'Artificial Intelligence Professional Certificate',
        description: 'Learn the fundamentals of AI and machine learning, including neural networks, deep learning, and natural language processing.',
        price: 'paid',
        level: 'advanced',
        category: 'Artificial Intelligence',
        image: 'https://prod-discovery.edx-cdn.org/media/course/image/0e575a39-1e15-4d3d-9b73-604d938bb77d-0d2d8a8b5f67.small.jpg',
        duration: '200 hours',
        lectures: '400',
        rating: '4.8',
        reviews: '50k',
        price_amount: '$299.99',
        url: 'https://www.edx.org/professional-certificate/artificial-intelligence'
    }
];

// Function to generate random courses
function generateRandomCourses(count) {
    const courses = [];
    const platforms = ['udemy', 'coursera', 'edx'];
    const categories = Object.keys(courseImages);
    const levels = ['beginner', 'intermediate', 'advanced'];
    const prices = ['free', 'paid'];
    
    // Generate courses with higher ratings for top courses
    for (let i = 0; i < count; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const price = prices[Math.floor(Math.random() * prices.length)];
        
        // Generate higher ratings for top courses (first 20%)
        const isTopCourse = i < count * 0.2;
        const rating = isTopCourse 
            ? (4.5 + Math.random() * 0.5).toFixed(1) // 4.5-5.0 for top courses
            : (3.5 + Math.random() * 1.0).toFixed(1); // 3.5-4.5 for others
        
        // Generate more reviews for top courses
        const reviews = isTopCourse
            ? Math.floor(Math.random() * 5000) + 5000 // 5000-10000 reviews
            : Math.floor(Math.random() * 1000) + 100; // 100-1100 reviews
        
        // Generate more lectures for top courses
        const lectures = isTopCourse
            ? Math.floor(Math.random() * 50) + 150 // 150-200 lectures
            : Math.floor(Math.random() * 50) + 50; // 50-100 lectures
        
        // Generate longer duration for top courses
        const duration = isTopCourse
            ? Math.floor(Math.random() * 20) + 30 // 30-50 hours
            : Math.floor(Math.random() * 20) + 10; // 10-30 hours
        
        // Generate course URL based on platform
        const url = platform === 'edx' 
            ? `https://www.edx.org/course/${category.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`
            : `https://www.${platform}.com/course/${category.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`;
        
        courses.push({
            id: i + 1,
            title: `${category} ${level.charAt(0).toUpperCase() + level.slice(1)} Course ${i + 1}`,
            description: `Comprehensive ${level} course covering ${category.toLowerCase()} fundamentals and advanced concepts. Perfect for ${level} learners.`,
            platform,
            category,
            level,
            price,
            price_amount: price === 'free' ? 'Free' : `$${(Math.random() * 100 + 20).toFixed(2)}`,
            rating: parseFloat(rating),
            reviews,
            lectures,
            duration: `${duration} hours`,
            url,
            image: getCourseImage(category, platform)
        });
    }
    
    // Sort courses by rating and reviews
    courses.sort((a, b) => {
        // First sort by rating
        if (b.rating !== a.rating) {
            return b.rating - a.rating;
        }
        // If ratings are equal, sort by number of reviews
        return b.reviews - a.reviews;
    });
    
    return courses;
}

// Generate all courses
const allCourses = [...initialCourses, ...generateRandomCourses(50)];

// Export the courses arrays
window.allCourses = allCourses;
window.initialCourses = initialCourses; 