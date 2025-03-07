// API Configuration
const RAPID_API_KEY = 'e7a7fb18bbmsha4835e94ea253cap1bc568jsn1c3b03f87ce1';
const UDEMY_API_HOST = 'udemy-courses-coupon-code-generator.p.rapidapi.com';
const COURSERA_API_HOST = 'coursera-course-search.p.rapidapi.com';

// Function to fetch courses from Udemy
async function fetchUdemyCourses() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': UDEMY_API_HOST
        }
    };

    try {
        const response = await fetch(
            'https://udemy-courses-coupon-code-generator.p.rapidapi.com/api/udemy-free-courses?category=Development&page=1',
            options
        );
        const data = await response.json();
        
        if (!data) {
            return [];
        }

        return data.map(course => ({
            source: 'Udemy',
            title: course.title || 'Course Title',
            image: course.image || 'images/default-course.jpg',
            instructor: course.instructor || 'Expert Instructor',
            duration: course.duration || '12 weeks',
            rating: course.rating || 4.5,
            reviews: course.reviews || '1k+ reviews',
            students: course.students || '10k+ students',
            skills: course.skills || ['Programming', 'Web Development', 'Software'],
            price: course.price || '₹499',
            tag: 'Bestseller',
            link: course.link || '#'
        }));
    } catch (error) {
        console.error('Error fetching Udemy courses:', error);
        return [];
    }
}

// Function to fetch courses from Coursera
async function fetchCourseraCourses() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': COURSERA_API_HOST
        }
    };

    try {
        const response = await fetch(
            'https://coursera-course-search.p.rapidapi.com/courses?query=computer%20science&page=1&lang=en',
            options
        );
        const data = await response.json();
        
        if (!data.courses) {
            return [];
        }

        return data.courses.map(course => ({
            source: 'Coursera',
            title: course.name || 'Course Title',
            image: course.photoUrl || 'images/default-course.jpg',
            instructor: course.partners?.[0]?.name || 'Top University',
            duration: `${course.duration || 12} weeks`,
            rating: course.rating || 4.7,
            reviews: `${Math.floor(Math.random() * 2000)}+ reviews`,
            students: `${Math.floor(Math.random() * 15000)}+ students`,
            skills: course.skills || ['Computer Science', 'Programming', 'Technology'],
            price: '₹' + (Math.floor(Math.random() * 500) + 499),
            tag: 'Hot & New',
            link: course.courseUrl || '#'
        }));
    } catch (error) {
        console.error('Error fetching Coursera courses:', error);
        return [];
    }
}

// Function to fetch all courses
async function fetchAllCourses() {
    try {
        const [udemyCourses, courseraCourses] = await Promise.all([
            fetchUdemyCourses(),
            fetchCourseraCourses()
        ]);

        // Combine and sort courses by rating
        const allCourses = [...udemyCourses, ...courseraCourses];
        return allCourses.sort((a, b) => b.rating - a.rating);
    } catch (error) {
        console.error('Error fetching all courses:', error);
        return [];
    }
}

// Export the API functions
window.CourseAPI = {
    fetchAllCourses
}; 