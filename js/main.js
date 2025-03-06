// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData.entries());
        
        try {
            // Replace with your actual API endpoint
            const response = await fetch('http://localhost:8000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
            });

            if (response.ok) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error submitting your form. Please try again later.');
        }
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature and service cards
document.querySelectorAll('.feature-card, .service-card').forEach(card => {
    observer.observe(card);
});

// Resume Upload and Analysis
const resumeUpload = document.getElementById('resume-upload');
if (resumeUpload) {
    resumeUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('http://localhost:8000/analyze-resume', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                displayResumeAnalysis(data);
            } else {
                throw new Error('Resume analysis failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Sorry, there was an error analyzing your resume. Please try again later.');
        }
    });
}

// Display Resume Analysis Results
function displayResumeAnalysis(data) {
    const resultsContainer = document.getElementById('resume-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
        <h3>Resume Analysis Results</h3>
        <div class="skills-section">
            <h4>Skills Identified:</h4>
            <ul>
                ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </div>
        <div class="experience-section">
            <h4>Experience Summary:</h4>
            <p>${data.experience}</p>
        </div>
        <div class="recommendations-section">
            <h4>Recommendations:</h4>
            <ul>
                ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Dynamic Course and Internship Loading
async function loadCourses() {
    try {
        const response = await fetch('http://localhost:8000/courses');
        if (response.ok) {
            const courses = await response.json();
            displayCourses(courses);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadInternships() {
    try {
        const response = await fetch('http://localhost:8000/internships');
        if (response.ok) {
            const internships = await response.json();
            displayInternships(internships);
        }
    } catch (error) {
        console.error('Error loading internships:', error);
    }
}

function displayCourses(courses) {
    const coursesContainer = document.getElementById('courses-container');
    if (!coursesContainer) return;

    coursesContainer.innerHTML = courses.map(course => `
        <div class="course-card">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-details">
                <span>Platform: ${course.platform}</span>
                <span>Duration: ${course.duration}</span>
                <span>Rating: ${course.rating}</span>
            </div>
            <a href="${course.url}" class="btn btn-primary" target="_blank">Learn More</a>
        </div>
    `).join('');
}

function displayInternships(internships) {
    const internshipsContainer = document.getElementById('internships-container');
    if (!internshipsContainer) return;

    internshipsContainer.innerHTML = internships.map(internship => `
        <div class="internship-card">
            <h3>${internship.title}</h3>
            <p class="company">${internship.company}</p>
            <p class="location">${internship.location}</p>
            <div class="internship-details">
                <span>Duration: ${internship.duration}</span>
                <span>Stipend: ${internship.stipend}</span>
            </div>
            <p class="description">${internship.description}</p>
            <a href="${internship.url}" class="btn btn-primary" target="_blank">Apply Now</a>
        </div>
    `).join('');
}

// Load courses and internships when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    loadInternships();
});

// Check if user is logged in
function checkAuth() {
    const session = JSON.parse(localStorage.getItem('userSession')) || 
                   JSON.parse(sessionStorage.getItem('userSession'));
    
    if (!session || !session.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Update user profile in navigation
    updateUserProfile(session);
}

// Update user profile information in the navigation
function updateUserProfile(userData) {
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    
    if (userNameElement) {
        userNameElement.textContent = `Hi, ${userData.name}!`;
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = userData.email;
    }
}

// Toggle profile dropdown menu
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');

    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.user-profile')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Handle sign out
function signOut() {
    // Clear session data
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();

    // Add sign out event listener
    const signOutButton = document.querySelector('.sign-out');
    if (signOutButton) {
        signOutButton.addEventListener('click', function(e) {
            e.preventDefault();
            signOut();
        });
    }

    // Toggle mobile menu
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}); 