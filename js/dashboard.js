// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data and initialize dashboard
    loadUserData();
    loadRecommendations();
    loadMyCourses();
    loadApplications();
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('http://localhost:8000/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('userName').textContent = userData.fullName;
            
            // Populate profile form
            const profileForm = document.getElementById('profileForm');
            profileForm.fullName.value = userData.fullName;
            profileForm.email.value = userData.email;
            profileForm.phone.value = userData.phone || '';
            profileForm.skills.value = userData.skills || '';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Resume upload handler
const resumeUpload = document.getElementById('resumeUpload');
resumeUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await fetch('http://localhost:8000/analyze-resume', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            displayResumeResults(data);
        }
    } catch (error) {
        console.error('Error analyzing resume:', error);
        alert('Error analyzing resume. Please try again.');
    }
});

// Display resume analysis results
function displayResumeResults(data) {
    const resultsContainer = document.getElementById('resumeResults');
    resultsContainer.innerHTML = `
        <div class="analysis-section">
            <h3>Skills Identified</h3>
            <ul class="skills-list">
                ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </div>
        <div class="analysis-section">
            <h3>Experience Summary</h3>
            <p>${data.experience}</p>
        </div>
        <div class="analysis-section">
            <h3>Recommendations</h3>
            <ul class="recommendations-list">
                ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Load recommendations
async function loadRecommendations() {
    try {
        // Load recommended courses
        const coursesResponse = await fetch('http://localhost:8000/courses/recommended', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (coursesResponse.ok) {
            const courses = await coursesResponse.json();
            displayRecommendedCourses(courses);
        }

        // Load recommended internships
        const internshipsResponse = await fetch('http://localhost:8000/internships/recommended', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (internshipsResponse.ok) {
            const internships = await internshipsResponse.json();
            displayRecommendedInternships(internships);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Display recommended courses
function displayRecommendedCourses(courses) {
    const container = document.getElementById('recommendedCourses');
    container.innerHTML = courses.map(course => `
        <div class="course-card">
            <h4>${course.title}</h4>
            <p>${course.description}</p>
            <div class="course-details">
                <span>Platform: ${course.platform}</span>
                <span>Duration: ${course.duration}</span>
                <span>Rating: ${course.rating}</span>
            </div>
            <a href="${course.url}" class="btn btn-primary" target="_blank">Enroll Now</a>
        </div>
    `).join('');
}

// Display recommended internships
function displayRecommendedInternships(internships) {
    const container = document.getElementById('recommendedInternships');
    container.innerHTML = internships.map(internship => `
        <div class="internship-card">
            <h4>${internship.title}</h4>
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

// Load user's enrolled courses
async function loadMyCourses() {
    try {
        const response = await fetch('http://localhost:8000/courses/enrolled', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const courses = await response.json();
            const container = document.getElementById('myCourses');
            container.innerHTML = courses.map(course => `
                <div class="course-card">
                    <h4>${course.title}</h4>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${course.progress}%"></div>
                    </div>
                    <p>Progress: ${course.progress}%</p>
                    <a href="${course.url}" class="btn btn-primary">Continue Learning</a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading enrolled courses:', error);
    }
}

// Load user's applications
async function loadApplications() {
    try {
        const response = await fetch('http://localhost:8000/applications', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const applications = await response.json();
            const container = document.getElementById('applicationsList');
            container.innerHTML = applications.map(app => `
                <div class="application-card">
                    <h4>${app.position}</h4>
                    <p class="company">${app.company}</p>
                    <p class="status ${app.status.toLowerCase()}">${app.status}</p>
                    <p class="date">Applied on: ${new Date(app.appliedDate).toLocaleDateString()}</p>
                    <a href="${app.url}" class="btn btn-secondary">View Details</a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

// Profile form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('http://localhost:8000/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formObject)
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            loadUserData(); // Reload user data
        } else {
            throw new Error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}); 