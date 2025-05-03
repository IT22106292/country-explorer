# country-explorer
React Countries Application

# Overview
This is a React-based frontend application developed as part of the SE3040 - Application Frameworks. The application integrates with the REST Countries API to display country information, allowing users to search, filter, and view detailed country data. The application uses Tailwind CSS for styling, implements user session management, and is deployed on a free hosting platform.

# Features
. Country Listing: Displays a list of countries with details like name, population, region, capital, languages, and flag.
. Search Functionality: Allows users to search for countries by name.
. Filter Options: Filter countries by region or language using dropdown menus.
. Country Details: Click on a country to view detailed information.
. Session Management: Persists user preferences (e.g., selected filters) during the session.
. Responsive Design: Optimized for various devices and screen sizes using Tailwind CSS.
. Testing: Includes unit and integration tests using Jest and React Testing Library.

# Technology Stack
. Frontend: React (functional components), JavaScript
. Styling: Tailwind CSS
. API: REST Countries API
. Testing: Jest, React Testing Library
. Version Control: Git, GitHub
. Hosting: Netlify (free tier)


# Installation
Clone the Repository:
git clone https://https://github.com/IT22106292/country-explorer
cd ountry-explorer


Install Dependencies:
npm install


Run the Application Locally:
npm start

The application will be available at http://localhost:3000.

Build for Production:
npm run build

The production-ready files will be generated in the build directory.

Run Tests:
npm test

This will execute unit and integration tests using Jest and React Testing Library.

# Hosting
The application is deployed on Netlify.

# Usage
. Home Page: View a list of all countries with basic details.
. Search: Use the search bar to find a country by name.
. Filter: Select a region or language from the dropdown to filter the country list.
. Details: Click on a country card to view more details (e.g., full population, languages).
. Session Management: User preferences (e.g., filters) are saved during the session using local storage.

# Testing
. Unit Tests: Cover individual components (e.g., search bar, country card).
. Integration Tests: Ensure components work together (e.g., search updates the country list).
. Cross-Browser Testing: Tested on Chrome, Firefox, and Safari for compatibility.
. Responsive Testing: Verified on mobile, tablet, and desktop devices.

# Documentation
. Code Organization: The codebase follows a modular structure with components, utilities, and tests in separate directories.
. Git Commits: Regular commits with descriptive messages are maintained in the GitHub repository.
. Challenges Faced:
    . API Rate Limits: Handled by implementing caching with local storage to reduce API calls.
    . Responsive Design: Ensured consistent UI across devices using Tailwind CSS responsive classes.
    . Session Management: Used local storage for simplicity, with plans to integrate a backend API for advanced user management.



# Repository
GitHub Repository: https://https://github.com/IT22106292/country-explorer


# Submission
GitHub Classroom: Submitted via https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-IT22106292

