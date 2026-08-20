<div align="center">

# 🚀 Mini CRM System

### Modern Lead & Customer Relationship Management Platform

Manage leads, sales pipelines, tasks, follow-ups, notes, and CRM insights from one modern and responsive workspace.

<p>

<a href="https://mini-crm-system.onrender.com" target="_blank">
<img src="https://img.shields.io/badge/🚀 Live Demo-Visit Website-success?style=for-the-badge">
</a>

<a href="https://github.com/khushi443/Mini-CRM-System">
<img src="https://img.shields.io/badge/💻 GitHub-Repository-black?style=for-the-badge&logo=github">
</a>

<a href="https://github.com/khushi443/Mini-CRM-System/stargazers">
<img src="https://img.shields.io/github/stars/khushi443/Mini-CRM-System?style=for-the-badge">
</a>

<a href="https://github.com/khushi443/Mini-CRM-System/network/members">
<img src="https://img.shields.io/github/forks/khushi443/Mini-CRM-System?style=for-the-badge">
</a>

<a href="https://github.com/khushi443/Mini-CRM-System/blob/main/LICENSE">
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">
</a>

</p>

</div>

---

# 📖 Overview

**Mini CRM System** is a modern full-stack Customer Relationship Management application designed to help users manage leads, sales pipelines, tasks, follow-ups, notes, and customer activities from a single workspace.

The application combines a responsive dark glassmorphism frontend with a **NestJS REST API**, **Prisma ORM**, and **PostgreSQL** database.

The platform provides secure authentication, user-specific CRM data, lead pipeline management, Kanban workflow, task tracking, follow-up scheduling, dashboard analytics, and data-driven CRM insights.

---

# ✨ Features

### 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- User-specific Data Access
- Authentication State Management
- Logout
- Form Validation
- Password Validation
- Loading & Error States

---

### 👥 Lead Management

- Add New Leads
- View Leads
- Edit Leads
- Delete Leads
- Lead Status Management
- Lead Details
- User-specific Leads
- Persistent Database Storage
- Sales Pipeline Management

---

### 📊 Dashboard

- Total Leads
- New Leads
- Qualified Leads
- Win Rate
- Pending Tasks
- Upcoming Follow-ups
- Leads by Pipeline Stage
- Leads Created Over Time
- Real Database Statistics

---

### 🗂️ Kanban Pipeline

- Visual Sales Pipeline
- Status-based Lead Columns
- Drag & Drop Lead Management
- Lead Status Updates
- Persistent Status Changes
- Easy Sales Workflow

---

### 📋 Task Management

- Create Tasks
- Edit Tasks
- Delete Tasks
- Task Due Dates
- Pending Tasks
- In Progress Tasks
- Completed Tasks
- Overdue Tasks
- Task Status Management
- Persistent Task Data

---

### 📅 Follow-ups

- Schedule Follow-ups
- Select Associated Lead
- Add Follow-up Remarks
- Upcoming Follow-ups
- Overdue Follow-ups
- Completed Follow-ups
- Follow-up Status Tracking
- User-specific Follow-ups

---

### 📝 Lead Notes

- Add Notes to Leads
- View Lead Notes
- Manage Lead Activities
- Protected Notes API
- User Ownership Validation
- Persistent Note Storage

---

### 🤖 CRM Insights

- Pipeline Summary
- Lead Statistics
- Task Insights
- Follow-up Insights
- Priority-based Suggestions
- CRM Activity Analysis
- Real-time CRM Data Analysis

> CRM Insights are generated from the application's own CRM data and do not require an external AI API key.

---

### 🎨 Modern UI/UX

- Dark Glassmorphism Design
- Modern Dashboard
- Gradient Accents
- Glass Cards
- Responsive Navigation
- Animated UI Elements
- Interactive Modals
- Toast Notifications
- Loading States
- Empty States
- Error States
- Responsive Forms
- Modern Native Dropdowns

---

### 📱 Responsive Design

- Desktop Friendly
- Tablet Friendly
- Mobile Responsive
- Responsive Navigation
- Responsive Modals
- Adaptive Layouts

---

# 🛠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, NestJS, TypeScript |
| API | REST API |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| Validation | class-validator |
| Styling | Custom CSS + Glassmorphism |
| Version Control | Git & GitHub |
| Deployment | Render |

---

# 📂 Folder Structure

```text
Mini-CRM-System
│
├── assets
│   └── screenshots
│       ├── 1.png
│       ├── 2.png
│       ├── 3.png
│       ├── 4.png
│       ├── 5.png
│       ├── 6.png
│       └── 7.png
│
├── backend
│   │
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   │
│   ├── src
│   │   ├── ai
│   │   ├── auth
│   │   ├── leads
│   │   ├── tasks
│   │   ├── notes
│   │   ├── followups
│   │   ├── prisma
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   │
│   ├── js
│   │   ├── ai.js
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── config.js
│   │   ├── dashboard.js
│   │   ├── followups.js
│   │   ├── kanban.js
│   │   ├── leads.js
│   │   ├── nav-shell.js
│   │   ├── shell.js
│   │   └── toast.js
│   │
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── leads.html
│   ├── kanban.html
│   ├── actions.html
│   ├── followups.html
│   └── style.css
│
└── README.md

---

🔒 Security

The application implements:

JWT Authentication
Password Hashing with bcrypt
Protected API Routes
User Ownership Validation
User-specific Database Queries
Server-side Validation
Environment Variables for Secrets
Protected CRM Resources
🚀 Deployment
Frontend / Application

Hosted using:

Render

Backend

NestJS REST API

Database

PostgreSQL

Source Code

GitHub

Repository:

https://github.com/khushi443/Mini-CRM-System

Live Application:

https://mini-crm-system.onrender.com

🎯 Future Improvements
Email Notifications
Advanced CRM Analytics
Role-based Access Control
Team Workspaces
CSV Import / Export
Advanced Search & Filtering
Activity Timeline
Calendar Integration
Automated Reminders
Advanced AI-powered CRM Insights
API Documentation with Swagger
Automated Testing
🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
git checkout -b feature/NewFeature
3. Commit your changes
git commit -m "Added new feature"
4. Push your branch
git push origin feature/NewFeature
5. Open a Pull Request
👩‍💻 Developer

Khushi Singh

🌐 Portfolio

https://khushi443.github.io/khushi-portfolio/

💼 LinkedIn

https://www.linkedin.com/in/khushisingh-bca/

💻 GitHub

https://github.com/khushi443

⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

<div align="center">
🚀 Manage • Track • Convert • Grow

Made with ❤️ by Khushi Singh

</div> ```