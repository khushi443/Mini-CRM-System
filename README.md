<div align="center">

# 🚀 Mini CRM System

### Modern Lead & Customer Relationship Management Platform

Manage leads, tasks, follow-ups, notes, and sales activities with a modern, responsive CRM workspace powered by NestJS, Prisma, and PostgreSQL.

<p>

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

**Mini CRM System** is a modern full-stack Customer Relationship Management application designed to help users manage leads, tasks, follow-ups, notes, and sales activities from a single workspace.

The application combines a responsive dark glassmorphism frontend with a **NestJS REST API**, **Prisma ORM**, and **PostgreSQL** database.

It includes secure authentication, user-specific data access, lead pipeline management, task tracking, follow-up scheduling, Kanban workflow, dashboard insights, and an AI Insights feature based on actual CRM data.

---

# ✨ Features

### 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- User Profile
- Logout
- Authentication State Management
- Form Validation
- Password Strength Validation
- Loading States & Toast Notifications

---

### 👥 Lead Management

- Create Leads
- View Leads
- Edit Leads
- Delete Leads
- Lead Status Management
- Lead Details
- User-specific Lead Access
- Persistent PostgreSQL Data
- Lead Pipeline Management

---

### 📊 Dashboard

- Total Leads Overview
- Lead Status Statistics
- Task Statistics
- Follow-up Statistics
- CRM Pipeline Overview
- Real Database Data
- Interactive Dashboard Cards

---

### 📋 Task Management

- Create Tasks
- Edit Tasks
- Delete Tasks
- Task Due Dates
- Pending Tasks
- Completed Tasks
- Task Status Management
- Persistent Task Data
- ISO 8601 Date Validation

---

### 📅 Follow-ups

- Schedule Follow-ups
- Select Associated Lead
- Add Follow-up Remarks
- Upcoming Follow-ups
- Overdue Follow-ups
- Completed Follow-ups
- Follow-up Status Tracking
- User-specific Follow-up Access

---

### 📝 Notes

- Add Notes to Leads
- View Lead Notes
- Manage Lead Activities
- Protected Notes API
- User Ownership Validation

---

### 🗂️ Kanban Board

- Visual Lead Pipeline
- Status-based Lead Columns
- Drag & Drop Workflow
- Lead Status Updates
- Persistent Status Changes
- Easy Sales Pipeline Management

---

### 🤖 AI Insights

- CRM Pipeline Summary
- Lead Statistics
- Task Insights
- Follow-up Insights
- Priority-based CRM Suggestions
- Real-time Data Analysis
- Authenticated AI Insights Endpoint
- No External AI API Key Required

> AI Insights are generated from actual CRM data. The system avoids inventing information that is not available in the database.

---

### 🎨 Modern UI/UX

- Dark Glassmorphism Design
- Responsive Layout
- Modern Dashboard
- Animated UI Elements
- Gradient Accents
- Glass Cards
- Modal Dialogs
- Toast Notifications
- Loading States
- Empty States
- Error States
- Dark Native Dropdowns
- Responsive Navigation

---

### 📱 Responsive Design

- Desktop Friendly
- Tablet Friendly
- Mobile Responsive
- Responsive Modals
- Adaptive Navigation
- Flexible Dashboard Layout

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
| Development | VS Code |
| Version Control | Git & GitHub |

---

# 📂 Folder Structure

```text
Mini-CRM-System
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
