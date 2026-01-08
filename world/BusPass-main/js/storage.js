/**
 * Storage Class
 * Handles all interactions with LocalStorage.
 */
class Storage {
    constructor() {
        this.KEYS = {
            USERS: 'buspass_users',
            APPLICATIONS: 'buspass_applications',
            CURRENT_USER: 'buspass_current_user'
        };
        this.init();
    }

    init() {
        // Initialize with admin user if not exists
        const users = this.getUsers();
        if (users.length === 0) {
            const adminUser = {
                id: 'admin_001',
                name: 'System Admin',
                email: 'admin@buspass.com',
                password: 'admin', // In a real app, this should be hashed
                role: 'admin'
            };
            this.saveUser(adminUser);
            console.log('seeded admin user');
        }
    }

    // User Methods
    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    }

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }

    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    // Application Methods
    getApplications() {
        return JSON.parse(localStorage.getItem(this.KEYS.APPLICATIONS) || '[]');
    }

    saveApplication(application) {
        const apps = this.getApplications();
        // Check if updating or creating
        const existingIndex = apps.findIndex(a => a.id === application.id);
        if (existingIndex >= 0) {
            apps[existingIndex] = application;
        } else {
            apps.push(application);
        }
        localStorage.setItem(this.KEYS.APPLICATIONS, JSON.stringify(apps));
    }

    getApplicationsByStudentId(studentId) {
        const apps = this.getApplications();
        return apps.filter(a => a.studentId === studentId);
    }

    deleteApplication(appId) {
        let apps = this.getApplications();
        apps = apps.filter(a => a.id !== appId);
        localStorage.setItem(this.KEYS.APPLICATIONS, JSON.stringify(apps));
    }

    // Session Methods
    setCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
    }

    logout() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    }
}

const storage = new Storage();
