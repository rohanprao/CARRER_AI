// User data management
const USER_DATA = {
    users: [
        { email: 'admin@example.com', password: 'admin123', name: 'Admin', role: 'admin', lastLogin: null },
        { email: 'user@example.com', password: 'user123', name: 'User', role: 'user', lastLogin: null }
    ],

    init() {
        // Load saved users when the page loads
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        } else {
            // Save default users if no saved data exists
            this.saveToStorage();
        }
    },

    validateUser(email, password) {
        return this.users.find(user => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.password === password
        );
    },

    updateLastLogin(email) {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            user.lastLogin = new Date().toISOString();
            this.saveToStorage();
        }
    },

    addUser(userData) {
        // Check if email already exists
        if (this.users.some(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error('Email already registered');
        }

        // Add new user with default role
        const newUser = {
            ...userData,
            role: 'user',
            lastLogin: null
        };
        this.users.push(newUser);

        // Save to localStorage
        this.saveToStorage();
        return newUser;
    },

    saveToStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
};

// Initialize user data
USER_DATA.init();

// Session management
const SessionManager = {
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

    createSession(userData, remember = false) {
        const sessionData = {
            ...userData,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };

        if (remember) {
            localStorage.setItem('userSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('userSession', JSON.stringify(sessionData));
        }
    },

    getSession() {
        return JSON.parse(localStorage.getItem('userSession')) || 
               JSON.parse(sessionStorage.getItem('userSession'));
    },

    clearSession() {
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
    },

    validateSession() {
        const session = this.getSession();

        if (session) {
            const sessionAge = Date.now() - new Date(session.loginTime).getTime();
            if (sessionAge > this.sessionDuration) {
                this.clearSession();
                return false;
            }
            return true;
        }
        return false;
    }
};

// Form validation
const Validator = {
    email(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return null;
    },

    password(password) {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters long';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
        return null;
    },

    name(name) {
        if (!name) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters long';
        return null;
    },

    confirmPassword(password, confirmPassword) {
        if (!confirmPassword) return 'Please confirm your password';
        if (password !== confirmPassword) return 'Passwords do not match';
        return null;
    }
};

// Get the forms
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

// Handle login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    try {
        // Authenticate user
        const user = USER_DATA.validateUser(email, password);
        
        if (user) {
            // Successful login
            USER_DATA.updateLastLogin(email);
            
            // Store user data
            const userData = {
                name: user.name,
                email: user.email,
                role: user.role,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };

            // Save to storage based on remember me option
            if (remember) {
                localStorage.setItem('userSession', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userSession', JSON.stringify(userData));
            }

            // Redirect to main page
            window.location.href = 'index.html';
        } else {
            // Show error message
            errorMessage.textContent = 'Invalid email or password';
            errorMessage.style.display = 'block';
            
            // Hide error message after 3 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }

    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});

// Handle signup form submission
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Get form values
        const name = document.querySelector('input[name="signup-name"]').value.trim();
        const email = document.querySelector('input[name="signup-email"]').value.trim();
        const password = document.querySelector('input[name="signup-password"]').value;
        const confirmPassword = document.querySelector('input[name="signup-confirm-password"]').value;

        // Validate inputs
        const nameError = Validator.name(name);
        if (nameError) throw new Error(nameError);

        const emailError = Validator.email(email);
        if (emailError) throw new Error(emailError);

        const passwordError = Validator.password(password);
        if (passwordError) throw new Error(passwordError);

        const confirmError = Validator.confirmPassword(password, confirmPassword);
        if (confirmError) throw new Error(confirmError);

        // Create new user
        const newUser = USER_DATA.addUser({ name, email, password });

        // Show success message
        showMessage('Account created successfully! Please login with your new credentials.', 'success');

        // Clear form
        signupForm.reset();

        // Switch to login form after a delay
        setTimeout(() => {
            showLoginForm();
        }, 2000);

    } catch (error) {
        showMessage(error.message, 'error');
        console.error('Signup error:', error);
    }
});

// Function to show messages
function showMessage(message, type = 'error') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    const styles = {
        backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        padding: '12px',
        borderRadius: '4px',
        marginTop: '20px',
        textAlign: 'center',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        fontSize: '14px',
        fontWeight: '500'
    };
    
    Object.assign(messageDiv.style, styles);
    
    // Add message to page
    const activeForm = document.querySelector('.form-container:not(.hidden)');
    activeForm.insertAdjacentElement('afterend', messageDiv);
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.5s ease';
            setTimeout(() => messageDiv.remove(), 500);
        }, 5000);
    }
}

// Function to toggle between login and signup forms
function showLoginForm() {
    document.querySelector('.login-container').classList.remove('hidden');
    document.querySelector('.signup-container').classList.add('hidden');
}

function showSignupForm() {
    document.querySelector('.login-container').classList.add('hidden');
    document.querySelector('.signup-container').classList.remove('hidden');
}

// Add form toggle button listeners
document.querySelector('.show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

document.querySelector('.show-login').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Check existing session on page load
document.addEventListener('DOMContentLoaded', function() {
    if (SessionManager.validateSession()) {
        window.location.href = 'index.html';
    }
});

// Add keyboard support
loginForm.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        loginForm.querySelector('button[type="submit"]').click();
    }
});

signupForm.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        signupForm.querySelector('button[type="submit"]').click();
    }
});

// Handle signup link click
document.getElementById('signupLink').addEventListener('click', function(e) {
    e.preventDefault();
    // Redirect to signup page or show signup form
    alert('Signup functionality coming soon!');
}); 