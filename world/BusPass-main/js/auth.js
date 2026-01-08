/**
 * Auth Logic
 * Depends on storage.js being loaded first.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    const path = window.location.pathname;

    // Auth Guards
    const user = storage.getCurrentUser();
    const isAuthPage = path.includes('login.html') || path.includes('signup.html') || path.includes('landing') || path === '/' || path.endsWith('index.html');

    if (!user && !isAuthPage) {
        // Redirect to login if not logged in and trying to access dashboard
        window.location.href = 'login.html';
        return;
    }

    if (user && isAuthPage && !path.includes('landing') && !path.endsWith('index.html')) {
        // Redirect to dashboard if logged in and trying to access auth pages
        // Allow access to landing page though
        if (path.includes('login') || path.includes('signup')) {
            redirectToDashboard(user);
            return;
        }
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const foundUser = storage.findUserByEmail(email);

            if (foundUser && foundUser.password === password) {
                storage.setCurrentUser(foundUser);
                redirectToDashboard(foundUser);
            } else {
                showError('Invalid email or password');
            }
        });
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = 'student'; // Signups are always students

            if (storage.findUserByEmail(email)) {
                showError('User already exists with this email');
                return;
            }

            const newUser = {
                id: 'std_' + Date.now(),
                name,
                email,
                password,
                role,
                createdAt: new Date().toISOString()
            };

            storage.saveUser(newUser);
            storage.setCurrentUser(newUser);
            redirectToDashboard(newUser);
        });
    }
});

function redirectToDashboard(user) {
    if (user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'student-dashboard.html';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message);
    }
}
