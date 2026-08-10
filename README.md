# 🚀 Mini CRM System

A sales-focused Customer Relationship Management (CRM) application designed to help manage sales deals, track pipeline progress, organize tasks, and monitor sales performance from a centralized dashboard.

The application provides multiple views for managing the sales workflow, including dashboard analytics, deal records, Kanban pipeline management, task management, application documentation, and AI-assisted CRM insights.

---

## 📌 Project Overview

The Mini CRM System provides a centralized workspace for managing sales opportunities and monitoring the overall sales pipeline.

It helps users:

- Manage sales deals
- Track pipeline stages
- Monitor sales metrics
- Organize sales activities
- Manage tasks
- Visualize deal progress
- Analyze pipeline performance
- Access AI-assisted CRM insights

---

## ✨ Key Features

### 📊 Sales Pipeline Dashboard

The dashboard provides an overview of important sales metrics and pipeline performance.

- Total Pipeline Value
- Win Rate
- Average Deal Size
- Average Sales Cycle
- Total Leads
- Qualified Leads
- Pipeline Value by Phase
- New Deals Over Time
- All Leads Overview
- Sales performance charts

---

### 📋 Deal Management

The Records section provides a structured interface for managing sales opportunities.

Deal information includes:

- Deal Name
- Company
- Contact
- Email
- Sales Phase
- Deal Value
- Win Percentage
- Lead Source
- Budget
- Sales Representative
- Last Contact
- Next Action
- Close Date
- Deal Actions

Additional functionality includes:

- Create New Deal
- Filter deals by sales phase
- Structured deal table
- Sales opportunity tracking

---

### 🗂️ Kanban Sales Pipeline

The Kanban view provides a visual representation of the sales pipeline.

Deals can be organized across different stages:

```text
NEW
  ↓
QUALIFIED
  ↓
PROPOSAL
  ↓
NEGOTIATION
  ↓
CLOSED
```

Additional stage:

```text
ON HOLD
```

This provides a visual way to monitor the progress of sales opportunities.

---

### ✅ Actions & Task Management

The Actions section provides a task and activity management interface.

Features include:

- Task management
- Task status
- Assigned users
- Completion percentage
- Timeline view
- Gantt-style view
- Table view
- New Task functionality

This helps organize sales-related activities and track their progress.

---

### 📖 App Description

The application includes an App Description section explaining the main CRM workflow.

#### How It Works

**1. Enter Deal Data**

Create and manage sales opportunities through the Records section.

**2. Track Pipeline**

Monitor deals as they move through different sales stages using the Kanban workflow.

**3. Analyze Sales**

Use dashboard metrics and visualizations to monitor pipeline and sales performance.

---

### 🤖 AI Insights

The AI Insights section provides an interface for interacting with **PraxieAI**.

Users can enter CRM-related prompts and request AI-assisted insights related to their sales data and CRM workflow.

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Node.js
- NestJS
- TypeScript

## Database & ORM

- PostgreSQL
- Prisma ORM

## Development Tools

- REST APIs
- Git
- GitHub
- Visual Studio Code

---

# 🏗️ Application Architecture

```text
                    MINI CRM SYSTEM
                           │
              ┌────────────┴────────────┐
              │                         │
          FRONTEND                   BACKEND
              │                         │
       HTML / CSS / JS              NestJS
              │                         │
              │                     REST APIs
              │                         │
              │                       Prisma
              │                         │
              └─────────────────────────┤
                                        │
                                   PostgreSQL
```

---

# 📂 Project Structure

```text
Mini-CRM-System/
│
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── records.html
│   ├── kanban.html
│   ├── actions.html
│   ├── ai.html
│   ├── admin.html
│   ├── app.html
│   ├── style.css
│   │
│   └── js/
│       ├── auth.js
│       ├── dashboard.js
│       ├── leads.js
│       ├── actions.js
│       ├── ai.js
│       ├── record.js
│       └── utils.js
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── leads/
│   │   ├── tasks/
│   │   ├── notes/
│   │   ├── followups/
│   │   └── prisma/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
└── README.md
```

---

# 🔄 Sales Workflow

The CRM follows a structured sales pipeline:

```text
New
 ↓
Qualified
 ↓
Proposal
 ↓
Negotiation
 ↓
Closed
```

Deals can also be placed **On Hold** when required.

---

# 📊 Main Application Sections

| Section | Purpose |
|---|---|
| Dashboard | Sales metrics, pipeline analytics and charts |
| Records | Deal and sales opportunity management |
| Kanban | Visual sales pipeline management |
| Actions | Task and activity management |
| App Description | CRM workflow and feature explanation |
| AI Insights | AI-assisted CRM insights |

---

# 🎯 Project Objectives

The main objectives of this project are to:

- Build a practical CRM application
- Centralize sales opportunity management
- Track deals through different pipeline stages
- Visualize sales performance
- Organize CRM activities and tasks
- Build a modular frontend and backend architecture
- Integrate REST APIs
- Work with PostgreSQL and Prisma
- Explore AI-assisted CRM functionality

---

# 💡 What This Project Demonstrates

This project demonstrates practical experience with:

- Frontend development
- Backend API development
- REST API integration
- CRUD-based application workflows
- Sales pipeline management
- Kanban UI development
- Task management
- Data visualization
- PostgreSQL
- Prisma ORM
- NestJS
- Responsive web interfaces
- AI-assisted application features

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure your environment variables in a `.env` file.

Make sure your PostgreSQL database configuration is correctly set before running the backend.

Generate Prisma client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run start:dev
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

The frontend consists of HTML, CSS and JavaScript files.

You can run the frontend using a local development server such as **VS Code Live Server**.

---

# 🔌 Frontend & Backend Communication

The frontend communicates with the backend through REST API requests.

```text
Frontend
   │
   │ HTTP Requests
   ▼
NestJS REST API
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

---

# 📸 Screenshots

The project includes interfaces for:

- Sales Dashboard
- Deal Records
- Kanban Pipeline
- Actions / Task Management
- App Description
- AI Insights

Screenshots can be added to this section as the project evolves.

Example:

```md
![Dashboard](path/to/dashboard.png)
```

---

# 🔮 Future Improvements

Possible future enhancements include:

- User authentication and registration
- Advanced role-based access control
- Real-time notifications
- Advanced search and filtering
- Email integration
- Automated follow-up reminders
- Detailed sales reports
- Sales activity history
- More AI-powered sales recommendations
- Automated testing
- Production deployment
- CI/CD integration

---

# 👩‍💻 Author

## Khushi Singh

Frontend Developer | JavaScript | React.js | REST APIs

### GitHub

https://github.com/khushi443

### LinkedIn

https://www.linkedin.com/in/khushi-singh-21b05627b

---

# ⭐ Repository

If you find this project useful or interesting, consider giving the repository a ⭐.

---

<div align="center">

### Built with HTML, CSS, JavaScript, NestJS, Prisma & PostgreSQL

**© 2026 Khushi Singh**

</div>
