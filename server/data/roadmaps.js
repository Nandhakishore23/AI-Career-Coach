const roadmaps = {
    "Frontend Developer": [
        {
            title: "Day 1-3: HTML5 Fundamentals",
            description: "Learn semantic tags, forms, tables, and SEO basics. Build a simple static page.",
            status: "pending",
            details: {
                summary: "HTML is the skeleton of the web. Focus on semantic tags (<article>, <section>) because they matter for Accessibility and SEO.",
                resources: [
                    { title: "HTML Crash Course", url: "https://www.youtube.com/watch?v=kUMe1FH4CHE", type: "video" },
                    { title: "MDN Web Docs - HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "article" }
                ],
                keyTerms: ["Semantic HTML", "DOM", "Attributes", "Forms"]
            }
        },
        {
            title: "Day 4-10: CSS3 Mastery",
            description: "Box model, Flexbox, Grid layouts, and Responsive Design (Media Queries).",
            status: "pending",
            details: {
                summary: "CSS makes things look good. Master 'Flexbox' and 'Grid'—they are the modern standard for layouts. Don't worry about memorizing every property.",
                resources: [
                    { title: "Flexbox Froggy Game", url: "https://flexboxfroggy.com/", type: "interactive" },
                    { title: "CSS Grid Garden", url: "https://cssgridgarden.com/", type: "interactive" },
                    { title: "Tailwind vs CSS", url: "https://tailwindcss.com/", type: "article" }
                ],
                keyTerms: ["Box Model", "Flexbox", "Grid", "Media Queries", "Specificity"]
            }
        },
        {
            title: "Week 3-4: JavaScript Basics",
            description: "Variables, Loops, Functions, DOM Manipulation, and Events.",
            status: "pending",
            details: {
                summary: "JavaScript brings the page to life. Understand 'ES6' features like 'let/const' and Arrow Functions. DOM manipulation is how you change HTML with code.",
                resources: [
                    { title: "JavaScript for Beginners", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", type: "video" },
                    { title: "JavaScript.info", url: "https://javascript.info/", type: "article" }
                ],
                keyTerms: ["Variables", "Functions", "DOM", "Events", "ES6"]
            }
        },
        {
            title: "Week 5: Advanced JavaScript",
            description: "ES6+ features (Arrow functions, Destructuring), Async/Await, and Fetch API.",
            status: "pending",
            details: {
                summary: "Async JS is crucial for fetching data from servers. Learn Promises and Async/Await deeply.",
                resources: [
                    { title: "Async JavaScript Course", url: "https://www.youtube.com/watch?v=PoRJizFvM7s", type: "video" }
                ],
                keyTerms: ["Promises", "Async/Await", "Fetch API", "Destructuring"]
            }
        },
        { title: "Week 6: Version Control", description: "Git basics: init, push, pull, branch, and merge. GitHub workflow.", status: "pending", details: { summary: "Git saves your code history. Learn commonly used commands.", resources: [], keyTerms: [] } },
        { title: "Week 7-8: React.js Essentials", description: "Components, Props, State (useState, useEffect), and Routing.", status: "pending", details: { summary: "React is a JS library for building UIs. Think in components.", resources: [], keyTerms: [] } },
        { title: "Week 9: Styling in React", description: "Tailwind CSS utility classes and component styling.", status: "pending", details: { summary: "Tailwind speeds up styling significantly.", resources: [], keyTerms: [] } },
        { title: "Week 10: Final Project", description: "Build a Portfolio Website or Task Manager App.", status: "pending", details: { summary: "Apply everything you learned.", resources: [], keyTerms: [] } }
    ],
    "Backend Developer": [
        { title: "Week 1: Node.js Runtime", description: "How Node works, Event Loop, Modules system, and NPM.", status: "pending" },
        { title: "Week 2: Express.js Framework", description: "Setting up a server, Routing, Middleware, and Request/Response handling.", status: "pending" },
        { title: "Week 3: REST API Design", description: "CRUD operations, HTTP verbs, Status codes, and JSON structure.", status: "pending" },
        { title: "Week 4: Database - MongoDB", description: "NoSQL concepts, Schemas (Mongoose), CRUD, and Aggregation.", status: "pending" },
        { title: "Week 5: Authentication", description: "JWT (JSON Web Tokens), Hashing (Bcrypt), and Role-based Access.", status: "pending" },
        { title: "Week 6: SQL Basics (Optional)", description: "PostgreSQL setup, relational tables, and SQL queries.", status: "pending" },
        { title: "Week 7: API Testing", description: "Using Postman/ThunderClient. Writing unit tests with Jest.", status: "pending" },
        { title: "Week 8: Deployment", description: "Deploying to Render/Heroku, Environment variables, and keeping app alive.", status: "pending" }
    ],
    "Full Stack Developer": [
        { title: "Phase 1: Frontend Basics", description: "HTML, CSS, JS, and React (Condensed).", status: "pending" },
        { title: "Phase 2: Backend Basics", description: "Node.js, Express, and Database connection.", status: "pending" },
        { title: "Phase 3: Integration", description: "Fetching API from React (Axios), handling CORS, and displaying data.", status: "pending" },
        { title: "Phase 4: State Management", description: "Context API or Redux for managing global app state.", status: "pending" },
        { title: "Phase 5: Full Deployment", description: "Deploying Client (Vercel) and Server (Render) separately.", status: "pending" }
    ],
    "DevOps Engineer": [
        { title: "Week 1: Linux Fundamentals", description: "Shell commands, File permissions, SSH, and Bash scripting.", status: "pending" },
        { title: "Week 2: Networking Basics", description: "DNS, HTTP/HTTPS, Firewalls, and Load Balancers.", status: "pending" },
        { title: "Week 3: Docker & Containers", description: "Dockerfile, Image creation, Container orchestration.", status: "pending" },
        { title: "Week 4: CI/CD Pipelines", description: "GitHub Actions or Jenkins. Automating testing and deployment.", status: "pending" },
        { title: "Week 5: Cloud Basics (AWS)", description: "EC2 instances, S3 storage, and IAM roles.", status: "pending" }
    ]
};

module.exports = roadmaps;
