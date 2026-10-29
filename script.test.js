const assert = require("assert");
const CampusConnect = require("../script.js");

const tests = [];

function test(name, callback) {
    tests.push({ name, callback });
}

test("validateLogin accepts a valid campus email and strong password", () => {
    const result = CampusConnect.validateLogin("student@campus.edu", "password123");
    assert.strictEqual(result.valid, true);
    assert.deepStrictEqual(result.errors, {});
});

test("validateLogin rejects invalid email and short password", () => {
    const result = CampusConnect.validateLogin("student-campus", "short");
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.errors.email, "Please enter a valid email address.");
    assert.strictEqual(result.errors.password, "Password must be at least 8 characters.");
});

test("authenticateUser accepts known mock credentials", () => {
    const result = CampusConnect.authenticateUser("student@campus.edu", "password123");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.user.name, "Student Name");
});

test("registerUser creates a new user when data is valid", () => {
    const users = [...CampusConnect.demoUsers];
    const result = CampusConnect.registerUser("New Student", "new@campus.edu", "newpass123", users);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.user.email, "new@campus.edu");
    assert.strictEqual(result.user.bio, "New CampusConnect member.");
});

test("registerUser rejects duplicate emails", () => {
    const result = CampusConnect.registerUser(
        "Duplicate Student",
        "student@campus.edu",
        "password123",
        CampusConnect.demoUsers
    );
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.email, "Email is already registered.");
});

test("createPost trims content and builds a dashboard post", () => {
    const result = CampusConnect.createPost("  Hello CampusConnect!  ", "Student Name");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.post.author, "Student Name");
    assert.strictEqual(result.post.content, "Hello CampusConnect!");
    assert.strictEqual(result.post.likes, 0);
});

test("createPost rejects empty or very short posts", () => {
    const result = CampusConnect.createPost("hi");
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, "Post content must be at least 3 characters.");
});

test("updateProfile saves valid profile changes", () => {
    const profile = {
        name: "Student Name",
        bio: "Original student bio.",
    };
    const result = CampusConnect.updateProfile(profile, {
        name: "Updated Student",
        bio: "Updated profile bio for the SE lab.",
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.profile.name, "Updated Student");
    assert.strictEqual(result.profile.bio, "Updated profile bio for the SE lab.");
});

test("updateProfile rejects missing name and short bio", () => {
    const result = CampusConnect.updateProfile(
        { name: "Student Name", bio: "Original student bio." },
        { name: "", bio: "short" }
    );
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errors.name, "Name is required.");
});

let passed = 0;

for (const { name, callback } of tests) {
    try {
        callback();
        passed += 1;
        console.log(`PASS ${name}`);
    } catch (error) {
        console.error(`FAIL ${name}`);
        console.error(error);
        process.exitCode = 1;
    }
}

console.log(`${passed}/${tests.length} tests passed.`);
