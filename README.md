# CampusConnect SE Lab Templates

This repository contains the official frontend UI templates and tests for the **CampusConnect: A Smart College Event & Resource Management System** case study, utilized in the Software Engineering Lab course.

Designed and provided by **Assistant Prof. Vishesh Panghal**.

## Repository Structure

```text
campus-connect-se-lab/
├── campus_connect_templates/
│   ├── index.html          # Login / Registration Page (with form validation)
│   ├── dashboard.html      # Main Dashboard & Post Feed
│   ├── profile.html        # User Profile Management and Edit Modal
│   ├── style.css           # Global Stylesheet
│   ├── script.js           # Frontend Logic & Mock Validation Functions
│   ├── validate-files.js   # Script to check structural compliance
│   └── tests/
│       └── script.test.js  # Automated Unit Tests
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI Workflow Configuration
├── package.json            # Node.js project configuration
└── README.md               # This README file
```

## How to Use the Templates

### 1. View the UI Pages
The UI is built with pure HTML and vanilla CSS. You do not need a server to run it. Simply open the files in your preferred web browser:
- Open `campus_connect_templates/index.html` to view the Login/Register page.
- Open `campus_connect_templates/dashboard.html` to view the main Feed.
- Open `campus_connect_templates/profile.html` to view the Profile Page.

### 2. Local Testing and Code Validation
To run the automated validation and tests locally, make sure you have [Node.js](https://nodejs.org/) installed:

1. Install project dependencies (if any):
   ```bash
   npm install
   ```
2. Run the template compliance validator:
   ```bash
   npm run validate
   ```
3. Run the automated unit tests:
   ```bash
   npm run test
   ```

### 3. Continuous Integration
The `.github/workflows/ci.yml` pipeline automates validation and tests upon pushing commits to the repository. Ensure your workflows succeed before submitting your lab assignments.
