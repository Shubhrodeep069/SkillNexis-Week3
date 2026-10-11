# SkillNexis Internship — Week 3 Projects

A collection of full-stack web development projects built as part of my **SkillNexis Internship – Week 3**. This repository demonstrates frontend-backend integration, user authentication, task management, and image uploading.

## 🚀 Projects

### 1. Full-Stack To-Do Application

A task management application that allows authenticated users to organize and manage their daily tasks.

**Features**
- User authentication and protected routes
- Create, view, update, and delete tasks
- Task completion status management
- User-specific task management
- React frontend integrated with a REST API

**Technologies:** React, JavaScript, Node.js, Express.js, MongoDB, Mongoose, JWT, Axios

### 2. Image Upload System

A web-based image upload application that allows users to select, preview, and upload images.

**Features**
- Select and preview images before uploading
- Upload images using Multer
- Store uploaded files on the backend
- Display uploaded images in a gallery
- Validate supported image formats and file size
- Support for JPEG, PNG, WEBP, and GIF images
- Maximum file size: 5 MB

**Technologies:** React, JavaScript, Node.js, Express.js, Multer, Axios, HTML, CSS

## 🛠️ Tools and Technologies

- **Frontend:** React, JavaScript, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Token (JWT)
- **File Upload:** Multer
- **API Integration:** REST API, Axios
- **Development Tools:** Visual Studio Code, npm, Git, GitHub

## 📁 Project Structure

```text
skillnexis-week3/
├── todo-backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── todo-frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
└── README.md
```

*Note: The structure above highlights the main folders and files. Some files may vary depending on the final project setup.*

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB connection
- Git

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd skillnexis-week3
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository URL.

### Step 2: Configure the Backend

```bash
cd todo-backend
npm install
```

Create a `.env` file inside `todo-backend` and configure your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
```

Use the exact environment variable names required by your backend code. Never commit real credentials or secret keys to GitHub.

Start the backend:

```bash
npm start
```

If no `start` script is configured, use:

```bash
node server.js
```

### Step 3: Start the Frontend

Open a new terminal:

```bash
cd todo-frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

### Step 4: Use the Applications

1. Register a user account and log in.
2. Create, update, complete, and delete tasks in the To-Do application.
3. Open the Image Studio page.
4. Select an image and preview it.
5. Upload the image and view it in the gallery.

The backend runs on `http://localhost:5000` by default.

## 🎯 Learning Outcomes

Through these projects, I practised:

- Building full-stack web applications
- Connecting React frontends with Express REST APIs
- Implementing JWT-based authentication
- Performing CRUD operations with MongoDB
- Handling image uploads using Multer
- Implementing file validation and image previews
- Organizing frontend and backend code
- Testing and debugging API integration

## 👨‍💻 Internship

**Organization:** SkillNexis  
**Program:** Web Development Internship  
**Week:** 3

This repository contains the projects developed to practise full-stack development and backend integration as part of the internship assignments.

---

⭐ Thank you for visiting this repository!