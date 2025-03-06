// Function to read and parse CSV data
async function readCSV() {
    try {
        const response = await fetch('../data/users.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        return {
            headers,
            users: rows.slice(1).map(row => {
                const values = row.split(',');
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {});
            })
        };
    } catch (error) {
        console.error('Error reading CSV:', error);
        return { headers: [], users: [] };
    }
}

// Function to write to CSV
async function writeCSV(headers, users) {
    try {
        const csvContent = [
            headers.join(','),
            ...users.map(user => headers.map(header => user[header]).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const formData = new FormData();
        formData.append('file', blob, 'users.csv');

        // Send to server to save (you'll need to implement this endpoint)
        await fetch('../data/save-users', {
            method: 'POST',
            body: formData
        });

        return true;
    } catch (error) {
        console.error('Error writing CSV:', error);
        return false;
    }
}

// Registration Form Handler
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = registerForm.querySelector('input[name="name"]').value;
    const email = registerForm.querySelector('input[name="email"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;
    const confirmPassword = registerForm.querySelector('input[name="confirm_password"]').value;
    const terms = registerForm.querySelector('input[name="terms"]').checked;
    
    try {
        // Validate form
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (!terms) {
            throw new Error('Please accept the Terms & Conditions');
        }
        
        // Read existing users
        const { headers, users } = await readCSV();
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            throw new Error('Email already registered');
        }
        
        // Add new user
        const newUser = {
            email,
            name,
            password,
            created_at: new Date().toISOString().split('T')[0]
        };
        
        users.push(newUser);
        
        // Save updated users list
        const success = await writeCSV(headers, users);
        
        if (success) {
            // Store user info in sessionStorage
            const userInfo = {
                email: newUser.email,
                name: newUser.name,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            // Redirect to index page
            window.location.href = 'index.html';
        } else {
            throw new Error('Failed to create account');
        }
        
    } catch (error) {
        console.error('Error:', error);
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = error.message;
        
        // Remove any existing error message
        const existingError = registerForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        registerForm.appendChild(errorDiv);
    }
}); 