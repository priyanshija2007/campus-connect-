const CampusConnect = (() => {
    const demoUsers = [
        {
            id: 1,
            name: "Student Name",
            email: "student@campus.edu",
            password: "password123",
            department: "Computer Science '25",
            bio: "Passionate about web development, AI, and open source. CS batch of '25.",
            location: "University Campus",
            github: "github.com/student",
        },
        {
            id: 2,
            name: "Jane Doe",
            email: "jane@campus.edu",
            password: "campus2026",
            department: "AI&DS '26",
            bio: "Learning software engineering through practical projects.",
            location: "Innovation Block",
            github: "github.com/janedoe",
        },
    ];

    const demoPosts = [
        {
            id: 1,
            author: "Jane Doe",
            content: "Looking for a study group for the upcoming Data Structures midterm! Anyone interested?",
            time: "2 hours ago",
            likes: 12,
            comments: 3,
        },
        {
            id: 2,
            author: "John Smith",
            content: "The new cafeteria menu is amazing today. Highly recommend the pasta bar!",
            time: "5 hours ago",
            likes: 45,
            comments: 1,
        },
        {
            id: 3,
            author: "Student Name",
            content: "Completed the CampusConnect login and profile templates for SE Lab.",
            time: "1 day ago",
            likes: 8,
            comments: 2,
        },
    ];

    const storageKey = "campusConnectState";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function defaultState() {
        return {
            users: clone(demoUsers),
            posts: clone(demoPosts),
            currentUserEmail: "student@campus.edu",
        };
    }

    function hasLocalStorage() {
        try {
            return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
        } catch {
            return false;
        }
    }

    function loadState() {
        if (!hasLocalStorage()) return defaultState();
        const stored = window.localStorage.getItem(storageKey);
        if (!stored) return defaultState();
        try {
            const parsed = JSON.parse(stored);
            return {
                users: Array.isArray(parsed.users) ? parsed.users : clone(demoUsers),
                posts: Array.isArray(parsed.posts) ? parsed.posts : clone(demoPosts),
                currentUserEmail: parsed.currentUserEmail || "student@campus.edu",
            };
        } catch {
            return defaultState();
        }
    }

    function saveState(state) {
        if (hasLocalStorage()) {
            window.localStorage.setItem(storageKey, JSON.stringify(state));
        }
        return state;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    }

    function validateLogin(email, password) {
        const errors = {};
        if (!validateEmail(email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!password || String(password).length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }
        return { valid: Object.keys(errors).length === 0, errors };
    }

    function authenticateUser(email, password, users = demoUsers) {
        const validation = validateLogin(email, password);
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }
        const user = users.find(
            (candidate) => candidate.email.toLowerCase() === String(email).trim().toLowerCase()
        );
        if (!user || user.password !== password) {
            return { success: false, errors: { credentials: "Invalid email or password." } };
        }
        return { success: true, user: { ...user, password: undefined } };
    }

    function registerUser(name, email, password, users = demoUsers) {
        const errors = {};
        if (!String(name || "").trim()) {
            errors.name = "Name is required.";
        }
        const loginValidation = validateLogin(email, password);
        Object.assign(errors, loginValidation.errors);
        if (users.some((user) => user.email.toLowerCase() === String(email).trim().toLowerCase())) {
            errors.email = "Email is already registered.";
        }
        if (Object.keys(errors).length) {
            return { success: false, errors };
        }
        const user = {
            id: users.length + 1,
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            password,
            department: "AI&DS",
            bio: "New CampusConnect member.",
            location: "University Campus",
            github: "github.com/new-student",
        };
        return { success: true, user };
    }

    function createPost(content, author = "Student Name") {
        const trimmed = String(content || "").trim();
        if (trimmed.length < 3) {
            return { success: false, error: "Post content must be at least 3 characters." };
        }
        return {
            success: true,
            post: {
                id: Date.now(),
                author,
                content: trimmed,
                time: "Just now",
                likes: 0,
                comments: 0,
            },
        };
    }

    function updateProfile(profile, updates) {
        const nextProfile = { ...profile };
        const name = String(updates.name || "").trim();
        const bio = String(updates.bio || "").trim();
        if (!name) {
            return { success: false, errors: { name: "Name is required." } };
        }
        if (bio.length < 10) {
            return { success: false, errors: { bio: "Bio must be at least 10 characters." } };
        }
        nextProfile.name = name;
        nextProfile.bio = bio;
        return { success: true, profile: nextProfile };
    }

    function currentUser(state) {
        return state.users.find((user) => user.email === state.currentUserEmail) || state.users[0];
    }

    function showMessage(message, type = "success") {
        const messageBox = document.querySelector("[data-testid='message-box']");
        if (!messageBox) return;
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.hidden = false;
    }

    function renderPost(post) {
        const card = document.createElement("div");
        card.className = "card post";
        card.innerHTML = `
            <div class="post-header">
                <div class="avatar-small"></div>
                <div class="post-meta">
                    <h4>${post.author}</h4>
                    <span>${post.time}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-footer">
                <button class="btn btn-text" data-testid="like-btn">Like (${post.likes})</button>
                <button class="btn btn-text" data-testid="comment-btn">Comment (${post.comments})</button>
            </div>
        `;
        return card;
    }

    function setupAuthPage() {
        const loginForm = document.querySelector("#loginForm");
        const registerForm = document.querySelector("#registerForm");
        const showRegister = document.querySelector("#showRegister");
        const showLogin = document.querySelector("#showLogin");
        const state = loadState();

        if (showRegister && showLogin && loginForm && registerForm) {
            showRegister.addEventListener("click", (event) => {
                event.preventDefault();
                loginForm.hidden = true;
                registerForm.hidden = false;
            });
            showLogin.addEventListener("click", (event) => {
                event.preventDefault();
                registerForm.hidden = true;
                loginForm.hidden = false;
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const email = loginForm.email.value;
                const password = loginForm.password.value;
                const result = authenticateUser(email, password, state.users);
                if (!result.success) {
                    showMessage(result.errors.credentials || "Please check the login form.", "error");
                    return;
                }
                state.currentUserEmail = result.user.email;
                saveState(state);
                window.location.href = "dashboard.html";
            });
        }

        if (registerForm) {
            registerForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const result = registerUser(
                    registerForm.fullName.value,
                    registerForm.registerEmail.value,
                    registerForm.registerPassword.value,
                    state.users
                );
                if (!result.success) {
                    showMessage(Object.values(result.errors)[0], "error");
                    return;
                }
                state.users.push(result.user);
                state.currentUserEmail = result.user.email;
                saveState(state);
                window.location.href = "dashboard.html";
            });
        }
    }

    function setupDashboardPage() {
        const state = loadState();
        const user = currentUser(state);
        const nameTargets = document.querySelectorAll("[data-current-user]");
        const departmentTarget = document.querySelector("[data-current-department]");
        const postFeed = document.querySelector("[data-testid='post-feed']");
        const postForm = document.querySelector("#postForm");

        nameTargets.forEach((target) => {
            target.textContent = user.name;
        });
        if (departmentTarget) {
            departmentTarget.textContent = user.department;
        }
        if (postFeed) {
            postFeed.innerHTML = "";
            state.posts.forEach((post) => postFeed.appendChild(renderPost(post)));
        }
        if (postForm) {
            postForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const input = postForm.querySelector("[data-testid='post-input']");
                const result = createPost(input.value, user.name);
                if (!result.success) {
                    showMessage(result.error, "error");
                    return;
                }
                state.posts.unshift(result.post);
                saveState(state);
                if (postFeed) {
                    postFeed.prepend(renderPost(result.post));
                }
                input.value = "";
                showMessage("Post created on the dashboard.", "success");
            });
        }
    }

    function setupProfilePage() {
        const state = loadState();
        let user = currentUser(state);
        const modal = document.querySelector("#editModal");
        const editButton = document.querySelector("[data-testid='edit-profile-btn']");
        const closeButton = document.querySelector("[data-testid='close-modal']");
        const profileForm = document.querySelector("#profileForm");

        function renderProfile() {
            const name = document.querySelector("[data-testid='profile-name']");
            const bio = document.querySelector("[data-testid='profile-bio']");
            const email = document.querySelector("[data-testid='profile-email']");
            const github = document.querySelector("[data-testid='profile-github']");
            if (name) name.textContent = user.name;
            if (bio) bio.textContent = user.bio;
            if (email) email.textContent = user.email;
            if (github) github.textContent = user.github;
        }

        function openModal() {
            if (!modal || !profileForm) return;
            profileForm.fullName.value = user.name;
            profileForm.bio.value = user.bio;
            modal.style.display = "block";
            modal.setAttribute("aria-hidden", "false");
        }

        function closeModal() {
            if (!modal) return;
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        }

        renderProfile();
        if (editButton) editButton.addEventListener("click", openModal);
        if (closeButton) closeButton.addEventListener("click", closeModal);
        if (profileForm) {
            profileForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const result = updateProfile(user, {
                    name: profileForm.fullName.value,
                    bio: profileForm.bio.value,
                });
                if (!result.success) {
                    showMessage(Object.values(result.errors)[0], "error");
                    return;
                }
                const index = state.users.findIndex((candidate) => candidate.email === user.email);
                user = { ...state.users[index], ...result.profile };
                state.users[index] = user;
                saveState(state);
                renderProfile();
                closeModal();
                showMessage("Profile updated successfully.", "success");
            });
        }
    }

    function initPage() {
        if (typeof document === "undefined") return;
        setupAuthPage();
        setupDashboardPage();
        setupProfilePage();
    }

    return {
        demoUsers,
        demoPosts,
        validateLogin,
        authenticateUser,
        registerUser,
        createPost,
        updateProfile,
        loadState,
        saveState,
        initPage,
    };
})();

if (typeof window !== "undefined") {
    window.CampusConnect = CampusConnect;
    document.addEventListener("DOMContentLoaded", CampusConnect.initPage);
}

if (typeof module !== "undefined") {
    module.exports = CampusConnect;
}
